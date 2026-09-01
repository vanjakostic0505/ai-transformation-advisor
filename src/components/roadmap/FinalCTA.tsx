import { Button } from '../ui';
import { ArrowRight, Target } from '../ui/Icons';

export function FinalCTA({
  onValidate,
  onExplorePilot,
  nextAction,
}: {
  onValidate: () => void;
  onExplorePilot: () => void;
  /** The specific next step from the readiness assessment */
  nextAction: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-25 invert"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-accent-100"
          >
            <Target className="size-5" />
          </span>

          <h2 className="display-2 mt-7 text-white text-balance">
            Turn this into something defensible
          </h2>

          <p className="mt-4 text-[16px] leading-relaxed text-white/70 text-pretty">
            Review the assumptions, confirm operational baselines and turn the
            strongest opportunity into a business case your Finance function
            will sign.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={onValidate}
              className="w-full bg-white text-brand-900 hover:bg-white/90 sm:w-auto"
              iconRight={<ArrowRight aria-hidden className="size-4.5" />}
            >
              Validate this opportunity map
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="w-full border-white/25 bg-transparent text-white hover:border-white/50 hover:text-white sm:w-auto"
              onClick={onExplorePilot}
            >
              Explore a controlled pilot
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-[14px] border border-white/12 bg-white/[0.05] p-5 sm:p-6">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">
            Your recommended next step
          </p>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/85 text-pretty">
            {nextAction}
          </p>
        </div>
      </div>
    </section>
  );
}
