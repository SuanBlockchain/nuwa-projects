'use client';

import { useState, useCallback } from 'react';
import type { BuildTransactionResponse, SignAndSubmitResponse } from '@/app/lib/cardano/transaction-types';
import type { BuildTransactionFormData, SignTransactionFormData } from '@/app/lib/cardano/transaction-validation';

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildTransaction = useCallback(async (data: BuildTransactionFormData): Promise<BuildTransactionResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/transactions/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to build transaction' }));
        throw new Error(errorData.error || 'Failed to build transaction');
      }

      const response = await res.json();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signAndSubmit = useCallback(async (data: SignTransactionFormData): Promise<SignAndSubmitResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/transactions/sign-and-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to sign and submit transaction' }));
        const error: any = new Error(errorData.error || 'Failed to sign and submit transaction');
        error.status = res.status; // Attach status code
        throw error;
      }

      const response = await res.json();
      return response;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    buildTransaction,
    signAndSubmit,
  };
}
