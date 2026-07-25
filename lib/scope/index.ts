export { accentVars } from "./accent";
export {
  DEFAULT_SELECTION,
  getComponent,
  getSection,
  getSectionForComponent,
  SCOPE_COMPONENTS,
  SCOPE_SECTIONS,
} from "./catalogue";
export { HOME_BLOCKS, OTHER_PAGES, WORK_UNDERNEATH } from "./mockup";
export type { MockupBlock, MockupChip } from "./mockup";
export { CARE_PLAN, PACKAGE_TIERS, PRICING, resolveTier } from "./packages";
export { computeScope, money, moneyRange } from "./pricing";
export {
  describeScope,
  estimateEmailBody,
  sectionLines,
} from "./summary";
export type { ScopeSummary, SectionLine } from "./summary";
export { COMPONENT_VISUALS, componentVisual, gradientVars } from "./visuals";
export type { ComponentIconName, ComponentVisual } from "./visuals";
export type {
  CollapsedMap,
  PackageTier,
  ScopeComponent,
  ScopeOption,
  ScopeSection,
  ScopeSectionId,
  ScopeSelection,
  ScopeTotals,
} from "./types";
