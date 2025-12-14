import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Revoke a specific session
 *
 * Allows revoking sessions from other devices/browsers
 */
export async function DELETE(
  req: Request,
  { params }: { params: { jti: string } }
) {
  try {
    await requireAuth();

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
        { error: 'Unauthorized to revoke sessions for this wallet' },
        { status: 403 }
      );
    }

    // Revoke specific session on backend
    const result = await cardanoAPI.wallets.revokeSession(wallet_id, params.jti);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error revoking session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revoke session' },
      { status: error.status || 500 }
    );
  }
}
