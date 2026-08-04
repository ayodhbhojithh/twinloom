/* ---------------------------------------------------------------------------
   The palette, and the arithmetic behind it.

   A colour on its own is not an answer. Three things make it one: what it is
   for, how much of the design it should take, and whether the pair of colours
   somebody has landed on can actually be read. All three live here, so the
   studio is a way of working on this rather than a place where the numbers are
   invented.

   A store of its own rather than another field on `Answers`. The answers are a
   record of what was ticked and typed; a palette is a working document with
   its own order, weights and roles, and folding it in would put a second kind
   of thing inside the shape that twelve steps and a read-back all destructure.
--------------------------------------------------------------------------- */

/** What a colour is for. `one` means only one colour may hold the role. */
export const ROLES = [
  { k: "", n: "No role yet", one: false },
  { k: "primary", n: "Primary", one: true },
  { k: "secondary", n: "Secondary", one: true },
  { k: "accent", n: "Accent", one: false },
  { k: "background", n: "Background", one: true },
  { k: "text", n: "Text", one: true },
  { k: "detail", n: "Border or detail", one: false },
] as const;

/** The roles a new colour is given, in order, while they are still free. */
const SUGGEST = ["primary", "secondary", "accent"];

export interface Swatch {
  id: string;
  hex: string;
  /** Share of the design, as a percentage. The list always totals 100. */
  weight: number;
  role: string;
  note: string;
  /** How it got here, so the read-back can say where a colour came from. */
  source: string;
}

export const MAX_COLOURS = 12;

/* --------------------------------------------------------------- the maths */

export const clamp = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, n));

export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        clamp(Math.round(v), 0, 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}

export function hexToRgb(input: string) {
  let hex = String(input).trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(hex))
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return null;

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: max ? d / max : 0, v: max };
}

export function hsvToRgb(h: number, s: number, v: number) {
  h = ((h % 360) + 360) % 360;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g] = [c, x];
  else if (h < 120) [r, g] = [x, c];
  else if (h < 180) [g, b] = [c, x];
  else if (h < 240) [g, b] = [x, c];
  else if (h < 300) [r, b] = [x, c];
  else [r, b] = [c, x];

  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

/** Relative luminance, as the contrast rules define it. */
export function luminance(hex: string) {
  const c = hexToRgb(hex);
  if (!c) return 0;

  const [r, g, b] = [c.r, c.g, c.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** How far apart two colours are, from 1 (identical) to 21 (black on white). */
export function contrast(a: string, b: string) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/**
 * What a ratio is good for.
 *
 * Not a pass or a fail. A pairing that will not carry body text is often
 * perfectly good for a heading, and saying so is more useful than a cross.
 */
export function reading(ratio: number) {
  if (ratio >= 7) return { grade: "AAA", note: "Anything, at any size" };
  if (ratio >= 4.5) return { grade: "AA", note: "Body text and up" };
  if (ratio >= 3) return { grade: "AA Large", note: "Headings only" };
  return { grade: "Low", note: "Not for text" };
}

/** Black or white, whichever can be read on the colour given. */
export const inkOn = (hex: string) =>
  luminance(hex) > 0.42 ? "#111827" : "#FFFFFF";

/** Colours that sit in a known relation to this one, as starting points. */
export function harmonies(hex: string) {
  const c = hexToRgb(hex);
  if (!c) return [];

  const { h, s, v } = rgbToHsv(c.r, c.g, c.b);
  const at = (dh: number, ds = 1, dv = 1) => {
    const out = hsvToRgb(h + dh, clamp(s * ds, 0, 1), clamp(v * dv, 0, 1));
    return rgbToHex(out.r, out.g, out.b);
  };

  return [
    { n: "Opposite", hex: at(180) },
    { n: "Beside it", hex: at(-30) },
    { n: "Beside it", hex: at(30) },
    { n: "Third", hex: at(120) },
    { n: "Third", hex: at(240) },
    { n: "Lighter", hex: at(0, 0.55, 1.28) },
    { n: "Darker", hex: at(0, 1.1, 0.62) },
    { n: "Muted", hex: at(0, 0.35, 0.98) },
  ];
}

/* --------------------------------------------------------------- the store */

let palette: Swatch[] = [];
const listeners = new Set<() => void>();
let seq = 0;

/** One array, so the server snapshot is stable and hydration has nothing to
    disagree with. Never written to. */
const EMPTY: Swatch[] = [];

export const getPalette = () => palette;
export const getServerPalette = () => EMPTY;

export function subscribePalette(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function publish(next: Swatch[]) {
  palette = next;
  listeners.forEach((fn) => fn());
}

const roleOf = (key: string) => ROLES.find((r) => r.k === key) ?? ROLES[0];

/**
 * Spread the remaining share over everything else.
 *
 * The weights are a division of one design, so moving one has to move the
 * others: a set of sliders that each run to a hundred says nothing at all.
 */
function distribute(list: Swatch[], at: number, want: number) {
  const next = list.map((s) => ({ ...s }));
  next[at].weight = clamp(Math.round(want), 0, 100);

  const others = next.map((_, i) => i).filter((i) => i !== at);
  if (!others.length) {
    next[at].weight = 100;
    return next;
  }

  const rest = 100 - next[at].weight;
  const sum = others.reduce((total, i) => total + next[i].weight, 0);

  others.forEach((i) => {
    next[i].weight =
      sum <= 0
        ? Math.round(rest / others.length)
        : Math.round((next[i].weight * rest) / sum);
  });

  /* Rounding has to land somewhere, and the last row is the least surprising
     place for it: it is the one nobody is dragging. */
  const drift = 100 - next.reduce((total, s) => total + s.weight, 0);
  next[others[others.length - 1]].weight += drift;
  next.forEach((s) => (s.weight = Math.max(0, s.weight)));

  return next;
}

function renormalise(list: Swatch[]) {
  if (!list.length) return list;

  const next = list.map((s) => ({ ...s }));
  const sum = next.reduce((total, s) => total + s.weight, 0);

  next.forEach((s) => {
    s.weight = sum <= 0 ? Math.round(100 / next.length) : Math.round((s.weight * 100) / sum);
  });

  next[next.length - 1].weight += 100 - next.reduce((t, s) => t + s.weight, 0);
  return next;
}

/** Adds a colour. Returns what happened, so the studio can say it out loud. */
export function addColour(input: string, source = "picked") {
  const c = hexToRgb(input);
  if (!c) return { ok: false, said: "That is not a colour we can read." };

  const hex = rgbToHex(c.r, c.g, c.b);
  if (palette.some((s) => s.hex === hex))
    return { ok: false, said: `${hex} is already in the palette.` };

  if (palette.length >= MAX_COLOURS)
    return {
      ok: false,
      said: `${MAX_COLOURS} is the limit. Past that it stops being a palette.`,
    };

  const free = SUGGEST.find((role) => !palette.some((s) => s.role === role));

  seq += 1;
  const next = distribute(
    [
      ...palette,
      {
        id: `c${seq}`,
        hex,
        weight: 0,
        role: free ?? "",
        note: "",
        source,
      },
    ],
    palette.length,
    Math.round(100 / (palette.length + 1)),
  );

  publish(next);

  return {
    ok: true,
    hex,
    said: free
      ? `${hex} added as ${roleOf(free).n}. Change it if that is wrong.`
      : `${hex} added. Say what it is for.`,
  };
}

export function dropColour(id: string) {
  publish(renormalise(palette.filter((s) => s.id !== id)));
}

export function moveColour(id: string, by: number) {
  const at = palette.findIndex((s) => s.id === id);
  const to = at + by;
  if (at < 0 || to < 0 || to >= palette.length) return;

  const next = [...palette];
  [next[at], next[to]] = [next[to], next[at]];
  publish(next);
}

/**
 * Gives a colour its role, taking it off whatever held it.
 *
 * Two colours cannot both be the background. Rather than refusing the second,
 * the first lets go: somebody changing their mind is the ordinary case, and a
 * disabled option would only make them go and clear the other one first.
 */
export function setRole(id: string, role: string) {
  const one = roleOf(role).one;

  publish(
    palette.map((s) =>
      s.id === id
        ? { ...s, role }
        : one && role && s.role === role
          ? { ...s, role: "" }
          : s,
    ),
  );
}

export function setWeight(id: string, weight: number) {
  const at = palette.findIndex((s) => s.id === id);
  if (at < 0) return;
  publish(distribute(palette, at, weight));
}

export function setNote(id: string, note: string) {
  publish(palette.map((s) => (s.id === id ? { ...s, note } : s)));
}

export function clearPalette() {
  publish([]);
}

/** The colour holding a role, where one does. */
export const withRole = (list: Swatch[], role: string) =>
  list.find((s) => s.role === role) ?? null;

/**
 * The three colours a preview needs, said plainly.
 *
 * Where a role has been set we use it. Where it has not, we fall back to
 * lightest, darkest and first - and the studio says which of the two it is
 * doing, because a preview that quietly guesses is worse than no preview.
 */
export function previewRoles(list: Swatch[]) {
  const byLight = [...list].sort((a, b) => luminance(b.hex) - luminance(a.hex));

  const bg = withRole(list, "background");
  const text = withRole(list, "text");
  const primary = withRole(list, "primary");

  return {
    field: bg?.hex ?? byLight[0]?.hex ?? "#FFFFFF",
    text: text?.hex ?? byLight[byLight.length - 1]?.hex ?? "#111827",
    primary: primary?.hex ?? list[0]?.hex ?? "#111827",
    set: [bg, text, primary].filter(Boolean).length,
  };
}
