/**
 * Session Validator
 *
 * Ensures wallet sessions are valid before performing sensitive operations
 */

import { getWalletSession, isTokenExpired } from './jwt-manager';

/**
 * Validates that a wallet session exists and is not expired
 *
 * @returns Object with validation status and session info
 */
export async function validateWalletSession(): Promise<{
  isValid: boolean;
  isExpired: boolean;
  session: any | null;
  message?: string;
}> {
  const session = await getWalletSession();

  if (!session) {
    return {
      isValid: false,
      isExpired: false,
      session: null,
      message: 'No wallet session found. Please unlock your wallet.',
    };
  }

  const expired = isTokenExpired(session);

  if (expired) {
    return {
      isValid: false,
      isExpired: true,
      session: null,
      message: 'Wallet session has expired. Please unlock your wallet again.',
    };
  }

  return {
    isValid: true,
    isExpired: false,
    session,
  };
}

/**
 * Gets the time remaining until session expires
 *
 * @returns Time remaining in seconds, or null if no session
 */
export async function getSessionTimeRemaining(): Promise<number | null> {
  const session = await getWalletSession();

  if (!session) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = session.expires_at - now;

  return remaining > 0 ? remaining : 0;
}

/**
 * Checks if session will expire soon (within 2 minutes)
 *
 * @returns True if session expires in less than 2 minutes
 */
export async function isSessionExpiringSoon(): Promise<boolean> {
  const remaining = await getSessionTimeRemaining();

  if (remaining === null) {
    return true; // No session = expired
  }

  const TWO_MINUTES = 2 * 60;
  return remaining < TWO_MINUTES;
}
