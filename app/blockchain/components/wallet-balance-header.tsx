'use client';

import { useState } from 'react';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { useWalletBalance } from '@/app/hooks/use-wallet-balance';
import { formatBalanceSmart } from '@/app/lib/cardano/format-utils';
import {
  WalletIcon,
  LockClosedIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export function WalletBalanceHeader() {
  const router = useRouter();
  const { isUnlocked, walletId, walletName, walletRole } = useWalletSession();
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useWalletBalance({
    walletId,
    autoRefresh: true,
    refreshInterval: 30000,
    enabled: isUnlocked,
  });

  if (!isUnlocked || !walletId) {
    return (
      <div className="bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/30 dark:border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <LockClosedIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              No wallet unlocked
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
              Please unlock a wallet to continue
            </p>
          </div>
          <button
            onClick={() => router.push('/blockchain/wallets')}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go to Wallets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Wallet Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {walletName}
              </h3>
              {walletRole === 'core' && (
                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded">
                  Core
                </span>
              )}
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Active</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
              {walletId}
            </p>
          </div>
        </div>

        {/* Center: Balance */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Balance</p>
            {balanceLoading && !balance ? (
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : balance ? (
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatBalanceSmart(balance.balance_lovelace)}
              </p>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to load
              </p>
            )}
          </div>

          {/* Refresh Button */}
          {isUnlocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshBalance();
              }}
              disabled={balanceLoading}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary disabled:opacity-50 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker"
              title="Refresh balance"
              aria-label="Refresh balance"
            >
              <ArrowPathIcon className={`h-5 w-5 ${balanceLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Right: Network Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-surface-darker rounded-full border border-primary/30 dark:border-primary/20 text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Preprod
        </div>
      </div>
    </div>
  );
}
