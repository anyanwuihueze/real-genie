
'use client';

import { PlaneWithJapa } from '@/components/icons/PlaneWithJapa';
import { PlaneWithGenie } from '@/components/icons/PlaneWithGenie';

export function AirplaneTakeoffVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Plane 1 with "Japa" */}
      <PlaneWithJapa
        className="absolute h-24 w-24 md:h-32 md:w-32 text-genie-gold animate-airplane-takeoff"
        style={{ animationDelay: '0s' }} 
      />
      {/* Plane 2 with "Genie" - Opposite direction and slightly delayed */}
      <PlaneWithGenie
        className="absolute h-24 w-24 md:h-32 md:w-32 text-genie-gold animate-airplane-takeoff-opposite"
        style={{ animationDelay: '0.2s' }} 
      />
    </div>
  );
}
