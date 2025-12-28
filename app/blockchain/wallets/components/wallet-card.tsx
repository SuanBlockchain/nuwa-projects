'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Wallet } from '@/app/lib/cardano/types';
import UnlockWalletDialog from './unlock-wallet-dialog';
import DeleteWalletDialog from './delete-wallet-dialog';
import ChangePasswordDialog from './change-password-dialog';
import { useWallets } from '@/app/hooks/use-wallets';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { useWalletBalance } from '@/app/hooks/use-wallet-balance';
import { formatBalanceSmart } from '@/app/lib/cardano/format-utils';
import { hasAutoUnlock } from '@/app/lib/cardano/session-key-manager';
import { WalletIcon, ArrowUpCircleIcon, CheckCircleIcon, ArrowPathIcon, ShieldCheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface WalletCardProps {
  wallet: Wallet;
  onWalletDeleted?: () => void;
  onWalletUpdated?: () => void;
}

export default function WalletCard({ wallet, onWalletDeleted, onWalletUpdated }: WalletCardProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);
  const { lockWallet, promoteWallet, loading, error } = useWallets();
  const { data: session } = useSession();
  const { isUnlocked, walletId: unlockedWalletId, hasCoreWallet, refreshSession } = useWalletSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const isThisWalletUnlocked = isUnlocked && unlockedWalletId === wallet.id;

  // Fetch wallet balance with auto-refresh
  const { balance, loading: balanceLoading, error: balanceError, refresh: refreshBalance } = useWalletBalance({
    walletId: wallet.id,
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
    enabled: isThisWalletUnlocked, // Only fetch for unlocked wallets (based on frontend session)
  });

  const handleUnlockSuccess = async () => {
    await refreshSession();
    onWalletUpdated?.();
  };

  const handleLock = async () => {
    setLockError(null);
    try {
      await lockWallet(wallet.id);
      await refreshSession();
      onWalletUpdated?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lock wallet';
      setLockError(errorMessage);
      // Auto-hide error after 5 seconds
      setTimeout(() => setLockError(null), 5000);
    }
  };

  const handlePromote = async () => {
    if (confirm(`Promote "${wallet.name}" to CoreWallet? This action cannot be undone.`)) {
      try {
        await promoteWallet(wallet.id);
        onWalletUpdated?.();
      } catch (error) {
        // Error handled by hook
      }
    }
  };

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

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-zinc-500 dark:text-zinc-500">
            {wallet.network}
          </span>
          {wallet.is_default && (
            <span className="text-xs bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200 px-2 py-0.5 rounded">
              Default
            </span>
          )}
          {wallet.role === 'core' && (
            <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded">
              CoreWallet
            </span>
          )}
          {isThisWalletUnlocked && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircleIcon className="h-3 w-3" />
              Active Session
            </span>
          )}
          {hasAutoUnlock(wallet.id) && (
            <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded flex items-center gap-1" title="Auto-unlock enabled">
              <ShieldCheckIcon className="h-3 w-3" />
              Auto-Unlock
            </span>
          )}
        </div>

        {/* Balance Display */}
        <div className="mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-500">Balance</p>
            {isThisWalletUnlocked && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  refreshBalance();
                }}
                disabled={balanceLoading}
                className="text-xs text-mint-600 dark:text-mint-400 hover:text-mint-700 dark:hover:text-mint-300 disabled:opacity-50 transition-colors"
                title="Refresh balance"
                aria-label="Refresh balance"
              >
                <ArrowPathIcon className={`h-3 w-3 ${balanceLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          {!isThisWalletUnlocked ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-600 italic">
              Unlock to view balance
            </p>
          ) : balanceLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded"></div>
            </div>
          ) : balanceError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load balance
            </p>
          ) : balance ? (
            <p className="text-lg font-bold text-zinc-900 dark:text-white">
              {formatBalanceSmart(balance.balance_lovelace)}
            </p>
          ) : null}
        </div>

        {/* Owner Info - Only visible to admins */}
        {isAdmin && wallet.owner && (
          <div className="mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">Owner</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
              {wallet.owner.userName || wallet.owner.userEmail || 'Unknown'}
            </p>
            {wallet.owner.userEmail && wallet.owner.userName && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{wallet.owner.userEmail}</p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Role: {wallet.owner.userRole}
            </p>
          </div>
        )}

        {/* Lock Error Display */}
        {lockError && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
            <p className="text-xs text-red-600 dark:text-red-400">{lockError}</p>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          {!isThisWalletUnlocked ? (
            <button
              onClick={() => setShowUnlock(true)}
              className="flex-1 px-3 py-2 bg-mint-9 hover:bg-mint-10 text-white rounded text-sm transition-colors"
            >
              Unlock
            </button>
          ) : (
            <button
              onClick={handleLock}
              disabled={loading}
              className="flex-1 px-3 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Locking...' : 'Lock'}
            </button>
          )}
          <button
            onClick={() => setShowChangePassword(true)}
            className="px-3 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded text-sm transition-colors flex items-center gap-1"
            title="Change Password"
          >
            <Cog6ToothIcon className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>

        {/* Promote Button - Only visible to admins for non-core wallets */}
        {isAdmin && wallet.role !== 'core' && (
          <>
            <button
              onClick={handlePromote}
              disabled={loading || !hasCoreWallet}
              className="w-full mt-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              title={!hasCoreWallet ? 'Please unlock a CORE wallet first' : ''}
            >
              <ArrowUpCircleIcon className="h-4 w-4" />
              Promote to CoreWallet
            </button>
            {!hasCoreWallet && (
              <div className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ Unlock a CORE wallet to enable promotion
              </div>
            )}
          </>
        )}
      </div>

      <UnlockWalletDialog
        wallet={wallet}
        open={showUnlock}
        onOpenChange={setShowUnlock}
        onSuccess={handleUnlockSuccess}
      />

      <DeleteWalletDialog
        wallet={wallet}
        open={showDelete}
        onOpenChange={setShowDelete}
        onDeleted={onWalletDeleted}
      />

      <ChangePasswordDialog
        walletId={wallet.id}
        walletName={wallet.name}
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
        onSuccess={() => {
          // Password changed successfully
          // Backend locks the wallet, so refresh wallet list
          onWalletUpdated?.();
        }}
      />
    </>
  );
}
