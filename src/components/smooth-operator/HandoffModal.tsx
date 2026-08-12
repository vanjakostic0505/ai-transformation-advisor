import { useEffect, useRef, useState } from 'react';
import type { AIWorker, HandoffArtefact, SmoothOperatorHandoff } from '../../types';
import { Button, Modal } from '../ui';
import { ArrowRight, Check, Spark } from '../ui/Icons';
import { buildHandoffArtefacts, packageWorkerForSmoothOperator } from '../../engine/smoothOperator';
import { cn } from '../../utils/cn';

export function HandoffModal({
  worker,
  onClose,
  onOpenSmoothOperator,
}: {
  worker: AIWorker | null;
  onClose: () => void;
  onOpenSmoothOperator: (handoff: SmoothOperatorHandoff) => void;
}) {
  const [readyCount, setReadyCount] = useState(0);
  const [handoff, setHandoff] = useState<SmoothOperatorHandoff | null>(null);
  const runId = useRef(0);

  const artefacts: HandoffArtefact[] = worker ? buildHandoffArtefacts(worker) : [];

  useEffect(() => {
    if (!worker) return;
    const id = ++runId.current;
    setReadyCount(0);
    setHandoff(null);

    void packageWorkerForSmoothOperator(worker, (_artefact, index) => {
      if (runId.current === id) setReadyCount(index + 1);
    }).then((result) => {
      if (runId.current === id) setHandoff(result);
    });

    return () => {
      runId.current += 1;
    };
  }, [worker]);

  if (!worker) return null;

  const done = handoff !== null;
  const progress = Math.round((readyCount / artefacts.length) * 100);

  return (
    <Modal open onClose={onClose} labelledBy="handoff-title" wide>
      <div className="relative overflow-hidden rounded-t-2xl border-b border-line bg-brand-900 px-7 py-7 sm:px-9">
        <div
          aria-hidden
          className="grid-field pointer-events-none absolute inset-0 opacity-[0.35] invert"
        />
        <div className="relative">
          <p className="eyebrow text-white/45">Smooth Operator handoff</p>
          <h2
            id="handoff-title"
            className="display-3 mt-2.5 text-white text-balance"
          >
            {done
              ? 'AI Worker ready for configuration in Smooth Operator'
              : 'Moving your AI Worker to Smooth Operator'}
          </h2>
          <p className="mt-2 text-[13.5px] text-white/60">
            {worker.name}
            {handoff && (
              <span className="numeral ml-2 rounded border border-white/15 bg-white/8 px-1.5 py-0.5 text-[11.5px] text-white/70">
                {handoff.draftReference}
              </span>
            )}
          </p>

          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/12">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-7 py-6 sm:px-9">
        <ul className="space-y-1">
          {artefacts.map((a, i) => {
            const ready = i < readyCount;
            const active = i === readyCount && !done;
            return (
              <li
                key={a.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl px-3 py-3 transition-all duration-400',
                  active && 'bg-canvas',
                  !ready && !active && 'opacity-35',
                )}
              >
                <span
                  className={cn(
                    'mt-px flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                    ready
                      ? 'border-accent bg-accent text-white'
                      : 'border-line bg-surface',
                  )}
                >
                  {ready ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : active ? (
                    <span className="size-1.5 animate-pulse rounded-full bg-brand" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] leading-snug font-medium text-ink">
                    {a.label}
                  </span>
                  {ready && (
                    <span className="mt-0.5 block animate-fade-in text-[12.5px] leading-snug text-muted">
                      {a.detail}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-[12px] leading-relaxed text-faint">
            Prototype only. No agent is created and no systems are connected —
            this demonstrates the handoff Smooth Operator would receive.
          </p>
          <div className="flex shrink-0 gap-2.5">
            <Button variant="quiet" size="sm" onClick={onClose}>
              Back to map
            </Button>
            <Button
              disabled={!done}
              onClick={() => handoff && onOpenSmoothOperator(handoff)}
              iconLeft={<Spark className="size-4" />}
              iconRight={<ArrowRight className="size-4" />}
            >
              Open in Smooth Operator
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
