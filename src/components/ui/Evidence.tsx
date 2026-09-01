import type { Confidence, Provenance } from '../../types';
import { CONFIDENCE_LABEL, CONFIDENCE_MEANING, PROVENANCE_LABEL } from '../../types';
import { cn } from '../../utils/cn';

/**
 * The evidence vocabulary, in one place.
 *
 * Three small components carry the whole "indicative, not authoritative"
 * position through the interface. Using a consistent component rather than
 * repeating a paragraph of disclaimer means the caveat is visible everywhere
 * without becoming noise anyone learns to skip.
 */

/* ------------------------------------------------------------------ */
/* Status                                                              */
/* ------------------------------------------------------------------ */

export function StatusLabel({
  children = 'Indicative — requires validation',
  tone = 'default',
  className,
}: {
  children?: React.ReactNode;
  tone?: 'default' | 'quiet' | 'inverse';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1',
        'text-[11px] leading-none font-semibold tracking-[0.05em] uppercase',
        tone === 'default' && 'border-medium/30 bg-medium-bg text-medium',
        tone === 'quiet' && 'border-line bg-canvas text-muted',
        tone === 'inverse' && 'border-white/20 bg-white/10 text-white/80',
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="size-3 shrink-0 fill-none stroke-current stroke-[1.6]"
      >
        <circle cx="8" cy="8" r="6.2" />
        <path d="M8 7.4v3.4M8 5.1v.9" strokeLinecap="round" />
      </svg>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Provenance — where a single number came from                        */
/* ------------------------------------------------------------------ */

const PROVENANCE_STYLE: Record<Provenance, string> = {
  user: 'border-accent/25 bg-accent-50 text-accent-700',
  illustrative: 'border-medium/25 bg-medium-bg text-medium',
  'needs-validation': 'border-high/25 bg-high-bg text-high',
};

export function ProvenanceTag({
  provenance,
  className,
}: {
  provenance: Provenance;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded border px-1.5 py-0.5',
        'text-[10.5px] leading-none font-semibold tracking-[0.04em] uppercase',
        PROVENANCE_STYLE[provenance],
        className,
      )}
    >
      {PROVENANCE_LABEL[provenance]}
    </span>
  );
}

/** Legend explaining the three provenance tags. */
export function ProvenanceLegend({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-4 gap-y-2', className)}>
      {(['user', 'illustrative', 'needs-validation'] as Provenance[]).map((p) => (
        <li key={p} className="flex items-center gap-1.5">
          <ProvenanceTag provenance={p} />
          <span className="text-[11.5px] text-muted">
            {p === 'user' && 'taken from your answers'}
            {p === 'illustrative' && 'a sector default we supplied'}
            {p === 'needs-validation' && 'must be measured before it is relied on'}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Confidence                                                          */
/* ------------------------------------------------------------------ */

const CONFIDENCE_STEPS: Record<Confidence, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGHER: 3,
};

const CONFIDENCE_COLOUR: Record<Confidence, string> = {
  LOW: 'bg-high',
  MEDIUM: 'bg-medium',
  HIGHER: 'bg-accent',
};

export function ConfidenceMeter({
  confidence,
  showMeaning = false,
  className,
}: {
  confidence: Confidence;
  showMeaning?: boolean;
  className?: string;
}) {
  const filled = CONFIDENCE_STEPS[confidence];

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <span
          className="flex gap-1"
          role="img"
          aria-label={`${CONFIDENCE_LABEL[confidence]}: ${filled} of 3`}
        >
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={cn(
                'h-1.5 w-5 rounded-full transition-colors duration-300',
                step <= filled ? CONFIDENCE_COLOUR[confidence] : 'bg-line-strong',
              )}
            />
          ))}
        </span>
        <span className="text-[12.5px] font-semibold text-ink">
          {CONFIDENCE_LABEL[confidence]}
        </span>
      </div>
      {showMeaning && (
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
          {CONFIDENCE_MEANING[confidence]}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The standing explanation of what this assessment is                 */
/* ------------------------------------------------------------------ */

export const ASSESSMENT_PROMISE =
  'This assessment creates an indicative opportunity map based on the information you provide. It is a starting point for expert validation, not a final business case, forecast or implementation commitment.';

export function PromiseBanner({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'flex items-start gap-3.5 rounded-[14px] border p-4 sm:p-5',
        tone === 'light'
          ? 'border-brand-200 bg-brand-50/60'
          : 'border-white/12 bg-white/[0.06]',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg',
          tone === 'light' ? 'bg-surface text-brand' : 'bg-white/10 text-white',
        )}
      >
        <svg
          viewBox="0 0 16 16"
          className="size-3.5 fill-none stroke-current stroke-[1.7]"
        >
          <circle cx="8" cy="8" r="6.2" />
          <path d="M8 7.4v3.4M8 5.1v.9" strokeLinecap="round" />
        </svg>
      </span>
      <p
        className={cn(
          'text-[13.5px] leading-relaxed text-pretty',
          tone === 'light' ? 'text-ink-soft' : 'text-white/75',
        )}
      >
        <strong
          className={cn(
            'font-semibold',
            tone === 'light' ? 'text-ink' : 'text-white',
          )}
        >
          What this is.{' '}
        </strong>
        {ASSESSMENT_PROMISE}
      </p>
    </aside>
  );
}
