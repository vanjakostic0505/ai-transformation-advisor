import { cn } from '../../utils/cn';
import { Check } from './Icons';

export function SelectableTile({
  label,
  hint,
  selected,
  onToggle,
  compact = false,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onToggle: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded-xl border text-left',
        'transition-all duration-200 ease-out',
        compact ? 'px-3.5 py-3' : 'px-4 py-3.5',
        selected
          ? 'border-brand bg-brand-50/50 shadow-[0_1px_2px_rgba(15,53,87,0.08)]'
          : 'border-line bg-surface hover:border-line-strong hover:shadow-card',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-px flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border',
          'transition-all duration-200',
          selected
            ? 'border-brand bg-brand text-white'
            : 'border-line-strong bg-surface text-transparent group-hover:border-brand-400',
        )}
      >
        <Check className="size-3" strokeWidth={2.4} />
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block text-[14px] leading-snug font-medium',
            selected ? 'text-brand-900' : 'text-ink',
          )}
        >
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}
