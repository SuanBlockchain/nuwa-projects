import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { getWalletSession, clearWalletSession } from '@/app/lib/cardano/jwt-manager';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Lock wallet by revoking the current session
 *
 * New session-based locking:
 * - Locks wallet by revoking the current session token
 * - Wallet auto-locks when all sessions are revoked/expired
 * - Multiple sessions can exist, so locking only affects current client
 */
export async function POST(req: Request) {
  try {
    await requireAuth();
    const { wallet_id } = await req.json();

    // Check ownership
    const hasAccess = await checkWalletOwnership(wallet_id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to lock this wallet' },
        { status: 403 }
      );
    }

    // Check if we have a session to revoke
    const session = await getWalletSession();
    if (!session) {
      return NextResponse.json(
        { error: 'No active session to lock' },
        { status: 400 }
      );
    }

    // Revoke current session token on backend
    // Note: Backend validates that the token belongs to this wallet
    try {
      await cardanoAPI.wallets.revoke();
      console.log(`Session revoked for wallet ${wallet_id}`);
    } catch (revokeError: any) {
      console.error('Token revocation failed:', revokeError);

      // If backend says no active session, clear our local session too
      if (revokeError.status === 401 || revokeError.status === 404) {
        await clearWalletSession();
        return NextResponse.json(
          { error: 'No active session found' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: revokeError.message || 'Failed to revoke session' },
        { status: revokeError.status || 500 }
      );
    }

    // Clear session cookie locally
    await clearWalletSession();

    return NextResponse.json({
      success: true,
      message: 'Wallet locked (session revoked)'
    });
  } catch (error: any) {
    console.error('Error locking wallet:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to lock wallet' },
      { status: error.status || 500 }
    );
  }
}
