import type { AIWorker } from '../types';

const EUR = (low: number, high: number) => ({
  currency: '€',
  low,
  high,
  period: 'per year',
});

/**
 * The recommended AI workforce. Each worker delivers one or more opportunities
 * from `opportunities.ts` — the link is kept in `sourceOpportunityIds` so the
 * value figures on this screen always reconcile with the opportunity map.
 *
 * Combined value: €390K–€590K (a subset of the €480K–€720K high-priority pool;
 * the remaining opportunities are sequenced into later waves).
 */
export const WORKERS: AIWorker[] = [
  {
    id: 'worker-customer-operations',
    name: 'Customer Operations Worker',
    role: 'Front-line ticket handling and customer correspondence',
    description:
      'Works the ticket queue alongside your Customer Operations team. Classifies, researches and drafts — a human sends.',
    handles: [
      'Ticket triage',
      'Customer responses',
      'Knowledge retrieval',
      'Case summaries',
      'Escalation detection',
    ],
    systems: ['Salesforce', 'Zendesk', 'Knowledge Base', 'Email'],
    value: EUR(180, 260),
    complexity: 'MEDIUM',
    oversight: 'MEDIUM',
    humanInTheLoop: [
      'Agent reviews and sends every customer-facing reply in the first phase',
      'Automatic escalation on low confidence or detected dissatisfaction',
      'No commitments on price, contract or compensation',
    ],
    successMetrics: [
      'First response time',
      'Share of tickets resolved without escalation',
      'Draft acceptance rate',
      'CSAT held flat or better',
    ],
    sourceOpportunityIds: ['opp-customer-service'],
  },
  {
    id: 'worker-email-operations',
    name: 'Email Operations Worker',
    role: 'Shared inbox triage, routing and structured capture',
    description:
      'Reads the shared inboxes, decides what each message is, routes it and writes the record into the CRM. The fastest route to a first production deployment.',
    handles: [
      'Inbox triage',
      'Intent and urgency classification',
      'Routing and assignment',
      'Structured CRM capture',
      'Standard reply drafting',
    ],
    systems: ['Microsoft 365', 'Salesforce', 'Zendesk'],
    value: EUR(90, 140),
    complexity: 'LOW',
    oversight: 'LOW',
    humanInTheLoop: [
      'Owner review of routing rules weekly',
      'Low-confidence messages go to a human queue',
      'Sensitive senders are never auto-handled',
    ],
    successMetrics: [
      'Time-to-route',
      'Routing accuracy vs. human baseline',
      'Manual re-keying hours removed',
    ],
    sourceOpportunityIds: ['opp-email-operations'],
  },
  {
    id: 'worker-knowledge',
    name: 'Knowledge Worker',
    role: 'Retrieval, citation and knowledge upkeep across systems',
    description:
      'Answers internal questions with citations, and keeps your procedures honest by flagging content that has gone stale or contradicts itself.',
    handles: [
      'Cross-system retrieval',
      'Cited answers for staff',
      'Procedure summarisation',
      'Stale and conflicting content detection',
      'Onboarding support',
    ],
    systems: ['Microsoft 365 / SharePoint', 'Zendesk', 'Jira'],
    value: EUR(70, 110),
    complexity: 'MEDIUM',
    oversight: 'MEDIUM',
    humanInTheLoop: [
      'Named content owners approve published procedures',
      'Answers always carry sources so staff can verify',
      'No external-facing answers in phase one',
    ],
    successMetrics: [
      'Search-to-answer time',
      'Answer usefulness rating',
      'Time-to-productivity for new joiners',
    ],
    sourceOpportunityIds: ['opp-knowledge-management'],
  },
  {
    id: 'worker-quality-assurance',
    name: 'Quality Assurance Worker',
    role: 'Full-coverage case review against your quality criteria',
    description:
      'Replaces sampling with complete coverage. Reviews every case, scores it consistently and escalates only what looks wrong.',
    handles: [
      '100% case review',
      'Consistent scoring',
      'At-risk case flagging',
      'Trend and root-cause reporting',
    ],
    systems: ['Zendesk', 'Salesforce'],
    value: EUR(50, 80),
    complexity: 'LOW',
    oversight: 'LOW',
    humanInTheLoop: [
      'Quality criteria are defined and owned by team leads',
      'Scores are advisory input to coaching, never automated performance action',
      'Agents can dispute any score',
    ],
    successMetrics: [
      'Review coverage',
      'Scoring consistency vs. human reviewers',
      'Repeat-defect rate',
    ],
    sourceOpportunityIds: ['opp-quality-assurance'],
  },
];
