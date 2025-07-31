'use client';

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Navigate Your Visa Journey with Confidence
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            VisaWise Navigator is your AI-powered copilot for finding the perfect visa. Get personalized recommendations based on your budget and background.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/chat" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Sparkles className="h-5 w-5" />
                <span>Start Your Journey</span>
              </Link>
            </Button>
            <Button size="lg" variant="link" asChild>
              <Link href="/how-it-works" className="text-blue-600 hover:text-blue-800">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}