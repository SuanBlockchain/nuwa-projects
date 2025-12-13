'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createWalletSchema } from '@/app/lib/cardano/validation';
import { useWallets } from '@/app/hooks/use-wallets';
import type { z } from 'zod';

type CreateWalletFormData = z.infer<typeof createWalletSchema>;

export default function CreateWalletForm() {
  const { createWallet, loading } = useWallets();
  const router = useRouter();

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

      // Store wallet creation data in sessionStorage
      sessionStorage.setItem('wallet_creation_data', JSON.stringify({
        wallet_id: wallet.wallet_id,
        name: wallet.name,
        mnemonic: wallet.mnemonic,
        enterprise_address: wallet.enterprise_address,
        staking_address: wallet.staking_address,
        network: wallet.network,
        created_at: wallet.created_at,
      }));

      // Redirect to success page
      router.push('/blockchain/wallets/success');
    } catch {
      // Error handled by hook
    }
  };

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
