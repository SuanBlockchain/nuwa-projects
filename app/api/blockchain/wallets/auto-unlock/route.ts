import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { setWalletSession } from '@/app/lib/cardano/jwt-manager';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Auto-unlock wallet using stored session key
 *
 * Uses the frontend session key to unlock the wallet without password prompt.
 * Session must have been previously established via /session/store endpoint.
 */
export async function POST(req: Request) {
  try {
    await requireAuth();

    const { wallet_id, session_key, frontend_session_id } = await req.json();

    if (!wallet_id || !session_key || !frontend_session_id) {
      return NextResponse.json(
        { error: 'wallet_id, session_key, and frontend_session_id are required' },
        { status: 400 }
      );
    }

    // Check ownership
    const hasAccess = await checkWalletOwnership(wallet_id);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to unlock this wallet' },
        { status: 403 }
      );
    }

    // Call backend auto-unlock endpoint
    try {
      const response = await cardanoAPI.wallets.autoUnlock(
        wallet_id,
        session_key,
        frontend_session_id
      );

      // Store JWT session in httpOnly cookie (server-side)
      await setWalletSession({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: response.expires_at,
        expires_in: response.expires_in,
        token_type: response.token_type,
        wallet_id: response.wallet_id,
        wallet_name: response.wallet_name,
        wallet_role: response.wallet_role,
      });

      return NextResponse.json({
        success: true,
        message: 'Wallet auto-unlocked successfully',
        wallet_id: response.wallet_id,
        wallet_name: response.wallet_name,
        wallet_role: response.wallet_role,
      });
    } catch (apiError: any) {
      console.error('Backend auto-unlock failed:', apiError);
      return NextResponse.json(
        { error: apiError.message || 'Auto-unlock failed' },
        { status: apiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error during auto-unlock:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to auto-unlock wallet' },
      { status: error.status || 500 }
    );
  }
}
