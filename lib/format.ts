/** Rounds to the nearest multiple of `step`. The estimator rounds to 50. */
export function roundToNearest(value: number, step: number): number {
  if (step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
}

/**
 * Whole pounds, grouped. The estimator never shows pence: a pre estimator that
 * quotes to the penny reads as a fixed quote, which is exactly what it is not.
 */
export function formatCurrency(value: number, currency = "£"): string {
  return currency + Math.round(value).toLocaleString("en-GB");
}

/** "£2,650 - £3,600" */
export function formatCurrencyRange(
  low: number,
  high: number,
  currency = "£",
): string {
  return `${formatCurrency(low, currency)} - ${formatCurrency(high, currency)}`;
}

/** "1 option" / "4 options" */
export function pluralise(count: number, singular: string, plural?: string) {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}
