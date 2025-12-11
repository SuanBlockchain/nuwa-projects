export interface Wallet {
  id: string;
  name: string;
  network: string;
  enterprise_address: string;
  is_default?: boolean;
  role: string;
  is_locked: boolean;
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
  id: string;
  name: string;
  address?: string;
  mnemonic?: string; // Only returned on create/import
  is_locked: boolean;
}

export interface JWTTokenResponse {
  access_token: string;
  token_type: string;
}
