import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { setWalletSession } from '@/app/lib/cardano/jwt-manager';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

export async function POST(req: Request) {
  try {
    await requireAuth();
    const { wallet_id, password } = await req.json();

    // Check ownership
    const hasAccess = await checkWalletOwnership(wallet_id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to unlock this wallet' },
        { status: 403 }
      );
    }

    // Get full token response
    const tokenResponse = await cardanoAPI.wallets.unlock({ wallet_id, password });

    console.log('Token response from backend:', {
      wallet_id: tokenResponse.wallet_id,
      expires_at: tokenResponse.expires_at,
      expires_at_type: typeof tokenResponse.expires_at,
      expires_in: tokenResponse.expires_in,
    });

    // Store complete session (access_token, refresh_token, expires_at, wallet_id, wallet_role)
    await setWalletSession(tokenResponse);

    // Return session info (NOT tokens for security)
    return NextResponse.json({
      success: true,
      session: {
        wallet_id: tokenResponse.wallet_id,
        wallet_name: tokenResponse.wallet_name,
        wallet_role: tokenResponse.wallet_role,
        expires_at: tokenResponse.expires_at,
      }
    });
  } catch (error: any) {
    console.error('Error unlocking wallet:', error);

    // Return appropriate status code and message
    const status = error.status || 500;
    const message = error.message || 'Failed to unlock wallet';

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
