import { cn } from '../../utils/cn';

export function Stat({
  label,
  value,
  sub,
  status,
  accent = false,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  /** Short evidence status, e.g. "Indicative". Rendered as a persistent chip. */
  status?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col bg-surface border border-line rounded-[14px] p-5 shadow-card',
        'transition-colors duration-200',
        accent && 'border-brand-200 bg-brand-50/40',
        className,
      )}
    >
      <p className="eyebrow text-[10.5px]">{label}</p>

      <p
        className={cn(
          'numeral mt-3 text-[30px] leading-none font-semibold',
          accent ? 'text-brand' : 'text-ink',
        )}
      >
        {value}
      </p>

      {sub && <p className="mt-2 text-[12.5px] leading-snug text-muted">{sub}</p>}

      {status && (
        <p className="mt-auto pt-3">
          <span className="inline-flex items-center gap-1 rounded border border-medium/30 bg-medium-bg px-1.5 py-0.5 text-[10px] leading-none font-semibold tracking-[0.05em] text-medium uppercase">
            {status}
          </span>
        </p>
      )}
    </div>
  );
}
