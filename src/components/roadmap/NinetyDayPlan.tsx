import type { TransformationRoadmap } from '../../types';
import { cn } from '../../utils/cn';

const MARKS = [0, 30, 60, 90];

export function NinetyDayPlan({
  roadmap,
  activeIndex,
  onHover,
}: {
  roadmap: TransformationRoadmap;
  activeIndex: number | null;
  onHover: (index: number | null) => void;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-6 sm:p-7">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow">{roadmap.horizonLabel}</p>
        <p className="text-[12.5px] text-faint">Indicative sequencing</p>
      </div>

      {/* Day scale */}
      <div className="relative mt-6 mb-2 hidden h-4 sm:block">
        {MARKS.map((m) => (
          <span
            key={m}
            className="numeral absolute -translate-x-1/2 text-[11px] text-faint"
            style={{ left: `${(m / 90) * 100}%` }}
          >
            {m === 0 ? 'Day 1' : `Day ${m}`}
          </span>
        ))}
      </div>

      <div className="relative space-y-2.5">
        {/* gridlines */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          {MARKS.slice(1, -1).map((m) => (
            <span
              key={m}
              className="absolute top-0 bottom-0 w-px bg-line"
              style={{ left: `${(m / 90) * 100}%` }}
            />
          ))}
        </div>

        {roadmap.phases.map((phase, i) => {
          const active = activeIndex === i;
          const dimmed = activeIndex !== null && !active;
          return (
            <div
              key={phase.id}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              className="relative h-9"
            >
              {/* mobile: full-width bar with the date window inline */}
              <div
                className={cn(
                  'absolute inset-y-0 left-0 flex w-full items-center rounded-lg border px-3 transition-all duration-250 sm:hidden',
                  active
                    ? 'border-brand bg-brand text-white shadow-lift'
                    : 'border-brand-200 bg-brand-50/70 text-brand-900',
                  dimmed && 'opacity-45',
                )}
              >
                <span className="numeral mr-2 text-[11px] font-semibold opacity-55">
                  0{phase.index}
                </span>
                <span className="truncate text-[13px] font-semibold tracking-[-0.015em]">
                  {phase.name}
                </span>
                <span
                  className={cn(
                    'ml-auto shrink-0 pl-2 text-[11.5px]',
                    active ? 'text-white/65' : 'text-brand-400',
                  )}
                >
                  {phase.window}
                </span>
              </div>

              {/* desktop: bar positioned on the 90-day scale */}
              <div
                className={cn(
                  'absolute inset-y-0 hidden items-center rounded-lg border px-3 transition-all duration-250 sm:flex',
                  active
                    ? 'border-brand bg-brand text-white shadow-lift'
                    : 'border-brand-200 bg-brand-50/70 text-brand-900',
                  dimmed && 'opacity-45',
                )}
                style={{
                  left: `${phase.startPct}%`,
                  width: `${phase.endPct - phase.startPct}%`,
                }}
              >
                <span className="numeral mr-2 text-[11px] font-semibold opacity-55">
                  0{phase.index}
                </span>
                <span className="truncate text-[13px] font-semibold tracking-[-0.015em]">
                  {phase.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
