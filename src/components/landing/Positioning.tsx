import { Close, Check } from '../ui/Icons';

const NOT = [
  'Another AI chatbot',
  'Just an AI agent builder',
  'Just an AI readiness assessment',
];

const IS = [
  'An advisor that connects business strategy to AI execution',
  'A value model your CFO can interrogate',
  'A direct path into Smooth Operator for deployment',
];

const FLOW = ['Business', 'Work', 'Value', 'Operating model', 'AI workforce', 'Execution'];

export function Positioning() {
  return (
    <section className="bg-brand-900 text-white">
      <div className="mx-auto max-w-[1360px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-white/45">Positioning</p>
            <h2 className="display-2 mt-4 text-white text-balance">
              We are not selling you AI agents.
            </h2>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/65 text-pretty">
              We understand the company and its work, determine where AI should
              be applied and why, quantify the potential value, recommend the
              right AI workers — and then connect those workers to Smooth
              Operator so something actually goes live.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-3">
              {FLOW.map((f, i) => (
                <div key={f} className="flex items-center gap-2">
                  <span className="rounded-md border border-white/12 bg-white/6 px-2.5 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-white/85">
                    {f}
                  </span>
                  {i < FLOW.length - 1 && (
                    <span aria-hidden className="text-white/25">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-6">
              <p className="eyebrow text-white/40">What this is not</p>
              <ul className="mt-4 space-y-3">
                {NOT.map((n) => (
                  <li key={n} className="flex items-start gap-2.5">
                    <Close className="mt-0.5 size-4 shrink-0 text-white/30" />
                    <span className="text-[14px] leading-snug text-white/55 line-through decoration-white/20">
                      {n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[14px] border border-accent/25 bg-accent/[0.07] p-6">
              <p className="eyebrow text-accent-100/80">What this is</p>
              <ul className="mt-4 space-y-3">
                {IS.map((n) => (
                  <li key={n} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent-100" />
                    <span className="text-[14px] leading-snug text-white/90">
                      {n}
                    </span>
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
