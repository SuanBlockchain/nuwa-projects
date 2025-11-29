'use client';

import { motion } from "framer-motion";
import Image from "next/image";
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

export default function FeaturesSection() {
  const { t, ready } = useTranslation('common');

  if (!ready) return null; // Ensure translations are ready before rendering

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white dark:bg-gray-900"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <p className="text-sm font-display font-medium text-primary uppercase tracking-wider mb-3">
            {t('featureEyebrow', 'Our Services')}
          </p>
          <h2 className="text-4xl font-display font-bold text-gradient mb-4">
            {t('featureTitle')}
          </h2>
          <p className="text-lg font-display text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('featureSubtitle', 'Comprehensive carbon project solutions from assessment to quantification')}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                imageSrc={
                  [
                    "/landing-carbon-feasibility.webp",
                    "/landing-carbon-assessment.webp",
                    "/landing-carbon-quantification.webp",
                  ][index]
                }
                title={t(`feature${index + 1}Title`)}
                description={t(`feature${index + 1}Description`)}
                linkText={t(`feature${index + 1}LinkText`)}
                linkHref={["/feasibility", "/assessment", "/quantification"][index]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const FeatureCard = ({
  imageSrc,
  title,
  description,
  linkText,
  linkHref,
}: {
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}) => (
  <div className="glass-card p-6 text-center">
    <div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48 overflow-hidden">
      <Image
        src={imageSrc}
        width={400}
        height={400}
        className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
        alt={title}
      />
    </div>
    <h3 className="text-xl font-display font-semibold mb-3">{title}</h3>
    <p className="text-sm font-display text-gray-600 dark:text-gray-300 mb-6">{description}</p>
    <PrimaryButton
      variant="solid"
      size="sm"
      onClick={() => window.location.href = linkHref}
    >
      {linkText}
    </PrimaryButton>
  </div>
);