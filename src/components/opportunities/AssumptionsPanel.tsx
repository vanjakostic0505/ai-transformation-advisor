import { useId } from 'react';
import type { AIOpportunity, ValueDriver } from '../../types';
import { ConfidenceMeter, ProvenanceLegend, ProvenanceTag } from '../ui/Evidence';
import { Button } from '../ui';
import { formatDriverValue, formatNumber, formatFte, formatValueRange } from '../../utils/format';
import { resolveDrivers } from '../../engine/valueModel';
import { cn } from '../../utils/cn';

/**
 * "Assumptions behind this estimate".
 *
 * This is the panel that turns a number into an argument. Every driver is
 * shown with its value, where it came from and why it is set where it is —
 * and the important ones can be changed, with the estimate recalculating as
 * you move them.
 *
 * The point of making them editable is not convenience. It is that an
 * executive who disagrees with an assumption can see immediately how much
 * their disagreement is worth, which is a far more productive conversation
 * than arguing about the headline figure.
 */

function DriverRow({
  driver,
  overridden,
  onChange,
}: {
  driver: ValueDriver;
  overridden: boolean;
  onChange: (value: number) => void;
}) {
  const id = useId();

  return (
    <li className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
        <label
          htmlFor={id}
          className="text-[13.5px] font-semibold tracking-[-0.01em] text-ink"
        >
          {driver.label}
        </label>
        <div className="flex items-center gap-2">
          {overridden && (
            <span className="rounded border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-semibold tracking-[0.04em] text-brand uppercase">
              Adjusted
            </span>
          )}
          <ProvenanceTag provenance={driver.provenance} />
        </div>
      </div>

      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{driver.note}</p>

      <div className="mt-3 flex items-center gap-3.5">
        <input
          id={id}
          type="range"
          min={driver.min}
          max={driver.max}
          step={driver.step}
          value={driver.value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuetext={`${formatDriverValue(driver.value, driver.format)} ${driver.unit}`}
          className={cn(
            'h-11 min-w-0 flex-1 cursor-pointer appearance-none bg-transparent',
            // Track
            '[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-line-strong',
            '[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-line-strong',
            // Thumb — 20px, comfortably grabbable on a touch screen
            '[&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(14,17,22,0.3)]',
            '[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand',
          )}
        />
        <output
          htmlFor={id}
          className="numeral w-[104px] shrink-0 text-right text-[14px] font-semibold text-ink"
        >
          {formatDriverValue(driver.value, driver.format)}
        </output>
      </div>
      <p className="mt-0.5 text-right text-[11.5px] text-faint">{driver.unit}</p>
    </li>
  );
}

function ChainStep({
  label,
  value,
  sub,
  emphasis,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border p-3.5',
        emphasis ? 'border-brand-200 bg-brand-50/60' : 'border-line bg-canvas/60',
      )}
    >
      <p className="text-[11.5px] leading-snug text-muted">{label}</p>
      <p
        className={cn(
          'numeral mt-1.5 text-[16px] leading-none font-semibold',
          emphasis ? 'text-brand' : 'text-ink',
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-[11px] text-faint">{sub}</p>}
    </div>
  );
}

export function AssumptionsPanel({
  opportunity,
  overrides,
  onDriverChange,
  onReset,
}: {
  opportunity: AIOpportunity;
  overrides: Record<string, number> | undefined;
  onDriverChange: (driverId: string, value: number) => void;
  onReset: () => void;
}) {
  const { valueModel, computed } = opportunity;
  const drivers = resolveDrivers(valueModel, overrides);
  const adjusted = Object.keys(overrides ?? {}).length > 0;

  return (
    <section className="border-t border-line pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-[14px] font-semibold tracking-[-0.015em] text-ink">
          Assumptions behind this estimate
        </h3>
        {adjusted && (
          <Button variant="quiet" size="sm" onClick={onReset} className="-mr-2">
            Reset to defaults
          </Button>
        )}
      </div>

      <p className="mt-2 text-[13px] leading-relaxed text-muted text-pretty">
        {valueModel.method}
      </p>

      <ConfidenceMeter confidence={computed.confidence} showMeaning className="mt-4" />

      {/* The calculation, shown as a chain rather than asserted as a total */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <ChainStep
          label="Hours in scope each year"
          value={formatNumber(computed.annualHoursInScope)}
          sub="before any reductions"
        />
        <ChainStep
          label="Hours plausibly saved"
          value={formatNumber(computed.annualHoursSaved)}
          sub={`${formatFte(computed.fteEquivalent)} equivalent`}
        />
        <ChainStep
          label="Point estimate"
          value={`€${formatNumber(computed.point)}K`}
          sub="before the uncertainty band"
        />
        <ChainStep
          label="Published range"
          value={formatValueRange(computed.range)}
          sub={`± ${Math.round(valueModel.uncertaintyBand * 100)}%, rounded to €5K`}
          emphasis
        />
      </div>

      <ul className="mt-6">
        {drivers.map((driver) => (
          <DriverRow
            key={driver.id}
            driver={driver}
            overridden={typeof overrides?.[driver.id] === 'number'}
            onChange={(value) => onDriverChange(driver.id, value)}
          />
        ))}
      </ul>

      <div className="mt-5 rounded-xl border border-line bg-canvas/60 p-4">
        <p className="text-[12px] font-semibold tracking-[0.04em] text-muted uppercase">
          Where these numbers come from
        </p>
        <ProvenanceLegend className="mt-3" />
      </div>

      <div className="mt-4 rounded-xl border border-high/25 bg-high-bg/60 p-4">
        <h4 className="text-[13px] font-semibold text-ink">
          What a discovery sprint would establish
        </h4>
        <ul className="mt-2.5 space-y-1.5">
          {opportunity.validationRequired.map((v) => (
            <li key={v} className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-[7px] size-1.5 shrink-0 rounded-full bg-high/50"
              />
              <span className="text-[13px] leading-relaxed text-ink-soft">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
