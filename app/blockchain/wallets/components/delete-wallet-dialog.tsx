'use client';

import * as Dialog from '@radix-ui/react-dialog';
import type { Wallet } from '@/app/lib/cardano/types';
import { useWallets } from '@/app/hooks/use-wallets';

interface DeleteWalletDialogProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteWalletDialog({ wallet, open, onOpenChange }: DeleteWalletDialogProps) {
  const { deleteWallet, loading } = useWallets();

  const handleDelete = async () => {
    try {
      await deleteWallet(wallet.id);
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
            Delete Wallet
          </Dialog.Title>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Are you sure you want to delete {wallet.name}? This action cannot be undone.
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
