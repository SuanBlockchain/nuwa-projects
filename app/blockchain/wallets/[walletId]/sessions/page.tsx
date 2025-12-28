'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ShieldCheckIcon,
  ComputerDesktopIcon,
  ClockIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  getAllActiveSessions,
  clearSessionKey,
  formatTimeRemaining,
  getSessionTimeRemaining
} from '@/app/lib/cardano/session-key-manager';
import type { SessionKeyData } from '@/app/lib/cardano/session-key-manager';
import { WalletBalanceHeader } from '@/app/blockchain/components/wallet-balance-header';

export default function SessionManagementPage() {
  const router = useRouter();
  const params = useParams();
  const walletId = params?.walletId as string;

  const [localSessions, setLocalSessions] = useState<Array<{ walletId: string; data: SessionKeyData }>>([]);
  const [backendSessions, setBackendSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [walletId]);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load local sessions from localStorage
      const allLocalSessions = getAllActiveSessions();
      const filteredLocal = walletId
        ? allLocalSessions.filter(s => s.walletId === walletId)
        : allLocalSessions;

      setLocalSessions(filteredLocal);

      // Try to load backend sessions (optional, may not be implemented yet)
      if (walletId) {
        try {
          const res = await fetch(`/api/blockchain/wallets/${walletId}/sessions/auto-unlock`, {
            credentials: 'same-origin',
          });
          if (res.ok) {
            const response = await res.json();
            setBackendSessions(response.sessions || []);
          }
        } catch (backendError) {
          console.log('Backend session listing not available:', backendError);
          // This is optional, so we don't show an error to the user
        }
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeLocal = async (sessionWalletId: string) => {
    if (!confirm('Revoke this auto-unlock session? You will need to enter your password on next login.')) {
      return;
    }

    try {
      clearSessionKey(sessionWalletId);
      await loadSessions();
    } catch (err) {
      console.error('Failed to revoke session:', err);
      setError('Failed to revoke session');
    }
  };

  const handleRevokeBackend = async (sessionId: string) => {
    if (!confirm('Revoke this backend session? This will disable auto-unlock for this session.')) {
      return;
    }

    try {
      const res = await fetch(`/api/blockchain/wallets/${walletId}/sessions/auto-unlock/${sessionId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to revoke session');
      }

      await loadSessions();
    } catch (err: any) {
      console.error('Failed to revoke backend session:', err);
      setError(err.message || 'Failed to revoke session');
    }
  };

  const handleRevokeAll = async () => {
    if (!confirm('Revoke ALL auto-unlock sessions? You will need to enter your password on all devices.')) {
      return;
    }

    try {
      // Revoke all local sessions for this wallet
      localSessions.forEach(session => {
        clearSessionKey(session.walletId);
      });

      await loadSessions();
    } catch (err) {
      console.error('Failed to revoke all sessions:', err);
      setError('Failed to revoke all sessions');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Auto-Unlock Sessions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your active auto-unlock sessions
              </p>
            </div>
          </div>

          {/* Wallet Balance Header */}
          <WalletBalanceHeader />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Local Sessions */}
            {localSessions.length > 0 ? (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Active Sessions ({localSessions.length})
                  </h2>
                  {localSessions.length > 1 && (
                    <button
                      onClick={handleRevokeAll}
                      className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-all flex items-center gap-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Revoke All
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {localSessions.map((session, index) => {
                    const timeRemaining = getSessionTimeRemaining(session.walletId);
                    const isExpiring = timeRemaining ? timeRemaining < 24 * 60 * 60 * 1000 : false;

                    return (
                      <div
                        key={session.data.frontendSessionId}
                        className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                              <ComputerDesktopIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {session.data.walletName || `Wallet ${session.walletId.substring(0, 8)}...`}
                                </h3>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded">
                                  Active
                                </span>
                              </div>

                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>
                                    Created: {new Date(session.data.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ClockIcon className="w-4 h-4" />
                                  <span>
                                    Expires: {new Date(session.data.expiresAt).toLocaleString()}
                                  </span>
                                </div>
                                {timeRemaining && timeRemaining > 0 && (
                                  <div className={`flex items-center gap-2 ${isExpiring ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                                    <ClockIcon className="w-4 h-4" />
                                    <span>
                                      Time remaining: {formatTimeRemaining(timeRemaining)}
                                      {isExpiring && ' (expiring soon)'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRevokeLocal(session.walletId)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-all flex items-center gap-2"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Revoke
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-surface-darker rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Active Sessions
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Enable auto-unlock to see your sessions here
                </p>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)]"
                >
                  Go Back
                </button>
              </div>
            )}

            {/* Backend Sessions (Optional) */}
            {backendSessions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Backend Sessions ({backendSessions.length})
                </h2>
                <div className="space-y-4">
                  {backendSessions.map((session) => (
                    <div
                      key={session.session_id}
                      className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Session {session.session_id.substring(0, 8)}...
                            </h3>
                            {session.is_current && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                                Current
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p>User ID: {session.user_id}</p>
                            {session.ip_address && <p>IP: {session.ip_address}</p>}
                            <p>Created: {new Date(session.created_at).toLocaleString()}</p>
                            <p>Expires: {new Date(session.expires_at).toLocaleString()}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRevokeBackend(session.session_id)}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-all flex items-center gap-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
