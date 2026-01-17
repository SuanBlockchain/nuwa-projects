'use client';

import { useState, useEffect } from 'react';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { useWallets } from '@/app/hooks/use-wallets';
import { QRCodeSVG } from 'qrcode.react';
import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  WalletIcon as WalletOutlineIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

export default function ReceivePage() {
  const { walletId, walletName } = useWalletSession();
  const { wallets, loading, fetchWallets } = useWallets();
  const [copied, setCopied] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState<string>(walletId || '');

  // Fetch wallets on mount
  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // Use selected wallet or fallback to session wallet
  const activeWalletId = selectedWalletId || walletId;
  const currentWallet = wallets.find(w => w.id === activeWalletId);
  const address = currentWallet?.enterprise_address;
  const displayName = activeWalletId === walletId ? walletName : currentWallet?.name;

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Show loading state while fetching wallets
  if (loading && wallets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Receive
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Show your wallet address to receive ADA
          </p>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-12 shadow-sm">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 border-4 border-mint-9/30 border-t-mint-9 rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading wallets...</p>
          </div>
        </div>
      </div>
    );
  }

  // If no wallets exist at all
  if (!wallets || wallets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Receive
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Show your wallet address to receive ADA
          </p>
        </div>

        <div className="bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/20 rounded-xl p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
              <WalletOutlineIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Wallets Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Create a wallet first to receive ADA
              </p>
            </div>
            <a
              href="/blockchain/wallets/create"
              className="mt-4 px-6 py-3 bg-mint-9 hover:bg-mint-10 text-white rounded-lg font-medium transition-colors"
            >
              Create Wallet
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Auto-select first wallet if none selected
  if (!activeWalletId && wallets.length > 0) {
    setSelectedWalletId(wallets[0].id);
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Receive
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your wallet address to receive ADA (no unlock required)
        </p>
      </div>

      {/* Wallet Selector */}
      {wallets.length > 1 && (
        <div className="mb-6">
          <label className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 block">
            Select Wallet
          </label>
          <select
            value={activeWalletId || ''}
            onChange={(e) => setSelectedWalletId(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-9 focus:border-transparent"
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name} {wallet.id === walletId ? '(Active)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active Wallet Info */}
      <div className="mb-6 bg-mint-9/10 border border-mint-9/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-mint-9/20 flex items-center justify-center">
            <QrCodeIcon className="w-6 h-6 text-mint-9" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Receiving to</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{displayName}</p>
          </div>
        </div>
      </div>

      {/* Wallet Address Card */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <label className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3 block">
            Wallet Address
          </label>
          <div className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 flex items-center gap-3">
            <code className="flex-1 text-gray-900 dark:text-white text-sm font-mono break-all">
              {address}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-surface-dark rounded-lg transition-colors group"
              title="Copy address"
            >
              {copied ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              )}
            </button>
            <a
              href={`https://preview.cardanoscan.io/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-surface-dark rounded-lg transition-colors group"
              title="View on Explorer"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* QR Code */}
        <div className="mb-6">
          <label className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3 block">
            QR Code
          </label>
          <div className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-xl p-8 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-xl">
              {address && (
                <QRCodeSVG
                  value={address}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
              Scan this QR code to get the wallet address
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-surface-darker border border-blue-200 dark:border-border-dark rounded-xl p-5">
          <h3 className="text-gray-900 dark:text-white text-sm font-bold mb-2">
            How to Receive ADA
          </h3>
          <ol className="text-gray-700 dark:text-gray-400 text-sm space-y-2 list-decimal list-inside">
            <li>Copy your wallet address or share the QR code with the sender</li>
            <li>No wallet unlock required - addresses are public information</li>
            <li>Wait for the transaction to be confirmed on the blockchain</li>
            <li>Your balance will update automatically once confirmed</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
