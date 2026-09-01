import type { TransformationMap } from '../../types';
import { Button, Modal, StatusLabel } from '../ui';
import { Check } from '../ui/Icons';
import { formatValueRange } from '../../utils/format';

type Mode = 'validate' | 'pilot';

const CONTENT: Record<
  Mode,
  { eyebrow: string; title: string; intro: string; items: string[]; footer: string }
> = {
  validate: {
    eyebrow: 'Expert validation',
    title: 'Validate this opportunity map',
    intro:
      'A working session with an advisor and your process owners. The purpose is to find out which parts of this map survive contact with your reality — and to discard the parts that do not.',
    items: [
      'Challenge every illustrative assumption behind the leading estimates',
      'Identify which operational baselines can actually be measured, and how',
      'Test the ranking against what your process owners already know',
      'Agree what a discovery sprint would need to establish, and what it would cost',
      'Leave with a shortlist worth investigating — which may be shorter than this one',
    ],
    footer:
      'Typically half a day, with the people who own the work in the room.',
  },
  pilot: {
    eyebrow: 'Controlled pilot',
    title: 'Explore a controlled pilot',
    intro:
      'A pilot is deliberately narrow: one process, a measured baseline, agreed stopping criteria, and a human approving everything that matters. It exists to produce evidence, not to deliver value at scale.',
    items: [
      'A single opportunity, scoped down until it can be measured cleanly',
      'Shadow mode first — the AI worker proposes, nobody acts on it',
      'Then supervised live operation, with approval points in place',
      'Continuous measurement against the pre-agreed baseline',
      'An explicit stopping rule, agreed before the build begins',
    ],
    footer:
      'A pilot only starts once discovery, the business case and the delivery gates are cleared.',
  },
};

/**
 * The advisory CTAs land somewhere honest.
 *
 * In production these would open scheduling or a contact form. Here they
 * explain what the user is actually being offered, which is more useful in a
 * demonstration than a form that goes nowhere.
 */
export function ValidateModal({
  mode,
  map,
  onClose,
}: {
  mode: Mode | null;
  map: TransformationMap;
  onClose: () => void;
}) {
  if (!mode) return null;

  const content = CONTENT[mode];
  const lead = map.opportunities[0];

  return (
    <Modal open onClose={onClose} labelledBy="validate-title">
      <div className="px-6 py-7 sm:px-8">
        <p className="eyebrow">{content.eyebrow}</p>
        <h2
          id="validate-title"
          className="display-3 mt-2.5 pr-8 text-ink text-balance"
        >
          {content.title}
        </h2>

        <p className="mt-3 text-[14px] leading-relaxed text-ink-soft text-pretty">
          {content.intro}
        </p>

        <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
          {content.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-accent-700"
                strokeWidth={2.2}
              />
              <span className="text-[13.5px] leading-relaxed text-ink-soft">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-line bg-canvas/70 p-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusLabel tone="quiet">Starting point</StatusLabel>
            <p className="text-[12.5px] text-muted">
              {lead.title} · {formatValueRange(lead.value)} indicative
            </p>
          </div>
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">
            {content.footer}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-[12px] leading-relaxed text-faint">
            Prototype only. In production this would open scheduling with a
            ValueShore advisor.
          </p>
          <Button onClick={onClose} className="shrink-0">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
