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

export default function InvestSection() {
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
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:order-2">
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBnndF4KECSnglxrixQRDuLNlr16FueqReiU6axdi77Jfg9g1T-FkBZMrEgUOx0tOCsj-lICPr5bAY3E_LwDEKSjTj7feM2_kmGiH6vBlbx_cd3nmHSt0P2hqnEAoqwiaGJuF3Lv7d72vAYOyIBqu_RRa5N9zqIcqsDyUXYi-KKJrT78HKzi6XpUJ06DMLW5HcLvwk41dfEpV1dtNt9n2RVG4vuXsYn2GuijpB-FcbdGf9XNw9EfHFEfw28-wgzlYUjOq8_iweYDw")'
              }}
            ></div>
            <div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal font-display">
                {t('investCard1Title', 'Curated Opportunities')}
              </p>
              <p className="text-teal-dark dark:text-primary/70 text-sm font-normal leading-normal font-display">
                {t('investCard1Description', 'Access a diverse range of vetted projects with proven potential for positive change.')}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9aHolYpfBpheQ2AEXPnAXUSK6zHWIHXnXb80UThY3MVhb0lN1UOQ_2YXn2MiSLFOOV3M79EJIDVnPwVFA4LW_GlDMYqj68AWtH4ifu0-zy3PvYZzvl9HKc1hPzCw-wnDRNNMeN3q_XCsI9CmlOS4j2i0zf8Uku8rpY_rEtggrxHWIeQC4tfAQnbkkpiHt2yfrccWNOf6zJUJQaHB_0MzW6I9dfqYZMvAJ8fzf7l-o3EBRiH8zoW1pkV2waG6E_aEkrk4T_QvXkg")'
              }}
            ></div>
            <div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal font-display">
                {t('investCard2Title', 'Track Your Impact')}
              </p>
              <p className="text-teal-dark dark:text-primary/70 text-sm font-normal leading-normal font-display">
                {t('investCard2Description', 'Monitor the real-world impact of your investments through regular updates and reports.')}
              </p>
            </div>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:order-1">
          <div className="flex flex-col gap-4">
            <h2 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight sm:text-4xl font-display max-w-[720px]">
              {t('investTitle', 'Invest in a Greener Tomorrow')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-normal font-display max-w-[720px]">
              {t('investDescription', 'Discover and invest in a curated portfolio of high-impact environmental projects. Our platform offers a unique opportunity to fund initiatives that matter, from reforestation to renewable energy, with the transparency and security of blockchain technology.')}
            </p>
          </div>
          <PrimaryButton
            variant="solid"
            size="lg"
            onClick={() => window.location.href = '/dashboard'}
            className="w-fit"
          >
            {t('investButton', 'Browse Projects')}
          </PrimaryButton>
        </motion.div>
      </div>
    </motion.section>
  );
}
