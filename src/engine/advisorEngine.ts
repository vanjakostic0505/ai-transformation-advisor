import type {
  AssessmentInput,
  TransformationMap,
  TransformationSummary,
  ValueRange,
} from '../types';
import { OPPORTUNITIES, TOTAL_OPPORTUNITIES_IDENTIFIED } from '../data/opportunities';
import { WORKERS } from '../data/workers';
import { OPERATING_MODEL, ROADMAP } from '../data/roadmap';
import { sumValueRanges } from '../utils/format';
import { READINESS_QUESTIONS } from '../data/catalogs';

/**
 * ---------------------------------------------------------------------------
 * MOCK ADVISOR ENGINE
 * ---------------------------------------------------------------------------
 * Everything below is deterministic and runs in the browser. It exists so the
 * prototype behaves like a real product without a backend.
 *
 * To make this real, replace the body of `generateTransformationMap` with a
 * call to your services — the signature and the returned `TransformationMap`
 * shape are the integration contract:
 *
 *   POST /api/assessments            -> persist AssessmentInput
 *   POST /api/analysis               -> LLM opportunity identification
 *   POST /api/value-model            -> ROI / value engine
 *   GET  /api/transformation-map/:id -> TransformationMap
 *
 * Nothing in /components imports the fixtures directly; they only consume the
 * output of this function.
 */

const ANALYSIS_LATENCY_MS = 300;

/**
 * Readiness scoring model (0–100).
 *
 *   score = BASELINE + SELF_ASSESSMENT_SPAN × weighted + DIGITAL_ESTATE × coverage
 *
 * The baseline is deliberate: an organisation that scores 1 on every dimension
 * is not at zero readiness — it has more AI-addressable work, not less. What a
 * low score signals is that groundwork is needed first, which is why the band
 * label matters more than the number.
 *
 * Range: 30 (all ones, no systems) to 98 (all fives, broad digital estate).
 */
const BASELINE = 0.3;
const SELF_ASSESSMENT_SPAN = 0.62;
const DIGITAL_ESTATE = 0.06;

const READINESS_WEIGHTS: Record<string, number> = {
  processStandardisation: 0.3,
  knowledgeAccessibility: 0.28,
  workflowDigitisation: 0.27,
  manualWorkload: 0.15,
};

export function computeReadinessScore(input: AssessmentInput): number {
  let weighted = 0;
  for (const q of READINESS_QUESTIONS) {
    const raw = input.readiness[q.key];
    // A high manual workload lowers readiness but raises opportunity size.
    const normalised = q.inverse ? 6 - raw : raw;
    weighted += ((normalised - 1) / 4) * READINESS_WEIGHTS[q.key];
  }

  // Breadth of the digital estate is a mild positive signal.
  const coverage = Math.min(input.systems.selectedSystemIds.length / 6, 1);

  const score =
    BASELINE + SELF_ASSESSMENT_SPAN * weighted + DIGITAL_ESTATE * coverage;

  return Math.round(Math.min(Math.max(score, 0), 1) * 100);
}

export function readinessBand(score: number): string {
  if (score >= 75) return 'Ready to scale';
  if (score >= 60) return 'Ready for a first deployment';
  if (score >= 45) return 'Foundations needed';
  return 'Early stage';
}

function buildSummary(input: AssessmentInput): TransformationSummary {
  const highPriority = OPPORTUNITIES.filter((o) => o.priority === 'HIGH');
  const estimatedAnnualValue: ValueRange = sumValueRanges(highPriority.map((o) => o.value));

  const score = computeReadinessScore(input);

  return {
    readinessScore: score,
    readinessOutOf: 100,
    readinessBand: readinessBand(score),
    opportunitiesIdentified: TOTAL_OPPORTUNITIES_IDENTIFIED,
    highPriorityOpportunities: highPriority.length,
    recommendedWorkers: WORKERS.length,
    estimatedAnnualValue,
    disclaimer:
      'Illustrative estimate based on the information provided. Not a forecast, guarantee or financial commitment.',
  };
}

/** Reflects the company's own numbers back into the operating model panel. */
function personaliseOperatingModel(input: AssessmentInput) {
  const headcount =
    input.workforce.units.reduce((acc, u) => acc + u.headcount, 0) ||
    input.company.employeeCount;

  const withPeople = (
    snapshot: typeof OPERATING_MODEL.current,
    aiWorkers: number,
  ) => ({
    ...snapshot,
    people: headcount,
    aiWorkers,
    metrics: snapshot.metrics.map((m) =>
      m.label === 'People' ? { ...m, value: String(headcount) } : m,
    ),
  });

  return {
    ...OPERATING_MODEL,
    current: withPeople(OPERATING_MODEL.current, 0),
    target: withPeople(OPERATING_MODEL.target, WORKERS.length),
  };
}

/**
 * The single entry point the UI calls after the assessment is submitted.
 * Async on purpose — the real implementation will be a network call.
 */
export async function generateTransformationMap(
  input: AssessmentInput,
): Promise<TransformationMap> {
  await new Promise((resolve) => setTimeout(resolve, ANALYSIS_LATENCY_MS));

  return {
    generatedAt: new Date().toISOString(),
    input,
    summary: buildSummary(input),
    opportunities: [...OPPORTUNITIES].sort((a, b) => a.rank - b.rank),
    workers: WORKERS,
    operatingModel: personaliseOperatingModel(input),
    roadmap: ROADMAP,
  };
}
