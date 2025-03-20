'use client';
import WorkflowSection from "./WorkflowSection";
import FeatureSection from "./FeaturesSection";
// import HeroSection from "./HeroSection";
import CallToActionSection from "./CallToActionSection";

import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('./HeroSection'), { ssr: false });


export default function Landing() {
    return (
      <div>
        <HeroSection />
        <FeatureSection />
        <WorkflowSection />
        <CallToActionSection />

      </div>
    );
  }