import type { ReactNode } from 'react';
import {
  Building,
  Gauge,
  Grid,
  Layers,
  Spark,
  Users,
} from '../ui/Icons';
import { cn } from '../../utils/cn';

interface JourneyStep {
  label: string;
  caption: string;
  icon: ReactNode;
  terminal?: boolean;
}

export const JOURNEY: JourneyStep[] = [
  { label: 'Your Company', caption: 'Workforce, processes, systems, objectives', icon: <Building /> },
  { label: 'AI Advisor', caption: 'Structured analysis of where work happens', icon: <Gauge /> },
  { label: 'AI Opportunity Map', caption: 'Ranked by value, priority and complexity', icon: <Grid /> },
  { label: 'AI Operating Model', caption: 'How people and AI divide the work', icon: <Layers /> },
  { label: 'AI Workforce', caption: 'The specific AI workers to build', icon: <Users /> },
  { label: 'Smooth Operator', caption: 'Configuration, deployment, operation', icon: <Spark />, terminal: true },
];

export function JourneyRail({ compact = false }: { compact?: boolean }) {
  return (
    <ol
      className={cn(
        'grid gap-3',
        compact
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
      )}
    >
      {JOURNEY.map((step, i) => (
        <li
          key={step.label}
          className="relative animate-fade-up"
          style={{ animationDelay: `${140 + i * 70}ms` }}
        >
          {/* connector — desktop */}
          {i < JOURNEY.length - 1 && (
            <span
              aria-hidden
              className="absolute top-[26px] -right-3 hidden h-px w-3 bg-line-strong lg:block"
            />
          )}
          <div
            className={cn(
              'h-full rounded-xl border bg-surface p-4 transition-all duration-250',
              'hover:-translate-y-0.5 hover:shadow-lift',
              step.terminal
                ? 'border-brand-200 bg-brand-50/45'
                : 'border-line hover:border-line-strong',
            )}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  step.terminal
                    ? 'border-brand-200 bg-surface text-brand'
                    : 'border-line bg-canvas text-brand-400',
                )}
              >
                <span className="[&>svg]:size-4">{step.icon}</span>
              </span>
              <span className="numeral text-[11px] font-semibold text-faint">
                0{i + 1}
              </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-snug font-semibold tracking-[-0.015em] text-ink">
              {step.label}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-muted">
              {step.caption}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
