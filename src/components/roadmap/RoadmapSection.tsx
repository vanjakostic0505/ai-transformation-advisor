import { useState } from 'react';
import type { TransformationRoadmap } from '../../types';
import { SectionHeading } from '../ui';
import { NinetyDayPlan } from './NinetyDayPlan';
import { cn } from '../../utils/cn';

export function RoadmapSection({ roadmap }: { roadmap: TransformationRoadmap }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="roadmap" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-18 sm:px-8 lg:py-22">
        <SectionHeading
          eyebrow="Executive summary"
          title="Your AI Transformation Roadmap"
          description="Five phases. The first AI worker is live and measured inside the first 90 days — before anything is scaled."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <ol className="space-y-2.5">
            {roadmap.phases.map((phase, i) => {
              const isActive = active === i;
              return (
                <li
                  key={phase.id}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    'rounded-[14px] border p-5 transition-all duration-250 sm:p-6',
                    isActive
                      ? 'border-brand-200 bg-brand-50/40 shadow-card'
                      : 'border-line bg-canvas/40',
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={cn(
                        'numeral flex size-9 shrink-0 items-center justify-center rounded-xl border text-[13px] font-semibold transition-colors duration-250',
                        isActive
                          ? 'border-brand bg-brand text-white'
                          : 'border-line bg-surface text-brand',
                      )}
                    >
                      {phase.index}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-ink">
                          Phase {phase.index} — {phase.name}
                        </h3>
                        <span className="text-[12px] text-faint">{phase.window}</span>
                      </div>
                      <p className="mt-1 text-[13.5px] leading-snug text-muted">
                        {phase.objective}
                      </p>
                      <ul className="mt-3.5 grid gap-1.5 border-t border-line pt-3.5 sm:grid-cols-2">
                        {phase.activities.map((a) => (
                          <li
                            key={a}
                            className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-soft"
                          >
                            <span
                              aria-hidden
                              className="mt-[6px] size-1 shrink-0 rounded-full bg-line-strong"
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <NinetyDayPlan roadmap={roadmap} activeIndex={active} onHover={setActive} />
          </div>
        </div>
      </div>
    </section>
  );
}
