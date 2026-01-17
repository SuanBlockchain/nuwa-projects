'use client';

import { useState } from 'react';
import { SidebarNavSection } from './sidebar-nav-section';
import { SidebarNavLink } from './sidebar-nav-link';
import { ActiveWalletCard } from './active-wallet-card';
import {
  WalletIcon,
  PlusCircleIcon,
  PaperAirplaneIcon,
  QrCodeIcon,
  ClockIcon,
  XMarkIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

interface BlockchainSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BlockchainSidebar({ isOpen, onClose }: BlockchainSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 border-r border-gray-800
          flex flex-col shrink-0
          transform transition-transform duration-200 ease-in-out
          md:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
          <span className="text-lg font-semibold text-white">Blockchain</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="p-4 flex-1 overflow-y-auto min-h-0">
          {/* Wallet Management Section */}
          <SidebarNavSection title="Wallet Management">
            <SidebarNavLink
              href="/blockchain/wallets"
              icon={WalletIcon}
              label="My Wallets"
            />
            <SidebarNavLink
              href="/blockchain/wallets/create"
              icon={PlusCircleIcon}
              label="New Wallet"
            />
          </SidebarNavSection>

          {/* Transactions Section */}
          <div className="mt-6">
            <SidebarNavSection title="Transactions">
              <SidebarNavLink
                href="/blockchain/transactions"
                icon={PaperAirplaneIcon}
                label="Send"
              />
              <SidebarNavLink
                href="/blockchain/transactions/receive"
                icon={QrCodeIcon}
                label="Receive"
              />
              <SidebarNavLink
                href="/blockchain/transactions/history"
                icon={ClockIcon}
                label="History"
              />
            </SidebarNavSection>
          </div>

          {/* UTXOs Section */}
          <div className="mt-6">
            <SidebarNavSection title="Wallet Data">
              <SidebarNavLink
                href="/blockchain/utxos"
                icon={CubeIcon}
                label="UTXO List"
              />
            </SidebarNavSection>
          </div>
        </div>

        {/* Active Wallet Card */}
        <ActiveWalletCard />
      </aside>
    </>
  );
}
