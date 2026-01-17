import { NextRequest, NextResponse } from 'next/server';
import { cardanoAPI, CardanoAPIError } from '@/app/lib/cardano/api-client';

/**
 * GET /api/blockchain/wallets/{walletId}/utxos
 *
 * Fetches the UTXOs (Unspent Transaction Outputs) for a specific wallet from the Cardano backend API.
 * Requires an unlocked wallet session (JWT token).
 *
 * @param walletId - The wallet ID (payment key hash)
 * @param searchParams - Optional query parameters:
 *   - address_index: Specific address index (null = all main addresses)
 *   - min_ada: Minimum ADA value filter
 * @returns UtxoResponse with wallet_id, wallet_name, utxos array, total_ada, total_lovelace, and checked_at
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

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const addressIndex = searchParams.get('address_index');
    const minAda = searchParams.get('min_ada');

    // Fetch UTXOs from backend via api-client
    // This will automatically handle:
    // - JWT token authentication
    // - Token refresh if expired
    // - Session validation
    const utxoData = await cardanoAPI.wallets.getUtxos(
      walletId,
      addressIndex ? parseInt(addressIndex) : undefined,
      minAda ? parseFloat(minAda) : undefined
    );

    return NextResponse.json(utxoData);
  } catch (error) {
    // Handle CardanoAPIError with specific status codes
    if (error instanceof CardanoAPIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    // Generic error handler
    console.error('UTXO fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch UTXOs' },
      { status: 500 }
    );
  }
}
