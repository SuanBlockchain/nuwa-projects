"use server";

import { requireAuth } from '@/app/lib/auth-utils';
import { auth } from '@/auth';
import { cardanoAPI } from '@/app/lib/cardano/api-client';

/**
 * Get wallets from Cardano backend
 * The backend manages wallet ownership, not our Prisma database
 */
export async function getWalletsForUser() {
  await requireAuth();

  // Get wallets from Cardano backend
  // The backend filters by authenticated user automatically
  const response = await cardanoAPI.wallets.list();
  return response.wallets || [];
}

/**
 * Wallets are created via the Cardano backend API, not stored in our database
 * This function is kept for compatibility but does nothing
 */
export async function createWalletRecord(
  walletId: string,
  name: string,
  enterpriseAddress: string,
  network: string
) {
  await requireAuth();
  // Wallet is already created in the Cardano backend
  // No need to store in our database
  return { id: walletId, name, enterpriseAddress, network };
}

/**
 * Wallets are deleted via the Cardano backend API, not from our database
 * This function is kept for compatibility but does nothing
 */
export async function deleteWalletRecord(walletId: string) {
  await requireAuth();
  // Wallet is already deleted from the Cardano backend
  // No need to delete from our database (doesn't exist there)
}

/**
 * Check wallet ownership by querying the Cardano backend
 */
export async function checkWalletOwnership(walletId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  // Admin users have access to all wallets
  if (session.user.role === 'ADMIN') return true;

  try {
    // Get wallets from backend - it returns only user's wallets
    const response = await cardanoAPI.wallets.list();
    const wallet = response.wallets.find(w => w.id === walletId);

    // If wallet is in the user's list, they own it
    return !!wallet;
  } catch (error) {
    console.error('Error checking wallet ownership:', error);
    return false;
  }
}
