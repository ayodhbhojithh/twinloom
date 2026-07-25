import { rgbToHex } from "./convert";

/**
 * Pulls the most common colours out of an image, for the studio's auto-pick.
 *
 * The image is sampled down to 48 by 48 and every pixel dropped into a coarse
 * 8 by 8 by 8 bucket, then buckets are ranked by how many pixels landed in them
 * and each winner is averaged back to one colour. Cheap, and it lands on the
 * colours a person would point at rather than the mathematically dominant ones.
 *
 * Near white and near black are skipped: they are almost always background or
 * text, and they crowd out the colours that actually carry the brand.
 *
 * Ported from `extractPalette` in 1_landing_1.html.
 */
export function extractPalette(
  image: HTMLImageElement,
  count: number,
): string[] {
  const SIZE = 48;

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;

  const context = canvas.getContext("2d");
  if (!context) return [];

  context.drawImage(image, 0, 0, SIZE, SIZE);

  let data: Uint8ClampedArray;
  try {
    data = context.getImageData(0, 0, SIZE, SIZE).data;
  } catch {
    /* A cross origin image taints the canvas. Nothing to extract. */
    return [];
  }

  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 125) continue;

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    if (max > 245 && min > 245) continue;
    if (max < 12) continue;

    const key = `${r >> 5},${g >> 5},${b >> 5}`;
    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };

    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.n += 1;

    buckets.set(key, bucket);
  }

  return [...buckets.values()]
    .sort((a, b) => b.n - a.n)
    .slice(0, count)
    .map((bucket) =>
      rgbToHex({
        r: Math.round(bucket.r / bucket.n),
        g: Math.round(bucket.g / bucket.n),
        b: Math.round(bucket.b / bucket.n),
      }),
    );
}
