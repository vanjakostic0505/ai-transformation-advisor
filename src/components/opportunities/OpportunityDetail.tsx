import type { AIOpportunity, AIWorker } from '../../types';
import {
  Badge,
  Button,
  ComplexityBadge,
  PriorityBadge,
  SidePanel,
  StatusLabel,
} from '../ui';
import { AssumptionsPanel } from './AssumptionsPanel';
import { ArrowRight, Check, Users } from '../ui/Icons';
import { formatValueRange, indefiniteArticle } from '../../utils/format';

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
    <section className="border-t border-line pt-6">
      <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-[-0.015em] text-ink">
        {icon && (
          <span aria-hidden className="text-brand-400 [&>svg]:size-4">
            {icon}
          </span>
        )}
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
            <Check
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-accent-700"
              strokeWidth={2.2}
            />
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
  overrides,
  onClose,
  onDriverChange,
  onResetOverrides,
  onExploreWorker,
}: {
  opportunity: AIOpportunity | null;
  worker?: AIWorker;
  overrides: Record<string, number> | undefined;
  onClose: () => void;
  onDriverChange: (driverId: string, value: number) => void;
  onResetOverrides: () => void;
  onExploreWorker: (workerId: string) => void;
}) {
  if (!opportunity) return null;

  const article = worker ? indefiniteArticle(worker.name) : 'an';

  return (
    <SidePanel
      open
      onClose={onClose}
      eyebrow={`Potential opportunity ${String(opportunity.rank).padStart(2, '0')} · ${opportunity.domain}`}
      title={opportunity.title}
      footer={
        worker ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12.5px] leading-snug text-muted">
              Provisional concept: the {worker.name}
            </p>
            <Button
              onClick={() => onExploreWorker(worker.id)}
              iconRight={<ArrowRight aria-hidden className="size-4" />}
            >
              Explore this worker concept
            </Button>
          </div>
        ) : (
          <p className="text-[12.5px] leading-relaxed text-muted">
            Not part of the first provisional wave. It would be revisited once
            the leading opportunities have been validated and a first pilot
            measured.
          </p>
        )
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <StatusLabel />
          <PriorityBadge priority={opportunity.priority} />
          <ComplexityBadge complexity={opportunity.complexity} />
          <Badge tone="neutral">{opportunity.timeline}</Badge>
        </div>

        <p className="text-[14.5px] leading-relaxed text-ink-soft text-pretty">
          {opportunity.summary}
        </p>

        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
          <p className="eyebrow text-[10px]">Indicative annual value</p>
          <p className="numeral mt-2 text-[26px] leading-none font-semibold text-brand">
            {formatValueRange(opportunity.value)}
          </p>
          <p className="mt-2 text-[12.5px] text-muted">
            {opportunity.value.period} · see the assumptions below for how this
            is arrived at
          </p>
        </div>

        <Block title="What we understand today">
          <List items={opportunity.currentSituation} />
        </Block>

        <Block title="What an AI worker could take on" icon={<Check />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            {worker
              ? `On this evidence, ${article} ${worker.name} could plausibly handle:`
              : 'On this evidence, an AI worker could plausibly handle:'}
          </p>
          <List items={opportunity.aiCapabilities} marker="check" />
        </Block>

        <Block title="What stays with people" icon={<Users />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            Humans would remain responsible for:
          </p>
          <List items={opportunity.humanResponsibilities} />
        </Block>

        <AssumptionsPanel
          opportunity={opportunity}
          overrides={overrides}
          onDriverChange={onDriverChange}
          onReset={onResetOverrides}
        />

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
