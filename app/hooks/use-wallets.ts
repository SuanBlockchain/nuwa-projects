'use client';

import { useState, useCallback } from 'react';
import type { Wallet, CreateWalletRequest, ImportWalletRequest } from '@/app/lib/cardano/types';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import { clearSessionKey } from '@/app/lib/cardano/session-key-manager';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshSession } = useWalletSession();

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets', {
        cache: 'no-store',
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to fetch wallets');
      const data = await res.json();
      setWallets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createWallet = useCallback(async (data: CreateWalletRequest & { confirmPassword: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to create wallet');
      const wallet = await res.json();
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const importWallet = useCallback(async (data: ImportWalletRequest & { confirmPassword: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to import wallet');
      const wallet = await res.json();
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlockWallet = useCallback(async (walletId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: walletId, password }),
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Failed to unlock wallet');
      await fetchWallets();
      await refreshSession(); // Refresh session state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets, refreshSession]);

  const lockWallet = useCallback(async (walletId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: walletId }),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to lock wallet' }));
        throw new Error(errorData.error || 'Failed to lock wallet');
      }

      // Clear auto-unlock session key from localStorage
      clearSessionKey(walletId);

      await fetchWallets();
      await refreshSession(); // Clear session state
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets, refreshSession]);

  const deleteWallet = useCallback(async (walletId: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blockchain/wallets/${walletId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to delete wallet' }));
        throw new Error(errorData.error || 'Failed to delete wallet');
      }

      // Clear auto-unlock session key from localStorage
      clearSessionKey(walletId);

      await fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets]);

  const promoteWallet = useCallback(async (walletId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: walletId }),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to promote wallet' }));
        throw new Error(errorData.error || 'Failed to promote wallet');
      }

      await fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets]);

  const changePassword = useCallback(async (walletId: string, currentPassword: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting to change password for wallet:', walletId);

      const res = await fetch(`/api/blockchain/wallets/${walletId}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        }),
        credentials: 'same-origin',
      });

      console.log('Change password response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to change password' }));

        // Debug logging
        console.error('Change password failed. Status:', res.status);
        console.error('Error data received:', errorData);

        // Extract error message - handle various error formats
        let errorMessage = 'Failed to change password';
        if (typeof errorData.error === 'string') {
          errorMessage = errorData.error;
        } else if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (errorData.error && typeof errorData.error === 'object') {
          // Handle nested error objects
          console.error('Error is an object:', errorData.error);
          errorMessage = JSON.stringify(errorData.error);
        }

        console.error('Final error message:', errorMessage);
        throw new Error(errorMessage);
      }

      // Password changed successfully
      // Backend locks the wallet for security, so we need to:
      // 1. Refresh wallet list to get updated is_locked status
      await fetchWallets();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets]);

  return {
    wallets,
    loading,
    error,
    fetchWallets,
    createWallet,
    importWallet,
    unlockWallet,
    lockWallet,
    deleteWallet,
    promoteWallet,
    changePassword,
  };
}
