/**
 * Session Key Manager
 *
 * Manages cryptographically secure session keys for wallet auto-unlock.
 * Session keys are stored in localStorage and used to encrypt wallet passwords
 * on the backend for seamless auto-unlock functionality.
 *
 * Security model:
 * - Session keys are generated client-side (32 bytes, base64url encoded)
 * - Keys are stored in localStorage (browser-specific)
 * - Backend stores encrypted password (encrypted with session key)
 * - Attacker needs BOTH session key (frontend) AND encrypted password (backend)
 * - Sessions expire after configured time
 * - Transaction signing ALWAYS requires password re-entry
 */

const STORAGE_PREFIX = 'cardano_auto_unlock_';
const SESSION_KEY_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Session data stored in localStorage
 */
export interface SessionKeyData {
  sessionKey: string;
  frontendSessionId: string;
  expiresAt: string;
  walletName?: string;
  createdAt: string;
}

/**
 * Generate a cryptographically secure session key
 *
 * @returns Base64url-encoded session key (32 bytes)
 */
export function generateSessionKey(): string {
  if (typeof window === 'undefined') {
    throw new Error('generateSessionKey can only be called in the browser');
  }

  // Use Web Crypto API for cryptographically secure random bytes
  const array = new Uint8Array(SESSION_KEY_LENGTH);
  crypto.getRandomValues(array);

  // Convert to base64url format (URL-safe, no padding)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate a unique frontend session ID
 *
 * @returns Unique session identifier
 */
export function generateFrontendSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${random}`;
}

/**
 * Store session key and metadata for a wallet
 *
 * @param walletId - Wallet ID
 * @param sessionKey - Generated session key
 * @param frontendSessionId - Frontend session identifier
 * @param expiresAt - ISO date string when session expires
 * @param walletName - Optional wallet name for display
 */
export function storeSessionKey(
  walletId: string,
  sessionKey: string,
  frontendSessionId: string,
  expiresAt: string,
  walletName?: string
): void {
  if (typeof window === 'undefined') {
    console.warn('storeSessionKey called on server side, skipping');
    return;
  }

  try {
    const data: SessionKeyData = {
      sessionKey,
      frontendSessionId,
      expiresAt,
      walletName,
      createdAt: new Date().toISOString(),
    };

    const key = `${STORAGE_PREFIX}${walletId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store session key:', error);
    throw new Error('Failed to store session key in localStorage');
  }
}

/**
 * Retrieve session key for auto-unlock
 *
 * @param walletId - Wallet ID
 * @returns Session data or null if not found/expired
 */
export function getSessionKey(walletId: string): SessionKeyData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const key = `${STORAGE_PREFIX}${walletId}`;
    const stored = localStorage.getItem(key);

    if (!stored) {
      return null;
    }

    const data: SessionKeyData = JSON.parse(stored);

    // Validate data structure
    if (!data.sessionKey || !data.frontendSessionId || !data.expiresAt) {
      console.warn('Invalid session data structure, clearing');
      clearSessionKey(walletId);
      return null;
    }

    // Check if expired
    const expiresAt = new Date(data.expiresAt);
    const now = new Date();

    if (expiresAt <= now) {
      console.log('Session expired, clearing');
      clearSessionKey(walletId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to retrieve session key:', error);
    clearSessionKey(walletId);
    return null;
  }
}

/**
 * Remove session key (disable auto-unlock)
 *
 * @param walletId - Wallet ID
 */
export function clearSessionKey(walletId: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const key = `${STORAGE_PREFIX}${walletId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear session key:', error);
  }
}

/**
 * Check if auto-unlock is available for wallet
 *
 * @param walletId - Wallet ID
 * @returns True if auto-unlock is enabled and not expired
 */
export function hasAutoUnlock(walletId: string): boolean {
  const session = getSessionKey(walletId);
  return session !== null;
}

/**
 * Get time remaining until session expires
 *
 * @param walletId - Wallet ID
 * @returns Time remaining in milliseconds, or null if no session
 */
export function getSessionTimeRemaining(walletId: string): number | null {
  const session = getSessionKey(walletId);

  if (!session) {
    return null;
  }

  const expiresAt = new Date(session.expiresAt);
  const now = new Date();
  const remaining = expiresAt.getTime() - now.getTime();

  return remaining > 0 ? remaining : 0;
}

/**
 * Format time remaining for display
 *
 * @param milliseconds - Time in milliseconds
 * @returns Formatted string (e.g., "2 days", "5 hours", "30 minutes")
 */
export function formatTimeRemaining(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return 'less than a minute';
  }
}

/**
 * Check if session is expiring soon (< 24 hours)
 *
 * @param walletId - Wallet ID
 * @returns True if session expires in less than 24 hours
 */
export function isSessionExpiringSoon(walletId: string): boolean {
  const remaining = getSessionTimeRemaining(walletId);

  if (remaining === null) {
    return false;
  }

  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  return remaining < TWENTY_FOUR_HOURS && remaining > 0;
}

/**
 * Clear all expired session keys (cleanup)
 * Call this periodically or on app initialization
 */
export function clearExpiredSessions(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const now = new Date();
    const keysToRemove: string[] = [];

    // Find all auto-unlock keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const data: SessionKeyData = JSON.parse(stored);
            const expiresAt = new Date(data.expiresAt);

            if (expiresAt <= now) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // Invalid data, mark for removal
          keysToRemove.push(key);
        }
      }
    }

    // Remove expired keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} expired session(s)`);
    }
  } catch (error) {
    console.error('Failed to clear expired sessions:', error);
  }
}

/**
 * Get all active auto-unlock sessions
 *
 * @returns Array of wallet IDs with active sessions
 */
export function getAllActiveSessions(): Array<{ walletId: string; data: SessionKeyData }> {
  if (typeof window === 'undefined') {
    return [];
  }

  const sessions: Array<{ walletId: string; data: SessionKeyData }> = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(STORAGE_PREFIX)) {
        const walletId = key.substring(STORAGE_PREFIX.length);
        const data = getSessionKey(walletId);

        if (data) {
          sessions.push({ walletId, data });
        }
      }
    }
  } catch (error) {
    console.error('Failed to get active sessions:', error);
  }

  return sessions;
}

/**
 * Clear all auto-unlock sessions (for logout)
 */
export function clearAllSessions(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const keysToRemove: string[] = [];

    // Find all auto-unlock keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    // Remove all keys
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    if (keysToRemove.length > 0) {
      console.log(`Cleared ${keysToRemove.length} session(s)`);
    }
  } catch (error) {
    console.error('Failed to clear all sessions:', error);
  }
}
