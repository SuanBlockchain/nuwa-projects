'use client';

import { useEffect, useRef } from 'react';
import { useWallets } from '@/app/hooks/use-wallets';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import WalletCard from './wallet-card';
import { WalletIcon } from '@heroicons/react/24/outline';
import { hasAutoUnlock, getSessionKey } from '@/app/lib/cardano/session-key-manager';

export default function WalletList() {
  const { wallets, loading, error, fetchWallets } = useWallets();
  const { isUnlocked, walletName, walletRole, refreshSession } = useWalletSession();
  const autoUnlockAttempted = useRef(false);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // Auto-unlock wallet on page load if auto-unlock is enabled
  useEffect(() => {
    const attemptAutoUnlock = async () => {
      // Skip if already attempted, loading, or already unlocked
      if (autoUnlockAttempted.current || loading || isUnlocked || wallets.length === 0) {
        return;
      }

      autoUnlockAttempted.current = true;

      // Find wallet with auto-unlock enabled
      // Prioritize: 1) Default wallet with auto-unlock, 2) First wallet with auto-unlock
      const defaultWallet = wallets.find(w => w.is_default && hasAutoUnlock(w.id));
      const walletToUnlock = defaultWallet || wallets.find(w => hasAutoUnlock(w.id));

      if (!walletToUnlock) {
        return;
      }

      const sessionData = getSessionKey(walletToUnlock.id);
      if (!sessionData) {
        return;
      }

      // Check if session is expired
      if (new Date(sessionData.expiresAt) <= new Date()) {
        return;
      }

      try {
        const response = await fetch('/api/blockchain/wallets/auto-unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_id: walletToUnlock.id,
            session_key: sessionData.sessionKey,
            frontend_session_id: sessionData.frontendSessionId,
          }),
          credentials: 'same-origin',
        });

        if (response.ok) {
          // Refresh session to update UI
          await refreshSession();
          await fetchWallets();
        }
      } catch (error) {
        console.error('Auto-unlock failed:', error);
      }
    };

    attemptAutoUnlock();
  }, [wallets, loading, isUnlocked, refreshSession, fetchWallets]);

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
    <>
      {/* Session Status Banner */}
      {isUnlocked && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-900 dark:text-green-100">
            Active Session: {walletName} ({walletRole === 'core' ? 'CORE' : 'User'})
          </p>
        </div>
      )}

      {/* Wallet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onWalletDeleted={fetchWallets}
            onWalletUpdated={fetchWallets}
          />
        ))}
      </div>
    </>
  );
}
