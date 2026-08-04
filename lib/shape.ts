/* ---------------------------------------------------------------------------
   The card with a corner given up.

   The site is built on one rule: a surface, and anything you can press stands
   in a piece cut out of it rather than floating on top. The landing card's
   `outline` draws the large version of that, with a notch, a bite and a corner.
   This is the small version - a rounded rectangle that gives up one corner for
   the mark that stands in it.

   Written out rather than borrowed from `outline`, because that path carries a
   notch and a bite a small card has no use for, and mirroring it to move the
   cut carries a squared off corner along with it.

   One flare and one radius, and both cuts are built from them. A flare is where
   the cut meets an edge and curves outward, so its centre sits inside the card
   and it takes sweep 1. The cut's own inner corner curves the other way and
   takes sweep 0. Getting those backwards does not produce a subtle error - it
   bites a quarter disc out beside the cut.
--------------------------------------------------------------------------- */

/**
 * A card of `w` by `h` with a square of side `c` taken out of its bottom right
 * corner, rounded by `r` and flared into its edges by `f`.
 *
 * Every size produces the same commands in the same order, which is what lets
 * a browser interpolate one into another: a clip path can only animate into a
 * path built the same way.
 */
export function cutCardPath(
  w: number,
  h: number,
  c: number,
  r: number,
  f: number,
) {
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - c - f}`,
    `A ${f} ${f} 0 0 1 ${w - f} ${h - c}`,
    `L ${w - c + r} ${h - c}`,
    `A ${r} ${r} 0 0 0 ${w - c} ${h - c + r}`,
    `L ${w - c} ${h - f}`,
    `A ${f} ${f} 0 0 1 ${w - c - f} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
}
