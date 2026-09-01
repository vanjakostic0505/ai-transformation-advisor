import { useEffect, useState } from 'react';
import { useAdvisor } from '../../state/AdvisorProvider';
import { StatusLabel } from '../ui';
import { Check } from '../ui/Icons';
import { cn } from '../../utils/cn';

const STAGES = [
  {
    label: 'Workforce structure',
    detail: 'Mapping the headcount you gave us to functional workload',
  },
  {
    label: 'Operational workflows',
    detail: 'Looking for repeatable, rule-bounded work',
  },
  {
    label: 'Technology environment',
    detail: 'Noting the systems of record an AI worker would need',
  },
  {
    label: 'Potential AI opportunities',
    detail: 'Matching work patterns to AI capability',
  },
  {
    label: 'Indicative value ranges',
    detail: 'Applying illustrative sector assumptions to your scale',
  },
];

const STAGE_MS = 780;
const HOLD_MS = 700;

export function AnalysisScreen() {
  const { input, map, actions } = useAdvisor();
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    if (completed >= STAGES.length) return;
    const t = window.setTimeout(() => setCompleted((c) => c + 1), STAGE_MS);
    return () => window.clearTimeout(t);
  }, [completed]);

  useEffect(() => {
    if (completed < STAGES.length || !map) return;
    const t = window.setTimeout(actions.completeAnalysis, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [completed, map, actions]);

  const progress = Math.round((completed / STAGES.length) * 100);

  return (
    <div className="relative flex min-h-[calc(100dvh-68px)] items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_45%,black,transparent)]"
      />

      <div className="relative w-full max-w-lg">
        <p className="eyebrow">AI Advisor</p>
        <h1 className="display-2 mt-3 text-ink text-balance">
          Building your indicative map
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
          {input.company.name || 'Your company'} ·{' '}
          {input.company.industry || 'Industry'} ·{' '}
          {input.workforce.units.length} functions
        </p>

        <div className="mt-4">
          <StatusLabel>Indicative — requires validation</StatusLabel>
        </div>

        <div
          className="mt-8 h-1 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Analysis progress"
        >
          <div
            className="h-full rounded-full bg-brand transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mt-8 space-y-1">
          {STAGES.map((stage, i) => {
            const done = i < completed;
            const active = i === completed;
            return (
              <li
                key={stage.label}
                className={cn(
                  'flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-400',
                  active && 'bg-surface shadow-card',
                  !done && !active && 'opacity-45',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'mt-px flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                    done
                      ? 'border-accent bg-accent text-white'
                      : active
                        ? 'border-brand-400 bg-surface'
                        : 'border-line bg-surface',
                  )}
                >
                  {done ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : active ? (
                    <span className="size-1.5 animate-pulse rounded-full bg-brand" />
                  ) : null}
                </span>

                <span className="min-w-0">
                  <span
                    className={cn(
                      'block text-[14.5px] leading-snug font-medium transition-colors',
                      done || active ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {stage.label}
                  </span>
                  {active && (
                    <span className="mt-0.5 block animate-fade-in text-[12.5px] text-muted">
                      {stage.detail}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-[13px] text-muted" aria-live="polite">
          {completed >= STAGES.length
            ? 'Assembling your indicative opportunity map…'
            : ' '}
        </p>
      </div>
    </div>
  );
}
