import { ASSESSMENT_STEPS, useAdvisor } from '../../state/AdvisorProvider';
import { cn } from '../../utils/cn';
import { Check } from '../ui/Icons';

export function ProgressRail() {
  const { stepIndex, actions } = useAdvisor();

  return (
    <nav aria-label="Assessment progress">
      {/* Desktop: vertical rail */}
      <ol className="hidden lg:block">
        {ASSESSMENT_STEPS.map((step, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li key={step.id} className="relative pb-5 last:pb-0">
              {i < ASSESSMENT_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-9 left-[13px] h-full w-px transition-colors duration-300',
                    done ? 'bg-brand' : 'bg-line',
                  )}
                />
              )}

              <button
                type="button"
                onClick={() => actions.goToStep(i)}
                disabled={i > stepIndex}
                aria-current={current ? 'step' : undefined}
                className={cn(
                  // Padded to a comfortable 44px target rather than the height
                  // of the 28px dot it contains.
                  'group relative flex min-h-11 w-full items-center gap-3 rounded-lg py-2 pr-2 text-left',
                  'disabled:cursor-default',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'numeral relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-[11.5px] font-semibold transition-all duration-300',
                    done && 'border-brand bg-brand text-white',
                    current && 'border-brand bg-surface text-brand ring-4 ring-brand/12',
                    !done && !current && 'border-line bg-surface text-faint',
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={2.6} /> : i + 1}
                </span>

                <span
                  className={cn(
                    'text-[13.5px] font-medium transition-colors',
                    current
                      ? 'text-ink'
                      : done
                        ? 'text-ink-soft group-hover:text-brand'
                        : 'text-muted',
                  )}
                >
                  {step.label}
                </span>

                {done && <span className="sr-only">(completed)</span>}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Mobile and tablet: horizontal bar */}
      <div className="lg:hidden">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[13px] font-medium text-ink">
            {ASSESSMENT_STEPS[stepIndex].label}
          </span>
          <span className="numeral text-[12px] text-muted">
            Step {stepIndex + 1} of {ASSESSMENT_STEPS.length}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={stepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={ASSESSMENT_STEPS.length}
          aria-label="Assessment progress"
        >
          <div
            className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
            style={{
              width: `${((stepIndex + 1) / ASSESSMENT_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
