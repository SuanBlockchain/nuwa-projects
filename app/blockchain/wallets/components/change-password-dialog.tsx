'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { ShieldCheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import { changePasswordSchema } from '@/app/lib/cardano/validation';
import { useWallets } from '@/app/hooks/use-wallets';
import { useWalletSession } from '@/app/contexts/wallet-session-context';
import type { z } from 'zod';

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
  walletId: string;
  walletName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ChangePasswordDialog({
  walletId,
  walletName,
  open,
  onOpenChange,
  onSuccess,
}: ChangePasswordDialogProps) {
  const { changePassword, loading } = useWallets();
  const { refreshSession } = useWalletSession();
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError(null);
    try {
      await changePassword(walletId, data.currentPassword, data.newPassword);

      // Backend locks the wallet after password change
      // Refresh session to clear the unlocked state
      await refreshSession();

      // Show success message
      setShowSuccess(true);
      reset();

      // Auto-close after 3 seconds (give user time to read the message)
      setTimeout(() => {
        onSuccess?.();
        onOpenChange(false);
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Change password error:', err);
      setError(
        err.message || 'Failed to change password. Please check your current password and try again.'
      );
    }
  };

  const handleClose = (open: boolean) => {
    if (!loading) {
      onOpenChange(open);
      if (!open) {
        reset();
        setError(null);
        setShowSuccess(false);
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
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
                Password Changed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-3">
                Your wallet password has been updated successfully.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4 max-w-md">
                <p className="text-sm text-blue-900 dark:text-blue-300 text-center">
                  For security, your wallet has been locked. Please unlock it again with your new password.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <KeyIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                    Change Password
                  </Dialog.Title>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {walletName}
                  </p>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Current Password Input */}
              <div className="mb-4">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    {...register('currentPassword')}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-border-dark rounded-xl bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password Input */}
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-border-dark rounded-xl bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword ? (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Must be 8-128 characters and include at least one digit
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-900 dark:text-white mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    placeholder="Re-enter your new password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-border-dark rounded-xl bg-white dark:bg-background-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-surface-darker hover:bg-gray-200 dark:hover:bg-surface-dark text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] px-4 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(19,236,146,0.3)] hover:shadow-[0_0_25px_rgba(19,236,146,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <KeyIcon className="w-5 h-5" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
