import type { AIWorker, SmoothOperatorHandoff } from '../../types';
import { Badge, Button, Disclaimer } from '../ui';
import { ArrowLeft, Check, Document, Gauge, Shield, Spark, Target, Users } from '../ui/Icons';

const ICONS: Record<string, React.ReactNode> = {
  'role-definition': <Users />,
  instructions: <Document />,
  knowledge: <Layers />,
  tools: <Gauge />,
  'approval-rules': <Shield />,
  evaluation: <Target />,
};

function Layers() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="m10 2.8 7 3.6-7 3.6-7-3.6 7-3.6Z" />
      <path d="m3 10.4 7 3.6 7-3.6M3 14.1l7 3.6 7-3.6" />
    </svg>
  );
}

/**
 * Placeholder destination for "Open in Smooth Operator".
 * In production this would be a redirect to the Smooth Operator workspace
 * using the draft id returned by the handoff API.
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
    <div className="relative min-h-[calc(100dvh-68px)] overflow-hidden bg-brand-900 text-white">
      <div aria-hidden className="grid-field pointer-events-none absolute inset-0 opacity-30 invert" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-[380px] w-[720px] rounded-full bg-accent/12 blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1100px] px-5 py-14 sm:px-8 lg:py-20">
        <Button
          variant="quiet"
          size="sm"
          onClick={onBack}
          iconLeft={<ArrowLeft className="size-4" />}
          className="-ml-3 text-white/55 hover:text-white"
        >
          Return to your AI Transformation Map
        </Button>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl border border-white/12 bg-white/8 text-accent">
                <Spark className="size-[18px]" />
              </span>
              <p className="eyebrow text-white/45">Smooth Operator</p>
            </div>
            <h1 className="display-1 mt-5 text-white text-balance">
              {worker.name}
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/60 text-pretty">
              Your AI worker has arrived as a draft configuration. From here,
              Smooth Operator handles build, connection, evaluation and
              operation.
            </p>
          </div>

          <div className="shrink-0 rounded-[14px] border border-white/12 bg-white/[0.05] p-5">
            <p className="eyebrow text-white/40">Draft reference</p>
            <p className="numeral mt-2 text-[17px] font-semibold text-white">
              {handoff.draftReference}
            </p>
            <Badge tone="accent" className="mt-3 border-accent/30 bg-accent/12 text-accent-100">
              <Check className="size-3" strokeWidth={3} />
              Ready for configuration
            </Badge>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {handoff.artefacts.map((a, i) => (
            <div
              key={a.id}
              className="animate-fade-up rounded-[14px] border border-white/10 bg-white/[0.04] p-5 transition-colors duration-250 hover:border-white/20 hover:bg-white/[0.07]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/6 text-white/70">
                  <span className="[&>svg]:size-4">{ICONS[a.id]}</span>
                </span>
                <Check className="size-4 text-accent" strokeWidth={2.4} />
              </div>
              <p className="mt-4 text-[14px] font-semibold tracking-[-0.015em] text-white">
                {a.label}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/50">
                {a.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[14px] border border-white/10 bg-white/[0.04] p-6 sm:p-7">
          <p className="eyebrow text-white/40">Next in Smooth Operator</p>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Connect systems and credentials',
              'Load knowledge sources and test retrieval',
              'Run in shadow mode against live volume',
              'Go supervised-live with approval rules on',
            ].map((s, i) => (
              <li key={s} className="flex items-start gap-2.5">
                <span className="numeral mt-px flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-[11px] font-semibold text-white/60">
                  {i + 1}
                </span>
                <span className="text-[13px] leading-snug text-white/75">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <Disclaimer className="mt-6 text-white/35">
          Prototype placeholder. No Smooth Operator integration is active — this
          screen demonstrates the destination of the handoff.
        </Disclaimer>
      </div>
    </div>
  );
}
