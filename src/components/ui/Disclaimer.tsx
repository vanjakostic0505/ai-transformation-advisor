import { cn } from '../../utils/cn';

export function Disclaimer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-start gap-2 text-[12.5px] leading-relaxed text-faint',
        className,
      )}
    >
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="mt-[3px] size-3.5 shrink-0 fill-none stroke-current stroke-[1.4]"
      >
        <circle cx="8" cy="8" r="6.4" />
        <path d="M8 7.2v4M8 4.9v.9" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
