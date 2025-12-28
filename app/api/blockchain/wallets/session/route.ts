import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { getWalletSession, isTokenExpired } from '@/app/lib/cardano/jwt-manager';

export async function GET() {
  try {
    await requireAuth();

    console.log('Fetching wallet session...');
    const session = await getWalletSession();

    if (!session) {
      console.log('No wallet session found in cookies');
      return NextResponse.json({
        isUnlocked: false,
        walletId: null,
        walletName: null,
        walletRole: null,
        expiresAt: null,
        hasCoreWallet: false,
      });
    }

    console.log('Session found:', {
      walletId: session.wallet_id,
      walletName: session.wallet_name,
      expiresAt: session.expires_at,
      expiresAtType: typeof session.expires_at,
    });

    // Validate expires_at is a valid number
    if (typeof session.expires_at !== 'number' || isNaN(session.expires_at)) {
      console.error('Invalid expires_at value:', session.expires_at);
      return NextResponse.json({
        isUnlocked: false,
        walletId: null,
        walletName: null,
        walletRole: null,
        expiresAt: null,
        hasCoreWallet: false,
      });
    }

    if (isTokenExpired(session)) {
      console.log('Session token is expired');
      return NextResponse.json({
        isUnlocked: false,
        walletId: null,
        walletName: null,
        walletRole: null,
        expiresAt: null,
        hasCoreWallet: false,
      });
    }

    console.log('Session is valid');
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
