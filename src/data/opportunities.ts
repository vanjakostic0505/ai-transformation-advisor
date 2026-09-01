import type { AIOpportunity, Provenance, ValueDriver } from '../types';

/** Fixtures carry everything except the derived figures, which the engine computes. */
export type OpportunitySeed = Omit<AIOpportunity, 'value' | 'computed'>;

/* ------------------------------------------------------------------ */
/* Driver constructors                                                 */
/*                                                                     */
/* Every euro figure in the product is built from these. Keeping them  */
/* as small functions means the label, the units and the explanation   */
/* stay consistent across all eight opportunities.                     */
/* ------------------------------------------------------------------ */

const volumePerMonth = (value: number, note: string): ValueDriver => ({
  id: 'volume-per-month',
  label: 'Work volume',
  value,
  format: 'count',
  unit: 'items per month',
  provenance: 'needs-validation',
  note,
  editable: true,
  min: 0,
  max: 50000,
  step: 100,
});

const minutesPerItem = (value: number, note: string): ValueDriver => ({
  id: 'minutes-per-item',
  label: 'Current handling time',
  value,
  format: 'minutes',
  unit: 'per item',
  provenance: 'needs-validation',
  note,
  editable: true,
  min: 0.5,
  max: 240,
  step: 0.5,
});

const peopleInvolved = (
  value: number,
  provenance: Provenance,
  note: string,
): ValueDriver => ({
  id: 'people-involved',
  label: 'People involved',
  value,
  format: 'count',
  unit: 'people',
  provenance,
  note,
  editable: true,
  min: 1,
  max: 2000,
  step: 1,
});

const hoursPerWeek = (value: number, note: string): ValueDriver => ({
  id: 'hours-per-week',
  label: 'Time spent on this activity',
  value,
  format: 'hours',
  unit: 'per person per week',
  provenance: 'needs-validation',
  note,
  editable: true,
  min: 0.5,
  max: 40,
  step: 0.5,
});

const addressableShare = (value: number, note: string): ValueDriver => ({
  id: 'addressable-share',
  label: 'Repetitive / addressable share',
  value,
  format: 'percent',
  unit: 'of that work',
  provenance: 'illustrative',
  note,
  editable: true,
  min: 5,
  max: 95,
  step: 1,
});

const timeSavingShare = (value: number, note: string): ValueDriver => ({
  id: 'time-saving-share',
  label: 'Expected time saving',
  value,
  format: 'percent',
  unit: 'of the addressable work',
  provenance: 'illustrative',
  note,
  editable: true,
  min: 5,
  max: 90,
  step: 1,
});

const adoptionShare = (value: number, note: string): ValueDriver => ({
  id: 'adoption-share',
  label: 'Expected adoption / utilisation',
  value,
  format: 'percent',
  unit: 'in practice',
  provenance: 'illustrative',
  note,
  editable: true,
  min: 10,
  max: 100,
  step: 1,
});

const reworkAdjustment = (value: number, note: string): ValueDriver => ({
  id: 'rework-adjustment',
  label: 'Quality / rework adjustment',
  value,
  format: 'percent',
  unit: 'deducted for checking and correction',
  provenance: 'illustrative',
  note,
  editable: true,
  min: 0,
  max: 50,
  step: 1,
});

const loadedHourlyCost = (value: number, note: string): ValueDriver => ({
  id: 'loaded-hourly-cost',
  label: 'Loaded labour cost',
  value,
  format: 'currency-hour',
  unit: 'per hour',
  provenance: 'illustrative',
  note,
  editable: true,
  min: 15,
  max: 200,
  step: 1,
});

const TRANSACTION_METHOD =
  'Volume × handling time gives the hours in scope. That figure is then reduced four times — by the share of work AI can address, the time actually saved, real-world adoption, and an allowance for checking and rework — before being valued at the loaded hourly cost.';

const TIME_SHARE_METHOD =
  'People × hours per week × 46 working weeks gives the hours in scope. That figure is then reduced four times — by the share of work AI can address, the time actually saved, real-world adoption, and an allowance for checking and rework — before being valued at the loaded hourly cost.';

/* ------------------------------------------------------------------ */
/* The eight highest-ranked potential opportunities                    */
/* ------------------------------------------------------------------ */

export const OPPORTUNITY_SEEDS: OpportunitySeed[] = [
  {
    id: 'opp-customer-service',
    rank: 1,
    title: 'Customer Service Automation',
    domain: 'Customer Operations',
    summary:
      'A high volume of inbound tickets appears to follow a small number of repeatable patterns that an AI worker could triage, research and draft.',
    priority: 'HIGH',
    complexity: 'MEDIUM',
    timeline: '8–12 weeks after discovery',
    currentSituation: [
      '80 customer service employees, from your workforce answers',
      'Ticket volume and handling time are assumed, not measured',
      'The repetitive-inquiry share is an illustrative sector default',
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
      'Final approval before anything reaches a customer',
    ],
    affectedDepartments: ['Customer Operations'],
    relatedSystemIds: ['salesforce', 'zendesk', 'microsoft-365'],
    recommendedWorkerId: 'worker-customer-operations',
    validationRequired: [
      'Pull twelve months of actual ticket volume from Zendesk and Salesforce',
      'Measure real average handling time, split by queue and ticket type',
      'Sample 200 tickets to establish the genuinely repetitive share',
      'Confirm the loaded cost per agent hour with Finance',
      'Agree what "resolved without escalation" means before it is measured',
    ],
    valueModel: {
      basis: 'transaction',
      confidence: 'LOW',
      uncertaintyBand: 0.18,
      method: TRANSACTION_METHOD,
      drivers: [
        volumePerMonth(
          4000,
          'Assumed from 80 service staff at typical industrial-services ticket loads. Not taken from your systems.',
        ),
        minutesPerItem(
          22,
          'Sector default for mixed technical and administrative tickets. Your actual figure may differ substantially.',
        ),
        addressableShare(
          58,
          'Typical share of tickets repeatable enough for AI to draft. Varies widely with product complexity.',
        ),
        timeSavingShare(
          60,
          'Time removed on the addressable portion. Assumes an agent still reads and sends every reply.',
        ),
        adoptionShare(
          80,
          'Allows for agents overriding or ignoring drafts, particularly in the first months.',
        ),
        reworkAdjustment(
          5,
          'Deduction for corrections and quality checks on AI output.',
        ),
        loadedHourlyCost(
          48,
          'Illustrative fully loaded cost for service staff in France, Germany and Belgium. Confirm with Finance.',
        ),
      ],
    },
  },
  {
    id: 'opp-email-operations',
    rank: 2,
    title: 'Email Operations',
    domain: 'Customer Operations',
    summary:
      'Shared inboxes are read, sorted and routed by hand. Of the opportunities indicated, this is the lowest-friction candidate for a first controlled pilot.',
    priority: 'HIGH',
    complexity: 'LOW',
    timeline: '4–6 weeks after discovery',
    currentSituation: [
      'Several shared inboxes triaged manually',
      'Routing depends on individual experience',
      'Requests appear to be re-typed into Salesforce and Zendesk',
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
    validationRequired: [
      'Export 90 days of shared-inbox traffic to establish real volume',
      'Time a sample of triage decisions rather than estimating them',
      'Identify which senders and topics must never be handled automatically',
      'Confirm the Microsoft 365 access scope with IT and Security',
    ],
    valueModel: {
      basis: 'transaction',
      confidence: 'LOW',
      uncertaintyBand: 0.21,
      method: TRANSACTION_METHOD,
      drivers: [
        volumePerMonth(
          10000,
          'Assumed shared-inbox traffic across customer operations, sales and finance. Not measured.',
        ),
        minutesPerItem(
          4.5,
          'Assumed time to read, classify, route and record one message.',
        ),
        addressableShare(
          65,
          'Share of messages following recognisable patterns. Higher than for tickets, because triage is a narrower decision.',
        ),
        timeSavingShare(
          55,
          'A human still reviews routing decisions in the first phase, so the saving is partial.',
        ),
        adoptionShare(80, 'Allows for messages pulled back into the manual queue.'),
        reworkAdjustment(4, 'Deduction for correcting mis-routed messages.'),
        loadedHourlyCost(48, 'Illustrative loaded cost. Confirm with Finance.'),
      ],
    },
  },
  {
    id: 'opp-knowledge-management',
    rank: 3,
    title: 'Knowledge Management',
    domain: 'Cross-functional',
    summary:
      'Answers appear to live in documents, tickets and people. Time spent searching is one of the largest costs that never appears as a budget line.',
    priority: 'HIGH',
    complexity: 'MEDIUM',
    timeline: '6–10 weeks after discovery',
    currentSituation: [
      'Knowledge reportedly spread across SharePoint, Zendesk and local drives',
      'Time spent searching is estimated, not measured',
      'Knowledge accessibility scored low in your readiness answers',
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
    validationRequired: [
      'Run a two-week search-time diary with a representative sample of staff',
      'Audit how much content is current, owned and non-contradictory',
      'Establish document-level access rules before any indexing begins',
      'Agree with Security what may be retrieved, and by whom',
    ],
    valueModel: {
      basis: 'time-share',
      confidence: 'MEDIUM',
      uncertaintyBand: 0.22,
      method: TIME_SHARE_METHOD,
      drivers: [
        peopleInvolved(
          180,
          'user',
          'Derived from the office-based functions in your workforce answers: customer operations, sales, finance, HR, IT and management.',
        ),
        hoursPerWeek(
          2.4,
          'Assumed time per person spent looking for information. The widely cited industry range is 1.5–5 hours; this sits at the conservative end.',
        ),
        addressableShare(
          45,
          'Share of searches a retrieval system could answer. The rest need human judgement, or do not exist in writing.',
        ),
        timeSavingShare(
          35,
          'Deliberately modest: finding an answer faster does not remove the work that follows it.',
        ),
        adoptionShare(
          65,
          'Knowledge tools are frequently under-used. This assumes roughly two-thirds genuine uptake.',
        ),
        reworkAdjustment(5, 'Deduction for verifying cited answers.'),
        loadedHourlyCost(
          48,
          'Blended illustrative loaded cost across office functions. Confirm with Finance.',
        ),
      ],
    },
  },
  {
    id: 'opp-document-processing',
    rank: 4,
    title: 'Document Processing',
    domain: 'Back Office',
    summary:
      'Orders, service reports and supplier documents appear to be read by people and re-keyed into SAP. Structured extraction could remove most of that handling.',
    priority: 'HIGH',
    complexity: 'MEDIUM',
    timeline: '8–10 weeks after discovery',
    currentSituation: [
      'Inbound documents arrive as PDFs and email attachments',
      'Manual re-keying into SAP is reported',
      'Document volume is assumed, not measured',
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
    validationRequired: [
      'Count actual inbound document volume by type over a full month',
      'Establish the current error and rework rate as a baseline',
      'Confirm that SAP write access is feasible and permitted',
      'Agree the value thresholds above which a human must approve',
    ],
    valueModel: {
      basis: 'transaction',
      confidence: 'LOW',
      uncertaintyBand: 0.21,
      method: TRANSACTION_METHOD,
      drivers: [
        volumePerMonth(
          2600,
          'Assumed inbound document volume across finance and operations.',
        ),
        minutesPerItem(10, 'Assumed time to read, validate and key one document.'),
        addressableShare(
          70,
          'Structured documents suit extraction well; free-form correspondence does not.',
        ),
        timeSavingShare(
          60,
          'Assumes a human still reviews extracted fields before posting.',
        ),
        adoptionShare(75, 'Allows for document types that fall out of scope in practice.'),
        reworkAdjustment(
          8,
          'Higher than elsewhere, because extraction errors surface late, at invoicing.',
        ),
        loadedHourlyCost(
          48,
          'Illustrative loaded cost for back-office staff. Confirm with Finance.',
        ),
      ],
    },
  },
  {
    id: 'opp-quality-assurance',
    rank: 5,
    title: 'Quality Assurance',
    domain: 'Operations',
    summary:
      'QA today appears to be a small sample of cases. An AI worker could review every case and escalate only what looks wrong.',
    priority: 'MEDIUM',
    complexity: 'LOW',
    timeline: '4–8 weeks after discovery',
    currentSituation: [
      'Manual sampling of a small share of interactions',
      'Reviewer headcount and time are assumed, not confirmed',
      'Scoring consistency between reviewers is unmeasured',
    ],
    aiCapabilities: [
      'Full review coverage instead of sampling',
      'Consistent scoring against your criteria',
      'Trend and root-cause summaries',
      'Flagging of at-risk cases while they are still open',
    ],
    humanResponsibilities: [
      'Setting and owning quality criteria',
      'Coaching conversations',
      'Disputed scores',
    ],
    affectedDepartments: ['Customer Operations', 'Operations'],
    relatedSystemIds: ['zendesk', 'salesforce'],
    recommendedWorkerId: 'worker-quality-assurance',
    validationRequired: [
      'Confirm how many people spend how long on QA today',
      'Establish current inter-reviewer scoring variance as a baseline',
      'Agree with HR, and any works council, how AI scoring may and may not be used',
      'Define what counts as a defect before anything is counted',
    ],
    valueModel: {
      basis: 'time-share',
      confidence: 'LOW',
      uncertaintyBand: 0.22,
      method: TIME_SHARE_METHOD,
      drivers: [
        peopleInvolved(
          4,
          'illustrative',
          'Assumed QA reviewers across customer operations and operations. Not collected in the assessment.',
        ),
        hoursPerWeek(16, 'Assumed review time per reviewer per week.'),
        addressableShare(
          85,
          'Scoring against defined criteria is highly automatable; coaching is not.',
        ),
        timeSavingShare(70, 'The scoring pass largely disappears; interpretation does not.'),
        adoptionShare(80, 'Assumes human reviewers still spot-check AI scores.'),
        reworkAdjustment(5, 'Deduction for disputed and re-reviewed scores.'),
        loadedHourlyCost(48, 'Illustrative loaded cost. Confirm with Finance.'),
      ],
    },
  },
  {
    id: 'opp-field-scheduling',
    rank: 6,
    title: 'Field Service Scheduling',
    domain: 'Operations',
    summary:
      'Planning technician work across three markets is done by experienced planners under time pressure. AI could propose the plan; planners would keep the decision.',
    priority: 'HIGH',
    complexity: 'HIGH',
    timeline: '12–16 weeks after discovery',
    currentSituation: [
      '150 operations staff across France, Germany and Belgium, from your answers',
      'Planner headcount and planning time are assumed',
      'Re-planning reportedly happens by phone and spreadsheet',
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
    validationRequired: [
      'Confirm how many planners there are and how they spend their week',
      'Establish whether scheduling data is complete enough to plan against',
      'Review working-time and collective agreements before any automation',
      'Confirm SAP scheduling data can be read reliably',
    ],
    valueModel: {
      basis: 'time-share',
      confidence: 'LOW',
      uncertaintyBand: 0.25,
      method: TIME_SHARE_METHOD,
      drivers: [
        peopleInvolved(
          10,
          'illustrative',
          'Assumed planners and dispatchers within the 150-person operations function.',
        ),
        hoursPerWeek(
          24,
          'Assumed share of a planner week spent building and rebuilding schedules.',
        ),
        addressableShare(
          50,
          'Much of planning is negotiation and judgement that AI cannot take over.',
        ),
        timeSavingShare(40, 'Deliberately low. AI proposes; a planner still decides.'),
        adoptionShare(
          60,
          'Planners frequently override optimisation tools. This assumes substantial override.',
        ),
        reworkAdjustment(
          10,
          'The highest in the set, reflecting re-planning when proposals do not survive contact with reality.',
        ),
        loadedHourlyCost(
          48,
          'Illustrative loaded cost for planning staff. Confirm with Finance.',
        ),
      ],
    },
  },
  {
    id: 'opp-sales-research',
    rank: 7,
    title: 'Sales Research',
    domain: 'Commercial',
    summary:
      'Account preparation appears manual and inconsistent. An AI worker could produce a standard briefing pack before every meeting.',
    priority: 'MEDIUM',
    complexity: 'MEDIUM',
    timeline: '6–8 weeks after discovery',
    currentSituation: [
      '35 sales staff, from your workforce answers',
      'Preparation time per person is assumed, not measured',
      'CRM record quality is unknown',
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
    validationRequired: [
      'Confirm actual preparation time with a sample of the sales team',
      'Assess whether Salesforce data is complete enough to brief from',
      'Decide whether time saved converts to revenue, or simply to capacity',
    ],
    valueModel: {
      basis: 'time-share',
      confidence: 'MEDIUM',
      uncertaintyBand: 0.27,
      method: TIME_SHARE_METHOD,
      drivers: [
        peopleInvolved(
          35,
          'user',
          'Taken directly from the Sales headcount in your workforce answers.',
        ),
        hoursPerWeek(
          3.5,
          'Assumed preparation and research time per salesperson per week.',
        ),
        addressableShare(
          60,
          'Gathering and summarising is automatable; qualifying and judging is not.',
        ),
        timeSavingShare(50, 'A salesperson still reads and adapts every briefing.'),
        adoptionShare(
          60,
          'Sales adoption of new tooling is typically uneven. Deliberately conservative.',
        ),
        reworkAdjustment(
          8,
          'Deduction for correcting briefings built on stale CRM data.',
        ),
        loadedHourlyCost(
          48,
          'Illustrative loaded cost. Sales cost per hour is often higher — confirm with Finance.',
        ),
      ],
    },
  },
  {
    id: 'opp-invoice-order',
    rank: 8,
    title: 'Invoice & Order Processing',
    domain: 'Finance',
    summary:
      'A narrow, well-bounded finance workflow with clear rules — a plausible second pilot once the pattern is proven elsewhere.',
    priority: 'HIGH',
    complexity: 'LOW',
    timeline: '4–6 weeks after discovery',
    currentSituation: [
      '20 finance employees, from your workforce answers',
      'Query and order volumes are assumed, not measured',
      'A month-end backlog is reported but not quantified',
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
    validationRequired: [
      'Extract actual query and order volumes from SAP',
      'Confirm segregation-of-duties rules with Finance and Audit',
      'Establish which checks may never be delegated to software',
    ],
    valueModel: {
      basis: 'transaction',
      confidence: 'LOW',
      uncertaintyBand: 0.18,
      method: TRANSACTION_METHOD,
      drivers: [
        volumePerMonth(
          1800,
          'Assumed combined invoice-query and order-confirmation volume.',
        ),
        minutesPerItem(8, 'Assumed handling time per item.'),
        addressableShare(75, 'Rule-bounded finance work suits automation well.'),
        timeSavingShare(60, 'Assumes a human still approves before anything is posted.'),
        adoptionShare(80, 'Allows for exceptions routed straight to a person.'),
        reworkAdjustment(5, 'Deduction for corrections found at reconciliation.'),
        loadedHourlyCost(
          52,
          'Illustrative loaded cost for finance staff, slightly above the operations blend.',
        ),
      ],
    },
  },
];

/**
 * Total potential opportunities indicated during analysis. The map shows the
 * highest-ranked subset; the remainder are lower-value and would be revisited
 * after the first wave has been validated.
 */
export const TOTAL_OPPORTUNITIES_INDICATED = 17;
