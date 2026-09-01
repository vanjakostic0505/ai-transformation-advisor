import { useId } from 'react';
import { StepHeader } from './StepHeader';
import { ScaleInput, StatusLabel } from '../ui';
import { READINESS_GROUPS, READINESS_QUESTIONS } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';
import { computeReadinessScore, readinessBand } from '../../engine/advisorEngine';
import { cn } from '../../utils/cn';

function Question({
  question,
}: {
  question: (typeof READINESS_QUESTIONS)[number];
}) {
  const { input, actions } = useAdvisor();
  const base = useId();
  const labelId = `${base}-label`;
  const contextId = `${base}-context`;

  return (
    <div
      className={cn(
        'rounded-[14px] border bg-surface p-5',
        question.opportunitySignal
          ? 'border-dashed border-line-strong bg-canvas/50'
          : 'border-line',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p
          id={labelId}
          className="text-[15px] font-semibold tracking-[-0.015em] text-ink"
        >
          {question.question}
        </p>
        {question.opportunitySignal && (
          <StatusLabel tone="quiet">Opportunity signal — not scored</StatusLabel>
        )}
      </div>

      <p id={contextId} className="mt-1.5 mb-4 text-[13px] leading-relaxed text-muted">
        {question.context}
      </p>

      <ScaleInput
        value={input.readiness[question.key]}
        lowLabel={question.lowLabel}
        highLabel={question.highLabel}
        labelledBy={labelId}
        describedBy={contextId}
        onChange={(v) => actions.updateReadiness(question.key, v)}
      />
    </div>
  );
}

export function StepReadiness() {
  const { input } = useAdvisor();
  const score = computeReadinessScore(input);
  const { band } = readinessBand(score);

  return (
    <div>
      <StepHeader
        step="Step 06 of 06 · AI readiness"
        title="How ready is the ground?"
        description="Twelve honest self-assessments across three areas. These do not change whether AI could help — they change how quickly, what has to be fixed first, and what would stall a pilot."
      />

      <div className="space-y-9">
        {READINESS_GROUPS.map((group) => (
          <section key={group.id}>
            <h2 className="text-[15px] font-semibold tracking-[-0.02em] text-ink">
              {group.label}
            </h2>
            <p className="mt-1 mb-4 text-[13px] leading-relaxed text-muted">
              {group.description}
            </p>

            <div className="space-y-4">
              {READINESS_QUESTIONS.filter((q) => q.group === group.id).map((q) => (
                <Question key={q.key} question={q} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-[14px] border border-brand-200 bg-brand-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="eyebrow">Indicative AI readiness</p>
            <StatusLabel>Indicative — requires validation</StatusLabel>
          </div>
          <p className="mt-2 text-[13px] text-muted" aria-live="polite">
            Recalculated as you answer. {band}.
          </p>
        </div>
        <p className="numeral text-[34px] leading-none font-semibold text-brand">
          {score}
          <span className="ml-1 text-[16px] font-medium text-brand-400">/100</span>
        </p>
      </div>
    </div>
  );
}
