import type { EffortBand, Rag, ScopeAnswers, ScopeOption } from "./types";

/* ---------------------------------------------------------------------------
   The effort model.

   Every selected component carries an effort from 0 to 10. The default is
   derived from the option's band, so a visitor who never touches a slider still
   gets a sensible brief; touching one replaces the derived value.

   Effort drives three things downstream: the colour on the dial, the deliverable
   level per component, and the price band.
--------------------------------------------------------------------------- */

/** Band to derived starting effort, from the artifact: light, middling, heavy. */
export const BAND_EFFORT: Record<EffortBand, number> = { 1: 2, 2: 5, 3: 8 };

export const EFFORT_MIN = 0;
export const EFFORT_MAX = 10;

/** Effort key for a chosen option. */
export function optionKey(groupKey: string, optionValue: string): string {
  return `o:${groupKey}:${optionValue}`;
}

/** Effort key for one of the redesign deepen dials. */
export function dialKey(dial: string): string {
  return `d:${dial}`;
}

export function optionEffort(
  answers: ScopeAnswers,
  groupKey: string,
  option: ScopeOption,
): number {
  const set = answers.effort[optionKey(groupKey, option.value)];
  return set ?? BAND_EFFORT[option.band ?? 1];
}

/** Deepen dials start at nothing: they only count once the client moves them. */
export function dialEffort(answers: ScopeAnswers, dial: string): number {
  return answers.effort[dialKey(dial)] ?? 0;
}

/**
 * Effort to a band. The thresholds are the artifact's: up to 3.5 is light, up to
 * 6.6 is medium, above that is heavy.
 */
export function effortRag(effort: number): Rag {
  if (effort <= 3.5) return "light";
  if (effort <= 6.6) return "medium";
  return "heavy";
}

export const RAG_LABEL: Record<Rag, string> = {
  light: "Light",
  medium: "Medium",
  heavy: "Heavy",
  todo: "Not set",
};

/**
 * RAG to a CSS colour. Semantic, not decorative: it reads effort, so it keeps its
 * own tokens rather than borrowing the brand.
 */
export const RAG_COLOUR: Record<Rag, string> = {
  light: "var(--color-rag-green)",
  medium: "var(--color-rag-amber)",
  heavy: "var(--color-rag-red)",
  todo: "var(--color-rag-todo)",
};

export function mean(values: number[]): number {
  return values.reduce((total, value) => total + value, 0) / values.length;
}
