import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Get all active sessions for a wallet
 *
 * Returns list of all active sessions across all devices/browsers
 */
export async function GET(req: Request) {
  try {
    await requireAuth();

    // Get wallet_id from query params
    const { searchParams } = new URL(req.url);
    const wallet_id = searchParams.get('wallet_id');

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
        { error: 'Unauthorized to view sessions for this wallet' },
        { status: 403 }
      );
    }

    // Get sessions from backend
    const sessions = await cardanoAPI.wallets.getSessions(wallet_id);

    return NextResponse.json(sessions);
  } catch (error: any) {
    console.error('Error fetching wallet sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sessions' },
      { status: error.status || 500 }
    );
  }
}
