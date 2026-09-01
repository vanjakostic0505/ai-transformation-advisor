import { useEffect, useRef, useState } from 'react';
import type { AIWorker, HandoffArtefact, SmoothOperatorHandoff } from '../../types';
import { Button, Modal, StatusLabel } from '../ui';
import { ArrowRight, Check, Spark } from '../ui/Icons';
import {
  buildHandoffArtefacts,
  packageWorkerForSmoothOperator,
} from '../../engine/smoothOperator';
import { cn } from '../../utils/cn';

/**
 * Packaging a worker concept for delivery.
 *
 * Each artefact shows both what the assessment can supply and what discovery
 * still has to establish. The gap between those two is the honest answer to
 * "is this ready to build?" — and it is the reason the destination is a draft
 * for pilot design rather than a production configuration.
 */
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
    <Modal open onClose={onClose} labelledBy="handoff-title" wide onDark>
      <div className="on-dark relative overflow-hidden rounded-t-2xl border-b border-line bg-brand-900 px-6 py-7 sm:px-9">
        <div
          aria-hidden
          className="grid-field pointer-events-none absolute inset-0 opacity-[0.35] invert"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2.5 pr-10">
            <p className="eyebrow text-white/50">Delivery handoff · demonstration</p>
            <StatusLabel tone="inverse">Draft for pilot design</StatusLabel>
          </div>

          <h2 id="handoff-title" className="display-3 mt-3 text-white text-balance">
            {done
              ? 'Draft prepared for pilot design in Smooth Operator'
              : 'Preparing a draft for Smooth Operator'}
          </h2>

          <p className="mt-2 text-[13.5px] text-white/65">
            {worker.name}
            {handoff && (
              <span className="numeral ml-2 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11.5px] text-white/75">
                {handoff.draftReference}
              </span>
            )}
          </p>

          <div
            className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/15"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Packaging progress"
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 sm:px-9">
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
                  !ready && !active && 'opacity-40',
                )}
              >
                <span
                  aria-hidden
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
                    <>
                      <span className="mt-0.5 block animate-fade-in text-[12.5px] leading-snug text-muted">
                        {a.detail}
                      </span>
                      <span className="mt-1 block animate-fade-in text-[12px] leading-snug text-high">
                        Still to establish: {a.outstanding}
                      </span>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-[12px] leading-relaxed text-faint">
            Prototype only. No agent is created and no systems are connected.
            This demonstrates the handoff a delivery platform would receive
            after a pilot has been designed.
          </p>
          <div className="flex shrink-0 gap-2.5">
            <Button variant="quiet" size="sm" onClick={onClose}>
              Back to map
            </Button>
            <Button
              disabled={!done}
              onClick={() => handoff && onOpenSmoothOperator(handoff)}
              iconLeft={<Spark aria-hidden className="size-4" />}
              iconRight={<ArrowRight aria-hidden className="size-4" />}
            >
              Open in Smooth Operator
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
