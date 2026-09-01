import type { AssessmentInput, ReadinessProfile } from '../types';

/**
 * "Nordic Industrial Services" — the worked demonstration used to pre-fill the
 * assessment so a stakeholder can walk the full journey immediately.
 *
 * The readiness answers are deliberately mixed rather than flattering. A demo
 * that scores well on every dimension would teach the wrong lesson: the value
 * of this assessment is that it exposes gaps, not that it produces a good mark.
 */
const DEMO_READINESS: ReadinessProfile = {
  // Operational foundations
  processStandardisation: 3,
  knowledgeAccessibility: 2,
  workflowDigitisation: 4,
  manualWorkload: 4, // opportunity signal — reported separately, not scored
  // Data, security and governance
  dataAvailability: 3,
  securityPrivacy: 2,
  governanceOwnership: 2,
  integrationFeasibility: 3,
  // Organisation and delivery capacity
  executiveSponsorship: 3,
  processOwnerAvailability: 2,
  changeCapacity: 3,
  baselineMeasurability: 2,
};

export const DEMO_ASSESSMENT: AssessmentInput = {
  company: {
    name: 'Nordic Industrial Services',
    industry: 'Industrial Services',
    employeeCount: 420,
    annualRevenue: '€20M – €50M',
    markets: ['France', 'Germany', 'Belgium'],
    businessModel: 'B2B Services',
  },
  workforce: {
    units: [
      { id: 'wf-1', department: 'Customer Operations', headcount: 80 },
      { id: 'wf-2', department: 'Sales', headcount: 35 },
      { id: 'wf-3', department: 'Finance', headcount: 20 },
      { id: 'wf-4', department: 'HR', headcount: 12 },
      { id: 'wf-5', department: 'Operations', headcount: 150 },
      { id: 'wf-6', department: 'IT', headcount: 25 },
      { id: 'wf-7', department: 'Management', headcount: 18 },
      { id: 'wf-8', department: 'Other', headcount: 80 },
    ],
  },
  processes: {
    selectedProcessIds: [
      'customer-support',
      'email-processing',
      'ticket-management',
      'document-processing',
      'knowledge-search',
      'reporting',
      'quality-assurance',
      'back-office-admin',
      'sales-research',
    ],
    customProcesses: [],
  },
  systems: {
    selectedSystemIds: ['salesforce', 'sap', 'microsoft-365', 'zendesk', 'jira'],
    customSystems: [],
  },
  objectives: {
    selectedObjectiveIds: [
      'reduce-cost',
      'increase-productivity',
      'scale-without-hiring',
      'response-time',
      'customer-experience',
    ],
  },
  readiness: DEMO_READINESS,
};

/** A neutral starting point for users who want to assess their own company. */
export const EMPTY_ASSESSMENT: AssessmentInput = {
  company: {
    name: '',
    industry: '',
    employeeCount: 0,
    annualRevenue: '',
    markets: [],
    businessModel: '',
  },
  workforce: {
    units: [
      { id: 'wf-1', department: '', headcount: 0 },
      { id: 'wf-2', department: '', headcount: 0 },
      { id: 'wf-3', department: '', headcount: 0 },
    ],
  },
  processes: { selectedProcessIds: [], customProcesses: [] },
  systems: { selectedSystemIds: [], customSystems: [] },
  objectives: { selectedObjectiveIds: [] },
  readiness: {
    processStandardisation: 3,
    knowledgeAccessibility: 3,
    workflowDigitisation: 3,
    manualWorkload: 3,
    dataAvailability: 3,
    securityPrivacy: 3,
    governanceOwnership: 3,
    integrationFeasibility: 3,
    executiveSponsorship: 3,
    processOwnerAvailability: 3,
    changeCapacity: 3,
    baselineMeasurability: 3,
  },
};
