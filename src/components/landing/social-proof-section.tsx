
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export function SocialProofSection() {
  return (
    <section className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">
            Success Stories That Inspire
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of Africans who've achieved their Japa dreams with us.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto mb-12 md:mb-16 p-6 md:p-8 shadow-xl bg-background border border-border/50">
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-lg md:text-xl italic text-foreground mb-6">
              "I wasted <span className="font-semibold">over $1000 USD</span> on two rejected applications to the UK. Japa Genie showed me why I was failing and guided me to Canada instead. Got my PR in 14 months. This app literally changed my life."
            </p>
            <p className="font-semibold text-primary">- Adunni O., Software Developer <span className="text-muted-foreground">(Now in Toronto)</span></p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="p-6 bg-background rounded-lg shadow-lg border border-border/30">
            <TrendingUp className="h-10 w-10 text-accent mx-auto mb-3" />
            <div className="text-3xl font-bold text-accent">94%</div>
            <p className="text-muted-foreground mt-1">Success Rate (412 out of 437 users in 2024 following our strategy)</p>
          </div>
          <div className="p-6 bg-background rounded-lg shadow-lg border border-border/30">
            <Users className="h-10 w-10 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-primary">1,200+</div>
            <p className="text-muted-foreground mt-1">Successful relocations guided</p>
          </div>
          <div className="p-6 bg-background rounded-lg shadow-lg border border-border/30">
            <ShieldCheck className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-500">$45M+ USD</div>
            <p className="text-muted-foreground mt-1">Saved in avoided rejection costs (User Est.)</p>
          </div>
        </div>
      </div>
    </section>
  );
}
