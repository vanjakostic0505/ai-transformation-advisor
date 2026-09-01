import { ASSESSMENT_STEPS, useAdvisor } from '../../state/AdvisorProvider';
import { Button, PromiseBanner } from '../ui';
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

/**
 * The sidebar note has to match the state the form is actually in. Telling a
 * user who deliberately chose a blank assessment that it is "pre-filled with a
 * worked example" is the kind of small inconsistency that quietly costs trust
 * in everything else on the page.
 */
function SidebarNote() {
  const { isDemoData, actions } = useAdvisor();

  if (isDemoData) {
    return (
      <div className="mt-8 hidden rounded-xl border border-line bg-surface p-4 lg:block">
        <p className="text-[12px] font-semibold tracking-[0.05em] text-muted uppercase">
          Worked example loaded
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
          Pre-filled with Nordic Industrial Services so you can walk the full
          journey immediately. Change anything you like.
        </p>
        <button
          type="button"
          onClick={actions.clearAssessment}
          className="mt-2.5 rounded text-[12.5px] font-medium text-brand underline-offset-2 hover:underline"
        >
          Clear it and start blank
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 hidden rounded-xl border border-line bg-surface p-4 lg:block">
      <p className="text-[12px] font-semibold tracking-[0.05em] text-muted uppercase">
        Blank assessment
      </p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
        Answer for your own organisation. Rough figures are fine — every number
        you give is labelled as yours in the results, and everything else is
        marked as an illustrative assumption.
      </p>
      <button
        type="button"
        onClick={actions.loadDemoData}
        className="mt-2.5 rounded text-[12.5px] font-medium text-brand underline-offset-2 hover:underline"
      >
        Load the worked example instead
      </button>
    </div>
  );
}

export function AssessmentFlow() {
  const { stepIndex, stepId, isStepValid, showErrors, fieldErrors, actions } =
    useAdvisor();
  const StepComponent = STEP_COMPONENTS[stepId];
  const isLast = stepIndex === ASSESSMENT_STEPS.length - 1;
  const errorCount = Object.keys(fieldErrors).length;

  return (
    <div className="mx-auto max-w-[1360px] px-5 py-8 sm:px-8 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-6 hidden lg:block">AI assessment</p>
          <ProgressRail />
          <SidebarNote />
        </aside>

        <div className="min-w-0">
          {stepIndex === 0 && <PromiseBanner className="mb-8" />}

          <div key={stepId} className="animate-fade-up">
            <StepComponent />
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="quiet"
              onClick={actions.previousStep}
              disabled={stepIndex === 0}
              iconLeft={<ArrowLeft aria-hidden className="size-4" />}
            >
              Back
            </Button>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {showErrors && !isStepValid && (
                <p role="alert" className="text-[12.5px] font-medium text-high">
                  {errorCount === 1
                    ? 'One field needs attention above.'
                    : `${errorCount} fields need attention above.`}
                </p>
              )}

              {isLast ? (
                <Button
                  size="lg"
                  onClick={() => void actions.runAnalysis()}
                  iconRight={<Spark aria-hidden className="size-4.5" />}
                >
                  Generate my indicative map
                </Button>
              ) : (
                <Button
                  onClick={actions.tryContinue}
                  iconRight={<ArrowRight aria-hidden className="size-4" />}
                >
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
