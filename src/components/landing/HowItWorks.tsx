import { SectionHeading } from '../ui';
import { Building, Gauge, Layers, Spark } from '../ui/Icons';

const STAGES = [
  {
    icon: <Building />,
    step: 'Step 01',
    title: 'Understand the business',
    body: 'We start with your workforce, your processes, your systems and what you are actually trying to achieve — not with a list of AI features.',
    points: ['Workforce structure', 'Operational activities', 'Technology environment', 'Business objectives'],
  },
  {
    icon: <Gauge />,
    step: 'Step 02',
    title: 'Find where AI creates value',
    body: 'Every opportunity is ranked by estimated annual value, business priority and implementation complexity — so the sequence is defensible.',
    points: ['Opportunity identification', 'Value estimation', 'Priority ranking', 'Complexity assessment'],
  },
  {
    icon: <Layers />,
    step: 'Step 03',
    title: 'Design the operating model',
    body: 'We define which work AI handles, which work stays with people, and where a human decision is required before anything moves.',
    points: ['Human / AI work split', 'Approval points', 'Oversight levels', 'Evaluation criteria'],
  },
  {
    icon: <Spark />,
    step: 'Step 04',
    title: 'Deploy with Smooth Operator',
    body: 'The recommended AI worker is packaged — role, instructions, knowledge, tools, approval rules — and handed to Smooth Operator to build and run.',
    points: ['Role definition', 'Instructions & knowledge', 'Tools & integrations', 'Human approval rules'],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="Business first. AI second."
          description="Most AI projects start with a tool and look for a problem. This works the other way around — and it ends with something running in production."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((s) => (
            <div
              key={s.step}
              className="flex flex-col rounded-[14px] border border-line bg-canvas/60 p-6 transition-colors duration-250 hover:border-line-strong hover:bg-canvas"
            >
              <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-brand">
                <span className="[&>svg]:size-[18px]">{s.icon}</span>
              </span>
              <p className="eyebrow mt-5 text-[10.5px]">{s.step}</p>
              <h3 className="mt-2 text-[16.5px] leading-snug font-semibold tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
                {s.body}
              </p>
              <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
                {s.points.map((p) => (
                  <li key={p} className="text-[12.5px] leading-snug text-ink-soft">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
