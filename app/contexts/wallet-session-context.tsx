'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletSessionState {
  isUnlocked: boolean;
  walletId: string | null;
  walletName: string | null;
  walletRole: string | null;
  expiresAt: number | null;
  hasCoreWallet: boolean;
  loading: boolean;
  refreshSession: () => Promise<void>;
  ensureSessionValid: () => Promise<boolean>;
}

const WalletSessionContext = createContext<WalletSessionState | undefined>(undefined);

export function WalletSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<WalletSessionState, 'refreshSession' | 'ensureSessionValid'>>({
    isUnlocked: false,
    walletId: null,
    walletName: null,
    walletRole: null,
    expiresAt: null,
    hasCoreWallet: false,
    loading: true,
  });

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/blockchain/wallets/session', {
        cache: 'no-store',
        credentials: 'same-origin'
      });
      if (res.ok) {
        const data = await res.json();
        setState({ ...data, loading: false });
      } else {
        // Session not found or expired
        setState({
          isUnlocked: false,
          walletId: null,
          walletName: null,
          walletRole: null,
          expiresAt: null,
          hasCoreWallet: false,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setState({
        isUnlocked: false,
        walletId: null,
        walletName: null,
        walletRole: null,
        expiresAt: null,
        hasCoreWallet: false,
        loading: false,
      });
    }
  };

  /**
   * Ensures the session is valid by refreshing it if needed
   * Call this before sensitive operations like signing transactions
   *
   * @returns true if session is valid, false otherwise
   */
  const ensureSessionValid = async (): Promise<boolean> => {
    try {
      // First, check the actual session from the server (not just frontend state)
      console.log('Checking actual session from server...');
      const sessionCheck = await fetch('/api/blockchain/wallets/session', {
        cache: 'no-store',
        credentials: 'same-origin',
      });

      if (!sessionCheck.ok) {
        console.log('No active session on server');
        // Update frontend state to reflect this
        await refreshSession();
        return false;
      }

      const sessionData = await sessionCheck.json();

      if (!sessionData.isUnlocked || !sessionData.expiresAt) {
        console.log('Session check returned invalid data');
        return false;
      }

      console.log('Session found. Expiration:', new Date(sessionData.expiresAt * 1000).toISOString());

      // Check if session will expire soon (within 5 minutes)
      const now = Math.floor(Date.now() / 1000);
      const FIVE_MINUTES = 5 * 60;
      const willExpireSoon = sessionData.expiresAt <= (now + FIVE_MINUTES);

      if (willExpireSoon) {
        console.log('Session expiring soon, refreshing...');
        // Try to refresh the session
        const res = await fetch('/api/blockchain/wallets/session/refresh', {
          method: 'POST',
          credentials: 'same-origin',
        });

        if (res.ok) {
          console.log('Session refreshed successfully');
          // Update the session state
          await refreshSession();
          return true;
        } else {
          console.error('Failed to refresh session');
          return false;
        }
      }

      console.log('Session is valid and not expiring soon');
      // Update frontend state to match
      if (!state.isUnlocked) {
        await refreshSession();
      }
      return true;
    } catch (error) {
      console.error('Error ensuring session validity:', error);
      return false;
    }
  };

  useEffect(() => {
    refreshSession();

    // Refresh session state every 30s
    const stateInterval = setInterval(refreshSession, 30000);

    // Also refresh the actual session token every 5 minutes to keep it alive
    const tokenRefreshInterval = setInterval(async () => {
      if (state.isUnlocked) {
        await fetch('/api/blockchain/wallets/session/refresh', {
          method: 'POST',
          credentials: 'same-origin',
        }).catch(err => console.error('Background session refresh failed:', err));
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(stateInterval);
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  return (
    <WalletSessionContext.Provider value={{ ...state, refreshSession, ensureSessionValid }}>
      {children}
    </WalletSessionContext.Provider>
  );
}

export function useWalletSession() {
  const context = useContext(WalletSessionContext);
  if (!context) {
    throw new Error('useWalletSession must be used within WalletSessionProvider');
  }
  return context;
}
