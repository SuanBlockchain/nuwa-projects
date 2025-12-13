import { prisma } from '@/prisma';
import { cardanoAPI } from '@/app/lib/cardano/api-client';

async function migrateWallets() {
  console.log('Fetching wallets from backend...');
  const { wallets } = await cardanoAPI.wallets.list();

  console.log(`Found ${wallets.length} wallets`);

  // Get first ADMIN user as default owner
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    throw new Error('No ADMIN user found');
  }

  for (const wallet of wallets) {
    const exists = await prisma.wallet.findUnique({
      where: { id: wallet.id }
    });

    if (!exists) {
      await prisma.wallet.create({
        data: {
          id: wallet.id,
          name: wallet.name,
          userId: adminUser.id,
          enterpriseAddress: wallet.enterprise_address,
          network: wallet.network,
        }
      });
      console.log(`✓ Migrated: ${wallet.name}`);
    }
  }

  console.log('Migration complete!');
}

migrateWallets()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
