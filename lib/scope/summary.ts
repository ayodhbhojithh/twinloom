import { pluralise } from "@/lib/format";

import { SCOPE_SECTIONS } from "./catalogue";
import { CARE_PLAN } from "./packages";
import { money, moneyRange } from "./pricing";
import type { ScopeSelection, ScopeTotals } from "./types";

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

export interface SectionLine {
  id: string;
  name: string;
  accent: string;
  /** Formatted subtotal, or "not included" when nothing under it is ticked. */
  value: string;
  included: boolean;
}

/** The estimate card's line items: one per scope section, in catalogue order. */
export function sectionLines(totals: ScopeTotals): SectionLine[] {
  return SCOPE_SECTIONS.map((section) => {
    const subtotal = totals.sectionTotals[section.id] ?? 0;

    return {
      id: section.id,
      name: section.name,
      accent: section.accent,
      value: subtotal > 0 ? money(subtotal) : "not included",
      included: subtotal > 0,
    };
  });
}

/**
 * A plain text breakdown of everything ticked. Used as the body of the
 * "email me this estimate" message, so the figure a visitor sees on screen is
 * exactly the figure that reaches an inbox.
 */
export function estimateEmailBody(
  selection: ScopeSelection,
  totals: ScopeTotals,
  from?: { name?: string; email?: string },
): string {
  const lines: string[] = [];

  if (from?.name) lines.push(`Name: ${from.name}`);
  if (from?.email) lines.push(`Email: ${from.email}`);
  if (lines.length) lines.push("");

  lines.push(
    `Indicative range: ${moneyRange(totals.rangeLow, totals.rangeHigh)} excluding VAT`,
    `Ticked total: ${money(totals.total)}`,
    `Suggested package: ${totals.tier.name} (${totals.tier.timeline})`,
    "",
    "What is ticked",
    "",
  );

  for (const section of SCOPE_SECTIONS) {
    const subtotal = totals.sectionTotals[section.id] ?? 0;
    if (subtotal === 0) continue;

    lines.push(`${section.name.toUpperCase()} - ${money(subtotal)}`);

    for (const component of section.components) {
      const ticked = component.options.filter((option) => selection[option.id]);
      if (!ticked.length) continue;

      lines.push(`  ${component.name}`);
      for (const option of ticked) {
        lines.push(`    - ${option.name}: ${money(option.price)}`);
      }
    }

    lines.push("");
  }

  lines.push(
    "This is a pre estimate, not a quote. A fixed figure follows the scope call.",
  );

  return lines.join("\n");
}
