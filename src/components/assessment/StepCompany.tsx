import { Field, Select, TextInput } from '../ui';
import { StepHeader } from './StepHeader';
import {
  BUSINESS_MODELS,
  INDUSTRIES,
  MARKETS,
  REVENUE_BANDS,
} from '../../data/catalogs';
import { useAdvisor } from '../../state/AdvisorProvider';
import { cn } from '../../utils/cn';

export function StepCompany() {
  const { input, actions, fieldErrors, showErrors } = useAdvisor();
  const { company } = input;
  const err = (key: string) => (showErrors ? fieldErrors[key] : undefined);

  return (
    <div>
      <StepHeader
        step="Step 01 of 06 · Company"
        title="Tell us about your company"
        description="This sets the scale of every estimate that follows. Nothing is stored on a server — the prototype keeps everything in your browser."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Company name"
          required
          error={err('company-name')}
          className="sm:col-span-2"
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              value={company.name}
              placeholder="e.g. Nordic Industrial Services"
              onChange={(e) => actions.updateCompany({ name: e.target.value })}
            />
          )}
        </Field>

        <Field label="Industry" required error={err('company-industry')}>
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              value={company.industry}
              placeholder="Select an industry"
              options={INDUSTRIES}
              onChange={(e) => actions.updateCompany({ industry: e.target.value })}
            />
          )}
        </Field>

        <Field label="Primary business model">
          {({ id }) => (
            <Select
              id={id}
              value={company.businessModel}
              placeholder="Select a model"
              options={BUSINESS_MODELS}
              onChange={(e) =>
                actions.updateCompany({ businessModel: e.target.value })
              }
            />
          )}
        </Field>

        <Field
          label="Number of employees"
          required
          hint="A rough figure is fine — it only sets the scale."
          error={err('company-employees')}
        >
          {({ id, describedBy, invalid }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              invalid={invalid}
              type="number"
              min={1}
              inputMode="numeric"
              value={company.employeeCount || ''}
              placeholder="420"
              onChange={(e) =>
                actions.updateCompany({
                  employeeCount: Number(e.target.value) || 0,
                })
              }
            />
          )}
        </Field>

        <Field label="Annual revenue" hint="Optional. Bands only — no exact figure needed.">
          {({ id, describedBy }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              value={company.annualRevenue}
              placeholder="Select a band"
              options={REVENUE_BANDS}
              onChange={(e) =>
                actions.updateCompany({ annualRevenue: e.target.value })
              }
            />
          )}
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2.5 block text-[13px] font-medium text-ink-soft">
            Countries / markets
          </legend>
          <div className="flex flex-wrap gap-2">
            {MARKETS.map((m) => {
              const active = company.markets.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={active}
                  onClick={() => actions.toggleMarket(m)}
                  className={cn(
                    'h-11 rounded-lg border px-3.5 text-[13.5px] font-medium transition-all duration-200',
                    active
                      ? 'border-brand bg-brand text-white'
                      : 'border-line-strong bg-surface text-ink-soft hover:border-brand-400 hover:text-brand',
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
