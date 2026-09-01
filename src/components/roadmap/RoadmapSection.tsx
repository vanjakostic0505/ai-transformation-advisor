import { useState } from 'react';
import type { TransformationRoadmap } from '../../types';
import { SectionHeading } from '../ui';
import { NinetyDayPlan } from './NinetyDayPlan';
import { Shield } from '../ui/Icons';
import { cn } from '../../utils/cn';

export function RoadmapSection({ roadmap }: { roadmap: TransformationRoadmap }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="roadmap" className="scroll-mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <SectionHeading
          eyebrow="The advisory journey"
          title="From an indicative map to measured results"
          description="Eight stages. This assessment is the first of them. Each stage exists to replace an assumption with evidence, and any of them can end the work early — which is the point of sequencing them this way."
        />

        <div className="mt-9 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <ol className="space-y-2.5">
            {roadmap.phases.map((phase, i) => {
              const isActive = active === i;
              const isCurrent = i === 0;
              return (
                <li
                  key={phase.id}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={cn(
                    'rounded-[14px] border p-5 transition-all duration-250',
                    isActive
                      ? 'border-brand-200 bg-brand-50/40 shadow-card'
                      : 'border-line bg-canvas/40',
                    phase.beyondNinetyDays && 'border-dashed',
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
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
                          {phase.name}
                        </h3>
                        <span className="text-[12px] text-faint">{phase.window}</span>
                        {isCurrent && (
                          <span className="rounded border border-accent/30 bg-accent-50 px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.05em] text-accent-700 uppercase">
                            You are here
                          </span>
                        )}
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

                      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3 text-[12px]">
                        <div className="flex gap-1.5">
                          <dt className="text-faint">Produces:</dt>
                          <dd className="font-medium text-ink-soft">{phase.output}</dd>
                        </div>
                        <div className="flex gap-1.5">
                          <dt className="text-faint">Led by:</dt>
                          <dd className="font-medium text-ink-soft">{phase.owner}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <NinetyDayPlan roadmap={roadmap} activeIndex={active} onHover={setActive} />

            <div className="rounded-[14px] border border-line bg-canvas/60 p-5 sm:p-6">
              <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.015em] text-ink">
                <span aria-hidden className="text-brand-400 [&>svg]:size-4">
                  <Shield />
                </span>
                Gates before a pilot or implementation
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted text-pretty">
                Each of these has to be cleared, by a named owner, before
                delivery begins. Any one of them can stop the work — and it is
                far cheaper for that to happen here than after a build.
              </p>

              <ul className="mt-4 divide-y divide-line">
                {roadmap.gates.map((gate) => (
                  <li key={gate.id} className="py-3">
                    <div className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-line-strong bg-surface"
                      />
                      <div className="min-w-0">
                        <p className="text-[13.5px] leading-snug font-medium text-ink">
                          {gate.label}
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                          {gate.detail}
                        </p>
                        <p className="mt-1 text-[11.5px] text-faint">
                          Owner: {gate.owner}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
