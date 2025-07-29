
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#4338ca] to-[#f59e0b] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          STOP Getting Scammed. START Getting Real Results Today with Japa Genie.
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8">
          Our AI matches you to countries with high approval rates. Start a conversation with Japa Genie and find your destination.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl text-black"
            asChild
          >
            <Link href="/chat" className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              <span>Start Your Journey</span>
            </Link>
          </Button>
          <Button
            variant="link"
            className="text-white hover:text-yellow-300 text-lg group flex items-center gap-1"
            asChild
          >
            <Link href="/how-it-works">
              Learn How It Works
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
