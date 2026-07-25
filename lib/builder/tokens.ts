import type {
  Align,
  BgToken,
  BuilderNode,
  Direction,
  FontSize,
  FontWeight,
  Justify,
  MaxWidthToken,
  NodeKind,
  RadiusToken,
  ShadowToken,
  TextAlign,
  TextTone,
  WidthToken,
} from "./types";

/* ---------------------------------------------------------------------------
   Tokens, and the two ways of reading them.

   `styleFor` turns a node into inline CSS for the canvas. `classesFor` turns the
   same node into Tailwind classes for the export. Every scale below is defined
   once with both readings side by side, so a token can never mean one thing on
   screen and another in the exported code.

   The numbers are Tailwind's own: one spacing step is 0.25rem, `lg` radius is
   0.5rem, and so on. That is what lets the two agree.
--------------------------------------------------------------------------- */

/** Spacing steps offered in the inspector. Tailwind's scale, thinned out. */
export const SPACE_STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

export const step = (value: number) => `${value * 0.25}rem`;

interface Pair<T> {
  css: string;
  cls: string;
  label: string;
  value: T;
}

export const BG: Pair<BgToken>[] = [
  { value: "none", css: "transparent", cls: "", label: "None" },
  { value: "white", css: "#ffffff", cls: "bg-white", label: "White" },
  { value: "panel", css: "#f7f8fb", cls: "bg-panel-bg", label: "Panel" },
  { value: "soft", css: "#eff6ff", cls: "bg-soft", label: "Soft" },
  { value: "line", css: "#e7eaf0", cls: "bg-line", label: "Line" },
  { value: "brand", css: "#2563eb", cls: "bg-brand", label: "Brand" },
  { value: "ink", css: "#232733", cls: "bg-ink", label: "Ink" },
  {
    value: "gradient",
    css: "linear-gradient(135deg, #f59e0b, #ec4899 45%, #8b5cf6 75%, #10b981)",
    cls: "bg-brand-gradient-tilt",
    label: "Gradient",
  },
];

export const RADIUS: Pair<RadiusToken>[] = [
  { value: "none", css: "0", cls: "rounded-none", label: "None" },
  { value: "sm", css: "0.25rem", cls: "rounded-sm", label: "SM" },
  { value: "md", css: "0.375rem", cls: "rounded-md", label: "MD" },
  { value: "lg", css: "0.5rem", cls: "rounded-lg", label: "LG" },
  { value: "xl", css: "0.75rem", cls: "rounded-xl", label: "XL" },
  { value: "2xl", css: "1rem", cls: "rounded-2xl", label: "2XL" },
  { value: "full", css: "9999px", cls: "rounded-full", label: "Full" },
];

export const SHADOW: Pair<ShadowToken>[] = [
  { value: "none", css: "none", cls: "", label: "None" },
  {
    value: "sm",
    css: "0 1px 3px 0 rgb(0 0 0 / 0.07)",
    cls: "shadow-sm",
    label: "SM",
  },
  {
    value: "md",
    css: "0 4px 12px -2px rgb(0 0 0 / 0.1)",
    cls: "shadow-md",
    label: "MD",
  },
  {
    value: "lg",
    css: "0 10px 26px -6px rgb(0 0 0 / 0.14)",
    cls: "shadow-lg",
    label: "LG",
  },
  {
    value: "xl",
    css: "0 22px 48px -12px rgb(0 0 0 / 0.2)",
    cls: "shadow-xl",
    label: "XL",
  },
];

export const WIDTH: Pair<WidthToken>[] = [
  { value: "auto", css: "auto", cls: "", label: "Auto" },
  { value: "full", css: "100%", cls: "w-full", label: "Full" },
  { value: "fit", css: "fit-content", cls: "w-fit", label: "Fit" },
];

export const MAX_WIDTH: Pair<MaxWidthToken>[] = [
  { value: "none", css: "none", cls: "", label: "None" },
  { value: "sm", css: "24rem", cls: "max-w-sm", label: "SM" },
  { value: "md", css: "28rem", cls: "max-w-md", label: "MD" },
  { value: "lg", css: "32rem", cls: "max-w-lg", label: "LG" },
  { value: "xl", css: "36rem", cls: "max-w-xl", label: "XL" },
  { value: "2xl", css: "42rem", cls: "max-w-2xl", label: "2XL" },
  { value: "3xl", css: "48rem", cls: "max-w-3xl", label: "3XL" },
  { value: "4xl", css: "56rem", cls: "max-w-4xl", label: "4XL" },
  { value: "5xl", css: "64rem", cls: "max-w-5xl", label: "5XL" },
  { value: "6xl", css: "72rem", cls: "max-w-6xl", label: "6XL" },
  { value: "full", css: "100%", cls: "max-w-full", label: "Full" },
];

export const DIRECTION: Pair<Direction>[] = [
  { value: "col", css: "column", cls: "flex-col", label: "Stack" },
  { value: "row", css: "row", cls: "flex-row", label: "Row" },
];

export const ALIGN: Pair<Align>[] = [
  { value: "start", css: "flex-start", cls: "items-start", label: "Start" },
  { value: "center", css: "center", cls: "items-center", label: "Centre" },
  { value: "end", css: "flex-end", cls: "items-end", label: "End" },
  { value: "stretch", css: "stretch", cls: "items-stretch", label: "Stretch" },
];

export const JUSTIFY: Pair<Justify>[] = [
  { value: "start", css: "flex-start", cls: "justify-start", label: "Start" },
  { value: "center", css: "center", cls: "justify-center", label: "Centre" },
  { value: "end", css: "flex-end", cls: "justify-end", label: "End" },
  {
    value: "between",
    css: "space-between",
    cls: "justify-between",
    label: "Between",
  },
];

export const TONE: Pair<TextTone>[] = [
  { value: "ink", css: "#232733", cls: "text-ink", label: "Ink" },
  { value: "body", css: "#5b6472", cls: "text-body", label: "Body" },
  { value: "faint", css: "#8b93a1", cls: "text-faint", label: "Faint" },
  { value: "brand", css: "#2563eb", cls: "text-brand", label: "Brand" },
  { value: "white", css: "#ffffff", cls: "text-white", label: "White" },
];

export const TEXT_ALIGN: Pair<TextAlign>[] = [
  { value: "left", css: "left", cls: "text-left", label: "Left" },
  { value: "center", css: "center", cls: "text-center", label: "Centre" },
  { value: "right", css: "right", cls: "text-right", label: "Right" },
];

export const WEIGHT: Pair<FontWeight>[] = [
  { value: "normal", css: "400", cls: "font-normal", label: "400" },
  { value: "medium", css: "500", cls: "font-medium", label: "500" },
  { value: "semibold", css: "600", cls: "font-semibold", label: "600" },
  { value: "bold", css: "700", cls: "font-bold", label: "700" },
  { value: "extrabold", css: "800", cls: "font-extrabold", label: "800" },
];

export const SIZE: Pair<FontSize>[] = [
  { value: "xs", css: "0.75rem", cls: "text-xs", label: "XS" },
  { value: "sm", css: "0.875rem", cls: "text-sm", label: "SM" },
  { value: "base", css: "1rem", cls: "text-base", label: "Base" },
  { value: "lg", css: "1.125rem", cls: "text-lg", label: "LG" },
  { value: "xl", css: "1.25rem", cls: "text-xl", label: "XL" },
  { value: "2xl", css: "1.5rem", cls: "text-2xl", label: "2XL" },
  { value: "3xl", css: "1.875rem", cls: "text-3xl", label: "3XL" },
  { value: "4xl", css: "2.25rem", cls: "text-4xl", label: "4XL" },
  { value: "5xl", css: "3rem", cls: "text-5xl", label: "5XL" },
];

function find<T>(scale: Pair<T>[], value: T): Pair<T> {
  return scale.find((entry) => entry.value === value) ?? scale[0];
}

/** Line height paired to size, so display text does not sit loose. */
const LEADING: Record<FontSize, string> = {
  xs: "1.5",
  sm: "1.55",
  base: "1.6",
  lg: "1.55",
  xl: "1.4",
  "2xl": "1.3",
  "3xl": "1.2",
  "4xl": "1.12",
  "5xl": "1.05",
};

/** What the canvas renders. Inline CSS, so any token combination just works. */
export function styleFor(node: BuilderNode): React.CSSProperties {
  const { style: s, layout: l, text: t, pad, margin, kind } = node;

  const box: React.CSSProperties = {
    paddingTop: step(pad.t),
    paddingRight: step(pad.r),
    paddingBottom: step(pad.b),
    paddingLeft: step(pad.l),
    marginTop: step(margin.t),
    marginRight: step(margin.r),
    marginBottom: step(margin.b),
    marginLeft: step(margin.l),
    background: find(BG, s.bg).css,
    borderRadius: find(RADIUS, s.radius).css,
    boxShadow: find(SHADOW, s.shadow).css,
    opacity: s.opacity / 100,
    border: s.border ? "1px solid #e7eaf0" : undefined,
    color: find(TONE, t.tone).css,
    textAlign: find(TEXT_ALIGN, t.align).css as React.CSSProperties["textAlign"],
    fontWeight: find(WEIGHT, t.weight).css,
    fontSize: find(SIZE, t.size).css,
    lineHeight: LEADING[t.size],
  };

  if (s.width !== "auto") box.width = find(WIDTH, s.width).css;
  if (s.maxWidth !== "none") {
    box.maxWidth = find(MAX_WIDTH, s.maxWidth).css;
    /* A capped width with nothing centring it reads as a bug, so cap and centre
       travel together. */
    box.marginLeft = "auto";
    box.marginRight = "auto";
  }

  if (kind === "grid") {
    box.display = "grid";
    box.gridTemplateColumns = `repeat(${Math.max(1, l.columns)}, minmax(0, 1fr))`;
    box.gap = step(l.gap);
    return box;
  }

  if (kind === "section" || kind === "container") {
    box.display = "flex";
    box.flexDirection = find(DIRECTION, l.direction).css as "row" | "column";
    box.alignItems = find(ALIGN, l.align).css;
    box.justifyContent = find(JUSTIFY, l.justify).css;
    box.gap = step(l.gap);
    box.flexWrap = l.wrap ? "wrap" : "nowrap";
  }

  if (kind === "spacer") box.height = step(Math.max(1, l.gap));
  if (kind === "divider") {
    box.height = "1px";
    box.background = find(BG, s.bg === "none" ? "line" : s.bg).css;
  }

  return box;
}

/** What the exporter writes. The same tokens, as Tailwind classes. */
export function classesFor(node: BuilderNode): string {
  const { style: s, layout: l, text: t, pad, margin, kind } = node;

  const out: string[] = [];

  if (kind === "grid") {
    out.push("grid", `grid-cols-${Math.max(1, l.columns)}`);
    if (l.gap) out.push(`gap-${l.gap}`);
  } else if (kind === "section" || kind === "container") {
    out.push("flex", find(DIRECTION, l.direction).cls);
    out.push(find(ALIGN, l.align).cls, find(JUSTIFY, l.justify).cls);
    if (l.gap) out.push(`gap-${l.gap}`);
    if (l.wrap) out.push("flex-wrap");
  }

  for (const [side, value] of [
    ["t", pad.t],
    ["r", pad.r],
    ["b", pad.b],
    ["l", pad.l],
  ] as const) {
    if (value) out.push(`p${side}-${value}`);
  }

  for (const [side, value] of [
    ["t", margin.t],
    ["r", margin.r],
    ["b", margin.b],
    ["l", margin.l],
  ] as const) {
    if (value) out.push(`m${side}-${value}`);
  }

  out.push(find(BG, s.bg).cls);
  out.push(find(RADIUS, s.radius).cls);
  out.push(find(SHADOW, s.shadow).cls);
  if (s.border) out.push("border border-line");
  if (s.opacity !== 100) out.push(`opacity-${s.opacity}`);
  out.push(find(WIDTH, s.width).cls);
  if (s.maxWidth !== "none") out.push(find(MAX_WIDTH, s.maxWidth).cls, "mx-auto");

  out.push(find(TONE, t.tone).cls);
  out.push(find(TEXT_ALIGN, t.align).cls);
  out.push(find(WEIGHT, t.weight).cls);
  out.push(find(SIZE, t.size).cls);

  return out.filter(Boolean).join(" ");
}

/** What each kind is called, everywhere it is named. */
export const KIND_NAME: Record<NodeKind, string> = {
  section: "Section",
  container: "Container",
  grid: "Grid",
  heading: "Heading",
  text: "Text",
  button: "Button",
  image: "Image",
  divider: "Divider",
  spacer: "Spacer",
};

/** The tag each kind exports as, and what the canvas renders it with. */
export const TAG: Record<NodeKind, string> = {
  section: "section",
  container: "div",
  grid: "div",
  heading: "h2",
  text: "p",
  button: "button",
  image: "div",
  divider: "div",
  spacer: "div",
};
