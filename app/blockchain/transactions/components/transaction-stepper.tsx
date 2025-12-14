'use client';

import { Fragment } from 'react';
import type { TransactionStep } from '@/app/lib/cardano/transaction-types';

interface TransactionStepperProps {
  currentStep: TransactionStep;
}

const steps = [
  { id: 'build' as const, label: 'Build', icon: 'build' },
  { id: 'sign' as const, label: 'Sign', icon: 'edit_document' },
  { id: 'submit' as const, label: 'Submit', icon: 'send' },
];

export function TransactionStepper({ currentStep }: TransactionStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mb-12 w-full max-w-3xl">
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-4 items-center">
        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isActive
                      ? 'bg-primary text-black shadow-[0_0_15px_rgba(19,236,146,0.4)]'
                      : 'bg-surface-dark border border-border-dark text-white opacity-50'
                    }
                  `}
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    {step.icon}
                  </span>
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line (not after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-full rounded-full transition-all ${
                    isCompleted
                      ? 'bg-primary'
                      : isCurrent
                      ? 'bg-gradient-to-r from-primary to-surface-dark'
                      : 'bg-surface-dark'
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
