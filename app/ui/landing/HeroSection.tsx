'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '@/app/ui/primary-button';

export default function HeroSection() {
    const { t, ready } = useTranslation('common');

    if (!ready) return null;

    return (
        <section className="relative pt-10">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent z-10"></div>
            <div
                className="min-h-[560px] flex flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center text-center px-4 py-10 sm:px-10"
                style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDM1ch2c1EsHhCk0p8Qg2sKivj-0ag0z_jfCW4fzX_RL-sHA_sLXXqQ5xnYtERa1aJ4bYkMJ3QwqzSgau6NUku38VTOfwFjw5owD9Fd2XH1-Qvb7TiAk-plcmwt4MSobIkTXp2eWQpEAvN6n7ok_UVkHaYW_irM7B9emzr0KN0NoQ5wwuEj7wUBQYvKRkt0uT6Yj-rWO9sTk2XKkKQDeZr1qtg6RFZx-a_vqaKoYImnn0SHXXqMDDGm2nc1GGnqgglepU9CxjVpEA")'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-4 max-w-3xl relative z-20"
                >
                    <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-6xl font-display">
                        {t('heroTitle', 'Fund the Future. Tokenize')} <span className="text-teal-400">{t('heroTitleHighlight', 'Positive Impact.')}</span>
                    </h1>
                    <h2 className="text-slate-200 text-base sm:text-lg font-normal leading-normal font-display">
                        {t('heroDescription', 'Our platform connects visionary environmental projects with investors through the power of blockchain, ensuring transparency and verifiable impact.')}
                    </h2>
                </motion.div>
                <div className="flex flex-wrap gap-4 relative z-20">
                    <PrimaryButton
                        variant="ghost"
                        size="lg"
                        onClick={() => window.location.href = '/upload'}
                    >
                        {t('heroButton1', 'Analyze a Project')}
                    </PrimaryButton>
                    <PrimaryButton
                        variant="ghost"
                        size="lg"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        {t('heroButton2', 'Explore Investments')}
                    </PrimaryButton>
                </div>
            </div>
        </section>
    );
}