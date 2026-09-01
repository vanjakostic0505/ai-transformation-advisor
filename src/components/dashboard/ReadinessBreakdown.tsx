import { useState } from 'react';
import type { ReadinessAssessment, ReadinessFactor } from '../../types';
import { StatusLabel } from '../ui';
import { Check, Shield, Target } from '../ui/Icons';
import { cn } from '../../utils/cn';

/**
 * The readiness score, broken open.
 *
 * A single number is worse than useless on its own — it invites a company to
 * feel ready without knowing what they are missing. This section reports the
 * score alongside the factors that produced it, the gaps that would stall a
 * pilot, and one concrete next action.
 */

function FactorBar({
  factor,
  tone,
}: {
  factor: ReadinessFactor;
  tone: 'strength' | 'gap';
}) {
  return (
    <li className="py-2.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[13.5px] leading-snug font-medium text-ink">
          {factor.factor}
        </span>
        <span className="numeral shrink-0 text-[12.5px] font-semibold text-muted">
          {factor.answer}/5
        </span>
      </div>
      <div
        aria-hidden
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-700 ease-out',
            tone === 'strength' ? 'bg-accent' : 'bg-high',
          )}
          style={{ width: `${Math.max(factor.score, 4)}%` }}
        />
      </div>
    </li>
  );
}

function Panel({
  title,
  icon,
  tone = 'neutral',
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tone?: 'neutral' | 'positive' | 'warning';
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'rounded-[14px] border p-5',
        tone === 'positive' && 'border-accent/25 bg-accent-50/50',
        tone === 'warning' && 'border-high/25 bg-high-bg/50',
        tone === 'neutral' && 'border-line bg-surface',
      )}
    >
      <h3 className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] text-ink">
        <span aria-hidden className="text-brand-400 [&>svg]:size-4">
          {icon}
        </span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function ReadinessBreakdown({
  readiness,
}: {
  readiness: ReadinessAssessment;
}) {
  const [methodOpen, setMethodOpen] = useState(false);

  return (
    <section
      id="readiness"
      className="scroll-mt-24 border-t border-line bg-surface"
    >
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
          {/* Score */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Indicative AI readiness</p>

            <p className="numeral mt-4 text-[64px] leading-none font-semibold tracking-[-0.04em] text-brand">
              {readiness.score}
              <span className="ml-1 text-[24px] font-medium text-brand-400">
                /{readiness.outOf}
              </span>
            </p>

            <p className="mt-3 text-[15px] leading-snug font-semibold text-ink">
              {readiness.band}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted text-pretty">
              {readiness.bandExplanation}
            </p>

            <StatusLabel className="mt-4">Indicative — requires validation</StatusLabel>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => setMethodOpen((v) => !v)}
                aria-expanded={methodOpen}
                aria-controls="readiness-method"
                className="text-[12.5px] font-medium text-brand underline-offset-2 hover:underline"
              >
                {methodOpen ? 'Hide' : 'How this score was formed'}
              </button>
              {methodOpen && (
                <div
                  id="readiness-method"
                  className="mt-3 animate-fade-in rounded-xl border border-line bg-canvas/70 p-4"
                >
                  <p className="text-[12.5px] leading-relaxed text-ink-soft text-pretty">
                    {readiness.method}
                  </p>
                  <p className="mt-2.5 text-[12px] text-faint">
                    {readiness.answeredCount} scored factors of{' '}
                    {readiness.totalFactors} collected.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h2 className="display-3 text-ink text-balance">
              What sits behind that number
            </h2>
            <p className="mt-2.5 max-w-2xl text-[14.5px] leading-relaxed text-muted text-pretty">
              The score is the least useful part of this section. The gaps and
              the next action are what determine whether a pilot succeeds.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <Panel title="Strongest readiness factors" icon={<Check />} tone="positive">
                <ul className="divide-y divide-line/70">
                  {readiness.strengths.map((f) => (
                    <FactorBar key={f.key} factor={f} tone="strength" />
                  ))}
                </ul>
              </Panel>

              <Panel title="Most important gaps" icon={<Shield />} tone="warning">
                <ul className="divide-y divide-line/70">
                  {readiness.gaps.map((f) => (
                    <FactorBar key={f.key} factor={f} tone="gap" />
                  ))}
                </ul>
              </Panel>
            </div>

            {readiness.opportunitySignals.length > 0 && (
              <div className="mt-4 rounded-[14px] border border-line bg-canvas/60 p-5">
                <h3 className="text-[13px] font-semibold text-ink">
                  Opportunity signal — reported separately
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted text-pretty">
                  A large amount of remaining manual work indicates a large
                  opportunity. It is deliberately excluded from the readiness
                  score, because having a lot of manual work is not evidence
                  that an organisation is ready to automate it.
                </p>
                <ul className="mt-3 flex flex-wrap gap-4">
                  {readiness.opportunitySignals.map((s) => (
                    <li key={s.key} className="text-[13px] text-ink-soft">
                      <span className="font-medium">{s.factor}:</span>{' '}
                      <span className="numeral">{s.answer}/5</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Panel title="Validate before any pilot" icon={<Shield />}>
                <ul className="space-y-2">
                  {readiness.validateBeforePilot.map((v) => (
                    <li key={v} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[7px] size-1.5 shrink-0 rounded-full bg-line-strong"
                      />
                      <span className="text-[13px] leading-relaxed text-ink-soft">
                        {v}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Recommended next discovery action" icon={<Target />}>
                <p className="text-[13.5px] leading-relaxed text-ink-soft text-pretty">
                  {readiness.nextDiscoveryAction}
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
