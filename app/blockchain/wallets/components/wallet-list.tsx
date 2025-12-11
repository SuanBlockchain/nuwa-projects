'use client';

import { useEffect } from 'react';
import { useWallets } from '@/app/hooks/use-wallets';
import WalletCard from './wallet-card';
import { WalletIcon } from '@heroicons/react/24/outline';

export default function WalletList() {
  const { wallets, loading, error, fetchWallets } = useWallets();

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-9"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-12">
        <WalletIcon className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
        <p className="text-zinc-600 dark:text-zinc-400">No wallets found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.id} wallet={wallet} />
      ))}
    </div>
  );
}
