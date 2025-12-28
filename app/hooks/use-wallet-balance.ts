'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { WalletBalanceResponse } from '@/app/lib/cardano/types';
import { useWalletSession } from '@/app/contexts/wallet-session-context';

export interface UseWalletBalanceOptions {
  walletId: string | null;
  autoRefresh?: boolean;      // Enable automatic refresh (default: true)
  refreshInterval?: number;    // Refresh interval in milliseconds (default: 30000 = 30s)
  enabled?: boolean;           // Enable/disable the hook (default: true)
}

export interface UseWalletBalanceReturn {
  balance: WalletBalanceResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Custom hook for fetching and managing wallet balance with auto-refresh
 *
 * Features:
 * - Auto-refresh at configurable intervals (default: 30 seconds)
 * - Refreshes automatically when wallet is unlocked
 * - Manual refresh capability
 * - Request cancellation to prevent race conditions
 * - Loading and error states
 * - Automatic cleanup on unmount
 *
 * @param options - Configuration options
 * @returns Balance data, loading state, error state, and refresh function
 *
 * @example
 * ```tsx
 * const { balance, loading, error, refresh } = useWalletBalance({
 *   walletId: 'wallet123',
 *   autoRefresh: true,
 *   enabled: !isLocked,
 * });
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error} />;
 * return <div>{balance?.balance_lovelace} lovelace</div>;
 * ```
 */
export function useWalletBalance({
  walletId,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds default (matches session refresh interval)
  enabled = true,
}: UseWalletBalanceOptions): UseWalletBalanceReturn {
  const [balance, setBalance] = useState<WalletBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { isUnlocked } = useWalletSession();
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch balance from API
   * Cancels any pending requests before starting a new one
   */
  const refresh = useCallback(async () => {
    // Don't fetch if wallet ID is missing or hook is disabled
    if (!walletId || !enabled) {
      setBalance(null);
      return;
    }

    // Cancel any pending requests to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/blockchain/wallets/${walletId}/balance`, {
        cache: 'no-store', // Always fetch fresh data
        signal: abortControllerRef.current.signal,
        credentials: 'same-origin', // Explicitly include cookies
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({
          error: 'Failed to fetch balance'
        }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch balance`);
      }

      const data: WalletBalanceResponse = await res.json();
      setBalance(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      // Ignore abort errors (from request cancellation)
      if (err.name === 'AbortError') {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching balance';
      setError(errorMessage);
      console.error('Balance fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [walletId, enabled]);

  /**
   * Auto-refresh effect
   * Sets up interval-based automatic refresh
   */
  useEffect(() => {
    if (!enabled || !walletId || !autoRefresh) {
      return;
    }

    // Initial fetch
    refresh();

    // Set up interval for auto-refresh
    const interval = setInterval(refresh, refreshInterval);

    // Cleanup: clear interval and abort pending requests
    return () => {
      clearInterval(interval);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [walletId, autoRefresh, refreshInterval, enabled, refresh]);

  /**
   * Refresh when wallet unlocks
   * Ensures balance is fetched immediately after unlock
   */
  useEffect(() => {
    if (isUnlocked && walletId && enabled) {
      refresh();
    }
  }, [isUnlocked, walletId, enabled, refresh]);

  return {
    balance,
    loading,
    error,
    refresh,
    lastUpdated,
  };
}
