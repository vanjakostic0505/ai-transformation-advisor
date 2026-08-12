import { cn } from '../../utils/cn';
import type { Complexity, OversightLevel, Priority } from '../../types';

const TONE = {
  high: 'bg-high-bg text-high border-high/20',
  medium: 'bg-medium-bg text-medium border-medium/20',
  low: 'bg-low-bg text-low border-low/15',
  brand: 'bg-brand-50 text-brand border-brand-200',
  accent: 'bg-accent-50 text-accent-700 border-accent/20',
  neutral: 'bg-canvas text-muted border-line',
} as const;

export type BadgeTone = keyof typeof TONE;

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5',
        'text-[11px] font-semibold uppercase tracking-[0.07em] whitespace-nowrap',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge tone={PRIORITY_TONE[priority]}>
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-current opacity-70"
      />
      {priority} priority
    </Badge>
  );
}

export function ComplexityBadge({ complexity }: { complexity: Complexity }) {
  return <Badge tone="neutral">{complexity} complexity</Badge>;
}

export function OversightBadge({ level }: { level: OversightLevel }) {
  return <Badge tone="brand">{level} oversight</Badge>;
}
