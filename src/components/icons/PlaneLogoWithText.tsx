
import type { SVGProps } from 'react';

export function PlaneLogoWithText(props: SVGProps<SVGSVGElement>) {
  // Path data for lucide-react Plane icon
  const planePath = "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" // Standard lucide viewBox
      {...props} // Spread remaining props, allowing overrides
    >
      {/* Plane path - as an outline */}
      <path
        d={planePath}
        fill="none" // Plane is an outline
        stroke="hsl(var(--primary))" // Outline color is primary
        strokeWidth="1" // Adjusted stroke width
      />
      {/* Text "Japa" - drawn last to be on top */}
      <text
        x="12" // Center horizontally
        y="12.3" // Adjusted y for better vertical centering
        fontSize="2.8" // Reduced font size for better fit
        fill="hsl(var(--primary))" // Text color matches plane outline
        stroke="none" // No stroke on text
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontWeight="bold"
        textAnchor="middle" // Horizontally align text center to x coordinate
        dominantBaseline="central" // Vertically align text center to y coordinate
      >
        Japa
      </text>
    </svg>
  );
}
