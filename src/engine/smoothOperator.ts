import type { AIWorker, HandoffArtefact, SmoothOperatorHandoff } from '../types';

/**
 * ---------------------------------------------------------------------------
 * MOCK SMOOTH OPERATOR CLIENT
 * ---------------------------------------------------------------------------
 * Packages a recommended AI worker into the artefacts Smooth Operator needs to
 * create a draft agent configuration.
 *
 * Real implementation would be:
 *   POST {SMOOTH_OPERATOR_BASE_URL}/v1/agents/draft
 *   body: SmoothOperatorHandoff
 *   -> { draftId, url }
 * and `openInSmoothOperator` would navigate to that returned url.
 */

const STEP_LATENCY_MS = 620;

export function buildHandoffArtefacts(worker: AIWorker): HandoffArtefact[] {
  return [
    {
      id: 'role-definition',
      label: 'Role definition',
      detail: worker.role,
    },
    {
      id: 'instructions',
      label: 'Instructions',
      detail: `${worker.handles.length} operating procedures derived from the opportunity analysis`,
    },
    {
      id: 'knowledge',
      label: 'Knowledge requirements',
      detail: 'Source systems, documents and retrieval scope defined',
    },
    {
      id: 'tools',
      label: 'Tools & integrations',
      detail: worker.systems.join(', '),
    },
    {
      id: 'approval-rules',
      label: 'Human approval rules',
      detail: `${worker.oversight.charAt(0) + worker.oversight.slice(1).toLowerCase()} oversight — ${worker.humanInTheLoop.length} explicit approval points`,
    },
    {
      id: 'evaluation',
      label: 'Evaluation criteria',
      detail: worker.successMetrics.join(', '),
    },
  ];
}

function draftReference(worker: AIWorker): string {
  const suffix = worker.id.replace(/[^a-z]/g, '').slice(-4).toUpperCase();
  return `SO-DRAFT-${suffix}-${String(new Date().getFullYear())}`;
}

/** Simulates packaging one artefact at a time so the UI can animate progress. */
export async function packageWorkerForSmoothOperator(
  worker: AIWorker,
  onArtefactReady: (artefact: HandoffArtefact, index: number) => void,
): Promise<SmoothOperatorHandoff> {
  const artefacts = buildHandoffArtefacts(worker);

  for (let i = 0; i < artefacts.length; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, STEP_LATENCY_MS));
    onArtefactReady(artefacts[i], i);
  }

  return {
    workerId: worker.id,
    workerName: worker.name,
    draftReference: draftReference(worker),
    artefacts,
    status: 'ready',
  };
}
