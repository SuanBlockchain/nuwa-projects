import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';

/**
 * Store encrypted password for auto-unlock
 *
 * This endpoint allows the frontend to store an encrypted wallet password
 * for seamless auto-unlock functionality.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    const session = await requireAuth();
    const { walletId } = await params;

    // Check ownership
    const hasAccess = await checkWalletOwnership(walletId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this wallet' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { password, session_key, frontend_session_id, expires_hours } = body;

    if (!password || !session_key || !frontend_session_id) {
      return NextResponse.json(
        { error: 'password, session_key, and frontend_session_id are required' },
        { status: 400 }
      );
    }

    // Call backend API to store encrypted password
    try {
      const response = await cardanoAPI.wallets.storeSessionPassword(walletId, {
        user_id: session.user.id,
        password,
        session_key,
        frontend_session_id,
        expires_hours: expires_hours || 24,
      });

      return NextResponse.json(response);
    } catch (apiError: any) {
      console.error('Backend store session failed:', apiError);
      return NextResponse.json(
        { error: apiError.message || 'Failed to store session password' },
        { status: apiError.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error storing session password:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to store session password' },
      { status: error.status || 500 }
    );
  }
}
