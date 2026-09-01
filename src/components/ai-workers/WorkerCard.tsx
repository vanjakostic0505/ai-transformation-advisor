import type { AIWorker } from '../../types';
import { Badge, Button, Card, ComplexityBadge, OversightBadge } from '../ui';
import { ConfidenceMeter, StatusLabel } from '../ui/Evidence';
import { ArrowRight, Check, Spark } from '../ui/Icons';
import { formatValueRange } from '../../utils/format';

export function WorkerCard({
  worker,
  index,
  previewed,
  onExplore,
}: {
  worker: AIWorker;
  index: number;
  /** True once the user has previewed this concept's Smooth Operator handoff */
  previewed: boolean;
  onExplore: () => void;
}) {
  return (
    <Card
      padded={false}
      className="flex animate-fade-up flex-col overflow-hidden"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            aria-hidden
            className="flex size-10 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand"
          >
            <Spark className="size-[18px]" />
          </span>
          {previewed && (
            <Badge tone="accent">
              <Check aria-hidden className="size-3" strokeWidth={3} />
              Handoff previewed
            </Badge>
          )}
        </div>

        <h3 className="mt-4 text-[17px] leading-snug font-semibold tracking-[-0.022em] text-ink">
          {worker.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-muted">{worker.role}</p>

        <div className="mt-3">
          <StatusLabel tone="quiet">Provisional concept</StatusLabel>
        </div>

        <dl className="mt-5 space-y-4 border-t border-line pt-5">
          <div>
            <dt className="eyebrow text-[10px]">Could handle</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5">
                {worker.handles.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check
                      aria-hidden
                      className="mt-0.5 size-3.5 shrink-0 text-accent-700"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-snug text-ink-soft">{h}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div>
            <dt className="eyebrow text-[10px]">Would connect to</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {worker.systems.map((s) => (
                <Badge key={s} tone="neutral">
                  {s}
                </Badge>
              ))}
            </dd>
          </div>

          <div>
            <dt className="eyebrow text-[10px]">Indicative value</dt>
            <dd className="numeral mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-brand">
              {formatValueRange(worker.value)}{' '}
              <span className="text-[11.5px] font-medium text-faint">
                {worker.value.period}
              </span>
            </dd>
            <dd className="mt-2.5">
              <ConfidenceMeter confidence={worker.confidence} />
            </dd>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <ComplexityBadge complexity={worker.complexity} />
            <OversightBadge level={worker.oversight} />
          </div>
        </dl>
      </div>

      <div className="border-t border-line bg-canvas/70 p-5">
        <p className="text-[12.5px] leading-snug text-muted">
          Subject to discovery and pilot validation.{' '}
          {worker.pilotPrerequisites.length} prerequisites before this could
          become a pilot.
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={onExplore}
          className="mt-3 w-full"
          iconRight={<ArrowRight aria-hidden className="size-3.5" />}
        >
          Explore this concept
        </Button>
      </div>
    </Card>
  );
}
