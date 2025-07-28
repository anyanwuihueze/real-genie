
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Layers, Hourglass, NavigationOff, FileStack, MapPinOff } from 'lucide-react';

const painPointsData = [
  {
    icon: <ShieldX className="h-12 w-12 text-destructive mb-4" />,
    title: 'Costly Rejections',
    description: "You've spent ₦500k+ on visa fees, documents, and travel, only to get rejected without clear reasons.",
  },
  {
    icon: <Layers className="h-12 w-12 text-primary mb-4" />,
    title: 'Information Overload',
    description: 'Contradictory advice online, outdated YouTube videos, and "consultants" who don\'t understand your specific situation.',
  },
  {
    icon: <Hourglass className="h-12 w-12 text-yellow-500 mb-4" />,
    title: 'Time Wasting',
    description: 'Months of research, document hunting, and applications that lead nowhere while opportunities pass you by.',
  },
  {
    icon: <NavigationOff className="h-12 w-12 text-muted-foreground mb-4" />,
    title: 'Isolation & Uncertainty',
    description: "No one to guide you through the process. You're figuring it out alone while watching friends succeed abroad.",
  },
  {
    icon: <FileStack className="h-12 w-12 text-blue-400 mb-4" />,
    title: 'Document Chaos',
    description: "Birth certificates, attestations, police reports - you're drowning in paperwork with no clear roadmap.",
  },
  {
    icon: <MapPinOff className="h-12 w-12 text-orange-500 mb-4" />,
    title: 'Wrong Target Countries',
    description: 'Applying to countries with low acceptance rates for your profile instead of strategic alternatives.',
  },
];

export function PainPointsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-primary">
            Tired of These Visa Nightmares?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're not alone. Thousands of qualified Nigerians face these same challenges every day.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {painPointsData.map((painPoint, index) => (
            <Card
              key={index}
              className="text-center bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="items-center">
                {painPoint.icon}
                <CardTitle className="text-xl text-card-foreground">{painPoint.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{painPoint.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
