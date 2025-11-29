'use client';

import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/app/ui/landing/HeroSection'), { ssr: false });
const AnalyzeSection = dynamic(() => import('@/app/ui/landing/AnalyzeSection'), { ssr: false });
const InvestSection = dynamic(() => import('@/app/ui/landing/InvestSection'), { ssr: false });
const WorkflowSection = dynamic(() => import('@/app/ui/landing/WorkflowSection'), { ssr: false });
const AboutUsSection = dynamic(() => import('@/app/ui/landing/AboutUsSection'), { ssr: false });

export default function Landing() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto">
      <HeroSection />
      <AnalyzeSection />
      <InvestSection />
      <WorkflowSection />
      <AboutUsSection />
    </div>
  );
}