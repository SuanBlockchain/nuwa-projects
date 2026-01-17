import { requireAuth } from '@/app/lib/auth-utils';
import WalletList from './components/wallet-list';

export const dynamic = 'force-dynamic';

export default async function WalletsPage() {
  await requireAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Wallets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your Cardano wallets and view balances
        </p>
      </div>

      <WalletList />
    </div>
  );
}
