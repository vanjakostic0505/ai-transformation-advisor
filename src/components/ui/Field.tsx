import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '../../utils/cn';

const CONTROL =
  'h-11 w-full rounded-lg border bg-surface px-3.5 text-[14.5px] text-ink ' +
  'placeholder:text-faint transition-colors duration-200 ' +
  'focus:outline-none focus-visible:outline-none';

const CONTROL_DEFAULT =
  'border-line-strong hover:border-brand-400/60 focus:border-brand focus:ring-4 focus:ring-brand/10';

const CONTROL_ERROR =
  'border-high bg-high-bg/40 hover:border-high focus:border-high focus:ring-4 focus:ring-high/15';

/**
 * A labelled form field with an error message that is *associated* with its
 * control, not merely displayed near it.
 *
 * The wiring matters: `aria-describedby` points a screen reader at the hint
 * and the error, and `aria-invalid` announces the failure. Without these, an
 * error is a red sentence that only sighted users receive.
 */
export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Receives the ids to wire up, so the caller cannot forget them. */
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
  className?: string;
}) {
  const base = useId();
  const id = `${base}-control`;
  const hintId = `${base}-hint`;
  const errorId = `${base}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className={cn('block', className)}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-ink-soft"
      >
        {label}
        {required && (
          <span className="ml-1 text-high" aria-hidden>
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {children({ id, describedBy, invalid: !!error })}

      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[12px] text-faint">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-1.5 flex items-start gap-1.5 text-[12.5px] font-medium text-high"
        >
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="mt-px size-3.5 shrink-0 fill-none stroke-current stroke-[1.7]"
          >
            <circle cx="8" cy="8" r="6.2" />
            <path d="M8 5v3.6M8 10.6v.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({
  className,
  invalid,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, invalid ? CONTROL_ERROR : CONTROL_DEFAULT, className)}
    />
  );
}

export function Select({
  className,
  options,
  placeholder,
  invalid,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: string[];
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        {...rest}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          invalid ? CONTROL_ERROR : CONTROL_DEFAULT,
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

/**
 * 1–5 self-assessment control.
 *
 * Implemented as a radiogroup with a real accessible name, so a screen-reader
 * user hears the question rather than five unlabelled numbers.
 */
export function ScaleInput({
  value,
  onChange,
  lowLabel,
  highLabel,
  labelledBy,
  describedBy,
}: {
  value: number;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
  lowLabel: string;
  highLabel: string;
  labelledBy?: string;
  describedBy?: string;
}) {
  return (
    <div>
      <div
        className="flex gap-2"
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        {([1, 2, 3, 4, 5] as const).map((n) => {
          const active = value === n;
          const label =
            n === 1 ? `1 — ${lowLabel}` : n === 5 ? `5 — ${highLabel}` : `${n}`;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              onClick={() => onChange(n)}
              className={cn(
                // 44px tall: a comfortable touch target on mobile
                'numeral h-11 min-w-11 flex-1 rounded-lg border text-[15px] font-semibold',
                'transition-all duration-200 ease-out',
                active
                  ? 'border-brand bg-brand text-white shadow-[0_1px_2px_rgba(10,35,55,0.2)]'
                  : 'border-line-strong bg-surface text-ink-soft hover:border-brand-400 hover:text-brand',
              )}
            >
              <span aria-hidden>{n}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between gap-4 text-[11.5px] text-faint">
        <span>{lowLabel}</span>
        <span className="text-right">{highLabel}</span>
      </div>
    </div>
  );
}

/** A non-field validation message, e.g. for a group of tiles. */
export function GroupError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-3 flex items-start gap-1.5 rounded-lg border border-high/30 bg-high-bg px-3 py-2 text-[12.5px] font-medium text-high"
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="mt-0.5 size-3.5 shrink-0 fill-none stroke-current stroke-[1.7]"
      >
        <circle cx="8" cy="8" r="6.2" />
        <path d="M8 5v3.6M8 10.6v.6" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}
