import { StepHeader } from './StepHeader';
import { SelectableTile, GroupError } from '../ui';
import { CustomEntryRow } from './CustomEntryRow';
import { SYSTEM_CATALOG } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';

export function StepSystems() {
  const { input, actions, fieldErrors, showErrors } = useAdvisor();
  const { systems } = input;
  const error = showErrors ? fieldErrors['systems-selection'] : undefined;

  return (
    <div>
      <StepHeader
        step="Step 04 of 06 · Systems"
        title="What systems do you use?"
        description="An AI worker is only as useful as the systems it can act in. This indicates which integrations a pilot would need — and which would have to be confirmed as possible."
      />

      <fieldset>
        <legend className="sr-only">Select the systems you use</legend>
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {SYSTEM_CATALOG.map((s) => (
            <SelectableTile
              key={s.id}
              label={s.label}
              hint={s.group}
              selected={systems.selectedSystemIds.includes(s.id)}
              onToggle={() => actions.toggleSystem(s.id)}
            />
          ))}
        </div>
      </fieldset>

      {error && <GroupError id="systems-error">{error}</GroupError>}

      <CustomEntryRow
        label="Add another system"
        placeholder="e.g. In-house field service platform"
        entries={systems.customSystems}
        onAdd={actions.addCustomSystem}
        onRemove={(value) =>
          actions.updateSystems({
            customSystems: systems.customSystems.filter((c) => c !== value),
          })
        }
      />
    </div>
  );
}
