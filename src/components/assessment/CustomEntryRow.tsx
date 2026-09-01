import { useId, useState } from 'react';
import { Button } from '../ui';
import { Close, Plus } from '../ui/Icons';

export function CustomEntryRow({
  label,
  placeholder,
  entries,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  entries: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const id = useId();

  const submit = () => {
    if (!draft.trim()) return;
    onAdd(draft);
    setDraft('');
  };

  return (
    <div className="mt-6 rounded-[14px] border border-dashed border-line-strong bg-surface p-5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">
        {label}
      </label>

      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
        <input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          className="h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[14.5px] text-ink transition-colors placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/10"
        />
        <Button
          variant="secondary"
          onClick={submit}
          disabled={!draft.trim()}
          iconLeft={<Plus aria-hidden className="size-4" />}
          className="shrink-0"
        >
          Add
        </Button>
      </div>

      {entries.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {entries.map((e) => (
            <li key={e}>
              <span className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-50/60 py-1 pr-1 pl-3 text-[13px] font-medium text-brand-900">
                {e}
                <button
                  type="button"
                  onClick={() => onRemove(e)}
                  aria-label={`Remove ${e}`}
                  className="flex size-9 items-center justify-center rounded-md text-brand-400 transition-colors hover:bg-brand-100 hover:text-brand"
                >
                  <Close aria-hidden className="size-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
