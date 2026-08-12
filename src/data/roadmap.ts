import type { OperatingModel, TransformationRoadmap } from '../types';

export const OPERATING_MODEL: OperatingModel = {
  current: {
    label: 'Current model',
    people: 420,
    aiWorkers: 0,
    metrics: [
      { label: 'People', value: '420' },
      { label: 'Manual workflows', value: 'High' },
      { label: 'Automation', value: 'Limited' },
      { label: 'AI workers', value: '0' },
      { label: 'Knowledge access', value: 'Fragmented' },
      { label: 'Quality coverage', value: 'Sampled' },
    ],
  },
  target: {
    label: 'Target model',
    people: 420,
    aiWorkers: 4,
    metrics: [
      { label: 'People', value: '420' },
      { label: 'AI workers', value: '4', emphasis: true },
      { label: 'AI-augmented workflows', value: '12', emphasis: true },
      { label: 'High-value automation', value: '6', emphasis: true },
      { label: 'Knowledge access', value: 'Unified, cited' },
      { label: 'Quality coverage', value: '100% reviewed' },
    ],
  },
  note: 'AI is designed to augment your workforce, automate repetitive work and allow people to focus on higher-value activities. Headcount is unchanged in this model — capacity is redirected, not removed.',
};

export const ROADMAP: TransformationRoadmap = {
  horizonLabel: 'First 90 days',
  phases: [
    {
      id: 'phase-discover',
      index: 1,
      name: 'Discover',
      objective: 'Identify high-value opportunities',
      activities: [
        'Validate the opportunity map with process owners',
        'Confirm volumes and baselines from source systems',
        'Agree the value model with Finance',
      ],
      startPct: 0,
      endPct: 17,
      window: 'Days 1–15',
    },
    {
      id: 'phase-design',
      index: 2,
      name: 'Design',
      objective: 'Define AI workers and human workflows',
      activities: [
        'Write the role definition and instructions',
        'Map the human approval points',
        'Agree evaluation criteria before anything is built',
      ],
      startPct: 12,
      endPct: 36,
      window: 'Days 10–32',
    },
    {
      id: 'phase-deploy',
      index: 3,
      name: 'Deploy',
      objective: 'Build the first AI worker with Smooth Operator',
      activities: [
        'Configure the worker in Smooth Operator',
        'Connect systems and knowledge sources',
        'Shadow mode, then supervised live operation',
      ],
      startPct: 30,
      endPct: 74,
      window: 'Days 28–67',
    },
    {
      id: 'phase-measure',
      index: 4,
      name: 'Measure',
      objective: 'Track business impact',
      activities: [
        'Compare against the pre-agreed baseline',
        'Review quality and exception rates',
        'Decide what to automate further and what to keep human',
      ],
      startPct: 64,
      endPct: 93,
      window: 'Days 58–84',
    },
    {
      id: 'phase-scale',
      index: 5,
      name: 'Scale',
      objective: 'Expand the AI workforce',
      activities: [
        'Sequence the next two workers',
        'Reuse the proven configuration pattern',
        'Extend oversight and evaluation to the wider workforce',
      ],
      startPct: 86,
      endPct: 100,
      window: 'Day 78 onward',
    },
  ],
};
