/* ---------------------------------------------------------------------------
   The Builder's document model.

   A node holds tokens, never CSS. "radius: lg" rather than "border-radius: 8px",
   "pad: {t: 8}" rather than a string. Everything downstream is a pure function of
   those tokens: the canvas turns them into inline styles, the exporter turns the
   same tokens into Tailwind classes. One source, two renderings, and they cannot
   drift because neither is authored by hand.

   It also keeps the undo stack cheap. A node is plain JSON, so a snapshot is a
   structural clone and history is a list of them.
--------------------------------------------------------------------------- */

export type NodeKind =
  | "section"
  | "container"
  | "grid"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "divider"
  | "spacer";

/** Kinds that can hold other nodes. */
export const CONTAINER_KINDS: NodeKind[] = [
  "section",
  "container",
  "grid",
];

export type BgToken =
  | "none"
  | "white"
  | "panel"
  | "soft"
  | "line"
  | "brand"
  | "ink"
  | "gradient";

export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
export type ShadowToken = "none" | "sm" | "md" | "lg" | "xl";
export type WidthToken = "auto" | "full" | "fit";

export type MaxWidthToken =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "full";

export type Direction = "row" | "col";
export type Align = "start" | "center" | "end" | "stretch";
export type Justify = "start" | "center" | "end" | "between";

export type TextTone = "ink" | "body" | "faint" | "brand" | "white";
export type TextAlign = "left" | "center" | "right";
export type FontWeight = "normal" | "medium" | "semibold" | "bold" | "extrabold";
export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

/** Padding and margin, per side, in spacing steps. */
export interface Box {
  t: number;
  r: number;
  b: number;
  l: number;
}

export interface NodeStyle {
  bg: BgToken;
  radius: RadiusToken;
  shadow: ShadowToken;
  border: boolean;
  /** 0 to 100. */
  opacity: number;
  width: WidthToken;
  maxWidth: MaxWidthToken;
}

export interface NodeLayout {
  direction: Direction;
  align: Align;
  justify: Justify;
  /** Spacing step. */
  gap: number;
  wrap: boolean;
  /** Grid columns. Only read by the grid kind. */
  columns: number;
}

export interface NodeText {
  tone: TextTone;
  align: TextAlign;
  weight: FontWeight;
  size: FontSize;
}

export interface BuilderNode {
  id: string;
  kind: NodeKind;
  /** Editable content, for the kinds that have any. */
  content?: string;
  style: NodeStyle;
  layout: NodeLayout;
  text: NodeText;
  pad: Box;
  margin: Box;
  children: BuilderNode[];
}

/** The three widths the canvas previews. */
export type Device = "desktop" | "tablet" | "mobile";

export interface BuilderDoc {
  root: BuilderNode;
}
