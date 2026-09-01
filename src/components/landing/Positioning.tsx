import { Close, Check } from '../ui/Icons';

const NOT = [
  'Another AI chatbot',
  'Just an AI agent builder',
  'Just an AI readiness assessment',
  'An automated business case',
];

const IS = [
  'An advisor that connects business strategy, workforce design and measurable value',
  'A value model whose every assumption is visible and adjustable',
  'An honest starting point for expert validation and a controlled pilot',
];

const FLOW = [
  'Business',
  'Work',
  'Value',
  'Operating model',
  'AI workforce',
  'Execution',
];

export function Positioning() {
  return (
    <section className="on-dark bg-brand-900 text-white">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-white/50">Positioning</p>
            <h2 className="display-2 mt-4 text-white text-balance">
              We are not selling you AI agents.
            </h2>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/70 text-pretty">
              We start by understanding the company and its work, indicate where
              AI might be applied and why, show the arithmetic behind every
              figure, and then say plainly what would have to be measured before
              any of it could be relied on. Delivery comes later, and only if
              the evidence supports it.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3">
              {FLOW.map((f, i) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="rounded-md border border-white/15 bg-white/8 px-2.5 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-white/90">
                    {f}
                  </span>
                  {i < FLOW.length - 1 && (
                    <span aria-hidden className="text-white/30">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            <div className="rounded-[14px] border border-white/12 bg-white/[0.05] p-6">
              <p className="eyebrow text-white/45">What this is not</p>
              <ul className="mt-4 space-y-3">
                {NOT.map((n) => (
                  <li key={n} className="flex items-start gap-2.5">
                    <Close aria-hidden className="mt-0.5 size-4 shrink-0 text-white/40" />
                    <span className="text-[14px] leading-snug text-white/65">{n}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[14px] border border-accent/30 bg-accent/[0.09] p-6">
              <p className="eyebrow text-accent-100">What this is</p>
              <ul className="mt-4 space-y-3">
                {IS.map((n) => (
                  <li key={n} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-100" />
                    <span className="text-[14px] leading-snug text-white/90">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
