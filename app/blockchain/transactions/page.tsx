import { requireAuth } from '@/app/lib/auth-utils';
import { TransactionWizard } from './components/transaction-wizard';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-background-dark">
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:px-16">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
              New Transaction
            </h1>
            <p className="text-gray-700 dark:text-[#9db9ad] text-base font-normal max-w-xl">
              Send ADA and attach metadata to the Cardano blockchain. Ensure destination address
              supports native assets if applicable.
            </p>
          </div>

          {/* Network Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-surface-dark rounded-full border border-primary/30 dark:border-primary/20 text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Network: Preprod
          </div>
        </div>

        {/* Transaction Wizard */}
        <TransactionWizard />
      </div>
    </main>
  );
}
