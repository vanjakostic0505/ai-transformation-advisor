import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  padded?: boolean;
}

export function Card({
  children,
  className,
  interactive = false,
  padded = true,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'bg-surface border border-line rounded-[14px] shadow-card',
        padded && 'p-6',
        interactive &&
          'cursor-pointer transition-all duration-250 ease-out hover:border-line-strong hover:shadow-lift hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  );
}
