import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { getWalletSession, setWalletSession, isTokenExpired } from '@/app/lib/cardano/jwt-manager';

/**
 * POST /api/blockchain/wallets/session/refresh
 *
 * Refreshes the wallet session if it exists and is about to expire
 * This endpoint can be called periodically to keep sessions alive
 */
export async function POST() {
  try {
    await requireAuth();

    const session = await getWalletSession();

    if (!session) {
      return NextResponse.json(
        { error: 'No active wallet session' },
        { status: 401 }
      );
    }

    // Check if token is expired or will expire soon (within 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    const FIVE_MINUTES = 5 * 60;
    const willExpireSoon = session.expires_at <= (now + FIVE_MINUTES);

    if (willExpireSoon || isTokenExpired(session)) {
      // Try to refresh the token
      const BASE_URL = process.env.CARDANO_API_URL;
      const API_KEY = process.env.CARDANO_API_KEY;

      try {
        const response = await fetch(`${BASE_URL}/api/v1/wallets/token/refresh`, {
          method: 'POST',
          headers: {
            'x-api-key': API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        });

        if (response.ok) {
          const tokenResponse = await response.json();

          // Update session with new tokens
          await setWalletSession({
            ...tokenResponse,
            wallet_id: session.wallet_id,
            wallet_name: session.wallet_name,
            wallet_role: session.wallet_role,
          });

          return NextResponse.json({
            success: true,
            message: 'Session refreshed successfully',
            expires_at: tokenResponse.expires_at,
          });
        } else {
          return NextResponse.json(
            { error: 'Failed to refresh session. Please unlock your wallet again.' },
            { status: 401 }
          );
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        return NextResponse.json(
          { error: 'Failed to refresh session' },
          { status: 500 }
        );
      }
    }

    // Session is still valid, no refresh needed
    return NextResponse.json({
      success: true,
      message: 'Session is still valid',
      expires_at: session.expires_at,
    });
  } catch (error) {
    console.error('Error refreshing session:', error);
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    );
  }
}
