import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '../../utils/cn';

const CONTROL =
  'h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[14.5px] text-ink ' +
  'placeholder:text-faint transition-colors duration-200 ' +
  'hover:border-brand-400/60 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/8';

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[13px] font-medium text-ink-soft">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-faint">{hint}</span>}
    </label>
  );
}

export function TextInput({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} className={cn(CONTROL, className)} />;
}

export function Select({
  className,
  options,
  placeholder,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={cn(
          CONTROL,
          'appearance-none pr-9',
          !rest.value && 'text-faint',
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 stroke-muted stroke-[1.6]"
        fill="none"
      >
        <path d="m6 8.5 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/** 1–5 self-assessment control used in the readiness step. */
export function ScaleInput({
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  value: number;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
  lowLabel: string;
  highLabel: string;
}) {
  const groupId = useId();
  return (
    <div>
      <div className="flex gap-2" role="radiogroup" aria-labelledby={groupId}>
        {([1, 2, 3, 4, 5] as const).map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${n} of 5`}
              onClick={() => onChange(n)}
              className={cn(
                'numeral h-11 flex-1 rounded-lg border text-[15px] font-semibold',
                'transition-all duration-200 ease-out',
                active
                  ? 'border-brand bg-brand text-white shadow-[0_1px_2px_rgba(10,35,55,0.2)]'
                  : 'border-line-strong bg-surface text-muted hover:border-brand-400 hover:text-brand',
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11.5px] text-faint">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
