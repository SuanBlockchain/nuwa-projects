'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import type { Wallet } from '@/app/lib/cardano/types';
import { useWallets } from '@/app/hooks/use-wallets';

interface DeleteWalletDialogProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export default function DeleteWalletDialog({ wallet, open, onOpenChange, onDeleted }: DeleteWalletDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { deleteWallet, loading } = useWallets();
  const router = useRouter();

  const handleDelete = async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    setError(null);
    try {
      await deleteWallet(wallet.id, password);
      setPassword('');
      onOpenChange(false);
      // Trigger parent refresh
      onDeleted?.();
      // Force refresh the page data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete wallet');
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            Delete Wallet
          </Dialog.Title>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Are you sure you want to delete <strong>{wallet.name}</strong>? This action cannot be undone.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Enter wallet password to confirm
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && password) {
                  handleDelete();
                }
              }}
              placeholder="Password"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || !password}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Wallet'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
