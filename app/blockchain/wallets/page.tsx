import { requireAuth } from '@/app/lib/auth-utils';
import WalletList from './components/wallet-list';

export const dynamic = 'force-dynamic';

export default async function WalletsPage() {
  await requireAuth();

  return (
    <main className="min-h-screen">
      <div className="flex-grow md:overflow-y-auto md:p-12">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl shadow-md border border-mint-5 dark:border-mint-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Cardano Wallets
              </h1>
              <div className="flex gap-3">
                <a
                  href="/blockchain/transactions"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  New Transaction
                </a>
                <a
                  href="/blockchain/wallets/create"
                  className="px-4 py-2 bg-mint-9 hover:bg-mint-10 text-white rounded-lg transition-colors"
                >
                  New Wallet
                </a>
              </div>
            </div>

            <WalletList />
          </div>
        </div>
      </div>
    </main>
  );
}
