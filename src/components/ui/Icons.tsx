/** Minimal inline icon set — keeps the bundle free of an icon dependency. */
import type { SVGProps } from 'react';

const base = (props: SVGProps<SVGSVGElement>) => ({
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export const ArrowRight = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2" />
  </svg>
);

export const ArrowLeft = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M16 10H5m0 0 4.2-4.2M5 10l4.2 4.2" />
  </svg>
);

export const ArrowDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10 4v11m0 0 4.2-4.2M10 15l-4.2-4.2" />
  </svg>
);

export const Check = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4.5 10.5 8 14l7.5-8" />
  </svg>
);

export const Close = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 5l10 10M15 5 5 15" />
  </svg>
);

export const Plus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10 4.5v11M4.5 10h11" />
  </svg>
);

export const Building = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3.5 17h13M5 17V4.5A1.5 1.5 0 0 1 6.5 3h4A1.5 1.5 0 0 1 12 4.5V17M12 8.5h2.5A1.5 1.5 0 0 1 16 10v7M7.5 6.5h2M7.5 9.5h2M7.5 12.5h2" />
  </svg>
);

export const Users = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="8" cy="7" r="2.6" />
    <path d="M3 16.2c0-2.5 2.2-4.2 5-4.2s5 1.7 5 4.2" />
    <path d="M13.6 5.1a2.6 2.6 0 0 1 0 4.9M14.4 12.4c1.7.5 2.9 1.9 2.9 3.8" />
  </svg>
);

export const Flow = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="2.5" y="3" width="6" height="4.2" rx="1.2" />
    <rect x="11.5" y="12.8" width="6" height="4.2" rx="1.2" />
    <path d="M5.5 7.2v4.4a1.6 1.6 0 0 0 1.6 1.6h4.4" />
  </svg>
);

export const Layers = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="m10 2.8 7 3.6-7 3.6-7-3.6 7-3.6Z" />
    <path d="m3 10.4 7 3.6 7-3.6M3 14.1l7 3.6 7-3.6" />
  </svg>
);

export const Target = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="10" cy="10" r="7" />
    <circle cx="10" cy="10" r="3.4" />
    <circle cx="10" cy="10" r="0.6" fill="currentColor" />
  </svg>
);

export const Gauge = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3.4 14.5a7.6 7.6 0 1 1 13.2 0" />
    <path d="M10 10.6 13.2 7" />
    <circle cx="10" cy="11.6" r="1.1" />
  </svg>
);

export const Spark = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10 2.6 11.7 7l4.4 1.7-4.4 1.7L10 14.8 8.3 10.4 3.9 8.7 8.3 7 10 2.6Z" />
    <path d="M15.4 13.4 16 15l1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6.6-1.6Z" />
  </svg>
);

export const Bolt = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M11.2 2.5 4.8 11h4.2l-1 6.5L14.4 9h-4.2l1-6.5Z" />
  </svg>
);

export const Grid = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="6" height="6" rx="1.4" />
    <rect x="11" y="3" width="6" height="6" rx="1.4" />
    <rect x="3" y="11" width="6" height="6" rx="1.4" />
    <rect x="11" y="11" width="6" height="6" rx="1.4" />
  </svg>
);

export const Shield = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M10 2.8 16 5v4.4c0 3.6-2.4 6.7-6 7.8-3.6-1.1-6-4.2-6-7.8V5l6-2.2Z" />
    <path d="m7.6 9.9 1.7 1.7 3.2-3.4" />
  </svg>
);

export const Document = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M11.5 2.6H6.2A1.7 1.7 0 0 0 4.5 4.3v11.4a1.7 1.7 0 0 0 1.7 1.7h7.6a1.7 1.7 0 0 0 1.7-1.7V6.6l-4-4Z" />
    <path d="M11.4 2.6v3.2a1 1 0 0 0 1 1h3.1M7.6 11h4.8M7.6 13.8h3.2" />
  </svg>
);
