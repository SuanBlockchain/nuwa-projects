'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { Wallet } from '@/app/lib/cardano/types';
import { useWallets } from '@/app/hooks/use-wallets';
import { getSessionKey, clearSessionKey, hasAutoUnlock } from '@/app/lib/cardano/session-key-manager';

interface UnlockWalletDialogProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function UnlockWalletDialog({ wallet, open, onOpenChange, onSuccess }: UnlockWalletDialogProps) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [attemptingAutoUnlock, setAttemptingAutoUnlock] = useState(false);
  const { unlockWallet, loading, error } = useWallets();

  // Attempt auto-unlock when dialog opens
  useEffect(() => {
    if (open) {
      const autoUnlockData = getSessionKey(wallet.id);

      if (autoUnlockData) {
        // Check if session is not expired
        if (new Date(autoUnlockData.expiresAt) > new Date()) {
          // Attempt auto-unlock
          attemptAutoUnlock();
          return;
        } else {
          // Clear expired session
          clearSessionKey(wallet.id);
        }
      }

      // Fall back to password prompt
      setShowPasswordInput(true);
    } else {
      // Reset state when dialog closes
      setShowPasswordInput(false);
      setAttemptingAutoUnlock(false);
      setLocalError(null);
      setPassword('');
    }
  }, [open, wallet.id]);

  const attemptAutoUnlock = async () => {
    setAttemptingAutoUnlock(true);
    setLocalError(null);

    try {
      const sessionData = getSessionKey(wallet.id);

      if (!sessionData) {
        throw new Error('No session data found');
      }

      const { sessionKey, frontendSessionId } = sessionData;

      // Call auto-unlock API route (which handles session storage server-side)
      const response = await fetch('/api/blockchain/wallets/auto-unlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_id: wallet.id,
          session_key: sessionKey,
          frontend_session_id: frontendSessionId,
        }),
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Auto-unlock failed');
      }

      // Success - close dialog
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Auto-unlock failed:', err);

      // Clear invalid session key
      clearSessionKey(wallet.id);

      // Show password input
      setShowPasswordInput(true);
      setLocalError('Auto-unlock failed. Please enter your password.');
    } finally {
      setAttemptingAutoUnlock(false);
    }
  };

  const handleUnlock = async () => {
    setLocalError(null);
    try {
      await unlockWallet(wallet.id, password);
      setPassword('');
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      // Error is set in the hook's error state
      setLocalError(err instanceof Error ? err.message : 'Failed to unlock wallet');
    }
  };

  const handleDisableAutoUnlock = () => {
    clearSessionKey(wallet.id);
    setLocalError(null);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">
            Unlock Wallet
          </Dialog.Title>

          {/* Auto-unlock Loading State */}
          {attemptingAutoUnlock ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-center">
                Auto-unlocking {wallet.name}...
              </p>
            </div>
          ) : showPasswordInput ? (
            <>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Enter password to unlock {wallet.name}
              </p>

              {/* Error Display */}
              {(localError || error) && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {localError || error}
                  </p>
                </div>
              )}

              {/* Auto-unlock Status */}
              {hasAutoUnlock(wallet.id) && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary" />
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      Auto-unlock is enabled
                    </p>
                  </div>
                  <button
                    onClick={handleDisableAutoUnlock}
                    className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline"
                  >
                    Disable
                  </button>
                </div>
              )}

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && password && handleUnlock()}
                placeholder="Password"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg mb-4 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white"
                autoFocus
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
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
