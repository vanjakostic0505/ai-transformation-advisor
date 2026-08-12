import { cn } from '../../utils/cn';

export function Stat({
  label,
  value,
  sub,
  accent = false,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-surface border border-line rounded-[14px] p-5 shadow-card',
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
    </div>
  );
}
