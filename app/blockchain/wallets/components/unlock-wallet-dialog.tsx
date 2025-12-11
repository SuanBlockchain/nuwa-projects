'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Wallet } from '@/app/lib/cardano/types';
import { useWallets } from '@/app/hooks/use-wallets';

interface UnlockWalletDialogProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UnlockWalletDialog({ wallet, open, onOpenChange }: UnlockWalletDialogProps) {
  const [password, setPassword] = useState('');
  const { unlockWallet, loading } = useWallets();

  const handleUnlock = async () => {
    try {
      await unlockWallet(wallet.id, password);
      setPassword('');
      onOpenChange(false);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            Unlock Wallet
          </Dialog.Title>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Enter password to unlock {wallet.name}
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg mb-4 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleUnlock}
              disabled={loading || !password}
              className="px-4 py-2 bg-mint-9 hover:bg-mint-10 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Unlocking...' : 'Unlock'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
