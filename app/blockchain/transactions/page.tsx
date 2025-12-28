import { requireAuth } from '@/app/lib/auth-utils';
import { TransactionWizard } from './components/transaction-wizard';
import { WalletBalanceHeader } from '../components/wallet-balance-header';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:px-16">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
              New Transaction
            </h1>
            <p className="text-gray-700 dark:text-[#9db9ad] text-base font-normal max-w-xl">
              Send ADA and attach metadata to the Cardano blockchain. Ensure destination address
              supports native assets if applicable.
            </p>
          </div>

          {/* Wallet Balance Header */}
          <WalletBalanceHeader />
        </div>

        {/* Transaction Wizard */}
        <TransactionWizard />
      </div>
    </main>
  );
}
