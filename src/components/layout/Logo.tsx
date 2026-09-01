import { cn } from '../../utils/cn';

/**
 * The advisory experience is ValueShore-led.
 *
 * Smooth Operator is a delivery product that may or may not be the right route
 * for a given pilot, so it is named at the delivery stage rather than in the
 * masthead — where it would imply the answer had been chosen before the
 * question was asked.
 */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 28 28" aria-hidden className="size-7 shrink-0">
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="7"
          className={inverted ? 'fill-white/12' : 'fill-brand'}
        />
        <path
          d="M8 19.5 14 8l6 11.5"
          className="stroke-white"
          strokeWidth="1.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.6 16.2h6.8"
          className="stroke-accent"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>

      {/*
        Hidden below 640px. At 375px the wordmark plus a call to action
        overflows the header, and a squeezed, wrapping product name reads far
        worse than the mark on its own. The name is announced to screen
        readers regardless.
      */}
      <span className="hidden leading-none sm:block">
        <span
          className={cn(
            'block text-[14.5px] font-semibold tracking-[-0.02em]',
            inverted ? 'text-white' : 'text-ink',
          )}
        >
          AI Transformation Advisor
        </span>
        <span
          className={cn(
            'mt-1 block text-[11px] tracking-[0.02em]',
            inverted ? 'text-white/60' : 'text-muted',
          )}
        >
          A ValueShore advisory experience
        </span>
      </span>

      <span className="sr-only sm:hidden">
        AI Transformation Advisor — a ValueShore advisory experience
      </span>
    </div>
  );
}
