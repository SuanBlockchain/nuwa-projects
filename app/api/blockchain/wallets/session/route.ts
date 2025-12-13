import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { getWalletSession, isTokenExpired } from '@/app/lib/cardano/jwt-manager';

export async function GET() {
  try {
    await requireAuth();

    const session = await getWalletSession();

    if (!session || isTokenExpired(session)) {
      return NextResponse.json({
        isUnlocked: false,
        walletId: null,
        walletName: null,
        walletRole: null,
        expiresAt: null,
        hasCoreWallet: false,
      });
    }

    return NextResponse.json({
      isUnlocked: true,
      walletId: session.wallet_id,
      walletName: session.wallet_name,
      walletRole: session.wallet_role,
      expiresAt: session.expires_at,
      hasCoreWallet: session.wallet_role === 'core',
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}
