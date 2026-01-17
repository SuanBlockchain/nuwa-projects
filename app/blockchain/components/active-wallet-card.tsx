'use client';

import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { useWalletBalance } from '@/app/hooks/use-wallet-balance';
import { formatBalanceSmart } from '@/app/lib/cardano/format-utils';
import { WalletIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export function ActiveWalletCard() {
  const { isUnlocked, walletId, walletName, walletRole } = useWalletSession();

  const { balance, loading: balanceLoading } = useWalletBalance({
    walletId,
    autoRefresh: true,
    refreshInterval: 30000,
    enabled: isUnlocked,
  });

  if (!isUnlocked || !walletId) {
    return (
      <div className="mt-auto p-4 border-t border-gray-800 flex-shrink-0">
        <div className="bg-gray-800 p-3 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <LockClosedIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-medium text-gray-500 truncate">No wallet active</p>
              <p className="text-xs text-gray-600">Unlock a wallet to continue</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto p-4 border-t border-gray-800 flex-shrink-0">
      <div className="bg-gray-800 p-3 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-mint-9/20 flex items-center justify-center">
            <WalletIcon className="w-5 h-5 text-mint-9" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium text-white truncate">{walletName}</p>
            <p className="text-xs text-gray-500">Active Wallet</p>
          </div>
        </div>

        <div className="space-y-2">
          {/* Balance */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Balance</span>
            {balanceLoading ? (
              <div className="h-4 w-20 bg-gray-700 animate-pulse rounded"></div>
            ) : balance ? (
              <span className="text-sm font-bold text-white">
                {formatBalanceSmart(balance.balance_lovelace)}
              </span>
            ) : (
              <span className="text-xs text-gray-600">--</span>
            )}
          </div>

          {/* Network */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Network</span>
            <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded">
              Preprod
            </span>
          </div>

          {/* Role Badge if Core */}
          {walletRole === 'core' && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <span className="text-xs bg-purple-900/30 text-purple-200 px-2 py-0.5 rounded">
                CoreWallet
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
