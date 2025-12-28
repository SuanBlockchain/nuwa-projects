/**
 * Session Cleanup Utility
 *
 * Provides background cleanup of expired auto-unlock sessions.
 * Should be initialized once on app startup.
 */

import { clearExpiredSessions } from './session-key-manager';

let cleanupIntervalId: NodeJS.Timeout | null = null;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Initialize session cleanup background task
 *
 * Call this once on app initialization (e.g., in root layout or app component).
 * It will clean expired sessions immediately and then periodically every hour.
 */
export function initSessionCleanup(): void {
  if (typeof window === 'undefined') {
    return; // Only run in browser
  }

  // Prevent multiple initializations
  if (cleanupIntervalId !== null) {
    console.warn('Session cleanup already initialized');
    return;
  }

  // Clean expired sessions immediately
  try {
    clearExpiredSessions();
  } catch (error) {
    console.error('Failed to clean expired sessions on init:', error);
  }

  // Set up periodic cleanup
  cleanupIntervalId = setInterval(() => {
    try {
      clearExpiredSessions();
    } catch (error) {
      console.error('Failed to clean expired sessions:', error);
    }
  }, CLEANUP_INTERVAL_MS);

  console.log('Session cleanup initialized (runs every hour)');
}

/**
 * Stop the cleanup background task
 *
 * Call this when shutting down the app or for testing purposes.
 */
export function stopSessionCleanup(): void {
  if (cleanupIntervalId !== null) {
    clearInterval(cleanupIntervalId);
    cleanupIntervalId = null;
    console.log('Session cleanup stopped');
  }
}

/**
 * Get cleanup status
 *
 * @returns True if cleanup is running, false otherwise
 */
export function isCleanupRunning(): boolean {
  return cleanupIntervalId !== null;
}
