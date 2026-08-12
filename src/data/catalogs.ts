import type { CatalogItem } from '../types';

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

export const REVENUE_BANDS: string[] = [
  '< €5M',
  '€5M – €20M',
  '€20M – €50M',
  '€42M',
  '€50M – €150M',
  '€150M – €500M',
  '> €500M',
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

export const READINESS_QUESTIONS: {
  key: 'processStandardisation' | 'knowledgeAccessibility' | 'workflowDigitisation' | 'manualWorkload';
  question: string;
  context: string;
  lowLabel: string;
  highLabel: string;
  /** true when a HIGH answer is a negative signal for readiness */
  inverse?: boolean;
}[] = [
  {
    key: 'processStandardisation',
    question: 'How standardised are your processes?',
    context: 'Standardised work is far easier to delegate to an AI worker.',
    lowLabel: 'Mostly ad hoc',
    highLabel: 'Fully documented',
  },
  {
    key: 'knowledgeAccessibility',
    question: 'How accessible is your company knowledge?',
    context: 'AI workers need retrievable answers, not tribal knowledge.',
    lowLabel: 'In people’s heads',
    highLabel: 'Centralised and searchable',
  },
  {
    key: 'workflowDigitisation',
    question: 'How digital are your workflows?',
    context: 'Digital workflows give AI a system of record to act in.',
    lowLabel: 'Paper and email',
    highLabel: 'Fully system-based',
  },
  {
    key: 'manualWorkload',
    question: 'How much manual work remains?',
    context: 'A high manual load is a large opportunity — and a harder starting point.',
    lowLabel: 'Very little',
    highLabel: 'A great deal',
    inverse: true,
  },
];
