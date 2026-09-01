import type { OperatingModel, OperatingModelSnapshot } from '../../types';
import { SectionHeading, StatusLabel } from '../ui';
import { ArrowRight, Users } from '../ui/Icons';
import { cn } from '../../utils/cn';

function ModelColumn({
  snapshot,
  variant,
}: {
  snapshot: OperatingModelSnapshot;
  variant: 'current' | 'target';
}) {
  const isTarget = variant === 'target';

  return (
    <div
      className={cn(
        'rounded-[14px] border p-6 transition-colors duration-300 sm:p-7',
        isTarget
          ? 'border-brand-200 bg-brand-50/40 shadow-card'
          : 'border-line bg-surface',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={cn('eyebrow', isTarget && 'text-brand')}>{snapshot.label}</h3>
        {isTarget && <StatusLabel tone="quiet">Indicative</StatusLabel>}
      </div>

      <dl className="mt-6 divide-y divide-line/80">
        {snapshot.metrics.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="text-[13.5px] text-muted">{m.label}</dt>
            <dd
              className={cn(
                'numeral text-right text-[17px] font-semibold tracking-[-0.02em]',
                m.emphasis && isTarget ? 'text-brand' : 'text-ink',
              )}
            >
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function OperatingModelSection({ model }: { model: OperatingModel }) {
  return (
    <section
      id="operating-model"
      className="scroll-mt-24 border-y border-line bg-surface"
    >
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Possible target operating model"
          title="What the same organisation could look like"
          description="The same people, working differently. AI absorbs repeatable volume; your team keeps judgement, exceptions and the customer relationship. Which parts of this are achievable, and in what order, is a question for discovery."
        />

        <div className="mt-6">
          <StatusLabel>Indicative — requires validation</StatusLabel>
        </div>

        <div className="relative mt-8 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-6">
          <ModelColumn snapshot={model.current} variant="current" />

          <div aria-hidden className="flex items-center justify-center lg:px-2">
            <span className="flex size-10 items-center justify-center rounded-full border border-line bg-canvas text-brand-400">
              <ArrowRight className="size-5" />
            </span>
          </div>

          <ModelColumn snapshot={model.target} variant="target" />
        </div>

        <div className="mt-8 flex items-start gap-3.5 rounded-[14px] border border-accent/25 bg-accent-50/60 p-5 sm:p-6">
          <span
            aria-hidden
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface text-accent-700"
          >
            <Users className="size-4" />
          </span>
          <div>
            <p className="text-[14.5px] leading-snug font-semibold tracking-[-0.015em] text-ink">
              This is an augmentation model, not a reduction plan.
            </p>
            <p className="mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft text-pretty">
              {model.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
