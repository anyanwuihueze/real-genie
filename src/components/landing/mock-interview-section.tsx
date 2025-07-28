
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { PlayCircle, CheckCircle2, FileText, Calendar, Briefcase, ArrowRight } from "lucide-react";

const mockInterviewFeatures = [
  {
    icon: PlayCircle,
    title: "Video Guides",
    description: "US visa interview preparation videos",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Document Templates",
    description: "German visa application document templates",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Calendar,
    title: "Interview Scheduler",
    description: "Book mock interviews with experts",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    icon: Briefcase,
    title: "Industry-Specific Tips",
    description: "Tailored advice for different professions",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export function MockInterviewSection() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Student Visas", "Work Permits", "Business Visas", "Family Reunification"];

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-genie-gold to-red-500 bg-clip-text text-transparent">
            Mock Interview Preparation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice with our AI-powered interview generator and increase your chances of approval.
          </p>
        </div>
        
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab, index) => (
              <Button
                key={index}
                variant={activeTab === index ? "default" : "ghost"}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "rounded-full px-6 transition-all duration-300",
                  activeTab === index 
                    ? "bg-gradient-to-r from-genie-gold to-red-500 text-white" 
                    : "text-gray-600 hover:text-genie-gold"
                )}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Sample Interview Questions</h3>
              <div className="space-y-4">
                {[
                  "Can you explain your study plans in detail?",
                  "How will you finance your education?",
                  "What are your plans after graduation?",
                  "Do you have any relatives in the country?",
                  "Why did you choose this specific university?"
                ].map((question, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-genie-gold mt-0.5" />
                    <p className="text-gray-600">{question}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button 
                  className="group relative overflow-hidden bg-gradient-to-r from-genie-gold to-red-500 hover:from-red-500 hover:to-genie-gold transition-all duration-300 shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link href="/interview" className="flex items-center gap-2">
                    <span>Start Practice Interview</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockInterviewFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="group rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-100"
              >
                <div className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
