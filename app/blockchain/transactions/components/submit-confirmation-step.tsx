'use client';

import { useState } from 'react';
import type { SignAndSubmitResponse } from '@/app/lib/cardano/transaction-types';
import { CheckCircleIcon, ClipboardDocumentIcon, ArrowTopRightOnSquareIcon, InformationCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface SubmitConfirmationStepProps {
  submitResponse: SignAndSubmitResponse;
  onReset: () => void;
}

export function SubmitConfirmationStep({ submitResponse, onReset }: SubmitConfirmationStepProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(submitResponse.tx_hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Success Card */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 md:p-8">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircleIconSolid className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transaction Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
            Your transaction has been successfully signed and submitted to the Cardano blockchain.
          </p>
        </div>

        {/* Transaction Hash */}
        <div className="mb-6">
          <label className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-2 block">Transaction Hash</label>
          <div className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-xl p-4 flex items-center gap-3">
            <code className="flex-1 text-gray-900 dark:text-white text-sm font-mono break-all">
              {submitResponse.tx_hash}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-surface-dark rounded-lg transition-colors group"
              title="Copy to clipboard"
            >
              {copied ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardDocumentIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Submission Time */}
        <div className="mb-6">
          <label className="text-gray-600 dark:text-gray-400 text-xs font-medium mb-2 block">Submitted At</label>
          <div className="bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-border-dark rounded-xl p-4">
            <span className="text-gray-900 dark:text-white text-sm">{formatDate(submitResponse.submitted_at)}</span>
          </div>
        </div>

        {/* Explorer Link */}
        <a
          href={submitResponse.explorer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
        >
          <ArrowTopRightOnSquareIcon className="w-5 h-5" />
          View on Explorer
        </a>
      </div>

      {/* Next Steps Card */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <InformationCircleIcon className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Next Steps</h3>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              Your transaction is now being propagated across the Cardano network
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              It will be included in the next block (usually within 20 seconds)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              You can track the status using the transaction hash on the explorer
            </span>
          </li>
        </ul>

        <button
          type="button"
          onClick={onReset}
          className="w-full h-12 bg-primary hover:bg-primary-hover text-black text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)]"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Create Another Transaction
        </button>
      </div>
    </div>
  );
}
