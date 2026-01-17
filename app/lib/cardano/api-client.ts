import type { WalletListResponse, CreateWalletRequest, ImportWalletRequest, UnlockWalletRequest, WalletResponse, JWTTokenResponse, ListSessionsResponse, RevokeSessionResponse, HeartbeatResponse, BackendBalanceResponse, StoreSessionPasswordRequest, StoreSessionPasswordResponse, AutoUnlockResponse, ListAutoUnlockSessionsResponse, RevokeAutoUnlockSessionResponse, ChangePasswordResponse } from './types';
import type { BuildTransactionRequest, BuildTransactionResponse, SignAndSubmitRequest, SignAndSubmitResponse } from './transaction-types';
import { getWalletSession, getCoreWalletSession, setWalletSession, clearWalletSession, isTokenExpired, type WalletSession } from './jwt-manager';

const BASE_URL = process.env.CARDANO_API_URL;
const API_KEY = process.env.CARDANO_API_KEY;

export class CardanoAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'CardanoAPIError';
  }
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;      // For unlock endpoint
  requireCore?: boolean;   // For promote endpoint
  retryCount?: number;     // Internal retry tracking
}

/**
 * Refreshes the access token using the refresh token
 */
async function refreshWalletToken(refreshToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/wallets/token/refresh`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const tokenResponse = await response.json();
      const session = await getWalletSession();

      if (session) {
        // Update session with new access token and metadata
        await setWalletSession({
          ...tokenResponse,
          wallet_id: session.wallet_id,
          wallet_name: session.wallet_name,
          wallet_role: session.wallet_role,
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

async function fetchCardanoAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth, requireCore, retryCount = 0, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set('x-api-key', API_KEY!);
  headers.set('Content-Type', 'application/json');

  // Step 1: Get session if not skipping auth
  if (!skipAuth) {
    const session: WalletSession | null = requireCore
      ? await getCoreWalletSession()
      : await getWalletSession();

    if (session) {
      // Check expiration
      if (isTokenExpired(session)) {
        // Try to refresh token
        const refreshed = await refreshWalletToken(session.refresh_token);
        if (refreshed && retryCount === 0) {
          // Retry request with new token
          return fetchCardanoAPI<T>(endpoint, {
            ...options,
            retryCount: retryCount + 1,
          });
        }
        // Refresh failed - clear session
        await clearWalletSession();
        throw new CardanoAPIError(401, 'Session expired. Please unlock wallet again.');
      }

      // Add Bearer token
      headers.set('Authorization', `Bearer ${session.access_token}`);
    } else if (requireCore) {
      // CORE wallet required but not unlocked
      throw new CardanoAPIError(403, 'Please unlock a CORE wallet to perform this operation');
    }
  }

  // Step 2: Make request
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Step 3: Handle 401 responses (token might be invalid)
  if (response.status === 401 && retryCount === 0 && !skipAuth) {
    const session = await getWalletSession();
    if (session) {
      // Try refresh once
      const refreshed = await refreshWalletToken(session.refresh_token);
      if (refreshed) {
        return fetchCardanoAPI<T>(endpoint, {
          ...options,
          retryCount: retryCount + 1,
        });
      }
    }
    await clearWalletSession();
    throw new CardanoAPIError(401, 'Authentication failed. Please unlock wallet again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));

    // Handle detail being an object (e.g., validation errors)
    let errorMessage = 'API request failed';
    if (typeof error.detail === 'string') {
      errorMessage = error.detail;
    } else if (error.detail && typeof error.detail === 'object') {
      // If detail is an object, try to extract meaningful error message
      if (Array.isArray(error.detail)) {
        // Validation errors are often arrays
        errorMessage = error.detail.map((e: any) => e.msg || e.message || JSON.stringify(e)).join(', ');
      } else {
        errorMessage = JSON.stringify(error.detail);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new CardanoAPIError(response.status, errorMessage);
  }

  return response.json();
}

export const cardanoAPI = {
  wallets: {
    list: () =>
      fetchCardanoAPI<WalletListResponse>('/api/v1/wallets/'),

    create: (data: CreateWalletRequest) =>
      fetchCardanoAPI<WalletResponse>('/api/v1/wallets/create', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,  // Don't require auth for wallet creation
      }),

    import: (data: ImportWalletRequest) =>
      fetchCardanoAPI<WalletResponse>('/api/v1/wallets/import', {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,  // Don't require auth for wallet import
      }),

    unlock: (data: UnlockWalletRequest) =>
      fetchCardanoAPI<JWTTokenResponse>(`/api/v1/wallets/${data.wallet_id}/unlock`, {
        method: 'POST',
        body: JSON.stringify({ password: data.password }),
        skipAuth: true,  // Don't require auth for unlock
      }),

    lock: (walletId: string) =>
      fetchCardanoAPI<{ message: string }>(`/api/v1/wallets/${walletId}/lock`, {
        method: 'POST',
      }),

    delete: (walletId: string, password: string) =>
      fetchCardanoAPI<{ message: string }>(`/api/v1/wallets/${walletId}`, {
        method: 'DELETE',
        body: JSON.stringify({ password }),
      }),

    promote: (walletId: string) =>
      fetchCardanoAPI<{ message: string }>(`/api/v1/wallets/${walletId}/promote`, {
        method: 'PUT',  // Changed from POST to PUT as per API schema
        requireCore: true,  // Requires CORE wallet token
      }),

    revoke: () =>
      fetchCardanoAPI<{ message: string }>('/api/v1/wallets/token/revoke', {
        method: 'POST',
      }),

    // Session management endpoints (new session-based locking)
    getSessions: (walletId: string) =>
      fetchCardanoAPI<ListSessionsResponse>(`/api/v1/wallets/${walletId}/sessions`, {
        method: 'GET',
      }),

    revokeSession: (walletId: string, jti: string) =>
      fetchCardanoAPI<RevokeSessionResponse>(`/api/v1/wallets/${walletId}/sessions/${jti}`, {
        method: 'DELETE',
      }),

    heartbeat: (walletId: string) =>
      fetchCardanoAPI<HeartbeatResponse>(`/api/v1/wallets/${walletId}/heartbeat`, {
        method: 'POST',
      }),

    getBalance: (walletId: string) =>
      fetchCardanoAPI<BackendBalanceResponse>(`/api/v1/wallets/${walletId}/balance`, {
        method: 'GET',
      }),

    // Auto-unlock session management
    storeSessionPassword: (walletId: string, data: StoreSessionPasswordRequest) =>
      fetchCardanoAPI<StoreSessionPasswordResponse>(`/api/v1/wallets/${walletId}/session/store`, {
        method: 'POST',
        body: JSON.stringify(data),
        skipAuth: true,  // Password verification happens in backend
      }),

    autoUnlock: (walletId: string, sessionKey: string, frontendSessionId: string) => {
      const headers = new Headers();
      headers.set('X-Session-Key', sessionKey);
      headers.set('X-Frontend-Session-ID', frontendSessionId);

      return fetchCardanoAPI<AutoUnlockResponse>(`/api/v1/wallets/${walletId}/auto-unlock`, {
        method: 'POST',
        headers,
        skipAuth: true,  // This endpoint creates the session
      });
    },

    listAutoUnlockSessions: (walletId: string) =>
      fetchCardanoAPI<ListAutoUnlockSessionsResponse>(`/api/v1/wallets/${walletId}/sessions/auto-unlock`, {
        method: 'GET',
      }),

    revokeAutoUnlockSession: (walletId: string, sessionId: string) =>
      fetchCardanoAPI<RevokeAutoUnlockSessionResponse>(`/api/v1/wallets/${walletId}/sessions/auto-unlock/${sessionId}`, {
        method: 'DELETE',
      }),

    changePassword: (walletId: string, currentPassword: string, newPassword: string) =>
      fetchCardanoAPI<ChangePasswordResponse>(`/api/v1/wallets/${walletId}/change-password`, {
        method: 'POST',
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword
        }),
      }),

    getUtxos: (walletId: string, addressIndex?: number, minAda?: number) => {
      const params = new URLSearchParams();
      if (addressIndex !== undefined) params.append('address_index', addressIndex.toString());
      if (minAda !== undefined) params.append('min_ada', minAda.toString());
      const queryString = params.toString() ? `?${params.toString()}` : '';

      return fetchCardanoAPI<any>(`/api/v1/wallets/${walletId}/utxos${queryString}`, {
        method: 'GET',
      });
    },
  },

  transactions: {
    build: (data: BuildTransactionRequest) =>
      fetchCardanoAPI<BuildTransactionResponse>('/api/v1/transactions/build', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    signAndSubmit: (data: SignAndSubmitRequest) =>
      fetchCardanoAPI<SignAndSubmitResponse>('/api/v1/transactions/sign-and-submit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
