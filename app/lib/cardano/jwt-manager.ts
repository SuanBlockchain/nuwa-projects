import { cookies } from 'next/headers';
import type { JWTTokenResponse } from './types';

const SESSION_COOKIE_NAME = 'cardano_wallet_session';

export interface WalletSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  wallet_id: string;
  wallet_name: string;
  wallet_role: string;
}

/**
 * Stores complete wallet session data in httpOnly cookie
 */
export async function setWalletSession(tokenResponse: JWTTokenResponse): Promise<void> {
  const session: WalletSession = {
    access_token: tokenResponse.access_token,
    refresh_token: tokenResponse.refresh_token,
    expires_at: tokenResponse.expires_at,
    wallet_id: tokenResponse.wallet_id,
    wallet_name: tokenResponse.wallet_name,
    wallet_role: tokenResponse.wallet_role,
  };

  // Encode as base64 to avoid cookie parsing issues
  const encoded = Buffer.from(JSON.stringify(session)).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: tokenResponse.expires_in, // Use token lifetime
  });
}

/**
 * Retrieves wallet session from cookie
 */
export async function getWalletSession(): Promise<WalletSession | null> {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!encoded) {
    return null;
  }

  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const session = JSON.parse(decoded) as WalletSession;
    return session;
  } catch (error) {
    console.error('Failed to parse wallet session:', error);
    return null;
  }
}

/**
 * Clears wallet session cookie
 */
export async function clearWalletSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Checks if token is expired (with 60s buffer)
 */
export function isTokenExpired(session: WalletSession): boolean {
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  const buffer = 60; // 60 second buffer
  return session.expires_at <= (now + buffer);
}

/**
 * Gets session only if it's a CORE wallet
 */
export async function getCoreWalletSession(): Promise<WalletSession | null> {
  const session = await getWalletSession();

  if (!session) {
    return null;
  }

  if (session.wallet_role !== 'core') {
    return null;
  }

  return session;
}

// Legacy functions for backward compatibility
export async function setWalletJWT(token: string) {
  console.warn('setWalletJWT is deprecated, use setWalletSession instead');
}

export async function getWalletJWT(): Promise<string | undefined> {
  const session = await getWalletSession();
  return session?.access_token;
}

export async function clearWalletJWT() {
  await clearWalletSession();
}
