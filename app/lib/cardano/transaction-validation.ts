import { z } from 'zod';

// Cardano address validation regex (supports both mainnet and testnet)
const CARDANO_ADDRESS_REGEX = /^(addr1|addr_test1)[a-z0-9]{53,}$/;

// Build transaction form schema
export const buildTransactionSchema = z.object({
  to_address: z.string()
    .min(1, 'Destination address is required')
    .regex(CARDANO_ADDRESS_REGEX, 'Invalid Cardano address format'),

  amount_ada: z.number()
    .positive('Amount must be positive')
    .min(1, 'Minimum transaction is 1 ADA'),

  metadata_mode: z.enum(['json', 'text', 'none']),
  text_message: z.string().optional(),
  json_data: z.string().optional(),
  from_address_index: z.number().optional(),
}).refine(
  (data) => {
    // If metadata_mode is 'text', text_message must be provided
    if (data.metadata_mode === 'text') {
      return data.text_message && data.text_message.trim().length > 0;
    }
    return true;
  },
  {
    message: 'Text message is required when using text metadata mode',
    path: ['text_message'],
  }
).refine(
  (data) => {
    // If metadata_mode is 'json', json_data must be provided and valid JSON
    if (data.metadata_mode === 'json') {
      if (!data.json_data || data.json_data.trim().length === 0) {
        return false;
      }
      try {
        JSON.parse(data.json_data);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Valid JSON data is required when using JSON metadata mode',
    path: ['json_data'],
  }
);

// Sign transaction form schema
export const signTransactionSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  transaction_id: z.string().min(1, 'Transaction ID is required'),
});

// Type inference from schemas
export type BuildTransactionFormData = z.infer<typeof buildTransactionSchema>;
export type SignTransactionFormData = z.infer<typeof signTransactionSchema>;
