
'use client';

import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Target, BarChart, Clock, CheckCircle, Building, Users, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "AI Visa Matchmaker",
    description: "Get matched to countries with highest acceptance rates for YOUR specific profile, qualifications, and budget.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: BarChart,
    title: "Real-Time Success Rates",
    description: "Live data on visa acceptance rates, processing times, and costs updated by our AI agents daily.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Clock,
    title: "Visual Progress Tracking",
    description: "See exactly where you are in your journey with our interactive progress map. No more guessing.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: CheckCircle,
    title: "24/7 AI Guidance",
    description: "Get instant answers to your visa questions. No more waiting for consultants or outdated forums.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Building,
    title: "Jobs in Demand",
    description: "Discover which skills are most wanted in your target countries and how to position yourself.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Users,
    title: "Rejection Recovery",
    description: "Been rejected before? Our AI analyzes why and creates a comeback strategy that works.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-surface-alt relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-genie-gold to-red-500 bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for African professionals who refuse to settle for rejection.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-100"
            >
              <div className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="group relative overflow-hidden bg-gradient-to-r from-genie-gold to-red-500 hover:from-red-500 hover:to-genie-gold transition-all duration-300 shadow-lg hover:shadow-xl"
            asChild
          >
            <Link href="/features" className="flex items-center gap-2">
              <span className="relative z-10">Explore All Features</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
