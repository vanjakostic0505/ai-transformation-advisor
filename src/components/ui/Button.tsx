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
    'bg-brand text-white hover:bg-brand-900 active:bg-brand-900 shadow-[0_1px_2px_rgba(10,35,55,0.24)]',
  secondary:
    'bg-surface text-ink border border-line-strong hover:border-brand-400 hover:text-brand',
  ghost:
    'bg-transparent text-brand border border-brand-200 hover:bg-brand-50',
  quiet: 'bg-transparent text-muted hover:text-ink',
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
        'disabled:opacity-40 disabled:pointer-events-none',
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
