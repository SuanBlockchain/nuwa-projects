import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { clearWalletJWT } from '@/app/lib/cardano/jwt-manager';

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { wallet_id } = await req.json();

    await cardanoAPI.wallets.lock(wallet_id);
    await clearWalletJWT();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error locking wallet:', error);
    return NextResponse.json(
      { error: 'Failed to lock wallet' },
      { status: 500 }
    );
  }
}
