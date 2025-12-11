'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Wallet, CreateWalletRequest, ImportWalletRequest } from '@/app/lib/cardano/types';

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets');
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
      router.push('/blockchain/wallets');
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

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
      router.push('/blockchain/wallets');
      return wallet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets]);

  const lockWallet = useCallback(async (walletId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/blockchain/wallets/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: walletId }),
      });
      if (!res.ok) throw new Error('Failed to lock wallet');
      await fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWallets]);

  const deleteWallet = useCallback(async (walletId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blockchain/wallets/${walletId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete wallet');
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
  };
}
