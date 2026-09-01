import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <Logo />
          <p className="max-w-lg text-[12.5px] leading-relaxed text-muted">
            Prototype for demonstration purposes. All figures are indicative
            estimates calculated from the information provided and illustrative
            sector assumptions. They are not forecasts, guarantees or financial
            commitments, and no part of this assessment constitutes a business
            case or an implementation commitment.
          </p>
        </div>
      </div>
    </footer>
  );
}
