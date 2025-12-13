import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth-utils';
import { cardanoAPI } from '@/app/lib/cardano/api-client';
import { getWalletsForUser } from '@/app/actions/wallet-actions';

export async function GET() {
  try {
    const session = await requireAuth();

    // Get all wallets from backend API
    const backendResponse = await cardanoAPI.wallets.list();
    const allWallets = backendResponse.wallets;

    // Get user's wallet records from local database (includes user info)
    const userWalletRecords = await getWalletsForUser();
    const userWalletIds = new Set(userWalletRecords.map(w => w.id));

    // Create a map of wallet ID to user info
    const walletUserMap = new Map(
      userWalletRecords.map(w => [w.id, {
        userId: w.user.id,
        userName: w.user.name,
        userEmail: w.user.email,
        userRole: w.user.role,
      }])
    );

    // Filter: ADMIN sees all, GESTOR sees only their own
    const filteredWallets = session.user.role === 'ADMIN'
      ? allWallets
      : allWallets.filter(w => userWalletIds.has(w.id));

    // Merge user information into wallet objects
    const walletsWithUserInfo = filteredWallets.map(wallet => ({
      ...wallet,
      owner: walletUserMap.get(wallet.id) || null,
    }));

    return NextResponse.json(walletsWithUserInfo);
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallets' },
      { status: 500 }
    );
  }
}
