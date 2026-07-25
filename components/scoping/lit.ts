/**
 * What "chosen" looks like on this page.
 *
 * No outline. An outline around a chosen row is the laziest way to say it is
 * chosen: it draws a box, and eight boxes down a column read as a form rather than
 * as answers. The row lights up instead. A wash of its own colour leans in from the
 * left and fades out before the right edge, a soft glow of the same colour settles
 * underneath so the row sits slightly off the page, and a one pixel white highlight
 * along the top edge gives it a lit surface.
 *
 * That is three cues, none of them a line, all of them the effort's own colour. The
 * design canvas calls this "circles light up as you add them"; this is the same
 * idea applied to a row.
 */
export function lit(colour: string) {
  return {
    background: `linear-gradient(100deg, color-mix(in oklab, ${colour} 13%, white), white 72%)`,
    boxShadow: [
      `0 6px 20px -12px color-mix(in oklab, ${colour} 85%, transparent)`,
      "inset 0 1px 0 rgba(255,255,255,0.9)",
    ].join(", "),
  };
}

/**
 * The tick box when it is on: filled solid, with a soft halo of itself around it
 * rather than a ring. The halo is what makes it read as switched on rather than
 * merely coloured in.
 */
export function litTick(colour: string) {
  return {
    background: colour,
    boxShadow: `0 0 0 3px color-mix(in oklab, ${colour} 16%, transparent)`,
  };
}
