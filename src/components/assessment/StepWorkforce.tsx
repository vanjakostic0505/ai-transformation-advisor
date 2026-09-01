import { StepHeader } from './StepHeader';
import { Button, GroupError } from '../ui';
import { Close, Plus } from '../ui/Icons';
import { DEPARTMENT_SUGGESTIONS } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';
import { formatNumber } from '../../utils/format';
import { cn } from '../../utils/cn';

export function StepWorkforce() {
  const { input, actions, totalHeadcount, fieldErrors, showErrors } = useAdvisor();
  const declared = input.company.employeeCount;
  const delta = totalHeadcount - declared;
  const err = (key: string) => (showErrors ? fieldErrors[key] : undefined);

  return (
    <div>
      <StepHeader
        step="Step 02 of 06 · Workforce"
        title="Tell us about your workforce"
        description="Where your people sit determines where AI could create capacity. Add, edit or remove departments as needed."
      />

      <div className="overflow-hidden rounded-[14px] border border-line bg-surface">
        <div
          aria-hidden
          className="hidden grid-cols-[1fr_160px_44px] gap-3 border-b border-line bg-canvas/70 px-4 py-2.5 sm:grid"
        >
          <span className="eyebrow text-[10px]">Department / function</span>
          <span className="eyebrow text-[10px]">Employees</span>
          <span />
        </div>

        <ul>
          {input.workforce.units.map((unit, i) => (
            <li
              key={unit.id}
              className="grid grid-cols-[1fr_44px] items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_160px_44px]"
            >
              <input
                list="department-suggestions"
                value={unit.department}
                placeholder="Department name"
                aria-label={`Department name, row ${i + 1}`}
                onChange={(e) =>
                  actions.updateWorkforceUnit(unit.id, {
                    department: e.target.value,
                  })
                }
                className="h-11 w-full rounded-lg border border-transparent bg-transparent px-2.5 text-[14.5px] text-ink transition-colors placeholder:text-faint hover:border-line focus:border-brand focus:bg-surface"
              />

              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={unit.headcount || ''}
                placeholder="0"
                aria-label={`Headcount for ${unit.department || `row ${i + 1}`}`}
                onChange={(e) =>
                  actions.updateWorkforceUnit(unit.id, {
                    headcount: Number(e.target.value) || 0,
                  })
                }
                className="numeral col-start-1 row-start-2 h-11 w-full rounded-lg border border-transparent bg-transparent px-2.5 text-[14.5px] text-ink transition-colors placeholder:text-faint hover:border-line focus:border-brand focus:bg-surface sm:col-start-2 sm:row-start-1"
              />

              <button
                type="button"
                onClick={() => actions.removeWorkforceUnit(unit.id)}
                aria-label={`Remove ${unit.department || `row ${i + 1}`}`}
                className="col-start-2 row-start-1 flex size-11 items-center justify-center justify-self-end rounded-lg text-muted transition-colors hover:bg-high-bg hover:text-high sm:col-start-3"
              >
                <Close aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <datalist id="department-suggestions">
          {DEPARTMENT_SUGGESTIONS.map((d) => (
            <option key={d} value={d} />
          ))}
        </datalist>

        <div className="flex flex-col gap-3 bg-canvas/70 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.addWorkforceUnit}
            iconLeft={<Plus aria-hidden className="size-4" />}
          >
            Add department
          </Button>

          <p className="flex items-baseline gap-2.5">
            <span className="text-[12.5px] text-muted">Total employees</span>
            <span
              className="numeral text-[20px] font-semibold text-ink"
              aria-live="polite"
            >
              {formatNumber(totalHeadcount)}
            </span>
          </p>
        </div>
      </div>

      {err('workforce-total') && (
        <GroupError id="workforce-total-error">{err('workforce-total')}</GroupError>
      )}
      {err('workforce-names') && (
        <GroupError id="workforce-names-error">{err('workforce-names')}</GroupError>
      )}

      {declared > 0 && delta !== 0 && (
        <p
          className={cn(
            'mt-3 text-[12.5px]',
            Math.abs(delta) > declared * 0.1 ? 'text-high' : 'text-muted',
          )}
        >
          {delta > 0
            ? `${formatNumber(delta)} more`
            : `${formatNumber(-delta)} fewer`}{' '}
          than the {formatNumber(declared)} employees given in step 1. The
          analysis will use the departmental total.
        </p>
      )}
    </div>
  );
}
