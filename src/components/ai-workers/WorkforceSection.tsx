import { useState } from 'react';
import type { AIWorker, TransformationMap } from '../../types';
import { SectionHeading, StatusLabel } from '../ui';
import { WorkerCard } from './WorkerCard';
import { WorkerDetail } from './WorkerDetail';
import { formatValueRange, sumValueRanges } from '../../utils/format';

export function WorkforceSection({
  map,
  previewedWorkerId,
  exploreWorkerId,
  onExploreHandled,
  onExplorePilot,
  onPreviewHandoff,
}: {
  map: TransformationMap;
  previewedWorkerId: string | null;
  /** Set when a user arrived here from an opportunity panel */
  exploreWorkerId: string | null;
  onExploreHandled: () => void;
  onExplorePilot: () => void;
  onPreviewHandoff: (workerId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeId = selectedId ?? exploreWorkerId;
  const active: AIWorker | null =
    map.workers.find((w) => w.id === activeId) ?? null;

  const combined = sumValueRanges(map.workers.map((w) => w.value));

  const close = () => {
    setSelectedId(null);
    onExploreHandled();
  };

  return (
    <section id="ai-workforce" className="scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Provisional AI worker concepts"
          title="What an AI workforce could look like here"
          description={`Four concepts emerge from the opportunities above, with a combined indicative value of ${formatValueRange(combined)} per year — a subset of the ${formatValueRange(map.summary.estimatedAnnualValue)} high-priority pool. These are shapes of work worth investigating, not specifications ready to build.`}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <StatusLabel>Provisional — subject to discovery and pilot validation</StatusLabel>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {map.workers.map((w, i) => (
            <WorkerCard
              key={w.id}
              worker={w}
              index={i}
              previewed={previewedWorkerId === w.id}
              onExplore={() => setSelectedId(w.id)}
            />
          ))}
        </div>

        <p className="mt-5 max-w-3xl text-[12.5px] leading-relaxed text-muted text-pretty">
          Oversight levels describe the human approval model proposed for a
          first phase of operation, not a permanent setting. Which concept is
          built, in what form, and by what delivery route are decisions taken
          after discovery — not conclusions of this assessment.
        </p>
      </div>

      <WorkerDetail
        worker={active}
        opportunities={map.opportunities}
        onClose={close}
        onExplorePilot={() => {
          close();
          onExplorePilot();
        }}
        onPreviewHandoff={(id) => {
          close();
          onPreviewHandoff(id);
        }}
      />
    </section>
  );
}
