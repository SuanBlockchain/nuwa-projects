'use client';

import type { BuildTransactionResponse, TransactionStep } from '@/app/lib/cardano/transaction-types';
import { DocumentTextIcon, WrenchScrewdriverIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface TransactionSummaryProps {
  currentStep: TransactionStep;
  buildResponse: BuildTransactionResponse | null;
  network?: string;
  isUnlocked?: boolean;
}

function lovelaceToAda(lovelace: number | string | undefined): string {
  const amount = typeof lovelace === 'string' ? parseFloat(lovelace) : lovelace;
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0.000000';
  }
  return (amount / 1_000_000).toFixed(6);
}

export function TransactionSummary({
  currentStep,
  buildResponse,
  network = 'Preprod',
  isUnlocked = false,
}: TransactionSummaryProps) {
  const getStatusColor = () => {
    switch (currentStep) {
      case 'build':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'sign':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'submit':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (currentStep) {
      case 'build':
        return 'Building Transaction';
      case 'sign':
        return 'Ready to Sign';
      case 'submit':
        return 'Transaction Submitted';
      default:
        return 'Pending';
    }
  };

  return (
    <div className="sticky top-6 flex flex-col gap-6">
      {/* Summary Card */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 relative overflow-hidden shadow-sm">
        {/* Background Icon */}
        <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10">
          <DocumentTextIcon className="w-16 h-16 text-gray-900 dark:text-white" />
        </div>

        <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-6 relative z-10">Transaction Summary</h3>

        <div className="flex flex-col gap-4 relative z-10">
          {/* Network */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Network</span>
            <span className="text-gray-900 dark:text-white text-sm font-medium">{network}</span>
          </div>

          {/* Amount */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Amount</span>
            {buildResponse ? (
              <span className="text-gray-900 dark:text-white text-sm font-medium">
                {lovelaceToAda(buildResponse.amount_lovelace)} ADA
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-600 text-sm font-medium">-- ADA</span>
            )}
          </div>

          {/* Fee */}
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/5">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Est. Fee</span>
            {buildResponse ? (
              <span className="text-primary text-sm font-medium">
                {lovelaceToAda(buildResponse.fee_lovelace)} ADA
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-600 text-sm font-medium">~0.17 ADA</span>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Total</span>
            {buildResponse ? (
              <span className="text-gray-900 dark:text-white text-lg font-bold">
                {lovelaceToAda(buildResponse.total_lovelace)} ADA
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-600 text-lg font-bold">-- ADA</span>
            )}
          </div>
        </div>

        {/* Build Button - Only show on build step */}
        {currentStep === 'build' && (
          <div className="mt-8 relative z-10">
            <button
              type="submit"
              form="build-transaction-form"
              disabled={!isUnlocked}
              className="w-full h-12 bg-primary hover:bg-primary-hover text-black text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <WrenchScrewdriverIcon className="w-5 h-5" />
              Build Transaction
            </button>
            <p className="text-center text-gray-500 text-xs mt-3">
              Wait for wallet signature in next step
            </p>
          </div>
        )}

        {/* Status Badge - Show on other steps */}
        {currentStep !== 'build' && (
          <div className="mt-6 relative z-10">
            <div className={`px-4 py-2 rounded-lg text-center text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-surface-darker border border-blue-200 dark:border-border-dark rounded-xl p-5">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-gray-900 dark:text-white text-sm font-bold mb-1">Did you know?</h4>
            <p className="text-gray-700 dark:text-gray-400 text-xs leading-relaxed">
              Cardano transactions can carry arbitrary metadata. Nuwa uses this to attach
              environmental impact certificates directly on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
