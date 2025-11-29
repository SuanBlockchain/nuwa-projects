'use client';

import { useTranslation } from "react-i18next";
import { PrimaryButton } from '@/app/ui/primary-button';

export default function CallToActionSection() {
    const { t, ready } = useTranslation('common');
    
    if (!ready) return null; // Ensure translations are ready before rendering
    
    return (
        <div className="py-12 bg-stone-100 dark:bg-stone-900">
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
                <div className="my-12 text-center">
                    <p className="text-sm font-display font-medium text-primary uppercase tracking-wider mb-3">
                        {t('callToActionEyebrow', 'Get Started')}
                    </p>
                    <h2 className="text-4xl font-display font-bold text-gradient leading-tight mb-4">
                        {t('callToActionTitle')}
                    </h2>
                    <p className="mt-4 text-lg font-display text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        {t('callToActionSubtitle')}
                    </p>
                </div>
                <div className="flex justify-center">
                    <PrimaryButton
                        variant="solid"
                        size="lg"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        {t('callToActionButton')}
                    </PrimaryButton>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-sm font-display text-gray-500 dark:text-gray-400">
                        {t('callToActionFooter')}{" "}
                        <a
                            href="/login"
                            className="text-primary hover:text-primary-dark transition-colors duration-200 font-medium"
                        >
                            {t('callToActionLogin')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}