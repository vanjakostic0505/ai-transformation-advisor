import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="max-w-md text-[12.5px] leading-relaxed text-faint">
            Prototype for demonstration purposes. All figures are illustrative
            estimates based on the information provided and are not forecasts,
            guarantees or financial commitments.
          </p>
        </div>
      </div>
    </footer>
  );
}
