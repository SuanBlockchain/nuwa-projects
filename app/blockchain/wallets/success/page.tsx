'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ExclamationTriangleIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, EyeSlashIcon, EyeIcon } from '@heroicons/react/24/outline';
import EnableAutoUnlockDialog from '../components/enable-auto-unlock-dialog';

interface WalletCreationData {
  wallet_id: string;
  name: string;
  mnemonic: string;
  enterprise_address: string;
  staking_address?: string;
  network: string;
  created_at: string;
}

export default function WalletSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [walletData, setWalletData] = useState<WalletCreationData | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAutoUnlockDialog, setShowAutoUnlockDialog] = useState(false);

  useEffect(() => {
    // Get wallet data from sessionStorage
    const data = sessionStorage.getItem('wallet_creation_data');
    if (data) {
      setWalletData(JSON.parse(data));
    } else {
      // Redirect if no data found
      router.push('/blockchain/wallets');
    }
  }, [router]);

  const handleCopyMnemonic = () => {
    if (walletData?.mnemonic) {
      navigator.clipboard.writeText(walletData.mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleProceed = () => {
    if (confirmed) {
      // Show auto-unlock dialog
      setShowAutoUnlockDialog(true);
    }
  };

  const handleAutoUnlockSuccess = () => {
    // Clear the wallet data from sessionStorage
    sessionStorage.removeItem('wallet_creation_data');
    router.push('/blockchain/wallets');
  };

  const handleAutoUnlockSkip = () => {
    // User skipped auto-unlock setup, redirect anyway
    sessionStorage.removeItem('wallet_creation_data');
    router.push('/blockchain/wallets');
  };

  if (!walletData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-9"></div>
      </div>
    );
  }

  const mnemonicWords = walletData.mnemonic.split(' ');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-mint-9 mb-4">
            <CheckCircleIcon className="h-8 w-8" />
            <span className="text-sm font-bold uppercase tracking-widest bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-200 px-3 py-1 rounded">
              Success
            </span>
          </div>
          <h1 className="text-zinc-900 dark:text-white text-4xl md:text-5xl font-bold mb-3">
            Wallet Successfully Created
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl">
            Your new wallet for the Cardano network is ready. Please proceed with caution to back up your credentials.
          </p>
        </div>

        {/* Warning Card */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 dark:bg-amber-950/40 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-amber-500/20 p-3 rounded-full shrink-0">
              <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-amber-400 text-lg font-bold mb-2">IMPORTANT: Security Warning</h3>
              <p className="text-amber-100/90 dark:text-amber-100/80 text-sm leading-relaxed">
                Save your mnemonic phrase securely! It will <span className="text-white font-bold underline decoration-amber-500">not be shown again</span>.
                You need it to recover your wallet if you forget your password. We do not store this phrase.
                If you lose it, your funds and contracts are lost forever.
              </p>
            </div>
          </div>
        </div>

        {/* Mnemonic Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <KeyIcon className="h-6 w-6 text-mint-9" />
              Mnemonic Phrase
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowMnemonic(!showMnemonic)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-400 hover:text-white transition-all border border-zinc-700"
              >
                {showMnemonic ? (
                  <>
                    <EyeSlashIcon className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4" />
                    Show
                  </>
                )}
              </button>
              <button
                onClick={handleCopyMnemonic}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-mint-9 transition-all border border-mint-900/30 hover:border-mint-900"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                {copied ? 'Copied!' : 'Copy Phrase'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-800 rounded-xl p-6 md:p-8">
            {showMnemonic ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {mnemonicWords.map((word, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-zinc-900 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-700 dark:border-zinc-800 select-all group hover:border-mint-900/50 transition-colors"
                  >
                    <span className="text-zinc-500 text-xs font-mono select-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-white font-medium tracking-wide">{word}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                Mnemonic phrase is hidden. Click &quot;Show&quot; to reveal.
              </div>
            )}
          </div>
        </section>

        {/* Wallet Details Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Wallet Details</h3>
            <div className="bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-800 rounded-lg p-5 space-y-4">
              <div>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Name</span>
                <p className="text-white text-sm mt-1">{walletData.name}</p>
              </div>
              <div className="h-px bg-zinc-700"></div>
              <div>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Wallet ID</span>
                <div className="flex items-center justify-between group mt-1">
                  <p className="text-white font-mono text-sm truncate">{walletData.wallet_id}</p>
                  <button
                    onClick={() => handleCopyText(walletData.wallet_id)}
                    className="text-zinc-400 hover:text-mint-9 opacity-0 group-hover:opacity-100 transition-all ml-2"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="h-px bg-zinc-700"></div>
              <div>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Network</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                  <p className="text-white text-sm font-medium capitalize">{walletData.network}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Public Addresses</h3>
            <div className="bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 dark:border-zinc-800 rounded-lg p-5 space-y-4">
              <div>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Enterprise Address</span>
                <div className="flex items-center justify-between group mt-1">
                  <p className="text-white font-mono text-sm truncate">{walletData.enterprise_address}</p>
                  <button
                    onClick={() => handleCopyText(walletData.enterprise_address)}
                    className="text-zinc-400 hover:text-mint-9 opacity-0 group-hover:opacity-100 transition-all ml-2"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {walletData.staking_address && (
                <>
                  <div className="h-px bg-zinc-700"></div>
                  <div>
                    <span className="text-zinc-400 text-xs uppercase tracking-wider font-semibold">Staking Address</span>
                    <div className="flex items-center justify-between group mt-1">
                      <p className="text-white font-mono text-sm truncate">{walletData.staking_address}</p>
                      <button
                        onClick={() => handleCopyText(walletData.staking_address!)}
                        className="text-zinc-400 hover:text-mint-9 opacity-0 group-hover:opacity-100 transition-all ml-2"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Action Footer */}
        <div className="pt-6 border-t border-zinc-700 dark:border-zinc-800 flex flex-col items-center gap-6">
          {/* Confirmation Checkbox */}
          <label className="flex items-start md:items-center gap-3 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 md:mt-0 w-5 h-5 rounded border-zinc-400 text-mint-9 focus:ring-mint-9 focus:ring-offset-0 bg-zinc-800 border-2"
            />
            <span className="text-zinc-400 group-hover:text-white transition-colors text-sm md:text-base">
              I confirm that I have written down my mnemonic phrase and stored it securely.
            </span>
          </label>

          {/* Primary Action Button */}
          <button
            onClick={handleProceed}
            disabled={!confirmed}
            className="group relative px-8 py-3 bg-mint-9 hover:bg-mint-10 text-white text-base font-bold rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-mint-9"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Proceed to Wallets</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Enable Auto-Unlock Dialog */}
      {walletData && (
        <EnableAutoUnlockDialog
          walletId={walletData.wallet_id}
          walletName={walletData.name}
          open={showAutoUnlockDialog}
          onOpenChange={setShowAutoUnlockDialog}
          onSuccess={handleAutoUnlockSuccess}
          onSkip={handleAutoUnlockSkip}
        />
      )}
    </div>
  );
}
