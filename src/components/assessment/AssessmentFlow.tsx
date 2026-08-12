import { ASSESSMENT_STEPS, useAdvisor } from '../../state/AdvisorProvider';
import { Button } from '../ui';
import { ArrowLeft, ArrowRight, Spark } from '../ui/Icons';
import { ProgressRail } from './ProgressRail';
import { StepCompany } from './StepCompany';
import { StepWorkforce } from './StepWorkforce';
import { StepOperations } from './StepOperations';
import { StepSystems } from './StepSystems';
import { StepObjectives } from './StepObjectives';
import { StepReadiness } from './StepReadiness';

const STEP_COMPONENTS = {
  company: StepCompany,
  workforce: StepWorkforce,
  operations: StepOperations,
  systems: StepSystems,
  objectives: StepObjectives,
  readiness: StepReadiness,
} as const;

export function AssessmentFlow() {
  const { stepIndex, stepId, isStepValid, actions } = useAdvisor();
  const StepComponent = STEP_COMPONENTS[stepId];
  const isLast = stepIndex === ASSESSMENT_STEPS.length - 1;

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-6 hidden lg:block">AI assessment</p>
          <ProgressRail />

          <div className="mt-8 hidden rounded-xl border border-line bg-surface p-4 lg:block">
            <p className="text-[12.5px] leading-relaxed text-muted">
              Pre-filled with a worked example so you can walk the full journey
              immediately.
            </p>
            <button
              type="button"
              onClick={actions.loadDemoData}
              className="mt-2.5 text-[12.5px] font-medium text-brand underline-offset-2 hover:underline"
            >
              Reset to demo data
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          <div key={stepId} className="animate-fade-up">
            <StepComponent />
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
            <Button
              variant="quiet"
              onClick={actions.previousStep}
              disabled={stepIndex === 0}
              iconLeft={<ArrowLeft className="size-4" />}
            >
              Back
            </Button>

            <div className="flex items-center gap-3">
              {!isStepValid && (
                <span className="hidden text-[12.5px] text-faint sm:block">
                  Complete this step to continue
                </span>
              )}
              {isLast ? (
                <Button
                  size="lg"
                  disabled={!isStepValid}
                  onClick={() => void actions.runAnalysis()}
                  iconRight={<Spark className="size-4.5" />}
                >
                  Generate my AI Transformation Map
                </Button>
              ) : (
                <Button
                  disabled={!isStepValid}
                  onClick={actions.nextStep}
                  iconRight={<ArrowRight className="size-4" />}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
