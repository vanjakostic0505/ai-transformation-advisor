import type { AIOpportunity, AIWorker } from '../../types';
import { Badge, Button, ComplexityBadge, Disclaimer, PriorityBadge, SidePanel } from '../ui';
import { ArrowRight, Check, Shield, Users } from '../ui/Icons';
import { formatValueRange } from '../../utils/format';

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line pt-6 first:border-t-0 first:pt-0">
      <h3 className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.01em] text-ink">
        {icon && <span className="text-brand-400 [&>svg]:size-4">{icon}</span>}
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function List({ items, marker }: { items: string[]; marker?: 'check' | 'dot' }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          {marker === 'check' ? (
            <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.2} />
          ) : (
            <span
              aria-hidden
              className="mt-[7px] size-1.5 shrink-0 rounded-full bg-line-strong"
            />
          )}
          <span className="text-[13.5px] leading-relaxed text-ink-soft">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function OpportunityDetail({
  opportunity,
  worker,
  onClose,
  onDesignWorker,
}: {
  opportunity: AIOpportunity | null;
  worker?: AIWorker;
  onClose: () => void;
  onDesignWorker: (workerId: string) => void;
}) {
  if (!opportunity) return null;

  return (
    <SidePanel
      open
      onClose={onClose}
      eyebrow={`Opportunity ${String(opportunity.rank).padStart(2, '0')} · ${opportunity.domain}`}
      title={opportunity.title}
      footer={
        worker ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] text-muted">
              Delivered by the {worker.name}
            </p>
            <Button
              onClick={() => onDesignWorker(worker.id)}
              iconRight={<ArrowRight className="size-4" />}
            >
              Design This AI Worker
            </Button>
          </div>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-muted">
            Not included in the first recommended wave. Sequenced after the four
            recommended AI workers are live and measured.
          </p>
        )
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority={opportunity.priority} />
          <ComplexityBadge complexity={opportunity.complexity} />
          <Badge tone="accent">{opportunity.timeline}</Badge>
        </div>

        <p className="text-[14.5px] leading-relaxed text-ink-soft text-pretty">
          {opportunity.summary}
        </p>

        <Block title="Current situation">
          <List items={opportunity.currentSituation} />
        </Block>

        <Block title="AI opportunity" icon={<Check />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            {worker
              ? `An ${worker.name} could handle:`
              : 'An AI worker could handle:'}
          </p>
          <List items={opportunity.aiCapabilities} marker="check" />
        </Block>

        <Block title="Human role" icon={<Users />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            Humans remain responsible for:
          </p>
          <List items={opportunity.humanResponsibilities} />
        </Block>

        <Block title="Potential impact" icon={<Shield />}>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
              <dt className="eyebrow text-[10px]">Estimated annual value</dt>
              <dd className="numeral mt-2 text-[19px] font-semibold text-brand">
                {formatValueRange(opportunity.value)}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-canvas/60 p-4">
              <dt className="eyebrow text-[10px]">Complexity</dt>
              <dd className="mt-2 text-[15px] font-semibold text-ink">
                {opportunity.complexity.charAt(0)}
                {opportunity.complexity.slice(1).toLowerCase()}
              </dd>
            </div>
            <div className="rounded-xl border border-line bg-canvas/60 p-4">
              <dt className="eyebrow text-[10px]">Timeline</dt>
              <dd className="mt-2 text-[15px] font-semibold text-ink">
                {opportunity.timeline}
              </dd>
            </div>
          </dl>
          <Disclaimer className="mt-3">
            Illustrative estimate based on the information provided.
          </Disclaimer>
        </Block>

        <Block title="Scope">
          <div className="flex flex-wrap gap-2">
            {opportunity.affectedDepartments.map((d) => (
              <Badge key={d} tone="neutral">
                {d}
              </Badge>
            ))}
          </div>
        </Block>
      </div>
    </SidePanel>
  );
}
