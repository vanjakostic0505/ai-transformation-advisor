import type { AIWorker, SmoothOperatorHandoff } from '../../types';
import { Button, StatusLabel } from '../ui';
import {
  ArrowLeft,
  Check,
  Document,
  Gauge,
  Layers,
  Shield,
  Spark,
  Target,
  Users,
} from '../ui/Icons';

const ICONS: Record<string, React.ReactNode> = {
  'role-definition': <Users />,
  instructions: <Document />,
  knowledge: <Layers />,
  tools: <Gauge />,
  'approval-rules': <Shield />,
  evaluation: <Target />,
};

/**
 * Placeholder destination for "Open in Smooth Operator".
 *
 * In production this would redirect into the Smooth Operator workspace using
 * the draft id returned by the handoff API. The screen deliberately opens on
 * what is still outstanding rather than on a completion message: the draft is
 * a starting point for pilot design, not a finished configuration.
 */
export function SmoothOperatorScreen({
  handoff,
  worker,
  onBack,
}: {
  handoff: SmoothOperatorHandoff;
  worker: AIWorker;
  onBack: () => void;
}) {
  return (
    <div className="on-dark relative min-h-[calc(100dvh-68px)] overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden
        className="grid-field pointer-events-none absolute inset-0 opacity-30 invert"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-[380px] w-[720px] rounded-full bg-accent/12 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1100px] px-5 py-12 sm:px-8 lg:py-16">
        <Button
          variant="quiet"
          size="sm"
          onClick={onBack}
          iconLeft={<ArrowLeft aria-hidden className="size-4" />}
          className="-ml-3 text-white/65 hover:text-white"
        >
          Return to your AI Transformation Map
        </Button>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-accent-100"
              >
                <Spark className="size-[18px]" />
              </span>
              <p className="eyebrow text-white/50">Smooth Operator</p>
              <StatusLabel tone="inverse">Draft for pilot design</StatusLabel>
            </div>

            <h1 className="display-1 mt-5 text-white text-balance">
              {worker.name}
            </h1>

            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/70 text-pretty">
              The concept has arrived as a draft. It is not a configuration
              ready to run — each section below still carries work that
              discovery and pilot design have to complete.
            </p>
          </div>

          <div className="shrink-0 rounded-[14px] border border-white/15 bg-white/[0.06] p-5">
            <p className="eyebrow text-white/45">Draft reference</p>
            <p className="numeral mt-2 text-[17px] font-semibold text-white">
              {handoff.draftReference}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-white/60">
              Six artefacts transferred.
              <br />
              Six still require validation.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {handoff.artefacts.map((a, i) => (
            <div
              key={a.id}
              className="flex animate-fade-up flex-col rounded-[14px] border border-white/12 bg-white/[0.05] p-5 transition-colors duration-250 hover:border-white/25 hover:bg-white/[0.08]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-lg border border-white/12 bg-white/8 text-white/75"
                >
                  <span className="[&>svg]:size-4">{ICONS[a.id]}</span>
                </span>
                <Check aria-hidden className="size-4 text-accent-100" strokeWidth={2.4} />
              </div>

              <p className="mt-4 text-[14px] font-semibold tracking-[-0.015em] text-white">
                {a.label}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">
                {a.detail}
              </p>

              <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-relaxed text-accent-100/85">
                <span className="font-semibold">Outstanding:</span> {a.outstanding}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[14px] border border-white/12 bg-white/[0.05] p-6 sm:p-7">
          <p className="eyebrow text-white/45">
            What would happen next, if a pilot is approved
          </p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Complete discovery and confirm the measured baseline',
              'Clear the data, security and commercial gates',
              'Configure to the agreed design and connect systems',
              'Run in shadow mode, then supervised live operation',
            ].map((s, i) => (
              <li key={s} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="numeral mt-px flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-[11px] font-semibold text-white/70"
                >
                  {i + 1}
                </span>
                <span className="text-[13px] leading-snug text-white/80">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-6 text-[12.5px] leading-relaxed text-white/50">
          Prototype placeholder. No Smooth Operator integration is active — this
          screen demonstrates where a handoff would arrive and what state it
          would arrive in.
        </p>
      </div>
    </div>
  );
}
