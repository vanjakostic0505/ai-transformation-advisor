import { StepHeader } from './StepHeader';
import { SelectableTile } from '../ui';
import { OBJECTIVE_CATALOG } from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';

export function StepObjectives() {
  const { input, actions } = useAdvisor();
  const selected = input.objectives.selectedObjectiveIds;

  return (
    <div>
      <StepHeader
        step="Step 05 of 06 · Objectives"
        title="What are you trying to achieve?"
        description="Objectives change the ranking, not just the narrative. An organisation optimising for response time gets a different sequence than one optimising for cost."
      />

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

      <p className="mt-4 text-[12.5px] text-muted">
        {selected.length} selected · choose as many as apply
      </p>
    </div>
  );
}
