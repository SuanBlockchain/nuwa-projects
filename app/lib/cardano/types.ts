export interface Wallet {
  id: string;
  name: string;
  network: string;
  enterprise_address: string;
  is_default?: boolean;
  role: string;
  is_locked: boolean;
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
  expires_at: number;
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
