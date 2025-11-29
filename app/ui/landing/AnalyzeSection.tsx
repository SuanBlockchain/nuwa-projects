'use client';

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from '@/app/ui/primary-button';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AnalyzeSection() {
  const { t, ready } = useTranslation('common');

  if (!ready) return null;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="flex flex-col gap-10 px-4 sm:px-10 py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight sm:text-4xl font-display max-w-[720px]">
              {t('analyzeTitle', 'Transparently Analyze and Verify Your Project\'s Impact')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal font-display max-w-[720px]">
              {t('analyzeDescription', 'Our cutting-edge analysis tool leverages AI and satellite data to provide a comprehensive, transparent, and verifiable assessment of your project\'s environmental benefits. Prepare your project for tokenization and attract forward-thinking investors.')}
            </p>
          </div>
          <PrimaryButton
            variant="solid"
            size="lg"
            onClick={() => window.location.href = '/upload'}
            className="w-fit"
          >
            {t('analyzeButton', 'Submit Your Project')}
          </PrimaryButton>
        </motion.div>
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBYRsJTptq34Kgek5kNQVhWeZv3WRtZOSJCMuQWTDu7mt9cQZ7L_loTTJ5OhAMhQa4gK54A7z7Kqh0nfpsf9ArGCpgt4fcVtap-lYE3ipcs2GKedt69VkqHZWQ-vElmwe2lVHltz21aSwKmyUPfSQ5nRYrrqJcYZZjIVJaLJ0WJx_bNGJFmZTgmN7edwt2W17MnsNWkYy0zDCbjmy7KAKQ0c4Rqum1RzdQZRqaRQoXT7OBaHpp28ukSryz3wvQx1LdUKmeLUesppg")'
              }}
            ></div>
            <div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal font-display">
                {t('analyzeCard1Title', 'Data-Driven Insights')}
              </p>
              <p className="text-teal-dark dark:text-primary/70 text-sm font-normal leading-normal font-display">
                {t('analyzeCard1Description', 'Gain deep understanding of your impact metrics through our AI-powered analysis.')}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCU9sMLj0mQEXaGgyfBrYEphtYTpCGfunoUhA9R3yalOoZm2D5Ej7VjRyKtBRm7Di0vAhwDcM06tLj8cgPp4LArt9MGUzCEWOMIUP2n-099rkwts_m6Ci86il1WhA1vCDRR3NJ1dJD2ipzaW8xV_IdnvZrd9H5y_lVocmXjjrCiNXJKWvSqGzTethV_fCsVUJK_qdULqsO_MnK0ZIBpJSW0sotsGSJPrXzThP6cedskSoKlY1Ud688a-EWXIqMILyCGnIT2ZXlAcg")'
              }}
            ></div>
            <div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal font-display">
                {t('analyzeCard2Title', 'Blockchain Verification')}
              </p>
              <p className="text-teal-dark dark:text-primary/70 text-sm font-normal leading-normal font-display">
                {t('analyzeCard2Description', 'Securely record and verify your project\'s milestones on an immutable ledger.')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
