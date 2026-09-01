import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-900 active:bg-brand-900 shadow-[0_1px_2px_rgba(10,35,55,0.24)] ' +
    // A disabled primary button at 40% opacity fell below readable contrast.
    // Giving it its own solid grey keeps the label legible while still
    // reading unmistakably as unavailable.
    'disabled:bg-low-bg disabled:text-muted disabled:shadow-none disabled:border disabled:border-line-strong',
  secondary:
    'bg-surface text-ink border border-line-strong hover:border-brand-400 hover:text-brand ' +
    'disabled:text-faint disabled:border-line',
  ghost:
    'bg-transparent text-brand border border-brand-200 hover:bg-brand-50 ' +
    'disabled:text-faint disabled:border-line',
  quiet:
    'bg-transparent text-muted hover:text-ink underline-offset-4 hover:underline ' +
    'disabled:text-faint disabled:no-underline',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-lg gap-2',
  lg: 'h-13 px-7 text-[15px] rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  iconLeft,
  iconRight,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'inline-flex items-center justify-center font-medium tracking-[-0.01em]',
        'transition-all duration-200 ease-out',
        // Kept focusable and hoverable when disabled so assistive technology
        // can still reach it and read why it cannot be used.
        'disabled:cursor-not-allowed disabled:active:translate-y-0',
        'active:translate-y-px',
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
