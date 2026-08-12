import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { Positioning } from './Positioning';
import { Button } from '../ui';
import { ArrowRight } from '../ui/Icons';
import { useAdvisorActions } from '../../state/AdvisorProvider';

export function LandingPage() {
  const actions = useAdvisorActions();

  return (
    <>
      <Hero />
      <HowItWorks />
      <Positioning />

      <section className="bg-canvas">
        <div className="mx-auto max-w-[1360px] px-5 py-20 text-center sm:px-8">
          <h2 className="display-2 mx-auto max-w-2xl text-ink text-balance">
            See where AI creates value in your business
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-muted">
            Answer six short sections about your company. Get a ranked
            opportunity map, a target operating model and a recommended AI
            workforce.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
              onClick={() => actions.startAssessment({ prefill: false })}
            >
              Start from a blank assessment
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
