'use client';

import { useState } from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { hasAutoUnlock, getSessionKey, clearSessionKey, getSessionTimeRemaining, formatTimeRemaining } from '@/app/lib/cardano/session-key-manager';
import EnableAutoUnlockDialog from './enable-auto-unlock-dialog';

interface AutoUnlockSettingsProps {
  walletId: string;
  walletName: string;
  onUpdate?: () => void;
}

export default function AutoUnlockSettings({ walletId, walletName, onUpdate }: AutoUnlockSettingsProps) {
  const [showEnableDialog, setShowEnableDialog] = useState(false);
  const isAutoUnlockEnabled = hasAutoUnlock(walletId);
  const sessionData = isAutoUnlockEnabled ? getSessionKey(walletId) : null;
  const timeRemaining = getSessionTimeRemaining(walletId);

  const handleDisableAutoUnlock = () => {
    if (confirm('Disable auto-unlock for this wallet? You will need to enter your password on next login.')) {
      clearSessionKey(walletId);
      onUpdate?.();
    }
  };

  const handleEnableSuccess = () => {
    onUpdate?.();
  };

  return (
    <>
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isAutoUnlockEnabled
                ? 'bg-primary/10'
                : 'bg-gray-100 dark:bg-surface-darker'
            }`}>
              {isAutoUnlockEnabled ? (
                <ShieldCheckIcon className="w-7 h-7 text-primary" />
              ) : (
                <ShieldExclamationIcon className="w-7 h-7 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Auto-Unlock</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isAutoUnlockEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isAutoUnlockEnabled
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>
            {isAutoUnlockEnabled ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Status Content */}
        {isAutoUnlockEnabled && sessionData ? (
          <>
            {/* Session Info */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl">
              <div className="flex items-start gap-3">
                <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    Session Active
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                    <p>
                      <span className="font-medium">Expires:</span>{' '}
                      {new Date(sessionData.expiresAt).toLocaleString()}
                    </p>
                    {timeRemaining && timeRemaining > 0 && (
                      <p>
                        <span className="font-medium">Time remaining:</span>{' '}
                        {formatTimeRemaining(timeRemaining)}
                      </p>
                    )}
                    <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
                      Your wallet will automatically unlock without requiring a password.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl">
              <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900 dark:text-yellow-300">
                  <p className="font-semibold mb-1">Security Reminder</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    Transaction signing will always require your password for security.
                  </p>
                </div>
              </div>
            </div>

            {/* Disable Button */}
            <button
              onClick={handleDisableAutoUnlock}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-surface-darker hover:bg-gray-200 dark:hover:bg-surface-dark text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <XMarkIcon className="w-5 h-5" />
              Disable Auto-Unlock
            </button>
          </>
        ) : (
          <>
            {/* Disabled State Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Auto-unlock is currently disabled. Enable it to skip entering your wallet password on future logins.
              </p>

              {/* Benefits List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Benefits:</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Skip password entry when unlocking wallet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Sessions expire automatically for security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Transaction signing still requires password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Can be revoked anytime</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Enable Button */}
            <button
              onClick={() => setShowEnableDialog(true)}
              className="w-full px-4 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)] flex items-center justify-center gap-2"
            >
              <ShieldCheckIcon className="w-5 h-5" />
              Enable Auto-Unlock
            </button>
          </>
        )}
      </div>

      {/* Enable Auto-Unlock Dialog */}
      <EnableAutoUnlockDialog
        walletId={walletId}
        walletName={walletName}
        open={showEnableDialog}
        onOpenChange={setShowEnableDialog}
        onSuccess={handleEnableSuccess}
        onSkip={() => setShowEnableDialog(false)}
      />
    </>
  );
}
