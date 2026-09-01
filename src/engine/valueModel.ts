import type {
  ComputedValue,
  ValueDriver,
  ValueModel,
  ValueRange,
} from '../types';

/**
 * ---------------------------------------------------------------------------
 * THE VALUE MODEL
 * ---------------------------------------------------------------------------
 * Every euro figure in this product is produced here, from named drivers that
 * are visible to the user. There are no hard-coded money values anywhere else.
 *
 * The arithmetic, in words:
 *
 *   annual hours in scope
 *     transaction basis : volume per month × 12 × minutes per item ÷ 60
 *     time-share basis  : people × hours per week × working weeks
 *
 *   annual hours saved
 *     = hours in scope
 *       × addressable share      (how much of the work AI could touch at all)
 *       × time saving            (how much of that time actually goes away)
 *       × adoption               (how much of it is used in practice)
 *       × (1 − rework adjustment) (verification and correction overhead)
 *
 *   point estimate = hours saved × loaded hourly cost
 *   published range = point ± uncertainty band, rounded to the nearest €5K
 *
 * The multiplicative chain matters. It is why these numbers are smaller than
 * the ones consultancies usually quote: each factor is a haircut, and four
 * optimistic-looking factors compound into a realistic one.
 */

/** Productive hours per person per year, after leave and non-productive time. */
export const PRODUCTIVE_HOURS_PER_FTE = 1600;

/** Working weeks per year, after leave and public holidays. */
export const WORKING_WEEKS = 46;

export function driverValue(
  model: ValueModel,
  id: string,
  overrides?: Record<string, number>,
): number {
  const override = overrides?.[id];
  if (typeof override === 'number' && Number.isFinite(override)) return override;
  const driver = model.drivers.find((d) => d.id === id);
  return driver ? driver.value : 0;
}

/** Drivers with any user overrides applied. Used for display. */
export function resolveDrivers(
  model: ValueModel,
  overrides?: Record<string, number>,
): ValueDriver[] {
  return model.drivers.map((d) =>
    typeof overrides?.[d.id] === 'number' ? { ...d, value: overrides[d.id] } : d,
  );
}

export function hasOverrides(overrides?: Record<string, number>): boolean {
  return !!overrides && Object.keys(overrides).length > 0;
}

/** Round to the nearest €5K so the range never implies false precision. */
function roundToNearest5(value: number): number {
  return Math.max(0, Math.round(value / 5) * 5);
}

export function computeValue(
  model: ValueModel,
  overrides?: Record<string, number>,
): ComputedValue {
  const get = (id: string) => driverValue(model, id, overrides);

  const annualHoursInScope =
    model.basis === 'transaction'
      ? (get('volume-per-month') * 12 * get('minutes-per-item')) / 60
      : get('people-involved') * get('hours-per-week') * WORKING_WEEKS;

  const annualHoursSaved =
    annualHoursInScope *
    (get('addressable-share') / 100) *
    (get('time-saving-share') / 100) *
    (get('adoption-share') / 100) *
    (1 - get('rework-adjustment') / 100);

  const pointEuros = annualHoursSaved * get('loaded-hourly-cost');
  const point = pointEuros / 1000;

  const range: ValueRange = {
    currency: '€',
    low: roundToNearest5(point * (1 - model.uncertaintyBand)),
    high: roundToNearest5(point * (1 + model.uncertaintyBand)),
    period: 'per year',
  };

  return {
    annualHoursInScope: Math.round(annualHoursInScope),
    annualHoursSaved: Math.round(annualHoursSaved),
    fteEquivalent: annualHoursSaved / PRODUCTIVE_HOURS_PER_FTE,
    point,
    range,
    confidence: model.confidence,
  };
}

/**
 * Confidence of a set of estimates taken together — the weakest link, not the
 * average. A portfolio is only as trustworthy as its softest assumption.
 */
export function aggregateConfidence(
  levels: ComputedValue['confidence'][],
): ComputedValue['confidence'] {
  if (levels.includes('LOW')) return 'LOW';
  if (levels.includes('MEDIUM')) return 'MEDIUM';
  return 'HIGHER';
}

/** Counts of where the numbers came from, for the provenance summary. */
export function provenanceBreakdown(model: ValueModel) {
  const counts = { user: 0, illustrative: 0, 'needs-validation': 0 };
  for (const d of model.drivers) counts[d.provenance] += 1;
  return counts;
}
