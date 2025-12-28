'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { signTransactionSchema, type SignTransactionFormData } from '@/app/lib/cardano/transaction-validation';
import type { BuildTransactionResponse, SignAndSubmitResponse } from '@/app/lib/cardano/transaction-types';
import { useTransactions } from '@/app/hooks/use-transactions';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface SignTransactionStepProps {
  buildResponse: BuildTransactionResponse;
  onSuccess: (response: SignAndSubmitResponse) => void;
  onBack: () => void;
}

function lovelaceToAda(lovelace: number | string | undefined): string {
  const amount = typeof lovelace === 'string' ? parseFloat(lovelace) : lovelace;
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.000000';
  }
  return (amount / 1_000_000).toFixed(6);
}

function truncateAddress(address: string, chars: number = 12): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function SignTransactionStep({ buildResponse, onSuccess, onBack }: SignTransactionStepProps) {
  const { signAndSubmit, loading } = useTransactions();
  const { ensureSessionValid } = useWalletSession();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignTransactionFormData>({
    resolver: zodResolver(signTransactionSchema),
    defaultValues: {
      transaction_id: buildResponse.transaction_id,
      password: '',
    },
  });

  const onSubmit = async (data: SignTransactionFormData) => {
    setError(null);
    try {
      // Ensure session is valid before signing
      console.log('Checking session validity before signing...');
      const isValid = await ensureSessionValid();

      if (!isValid) {
        setError('Your wallet session has expired. Please go back to the wallets page and unlock your wallet again.');
        return;
      }

      console.log('Session valid, proceeding with signature...');
      console.log('Transaction ID being submitted:', data.transaction_id);
      const response = await signAndSubmit(data);
      onSuccess(response);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign and submit transaction';

      // Special handling for different error types
      if (err.status === 401 || errorMessage.includes('Authentication failed') || errorMessage.includes('session')) {
        setError('Your session has expired. Please go back and unlock your wallet again, then rebuild the transaction.');
      } else if (err.status === 404 || errorMessage.includes('not found')) {
        setError('Transaction expired or not found. This usually happens when too much time passes between building and signing. Please go back and rebuild the transaction.');
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Transaction Details Card */}
      <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">description</span>
          <h2 className="text-xl font-bold text-white">Transaction Details</h2>
        </div>

        <div className="space-y-4">
          {/* From Address */}
          <div className="flex flex-col gap-1 p-4 bg-background-dark rounded-lg">
            <span className="text-gray-400 text-xs font-medium">From</span>
            <span className="text-white text-sm font-mono break-all">
              {truncateAddress(buildResponse.from_address, 20)}
            </span>
          </div>

          {/* To Address */}
          <div className="flex flex-col gap-1 p-4 bg-background-dark rounded-lg">
            <span className="text-gray-400 text-xs font-medium">To</span>
            <span className="text-white text-sm font-mono break-all">
              {truncateAddress(buildResponse.to_address, 20)}
            </span>
          </div>

          {/* Amount and Fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 p-4 bg-background-dark rounded-lg">
              <span className="text-gray-400 text-xs font-medium">Amount</span>
              <span className="text-white text-lg font-bold">
                {lovelaceToAda(buildResponse.amount_lovelace)} ADA
              </span>
            </div>

            <div className="flex flex-col gap-1 p-4 bg-background-dark rounded-lg">
              <span className="text-gray-400 text-xs font-medium">Fee</span>
              <span className="text-primary text-lg font-bold">
                {lovelaceToAda(buildResponse.fee_lovelace)} ADA
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-col gap-1 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <span className="text-gray-400 text-xs font-medium">Total (Amount + Fee)</span>
            <span className="text-white text-2xl font-bold">
              {lovelaceToAda(buildResponse.total_lovelace)} ADA
            </span>
          </div>

          {/* Metadata (if present) */}
          {buildResponse.metadata && (
            <div className="flex flex-col gap-1 p-4 bg-background-dark rounded-lg">
              <span className="text-gray-400 text-xs font-medium">Metadata</span>
              <pre className="text-white text-xs font-mono overflow-x-auto">
                {JSON.stringify(buildResponse.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Password Input Card */}
      <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary">lock</span>
          <h2 className="text-xl font-bold text-white">Sign Transaction</h2>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-white text-sm font-medium">
            Wallet Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your wallet password"
            {...register('password')}
            className="w-full bg-background-dark border border-border-dark text-white rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-600"
          />
          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-yellow-400 mt-0.5 text-[20px]">warning</span>
            <div>
              <h4 className="text-white text-sm font-bold mb-1">Review Carefully</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Once signed and submitted, this transaction cannot be reversed. Please verify all
                details before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 h-12 bg-surface-dark hover:bg-surface-darker border border-border-dark text-white text-base font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-[2] h-12 bg-primary hover:bg-primary-hover text-black text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <span className="material-symbols-outlined">send</span>
          {loading ? 'Signing & Submitting...' : 'Sign and Submit'}
        </button>
      </div>
    </form>
  );
}
