import type { ValueRange } from '../types';

/** '€180K–€260K' */
export function formatValueRange(range: ValueRange, withPeriod = false): string {
  const fmt = (n: number) =>
    n >= 1000 ? `${range.currency}${(n / 1000).toFixed(1).replace(/\.0$/, '')}M` : `${range.currency}${n}K`;
  const base = `${fmt(range.low)}–${fmt(range.high)}`;
  return withPeriod ? `${base} ${range.period}` : base;
}

export function sumValueRanges(ranges: ValueRange[]): ValueRange {
  if (ranges.length === 0) return { currency: '€', low: 0, high: 0, period: 'per year' };
  return {
    currency: ranges[0].currency,
    period: ranges[0].period,
    low: ranges.reduce((acc, r) => acc + r.low, 0),
    high: ranges.reduce((acc, r) => acc + r.high, 0),
  };
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-GB').format(n);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
