'use client';

import { motion } from 'framer-motion'; // Ensure this import is correct
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
    const { t, ready } = useTranslation('common');

    if (!ready) return null; // Ensure translations are ready before rendering
    return (
        <div className="relative h-screen">
            <Image src="/landing-splash.jpg" alt="Landing Image" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
            >

            <div className="max-w-4xl mx-auto px-16 sm:px-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-xl text-white mb-8">
                    {t('heroDescription')}
                    </p>

                    <div className="flex justify-center">
                       
                        <button
                        type="button"
                        className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        onClick={() => window.location.href = '/dashboard'}
                        >
                        {t('heroButton')}
                        </button>
                    </div>
                    </div>
            </motion.div>
        </div>
    );
}