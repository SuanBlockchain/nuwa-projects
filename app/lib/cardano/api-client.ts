import type { WalletListResponse, CreateWalletRequest, ImportWalletRequest, UnlockWalletRequest, WalletResponse, JWTTokenResponse } from './types';

const BASE_URL = process.env.CARDANO_API_URL;
const API_KEY = process.env.CARDANO_API_KEY;

export class CardanoAPIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'CardanoAPIError';
  }
}

async function fetchCardanoAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('x-api-key', API_KEY!);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new CardanoAPIError(response.status, error.detail || 'API request failed');
  }

  return response.json();
}

export const cardanoAPI = {
  wallets: {
    list: () => fetchCardanoAPI<WalletListResponse>('/api/v1/wallets/'),
    create: (data: CreateWalletRequest) =>
      fetchCardanoAPI<WalletResponse>('/api/v1/wallets/create', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    import: (data: ImportWalletRequest) =>
      fetchCardanoAPI<WalletResponse>('/api/v1/wallets/import', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    unlock: (data: UnlockWalletRequest) =>
      fetchCardanoAPI<JWTTokenResponse>(`/api/v1/wallets/${data.wallet_id}/unlock`, {
        method: 'POST',
        body: JSON.stringify({ password: data.password }),
      }),
    lock: (walletId: string) =>
      fetchCardanoAPI<{ message: string }>(`/api/v1/wallets/${walletId}/lock`, {
        method: 'POST',
      }),
    delete: (walletId: string) =>
      fetchCardanoAPI<{ message: string }>(`/api/v1/wallets/${walletId}`, {
        method: 'DELETE',
      }),
  },
};
