import { requireAdmin } from '@/app/lib/auth-utils';
import WalletConfigTabs from '../components/wallet-config-tabs';

export default async function CreateWalletPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen">
      <div className="flex-grow md:overflow-y-auto md:p-12">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl shadow-md border border-mint-5 dark:border-mint-8">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Wallet Configuration
            </h1>
            <WalletConfigTabs />
          </div>
        </div>
      </div>
    </main>
  );
}
