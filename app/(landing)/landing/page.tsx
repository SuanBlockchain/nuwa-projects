import WorkflowSection from "./WorkflowSection";
import FeatureSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import CallToActionSection from "./CallToActionSection";


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