import type { AIWorker } from '../../types';
import { Button, SectionHeading, StatusLabel } from '../ui';
import { ArrowRight, Spark } from '../ui/Icons';

const STEPS = [
  {
    title: 'Validate',
    body: 'An advisor tests the assumptions in this map against your reality, and discards what does not survive.',
  },
  {
    title: 'Discover',
    body: 'A short sprint replaces assumed volumes and handling times with measured baselines from your own systems.',
  },
  {
    title: 'Make the case',
    body: 'Finance agrees the value model, the cost, the risk and the criteria for proceeding — or for stopping.',
  },
  {
    title: 'Pilot under control',
    body: 'A deliberately narrow scope, run in shadow mode first, measured against the agreed baseline throughout.',
  },
];

/**
 * Where Smooth Operator is introduced — and deliberately not before.
 *
 * The advisory work is ValueShore-led and delivery-agnostic. A delivery
 * platform is a means of building whatever the pilot design turns out to
 * require, and naming it earlier would imply the answer was decided before
 * the question was asked.
 */
export function DeliverySection({
  candidateWorker,
  onPreviewHandoff,
  onValidate,
}: {
  candidateWorker: AIWorker;
  onPreviewHandoff: () => void;
  onValidate: () => void;
}) {
  return (
    <section id="delivery" className="scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8 lg:py-20">
        <SectionHeading
          eyebrow="From strategy to delivery"
          title="What would have to happen before anything is built"
          description="Nothing in this map is ready for production. Production follows discovery, a validated business case and a controlled pilot — in that order, with a decision point at each step."
        />

        <ol className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="rounded-[14px] border border-line bg-surface p-5"
            >
              <span
                aria-hidden
                className="numeral flex size-8 items-center justify-center rounded-lg border border-line bg-canvas text-[12.5px] font-semibold text-brand"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.02em] text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted text-pretty">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Smooth Operator introduced here, at the delivery step */}
        <div className="mt-6 rounded-[14px] border border-line bg-surface p-6 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand"
                >
                  <Spark className="size-[18px]" />
                </span>
                <p className="eyebrow">Possible delivery route</p>
                <StatusLabel tone="quiet">Prototype demonstration</StatusLabel>
              </div>

              <h3 className="display-3 mt-4 text-ink text-balance">
                Smooth Operator, if a pilot goes ahead
              </h3>

              <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-muted text-pretty">
                Where a validated pilot calls for an AI worker, Smooth Operator
                is one route to building and running it — it can take a worker
                design and turn it into a configured, monitored, operating
                agent. Whether it is the right route here is a decision taken
                after discovery and pilot design, alongside the build-versus-buy
                and integration questions, not one this assessment settles.
              </p>

              <p className="mt-3 max-w-2xl text-[12.5px] leading-relaxed text-faint">
                The preview below is a demonstration of what that handoff would
                contain. No agent is created and no systems are connected.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-canvas/70 p-5">
              <p className="text-[12px] font-semibold tracking-[0.05em] text-muted uppercase">
                Most likely first candidate
              </p>
              <p className="mt-2 text-[15.5px] font-semibold tracking-[-0.02em] text-ink">
                {candidateWorker.name}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
                Lowest complexity of the four concepts, which makes it the
                cheapest way to find out whether any of this works.
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={onValidate} className="w-full">
                  Validate this opportunity map
                </Button>
                <Button
                  variant="secondary"
                  onClick={onPreviewHandoff}
                  className="w-full"
                  iconRight={<ArrowRight aria-hidden className="size-3.5" />}
                >
                  Preview the Smooth Operator handoff
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
