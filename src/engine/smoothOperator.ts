import type { AIWorker, HandoffArtefact, SmoothOperatorHandoff } from '../types';

/**
 * ---------------------------------------------------------------------------
 * MOCK SMOOTH OPERATOR CLIENT
 * ---------------------------------------------------------------------------
 * Packages a provisional AI worker concept into the artefacts Smooth Operator
 * would need to open a DRAFT configuration for pilot design.
 *
 * The word "draft" is doing real work here. Nothing produced by an indicative
 * assessment is ready to build. Each artefact therefore carries an
 * `outstanding` field naming what discovery still has to establish — so the
 * handoff shows the remaining distance rather than implying there is none.
 *
 * Real implementation would be:
 *   POST {SMOOTH_OPERATOR_BASE_URL}/v1/agents/draft
 *   body: SmoothOperatorHandoff
 *   -> { draftId, url }
 * and "Open in Smooth Operator" would navigate to that returned url.
 */

const STEP_LATENCY_MS = 620;

export function buildHandoffArtefacts(worker: AIWorker): HandoffArtefact[] {
  return [
    {
      id: 'role-definition',
      label: 'Role definition',
      detail: worker.role,
      outstanding: 'Scope to be narrowed with the process owner during discovery',
    },
    {
      id: 'instructions',
      label: 'Instructions',
      detail: `${worker.handles.length} operating procedures outlined from the opportunity analysis`,
      outstanding: 'To be written properly against observed cases, not assumed ones',
    },
    {
      id: 'knowledge',
      label: 'Knowledge requirements',
      detail: 'Source systems and retrieval scope identified',
      outstanding: 'Content audit and document-level access rules still required',
    },
    {
      id: 'tools',
      label: 'Tools & integrations',
      detail: worker.systems.join(', '),
      outstanding: 'Access, licensing and API scope to be confirmed by IT',
    },
    {
      id: 'approval-rules',
      label: 'Human approval rules',
      detail: `${worker.oversight.charAt(0)}${worker.oversight.slice(1).toLowerCase()} oversight, with ${worker.humanInTheLoop.length} proposed approval points`,
      outstanding: 'To be agreed with the process owner and Risk before any build',
    },
    {
      id: 'evaluation',
      label: 'Evaluation criteria',
      detail: worker.successMetrics.join(', '),
      outstanding: 'Baseline values and an explicit stopping rule still to be set',
    },
  ];
}

function draftReference(worker: AIWorker): string {
  const suffix = worker.id.replace(/[^a-z]/g, '').slice(-4).toUpperCase();
  return `SO-DRAFT-${suffix}-${String(new Date().getFullYear())}`;
}

/** Simulates packaging one artefact at a time so the UI can show progress. */
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
    status: 'draft-for-pilot-design',
  };
}
