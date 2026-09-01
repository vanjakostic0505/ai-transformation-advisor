import { useState } from 'react';
import type { DriverOverrides, SmoothOperatorHandoff, TransformationMap } from '../../types';
import { ResultsHeader } from './ResultsHeader';
import { ReadinessBreakdown } from './ReadinessBreakdown';
import { ValidateModal } from './ValidateModal';
import { OpportunityMap } from '../opportunities/OpportunityMap';
import { OperatingModelSection } from '../operating-model/OperatingModelSection';
import { WorkforceSection } from '../ai-workers/WorkforceSection';
import { RoadmapSection } from '../roadmap/RoadmapSection';
import { DeliverySection } from '../smooth-operator/DeliverySection';
import { FinalCTA } from '../roadmap/FinalCTA';
import { HandoffModal } from '../smooth-operator/HandoffModal';

type AdvisoryModal = 'validate' | 'pilot' | null;

export function ResultsPage({
  map,
  overrides,
  previewedWorkerId,
  onDriverChange,
  onResetOpportunity,
  onResetAll,
  onHandoffComplete,
}: {
  map: TransformationMap;
  overrides: DriverOverrides;
  previewedWorkerId: string | null;
  onDriverChange: (opportunityId: string, driverId: string, value: number) => void;
  onResetOpportunity: (opportunityId: string) => void;
  onResetAll: () => void;
  onHandoffComplete: (handoff: SmoothOperatorHandoff) => void;
}) {
  const [handoffWorkerId, setHandoffWorkerId] = useState<string | null>(null);
  const [exploreWorkerId, setExploreWorkerId] = useState<string | null>(null);
  const [advisoryModal, setAdvisoryModal] = useState<AdvisoryModal>(null);

  const handoffWorker = map.workers.find((w) => w.id === handoffWorkerId) ?? null;

  /** Lowest-complexity concept is the cheapest place to find out if any of this works. */
  const leadCandidate =
    map.workers.find((w) => w.complexity === 'LOW') ?? map.workers[0];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <ResultsHeader
        map={map}
        onValidate={() => setAdvisoryModal('validate')}
        onExplorePilot={() => scrollTo('delivery')}
      />

      <ReadinessBreakdown readiness={map.summary.readiness} />

      <OpportunityMap
        map={map}
        overrides={overrides}
        onDriverChange={onDriverChange}
        onResetOpportunity={onResetOpportunity}
        onResetAll={onResetAll}
        onExploreWorker={(workerId) => {
          setExploreWorkerId(workerId);
          scrollTo('ai-workforce');
        }}
      />

      <OperatingModelSection model={map.operatingModel} />

      <WorkforceSection
        map={map}
        previewedWorkerId={previewedWorkerId}
        exploreWorkerId={exploreWorkerId}
        onExploreHandled={() => setExploreWorkerId(null)}
        onExplorePilot={() => setAdvisoryModal('pilot')}
        onPreviewHandoff={setHandoffWorkerId}
      />

      <RoadmapSection roadmap={map.roadmap} />

      <DeliverySection
        candidateWorker={leadCandidate}
        onValidate={() => setAdvisoryModal('validate')}
        onPreviewHandoff={() => setHandoffWorkerId(leadCandidate.id)}
      />

      <FinalCTA
        nextAction={map.summary.readiness.nextDiscoveryAction}
        onValidate={() => setAdvisoryModal('validate')}
        onExplorePilot={() => setAdvisoryModal('pilot')}
      />

      <ValidateModal
        mode={advisoryModal}
        map={map}
        onClose={() => setAdvisoryModal(null)}
      />

      <HandoffModal
        worker={handoffWorker}
        onClose={() => setHandoffWorkerId(null)}
        onOpenSmoothOperator={(handoff) => {
          setHandoffWorkerId(null);
          onHandoffComplete(handoff);
        }}
      />
    </>
  );
}
