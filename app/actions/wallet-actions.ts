"use server";

import { prisma } from '@/prisma';
import { requireAuth } from '@/app/lib/auth-utils';
import { auth } from '@/auth';

export async function getWalletsForUser() {
  const session = await requireAuth();

  // GESTOR: only own wallets, ADMIN: all wallets
  let where = {};
  if (session.user.role === 'GESTOR') {
    where = { userId: session.user.id };
  }

  return await prisma.wallet.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createWalletRecord(
  walletId: string,
  name: string,
  enterpriseAddress: string,
  network: string
) {
  const session = await requireAuth();

  return await prisma.wallet.create({
    data: {
      id: walletId,
      name,
      userId: session.user.id,
      enterpriseAddress,
      network,
    }
  });
}

export async function deleteWalletRecord(walletId: string) {
  const session = await requireAuth();

  // Verify ownership for non-admin users
  if (session.user.role === 'GESTOR') {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId }
    });

    if (!wallet || wallet.userId !== session.user.id) {
      throw new Error('Unauthorized to delete this wallet');
    }
  }

  await prisma.wallet.delete({ where: { id: walletId } });
}

export async function checkWalletOwnership(walletId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;

  if (session.user.role === 'ADMIN') return true;

  const wallet = await prisma.wallet.findUnique({
    where: { id: walletId }
  });

  return wallet?.userId === session.user.id;
}
