import type { PaletteColour } from "./types";

/** Order sets the role. Beyond the third, colours are numbered. */
export const MAX_COLOURS = 10;

const NAMED_ROLES = ["Primary", "Secondary", "Tertiary"] as const;

export function roleFor(index: number): string {
  return NAMED_ROLES[index] ?? `Colour ${index + 1}`;
}

/** Accepts `#abc`, `abc`, `#aabbcc`, `aabbcc`. Returns null if it is not a hex. */
export function normaliseHex(input: string): string | null {
  const value = input.trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(value)) {
    const [r, g, b] = value.split("");
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  if (/^[0-9a-f]{6}$/i.test(value)) return `#${value.toLowerCase()}`;

  return null;
}

/** Even split, used when a colour is added or removed. */
export function evenWeights(colours: PaletteColour[]): PaletteColour[] {
  if (!colours.length) return colours;

  const base = Math.floor(100 / colours.length);
  const remainder = 100 - base * colours.length;

  return colours.map((colour, index) => ({
    ...colour,
    weight: base + (index < remainder ? 1 : 0),
  }));
}

/**
 * Sets one colour's weight and spreads what is left across the rest, in
 * proportion to what they already had, so the palette still sums to 100.
 *
 * Spec: "Per-colour weight % that auto-rebalances to 100% as you drag."
 */
export function rebalanceWeights(
  colours: PaletteColour[],
  id: string,
  nextWeight: number,
): PaletteColour[] {
  const index = colours.findIndex((colour) => colour.id === id);
  if (index === -1) return colours;
  if (colours.length === 1) return [{ ...colours[0], weight: 100 }];

  const target = Math.max(0, Math.min(100, Math.round(nextWeight)));
  const others = colours.filter((_, i) => i !== index);
  const otherTotal = others.reduce((sum, colour) => sum + colour.weight, 0);
  const remaining = 100 - target;

  const scaled = others.map((colour) => ({
    ...colour,
    weight:
      otherTotal > 0
        ? (colour.weight / otherTotal) * remaining
        : remaining / others.length,
  }));

  /* Round down, then hand the leftover to the largest remainders, so the total
     lands on exactly 100 rather than 99 or 101. */
  const floored = scaled.map((colour) => ({
    ...colour,
    weight: Math.floor(colour.weight),
  }));
  let leftover = remaining - floored.reduce((sum, c) => sum + c.weight, 0);

  const order = scaled
    .map((colour, i) => ({ i, fraction: colour.weight - floored[i].weight }))
    .sort((a, b) => b.fraction - a.fraction);

  for (const { i } of order) {
    if (leftover <= 0) break;
    floored[i].weight += 1;
    leftover -= 1;
  }

  const result: PaletteColour[] = [];
  let cursor = 0;

  for (let i = 0; i < colours.length; i += 1) {
    if (i === index) result.push({ ...colours[index], weight: target });
    else {
      result.push(floored[cursor]);
      cursor += 1;
    }
  }

  return result;
}

export function moveColour(
  colours: PaletteColour[],
  id: string,
  direction: -1 | 1,
): PaletteColour[] {
  const index = colours.findIndex((colour) => colour.id === id);
  const next = index + direction;
  if (index === -1 || next < 0 || next >= colours.length) return colours;

  const reordered = [...colours];
  [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
  return reordered;
}
