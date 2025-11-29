"use client";

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="flex justify-center border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-900/50">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 sm:px-10 py-8 w-full max-w-7xl">
        <p className="text-sm text-slate-600 dark:text-slate-400 font-display">
          © 2024 Nuwa. {t('footerRights', 'All rights reserved.')}
        </p>
        <div className="flex items-center gap-6">
          <a
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-display"
            href="/terms"
          >
            {t('footerTerms', 'Terms of Service')}
          </a>
          <a
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-display"
            href="/privacy"
          >
            {t('footerPrivacy', 'Privacy Policy')}
          </a>
          <a
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-display"
            href="/contact"
          >
            {t('footerContact', 'Contact')}
          </a>
        </div>
      </div>
    </footer>
  );
}
