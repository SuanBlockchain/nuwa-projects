// components/LocaleSwitcher.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import i18next from '@/lib/i18n';

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (lng: string) => {
    i18next.changeLanguage(lng);
    router.refresh();
  };

  return (
    <div className="flex space-x-2">
      {['en', 'es'].map((lng) => (
        <button
          key={lng}
          onClick={() => switchTo(lng)}
          className="text-sm text-gray-300 hover:text-white uppercase"
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
