import type { AIOpportunity, AIWorker } from '../../types';
import {
  Badge,
  Button,
  ComplexityBadge,
  Disclaimer,
  OversightBadge,
  SidePanel,
} from '../ui';
import { Check, Gauge, Shield, Target } from '../ui/Icons';
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

export function WorkerDetail({
  worker,
  opportunities,
  onClose,
  onBuild,
}: {
  worker: AIWorker | null;
  opportunities: AIOpportunity[];
  onClose: () => void;
  onBuild: (workerId: string) => void;
}) {
  if (!worker) return null;

  const sources = opportunities.filter((o) =>
    worker.sourceOpportunityIds.includes(o.id),
  );

  return (
    <SidePanel
      open
      onClose={onClose}
      eyebrow="Recommended AI worker"
      title={worker.name}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] text-muted">
            Ready to move from strategy to execution?
          </p>
          <Button onClick={() => onBuild(worker.id)}>
            Build with Smooth Operator
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <ComplexityBadge complexity={worker.complexity} />
          <OversightBadge level={worker.oversight} />
          <Badge tone="accent">{formatValueRange(worker.value)} per year</Badge>
        </div>

        <p className="text-[14.5px] leading-relaxed text-ink-soft text-pretty">
          {worker.description}
        </p>

        <Block title="Processes it handles" icon={<Check />}>
          <ul className="space-y-2">
            {worker.handles.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.2} />
                <span className="text-[13.5px] leading-relaxed text-ink-soft">{h}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Systems it connects to" icon={<Gauge />}>
          <div className="flex flex-wrap gap-2">
            {worker.systems.map((s) => (
              <Badge key={s} tone="brand">
                {s}
              </Badge>
            ))}
          </div>
        </Block>

        <Block title="Human oversight" icon={<Shield />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            {worker.oversight.charAt(0)}
            {worker.oversight.slice(1).toLowerCase()} oversight. Explicit
            approval points:
          </p>
          <ul className="space-y-2">
            {worker.humanInTheLoop.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-[7px] size-1.5 shrink-0 rounded-full bg-line-strong"
                />
                <span className="text-[13.5px] leading-relaxed text-ink-soft">{h}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Evaluation criteria" icon={<Target />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            Agreed before anything is built, so impact can be argued with
            evidence rather than anecdote.
          </p>
          <div className="flex flex-wrap gap-2">
            {worker.successMetrics.map((m) => (
              <Badge key={m} tone="neutral">
                {m}
              </Badge>
            ))}
          </div>
        </Block>

        {sources.length > 0 && (
          <Block title="Opportunities delivered">
            <ul className="space-y-2">
              {sources.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-line bg-canvas/60 px-4 py-3"
                >
                  <span className="text-[13.5px] font-medium text-ink">
                    {o.title}
                  </span>
                  <span className="numeral shrink-0 text-[13px] font-semibold text-brand">
                    {formatValueRange(o.value)}
                  </span>
                </li>
              ))}
            </ul>
            <Disclaimer className="mt-3">
              Illustrative estimate based on the information provided.
            </Disclaimer>
          </Block>
        )}
      </div>
    </SidePanel>
  );
}
