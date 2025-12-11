import { requireAdmin } from '@/app/lib/auth-utils';
import WalletList from './components/wallet-list';

export const dynamic = 'force-dynamic';

export default async function WalletsPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen">
      <div className="flex-grow md:overflow-y-auto md:p-12">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl shadow-md border border-mint-5 dark:border-mint-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Cardano Wallets
              </h1>
              <a
                href="/blockchain/wallets/create"
                className="px-4 py-2 bg-mint-9 hover:bg-mint-10 text-white rounded-lg transition-colors"
              >
                New Wallet
              </a>
            </div>
            <WalletList />
          </div>
        </div>
      </div>
    </main>
  );
}
