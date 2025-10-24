import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      width="130"
      height="32"
      {...props}
      aria-label="GoWorld Tours"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      <text
        x="10"
        y="30"
        fontFamily="'PT Sans', sans-serif"
        fontSize="30"
        fontWeight="bold"
        fill="url(#logo-gradient)"
      >
        GoWorld
      </text>
      <text
        x="130"
        y="30"
        fontFamily="'PT Sans', sans-serif"
        fontSize="30"
        fill="hsl(var(--foreground))"
      >
        Tours
      </text>
    </svg>
  );
}
