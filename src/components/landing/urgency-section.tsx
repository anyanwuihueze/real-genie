
'use client';

import { AlertTriangle } from 'lucide-react';

export function UrgencySection() {
  return (
    <section className="py-10 md:py-12 bg-destructive text-destructive-foreground">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
          <AlertTriangle className="h-8 w-8" />
          <h3 className="text-xl md:text-2xl font-semibold">
            Immigration Policies Are Tightening. Act Now!
          </h3>
        </div>
        <p className="text-sm md:text-base text-destructive-foreground/90 max-w-3xl mx-auto">
          Countries are reducing quotas more frequently. The window for easier migration paths is narrowing. Those who act decisively now will be among the last to benefit from current opportunities. Don't delay your Japa journey.
        </p>
      </div>
    </section>
  );
}
