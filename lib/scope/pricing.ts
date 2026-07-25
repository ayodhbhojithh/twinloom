import {
  formatCurrency,
  formatCurrencyRange,
  roundToNearest,
} from "@/lib/format";

import { SCOPE_COMPONENTS, SCOPE_SECTIONS } from "./catalogue";
import { PRICING, resolveTier } from "./packages";
import type { ScopeSectionId, ScopeSelection, ScopeTotals } from "./types";

/** Whole pounds in the configured currency. The estimator's only money format. */
export function money(value: number): string {
  return formatCurrency(value, PRICING.currency);
}

/** "£2,650 - £3,600". Never a single figure: this is not a quote. */
export function moneyRange(low: number, high: number): string {
  return formatCurrencyRange(low, high, PRICING.currency);
}

/**
 * The whole pre estimator, as one pure function. No React, no DOM, no side
 * effects, so it is trivial to reason about and to test.
 *
 * With the catalogue defaults this returns a total of 3,125, a range of
 * 2,650 to 3,600, and the SME Launch tier at 2-4 weeks.
 */
export function computeScope(selection: ScopeSelection): ScopeTotals {
  const componentTotals: Record<string, number> = {};
  const sectionTotals = {} as Record<ScopeSectionId, number>;

  let total = 0;
  let optionsTicked = 0;
  let componentsIncluded = 0;

  for (const section of SCOPE_SECTIONS) {
    let sectionSum = 0;

    for (const component of section.components) {
      let componentSum = 0;

      for (const option of component.options) {
        if (selection[option.id]) {
          componentSum += option.price;
          optionsTicked += 1;
        }
      }

      componentTotals[component.id] = componentSum;
      if (componentSum > 0) componentsIncluded += 1;
      sectionSum += componentSum;
    }

    sectionTotals[section.id] = sectionSum;
    total += sectionSum;
  }

  return {
    total,
    rangeLow: roundToNearest(total * PRICING.rangeLow, PRICING.roundTo),
    rangeHigh: roundToNearest(total * PRICING.rangeHigh, PRICING.roundTo),
    componentTotals,
    sectionTotals,
    optionsTicked,
    componentsIncluded,
    componentsTotal: SCOPE_COMPONENTS.length,
    tier: resolveTier(total),
  };
}
