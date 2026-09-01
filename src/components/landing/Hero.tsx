import { Button, PromiseBanner } from '../ui';
import { ArrowRight } from '../ui/Icons';
import { JourneyRail } from './JourneyRail';
import { useAdvisorActions } from '../../state/AdvisorProvider';

export function Hero() {
  const actions = useAdvisorActions();

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-brand-100/35 blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1360px] px-5 pt-14 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow animate-fade-up">
            From your current workforce to your AI workforce
          </p>

          <h1
            className="display-1 mt-5 animate-fade-up text-ink text-balance"
            style={{ animationDelay: '60ms' }}
          >
            Design Your AI Operating Model
          </h1>

          <p
            className="mt-6 max-w-2xl animate-fade-up text-[17px] leading-relaxed text-ink-soft text-pretty sm:text-[18.5px]"
            style={{ animationDelay: '120ms' }}
          >
            Understand where AI could transform your workforce, processes and
            operations — and see the assumptions behind every figure, so the
            highest-value opportunities can be validated rather than assumed.
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '180ms' }}
          >
            <Button
              size="lg"
              onClick={() => actions.startAssessment()}
              iconRight={<ArrowRight aria-hidden className="size-4.5" />}
            >
              Start Your AI Assessment
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              See How It Works
            </Button>
          </div>

          <p
            className="mt-6 animate-fade-up text-[13px] text-muted"
            style={{ animationDelay: '240ms' }}
          >
            Takes 5–10 minutes · No integration required · Pre-filled with a
            worked example
          </p>
        </div>

        <div
          className="mt-10 max-w-4xl animate-fade-up"
          style={{ animationDelay: '280ms' }}
        >
          <PromiseBanner />
        </div>

        <div className="mt-14 lg:mt-16">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <p className="eyebrow">The journey this sits at the front of</p>
            <p className="text-[12.5px] text-muted">
              From AI strategy to measurable execution.
            </p>
          </div>
          <JourneyRail />
        </div>
      </div>
    </section>
  );
}
