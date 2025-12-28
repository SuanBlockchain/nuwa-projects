import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Revoke a specific auto-unlock session
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ walletId: string; sessionId: string }> }
) {
  try {
    await requireAuth();
    const { walletId, sessionId } = await params;

    // Check ownership
    const hasAccess = await checkWalletOwnership(walletId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to revoke sessions for this wallet' },
        { status: 403 }
      );
    }

    try {
      const response = await cardanoAPI.wallets.revokeAutoUnlockSession(walletId, sessionId);
      return NextResponse.json(response);
    } catch (apiError: any) {
      console.error('Backend revoke session failed:', apiError);
      return NextResponse.json(
        { error: apiError.message || 'Failed to revoke session' },
        { status: apiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error revoking session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revoke session' },
      { status: error.status || 500 }
    );
  }
}
