'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWalletSchema } from '@/app/lib/cardano/validation';
import { useWallets } from '@/app/hooks/use-wallets';
import type { z } from 'zod';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type CreateWalletFormData = z.infer<typeof createWalletSchema>;

export default function CreateWalletForm() {
  const { createWallet, loading } = useWallets();
  const [createdMnemonic, setCreatedMnemonic] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWalletFormData>({
    resolver: zodResolver(createWalletSchema),
  });

  const onSubmit = async (data: CreateWalletFormData) => {
    try {
      const wallet = await createWallet(data);
      if (wallet.mnemonic) {
        setCreatedMnemonic(wallet.mnemonic);
      }
    } catch {
      // Error handled by hook
    }
  };

  if (createdMnemonic) {
    return (
      <div className="max-w-2xl">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">
                Save Your Recovery Phrase
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                Write down these 24 words in order and store them safely. You&apos;ll need them to recover your wallet.
              </p>
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 font-mono text-sm">
                {createdMnemonic}
              </div>
            </div>
          </div>
        </div>
        <a
          href="/blockchain/wallets"
          className="inline-block px-6 py-3 bg-mint-9 hover:bg-mint-10 text-white rounded-lg transition-colors"
        >
          Go to Wallets
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Wallet Name
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
          placeholder="My Cardano Wallet"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
          placeholder="Enter a strong password"
        />
        {errors.password ? (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Must be 8-128 characters and include at least one digit
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
          placeholder="Re-enter password"
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-mint-9 hover:bg-mint-10 text-white rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? 'Creating Wallet...' : 'Create Wallet'}
      </button>
    </form>
  );
}
