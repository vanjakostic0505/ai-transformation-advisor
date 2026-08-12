import type { AIOpportunity } from '../types';

const EUR = (low: number, high: number) => ({
  currency: '€',
  low,
  high,
  period: 'per year',
});

/**
 * The eight highest-ranked opportunities, ordered by estimated annual value.
 *
 * Arithmetic note (deliberate — executives check this):
 * the six HIGH-priority opportunities below sum to exactly €480K–€720K,
 * which is the headline figure on the results dashboard.
 *   180 + 90 + 70 + 60 + 45 + 35 = 480
 *   260 + 140 + 110 + 90 + 70 + 50 = 720
 */
export const OPPORTUNITIES: AIOpportunity[] = [
  {
    id: 'opp-customer-service',
    rank: 1,
    title: 'Customer Service Automation',
    domain: 'Customer Operations',
    summary:
      'A high volume of inbound tickets follows a small number of repeatable patterns that an AI worker can triage, draft and summarise.',
    priority: 'HIGH',
    complexity: 'MEDIUM',
    value: EUR(180, 260),
    timeline: '8–12 weeks',
    currentSituation: [
      '80 customer service employees',
      '~4,000 tickets per month',
      'High percentage of repetitive inquiries',
      'First response time varies by queue and shift',
    ],
    aiCapabilities: [
      'Ticket classification',
      'Knowledge retrieval',
      'First-response drafting',
      'Status updates',
      'Escalation detection',
      'Internal case summaries',
    ],
    humanResponsibilities: [
      'Complex cases',
      'Exceptions',
      'Escalations',
      'Final approval',
    ],
    affectedDepartments: ['Customer Operations'],
    relatedSystemIds: ['salesforce', 'zendesk', 'microsoft-365'],
    recommendedWorkerId: 'worker-customer-operations',
  },
  {
    id: 'opp-email-operations',
    rank: 2,
    title: 'Email Operations',
    domain: 'Customer Operations',
    summary:
      'Shared inboxes are read, sorted and routed by hand. This is the lowest-friction place to put an AI worker into production.',
    priority: 'HIGH',
    complexity: 'LOW',
    value: EUR(90, 140),
    timeline: '4–6 weeks',
    currentSituation: [
      'Several shared inboxes triaged manually',
      'Routing depends on individual experience',
      'Requests are re-typed into Salesforce and Zendesk',
    ],
    aiCapabilities: [
      'Inbox triage and prioritisation',
      'Intent and urgency classification',
      'Routing to the right team',
      'Structured extraction into the CRM',
      'Draft replies for standard requests',
    ],
    humanResponsibilities: [
      'Sensitive or contractual correspondence',
      'Anything the classifier flags as low confidence',
      'Sending on behalf of the company',
    ],
    affectedDepartments: ['Customer Operations', 'Sales', 'Finance'],
    relatedSystemIds: ['microsoft-365', 'salesforce', 'zendesk'],
    recommendedWorkerId: 'worker-email-operations',
  },
  {
    id: 'opp-knowledge-management',
    rank: 3,
    title: 'Knowledge Management',
    domain: 'Cross-functional',
    summary:
      'Answers live in documents, tickets and people. Time spent searching is one of the largest invisible costs in the organisation.',
    priority: 'HIGH',
    complexity: 'MEDIUM',
    value: EUR(70, 110),
    timeline: '6–10 weeks',
    currentSituation: [
      'Knowledge spread across SharePoint, Zendesk and local drives',
      'New joiners take months to become productive',
      'The same questions are answered repeatedly',
    ],
    aiCapabilities: [
      'Unified retrieval across systems',
      'Cited answers with source links',
      'Draft procedure and policy summaries',
      'Detection of outdated or conflicting content',
      'Onboarding question answering',
    ],
    humanResponsibilities: [
      'Ownership of source-of-truth content',
      'Approval of published procedures',
      'Resolving conflicting guidance',
    ],
    affectedDepartments: ['Customer Operations', 'Operations', 'HR', 'IT'],
    relatedSystemIds: ['microsoft-365', 'zendesk', 'jira'],
    recommendedWorkerId: 'worker-knowledge',
  },
  {
    id: 'opp-document-processing',
    rank: 4,
    title: 'Document Processing',
    domain: 'Back Office',
    summary:
      'Orders, service reports and supplier documents are read by people and re-keyed into SAP. Structured extraction removes most of that handling.',
    priority: 'HIGH',
    complexity: 'MEDIUM',
    value: EUR(60, 90),
    timeline: '8–10 weeks',
    currentSituation: [
      'Inbound documents arrive as PDF and email attachments',
      'Manual re-keying into SAP',
      'Errors surface late, in invoicing',
    ],
    aiCapabilities: [
      'Document classification',
      'Field extraction and validation',
      'Matching against orders and contracts',
      'Exception flagging with reasons',
    ],
    humanResponsibilities: [
      'Exception handling',
      'Approving anything above value thresholds',
      'Supplier disputes',
    ],
    affectedDepartments: ['Finance', 'Operations'],
    relatedSystemIds: ['sap', 'microsoft-365'],
  },
  {
    id: 'opp-quality-assurance',
    rank: 5,
    title: 'Quality Assurance',
    domain: 'Operations',
    summary:
      'QA today is a sample of a few percent of cases. An AI worker can review every case and escalate only what looks wrong.',
    priority: 'MEDIUM',
    complexity: 'LOW',
    value: EUR(50, 80),
    timeline: '4–8 weeks',
    currentSituation: [
      'Manual sampling of a small share of interactions',
      'Inconsistent scoring between reviewers',
      'Findings arrive too late to correct the case',
    ],
    aiCapabilities: [
      '100% review coverage instead of sampling',
      'Consistent scoring against your criteria',
      'Trend and root-cause summaries',
      'Real-time flagging of at-risk cases',
    ],
    humanResponsibilities: [
      'Setting and owning quality criteria',
      'Coaching conversations',
      'Disputed scores',
    ],
    affectedDepartments: ['Customer Operations', 'Operations'],
    relatedSystemIds: ['zendesk', 'salesforce'],
    recommendedWorkerId: 'worker-quality-assurance',
  },
  {
    id: 'opp-field-scheduling',
    rank: 6,
    title: 'Field Service Scheduling',
    domain: 'Operations',
    summary:
      'Planning technician work across three markets is done by experienced planners under time pressure. AI can propose the plan; planners keep the decision.',
    priority: 'HIGH',
    complexity: 'HIGH',
    value: EUR(45, 70),
    timeline: '12–16 weeks',
    currentSituation: [
      '150 operations staff scheduled across France, Germany and Belgium',
      'Re-planning happens by phone and spreadsheet',
      'Travel time is not systematically optimised',
    ],
    aiCapabilities: [
      'Draft schedules from open work orders',
      'Re-planning proposals when jobs slip',
      'Skills and certification matching',
      'Customer notification drafting',
    ],
    humanResponsibilities: [
      'Approving the plan',
      'Union, safety and working-time rules',
      'Customer commitments',
    ],
    affectedDepartments: ['Operations'],
    relatedSystemIds: ['sap', 'microsoft-365'],
  },
  {
    id: 'opp-sales-research',
    rank: 7,
    title: 'Sales Research',
    domain: 'Commercial',
    summary:
      'Account preparation is manual and inconsistent. An AI worker can produce a standard briefing pack before every meeting.',
    priority: 'MEDIUM',
    complexity: 'MEDIUM',
    value: EUR(40, 70),
    timeline: '6–8 weeks',
    currentSituation: [
      '35 sales staff preparing accounts individually',
      'Research quality varies by person',
      'CRM records are updated after the fact, if at all',
    ],
    aiCapabilities: [
      'Account and contact briefings',
      'Historical service-history summaries',
      'Renewal and expansion signal detection',
      'Draft CRM updates after meetings',
    ],
    humanResponsibilities: [
      'Commercial judgement and pricing',
      'Relationship ownership',
      'Anything customer-facing',
    ],
    affectedDepartments: ['Sales'],
    relatedSystemIds: ['salesforce', 'microsoft-365'],
  },
  {
    id: 'opp-invoice-order',
    rank: 8,
    title: 'Invoice & Order Processing',
    domain: 'Finance',
    summary:
      'A narrow, well-bounded finance workflow with clear rules — a good second deployment once the pattern is proven.',
    priority: 'HIGH',
    complexity: 'LOW',
    value: EUR(35, 50),
    timeline: '4–6 weeks',
    currentSituation: [
      'Invoice queries handled by a 20-person finance team',
      'Order confirmations produced manually',
      'Month-end creates a recurring backlog',
    ],
    aiCapabilities: [
      'Invoice query triage and answering',
      'Three-way match checking',
      'Order confirmation drafting',
      'Backlog prioritisation',
    ],
    humanResponsibilities: [
      'Payment release',
      'Credit notes and write-offs',
      'Anything with a contractual exception',
    ],
    affectedDepartments: ['Finance'],
    relatedSystemIds: ['sap', 'microsoft-365'],
  },
];

/** Total identified during analysis; the map shows the highest-ranked subset. */
export const TOTAL_OPPORTUNITIES_IDENTIFIED = 17;
