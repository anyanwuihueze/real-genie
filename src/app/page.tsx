import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { AppPreviewSection } from "@/components/landing/app-preview-section";
import { PainPointsSection } from "@/components/landing/pain-points-section";
import { SocialProofSection } from "@/components/landing/social-proof-section";
import { SuccessStoriesSection } from "@/components/landing/success-stories-section";
import { MockInterviewSection } from "@/components/landing/mock-interview-section";
import { UrgencySection } from "@/components/landing/urgency-section";

export default function Home() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
      <AppPreviewSection />
      <PainPointsSection />
      <SocialProofSection />
      <SuccessStoriesSection />
      <MockInterviewSection />
      <UrgencySection />
    </main>
  );
}
