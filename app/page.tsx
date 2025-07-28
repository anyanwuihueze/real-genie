import { AppPreviewSection } from "@/components/landing/app-preview-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { MockInterviewSection } from "@/components/landing/mock-interview-section";
import { PainPointsSection } from "@/components/landing/pain-points-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { SuccessStoriesSection } from "@/components/landing/success-stories-section";
import { UrgencySection } from "@/components/landing/urgency-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <UrgencySection />
        <PainPointsSection />
        <FeaturesSection />
        <AppPreviewSection />
        <SocialProofSection />
        <MockInterviewSection />
        <SuccessStoriesSection />
      </main>
    </div>
  );
}
