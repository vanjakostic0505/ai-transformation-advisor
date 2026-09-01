import type { CatalogItem, ReadinessGroupId, ReadinessQuestion } from '../types';

/** Option sets for the assessment. Replaceable by a taxonomy service later. */

export const INDUSTRIES: string[] = [
  'Industrial Services',
  'Manufacturing',
  'Logistics & Transport',
  'Financial Services',
  'Insurance',
  'Professional Services',
  'Retail & E-commerce',
  'Healthcare',
  'Energy & Utilities',
  'Public Sector',
  'Technology',
  'Other',
];

export const BUSINESS_MODELS: string[] = [
  'B2B Services',
  'B2B Products',
  'B2B SaaS',
  'B2C',
  'Marketplace',
  'Mixed B2B / B2C',
];

/**
 * Revenue bands only. An exact figure such as "€42M" belongs to the worked
 * demonstration, not to the option list — offering it to every user implied a
 * precision the assessment does not have.
 */
export const REVENUE_BANDS: string[] = [
  'Under €5M',
  '€5M – €20M',
  '€20M – €50M',
  '€50M – €150M',
  '€150M – €500M',
  'Over €500M',
  'Prefer not to say',
];

export const MARKETS: string[] = [
  'France',
  'Germany',
  'Belgium',
  'Netherlands',
  'Spain',
  'Italy',
  'Nordics',
  'United Kingdom',
  'Poland',
  'United States',
];

export const DEPARTMENT_SUGGESTIONS: string[] = [
  'Customer Operations',
  'Sales',
  'Finance',
  'HR',
  'Operations',
  'IT',
  'Management',
  'Marketing',
  'Legal & Compliance',
  'Procurement',
  'Other',
];

export const PROCESS_CATALOG: CatalogItem[] = [
  { id: 'customer-support', label: 'Customer support', group: 'Customer', hint: 'Inbound requests, tickets, complaints' },
  { id: 'email-processing', label: 'Email processing', group: 'Customer', hint: 'Shared inboxes, triage, routing' },
  { id: 'ticket-management', label: 'Ticket management', group: 'Customer', hint: 'Classification, assignment, follow-up' },
  { id: 'scheduling', label: 'Scheduling', group: 'Operations', hint: 'Planning, dispatch, calendars' },
  { id: 'data-entry', label: 'Data entry', group: 'Operations', hint: 'Re-keying between systems' },
  { id: 'document-processing', label: 'Document processing', group: 'Operations', hint: 'Invoices, orders, contracts, forms' },
  { id: 'quality-assurance', label: 'Quality assurance', group: 'Operations', hint: 'Checks, reviews, sampling' },
  { id: 'back-office-admin', label: 'Back-office administration', group: 'Operations', hint: 'Routine administrative workflows' },
  { id: 'reporting', label: 'Reporting', group: 'Insight', hint: 'Recurring management and client reporting' },
  { id: 'knowledge-search', label: 'Knowledge search', group: 'Insight', hint: 'Finding answers across systems and documents' },
  { id: 'sales-research', label: 'Sales research', group: 'Commercial', hint: 'Account, prospect and market research' },
  { id: 'internal-communication', label: 'Internal communication', group: 'Commercial', hint: 'Updates, summaries, handovers' },
];

export const SYSTEM_CATALOG: CatalogItem[] = [
  { id: 'salesforce', label: 'Salesforce', group: 'CRM' },
  { id: 'hubspot', label: 'HubSpot', group: 'CRM' },
  { id: 'sap', label: 'SAP', group: 'ERP' },
  { id: 'servicenow', label: 'ServiceNow', group: 'Service' },
  { id: 'zendesk', label: 'Zendesk', group: 'Service' },
  { id: 'jira', label: 'Jira', group: 'Work management' },
  { id: 'microsoft-365', label: 'Microsoft 365', group: 'Productivity' },
  { id: 'google-workspace', label: 'Google Workspace', group: 'Productivity' },
  { id: 'custom-other', label: 'Custom / Other', group: 'Other' },
];

export const OBJECTIVE_CATALOG: CatalogItem[] = [
  { id: 'reduce-cost', label: 'Reduce operating costs', hint: 'Lower cost to serve' },
  { id: 'increase-productivity', label: 'Increase productivity', hint: 'More output per person' },
  { id: 'scale-without-hiring', label: 'Scale without hiring', hint: 'Absorb growth with the same team' },
  { id: 'customer-experience', label: 'Improve customer experience', hint: 'Consistency and quality of service' },
  { id: 'response-time', label: 'Reduce response time', hint: 'Faster first response and resolution' },
  { id: 'reduce-errors', label: 'Reduce errors', hint: 'Fewer rework loops and exceptions' },
  { id: 'increase-revenue', label: 'Increase revenue', hint: 'More capacity for commercial work' },
  { id: 'employee-experience', label: 'Improve employee experience', hint: 'Less repetitive work' },
];

/* ------------------------------------------------------------------ */
/* Readiness                                                           */
/* ------------------------------------------------------------------ */

export const READINESS_GROUPS: {
  id: ReadinessGroupId;
  label: string;
  description: string;
}[] = [
  {
    id: 'foundations',
    label: 'Operational foundations',
    description: 'How ready the work itself is to be delegated.',
  },
  {
    id: 'data-governance',
    label: 'Data, security and governance',
    description:
      'The constraints that most often stop an AI pilot after the business case is approved.',
  },
  {
    id: 'organisation',
    label: 'Organisation and delivery capacity',
    description:
      'Whether the company can actually absorb the change, and prove whether it worked.',
  },
];

/**
 * Twelve readiness dimensions.
 *
 * Weights sum to 1 across the eleven scored factors. `manualWorkload` carries
 * weight 0: a lot of manual work indicates a large opportunity, but it is not
 * evidence that the organisation is ready to address it. Treating it as
 * readiness — as the earlier four-question version did — inflated the score
 * for exactly the companies least prepared to run a pilot.
 */
export const READINESS_QUESTIONS: ReadinessQuestion[] = [
  {
    key: 'processStandardisation',
    group: 'foundations',
    factor: 'Process standardisation',
    weight: 0.12,
    question: 'How standardised are your processes?',
    context: 'Standardised work is far easier to delegate to an AI worker.',
    lowLabel: 'Mostly ad hoc',
    highLabel: 'Fully documented',
  },
  {
    key: 'knowledgeAccessibility',
    group: 'foundations',
    factor: 'Knowledge accessibility',
    weight: 0.11,
    question: 'How accessible is your company knowledge?',
    context: 'AI workers need retrievable answers, not knowledge held in people’s heads.',
    lowLabel: 'In people’s heads',
    highLabel: 'Centralised and searchable',
  },
  {
    key: 'workflowDigitisation',
    group: 'foundations',
    factor: 'Digital workflow maturity',
    weight: 0.1,
    question: 'How digital are your workflows?',
    context: 'Digital workflows give an AI worker a system of record to act in.',
    lowLabel: 'Paper and email',
    highLabel: 'Fully system-based',
  },
  {
    key: 'manualWorkload',
    group: 'foundations',
    factor: 'Manual-work opportunity',
    weight: 0,
    opportunitySignal: true,
    question: 'How much manual work remains?',
    context:
      'This indicates the size of the opportunity. It is reported separately and does not raise your readiness score.',
    lowLabel: 'Very little',
    highLabel: 'A great deal',
  },
  {
    key: 'dataAvailability',
    group: 'data-governance',
    factor: 'Data availability and quality',
    weight: 0.11,
    question: 'Is the data an AI worker would need available and reliable?',
    context: 'Poor data does not stop a pilot starting. It stops it succeeding.',
    lowLabel: 'Scattered or unreliable',
    highLabel: 'Complete and trusted',
  },
  {
    key: 'securityPrivacy',
    group: 'data-governance',
    factor: 'Security and privacy readiness',
    weight: 0.1,
    question: 'How ready are your security and privacy processes for an AI system?',
    context:
      'Personal data, customer confidentiality and GDPR obligations all need a position before a pilot, not after.',
    lowLabel: 'Not yet considered',
    highLabel: 'Reviewed and documented',
  },
  {
    key: 'governanceOwnership',
    group: 'data-governance',
    factor: 'Governance and accountable ownership',
    weight: 0.09,
    question: 'Is there a named person accountable for AI decisions and outcomes?',
    context:
      'Someone has to own what the AI worker does. Without a name, approval stalls at the first difficult question.',
    lowLabel: 'Nobody yet',
    highLabel: 'Named and mandated',
  },
  {
    key: 'integrationFeasibility',
    group: 'data-governance',
    factor: 'Integration feasibility',
    weight: 0.08,
    question: 'How feasible is it to connect to your core systems?',
    context:
      'API access, licensing and internal approval routes decide whether a design can actually be built.',
    lowLabel: 'Closed or unknown',
    highLabel: 'Open and well understood',
  },
  {
    key: 'executiveSponsorship',
    group: 'organisation',
    factor: 'Executive sponsorship',
    weight: 0.08,
    question: 'Is there executive sponsorship for this work?',
    context: 'A sponsor is what turns a promising pilot into a funded programme.',
    lowLabel: 'Exploratory interest',
    highLabel: 'Committed sponsor with budget',
  },
  {
    key: 'processOwnerAvailability',
    group: 'organisation',
    factor: 'Process-owner availability',
    weight: 0.07,
    question: 'Would the people who own these processes have time to take part?',
    context:
      'Discovery needs hours from the busiest people in the business. This is the most commonly underestimated constraint.',
    lowLabel: 'No spare capacity',
    highLabel: 'Time already allocated',
  },
  {
    key: 'changeCapacity',
    group: 'organisation',
    factor: 'Change and adoption capacity',
    weight: 0.07,
    question: 'How much change is the organisation already absorbing?',
    context:
      'An AI worker that nobody has capacity to adopt delivers none of the estimated value.',
    lowLabel: 'Already saturated',
    highLabel: 'Ready for change',
  },
  {
    key: 'baselineMeasurability',
    group: 'organisation',
    factor: 'Ability to measure a baseline',
    weight: 0.07,
    question: 'Could you measure today’s performance to compare against?',
    context:
      'Without a baseline, impact can only be argued, never demonstrated. This is what makes a business case defensible.',
    lowLabel: 'No reliable measures',
    highLabel: 'Measured and reported already',
  },
];

export const SCORED_READINESS_QUESTIONS = READINESS_QUESTIONS.filter(
  (q) => !q.opportunitySignal,
);
