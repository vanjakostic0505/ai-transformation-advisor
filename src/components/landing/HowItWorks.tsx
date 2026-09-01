import { SectionHeading } from '../ui';
import { Building, Gauge, Layers, Spark } from '../ui/Icons';

const STAGES = [
  {
    icon: <Building />,
    step: 'Step 01',
    title: 'Understand the business',
    body: 'We start with your workforce, your processes, your systems and what you are actually trying to achieve — not with a list of AI features.',
    points: [
      'Workforce structure',
      'Operational activities',
      'Technology environment',
      'Business objectives',
    ],
  },
  {
    icon: <Gauge />,
    step: 'Step 02',
    title: 'Indicate where AI might create value',
    body: 'Potential opportunities are provisionally ranked by indicative annual value, business priority and implementation complexity — to create an initial sequence for expert validation.',
    points: [
      'Opportunities indicated',
      'Value modelled from visible assumptions',
      'Provisional ranking',
      'Complexity assessment',
    ],
  },
  {
    icon: <Layers />,
    step: 'Step 03',
    title: 'Show the working',
    body: 'Every figure is built from named drivers you can inspect and change. You can see which numbers came from your answers, which are illustrative defaults, and which have to be measured.',
    points: [
      'Assumptions behind every estimate',
      'Confidence levels, capped at "higher"',
      'What still requires validation',
      'Adjust an assumption, watch the case move',
    ],
  },
  {
    icon: <Spark />,
    step: 'Step 04',
    title: 'Set up the next conversation',
    body: 'The output is a shortlist worth investigating and a specific next action. Production comes later — after discovery, a validated business case and a controlled pilot.',
    points: [
      'Human / AI work split',
      'Approval points and oversight',
      'Gates before any pilot',
      'A defensible next step',
    ],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-line bg-surface">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <SectionHeading
          eyebrow="How it works"
          title="Business first. AI second."
          description="Most AI projects start with a tool and look for a problem. This works the other way around — and it is honest about the distance between an indicative map and something running in production."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((s) => (
            <div
              key={s.step}
              className="flex flex-col rounded-[14px] border border-line bg-canvas/60 p-6 transition-colors duration-250 hover:border-line-strong hover:bg-canvas"
            >
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-brand"
              >
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

        <p className="mt-8 max-w-3xl text-[13.5px] leading-relaxed text-muted text-pretty">
          Production follows discovery, business-case validation and a
          controlled pilot — in that order. This assessment is the first step of
          that sequence, not a substitute for it.
        </p>
      </div>
    </section>
  );
}
