import type {
  AIOpportunity,
  AIWorker,
  AssessmentInput,
  Confidence,
  DriverOverrides,
  ReadinessAssessment,
  ReadinessFactor,
  TransformationMap,
  TransformationSummary,
  ValueRange,
} from '../types';
import {
  OPPORTUNITY_SEEDS,
  TOTAL_OPPORTUNITIES_INDICATED,
} from '../data/opportunities';
import { WORKER_SEEDS } from '../data/workers';
import { OPERATING_MODEL, ROADMAP } from '../data/roadmap';
import { READINESS_QUESTIONS, SCORED_READINESS_QUESTIONS } from '../data/catalogs';
import { aggregateConfidence, computeValue } from './valueModel';

/**
 * ---------------------------------------------------------------------------
 * MOCK ADVISOR ENGINE
 * ---------------------------------------------------------------------------
 * Deterministic, runs in the browser, no backend. It exists so the prototype
 * behaves like a real product while remaining honest about what it is.
 *
 * To make this real, replace the body of `generateTransformationMap` with calls
 * to your services. The signature and the returned `TransformationMap` are the
 * integration contract:
 *
 *   POST /api/assessments            -> persist AssessmentInput
 *   POST /api/analysis               -> opportunity identification
 *   POST /api/value-model            -> baselines from source systems
 *   GET  /api/transformation-map/:id -> TransformationMap
 *
 * No component imports the fixtures directly; they only consume the output of
 * this function, so swapping the implementation does not touch the UI.
 */

const ANALYSIS_LATENCY_MS = 300;

/* ------------------------------------------------------------------ */
/* Readiness                                                           */
/* ------------------------------------------------------------------ */

/**
 * Readiness scoring model (0–100).
 *
 *   score = BASELINE + SPAN × weighted answers + DIGITAL_ESTATE × system coverage
 *
 * The baseline exists because an organisation scoring 1 everywhere is not at
 * zero — it has more addressable work, not less. What a low score signals is
 * that groundwork comes before a pilot, which is why the band and the gaps
 * matter far more than the number.
 *
 * Range: 20 (all ones, no systems) to 98 (all fives, broad digital estate).
 * It deliberately cannot reach 100: a questionnaire cannot establish readiness.
 */
const BASELINE = 0.2;
const SPAN = 0.72;
const DIGITAL_ESTATE = 0.06;

/** Normalise a 1–5 answer to 0–1. */
const normalise = (answer: number) => (answer - 1) / 4;

export function computeReadinessScore(input: AssessmentInput): number {
  let weighted = 0;
  for (const q of SCORED_READINESS_QUESTIONS) {
    weighted += normalise(input.readiness[q.key]) * q.weight;
  }

  const coverage = Math.min(input.systems.selectedSystemIds.length / 6, 1);
  const score = BASELINE + SPAN * weighted + DIGITAL_ESTATE * coverage;

  return Math.round(Math.min(Math.max(score, 0), 1) * 100);
}

export function readinessBand(score: number): { band: string; explanation: string } {
  if (score >= 75) {
    return {
      band: 'Strong foundations',
      explanation:
        'The conditions a pilot depends on appear to be largely in place. Validation should be quick rather than remedial.',
    };
  }
  if (score >= 60) {
    return {
      band: 'Potential candidate for further validation',
      explanation:
        'Enough is in place to justify a discovery sprint. Several conditions still need to be established before a pilot could be scoped.',
    };
  }
  if (score >= 45) {
    return {
      band: 'Foundations need attention before a pilot',
      explanation:
        'The opportunity may well be real, but specific gaps would stall a pilot. Address those first, in parallel with discovery.',
    };
  }
  return {
    band: 'Early stage',
    explanation:
      'Groundwork comes before automation. Discovery here is about building the conditions for AI, not deploying it.',
  };
}

function toFactor(
  key: (typeof READINESS_QUESTIONS)[number]['key'],
  input: AssessmentInput,
): ReadinessFactor {
  const q = READINESS_QUESTIONS.find((x) => x.key === key)!;
  const answer = input.readiness[key];
  return {
    key,
    factor: q.factor,
    score: Math.round(normalise(answer) * 100),
    weight: q.weight,
    answer,
  };
}

/**
 * What must be established before a pilot could be scoped. Driven by the
 * answers, so it is specific to this company rather than boilerplate.
 */
function validationTasks(input: AssessmentInput): string[] {
  const tasks: string[] = [
    'A measured operational baseline for the chosen opportunity, replacing the assumed volumes and handling times in this map',
  ];
  const r = input.readiness;

  if (r.dataAvailability <= 3)
    tasks.push('A data quality and availability check on the systems the AI worker would read from');
  if (r.securityPrivacy <= 3)
    tasks.push('A security and personal-data review, covering classification, retention and residency');
  if (r.governanceOwnership <= 3)
    tasks.push('A named, mandated owner accountable for the AI worker’s decisions');
  if (r.integrationFeasibility <= 3)
    tasks.push('Confirmation that the required system access is technically and contractually possible');
  if (r.baselineMeasurability <= 3)
    tasks.push('An agreed way to measure today’s performance, so improvement can be demonstrated');
  if (r.processOwnerAvailability <= 3)
    tasks.push('Committed time from the process owners who would take part in discovery');
  if (r.executiveSponsorship <= 3)
    tasks.push('An executive sponsor with the mandate and budget to proceed past discovery');
  if (r.changeCapacity <= 2)
    tasks.push('An honest view of how much change the organisation can absorb alongside existing commitments');

  return tasks;
}

function nextDiscoveryAction(score: number, gaps: ReadinessFactor[]): string {
  const weakest = gaps[0];
  if (score < 45) {
    return `Start with the foundations rather than a pilot. On the evidence given, ${weakest.factor.toLowerCase()} is the binding constraint — a short advisory session on that will be worth more than any automation.`;
  }
  if (score < 60) {
    return `Book an expert validation session focused on ${weakest.factor.toLowerCase()}. Confirm whether it genuinely blocks a pilot, or only slows one, before committing to a discovery sprint.`;
  }
  return `Scope an AI Value Discovery Sprint on the highest-ranked opportunity, and use it to close the gap on ${weakest.factor.toLowerCase()} at the same time.`;
}

export function assessReadiness(input: AssessmentInput): ReadinessAssessment {
  const score = computeReadinessScore(input);
  const { band, explanation } = readinessBand(score);

  const scored = SCORED_READINESS_QUESTIONS.map((q) => toFactor(q.key, input));
  const ranked = [...scored].sort(
    (a, b) => b.score - a.score || b.weight - a.weight,
  );

  const opportunitySignals = READINESS_QUESTIONS.filter(
    (q) => q.opportunitySignal,
  ).map((q) => toFactor(q.key, input));

  const gaps = [...ranked].reverse().slice(0, 3);

  return {
    score,
    outOf: 100,
    band,
    bandExplanation: explanation,
    strengths: ranked.slice(0, 3),
    gaps,
    opportunitySignals,
    validateBeforePilot: validationTasks(input),
    nextDiscoveryAction: nextDiscoveryAction(score, gaps),
    method:
      'Eleven weighted factors, each answered on a one-to-five scale, are combined into a single indicative figure, with a small adjustment for the breadth of your digital estate. Manual workload is collected but deliberately excluded: a lot of manual work indicates a large opportunity, not that the organisation is ready to address it. The scale starts at 20 rather than 0, and cannot reach 100 — a questionnaire cannot establish readiness, only indicate it.',
    answeredCount: SCORED_READINESS_QUESTIONS.length,
    totalFactors: READINESS_QUESTIONS.length,
  };
}

/* ------------------------------------------------------------------ */
/* Opportunities, workers and totals                                   */
/* ------------------------------------------------------------------ */

function sumRanges(ranges: ValueRange[]): ValueRange {
  if (ranges.length === 0)
    return { currency: '€', low: 0, high: 0, period: 'per year' };
  return {
    currency: ranges[0].currency,
    period: ranges[0].period,
    low: ranges.reduce((acc, r) => acc + r.low, 0),
    high: ranges.reduce((acc, r) => acc + r.high, 0),
  };
}

/** Runs every value model, applying any user adjustments to the drivers. */
export function buildOpportunities(
  overrides: DriverOverrides = {},
): AIOpportunity[] {
  return OPPORTUNITY_SEEDS.map((seed) => {
    const computed = computeValue(seed.valueModel, overrides[seed.id]);
    return { ...seed, computed, value: computed.range };
  }).sort((a, b) => a.rank - b.rank);
}

/** Worker value is the sum of the opportunities it would deliver — never asserted. */
export function buildWorkers(opportunities: AIOpportunity[]): AIWorker[] {
  return WORKER_SEEDS.map((seed) => {
    const sources = opportunities.filter((o) =>
      seed.sourceOpportunityIds.includes(o.id),
    );
    const confidences: Confidence[] = sources.map((o) => o.computed.confidence);
    return {
      ...seed,
      value: sumRanges(sources.map((o) => o.value)),
      confidence: aggregateConfidence(
        confidences.length ? confidences : ['LOW'],
      ),
    };
  });
}

function buildSummary(
  input: AssessmentInput,
  opportunities: AIOpportunity[],
  workers: AIWorker[],
): TransformationSummary {
  const highPriority = opportunities.filter((o) => o.priority === 'HIGH');

  return {
    readiness: assessReadiness(input),
    opportunitiesIndicated: TOTAL_OPPORTUNITIES_INDICATED,
    highPriorityOpportunities: highPriority.length,
    workerConcepts: workers.length,
    estimatedAnnualValue: sumRanges(highPriority.map((o) => o.value)),
    confidence: aggregateConfidence(
      highPriority.map((o) => o.computed.confidence),
    ),
    disclaimer:
      'Indicative estimate produced from the information you provided, combined with illustrative sector assumptions. It is a starting point for expert validation — not a forecast, a business case or an implementation commitment.',
  };
}

/** Reflects the company's own numbers back into the operating model panel. */
function personaliseOperatingModel(input: AssessmentInput, workerCount: number) {
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
    target: withPeople(OPERATING_MODEL.target, workerCount),
  };
}

/**
 * Rebuilds the derived parts of the map. Called on first analysis, and again
 * whenever the user adjusts an assumption, so every figure on every screen
 * stays consistent with the drivers behind it.
 */
export function deriveMap(
  input: AssessmentInput,
  overrides: DriverOverrides = {},
  generatedAt = new Date().toISOString(),
): TransformationMap {
  const opportunities = buildOpportunities(overrides);
  const workers = buildWorkers(opportunities);

  return {
    generatedAt,
    input,
    summary: buildSummary(input, opportunities, workers),
    opportunities,
    workers,
    operatingModel: personaliseOperatingModel(input, workers.length),
    roadmap: ROADMAP,
  };
}

/** The entry point the UI calls after the assessment is submitted. */
export async function generateTransformationMap(
  input: AssessmentInput,
): Promise<TransformationMap> {
  await new Promise((resolve) => setTimeout(resolve, ANALYSIS_LATENCY_MS));
  return deriveMap(input);
}
