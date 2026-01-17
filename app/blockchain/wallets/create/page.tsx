import { requireAuth } from '@/app/lib/auth-utils';
import WalletConfigTabs from '../components/wallet-config-tabs';

export default async function CreateWalletPage() {
  await requireAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          New Wallet
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new wallet or import an existing one
        </p>
      </div>

      <WalletConfigTabs />
    </div>
  );
}
