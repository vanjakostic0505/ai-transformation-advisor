import { StepHeader } from './StepHeader';
import { ScaleInput } from '../ui';
import { READINESS_QUESTIONS } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';
import { computeReadinessScore, readinessBand } from '../../engine/advisorEngine';

export function StepReadiness() {
  const { input, actions } = useAdvisor();
  const score = computeReadinessScore(input);

  return (
    <div>
      <StepHeader
        step="Step 06 of 06 · AI readiness"
        title="How ready is the ground?"
        description="Four honest self-assessments. These do not change whether AI can help — they change how quickly, and what has to be fixed first."
      />

      <div className="space-y-6">
        {READINESS_QUESTIONS.map((q) => (
          <div
            key={q.key}
            className="rounded-[14px] border border-line bg-surface p-5 sm:p-6"
          >
            <p className="text-[15px] font-semibold tracking-[-0.015em] text-ink">
              {q.question}
            </p>
            <p className="mt-1.5 mb-4 text-[13px] leading-relaxed text-muted">
              {q.context}
            </p>
            <ScaleInput
              value={input.readiness[q.key]}
              lowLabel={q.lowLabel}
              highLabel={q.highLabel}
              onChange={(v) =>
                actions.updateReadiness({ [q.key]: v } as Partial<typeof input.readiness>)
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-[14px] border border-brand-200 bg-brand-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Indicative AI readiness</p>
          <p className="mt-1.5 text-[13px] text-muted">
            Recalculated live as you answer. {readinessBand(score)}.
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
