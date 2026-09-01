import type { AIWorker } from '../types';

/** Value and confidence are derived from the source opportunities by the engine. */
export type WorkerSeed = Omit<AIWorker, 'value' | 'confidence'>;

/**
 * Provisional AI worker concepts.
 *
 * These are concepts, not specifications. Each one describes a shape of work
 * that the opportunity analysis suggests could be delegated — what it would
 * actually do, what it must never do, and what has to be true before it could
 * become a controlled pilot.
 *
 * Nothing here is ready to build. The `pilotPrerequisites` on each concept are
 * the honest gap between an indicative assessment and a deployable design.
 */
export const WORKER_SEEDS: WorkerSeed[] = [
  {
    id: 'worker-customer-operations',
    name: 'Customer Operations Worker',
    role: 'Front-line ticket handling and customer correspondence',
    description:
      'Would work the ticket queue alongside your Customer Operations team: classifying, researching and drafting, with a person sending.',
    handles: [
      'Ticket triage',
      'Customer responses',
      'Knowledge retrieval',
      'Case summaries',
      'Escalation detection',
    ],
    systems: ['Salesforce', 'Zendesk', 'Knowledge base', 'Email'],
    complexity: 'MEDIUM',
    oversight: 'MEDIUM',
    humanInTheLoop: [
      'An agent reviews and sends every customer-facing reply in the first phase',
      'Automatic escalation on low confidence, or on detected dissatisfaction',
      'No commitments on price, contract or compensation',
    ],
    successMetrics: [
      'First response time',
      'Share of tickets resolved without escalation',
      'Draft acceptance rate',
      'Customer satisfaction held flat or better',
    ],
    pilotPrerequisites: [
      'A measured baseline for handling time and first response time',
      'A named process owner in Customer Operations who can approve the scope',
      'Agreement on which ticket types are in scope for the pilot',
      'Data and security review of Salesforce and Zendesk access',
      'A defined stopping rule: what result would end the pilot',
    ],
    sourceOpportunityIds: ['opp-customer-service'],
  },
  {
    id: 'worker-email-operations',
    name: 'Email Operations Worker',
    role: 'Shared inbox triage, routing and structured capture',
    description:
      'Would read the shared inboxes, decide what each message is, route it and write the record into the CRM. On the evidence available, the least complex candidate for a first pilot.',
    handles: [
      'Inbox triage',
      'Intent and urgency classification',
      'Routing and assignment',
      'Structured CRM capture',
      'Standard reply drafting',
    ],
    systems: ['Microsoft 365', 'Salesforce', 'Zendesk'],
    complexity: 'LOW',
    oversight: 'LOW',
    humanInTheLoop: [
      'An owner reviews routing rules weekly',
      'Low-confidence messages go to a human queue',
      'Sensitive senders are never handled automatically',
    ],
    successMetrics: [
      'Time to route',
      'Routing accuracy against the human baseline',
      'Manual re-keying hours removed',
    ],
    pilotPrerequisites: [
      'A measured baseline for current routing time and accuracy',
      'An agreed list of senders and topics excluded from automation',
      'Microsoft 365 access scope approved by IT and Security',
      'A named owner for the routing rules',
    ],
    sourceOpportunityIds: ['opp-email-operations'],
  },
  {
    id: 'worker-knowledge',
    name: 'Knowledge Worker',
    role: 'Retrieval, citation and knowledge upkeep across systems',
    description:
      'Would answer internal questions with citations, and keep procedures honest by flagging content that has gone stale or contradicts itself.',
    handles: [
      'Cross-system retrieval',
      'Cited answers for staff',
      'Procedure summarisation',
      'Detection of stale and conflicting content',
      'Onboarding support',
    ],
    systems: ['Microsoft 365 / SharePoint', 'Zendesk', 'Jira'],
    complexity: 'MEDIUM',
    oversight: 'MEDIUM',
    humanInTheLoop: [
      'Named content owners approve published procedures',
      'Answers always carry sources, so staff can verify them',
      'No externally facing answers in the first phase',
    ],
    successMetrics: [
      'Search-to-answer time',
      'Answer usefulness rating',
      'Time to productivity for new joiners',
    ],
    pilotPrerequisites: [
      'A content audit: what is current, owned and non-contradictory',
      'Document-level access rules agreed with Security before indexing',
      'Named content owners for each knowledge domain in scope',
      'A measured baseline for how long staff currently spend searching',
    ],
    sourceOpportunityIds: ['opp-knowledge-management'],
  },
  {
    id: 'worker-quality-assurance',
    name: 'Quality Assurance Worker',
    role: 'Full-coverage case review against your quality criteria',
    description:
      'Would replace sampling with complete coverage: reviewing every case, scoring it consistently and escalating only what looks wrong.',
    handles: [
      'Full case review',
      'Consistent scoring',
      'Flagging of at-risk cases',
      'Trend and root-cause reporting',
    ],
    systems: ['Zendesk', 'Salesforce'],
    complexity: 'LOW',
    oversight: 'LOW',
    humanInTheLoop: [
      'Quality criteria are defined and owned by team leads',
      'Scores are advisory input to coaching, never automated performance action',
      'Any agent can dispute any score',
    ],
    successMetrics: [
      'Review coverage',
      'Scoring consistency against human reviewers',
      'Repeat-defect rate',
    ],
    pilotPrerequisites: [
      'Written quality criteria that reviewers already agree on',
      'Consultation with HR, and any works council, on the use of AI scoring',
      'A measured baseline for current inter-reviewer variance',
      'An agreed dispute route for contested scores',
    ],
    sourceOpportunityIds: ['opp-quality-assurance'],
  },
];
