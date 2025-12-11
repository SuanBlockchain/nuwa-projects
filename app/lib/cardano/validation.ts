import { z } from 'zod';

export const createWalletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').max(50),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[0-9]/, 'Password must contain at least one digit'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const importWalletSchema = z.object({
  name: z.string().min(1, 'Wallet name is required').max(50),
  mnemonic: z.string()
    .min(1, 'Mnemonic is required')
    .refine((val) => val.trim().split(/\s+/).length === 24, {
      message: 'Mnemonic must be exactly 24 words',
    }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[0-9]/, 'Password must contain at least one digit'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const unlockWalletSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});
