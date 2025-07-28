
'use client';
import { cn } from '@/lib/utils';

interface SuccessRateVisualProps {
  rate: number;
  className?: string;
}

export function SuccessRateVisual({ rate, className }: SuccessRateVisualProps) {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const offset = circumference - (rate / 100) * circumference;

  return (
    <div className={cn("relative h-28 w-28", className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-muted/20"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className="text-accent drop-shadow-[0_2px_2px_rgba(245,158,11,0.5)]"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{rate}<span className="text-xl opacity-70">%</span></span>
        <span className="text-xs text-muted-foreground -mt-1 tracking-wider">Success</span>
      </div>
    </div>
  );
}
