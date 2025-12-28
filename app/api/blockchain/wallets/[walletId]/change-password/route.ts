import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { checkWalletOwnership } from '@/app/actions/wallet-actions';
import { clearWalletSession } from '@/app/lib/cardano/jwt-manager';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    await requireAuth();
    const { walletId } = await params;
    const body = await req.json();

    // Accept both field name formats for flexibility
    const old_password = body.old_password || body.current_password;
    const new_password = body.new_password;

    // Validate required fields
    if (!old_password || !new_password) {
      return NextResponse.json(
        { error: 'Old password and new password are required' },
        { status: 400 }
      );
    }

    // Check ownership
    const hasAccess = await checkWalletOwnership(walletId);
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized to change password for this wallet' },
        { status: 403 }
      );
    }

    console.log('Changing password for wallet:', walletId);

    // Call backend API to change password
    const response = await cardanoAPI.wallets.changePassword(
      walletId,
      old_password,
      new_password
    );

    console.log('Password change response from backend:', {
      wallet_id: walletId,
      response: response,
    });

    // Backend locks the wallet after password change for security
    // Clear the wallet session cookie
    await clearWalletSession();

    // Return success response
    return NextResponse.json({
      success: true,
      message: response.message || 'Password changed successfully. Wallet has been locked.',
    });
  } catch (error: any) {
    console.error('Error changing wallet password:', error);

    // Return appropriate status code and message
    const status = error.status || 500;

    // Extract error message - ensure it's a string
    let message = 'Failed to change password';
    if (typeof error.message === 'string') {
      message = error.message;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    } else if (typeof error === 'string') {
      message = error;
    }

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
