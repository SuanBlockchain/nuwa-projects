export interface Wallet {
  id: string;
  name: string;
  network: string;
  enterprise_address: string;
  is_default?: boolean;
  role: string;
  is_locked: boolean;
  balance_lovelace?: number; // Optional: may not be loaded yet
  balance_last_updated?: string; // Timestamp of last balance fetch
  owner?: {
    userId: string;
    userName: string | null;
    userEmail: string | null;
    userRole: string;
  } | null;
}

export interface WalletListResponse {
  wallets: Wallet[];
  total: number;
  default_wallet: string | null;
}

export interface CreateWalletRequest {
  name: string;
  password: string;
}

export interface ImportWalletRequest {
  name: string;
  mnemonic: string;
  password: string;
}

export interface UnlockWalletRequest {
  wallet_id: string;
  password: string;
}

export interface WalletResponse {
  wallet_id: string;
  name: string;
  network: string;
  role: string;
  enterprise_address: string;
  staking_address?: string;
  mnemonic?: string; // Only returned on create/import
  is_locked?: boolean;
  created_at?: string;
}

export interface JWTTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number | string; // Can be Unix timestamp or ISO string from backend
  wallet_id: string;
  wallet_name: string;
  wallet_role: string;
}

export interface WalletSessionState {
  isUnlocked: boolean;
  walletId: string | null;
  walletName: string | null;
  walletRole: string | null;
  expiresAt: number | null;
  hasCoreWallet: boolean;
}

export interface DeleteWalletRequest {
  password: string;
}

export interface ChangePasswordRequest {
  wallet_id: string;
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Session management types (new session-based locking)
export interface SessionInfo {
  jti: string;
  session_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  client_fingerprint: string | null;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export interface ListSessionsResponse {
  wallet_id: string;
  wallet_name: string;
  sessions: SessionInfo[];
  total: number;
}

export interface RevokeSessionResponse {
  success: boolean;
  message: string;
  jti: string;
  session_name: string | null;
}

export interface HeartbeatResponse {
  success: boolean;
  message: string;
  session_valid: boolean;
  expires_at?: string;
  time_remaining_seconds?: number;
}

// Backend wallet balance response (from Cardano API)
export interface BackendBalanceResponse {
  wallet_name: string;
  balances: {
    main_addresses: {
      enterprise: {
        address: string;
        balance_lovelace: number;
        balance_ada: number;
      };
      staking: {
        address: string;
        balance_lovelace: number;
        balance_ada: number;
      };
    };
    derived_addresses: any[];
    total_balance_lovelace: number;
    total_balance_ada: number;
  };
  checked_at: string;
}

// Wallet balance response (transformed for frontend)
export interface WalletBalanceResponse {
  wallet_id: string;
  balance_lovelace: number;
  available_lovelace: number;
  timestamp: string;
}

// Auto-unlock session management types
export interface StoreSessionPasswordRequest {
  user_id: string;
  password: string;
  session_key: string;
  frontend_session_id: string;
  expires_hours: number;
}

export interface StoreSessionPasswordResponse {
  success: boolean;
  message: string;
  expires_at: string;
}

export interface AutoUnlockResponse {
  success: boolean;
  wallet_id: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  wallet_name: string;
  wallet_role: string;
}

export interface AutoUnlockSession {
  session_id: string;
  frontend_session_id: string;
  user_id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  expires_at: string;
  is_current: boolean;
}

export interface ListAutoUnlockSessionsResponse {
  wallet_id: string;
  sessions: AutoUnlockSession[];
  total: number;
}

export interface RevokeAutoUnlockSessionResponse {
  success: boolean;
  message: string;
  session_id: string;
}
