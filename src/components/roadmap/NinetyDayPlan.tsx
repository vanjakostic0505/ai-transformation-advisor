import type { TransformationRoadmap } from '../../types';
import { StatusLabel } from '../ui';
import { cn } from '../../utils/cn';

const MARKS = [0, 30, 60, 90];

/**
 * The 90-day rail is an illustration of how this work usually orders itself,
 * not a delivery commitment. Phases that genuinely sit beyond 90 days are
 * listed separately rather than compressed onto the rail to make the timeline
 * look shorter than it is.
 */
export function NinetyDayPlan({
  roadmap,
  activeIndex,
  onHover,
}: {
  roadmap: TransformationRoadmap;
  activeIndex: number | null;
  onHover: (index: number | null) => void;
}) {
  const onRail = roadmap.phases.filter(
    (p) => p.startPct !== null && p.endPct !== null,
  );
  const beyond = roadmap.phases.filter((p) => p.beyondNinetyDays);

  return (
    <div className="rounded-[14px] border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow">{roadmap.horizonLabel}</p>
        <StatusLabel tone="quiet">Illustrative sequencing</StatusLabel>
      </div>

      {/* Day scale */}
      <div aria-hidden className="relative mt-6 mb-2 hidden h-4 sm:block">
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
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
          {MARKS.slice(1, -1).map((m) => (
            <span
              key={m}
              className="absolute top-0 bottom-0 w-px bg-line"
              style={{ left: `${(m / 90) * 100}%` }}
            />
          ))}
        </div>

        {onRail.map((phase) => {
          const i = roadmap.phases.indexOf(phase);
          const active = activeIndex === i;
          const dimmed = activeIndex !== null && !active;
          const barTone = active
            ? 'border-brand bg-brand text-white shadow-lift'
            : 'border-brand-200 bg-brand-50/70 text-brand-900';

          return (
            <div
              key={phase.id}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              className="relative h-9"
            >
              {/* Mobile: full-width bar with the window inline */}
              <div
                className={cn(
                  'absolute inset-y-0 left-0 flex w-full items-center rounded-lg border px-3 transition-all duration-250 sm:hidden',
                  barTone,
                  dimmed && 'opacity-50',
                )}
              >
                <span className="numeral mr-2 text-[11px] font-semibold opacity-60">
                  {phase.index}
                </span>
                <span className="truncate text-[13px] font-semibold tracking-[-0.015em]">
                  {phase.name}
                </span>
                <span
                  className={cn(
                    'ml-auto shrink-0 pl-2 text-[11.5px]',
                    active ? 'text-white/70' : 'text-brand-400',
                  )}
                >
                  {phase.window}
                </span>
              </div>

              {/* Desktop: bar positioned on the 90-day scale */}
              <div
                aria-hidden
                className={cn(
                  'absolute inset-y-0 hidden items-center rounded-lg border px-3 transition-all duration-250 sm:flex',
                  barTone,
                  dimmed && 'opacity-50',
                )}
                style={{
                  left: `${phase.startPct}%`,
                  width: `${(phase.endPct ?? 0) - (phase.startPct ?? 0)}%`,
                }}
              >
                <span className="numeral mr-2 text-[11px] font-semibold opacity-60">
                  {phase.index}
                </span>
                <span className="truncate text-[13px] font-semibold tracking-[-0.015em]">
                  {phase.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {beyond.length > 0 && (
        <div className="mt-5 border-t border-dashed border-line-strong pt-4">
          <p className="text-[11.5px] font-semibold tracking-[0.06em] text-faint uppercase">
            Beyond 90 days
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {beyond.map((phase) => (
              <li
                key={phase.id}
                onMouseEnter={() => onHover(roadmap.phases.indexOf(phase))}
                onMouseLeave={() => onHover(null)}
                className={cn(
                  'rounded-lg border border-dashed px-3 py-2 text-[12.5px] font-medium transition-colors',
                  activeIndex === roadmap.phases.indexOf(phase)
                    ? 'border-brand bg-brand-50 text-brand'
                    : 'border-line-strong bg-canvas text-muted',
                )}
              >
                <span className="numeral mr-1.5 opacity-70">{phase.index}</span>
                {phase.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted text-pretty">
        {roadmap.horizonCaveat}
      </p>
    </div>
  );
}
