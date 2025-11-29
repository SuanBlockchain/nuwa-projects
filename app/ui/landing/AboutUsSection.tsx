"use client";

import { useTranslation } from "react-i18next";

export default function AboutUsSection() {
  const { t } = useTranslation('common');

  return (
    <section
      id="about-us"
      className="flex flex-col items-center gap-6 px-4 sm:px-10 py-16 bg-slate-50 dark:bg-slate-900/30"
    >
      <div className="text-center max-w-3xl">
        <h2 className="text-slate-900 dark:text-white text-3xl font-bold font-display">
          {t('aboutUsTitle', 'About Us')}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-4 font-display">
          {t('aboutUsDescription', 'Coming soon...')}
        </p>
      </div>
    </section>
  );
}
