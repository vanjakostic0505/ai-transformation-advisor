/**
 * Domain model for the AI Transformation Advisor.
 *
 * These types are the contract between the UI and whatever produces the data.
 * Today that producer is `src/engine/advisorEngine.ts` (deterministic mock).
 * Later it can be an LLM, an assessment service or a ROI engine — the UI does
 * not need to change, only the implementation behind `AdvisorEngine`.
 */

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
  /** ids from PROCESS_CATALOG plus any custom entries the user added */
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

/** Each answer is a 1–5 self-assessment. */
export interface ReadinessProfile {
  processStandardisation: ReadinessScore;
  knowledgeAccessibility: ReadinessScore;
  workflowDigitisation: ReadinessScore;
  manualWorkload: ReadinessScore;
}

export type ReadinessScore = 1 | 2 | 3 | 4 | 5;

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
/* Outputs — what the advisor produces                                 */
/* ------------------------------------------------------------------ */

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
export type Complexity = 'LOW' | 'MEDIUM' | 'HIGH';
export type OversightLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** All monetary figures are ranges. We never present a single false number. */
export interface ValueRange {
  currency: string;
  low: number;
  high: number;
  /** e.g. 'per year' */
  period: string;
}

export interface AIOpportunity {
  id: string;
  rank: number;
  title: string;
  domain: string;
  summary: string;
  priority: Priority;
  complexity: Complexity;
  value: ValueRange;
  /** Weeks, e.g. '8–12 weeks' */
  timeline: string;
  currentSituation: string[];
  aiCapabilities: string[];
  humanResponsibilities: string[];
  affectedDepartments: string[];
  relatedSystemIds: string[];
  /** id of the AIWorker this opportunity would be delivered by, if any */
  recommendedWorkerId?: string;
}

export interface AIWorker {
  id: string;
  name: string;
  role: string;
  description: string;
  /** Processes the worker handles day to day */
  handles: string[];
  /** Systems it needs to be connected to */
  systems: string[];
  value: ValueRange;
  complexity: Complexity;
  oversight: OversightLevel;
  humanInTheLoop: string[];
  /** Metrics we would evaluate it on once live */
  successMetrics: string[];
  sourceOpportunityIds: string[];
}

export interface OperatingModelSnapshot {
  label: string;
  people: number;
  aiWorkers: number;
  /** Free-text qualitative markers, rendered as rows in the comparison */
  metrics: { label: string; value: string; emphasis?: boolean }[];
}

export interface OperatingModel {
  current: OperatingModelSnapshot;
  target: OperatingModelSnapshot;
  note: string;
}

export interface RoadmapPhase {
  id: string;
  index: number;
  name: string;
  objective: string;
  activities: string[];
  /** Position on the 90-day rail, 0–100 */
  startPct: number;
  endPct: number;
  window: string;
}

export interface TransformationRoadmap {
  phases: RoadmapPhase[];
  horizonLabel: string;
}

export interface TransformationSummary {
  readinessScore: number;
  readinessOutOf: number;
  readinessBand: string;
  opportunitiesIdentified: number;
  highPriorityOpportunities: number;
  recommendedWorkers: number;
  estimatedAnnualValue: ValueRange;
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
}

/**
 * The payload that would be POSTed to the Smooth Operator API to create a
 * draft agent configuration. Mocked today — see `engine/smoothOperator.ts`.
 */
export interface SmoothOperatorHandoff {
  workerId: string;
  workerName: string;
  /** Fake but plausible reference so the demo feels real */
  draftReference: string;
  artefacts: HandoffArtefact[];
  status: 'ready';
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
