import { pluralise } from "@/lib/format";

import { CARE_PLAN } from "./packages";
import { money, moneyRange } from "./pricing";
import type { ScopeTotals } from "./types";

export interface ScopeSummary {
  /** The running total, formatted. */
  total: string;
  /** The indicative range. This is the figure that carries the caveat. */
  range: string;
  tierName: string;
  timeline: string;
  /** "16 options ticked, 11 of 17 components in the build" */
  countLine: string;
  /** The monthly care note, which is never part of the build total. */
  careLine: string;
}

/** Everything the summary cards display, formatted once and shared. */
export function describeScope(totals: ScopeTotals): ScopeSummary {
  return {
    total: money(totals.total),
    range: moneyRange(totals.rangeLow, totals.rangeHigh),
    tierName: totals.tier.name,
    timeline: totals.tier.timeline,
    countLine: `${pluralise(totals.optionsTicked, "option")} ticked, ${
      totals.componentsIncluded
    } of ${totals.componentsTotal} components in the build`,
    careLine: `Care plan typically ${money(CARE_PLAN.low)} to ${money(
      CARE_PLAN.high,
    )} a month, ${CARE_PLAN.note}.`,
  };
}
