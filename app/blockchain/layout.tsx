'use client';

import { useState } from 'react';
import { BlockchainSidebar } from './components/blockchain-sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function BlockchainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <BlockchainSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-background-dark">
        {/* Mobile menu button */}
        <div className="md:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Bars3Icon className="w-6 h-6" />
            <span className="font-medium">Menu</span>
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
