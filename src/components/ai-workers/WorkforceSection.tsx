import { useState } from 'react';
import type { AIWorker, TransformationMap } from '../../types';
import { SectionHeading, Disclaimer } from '../ui';
import { WorkerCard } from './WorkerCard';
import { WorkerDetail } from './WorkerDetail';
import { formatValueRange, sumValueRanges } from '../../utils/format';

export function WorkforceSection({
  map,
  deployedWorkerId,
  onBuild,
  exploreWorkerId,
  onExploreHandled,
}: {
  map: TransformationMap;
  deployedWorkerId: string | null;
  onBuild: (workerId: string) => void;
  /** Set when a user clicked "Design This AI Worker" from an opportunity */
  exploreWorkerId: string | null;
  onExploreHandled: () => void;
}) {
  const [selected, setSelected] = useState<AIWorker | null>(null);

  const active =
    selected ??
    (exploreWorkerId
      ? (map.workers.find((w) => w.id === exploreWorkerId) ?? null)
      : null);

  const combined = sumValueRanges(map.workers.map((w) => w.value));

  return (
    <section id="ai-workforce" className="scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-[1360px] px-5 py-18 sm:px-8 lg:py-22">
        <SectionHeading
          eyebrow="AI workforce"
          title="Your Recommended AI Workforce"
          description={`Four AI workers deliver the first wave. Combined estimated value ${formatValueRange(combined)} per year — a subset of the ${formatValueRange(map.summary.estimatedAnnualValue)} high-priority pool, sequenced so the first deployment can be proven before the next begins.`}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {map.workers.map((w, i) => (
            <WorkerCard
              key={w.id}
              worker={w}
              index={i}
              deployed={deployedWorkerId === w.id}
              onExplore={() => setSelected(w)}
              onBuild={() => onBuild(w.id)}
            />
          ))}
        </div>

        <Disclaimer className="mt-5">
          Illustrative estimate based on the information provided. Oversight
          levels describe the human approval model proposed for the first phase
          of operation, not a permanent setting.
        </Disclaimer>
      </div>

      <WorkerDetail
        worker={active}
        opportunities={map.opportunities}
        onClose={() => {
          setSelected(null);
          onExploreHandled();
        }}
        onBuild={(id) => {
          setSelected(null);
          onExploreHandled();
          onBuild(id);
        }}
      />
    </section>
  );
}
