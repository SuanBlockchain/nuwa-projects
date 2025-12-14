'use client';

import { useState } from 'react';
import type { TransactionStep, BuildTransactionResponse, SignAndSubmitResponse } from '@/app/lib/cardano/transaction-types';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { TransactionSummary } from './transaction-summary';
import { BuildTransactionForm } from './build-transaction-form';
import { SignTransactionStep } from './sign-transaction-step';
import { SubmitConfirmationStep } from './submit-confirmation-step';

export function TransactionWizard() {
  const [currentStep, setCurrentStep] = useState<TransactionStep>('build');
  const [buildResponse, setBuildResponse] = useState<BuildTransactionResponse | null>(null);
  const [submitResponse, setSubmitResponse] = useState<SignAndSubmitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formRef, setFormRef] = useState<HTMLFormElement | null>(null);
  const { isUnlocked } = useWalletSession();

  const handleBuildSuccess = (response: BuildTransactionResponse) => {
    // Verify wallet is still unlocked before proceeding to sign
    if (!isUnlocked) {
      alert('Your wallet session has expired. Please unlock your wallet again.');
      return;
    }
    setBuildResponse(response);
    setCurrentStep('sign');
  };

  const handleBuildError = (error: string) => {
    setError(error);
  };

  const handleSignSuccess = (response: SignAndSubmitResponse) => {
    setSubmitResponse(response);
    setCurrentStep('submit');
  };

  const handleBackToBuild = () => {
    setCurrentStep('build');
    // Keep buildResponse so user can see the data if they go back
  };

  const handleReset = () => {
    setCurrentStep('build');
    setBuildResponse(null);
    setSubmitResponse(null);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Main Content Grid */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Form/Content */}
        <div className="xl:col-span-2">
          {currentStep === 'build' && (
            <BuildTransactionForm
              onSuccess={handleBuildSuccess}
              onError={handleBuildError}
            />
          )}

          {currentStep === 'sign' && buildResponse && (
            <SignTransactionStep
              buildResponse={buildResponse}
              onSuccess={handleSignSuccess}
              onBack={handleBackToBuild}
            />
          )}

          {currentStep === 'submit' && submitResponse && (
            <SubmitConfirmationStep
              submitResponse={submitResponse}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Right Column - Summary Sidebar */}
        <div className="xl:col-span-1">
          <TransactionSummary
            currentStep={currentStep}
            buildResponse={buildResponse}
            network="Preprod"
            isUnlocked={isUnlocked}
          />
        </div>
      </div>
    </div>
  );
}
