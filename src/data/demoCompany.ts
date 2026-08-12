import type { AssessmentInput } from '../types';

/**
 * "Nordic Industrial Services" — the demo company used to pre-fill the
 * assessment so a stakeholder can walk the full journey in under a minute.
 */
export const DEMO_ASSESSMENT: AssessmentInput = {
  company: {
    name: 'Nordic Industrial Services',
    industry: 'Industrial Services',
    employeeCount: 420,
    annualRevenue: '€42M',
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
  readiness: {
    processStandardisation: 3,
    knowledgeAccessibility: 2,
    workflowDigitisation: 4,
    manualWorkload: 4,
  },
};

/** An empty assessment for users who want to start from scratch. */
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
      { id: 'wf-1', department: 'Customer Operations', headcount: 0 },
      { id: 'wf-2', department: 'Operations', headcount: 0 },
      { id: 'wf-3', department: 'Sales', headcount: 0 },
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
  },
};
