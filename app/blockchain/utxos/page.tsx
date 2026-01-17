'use client';

import { useState, useEffect } from 'react';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import {
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  CubeIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

interface TokenInfo {
  policy_id: string;
  asset_name: string;
  quantity: number;
}

interface UtxoInfo {
  tx_hash: string;
  output_index: number;
  address: string;
  amount_lovelace: number;
  amount_ada: number;
  tokens: TokenInfo[] | null;
}

interface UtxoResponse {
  wallet_id: string;
  wallet_name: string;
  utxos: UtxoInfo[];
  total_ada: number;
  total_lovelace: number;
  checked_at: string;
}

export default function UtxosPage() {
  const { isUnlocked, walletId, walletName } = useWalletSession();
  const [utxoData, setUtxoData] = useState<UtxoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    if (isUnlocked && walletId) {
      fetchUtxos();
    }
  }, [isUnlocked, walletId]);

  const fetchUtxos = async () => {
    if (!walletId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blockchain/wallets/${walletId}/utxos`, {
        cache: 'no-store',
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to fetch UTXOs' }));
        throw new Error(errorData.error || 'Failed to fetch UTXOs');
      }

      const data = await res.json();
      setUtxoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const formatTokenName = (assetName: string): string => {
    try {
      // Asset names are often hex-encoded
      const hex = assetName.replace(/^0x/, '');
      const str = Buffer.from(hex, 'hex').toString('utf8');
      // Check if it's valid UTF-8
      if (/^[\x20-\x7E]+$/.test(str)) {
        return str;
      }
      return assetName;
    } catch {
      return assetName;
    }
  };

  if (!isUnlocked || !walletId) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            UTXO List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View unspent transaction outputs for your wallet
          </p>
        </div>

        <div className="bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/30 dark:border-yellow-500/20 rounded-xl p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Wallet Locked
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Please unlock a wallet to view UTXOs
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
          UTXO List
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unspent transaction outputs for {walletName}
        </p>
      </div>

      {/* Summary Card */}
      {utxoData && (
        <div className="mb-6 bg-mint-9/10 border border-mint-9/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-mint-9/20 flex items-center justify-center">
                <CubeIcon className="w-6 h-6 text-mint-9" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total UTXOs</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {utxoData.utxos.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {utxoData.total_ada.toLocaleString()} ADA
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-12 shadow-sm">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 border-4 border-mint-9/30 border-t-mint-9 rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading UTXOs...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchUtxos}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* UTXOs List */}
      {!loading && !error && utxoData && (
        <div className="space-y-4">
          {utxoData.utxos.length === 0 ? (
            <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-12 shadow-sm">
              <div className="flex flex-col items-center text-center gap-4">
                <CubeIcon className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No UTXOs Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    This wallet has no unspent transaction outputs
                  </p>
                </div>
              </div>
            </div>
          ) : (
            utxoData.utxos.map((utxo, index) => (
              <div
                key={`${utxo.tx_hash}-${utxo.output_index}`}
                className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* UTXO Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">Output Index</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {utxo.output_index}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-mint-9">
                      {utxo.amount_ada.toLocaleString()} ADA
                    </p>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="mb-4">
                  <label className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-2 block">
                    Transaction Hash
                  </label>
                  <div className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg p-3 flex items-center gap-2">
                    <code className="flex-1 text-gray-900 dark:text-white text-xs font-mono break-all">
                      {utxo.tx_hash}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(utxo.tx_hash)}
                      className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-surface-dark rounded-lg transition-colors group"
                      title="Copy hash"
                    >
                      {copiedHash === utxo.tx_hash ? (
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                      )}
                    </button>
                    <a
                      href={`https://preview.cardanoscan.io/transaction/${utxo.tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-surface-dark rounded-lg transition-colors group"
                      title="View on Explorer"
                    >
                      <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    </a>
                  </div>
                </div>

                {/* Assets/Tokens */}
                {utxo.tokens && utxo.tokens.length > 0 && (
                  <div>
                    <label className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-2 block">
                      Native Tokens ({utxo.tokens.length})
                    </label>
                    <div className="space-y-2">
                      {utxo.tokens.map((token, tokenIndex) => (
                        <div
                          key={`${token.policy_id}-${token.asset_name}-${tokenIndex}`}
                          className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                                Asset Name
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {formatTokenName(token.asset_name || 'Unknown')}
                              </p>
                              {token.policy_id && (
                                <p className="text-xs text-gray-500 dark:text-gray-500 font-mono truncate mt-1">
                                  Policy: {token.policy_id.substring(0, 20)}...
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-xs text-gray-500 dark:text-gray-500">Quantity</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {token.quantity.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
