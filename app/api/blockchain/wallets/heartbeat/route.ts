import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { getWalletSession } from '@/app/lib/cardano/jwt-manager';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Session heartbeat - Keep session alive and check validity
 *
 * Call this periodically to:
 * - Verify session is still valid
 * - Keep session from expiring (if backend supports TTL refresh)
 * - Get session expiration info
 */
export async function POST(req: Request) {
  try {
    await requireAuth();

    const { wallet_id } = await req.json();

    if (!wallet_id) {
      return NextResponse.json(
        { error: 'wallet_id is required' },
        { status: 400 }
      );
    }

    // Check ownership
    const hasAccess = await checkWalletOwnership(wallet_id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Verify session exists locally
    const session = await getWalletSession();
    if (!session || session.wallet_id !== wallet_id) {
      return NextResponse.json({
        success: false,
        session_valid: false,
        message: 'No active session for this wallet'
      });
    }

    // Check with backend
    const heartbeat = await cardanoAPI.wallets.heartbeat(wallet_id);

    return NextResponse.json(heartbeat);
  } catch (error: any) {
    console.error('Error in heartbeat:', error);
    return NextResponse.json(
      { error: error.message || 'Heartbeat failed' },
      { status: error.status || 500 }
    );
  }
}
