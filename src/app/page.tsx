
import { HeroSection } from "@/components/landing/hero-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
      </main>
    </div>
  );
}
