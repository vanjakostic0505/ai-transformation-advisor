import { useMemo, useState } from 'react';
import type { AIOpportunity, DriverOverrides, Priority, TransformationMap } from '../../types';
import { SectionHeading, StatusLabel, Button } from '../ui';
import { OpportunityRow } from './OpportunityRow';
import { OpportunityDetail } from './OpportunityDetail';
import { ProvenanceLegend } from '../ui/Evidence';
import { cn } from '../../utils/cn';

type Filter = 'ALL' | Priority;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'HIGH', label: 'High priority' },
  { id: 'MEDIUM', label: 'Medium priority' },
];

export function OpportunityMap({
  map,
  overrides,
  onDriverChange,
  onResetOpportunity,
  onResetAll,
  onExploreWorker,
}: {
  map: TransformationMap;
  overrides: DriverOverrides;
  onDriverChange: (opportunityId: string, driverId: string, value: number) => void;
  onResetOpportunity: (opportunityId: string) => void;
  onResetAll: () => void;
  onExploreWorker: (workerId: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () =>
      filter === 'ALL'
        ? map.opportunities
        : map.opportunities.filter((o) => o.priority === filter),
    [filter, map.opportunities],
  );

  const maxValue = useMemo(
    () => Math.max(...map.opportunities.map((o) => o.value.high), 1),
    [map.opportunities],
  );

  // Read the live object each render so the panel reflects slider changes.
  const selected: AIOpportunity | null =
    map.opportunities.find((o) => o.id === selectedId) ?? null;

  const worker = selected?.recommendedWorkerId
    ? map.workers.find((w) => w.id === selected.recommendedWorkerId)
    : undefined;

  const anyAdjusted = Object.keys(overrides).length > 0;

  return (
    <section id="opportunities" className="scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Indicative AI opportunity map"
          title="Where AI might create value in your operation"
          description={`${map.summary.opportunitiesIndicated} potential opportunities were indicated. The ${map.opportunities.length} highest-ranked are shown below, provisionally ordered by indicative annual value. Open any row to see the assumptions behind its figure — and to change them.`}
          actions={
            <div
              className="flex gap-1.5 rounded-lg border border-line bg-surface p-1"
              role="group"
              aria-label="Filter opportunities by priority"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-md px-3 py-2 text-[12.5px] font-medium transition-all duration-200',
                    filter === f.id
                      ? 'bg-brand text-white'
                      : 'text-muted hover:text-ink',
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusLabel />
          <p className="text-[12.5px] text-muted">
            Ranking is provisional and exists to create an initial sequence for
            expert validation.
          </p>
          {anyAdjusted && (
            <Button variant="quiet" size="sm" onClick={onResetAll}>
              Reset all adjusted assumptions
            </Button>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-[14px] border border-line bg-surface shadow-card">
          <div className="hidden grid-cols-[28px_minmax(0,1fr)_200px_150px_24px] gap-5 border-b border-line bg-canvas/60 px-6 py-3 sm:grid">
            <span className="eyebrow text-[10px]">#</span>
            <span className="eyebrow text-[10px]">Potential opportunity</span>
            <span className="eyebrow text-[10px]">Indicative value</span>
            <span className="eyebrow text-[10px]">Provisional assessment</span>
            <span className="sr-only">Open detail</span>
          </div>

          {visible.map((o, i) => (
            <OpportunityRow
              key={o.id}
              opportunity={o}
              maxValue={maxValue}
              index={i}
              adjusted={Object.keys(overrides[o.id] ?? {}).length > 0}
              onOpen={() => setSelectedId(o.id)}
            />
          ))}
        </div>

        <div className="mt-5 rounded-[14px] border border-line bg-surface p-4 sm:p-5">
          <p className="text-[12.5px] leading-relaxed text-muted text-pretty">
            Every figure above is calculated from named assumptions rather than
            asserted. Some of those assumptions come from your answers; most are
            illustrative sector defaults; several are operational facts that can
            only be established by measurement.
          </p>
          <ProvenanceLegend className="mt-3" />
        </div>
      </div>

      <OpportunityDetail
        opportunity={selected}
        worker={worker}
        overrides={selected ? overrides[selected.id] : undefined}
        onClose={() => setSelectedId(null)}
        onDriverChange={(driverId, value) =>
          selected && onDriverChange(selected.id, driverId, value)
        }
        onResetOverrides={() => selected && onResetOpportunity(selected.id)}
        onExploreWorker={(workerId) => {
          setSelectedId(null);
          onExploreWorker(workerId);
        }}
      />
    </section>
  );
}
