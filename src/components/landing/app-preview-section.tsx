
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Check, Circle, MessageSquare, Target, ClockIcon, CircleDollarSign, CheckCircle, Activity, ListChecks, Sparkles } from 'lucide-react';

interface AppPreviewSectionProps {
  id?: string;
}

export function AppPreviewSection({ id }: AppPreviewSectionProps) {
  return (
    <section id={id} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">
            Meet Your AI Visa Companion
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Japa Genie transforms your visa journey from chaos to clarity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <Card className="bg-card shadow-xl border-border/50">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <MessageSquare className="mr-2 h-6 w-6" /> Your Personal AI Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6 text-sm">
              <div className="p-3 rounded-lg bg-muted text-muted-foreground border-l-4 border-primary shadow">
                <strong className="text-foreground block mb-1">You:</strong>
                "I'm a software engineer with 5 years experience. My budget is about $4000. Where should I apply?"
              </div>
              <div className="p-3 rounded-lg bg-primary text-primary-foreground shadow">
                <strong className="block mb-1">Japa Genie:</strong>
                "Based on your profile (Wish 1), Canada's Express Entry is a strong contender. Germany's EU Blue Card also looks promising. With Wish 2, I can create a 6-month personalized roadmap for Canada..."
              </div>
              <div className="p-3 rounded-lg bg-accent/20 text-accent-foreground border-l-4 border-accent shadow">
                <strong className="text-accent block mb-1">📌 Japa Genie (Wish 3):</strong>
                "Your WES evaluation for Canada is due June 15th. I've pre-filled the common sections of your Express Entry profile based on our chat. Review?"
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/10 text-primary-foreground shadow-xl border-primary/30">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <ListChecks className="mr-2 h-6 w-6" /> Your Progress Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 md:p-6 text-sm">
              {[
                { icon: <CheckCircle className="text-accent h-6 w-6" />, label: "AI Profile Analysis Complete (Wish 1)", status: "done" },
                { icon: <Activity className="text-yellow-400 h-6 w-6 animate-pulse" />, label: "Personalized Roadmap Generated (Wish 2)", status: "progress" },
                { icon: <Circle className="text-muted-foreground/50 h-6 w-6" />, label: "Document AI Pre-Screen (Wish 3)", status: "todo" },
                { icon: <Circle className="text-muted-foreground/50 h-6 w-6" />, label: "Visa Application Submission", status: "todo" },
              ].map((item, index) => (
                <div key={index} className={`flex items-center p-3 rounded-md ${item.status === 'done' ? 'bg-accent/20' : item.status === 'progress' ? 'bg-yellow-500/20' : 'bg-muted/20'}`}>
                  <div className="mr-3 shrink-0">{item.icon}</div>
                  <span className={`${item.status === 'done' ? 'text-accent-foreground' : item.status === 'progress' ? 'text-yellow-300' : 'text-muted-foreground'}`}>{item.label}</span>
                </div>
              ))}
              <div className="mt-6 p-4 rounded-lg bg-primary/80 text-primary-foreground shadow-md">
                <div className="flex items-center mb-1"><Target className="h-5 w-5 mr-2" /><strong>Success Likelihood:</strong> <span className="ml-1 font-semibold">Increased by 35% with AI</span></div>
                <div className="flex items-center mb-1"><ClockIcon className="h-5 w-5 mr-2" /><strong>Timeline:</strong> <span className="ml-1 font-semibold">8-12 months (Canada)</span></div>
                <div className="flex items-center"><CircleDollarSign className="h-5 w-5 mr-2" /><strong>Budget Fit:</strong> <span className="ml-1 font-semibold">Within $4000 Target</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* The golden button previously here has been moved to the HeroSection */}
        {/*
        <div className="mt-12 md:mt-16 text-center">
          <Button
            size="lg"
            asChild
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-xl shadow-amber-500/50 hover:shadow-amber-400/60 transform hover:scale-105 transition-all duration-200 animate-wiggle px-10 py-7 text-xl"
          >
            <Link href="/chat">
              <Sparkles className="mr-3 h-6 w-6" />
              Chat with Japa Genie Now
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Experience AI-powered visa guidance firsthand.
          </p>
        </div>
        */}
      </div>
    </section>
  );
}
