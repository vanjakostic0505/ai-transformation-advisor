import { Button } from '../ui';
import { ArrowRight, Spark } from '../ui/Icons';

export function FinalCTA({
  onBuild,
  topWorkerName,
}: {
  onBuild: () => void;
  topWorkerName: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-25 invert" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[860px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-[1360px] px-5 py-20 text-center sm:px-8 lg:py-24">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-white/12 bg-white/8 text-accent">
          <Spark className="size-5" />
        </span>

        <h2 className="display-2 mx-auto mt-7 max-w-2xl text-white text-balance">
          Ready to build your first AI worker?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-white/60 text-pretty">
          Turn your highest-value AI opportunity into an operational AI worker.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={onBuild}
            className="bg-white text-brand-900 hover:bg-white/90"
            iconRight={<ArrowRight className="size-4.5" />}
          >
            Build with Smooth Operator
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="border-white/20 bg-transparent text-white hover:border-white/40 hover:text-white"
            onClick={() =>
              window.alert(
                'Prototype: this would open scheduling for an AI Transformation Workshop.',
              )
            }
          >
            Book an AI Transformation Workshop
          </Button>
        </div>

        <p className="mt-6 text-[12.5px] text-white/35">
          Starts with the {topWorkerName} — the lowest-complexity route to a
          measurable result.
        </p>
      </div>
    </section>
  );
}
