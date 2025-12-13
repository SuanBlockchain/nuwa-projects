import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { getWalletSession, clearWalletSession } from '@/app/lib/cardano/jwt-manager';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

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

    // Verify this wallet is currently unlocked
    const session = await getWalletSession();
    if (!session || session.wallet_id !== wallet_id) {
      return NextResponse.json(
        { error: 'Wallet is not currently unlocked' },
        { status: 400 }
      );
    }

    // Step 1: Revoke token on backend
    try {
      await cardanoAPI.wallets.revoke();
    } catch (revokeError) {
      console.error('Token revocation failed:', revokeError);
      // Continue anyway - token might already be revoked
    }

    // Step 2: Lock wallet on backend
    await cardanoAPI.wallets.lock(wallet_id);

    // Step 3: Clear session cookie
    await clearWalletSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error locking wallet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to lock wallet' },
      { status: 500 }
    );
  }
}
