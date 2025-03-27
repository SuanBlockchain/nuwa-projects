'use client';

import dynamic from 'next/dynamic';
import { useAuthenticator } from "@aws-amplify/ui-react";

const HeroSection = dynamic(() => import('@/app/ui/landing/HeroSection'), { ssr: false });
const FeaturesSection = dynamic(() => import('@/app/ui/landing//FeaturesSection'), { ssr: false });
const WorkflowSection = dynamic(() => import('@/app/ui/landing//WorkflowSection'), { ssr: false });
const CallToActionSection = dynamic(() => import('@/app/ui/landing//CallToActionSection'), { ssr: false });

export default function Landing() {
    
  const { signOut } = useAuthenticator();
  return (

    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <CallToActionSection />
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}