'use client';

import { useTranslation } from "react-i18next";

export default function CallToActionSection() {
    const { t, ready } = useTranslation('common');

    if (!ready) return null; // Ensure translations are ready before rendering

    return (
        <div className="py-12 bg-stone-100 dark:bg-stone-900">
            <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
                <div className="my-12 text-center">
                    <h2 className="text-3xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        {t('callToActionTitle')}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                        {t('callToActionSubtitle')}
                    </p>
                    <p className="mt-2 max-w-3xl mx-auto text-gray-500 dark:text-gray-300">
                        {t('callToActionDescription')}
                    </p>
                </div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        {t('callToActionButton')}
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('callToActionFooter')}{" "}
                        <a href="/login" className="text-green-600 hover:text-green-500">
                            {t('callToActionLogin')}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}