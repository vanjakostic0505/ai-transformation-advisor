import type { AIOpportunity } from '../../types';
import { ComplexityBadge, PriorityBadge } from '../ui';
import { ArrowRight } from '../ui/Icons';
import { formatValueRange } from '../../utils/format';
import { cn } from '../../utils/cn';

/** Value bar is scaled against the largest opportunity so ranking reads visually. */
export function OpportunityRow({
  opportunity,
  maxValue,
  onOpen,
  index,
}: {
  opportunity: AIOpportunity;
  maxValue: number;
  onOpen: () => void;
  index: number;
}) {
  const share = Math.max((opportunity.value.high / maxValue) * 100, 6);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group grid w-full animate-fade-up grid-cols-1 items-center gap-4 border-b border-line bg-surface px-5 py-5 text-left last:border-b-0',
        'transition-colors duration-200 hover:bg-brand-50/35',
        'sm:grid-cols-[28px_minmax(0,1fr)_190px_150px_24px] sm:gap-5 sm:px-6',
      )}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <span className="numeral hidden text-[13px] font-semibold text-faint sm:block">
        {String(opportunity.rank).padStart(2, '0')}
      </span>

      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-[15.5px] leading-snug font-semibold tracking-[-0.018em] text-ink transition-colors group-hover:text-brand">
            {opportunity.title}
          </span>
          <span className="text-[12px] text-faint">{opportunity.domain}</span>
        </span>
        <span className="mt-1.5 block max-w-xl text-[13px] leading-snug text-muted">
          {opportunity.summary}
        </span>
        <span className="mt-2.5 flex flex-wrap items-center gap-2 sm:hidden">
          <PriorityBadge priority={opportunity.priority} />
          <ComplexityBadge complexity={opportunity.complexity} />
        </span>
      </span>

      <span className="block">
        <span className="numeral block text-[15px] font-semibold text-ink">
          {formatValueRange(opportunity.value)}
        </span>
        <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-line">
          <span
            className={cn(
              'block h-full rounded-full transition-[width] duration-700 ease-out',
              opportunity.priority === 'HIGH' ? 'bg-brand' : 'bg-brand-200',
            )}
            style={{ width: `${share}%` }}
          />
        </span>
        <span className="mt-1.5 block text-[11.5px] text-faint">
          {opportunity.value.period} · {opportunity.timeline}
        </span>
      </span>

      <span className="hidden flex-col items-start gap-1.5 sm:flex">
        <PriorityBadge priority={opportunity.priority} />
        <ComplexityBadge complexity={opportunity.complexity} />
      </span>

      <ArrowRight className="hidden size-4 text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand sm:block" />
    </button>
  );
}
