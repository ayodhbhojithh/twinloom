/* ---------------------------------------------------------------------------
   The outline every cut surface on this site is drawn from.

   In a module of its own, and the reason is Fast Refresh rather than tidiness.
   A file that exports a component and a plain function is a file React cannot
   hot-update: the rule is that a module has to export components and nothing
   else, and where it does not, an edit to it reloads the whole page instead of
   swapping the component. `outline` lived beside `NotchedCard`, which is the
   most edited file in this project - so every change to the landing card was a
   full reload of the landing page.

   Four other surfaces read it: the working stage, the boot screen, the cut
   panel and the contact map. They imported it from the card, which meant the
   card was a dependency of all four for the sake of one pure function.
--------------------------------------------------------------------------- */

export interface Cuts {
  /** The card's own corners. */
  radius: number;
  /** The bar at the top: width, depth, its own corners, and the outward curve. */
  barWidth: number;
  /**
   * Where along the top edge it sits.
   *
   * Centred unless this says otherwise. A notch in the middle of an edge is the
   * default because it reads as a piece taken out of a symmetrical thing; at one
   * end it reads as a corner detail, which is what it should be when the edge
   * above it is also carrying a bar of links.
   */
  barRight?: boolean;
  barDepth: number;
  barRadius: number;
  barFlare: number;
  /**
   * A cut taken out of the top right corner: the mirror of `drop`.
   *
   * Optional, like the notch and the bite, and left out by everything that has
   * nothing to stand there. A surface with a way out at the top asks for it -
   * a panel is shut from its top right corner, not from its foot - and a
   * surface whose only controls are at the bottom keeps an ordinary rounded
   * corner there.
   */
  headWidth?: number;
  headHeight?: number;
  headRadius?: number;
  headFlare?: number;
  /** The bite at the bottom left, the same four numbers. */
  biteWidth: number;
  biteHeight: number;
  biteRadius: number;
  biteFlare: number;
  /** The corner taken out at the bottom right, for the way on. */
  dropWidth: number;
  dropHeight: number;
  dropRadius: number;
  dropFlare: number;
  /**
   * A second bar, in the bottom edge. Optional: a surface that wants nothing
   * standing there leaves these out and the bottom edge runs straight.
   */
  footWidth?: number;
  footDepth?: number;
  footRadius?: number;
  footFlare?: number;
}

/**
 * The outline, clockwise from just after the top left corner.
 *
 * Two kinds of turn, and telling them apart is the whole job.
 *
 * A cut's own corners curve the way any rounded box curves: the centre of the
 * arc sits inside the cut. Those are the notch's two bottom corners and the
 * bite's inner corner, and they take sweep `0`.
 *
 * A flare is where a cut meets the card's edge, and it curves the other way: the
 * centre of the arc sits in the card, so the edge sweeps outward and the cut is
 * wider at the mouth than at its floor. Those take sweep `1`, the same as the
 * card's own corners.
 *
 * Getting that backwards does not produce a subtle error. It puts the centre of
 * each flare on the wrong side, which turns the gentle sweep into a full
 * quarter-disc bitten out beside the notch, and the card grows two ears.
 */
export function outline(w: number, h: number, cut: Cuts): string {
  const {
    radius: r,
    barWidth: bw,
    barDepth: bd,
    barRadius: br,
    barFlare: bf,
    biteWidth: cw,
    biteHeight: ch,
    biteRadius: cr,
    biteFlare: cf,
    dropWidth: dw,
    dropHeight: dh,
    dropRadius: dr,
    dropFlare: df,
    footWidth: fw = 0,
    footDepth: fd = 0,
    footRadius: fr = 0,
    footFlare: ff = 0,
    headWidth: hw = 0,
    headHeight: hh = 0,
    headRadius: hr = 0,
    headFlare: hf = 0,
  } = cut;

  /* Where the top edge is cut from and to.

     Centred by default. Held hard against the corner when asked: the notch's
     own flare ends exactly where the card's corner arc begins, so there is no
     straight edge between them at all. One curve runs out of the notch and
     straight into the corner, and the cut reads as a piece taken out of the
     corner rather than as a notch parked near one. */
  const right = cut.barRight ? w : (w + bw) / 2;
  const left = right - bw;

  /* A cut asked for at nothing is not a tiny cut - it is no cut, and the corner
     it would have eaten has to come back as an ordinary rounded corner.
     Collapsing the numbers instead leaves a square corner where every other one
     on the card is round, which reads as a surface that has broken rather than
     one that was drawn. */
  const off = (a: number, b: number) => a < 1 || b < 1;

  const bite = off(cw, ch)
    ? [`L ${r} ${h}`, `A ${r} ${r} 0 0 1 0 ${h - r}`]
    : [
        `L ${cw + cf} ${h}`,
        `A ${cf} ${cf} 0 0 1 ${cw} ${h - cf}`,
        `L ${cw} ${h - ch + cr}`,
        `A ${cr} ${cr} 0 0 0 ${cw - cr} ${h - ch}`,
        `L ${cf} ${h - ch}`,
        `A ${cf} ${cf} 0 0 1 0 ${h - ch - cf}`,
      ];

  const drop = off(dw, dh)
    ? [`L ${w} ${h - r}`, `A ${r} ${r} 0 0 1 ${w - r} ${h}`]
    : [
        `L ${w} ${h - dh - df}`,
        `A ${df} ${df} 0 0 1 ${w - df} ${h - dh}`,
        `L ${w - dw + dr} ${h - dh}`,
        `A ${dr} ${dr} 0 0 0 ${w - dw} ${h - dh + dr}`,
        `L ${w - dw} ${h - df}`,
        `A ${df} ${df} 0 0 1 ${w - dw - df} ${h}`,
      ];

  /* The bottom bar, travelling right to left along the bottom edge - which is
     why every sweep in it is the mirror of the one at the top. The flares still
     curve outward from the card and take sweep 1; the notch's own corners curve
     the other way and take sweep 0. */
  const footLeft = (w - fw) / 2;
  const footRight = footLeft + fw;

  const footBar = off(fw, fd)
    ? []
    : [
        `L ${footRight + ff} ${h}`,
        `A ${ff} ${ff} 0 0 1 ${footRight} ${h - ff}`,
        `L ${footRight} ${h - fd + fr}`,
        `A ${fr} ${fr} 0 0 0 ${footRight - fr} ${h - fd}`,
        `L ${footLeft + fr} ${h - fd}`,
        `A ${fr} ${fr} 0 0 0 ${footLeft} ${h - fd + fr}`,
        `L ${footLeft} ${h - ff}`,
        `A ${ff} ${ff} 0 0 1 ${footLeft - ff} ${h}`,
      ];

  /* Held to the right, the notch is not a notch in the top edge at all - it is
     the top right corner, taken out. The edge runs from the left, flares down
     into the cut, crosses its floor, and then turns straight down the card's
     right side. There is no top right corner left to draw: the card's own radius
     is spent on the turn at the bottom of the cut instead, which is the corner
     now.

     Which is why this cannot be the centred version with different numbers. A
     centred notch has card on both sides of it and needs a flare at each end; a
     cornered one has card on one side and the window on the other. */
  const cornerBar = [
    `L ${left - bf} 0`,
    `A ${bf} ${bf} 0 0 1 ${left} ${bf}`,
    `L ${left} ${bd - br}`,
    `A ${br} ${br} 0 0 0 ${left + br} ${bd}`,
    `L ${w - r} ${bd}`,
    `A ${r} ${r} 0 0 1 ${w} ${bd + r}`,
  ];

  const bar = off(bw, bd)
    ? []
    : cut.barRight
      ? cornerBar
      : [
          `L ${left - bf} 0`,
          `A ${bf} ${bf} 0 0 1 ${left} ${bf}`,
          `L ${left} ${bd - br}`,
          `A ${br} ${br} 0 0 0 ${left + br} ${bd}`,
          `L ${right - br} ${bd}`,
          `A ${br} ${br} 0 0 0 ${right} ${bd - br}`,
          `L ${right} ${bf}`,
          `A ${bf} ${bf} 0 0 1 ${right + bf} 0`,
        ];

  /* The top right corner: nothing where the notch has taken it, a cut of its
     own where something stands there, and an ordinary rounded corner
     otherwise.

     The same six commands the notch is built from, turned to face the other
     way: come along the top edge, flare down into the cut, cross its floor,
     turn its inner corner, and flare out onto the right side. The two flares
     take sweep 1 because they curve away from the cut and into the card; the
     corner between them takes sweep 0 because it curves the way any rounded
     box does. Get those the wrong way round and the card grows an ear here in
     exactly the way it does anywhere else on this path. */
  const topRight =
    cut.barRight && !off(bw, bd)
      ? []
      : off(hw, hh)
        ? [`L ${w - r} 0`, `A ${r} ${r} 0 0 1 ${w} ${r}`]
        : [
            `L ${w - hw - hf} 0`,
            `A ${hf} ${hf} 0 0 1 ${w - hw} ${hf}`,
            `L ${w - hw} ${hh - hr}`,
            `A ${hr} ${hr} 0 0 0 ${w - hw + hr} ${hh}`,
            `L ${w - hf} ${hh}`,
            `A ${hf} ${hf} 0 0 1 ${w} ${hh + hf}`,
          ];

  return [
    `M ${r} 0`,
    /* Top edge, and the notch in it where there is one. */
    ...bar,
    /* On to the top right corner and down the right side. */
    ...topRight,
    /* The bottom right corner, given up to the cut where there is one. */
    ...drop,
    /* Bottom edge, leftward: the notch in it where there is one, then the bite
       at the other end. */
    ...footBar,
    ...bite,
    /* Up the left side to where we started. */
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    "Z",
  ].join(" ");
}
