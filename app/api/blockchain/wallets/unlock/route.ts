import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { setWalletJWT } from '@/app/lib/cardano/jwt-manager';

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { wallet_id, password } = await req.json();

    const tokenResponse = await cardanoAPI.wallets.unlock({ wallet_id, password });
    await setWalletJWT(tokenResponse.access_token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unlocking wallet:', error);
    return NextResponse.json(
      { error: 'Failed to unlock wallet' },
      { status: 500 }
    );
  }
}
