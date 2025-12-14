'use client';

import { useState, useCallback } from 'react';
import type { Wallet, CreateWalletRequest, ImportWalletRequest } from '@/app/lib/cardano/types';
import { useWalletSession } from '@/app/contexts/wallet-session-context';

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
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to lock wallet' }));
        throw new Error(errorData.error || 'Failed to lock wallet');
      }

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
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to delete wallet' }));
        throw new Error(errorData.error || 'Failed to delete wallet');
      }

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
  };
}
