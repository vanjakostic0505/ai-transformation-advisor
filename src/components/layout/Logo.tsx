export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 28 28" aria-hidden className="size-7">
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="7"
          className={inverted ? 'fill-white/12' : 'fill-brand'}
        />
        <path
          d="M8 19.5 14 8l6 11.5"
          className={inverted ? 'stroke-white' : 'stroke-white'}
          strokeWidth="1.9"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.6 16.2h6.8"
          className="stroke-accent"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
      <div className="leading-none">
        <span
          className={`block text-[14.5px] font-semibold tracking-[-0.02em] ${
            inverted ? 'text-white' : 'text-ink'
          }`}
        >
          AI Transformation Advisor
        </span>
        <span
          className={`mt-1 block text-[11px] tracking-[0.02em] ${
            inverted ? 'text-white/55' : 'text-faint'
          }`}
        >
          Powered by Smooth Operator
        </span>
      </div>
    </div>
  );
}
