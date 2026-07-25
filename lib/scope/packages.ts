import type { PackageTier } from "./types";

/* ---------------------------------------------------------------------------
   Thresholds are data, not branches. As the running total crosses a bound the
   recommended package and the indicative timeline both step up together, so
   they can never drift apart. See Docs/README.md, point 3.
--------------------------------------------------------------------------- */

export const PACKAGE_TIERS: readonly PackageTier[] = [
  {
    id: "launch-lite",
    name: "Launch Lite",
    maxTotal: 1225,
    timeline: "1-2 weeks",
  },
  {
    id: "sme-launch",
    name: "SME Launch",
    maxTotal: 3450,
    timeline: "2-4 weeks",
  },
  {
    id: "sme-growth",
    name: "SME Growth",
    maxTotal: 7225,
    timeline: "4-8 weeks",
  },
  {
    id: "sme-operating",
    name: "SME Operating",
    maxTotal: 12250,
    timeline: "8-12 weeks",
  },
  {
    id: "bespoke",
    name: "Bespoke Platform",
    maxTotal: null,
    timeline: "12+ weeks",
  },
] as const;

export const PRICING = {
  currency: "£",
  /** The output is a range, never a single figure. It is not a quote. */
  rangeLow: 0.85,
  rangeHigh: 1.15,
  /** Both ends of the range round to this, so nothing reads as precise. */
  roundTo: 50,
} as const;

export const CARE_PLAN = {
  low: 95,
  high: 295,
  note: "confirmed on the call",
} as const;

/** First tier whose upper bound the total has not yet crossed. */
export function resolveTier(total: number): PackageTier {
  return (
    PACKAGE_TIERS.find((tier) => tier.maxTotal === null || total < tier.maxTotal) ??
    PACKAGE_TIERS[PACKAGE_TIERS.length - 1]
  );
}
