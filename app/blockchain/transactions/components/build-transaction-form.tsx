'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { buildTransactionSchema, type BuildTransactionFormData } from '@/app/lib/cardano/transaction-validation';
import type { BuildTransactionResponse, MetadataMode } from '@/app/lib/cardano/transaction-types';
import { useTransactions } from '@/app/hooks/use-transactions';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { useWalletBalance } from '@/app/hooks/use-wallet-balance';
import { lovelaceToAda, getMaxSpendable } from '@/app/lib/cardano/format-utils';
import { MetadataInput } from './metadata-input';
import { CurrencyDollarIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface BuildTransactionFormProps {
  onSuccess: (response: BuildTransactionResponse) => void;
  onError: (error: string) => void;
}

export function BuildTransactionForm({ onSuccess, onError }: BuildTransactionFormProps) {
  const { isUnlocked, walletId } = useWalletSession();
  const { buildTransaction } = useTransactions();
  const [error, setError] = useState<string | null>(null);
  const [metadataMode, setMetadataMode] = useState<MetadataMode>('json');

  // Fetch wallet balance with auto-refresh
  const { balance, loading: balanceLoading, refresh: refreshBalance } = useWalletBalance({
    walletId,
    autoRefresh: true,
    enabled: isUnlocked,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BuildTransactionFormData>({
    resolver: zodResolver(buildTransactionSchema),
    defaultValues: {
      to_address: '',
      amount_ada: 0,
      metadata_mode: 'none',
      text_message: '',
      json_data: '',
    },
  });

  const textMessage = watch('text_message') || '';
  const jsonData = watch('json_data') || '';
  const amountAda = watch('amount_ada') || 0;

  // Calculate if amount exceeds balance
  const exceedsBalance = balance
    ? (amountAda * 1_000_000) > balance.balance_lovelace
    : false;

  const handleMetadataModeChange = (mode: MetadataMode) => {
    setMetadataMode(mode);
    setValue('metadata_mode', mode);
  };

  const onSubmit = async (data: BuildTransactionFormData) => {
    setError(null);
    try {
      const response = await buildTransaction(data);
      onSuccess(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to build transaction';
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <form id="build-transaction-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 dark:bg-red-500/10 border border-red-500/30 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Wallet Not Unlocked Warning */}
      {!isUnlocked && (
        <div className="bg-yellow-500/10 dark:bg-yellow-500/10 border border-yellow-500/30 dark:border-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              Please unlock a wallet to create transactions
            </span>
          </div>
        </div>
      )}

      {/* Transaction Assets Card */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <CurrencyDollarIcon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Assets</h2>
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="amount_ada" className="text-gray-900 dark:text-white text-sm font-medium">
              Amount (ADA)
            </label>
            <div className="relative group">
              <input
                id="amount_ada"
                type="number"
                step="0.000001"
                placeholder="0.000000"
                {...register('amount_ada', { valueAsNumber: true })}
                className="w-full bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark text-gray-900 dark:text-white text-lg rounded-xl h-14 pl-4 pr-16 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none text-gray-500">
                <span className="font-bold text-xs">ADA</span>
              </div>
            </div>
            {errors.amount_ada && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.amount_ada.message}</p>
            )}
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-500 px-1">
              <span>
                Available balance: {
                  balanceLoading && !balance
                    ? 'Loading...'
                    : balance
                      ? lovelaceToAda(balance.balance_lovelace, { precision: 2, includeSymbol: true, includeCommas: true })
                      : '-- ADA'
                }
              </span>
              {balance && (
                <button
                  type="button"
                  onClick={() => {
                    // Calculate max amount (balance - estimated fee of 0.17 ADA)
                    const maxAmountLovelace = getMaxSpendable(balance.balance_lovelace, 170000);
                    const maxAmountAda = maxAmountLovelace / 1_000_000;
                    setValue('amount_ada', maxAmountAda);
                  }}
                  disabled={!balance || balance.balance_lovelace <= 170000}
                  className="text-primary hover:text-primary-hover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use Max
                </button>
              )}
            </div>
            {/* Insufficient Balance Warning */}
            {exceedsBalance && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg p-3 text-sm flex items-start gap-2">
                <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Amount exceeds available balance</span>
              </div>
            )}
          </div>

          {/* Destination Address */}
          <div className="flex flex-col gap-2">
            <label htmlFor="to_address" className="text-gray-900 dark:text-white text-sm font-medium flex justify-between">
              <span>Destination Address</span>
              <span className="text-xs font-normal text-gray-600 dark:text-gray-500">Supports handle or addr1...</span>
            </label>
            <div className="relative">
              <textarea
                id="to_address"
                placeholder="addr1..."
                rows={2}
                {...register('to_address')}
                className="w-full bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-border-dark text-gray-900 dark:text-white text-base rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600 font-mono leading-relaxed"
              />
              {/* QR Scanner icon removed for now - can be added later with proper functionality */}
            </div>
            {errors.to_address && (
              <p className="text-red-600 dark:text-red-400 text-xs">{errors.to_address.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Card */}
      <MetadataInput
        mode={metadataMode}
        onModeChange={handleMetadataModeChange}
        textMessage={textMessage}
        onTextMessageChange={(value) => setValue('text_message', value)}
        jsonData={jsonData}
        onJsonDataChange={(value) => setValue('json_data', value)}
      />
    </form>
  );
}
