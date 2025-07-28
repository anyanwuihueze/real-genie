'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="h-full bg-background shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border/70 transform hover:-translate-y-1">
      <CardHeader className="items-center text-center pb-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary mb-4 inline-block">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="text-xl font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
