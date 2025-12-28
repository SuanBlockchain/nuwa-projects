import { NextRequest, NextResponse } from 'next/server';
import { cardanoAPI, CardanoAPIError } from '@/app/lib/cardano/api-client';

/**
 * GET /api/blockchain/wallets/{walletId}/balance
 *
 * Fetches the balance for a specific wallet from the Cardano backend API.
 * Requires an unlocked wallet session (JWT token).
 *
 * @param walletId - The wallet ID (payment key hash)
 * @returns WalletBalanceResponse with balance_lovelace, available_lovelace, and timestamp
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletId: string }> }
) {
  try {
    const { walletId } = await params;

    if (!walletId) {
      return NextResponse.json(
        { error: 'Wallet ID is required' },
        { status: 400 }
      );
    }

    // Fetch balance from backend via api-client
    // This will automatically handle:
    // - JWT token authentication
    // - Token refresh if expired
    // - Session validation
    const balanceData = await cardanoAPI.wallets.getBalance(walletId);

    // Transform the response to match the expected WalletBalanceResponse type
    // Backend returns: { balances: { total_balance_lovelace, ... }, checked_at }
    // Frontend expects: { balance_lovelace, available_lovelace, timestamp }
    const transformedBalance = {
      wallet_id: walletId,
      balance_lovelace: balanceData.balances?.total_balance_lovelace || 0,
      available_lovelace: balanceData.balances?.total_balance_lovelace || 0, // Assuming all is available
      timestamp: balanceData.checked_at,
    };

    return NextResponse.json(transformedBalance);
  } catch (error) {
    // Handle CardanoAPIError with specific status codes
    if (error instanceof CardanoAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    // Generic error handler
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch wallet balance' },
      { status: 500 }
    );
  }
}
