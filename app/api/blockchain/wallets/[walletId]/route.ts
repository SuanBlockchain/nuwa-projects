import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { deleteWalletRecord, checkWalletOwnership } from '@/app/actions/wallet-actions';
import { getWalletSession, clearWalletSession } from '@/app/lib/cardano/jwt-manager';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    await requireAuth();
    const { walletId } = await params;
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Check ownership
    const hasAccess = await checkWalletOwnership(walletId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this wallet' },
        { status: 403 }
      );
    }

    // Delete from backend (with password)
    await cardanoAPI.wallets.delete(walletId, password);

    // Delete from local database
    await deleteWalletRecord(walletId);

    // Clear wallet session if the deleted wallet was the active session
    const currentSession = await getWalletSession();
    if (currentSession && currentSession.wallet_id === walletId) {
      await clearWalletSession();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wallet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete wallet' },
      { status: 500 }
    );
  }
}
