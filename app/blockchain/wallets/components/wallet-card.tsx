'use client';

import { useState } from 'react';
import type { Wallet } from '@/app/lib/cardano/types';
import UnlockWalletDialog from './unlock-wallet-dialog';
import DeleteWalletDialog from './delete-wallet-dialog';
import { useWallets } from '@/app/hooks/use-wallets';
import { WalletIcon } from '@heroicons/react/24/outline';

interface WalletCardProps {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { lockWallet } = useWallets();

  return (
    <>
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-mint-9" />
            <h3 className="font-semibold text-zinc-900 dark:text-white">{wallet.name}</h3>
          </div>
          <span className={`px-2 py-1 text-xs rounded ${
            wallet.is_locked
              ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
          }`}>
            {wallet.is_locked ? 'Locked' : 'Unlocked'}
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 truncate" title={wallet.enterprise_address}>
          {wallet.enterprise_address}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-zinc-500 dark:text-zinc-500">
            {wallet.network}
          </span>
          {wallet.is_default && (
            <span className="text-xs bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200 px-2 py-0.5 rounded">
              Default
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {wallet.is_locked ? (
            <button
              onClick={() => setShowUnlock(true)}
              className="flex-1 px-3 py-2 bg-mint-9 hover:bg-mint-10 text-white rounded text-sm transition-colors"
            >
              Unlock
            </button>
          ) : (
            <button
              onClick={() => lockWallet(wallet.id)}
              className="flex-1 px-3 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded text-sm transition-colors"
            >
              Lock
            </button>
          )}
          <button
            onClick={() => setShowDelete(true)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <UnlockWalletDialog
        wallet={wallet}
        open={showUnlock}
        onOpenChange={setShowUnlock}
      />

      <DeleteWalletDialog
        wallet={wallet}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  );
}
