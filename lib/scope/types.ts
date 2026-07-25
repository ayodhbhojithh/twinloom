export type ScopeSectionId =
  | "structure"
  | "sections"
  | "content"
  | "legal"
  | "foundation";

export interface ScopeOption {
  /** Stable key, derived as `${componentId}.${index}`. */
  id: string;
  componentId: string;
  name: string;
  description: string;
  price: number;
  /**
   * Pre ticked on first load. In the prototype these stood in for the answers
   * a visitor gives during scoping, so treat them as a starting point rather
   * than a recommendation.
   */
  defaultOn: boolean;
}

export interface ScopeComponent {
  id: string;
  sectionId: ScopeSectionId;
  name: string;
  /** Plain English "what this actually is", shown beside the name. */
  what: string;
  options: ScopeOption[];
}

export interface ScopeSection {
  id: ScopeSectionId;
  name: string;
  /** Handwritten margin note that sits beside the section name. */
  tag: string;
  /** Hex accent. Rows tint themselves from this at runtime. */
  accent: string;
  components: ScopeComponent[];
}

/** Option id to ticked. Absent means not ticked. */
export type ScopeSelection = Readonly<Record<string, boolean>>;

/** Section or component id to collapsed. Absent means open. */
export type CollapsedMap = Readonly<Record<string, boolean>>;

export interface PackageTier {
  id: string;
  name: string;
  /** Upper bound, exclusive. `null` is the open ended top tier. */
  maxTotal: number | null;
  timeline: string;
}

export interface ScopeTotals {
  /** Sum of every ticked option. */
  total: number;
  /** Indicative low and high, already rounded. */
  rangeLow: number;
  rangeHigh: number;
  /** Component id to its subtotal. Zero means not included. */
  componentTotals: Readonly<Record<string, number>>;
  /** Section id to its subtotal. */
  sectionTotals: Readonly<Record<ScopeSectionId, number>>;
  optionsTicked: number;
  componentsIncluded: number;
  componentsTotal: number;
  tier: PackageTier;
}
