import type { AIWorker } from '../../types';
import { Badge, Button, Card, ComplexityBadge, OversightBadge } from '../ui';
import { ArrowRight, Check, Spark } from '../ui/Icons';
import { formatValueRange } from '../../utils/format';

export function WorkerCard({
  worker,
  index,
  deployed,
  onExplore,
  onBuild,
}: {
  worker: AIWorker;
  index: number;
  deployed: boolean;
  onExplore: () => void;
  onBuild: () => void;
}) {
  return (
    <Card
      padded={false}
      className="flex animate-fade-up flex-col overflow-hidden"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex-1 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand">
            <Spark className="size-[18px]" />
          </span>
          {deployed && (
            <Badge tone="accent">
              <Check className="size-3" strokeWidth={3} />
              Handed off
            </Badge>
          )}
        </div>

        <h3 className="mt-4 text-[17px] leading-snug font-semibold tracking-[-0.022em] text-ink">
          {worker.name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-muted">{worker.role}</p>

        <dl className="mt-5 space-y-4 border-t border-line pt-5">
          <div>
            <dt className="eyebrow text-[10px]">Handles</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5">
                {worker.handles.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-accent"
                      strokeWidth={2.4}
                    />
                    <span className="text-[13px] leading-snug text-ink-soft">{h}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div>
            <dt className="eyebrow text-[10px]">Systems</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {worker.systems.map((s) => (
                <Badge key={s} tone="neutral">
                  {s}
                </Badge>
              ))}
            </dd>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <dt className="eyebrow text-[10px]">Potential value</dt>
              <dd className="numeral mt-1.5 text-[19px] font-semibold tracking-[-0.02em] text-brand">
                {formatValueRange(worker.value)}
                <span className="ml-1.5 text-[11.5px] font-medium text-faint">
                  {worker.value.period}
                </span>
              </dd>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <ComplexityBadge complexity={worker.complexity} />
            <OversightBadge level={worker.oversight} />
          </div>
        </dl>
      </div>

      <div className="border-t border-line bg-canvas/60 p-5">
        <p className="text-[12.5px] leading-snug text-muted">
          Ready to move from strategy to execution?
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button size="sm" onClick={onBuild} className="flex-1">
            Build with Smooth Operator
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onExplore}
            iconRight={<ArrowRight className="size-3.5" />}
          >
            Explore Worker
          </Button>
        </div>
      </div>
    </Card>
  );
}
