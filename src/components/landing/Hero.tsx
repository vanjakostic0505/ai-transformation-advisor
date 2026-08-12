import { Button } from '../ui';
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

      <div className="relative mx-auto max-w-[1360px] px-5 pt-16 pb-20 sm:px-8 lg:pt-24 lg:pb-28">
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
            Understand how AI can transform your workforce, processes and
            operations — then turn the highest-value opportunities into AI
            workers.
          </p>

          <div
            className="mt-9 flex animate-fade-up flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '180ms' }}
          >
            <Button
              size="lg"
              onClick={() => actions.startAssessment()}
              iconRight={<ArrowRight className="size-4.5" />}
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
            className="mt-6 animate-fade-up text-[13px] text-faint"
            style={{ animationDelay: '240ms' }}
          >
            Takes 5–10 minutes · No integration required · Pre-filled with a
            worked example
          </p>
        </div>

        <div className="mt-16 lg:mt-20">
          <div className="mb-5 flex items-end justify-between gap-4">
            <p className="eyebrow">The journey</p>
            <p className="hidden text-[12.5px] text-faint sm:block">
              From AI strategy to measurable execution.
            </p>
          </div>
          <JourneyRail />
          <p className="mt-5 text-[12.5px] text-faint sm:hidden">
            From AI strategy to measurable execution.
          </p>
        </div>
      </div>
    </section>
  );
}
