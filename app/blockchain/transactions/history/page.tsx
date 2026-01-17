'use client';

import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { ClockIcon, LockClosedIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function TransactionHistoryPage() {
  const { isUnlocked, walletId, walletName } = useWalletSession();

  if (!isUnlocked || !walletId) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your past transactions
          </p>
        </div>

        <div className="bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/30 dark:border-yellow-500/20 rounded-xl p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Active Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Please unlock a wallet to view transaction history
              </p>
            </div>
            <a
              href="/blockchain/wallets"
              className="mt-4 px-6 py-3 bg-mint-9 hover:bg-mint-10 text-white rounded-lg font-medium transition-colors"
            >
              Go to Wallets
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Transaction History
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View transaction history for {walletName}
        </p>
      </div>

      {/* Active Wallet Info */}
      <div className="mb-6 bg-mint-9/10 border border-mint-9/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mint-9/20 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-mint-9" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Showing history for</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{walletName}</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center">
            <ClockIcon className="w-10 h-10 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Transaction History Coming Soon
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg">
              We're working on adding transaction history functionality. You'll be able to view all
              incoming and outgoing transactions for your active wallet.
            </p>
          </div>

          {/* Features Preview */}
          <div className="mt-6 bg-blue-50 dark:bg-surface-darker border border-blue-200 dark:border-border-dark rounded-xl p-6 w-full max-w-2xl">
            <div className="flex items-start gap-3 mb-4">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="text-gray-900 dark:text-white text-sm font-bold mb-3">
                  Planned Features
                </h3>
                <ul className="text-gray-700 dark:text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>View all sent and received transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Transaction amounts, fees, and timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Direct links to blockchain explorer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Search and filter capabilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Export transaction data</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <a
            href="/blockchain/wallets"
            className="mt-4 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
          >
            Back to Wallets
          </a>
        </div>
      </div>
    </div>
  );
}
