import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * List all auto-unlock sessions for a wallet
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    await requireAuth();
    const { walletId } = await params;

    // Check ownership
    const hasAccess = await checkWalletOwnership(walletId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to view sessions for this wallet' },
        { status: 403 }
      );
    }

    try {
      const response = await cardanoAPI.wallets.listAutoUnlockSessions(walletId);
      return NextResponse.json(response);
    } catch (apiError: any) {
      console.error('Backend list sessions failed:', apiError);
      // Return empty list if backend doesn't support this yet
      return NextResponse.json({ sessions: [], total: 0 });
    }
  } catch (error: any) {
    console.error('Error listing sessions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list sessions' },
      { status: error.status || 500 }
    );
  }
}
