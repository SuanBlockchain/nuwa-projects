"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadIcon, ReaderIcon, LightningBoltIcon, TokensIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function WorkflowSection() {
  const { t, ready } = useTranslation('common');

  if (!ready) return null;

  return (
    <motion.section
      id="how-it-works"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="flex flex-col items-center gap-10 px-4 sm:px-10 py-16"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight font-display">
          {t('workflowTitle', 'How It Works')}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 font-display">
          {t('workflowSubtitle', 'A streamlined process for impact creation and investment.')}
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {[0, 1, 2, 3].map((index) => (
          <motion.div key={index} variants={itemVariants}>
            <WorkFlowCard
              IconComponent={[UploadIcon, ReaderIcon, LightningBoltIcon, TokensIcon][index]}
              title={t(`workflowStep${index + 1}Title`)}
              description={t(`workflowStep${index + 1}Description`)}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

const WorkFlowCard = ({
  IconComponent,
  title,
  description,
}: {
  IconComponent: React.ComponentType<{ width?: number; height?: number }>;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center gap-4 p-6 rounded-xl bg-slate-100 dark:bg-slate-900/50">
    <div className="flex items-center justify-center size-12 rounded-full bg-primary/20 text-primary">
      <IconComponent width={24} height={24} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 font-display">{description}</p>
  </div>
);
