// Transaction metadata types
export type MetadataMode = 'json' | 'text' | 'none';

// Build transaction request
export interface BuildTransactionRequest {
  to_address: string;
  amount_ada: number;
  metadata?: Record<string, any>; // Cardano metadata format (e.g., { "msg": "text" } or any valid metadata JSON)
  from_address_index?: number;
}

// Build transaction response
export interface BuildTransactionResponse {
  transaction_id: string;
  tx_cbor: string;
  tx_hash: string;
  from_address: string;
  to_address: string;
  amount_lovelace: number;
  fee_lovelace: number;
  total_lovelace: number;
  metadata?: object;
  created_at: string;
}

// Sign and submit request
export interface SignAndSubmitRequest {
  transaction_id: string;
  password: string;
}

// Sign and submit response
export interface SignAndSubmitResponse {
  tx_hash: string;
  status: 'SUBMITTED';
  signed_at: string;
  submitted_at: string;
  explorer_url: string;
}

// Transaction wizard step type
export type TransactionStep = 'build' | 'sign' | 'submit';
