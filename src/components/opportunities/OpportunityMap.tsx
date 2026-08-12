import { useMemo, useState } from 'react';
import type { AIOpportunity, Priority, TransformationMap } from '../../types';
import { SectionHeading, Disclaimer } from '../ui';
import { OpportunityRow } from './OpportunityRow';
import { OpportunityDetail } from './OpportunityDetail';
import { cn } from '../../utils/cn';

type Filter = 'ALL' | Priority;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'HIGH', label: 'High priority' },
  { id: 'MEDIUM', label: 'Medium priority' },
];

export function OpportunityMap({
  map,
  onDesignWorker,
}: {
  map: TransformationMap;
  onDesignWorker: (workerId: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [selected, setSelected] = useState<AIOpportunity | null>(null);

  const visible = useMemo(
    () =>
      filter === 'ALL'
        ? map.opportunities
        : map.opportunities.filter((o) => o.priority === filter),
    [filter, map.opportunities],
  );

  const maxValue = useMemo(
    () => Math.max(...map.opportunities.map((o) => o.value.high)),
    [map.opportunities],
  );

  const worker = selected?.recommendedWorkerId
    ? map.workers.find((w) => w.id === selected.recommendedWorkerId)
    : undefined;

  return (
    <section id="opportunities" className="scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-[1360px] px-5 py-18 sm:px-8 lg:py-22">
        <SectionHeading
          eyebrow="AI opportunity map"
          title="Where AI creates value in your operation"
          description={`${map.summary.opportunitiesIdentified} opportunities were identified. The ${map.opportunities.length} highest-ranked are shown below, ordered by estimated annual value.`}
          actions={
            <div className="flex gap-1.5 rounded-lg border border-line bg-surface p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-[12.5px] font-medium transition-all duration-200',
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

        <div className="mt-9 overflow-hidden rounded-[14px] border border-line bg-surface shadow-card">
          <div className="hidden grid-cols-[28px_minmax(0,1fr)_190px_150px_24px] gap-5 border-b border-line bg-canvas/60 px-6 py-3 sm:grid">
            <span className="eyebrow text-[10px]">#</span>
            <span className="eyebrow text-[10px]">Opportunity</span>
            <span className="eyebrow text-[10px]">Estimated value</span>
            <span className="eyebrow text-[10px]">Assessment</span>
            <span />
          </div>

          {visible.map((o, i) => (
            <OpportunityRow
              key={o.id}
              opportunity={o}
              maxValue={maxValue}
              index={i}
              onOpen={() => setSelected(o)}
            />
          ))}
        </div>

        <Disclaimer className="mt-4">
          Value ranges are illustrative estimates derived from the workforce,
          process and system information provided. They are not forecasts or
          financial guarantees. Select any opportunity to see the assumptions
          behind it.
        </Disclaimer>
      </div>

      <OpportunityDetail
        opportunity={selected}
        worker={worker}
        onClose={() => setSelected(null)}
        onDesignWorker={(workerId) => {
          setSelected(null);
          onDesignWorker(workerId);
        }}
      />
    </section>
  );
}
