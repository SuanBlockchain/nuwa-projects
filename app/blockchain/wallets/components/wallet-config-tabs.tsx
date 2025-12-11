'use client';

import { useState } from 'react';
import CreateWalletForm from './create-wallet-form';
import ImportWalletForm from './import-wallet-form';

export default function WalletConfigTabs() {
  const [activeTab, setActiveTab] = useState<'create' | 'import'>('create');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'create'
              ? 'text-mint-9 border-b-2 border-mint-9'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Create New Wallet
        </button>
        <button
          onClick={() => setActiveTab('import')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'import'
              ? 'text-mint-9 border-b-2 border-mint-9'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          Import Wallet
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'create' && <CreateWalletForm />}
        {activeTab === 'import' && <ImportWalletForm />}
      </div>
    </div>
  );
}
