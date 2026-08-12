import { useState } from 'react';
import type { SmoothOperatorHandoff, TransformationMap } from '../../types';
import { ResultsHeader } from './ResultsHeader';
import { OpportunityMap } from '../opportunities/OpportunityMap';
import { OperatingModelSection } from '../operating-model/OperatingModelSection';
import { WorkforceSection } from '../ai-workers/WorkforceSection';
import { RoadmapSection } from '../roadmap/RoadmapSection';
import { FinalCTA } from '../roadmap/FinalCTA';
import { HandoffModal } from '../smooth-operator/HandoffModal';

export function ResultsPage({
  map,
  deployedWorkerId,
  onHandoffComplete,
}: {
  map: TransformationMap;
  deployedWorkerId: string | null;
  onHandoffComplete: (handoff: SmoothOperatorHandoff) => void;
}) {
  const [buildingWorkerId, setBuildingWorkerId] = useState<string | null>(null);
  const [exploreWorkerId, setExploreWorkerId] = useState<string | null>(null);

  const buildingWorker =
    map.workers.find((w) => w.id === buildingWorkerId) ?? null;

  /** Lowest-complexity worker is the recommended starting point. */
  const firstWorker =
    map.workers.find((w) => w.complexity === 'LOW') ?? map.workers[0];

  const scrollToWorkforce = () =>
    document.getElementById('ai-workforce')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <ResultsHeader map={map} />

      <OpportunityMap
        map={map}
        onDesignWorker={(workerId) => {
          setExploreWorkerId(workerId);
          scrollToWorkforce();
        }}
      />

      <OperatingModelSection model={map.operatingModel} />

      <WorkforceSection
        map={map}
        deployedWorkerId={deployedWorkerId}
        exploreWorkerId={exploreWorkerId}
        onExploreHandled={() => setExploreWorkerId(null)}
        onBuild={setBuildingWorkerId}
      />

      <RoadmapSection roadmap={map.roadmap} />

      <FinalCTA
        topWorkerName={firstWorker.name}
        onBuild={() => setBuildingWorkerId(firstWorker.id)}
      />

      <HandoffModal
        worker={buildingWorker}
        onClose={() => setBuildingWorkerId(null)}
        onOpenSmoothOperator={(handoff) => {
          setBuildingWorkerId(null);
          onHandoffComplete(handoff);
        }}
      />
    </>
  );
}
