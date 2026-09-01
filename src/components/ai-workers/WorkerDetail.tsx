import type { AIOpportunity, AIWorker } from '../../types';
import {
  Badge,
  Button,
  ComplexityBadge,
  OversightBadge,
  SidePanel,
  StatusLabel,
} from '../ui';
import { ConfidenceMeter } from '../ui/Evidence';
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

function Bullets({ items, marker }: { items: string[]; marker?: 'check' | 'dot' }) {
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

export function WorkerDetail({
  worker,
  opportunities,
  onClose,
  onExplorePilot,
  onPreviewHandoff,
}: {
  worker: AIWorker | null;
  opportunities: AIOpportunity[];
  onClose: () => void;
  onExplorePilot: () => void;
  onPreviewHandoff: (workerId: string) => void;
}) {
  if (!worker) return null;

  const sources = opportunities.filter((o) =>
    worker.sourceOpportunityIds.includes(o.id),
  );

  return (
    <SidePanel
      open
      onClose={onClose}
      eyebrow="Provisional AI worker concept"
      title={worker.name}
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] leading-snug text-muted">
            Not ready to build. The route to delivery runs through discovery
            and a controlled pilot.
          </p>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button onClick={onExplorePilot}>Explore a controlled pilot</Button>
            <Button variant="secondary" onClick={() => onPreviewHandoff(worker.id)}>
              Preview delivery handoff
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <StatusLabel>Provisional — subject to discovery</StatusLabel>
          <ComplexityBadge complexity={worker.complexity} />
          <OversightBadge level={worker.oversight} />
        </div>

        <p className="text-[14.5px] leading-relaxed text-ink-soft text-pretty">
          {worker.description}
        </p>

        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
          <p className="eyebrow text-[10px]">Indicative annual value</p>
          <p className="numeral mt-2 text-[24px] leading-none font-semibold text-brand">
            {formatValueRange(worker.value)}
          </p>
          <p className="mt-2 text-[12.5px] text-muted">
            Calculated as the sum of the opportunities this concept would
            deliver — never asserted independently.
          </p>
          <ConfidenceMeter confidence={worker.confidence} showMeaning className="mt-3" />
        </div>

        <Block title="Processes it could handle" icon={<Check />}>
          <Bullets items={worker.handles} marker="check" />
        </Block>

        <Block title="Systems it would connect to" icon={<Gauge />}>
          <div className="flex flex-wrap gap-2">
            {worker.systems.map((s) => (
              <Badge key={s} tone="brand">
                {s}
              </Badge>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
            Access, licensing and API scope would need to be confirmed by IT
            before any of this is assumed to be possible.
          </p>
        </Block>

        <Block title="Human oversight" icon={<Shield />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            {worker.oversight.charAt(0)}
            {worker.oversight.slice(1).toLowerCase()} oversight is proposed for
            the first phase of operation. Suggested approval points:
          </p>
          <Bullets items={worker.humanInTheLoop} />
        </Block>

        <Block title="Evaluation criteria" icon={<Target />}>
          <p className="mb-3 text-[13.5px] leading-relaxed text-muted">
            These would be agreed, with baseline values and a stopping rule,
            before anything is built — so impact can be demonstrated with
            evidence rather than argued after the fact.
          </p>
          <div className="flex flex-wrap gap-2">
            {worker.successMetrics.map((m) => (
              <Badge key={m} tone="neutral">
                {m}
              </Badge>
            ))}
          </div>
        </Block>

        <Block title="Prerequisites before a pilot" icon={<Shield />}>
          <div className="rounded-xl border border-high/25 bg-high-bg/50 p-4">
            <Bullets items={worker.pilotPrerequisites} />
          </div>
        </Block>

        {sources.length > 0 && (
          <Block title="Opportunities it would address">
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
          </Block>
        )}
      </div>
    </SidePanel>
  );
}
