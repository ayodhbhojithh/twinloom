/* ---------------------------------------------------------------------------
   The scoping journey, typed.

   The governing rule from TCT_Scope_Spec.md §0: ask only what is genuinely the
   client's intent, and derive everything an expert would already know from the
   other answers. So there is no question here for page count, site size or the
   sitemap. Those are worked out and shown back in the Blueprint.
--------------------------------------------------------------------------- */

/** Base effort band an option carries before the client touches it. */
export type EffortBand = 1 | 2 | 3;

/** Red, amber, green, or grey for nothing answered yet. */
export type Rag = "light" | "medium" | "heavy" | "todo";

export interface ScopeOption {
  value: string;
  label: string;
  /** One line, shown beside the label. */
  desc: string;
  /** Derived starting effort. The client can tune it from the focus panel. */
  band?: EffortBand;
  /** What more effort actually buys on this option. */
  explain?: string;
}

export interface ScopeGroup {
  question: string;
  key: string;
  type: "single" | "multi";
  options: ScopeOption[];
}

/** An area the client can push independently, shown as a slider. */
export interface DeepenDial {
  key: string;
  label: string;
  explain: string;
}

/** Extra questions that only appear once a specific answer is given. */
export interface DeepenSpec {
  when: { key: string; value: string };
  drivers: {
    question: string;
    key: string;
    options: Pick<ScopeOption, "value" | "label" | "desc">[];
  };
  dials: DeepenDial[];
}

/** Sections that are not a list of questions. */
export type StepSpecial = "assets" | "budget" | "free";

export interface ScopeStep {
  key: string;
  /** The small uppercase label. */
  kicker: string;
  heading: string;
  lead: string;
  groups?: ScopeGroup[];
  /** Shown only when this answer was given elsewhere. */
  condition?: { key: string; value: string };
  deepen?: DeepenSpec;
  special?: StepSpecial;
}

/** Yes, no or not sure, for each thing the client might already have. */
export type AssetState = "yes" | "no" | "unsure";

export interface ScopeAnswers {
  /** Group key to chosen value. */
  single: Record<string, string>;
  /** Group key to chosen values. */
  multi: Record<string, string[]>;
  /**
   * Effort per component, 0 to 10. Keyed `o:<group>:<option>` for an option and
   * `d:<dial>` for a deepen dial. Absent means the derived default still stands.
   */
  effort: Record<string, number>;
  /** Effort keys the client has actually moved, as opposed to inherited. */
  touched: string[];
  assets: Record<number, AssetState>;
  /** `null` is "rather not say", which is a real answer. */
  budget: number | null;
  free: string;
}

/** One answered question, and what it contributes, for the dial and the readout. */
export interface SectionUnit {
  label: string;
  options: { label: string; effort: number }[];
  effort: number;
}

export interface SectionSummary {
  units: SectionUnit[];
  /** Mean effort across everything answered, or `null` if nothing is. */
  effort: number | null;
}
