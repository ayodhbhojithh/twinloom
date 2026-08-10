"use client";

import { useEffect, useRef, useState } from "react";

import { outline, type Cuts } from "@/components/home/notched-card";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The working surface, cut the way the landing card is cut.

   The home page states the rule this site is built on: one large surface, and
   anything you can press stands in a piece cut out of it rather than floating
   on top. This is that surface with a question inside it instead of a
   photograph - the notch at the top holds the way between steps, the bite at
   the bottom left holds what the answers add up to, and the corner cut holds
   the way on.

   The cut is on a layer of its own behind the content. Clipping the card
   itself would clip the words in it, and a step's answers cannot be allowed to
   disappear into a notch. So the ground is clipped and the content sits above
   it, held clear of the cuts by padding worked out from the same numbers.

   The geometry is the landing card's, imported rather than copied. Two copies
   of these arcs would curve by different amounts within a week, and the point
   is that the site is drawn by one hand.
--------------------------------------------------------------------------- */

export function Stage({
  toolbar,
  stickyBar,
  corner,
  aside,
  foot,
  scrollKey,
  tone = "canvas",
  top = false,
  className,
  children,
}: {
  /** Stands in the notch at the top: the way between steps. */
  toolbar?: React.ReactNode;
  /**
   * The bar lifts out of the notch and holds under the header.
   *
   * A step can be far taller than a screen - the industry list alone is
   * fifty-five rows - and the bar is the only thing on the surface saying which
   * of ten steps this is and the only way to leave for another. Read a long one
   * and it goes with the top of the card.
   *
   * So where a surface asks for it, the bar is in the flow at the top edge
   * rather than pinned to it, and sticks as the card scrolls past. The top edge
   * closes behind it: a notch with nothing standing in it is not a quieter
   * toolbar, it is a bite taken out of the edge for no reason. And it only ever
   * happens where there is something to scroll, because a surface that fits the
   * screen never reaches the line that lifts it.
   */
  stickyBar?: boolean;
  /**
   * Start the content at the top and let it scroll, rather than centring
   * it in whatever room there is.
   *
   * Centred is right for a step: a question that fills a third of a tall
   * surface should sit where the eye already is, not against the ceiling.
   * It is wrong for a surface that is the height of the window and holds a
   * list that grows - the desk was opening with its heading halfway down
   * the screen and a screenful of nothing above it, and would have pushed
   * its own top out of view once the list got long.
   */
  top?: boolean;
  /** Stands in the corner cut at the bottom right: the way on. */
  corner?: React.ReactNode;
  /** Stands in the bite at the bottom left: what the answers add up to. */
  aside?: React.ReactNode;
  /**
   * Stands on the bottom edge, in the span between the two bottom cuts.
   *
   * Not another slot in a cut - the free middle of the edge the bite and the
   * drop leave between them. The content above it keeps the room it has and
   * shares whatever is left over, so a short step is still centred and this is
   * still on the floor.
   */
  foot?: React.ReactNode;
  /**
   * What is on the surface. When it changes, the surface takes the reader to
   * its own top.
   */
  scrollKey?: string;
  /**
   * The ground. `canvas` is the warm paper the run-through sits on; `field` is
   * white, for a surface that opens over the page and has to separate itself
   * from the canvas behind it. `plain` lays down no ground at all, for a step
   * that is its own cards rather than one surface holding them - the page
   * shows straight through and the cards do the separating.
   */
  tone?: "canvas" | "field" | "plain";
  className?: string;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.clientWidth, h: node.clientHeight });

    const watcher = new ResizeObserver(measure);
    watcher.observe(node);
    measure();

    return () => watcher.disconnect();
  }, []);

  /* Changing what the surface shows means the thing somebody just pressed is
     now a screen above them, and they are looking at the empty foot of a
     question they cannot see the top of. So the surface brings itself back up.

     Skipped on the first render, because arriving at the page is not a change
     and nobody wants to be scrolled the moment they land. */
  const landed = useRef(false);

  useEffect(() => {
    if (!landed.current) {
      landed.current = true;
      return;
    }

    const node = box.current;
    if (!node) return;

    const top = node.getBoundingClientRect().top + window.scrollY;
    const header =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ),
      ) || 53;

    if (window.scrollY <= top - header - 24) return;

    window.scrollTo({
      top: Math.max(0, top - header - 16),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [scrollKey]);

  /* Whether the bar has left the notch.

     Measured off the surface's own top edge against the header, because that is
     the line the bar stops at. A listener rather than an observer: the answer is
     a comparison between two numbers that both change on scroll, and an
     `IntersectionObserver` would need a sentinel and a root margin to say the
     same thing less directly. */
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!stickyBar || !node) return;

    let frame = 0;

    const settle = () => {
      frame = 0;

      const head =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) || 53;

      setLifted(node.getBoundingClientRect().top < head - 1);
    };

    const again = () => {
      if (!frame) frame = requestAnimationFrame(settle);
    };

    settle();
    window.addEventListener("scroll", again, { passive: true });
    window.addEventListener("resize", again);

    return () => {
      window.removeEventListener("scroll", again);
      window.removeEventListener("resize", again);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [stickyBar]);

  /* One flare and one radius, and every cut is built from them, exactly as on
     the landing card. The notch is as deep as the flare plus the corner
     because that is where the two arcs meet; any other number leaves a
     straight wall between them.

     Everything is then held inside what the surface can actually give: on a
     narrow screen a bar plus two flares can want more room than the top edge
     has, and a path that overruns its own box folds inside out. */
  /* The notch is cut while the bar is standing in it, and closed once it has
     lifted out. The bar's own numbers are kept either way, because the room it
     occupies in the flow must not change when the edge closes - a card that
     shuffles its content up by forty pixels at the moment of sticking is worse
     than one that never stuck. */
  const inNotch = Boolean(toolbar) && !lifted;

  const geo = (() => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    const radius = Math.max(20, Math.min(w * 0.02 + 14, 32));
    const flare = Math.max(22, Math.min(h * 0.03, 28));

    /* Collapsed when nothing stands in it, exactly as the other two cuts are.
       A notch with nothing in it is not a quieter version of the toolbar - it
       is a bite taken out of the top edge for no reason, and it reads as a
       surface that has broken rather than one that was drawn. */
    const barDepth = toolbar ? flare * 2 : 0.01;
    /* The bar takes what it needs and no more. It held two fifths of the top
       edge, which on a middling screen left too little either side of it for
       the heading to stand beside it - so the heading dropped underneath and
       the whole left corner sat empty. */
    const barWidth = toolbar
      ? Math.min(
          Math.max(flare * 2 + 170, Math.min(w * 0.3, 380)),
          Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 8),
        )
      : 0.01;

    /* One size for both cuts. The corner needs `flare * 2` before its arcs
       overlap, and the fourteen on top of that is the air round a 44px
       control. */
    const cut = Math.max(flare * 2 + 22, Math.min(w * 0.08, 96));
    const bite = cut;
    const drop = cut;

    return {
      /** The bar's own size, whether or not the edge is cut for it. */
      barRoom: { width: barWidth, depth: barDepth },
      radius,
      barWidth: inNotch ? barWidth : 0.01,
      barDepth: inNotch ? barDepth : 0.01,
      barRadius: inNotch ? flare : 0.01,
      barFlare: inNotch ? flare : 0.01,
      biteWidth: aside ? bite : 0.01,
      biteHeight: aside ? bite : 0.01,
      biteRadius: aside ? flare : 0.01,
      biteFlare: aside ? flare : 0.01,
      dropWidth: corner ? drop : 0.01,
      dropHeight: corner ? drop : 0.01,
      dropRadius: corner ? flare : 0.01,
      dropFlare: corner ? flare : 0.01,
    };
  })();

  const {
    barRoom,
    ...cut
  }: { barRoom: { width: number; depth: number } } & Cuts = geo;

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  /* The room to the left of the notch.

     The bar is centred and narrow, so on a wide surface there is a column of
     empty top edge either side of it. The heading belongs in the left one -
     level with the notch rather than below it - and the only thing standing
     between the two is width. Below the floor there is not enough of it to
     hold a heading, and the content goes back under the bar instead. */
  const pad = Math.max(20, Math.min(size.w * 0.032, 34));
  const beside = Boolean(toolbar) && (size.w - barRoom.width) / 2 - pad >= 240;
  const headRoom = beside
    ? `${Math.round((size.w - barRoom.width) / 2 - pad - 16)}px`
    : "62ch";

  return (
    <div ref={box} className={cn("relative flex flex-col", className)}>
      {/* The ground. Nothing but a shape: it carries no content, so clipping
          it costs nothing and the words above it stay whole.

          Skipped for `plain` - there is no shape to want, because there is no
          fill to clip it from. */}
      {tone === "plain" ? null : (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0",
            tone === "field" ? "glass-pane" : "glass",
          )}
          style={{ clipPath: path ? `path("${path}")` : undefined }}
        />
      )}

      {/* The three slots sit above the content, not behind it. They are
          absolute and the content is in normal flow after them, so without a
          stacking order of their own the content painted over the cuts and
          swallowed every press meant for the controls standing in them.

          The bar is the exception where the surface asks for it. Pinned to the
          top edge it goes with the top edge, so on a step three screens long
          there is nothing left saying which step it is. In the flow it can be
          sticky, which means it stands in the notch until the notch reaches the
          header and holds there afterwards - and because it occupies its own
          room either way, the content below it does not move when it lifts. */}
      {toolbar ? (
        stickyBar ? (
          <div
            className="sticky top-(--nav-height) z-20 mx-auto flex items-start justify-center"
            style={{
              width: barRoom.width,
              height: barRoom.depth,
              paddingTop: 2,
            }}
          >
            {/* A ground of its own, and only once it has left the notch. In the
                notch it needs none - the notch is already a shape cut out of the
                surface - but travelling down over the answers it has to be read
                against them, and a pill with no fill over a list of options is
                two things in the same place. */}
            <div
              className={cn(
                "flex max-w-full items-center rounded-pill transition-colors duration-200",
                lifted ? "bg-field" : "bg-transparent",
              )}
            >
              {toolbar}
            </div>
          </div>
        ) : (
          <div
            className="absolute top-0 left-1/2 z-20 flex -translate-x-1/2 items-start justify-center"
            style={{ width: cut.barWidth, height: cut.barDepth, paddingTop: 2 }}
          >
            {toolbar}
          </div>
        )
      ) : null}

      {aside ? (
        <div
          className="absolute bottom-0 left-0 z-20 flex items-end"
          style={{ width: cut.biteWidth - 12, height: cut.biteHeight - 12 }}
        >
          {aside}
        </div>
      ) : null}

      {corner ? (
        <div
          className="absolute right-0 bottom-0 z-20 flex items-center justify-center"
          style={{ width: cut.dropWidth, height: cut.dropHeight }}
        >
          {corner}
        </div>
      ) : null}

      {/* The content, held clear of every cut by the numbers that made them.

          `min-h-full` and a centred column: the surface has a floor so its
          cuts have room to be cuts, and a short answer used to sit against the
          top of it with the rest of the card empty underneath. Centred, the
          empty room is shared above and below instead of all falling to the
          bottom, and the question sits where the eye already is. */}
      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col",
          top
            ? "quiet-scroll min-h-0 justify-start overflow-y-auto"
            : "justify-center",
        )}
        style={{
          /* Under the notch, not a whole band under it. The bar is only as
             deep as its own arcs, and on a wide surface it leaves most of the
             top edge free - so the heading starts where the cut ends rather
             than clearing the whole width of it. */
          /* Beside the notch, the top inset is the side inset: the heading is
             then the same distance from the top edge as it is from the left
             one, which is the only reading of "the corner" that holds at every
             width. Under the notch there is no choice - the bar owns that band
             - so it clears the bar and keeps a hair of air below it.

             With no notch at all it is the side inset again. It used to fall
             through to the twelve meant for clearing a bar, so a surface with
             nothing in its top edge - the quick submission is the one - put its
             heading twelve pixels down while holding it thirty from the side.
             The same fault was in `CutPanel` and is fixed there the same way. */
          /* Always clear of the bar, never beside it.

             `beside` was the right answer while a step's heading stood in the
             left corner: on a wide surface there is a column of free top edge
             either side of the notch, and the heading belonged in it. Headings
             are centred now, so they are always under the notch - and taking
             the `beside` branch put the first line of type hard against the
             floor of the cut. */
          /* Under the notch, not a whole band under it, and nothing at all
             where the bar is in the flow: there it has already taken its own
             room above this. */
          paddingTop:
            stickyBar && toolbar ? 20 : toolbar ? barRoom.depth + 20 : pad,
          /* What the heading may take before it would run under the bar. */
          ["--notch-free" as string]: headRoom,
          /* Clear of the bite and then some. The content only has to miss the
             cut to be legal, and a last line that stops exactly where the
             corner starts reads as though it were trimmed by it. */
          /* Clear of whichever bottom cut is actually there, and then some.
             The content only has to miss the cut to be legal, and a last line
             that stops exactly where a corner starts reads as though it were
             trimmed by it. */
          /* With a foot there is nothing to clear. The foot is centred in the
             span the two bottom cuts leave between them, so it is already past
             them sideways at every height - and the band of empty reserved for
             clearing them was exactly what was holding it off the floor. */
          paddingBottom: foot
            ? 30
            : Math.max(
                aside ? cut.biteHeight : 0,
                corner ? cut.dropHeight : 0,
                26,
              ) + 34,
          /* The side inset holds content off the cuts, and a `plain` stage has
             none - no surface, no corners, nothing to be held off.

             Left on, it was a second gutter: the page frame around this
             already sets one, so the chooser sat forty pixels in from a phone
             where every other section sits at twenty, and its cards were
             narrower than the hero above them for no reason anybody could
             see. Nought here means it lines up with the page, which is what
             "the same padding as the hero" is. */
          paddingLeft: tone === "plain" ? 0 : pad,
          paddingRight: tone === "plain" ? 0 : pad,
        }}
      >
        {foot ? (
          <>
            {/* `my-auto` rather than the column's `justify-center`: with two
                things in the column, centring the column centres the pair and
                the foot comes up with it. This shares the leftover room above
                and below the question alone. */}
            <div className="my-auto w-full">{children}</div>

            {/* Held to the span between the cuts. A foot wider than that runs
                under one of them at the width where the cut is largest, and a
                control half inside a bite is a control nobody can press.

                `mt-14` is a floor, not the gap. Where the question is short,
                `my-auto` above has already opened far more than this and the
                margin does nothing; where it is tall enough to fill the
                surface, `my-auto` collapses to nothing and this is the only
                thing keeping the foot off the last line of the answers. */}
            <div
              className="mx-auto mt-14 w-full"
              style={{
                maxWidth: Math.max(
                  200,
                  size.w - 2 * Math.max(cut.biteWidth, cut.dropWidth) - 16,
                ),
              }}
            >
              {foot}
            </div>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/**
 * The plate that stands in a cut.
 *
 * Nothing behind it. The notch is already a shape cut out of the surface, so
 * the controls standing in it need no ground of their own - a pill drawn there
 * as well is a second shape inside the first one, and it was the only opaque
 * thing left on a page made of glass.
 */
export function Plate({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-10 max-w-full items-center gap-0.5 rounded-pill px-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A round control, as the landing card's arrows are drawn. */
export function Disc({
  label,
  onClick,
  tone = "quiet",
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  tone?: "quiet" | "ink";
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-9 flex-none cursor-pointer items-center justify-center rounded-pill transition-colors",
        tone === "ink"
          ? "bg-ink text-white hover:opacity-85"
          : "text-quiet hover:bg-well hover:text-ink",
        disabled &&
          "cursor-default text-planned hover:bg-transparent hover:text-planned",
      )}
    >
      {children}
    </button>
  );
}
