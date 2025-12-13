import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI, CardanoAPIError } from '@/app/lib/cardano/api-client';
import { getCoreWalletSession } from '@/app/lib/cardano/jwt-manager';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    // Only ADMIN users can promote wallets
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can promote wallets' },
        { status: 403 }
      );
    }

    const { wallet_id } = await req.json();

    if (!wallet_id) {
      return NextResponse.json(
        { error: 'wallet_id is required' },
        { status: 400 }
      );
    }

    // Check if CORE wallet is unlocked
    const walletSession = await getCoreWalletSession();
    if (!walletSession) {
      return NextResponse.json(
        { error: 'Please unlock a CORE wallet before promoting other wallets' },
        { status: 403 }
      );
    }

    // Promote wallet - api-client will attach CORE wallet Bearer token
    const result = await cardanoAPI.wallets.promote(wallet_id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error promoting wallet:', error);

    if (error instanceof CardanoAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to promote wallet' },
      { status: 500 }
    );
  }
}
