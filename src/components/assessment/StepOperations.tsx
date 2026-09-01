import { StepHeader } from './StepHeader';
import { SelectableTile, GroupError } from '../ui';
import { CustomEntryRow } from './CustomEntryRow';
import { PROCESS_CATALOG } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';

const GROUPS = ['Customer', 'Operations', 'Insight', 'Commercial'];

export function StepOperations() {
  const { input, actions, fieldErrors, showErrors } = useAdvisor();
  const { processes } = input;
  const error = showErrors ? fieldErrors['operations-selection'] : undefined;
  const selectedCount =
    processes.selectedProcessIds.length + processes.customProcesses.length;

  return (
    <div>
      <StepHeader
        step="Step 03 of 06 · Operations"
        title="Where does your team spend time?"
        description="Select the activities that consume meaningful hours across the organisation. These become the raw material for the indicative opportunity map."
      />

      <div className="space-y-7">
        {GROUPS.map((group) => (
          <fieldset key={group}>
            <legend className="eyebrow mb-3">{group}</legend>
            <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {PROCESS_CATALOG.filter((p) => p.group === group).map((p) => (
                <SelectableTile
                  key={p.id}
                  label={p.label}
                  hint={p.hint}
                  selected={processes.selectedProcessIds.includes(p.id)}
                  onToggle={() => actions.toggleProcess(p.id)}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <GroupError id="operations-error">{error}</GroupError>}

      <CustomEntryRow
        label="Add your own process"
        placeholder="e.g. Warranty claim handling"
        entries={processes.customProcesses}
        onAdd={actions.addCustomProcess}
        onRemove={(value) =>
          actions.updateProcesses({
            customProcesses: processes.customProcesses.filter((c) => c !== value),
          })
        }
      />

      <p className="mt-4 text-[12.5px] text-muted" aria-live="polite">
        {selectedCount} {selectedCount === 1 ? 'activity' : 'activities'} selected
      </p>
    </div>
  );
}
