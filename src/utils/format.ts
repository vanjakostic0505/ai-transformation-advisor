import type { DriverFormat, ValueDriver, ValueRange } from '../types';

/**
 * '€180K–€260K'. Values are held in thousands.
 *
 * `withPeriod` uses a non-breaking space so the range and its period never
 * split across a line, and never run together as "€180K–€260Kper year".
 */
export function formatValueRange(range: ValueRange, withPeriod = false): string {
  const fmt = (n: number) =>
    n >= 1000
      ? `${range.currency}${(n / 1000).toFixed(1).replace(/\.0$/, '')}M`
      : `${range.currency}${Math.round(n)}K`;
  const base = `${fmt(range.low)}–${fmt(range.high)}`;
  return withPeriod ? `${base} ${range.period}` : base;
}

export function sumValueRanges(ranges: ValueRange[]): ValueRange {
  if (ranges.length === 0)
    return { currency: '€', low: 0, high: 0, period: 'per year' };
  return {
    currency: ranges[0].currency,
    period: ranges[0].period,
    low: ranges.reduce((acc, r) => acc + r.low, 0),
    high: ranges.reduce((acc, r) => acc + r.high, 0),
  };
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-GB').format(Math.round(n));
}

/** Renders a driver's value in its own units, for the assumptions panel. */
export function formatDriverValue(value: number, format: DriverFormat): string {
  switch (format) {
    case 'percent':
      return `${Math.round(value)}%`;
    case 'currency-hour':
      return `€${Math.round(value)}`;
    case 'minutes':
      return `${value % 1 === 0 ? value : value.toFixed(1)} min`;
    case 'hours':
      return `${value % 1 === 0 ? value : value.toFixed(1)} h`;
    case 'count':
    default:
      return formatNumber(value);
  }
}

export function driverDisplay(driver: ValueDriver): string {
  const value = formatDriverValue(driver.value, driver.format);
  return driver.unit ? `${value} ${driver.unit}` : value;
}

/** '2.9 FTE' — the hours figure expressed as people, which executives read faster. */
export function formatFte(fte: number): string {
  return `${fte.toFixed(1)} FTE`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 'a' or 'an' for a following word. Used so copy never reads "An Customer…". */
export function indefiniteArticle(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
}
