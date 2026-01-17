import { requireAuth } from '@/app/lib/auth-utils';
import { TransactionWizard } from './components/transaction-wizard';
import { WalletBalanceHeader } from '../components/wallet-balance-header';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  await requireAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Send Transaction
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Send ADA and attach metadata to the Cardano blockchain
        </p>

        {/* Wallet Balance Header */}
        <WalletBalanceHeader />
      </div>

      {/* Transaction Wizard */}
      <TransactionWizard />
    </div>
  );
}
