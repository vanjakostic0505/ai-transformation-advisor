/**
 * Domain model for the AI Transformation Advisor.
 *
 * These types are the contract between the UI and whatever produces the data.
 * Today that producer is `src/engine/` (deterministic, in-browser).
 * Later it can be an LLM, an assessment service or a value engine — the UI does
 * not need to change, only the implementation behind the engine functions.
 *
 * A note on the vocabulary used throughout, because it is load-bearing:
 * this product produces an INDICATIVE first-pass assessment. Nothing it
 * outputs is a forecast, a business case or an implementation commitment.
 * The types below carry provenance and confidence so the interface can always
 * show which numbers came from the user, which are illustrative defaults, and
 * which still require expert validation.
 */

/* ------------------------------------------------------------------ */
/* Evidence, provenance and confidence                                 */
/* ------------------------------------------------------------------ */

/** Where a single number came from. Drives the label shown beside it. */
export type Provenance =
  /** Taken directly from the user's answers */
  | 'user'
  /** A sector default we supplied so the model can run at all */
  | 'illustrative'
  /** Cannot be known without going and measuring it */
  | 'needs-validation';

export const PROVENANCE_LABEL: Record<Provenance, string> = {
  user: 'From your answers',
  illustrative: 'Illustrative assumption',
  'needs-validation': 'Requires validation',
};

/**
 * Confidence in a value estimate.
 *
 * Deliberately capped at 'HIGHER', never 'high'. Completing a questionnaire
 * cannot produce high confidence — only measured operational baselines can.
 */
export type Confidence = 'LOW' | 'MEDIUM' | 'HIGHER';

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  LOW: 'Low confidence',
  MEDIUM: 'Medium confidence',
  HIGHER: 'Higher confidence',
};

export const CONFIDENCE_MEANING: Record<Confidence, string> = {
  LOW: 'Mainly illustrative assumptions. Treat the range as a rough order of magnitude.',
  MEDIUM: 'Some company inputs, some illustrative assumptions. Directionally useful, not yet a business case.',
  HIGHER: 'Rests on operational baselines that have been validated with a process owner.',
};

/** Status shown against any output the assessment produces. */
export type EvidenceStatus = 'indicative' | 'user-provided' | 'validated';

/* ------------------------------------------------------------------ */
/* Inputs — what we learn about the company                            */
/* ------------------------------------------------------------------ */

export interface CompanyProfile {
  name: string;
  industry: string;
  employeeCount: number;
  annualRevenue: string;
  markets: string[];
  businessModel: string;
}

export interface WorkforceUnit {
  id: string;
  department: string;
  headcount: number;
}

export interface WorkforceProfile {
  units: WorkforceUnit[];
}

export interface ProcessProfile {
  selectedProcessIds: string[];
  customProcesses: string[];
}

export interface SystemsProfile {
  selectedSystemIds: string[];
  customSystems: string[];
}

export interface ObjectivesProfile {
  selectedObjectiveIds: string[];
}

export type ReadinessScore = 1 | 2 | 3 | 4 | 5;

/**
 * The twelve readiness dimensions.
 *
 * `manualWorkload` is deliberately NOT a readiness factor — a lot of manual
 * work is an opportunity signal, not evidence of readiness. It is collected
 * here and reported separately.
 */
export type ReadinessKey =
  | 'processStandardisation'
  | 'knowledgeAccessibility'
  | 'workflowDigitisation'
  | 'manualWorkload'
  | 'dataAvailability'
  | 'securityPrivacy'
  | 'governanceOwnership'
  | 'executiveSponsorship'
  | 'processOwnerAvailability'
  | 'changeCapacity'
  | 'integrationFeasibility'
  | 'baselineMeasurability';

export type ReadinessProfile = Record<ReadinessKey, ReadinessScore>;

export type ReadinessGroupId = 'foundations' | 'data-governance' | 'organisation';

export interface ReadinessQuestion {
  key: ReadinessKey;
  group: ReadinessGroupId;
  question: string;
  context: string;
  lowLabel: string;
  highLabel: string;
  /** Short name used in the strengths / gaps breakdown */
  factor: string;
  /** Weight within the readiness score. Opportunity signals carry weight 0. */
  weight: number;
  /** True when this is an opportunity indicator rather than a readiness factor */
  opportunitySignal?: boolean;
}

/** The complete payload collected by the assessment flow. */
export interface AssessmentInput {
  company: CompanyProfile;
  workforce: WorkforceProfile;
  processes: ProcessProfile;
  systems: SystemsProfile;
  objectives: ObjectivesProfile;
  readiness: ReadinessProfile;
}

/* ------------------------------------------------------------------ */
/* The value model — how a money figure is actually arrived at         */
/* ------------------------------------------------------------------ */

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Complexity = 'LOW' | 'MEDIUM' | 'HIGH';
export type OversightLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** All monetary figures are ranges. We never present a single false number. */
export interface ValueRange {
  currency: string;
  /** thousands, e.g. 180 means €180K */
  low: number;
  high: number;
  period: string;
}

export type DriverFormat = 'count' | 'minutes' | 'hours' | 'percent' | 'currency-hour';

/**
 * One input to a value estimate. Every number behind every euro figure in the
 * product is one of these — there are no unexplained constants in the UI.
 */
export interface ValueDriver {
  id: string;
  label: string;
  value: number;
  format: DriverFormat;
  /** e.g. 'per month', 'per item' */
  unit: string;
  provenance: Provenance;
  /** Plain-language explanation of where the number comes from */
  note: string;
  editable: boolean;
  min: number;
  max: number;
  step: number;
}

export type ValueBasis = 'transaction' | 'time-share';

export interface ValueModel {
  basis: ValueBasis;
  drivers: ValueDriver[];
  confidence: Confidence;
  /** ± fraction applied to the point estimate to produce the published range */
  uncertaintyBand: number;
  /** One sentence describing the arithmetic, shown above the drivers */
  method: string;
}

/** The output of running a ValueModel. Nothing here is stored — it is derived. */
export interface ComputedValue {
  annualHoursInScope: number;
  annualHoursSaved: number;
  fteEquivalent: number;
  /** Point estimate in thousands */
  point: number;
  range: ValueRange;
  confidence: Confidence;
}

/** User adjustments to drivers, keyed by opportunity id then driver id. */
export type DriverOverrides = Record<string, Record<string, number>>;

/* ------------------------------------------------------------------ */
/* Outputs — what the advisor produces                                 */
/* ------------------------------------------------------------------ */

export interface AIOpportunity {
  id: string;
  rank: number;
  title: string;
  domain: string;
  summary: string;
  priority: Priority;
  complexity: Complexity;
  /** Indicative delivery window, subject to discovery */
  timeline: string;
  currentSituation: string[];
  aiCapabilities: string[];
  humanResponsibilities: string[];
  affectedDepartments: string[];
  relatedSystemIds: string[];
  /** How the euro figure is arrived at */
  valueModel: ValueModel;
  /** What a discovery sprint would need to establish before this is bankable */
  validationRequired: string[];
  /** id of the AI worker concept this would be delivered by, if any */
  recommendedWorkerId?: string;
  /** Filled in by the engine from the value model */
  value: ValueRange;
  computed: ComputedValue;
}

export interface AIWorker {
  id: string;
  name: string;
  role: string;
  description: string;
  handles: string[];
  systems: string[];
  complexity: Complexity;
  oversight: OversightLevel;
  humanInTheLoop: string[];
  successMetrics: string[];
  /** What has to be true before this concept could become a pilot */
  pilotPrerequisites: string[];
  sourceOpportunityIds: string[];
  /** Derived: sum of the source opportunities' computed values */
  value: ValueRange;
  confidence: Confidence;
}

export interface OperatingModelSnapshot {
  label: string;
  people: number;
  aiWorkers: number;
  metrics: { label: string; value: string; emphasis?: boolean }[];
}

export interface OperatingModel {
  current: OperatingModelSnapshot;
  target: OperatingModelSnapshot;
  note: string;
}

/* ------------------------------------------------------------------ */
/* Roadmap, gates and the commercial journey                           */
/* ------------------------------------------------------------------ */

export interface RoadmapPhase {
  id: string;
  index: number;
  name: string;
  objective: string;
  activities: string[];
  /** What leaving this phase produces */
  output: string;
  /** Who has to be involved */
  owner: string;
  /** Position on the indicative 90-day rail, 0–100. Null = beyond 90 days. */
  startPct: number | null;
  endPct: number | null;
  window: string;
  /** True once the phase sits beyond the indicative 90-day window */
  beyondNinetyDays: boolean;
}

export interface DeliveryGate {
  id: string;
  label: string;
  detail: string;
  owner: string;
}

export interface TransformationRoadmap {
  phases: RoadmapPhase[];
  horizonLabel: string;
  horizonCaveat: string;
  gates: DeliveryGate[];
}

/* ------------------------------------------------------------------ */
/* Readiness output                                                    */
/* ------------------------------------------------------------------ */

export interface ReadinessFactor {
  key: ReadinessKey;
  factor: string;
  /** 0–100 for this single dimension */
  score: number;
  weight: number;
  answer: ReadinessScore;
}

export interface ReadinessAssessment {
  score: number;
  outOf: number;
  band: string;
  bandExplanation: string;
  /** Highest-scoring weighted factors */
  strengths: ReadinessFactor[];
  /** Lowest-scoring weighted factors */
  gaps: ReadinessFactor[];
  /** Collected but excluded from the score */
  opportunitySignals: ReadinessFactor[];
  /** Must be established before a pilot can be scoped */
  validateBeforePilot: string[];
  nextDiscoveryAction: string;
  /** Plain-language description of the arithmetic */
  method: string;
  answeredCount: number;
  totalFactors: number;
}

/* ------------------------------------------------------------------ */
/* The assembled result                                                */
/* ------------------------------------------------------------------ */

export interface TransformationSummary {
  readiness: ReadinessAssessment;
  opportunitiesIndicated: number;
  highPriorityOpportunities: number;
  workerConcepts: number;
  estimatedAnnualValue: ValueRange;
  /** Aggregate confidence across the high-priority opportunities */
  confidence: Confidence;
  disclaimer: string;
}

/** The single object the results experience renders from. */
export interface TransformationMap {
  generatedAt: string;
  input: AssessmentInput;
  summary: TransformationSummary;
  opportunities: AIOpportunity[];
  workers: AIWorker[];
  operatingModel: OperatingModel;
  roadmap: TransformationRoadmap;
}

/* ------------------------------------------------------------------ */
/* Smooth Operator handoff                                             */
/* ------------------------------------------------------------------ */

export type HandoffArtefactId =
  | 'role-definition'
  | 'instructions'
  | 'knowledge'
  | 'tools'
  | 'approval-rules'
  | 'evaluation';

export interface HandoffArtefact {
  id: HandoffArtefactId;
  label: string;
  detail: string;
  /** What still has to be confirmed during discovery for this artefact */
  outstanding: string;
}

/**
 * The payload that would be sent to Smooth Operator to create a DRAFT agent
 * configuration for pilot design. Mocked today — see `engine/smoothOperator.ts`.
 */
export interface SmoothOperatorHandoff {
  workerId: string;
  workerName: string;
  draftReference: string;
  artefacts: HandoffArtefact[];
  status: 'draft-for-pilot-design';
}

/* ------------------------------------------------------------------ */
/* Catalog entries used by the assessment                              */
/* ------------------------------------------------------------------ */

export interface CatalogItem {
  id: string;
  label: string;
  hint?: string;
  group?: string;
}
