/* ---------------------------------------------------------------------------
   Colour maths for the Colour Studio, ported from 1_landing_1.html.

   Pure functions, no DOM: the studio's pickers, fields and loupe all agree
   because they all go through here.
--------------------------------------------------------------------------- */

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsv {
  /** 0 to 360 */
  h: number;
  /** 0 to 1 */
  s: number;
  /** 0 to 1 */
  v: number;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b]
    .map((channel) =>
      clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"),
    )
    .join("")}`;
}

export function hexToRgb(input: string): Rgb | null {
  let value = String(input).trim().replace(/^#/, "");

  if (/^[0-9a-f]{3}$/i.test(value)) {
    value = value
      .split("")
      .map((character) => character + character)
      .join("");
  }

  if (!/^[0-9a-f]{6}$/i.test(value)) return null;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let h = 0;

  if (delta) {
    if (max === red) h = ((green - blue) / delta) % 6;
    else if (max === green) h = (blue - red) / delta + 2;
    else h = (red - green) / delta + 4;

    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: max ? delta / max : 0, v: max };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const hue = ((h % 360) + 360) % 360;
  const chroma = v * s;
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = v - chroma;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = chroma;
    g = second;
  } else if (hue < 120) {
    r = second;
    g = chroma;
  } else if (hue < 180) {
    g = chroma;
    b = second;
  } else if (hue < 240) {
    g = second;
    b = chroma;
  } else if (hue < 300) {
    r = second;
    b = chroma;
  } else {
    r = chroma;
    b = second;
  }

  return {
    r: Math.round((r + match) * 255),
    g: Math.round((g + match) * 255),
    b: Math.round((b + match) * 255),
  };
}

export function hsvToHex(hsv: Hsv): string {
  return rgbToHex(hsvToRgb(hsv));
}
