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
}

const WalletSessionContext = createContext<WalletSessionState | undefined>(undefined);

export function WalletSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<WalletSessionState, 'refreshSession'>>({
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
      const res = await fetch('/api/blockchain/wallets/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setState({ ...data, loading: false });
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

  useEffect(() => {
    refreshSession();
    const interval = setInterval(refreshSession, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <WalletSessionContext.Provider value={{ ...state, refreshSession }}>
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
