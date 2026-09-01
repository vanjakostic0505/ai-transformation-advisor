import { StepHeader } from './StepHeader';
import { SelectableTile, GroupError } from '../ui';
import { OBJECTIVE_CATALOG } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';

export function StepObjectives() {
  const { input, actions, fieldErrors, showErrors } = useAdvisor();
  const selected = input.objectives.selectedObjectiveIds;
  const error = showErrors ? fieldErrors['objectives-selection'] : undefined;

  return (
    <div>
      <StepHeader
        step="Step 05 of 06 · Objectives"
        title="What are you trying to achieve?"
        description="Objectives change the provisional ranking, not just the narrative. An organisation optimising for response time gets a different sequence from one optimising for cost."
      />

      <fieldset>
        <legend className="sr-only">Select your business objectives</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {OBJECTIVE_CATALOG.map((o) => (
            <SelectableTile
              key={o.id}
              label={o.label}
              hint={o.hint}
              selected={selected.includes(o.id)}
              onToggle={() => actions.toggleObjective(o.id)}
            />
          ))}
        </div>
      </fieldset>

      {error && <GroupError id="objectives-error">{error}</GroupError>}

      <p className="mt-4 text-[12.5px] text-muted" aria-live="polite">
        {selected.length} selected · choose as many as apply
      </p>
    </div>
  );
}
