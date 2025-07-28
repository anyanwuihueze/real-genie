
import type { SVGProps } from 'react';

export function PlaneWithGenie(props: SVGProps<SVGSVGElement>) {
  // Path data for lucide-react Plane icon
  const planePath = "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" // Standard lucide viewBox
      {...props} // Spread className, style, etc.
    >
      {/* Plane path as an outline */}
      <path
        d={planePath}
        fill="none"
        stroke="currentColor" // Takes color from className (e.g., text-accent)
        strokeWidth="1" // Adjusted stroke width for better outline visibility
      />
      {/* Text "Genie" */}
      <text
        x="12" // Centered horizontally
        y="12"  // Centered vertically on viewBox
        fontSize="1.6" // Reduced font size further (Genie is longer)
        fill="hsl(var(--primary-foreground))" // Text color for contrast
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontWeight="bold"
        textAnchor="middle" // Horizontal centering
        dominantBaseline="central" // Vertical centering
        transform="rotate(-10 12 12)" // Rotate around the text's center (12,12)
      >
        Genie
      </text>
    </svg>
  );
}
