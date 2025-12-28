'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ShieldCheckIcon, LockClosedIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { generateSessionKey, generateFrontendSessionId, storeSessionKey } from '@/app/lib/cardano/session-key-manager';

interface EnableAutoUnlockDialogProps {
  walletId: string;
  walletName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onSkip?: () => void;
}

export default function EnableAutoUnlockDialog({
  walletId,
  walletName,
  open,
  onOpenChange,
  onSuccess,
  onSkip,
}: EnableAutoUnlockDialogProps) {
  const [password, setPassword] = useState('');
  const [expiresHours, setExpiresHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const expirationOptions = [
    { label: '24 hours (Recommended)', value: 24 },
    { label: '7 days', value: 24 * 7 },
    { label: '30 days', value: 24 * 30 },
  ];

  const handleEnable = async () => {
    if (!password) {
      setError('Please enter your wallet password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate session key and frontend session ID
      const sessionKey = generateSessionKey();
      const frontendSessionId = generateFrontendSessionId();

      // Call API route to store encrypted password
      const res = await fetch(`/api/blockchain/wallets/${walletId}/session/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          session_key: sessionKey,
          frontend_session_id: frontendSessionId,
          expires_hours: expiresHours,
        }),
        credentials: 'same-origin',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to enable auto-unlock');
      }

      const response = await res.json();

      if (response.success) {
        // Store session key locally
        storeSessionKey(
          walletId,
          sessionKey,
          frontendSessionId,
          response.expires_at,
          walletName
        );

        // Show success message
        setShowSuccess(true);
        setPassword('');

        // Auto-close after 2 seconds
        setTimeout(() => {
          onSuccess?.();
          onOpenChange(false);
          setShowSuccess(false);
        }, 2000);
      } else {
        setError('Failed to enable auto-unlock');
      }
    } catch (err: any) {
      console.error('Auto-unlock setup error:', err);
      setError(
        err.message || 'Failed to enable auto-unlock. Please check your password and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onOpenChange(false);
    setPassword('');
    setError(null);
  };

  const handleClose = (open: boolean) => {
    if (!loading) {
      onOpenChange(open);
      if (!open) {
        setPassword('');
        setError(null);
        setShowSuccess(false);
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-8 w-full max-w-lg shadow-2xl z-50">
          {/* Close button */}
          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </Dialog.Close>

          {/* Success State */}
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Auto-Unlock Enabled!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Your wallet will automatically unlock on your next login.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheckIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                    Enable Auto-Unlock
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Skip password entry on future logins
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-300">
                    <p className="font-semibold mb-2">How Auto-Unlock Works:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Your wallet password is encrypted and stored securely</li>
                      <li>• Future logins won't require your wallet password</li>
                      <li>• Sessions expire automatically for security</li>
                      <li>• You can revoke access anytime in settings</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <LockClosedIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900 dark:text-yellow-300">
                    <p className="font-semibold">Important:</p>
                    <p className="text-xs mt-1">
                      Transaction signing will ALWAYS require your password for security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Expiration Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Session Duration
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {expirationOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setExpiresHours(option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        expiresHours === option.value
                          ? 'bg-primary text-black shadow-md'
                          : 'bg-gray-100 dark:bg-surface-darker text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-dark'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Verify Wallet Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && password && handleEnable()}
                  placeholder="Enter your wallet password"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-border-dark rounded-xl bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-surface-darker hover:bg-gray-200 dark:hover:bg-surface-dark text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip for Now
                </button>
                <button
                  onClick={handleEnable}
                  disabled={loading || !password}
                  className="flex-[2] px-4 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Enabling...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="w-5 h-5" />
                      Enable Auto-Unlock
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
