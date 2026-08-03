/* ---------------------------------------------------------------------------
   The six shapes, as bars.

   Drawn from numbers rather than shipped as six SVG files: every wireframe is
   the same 160x108 box with a handful of rectangles in it, and holding them as
   data means the whole set restyles at once. "h" is the header band and "b"
   the hero; everything else is a block of content.

   Traced from the v5.2 prototype, so the shapes and the wording are its own.
--------------------------------------------------------------------------- */

export interface WireBar {
  x: number;
  y: number;
  w: number;
  h: number;
  /** "h" header, "b" hero, empty for an ordinary block. */
  kind: string;
}

export interface Wire {
  k: string;
  /** Its name. */
  n: string;
  /** What the shape is. */
  d: string;
  /** Who it suits. */
  w: string;
  bars: readonly WireBar[];
}

export const WIRES: readonly Wire[] = [
  { k: "classic", n: "Classic business", d: "A picture and a sentence at the top, the three things you do, proof that you do them, then a clear way to get in touch.", w: "Most businesses that sell a service and want to be taken seriously.",
    bars: [{ x: 6, y: 6, w: 148, h: 10, kind: "h" }, { x: 6, y: 22, w: 148, h: 32, kind: "b" }, { x: 6, y: 60, w: 46, h: 22, kind: "" }, { x: 57, y: 60, w: 46, h: 22, kind: "" }, { x: 108, y: 60, w: 46, h: 22, kind: "" }, { x: 6, y: 88, w: 148, h: 14, kind: "" }] },
  { k: "product", n: "Product led", d: "One large image at the top, then a run of rows that each take one thing and explain it properly.", w: "One product or a short range, where each thing needs explaining.",
    bars: [{ x: 6, y: 6, w: 148, h: 10, kind: "h" }, { x: 6, y: 22, w: 148, h: 30, kind: "b" }, { x: 6, y: 58, w: 70, h: 18, kind: "" }, { x: 82, y: 58, w: 72, h: 18, kind: "" }, { x: 6, y: 82, w: 72, h: 20, kind: "" }, { x: 84, y: 82, w: 70, h: 20, kind: "" }] },
  { k: "store", n: "Storefront", d: "Categories along the top and a grid of things to buy underneath, so people are shopping from the first screen.", w: "Anyone selling more than a handful of items.",
    bars: [{ x: 6, y: 6, w: 148, h: 10, kind: "h" }, { x: 6, y: 21, w: 34, h: 8, kind: "b" }, { x: 44, y: 21, w: 34, h: 8, kind: "" }, { x: 82, y: 21, w: 34, h: 8, kind: "" }, { x: 120, y: 21, w: 34, h: 8, kind: "" }, { x: 6, y: 35, w: 46, h: 31, kind: "" }, { x: 57, y: 35, w: 46, h: 31, kind: "" }, { x: 108, y: 35, w: 46, h: 31, kind: "" }, { x: 6, y: 70, w: 46, h: 31, kind: "" }, { x: 57, y: 70, w: 46, h: 31, kind: "" }, { x: 108, y: 70, w: 46, h: 31, kind: "" }] },
  { k: "local", n: "Locations", d: "A map or a list of your places at the top, and everything else beneath it.", w: "Shops, clinics, garages, anywhere people need to come to you.",
    bars: [{ x: 6, y: 6, w: 148, h: 10, kind: "h" }, { x: 6, y: 22, w: 92, h: 44, kind: "b" }, { x: 104, y: 22, w: 50, h: 13, kind: "" }, { x: 104, y: 39, w: 50, h: 13, kind: "" }, { x: 104, y: 56, w: 50, h: 10, kind: "" }, { x: 6, y: 72, w: 148, h: 30, kind: "" }] },
  { k: "editorial", n: "Editorial", d: "Words first. A headline, then what you have written, with a narrower column beside it.", w: "Writing, research, opinion, anywhere the words are the product.",
    bars: [{ x: 6, y: 6, w: 148, h: 10, kind: "h" }, { x: 6, y: 22, w: 100, h: 12, kind: "b" }, { x: 6, y: 40, w: 100, h: 62, kind: "" }, { x: 112, y: 22, w: 42, h: 34, kind: "" }, { x: 112, y: 62, w: 42, h: 40, kind: "" }] },
  { k: "onepage", n: "One long page", d: "Everything on a single page, with a menu at the top that jumps down it.", w: "A single service or a new business with one thing to say.",
    bars: [{ x: 6, y: 6, w: 148, h: 10, kind: "h" }, { x: 6, y: 21, w: 148, h: 22, kind: "b" }, { x: 6, y: 47, w: 148, h: 15, kind: "" }, { x: 6, y: 66, w: 148, h: 15, kind: "" }, { x: 6, y: 85, w: 148, h: 17, kind: "" }] },
];
