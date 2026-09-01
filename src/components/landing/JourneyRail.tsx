import type { ReactNode } from 'react';
import { Building, Gauge, Grid, Layers, Spark, Users } from '../ui/Icons';
import { cn } from '../../utils/cn';

interface JourneyStep {
  label: string;
  caption: string;
  icon: ReactNode;
  /** The stage this product covers */
  current?: boolean;
}

/**
 * The commercial journey, honestly sequenced.
 *
 * The assessment is the first step of nine, not a shortcut past the rest. The
 * rail marks where this tool ends so nobody mistakes an indicative map for a
 * decision.
 */
export const JOURNEY: JourneyStep[] = [
  {
    label: 'Self-assessment',
    caption: 'Workforce, processes, systems, objectives',
    icon: <Building />,
    current: true,
  },
  {
    label: 'Indicative opportunity map',
    caption: 'Provisionally ranked, with every assumption visible',
    icon: <Grid />,
    current: true,
  },
  {
    label: 'Expert validation',
    caption: 'An advisor tests the assumptions against your reality',
    icon: <Gauge />,
  },
  {
    label: 'Discovery & business case',
    caption: 'Measured baselines, then a case Finance will sign',
    icon: <Layers />,
  },
  {
    label: 'Controlled pilot',
    caption: 'Narrow scope, agreed stopping rule, measured throughout',
    icon: <Users />,
  },
  {
    label: 'Implementation & scale',
    caption: 'Delivery, where a platform such as Smooth Operator fits',
    icon: <Spark />,
  },
];

export function JourneyRail() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {JOURNEY.map((step, i) => (
        <li
          key={step.label}
          className="relative animate-fade-up"
          style={{ animationDelay: `${140 + i * 70}ms` }}
        >
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
              step.current
                ? 'border-brand-200 bg-brand-50/45'
                : 'border-line hover:border-line-strong',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                aria-hidden
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  step.current
                    ? 'border-brand-200 bg-surface text-brand'
                    : 'border-line bg-canvas text-brand-400',
                )}
              >
                <span className="[&>svg]:size-4">{step.icon}</span>
              </span>
              <span aria-hidden className="numeral text-[11px] font-semibold text-faint">
                0{i + 1}
              </span>
            </div>

            <p className="mt-3 text-[13.5px] leading-snug font-semibold tracking-[-0.015em] text-ink">
              {step.label}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-muted">{step.caption}</p>

            {step.current && (
              <p className="mt-2.5 inline-block rounded border border-accent/30 bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.05em] text-accent-700 uppercase">
                This tool
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
