"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  LayoutGrid,
  Expand,
  PencilLine,
} from "lucide-react";

import { ROUTES, SISTER } from "@/lib/site";
import { cn } from "@/lib/utils";

import { outline, type Cuts } from "./outline";
import { DotField } from "./dot-field";
import { BeadTrail, MarkStage } from "./mark-stage";
import { ProjectPanel } from "./project-panel";

import { HERO_SLIDES } from "./hero-slides";

/* ---------------------------------------------------------------------------
   The three grounds that cost something, fetched when they are first shown.

   This card has five screens and four of them are cheap: type, a drawing, a
   field of dots drawn once. The other three are not - and until now all three
   were in the same bundle as the card itself, so every visitor downloaded the
   lot before the first screen could be interactive, whether or not they ever
   turned to the second.

   The pit is the expensive one by a distance: it is a WebGL scene, and three.js
   is around three quarters of a megabyte of JavaScript before a single sphere is
   drawn. It sat on the critical path of the landing page to draw the second
   slide of five. On a mid-range phone that is a second or so of parsing before
   anything on the page answers to a touch.

   Split out, each arrives when its own screen is first asked for. The cost is a
   moment of ground colour the first time somebody turns to one of them, which is
   the honest place to spend it: it is paid by the person who asked for that
   screen, once, instead of by everybody on arrival.

   `ssr: false` on all three because all three are canvases. There is nothing for
   a server to render and nothing to hydrate - rendering them on the server would
   emit an empty element and then throw it away.
--------------------------------------------------------------------------- */

const Ballpit = dynamic(() => import("./ballpit").then((m) => m.Ballpit), {
  ssr: false,
});

const ParticleCanvas = dynamic(
  () => import("@/components/ui/ParticleCanvas").then((m) => m.ParticleCanvas),
  { ssr: false },
);

const FilmStage = dynamic(
  () => import("./film-stage").then((m) => m.FilmStage),
  { ssr: false },
);
import { type Project } from "./projects";

/**
 * What stands in the notch, measured rather than estimated.
 *
 * Three 36px controls, a 2px gap between each pair, and 6px of padding at each
 * end of the pill holding them. Written from the same numbers the markup below
 * uses, because the notch is sized to hold this and a notch sized to hold a
 * guess is a notch the bar hangs out of.
 */
/**
 * The bar in the notch, measured rather than guessed.
 *
 * Three 36px controls, the plate's own padding, and the air either side. The
 * notch is sized from this, so it can never come out narrower than the thing
 * standing in it - which is what put three arrows outside their own cut on a
 * phone.
 */
const TOOL = 36;
const BAR = TOOL * 3 + 2 * 2 + 6 * 2;

/**
 * The same three controls, at the size a phone can spare.
 *
 * The notch is measured from what stands in it, so a 124-point bar cut a notch
 * a third of the way across a 340-point card - and the wordmark on one side of
 * it and the menu button on the other were left fighting for what was left. At
 * thirty they take a quarter, which is the difference between three things
 * sharing a row and three things crowding one.
 *
 * Twenty-six, which is under the forty a guideline would ask for and is the
 * right number here anyway: these sit in a cut in the top edge of a card that
 * fills the screen, with nothing within a thumb's width of them in any
 * direction. What a size floor protects against is hitting the wrong thing, and
 * there is no wrong thing to hit - so the cost of the extra points was a notch
 * a third of the way across a phone, and no benefit against it.
 */
const TOOL_TIGHT = 26;
const BAR_TIGHT = TOOL_TIGHT * 3 + 2 * 2 + 6 * 2;

/** Where the card stops being able to afford the full-size bar. */
const TIGHT = 640;

/**
 * How the first screen arrives: one thing after another, up into place.
 *
 * The whole block used to fade as a single object, and only when the card was
 * turned - `AnimatePresence` was set not to run on the first render, so on the
 * screen somebody actually lands on nothing moved at all. What is wanted here
 * is the opposite: the screen you arrive on is the one worth composing, and a
 * headline that settles a beat before the line under it is a page being read
 * to you in the order it was written.
 *
 * Small numbers on purpose. Eighteen pixels and about six tenths of a second
 * each, eighty-five milliseconds apart - enough that the order registers, not
 * so much that anybody waits for it. The whole run is over in a little over a
 * second, which is about as long as it takes to look from the top of a headline
 * to the bottom of it.
 *
 * A shade longer than it was at every one of those numbers. Half a second and
 * seventy apart was quick enough that each line was most of the way up before
 * the eye had found it, so the run read as five things appearing rather than as
 * one thing arriving in order - and a stagger nobody can follow is a stagger
 * paying for nothing. The extra tenth is what makes it legible as a sequence.
 *
 * And a shorter travel over that longer time, which is the other half of
 * smoothness. A block covering eighteen pixels in half a second moves fast
 * enough that a dropped frame is a visible step; the same block covering twelve
 * in seven tenths moves at under half that speed, where a dropped frame is a
 * pause nobody can find. The distance was never the point - the arriving is.
 *
 * The ease is nearly all at the end: things start quickly and settle slowly,
 * which is how a thing with weight comes to rest. A symmetrical curve spends
 * half its time getting going and reads as hesitation.
 */
const HERO_RUN = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.085, delayChildren: 0.08 } },
} as const;

const HERO_RISE = {
  hidden: { opacity: 0, y: 12 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

/**
 * The artwork's own arrival, which is not a rise.
 *
 * It comes up from slightly under its size rather than from below, because a
 * picture that slides has a direction and this one is meant to be the still
 * point the words are arranged around. A scale is the one transform it may
 * have: it is on the element itself, and the blend and the mask this file has
 * fought over twice are on the image inside it.
 */
/**
 * The film's titles, and where each one stands.
 *
 * Not one headline revealed word by word. That is a reveal, and a reveal
 * happens once; a reel that runs for four screenfuls of scrolling wants a
 * sequence, which is what a title card is. So this is four of them, each with
 * its own place on the frame, its own moment, and its own way in and out.
 *
 * And every one of them is about a website.
 *
 * They read "TwinLoom film", "on set", "filmed, cut and graded here" - which is
 * true, and is the wrong thing to be true on this page. A visitor who lands on a
 * reel captioned like a production company concludes we are one, and the four
 * words they take away are about a shoot rather than about what we sell. The
 * footage is the demonstration, not the offer: what this screen is showing is
 * the kind of site a clothing shop gets, so that is what its titles say.
 *
 * The first is already on screen before anybody touches the wheel - its window
 * opens before nought - because a picture with nothing on it gives no reason to
 * scroll, and the whole point of this screen is that somebody does.
 *
 * No two arrive the same way or in the same place. Four lines fading up from
 * one corner is a slideshow; one rising off the floor, one entering from the
 * left, one from the right and one settling in the middle is a film with
 * titles on it. The direction is chosen against the place - a line at the left
 * edge comes in from the left, so it enters from off the frame rather than from
 * nowhere.
 *
 * Windows are `[in, out]` as shares of the reel, and the last one has no exit:
 * whatever is on screen when the scrolling stops should be the thing worth
 * being left with.
 *
 * Each is three parts rather than one line: a small kicker, then a sentence
 * split across white and ink. The split is what makes them readable on this
 * particular film - it is pale and busy, so white holds against the shadowed
 * folds and vanishes on the bright floor, and ink does the reverse. Giving each
 * half the colour that survives where it sits also gives the sentence a stress,
 * and the stress lands on the half that matters.
 */
const TITLES = [
  {
    over: "A website we built",
    lead: "Your clothing",
    tail: "store.",
    place: "bottom-left",
    from: "up",
    show: [-0.04, 0.02],
    hide: [0.16, 0.24],
  },
  {
    over: "Brand, shop, checkout",
    lead: "Built as",
    tail: "one piece.",
    place: "top-left",
    from: "left",
    show: [0.26, 0.34],
    hide: [0.46, 0.54],
  },
  {
    over: "Made to move",
    lead: "Your scroll",
    tail: "runs it.",
    place: "middle-right",
    from: "right",
    show: [0.56, 0.64],
    hide: [0.74, 0.82],
  },
  {
    over: "Whatever you sell",
    lead: "Yours could",
    tail: "look like this.",
    place: "bottom-left",
    from: "scale",
    show: [0.84, 0.92],
    hide: null,
  },
] as const;

/**
 * Where on the frame a title stands, and how much of it it may take.
 *
 * The measure is part of the position rather than one number for all four,
 * because what a line can afford depends on where it is. The two on the left
 * have the open half of the frame to themselves and take three fifths of it;
 * the one on the right has the buttons under it and takes less.
 *
 * The share grows with the type. Raising the size inside a fixed measure does
 * not make a headline bigger, it makes it wrap sooner - the words get larger and
 * the block gets taller and narrower, which is the opposite of what was asked
 * for. The two move together.
 *
 * Capped in per cent rather than characters. A `ch` cap is a measure for prose,
 * where the job is to stop a line running past what an eye can track back from -
 * and these are not prose, they are two or three words set very large. At
 * fifteen characters "Your clothing store." broke across three lines and left a
 * column of type down one edge of a wide frame, which is a poster with the
 * margins wrong. A share of the frame lets each half sit on its own line wherever
 * there is room for it, and only wraps where there genuinely is not.
 */
const PLACE: Record<string, string> = {
  /* The bottom two sit high on a phone, where the doors take the foot of the
     frame - and the measures open to the whole width there, because a share of
     a narrow screen is a column two words wide. */
  "bottom-left":
    "bottom-[34%] left-0 max-w-full text-left sm:bottom-[12%] sm:max-w-[76%]",
  "top-left": "top-0 left-0 max-w-full text-left sm:max-w-[76%]",
  "middle-right":
    "top-1/2 right-0 max-w-[70%] -translate-y-1/2 text-right sm:max-w-[54%]",
};

/**
 * A title's opacity and offset at this point in the reel.
 *
 * Two ramps rather than one: what fraction of the way in it is, and what
 * fraction of the way back out. Multiplying them gives a line that arrives,
 * holds while neither ramp is running, and leaves - which is what a title card
 * does and what a single fade cannot.
 *
 * Both are cubed at the end so a line settles rather than stops. The offset is
 * only on the way in: a title that slides out the way it came reads as a
 * mistake being undone, where one that simply goes has been read.
 */
const title = (
  at: number,
  show: readonly [number, number],
  hide: readonly [number, number] | null,
  from: string,
) => {
  const ramp = (a: number, b: number) =>
    Math.min(1, Math.max(0, (at - a) / (b - a)));

  const inAt = 1 - (1 - ramp(show[0], show[1])) ** 3;
  const outAt = hide ? ramp(hide[0], hide[1]) : 0;
  const away = 1 - inAt;

  const move =
    from === "left"
      ? `translateX(${-away * 46}px)`
      : from === "right"
        ? `translateX(${away * 46}px)`
        : from === "scale"
          ? `scale(${1 - away * 0.06})`
          : `translateY(${away * 34}px)`;

  return {
    opacity: inAt * (1 - outAt),
    transform: move,
  };
};

const HERO_MARK = {
  hidden: { opacity: 0, scale: 0.94 },
  shown: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

export function NotchedCard({ className }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });

  const [at, setAt] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);

  /* How far through the reel the film screen has been scrolled, so the words
     over it arrive with it rather than sitting there from the first frame.
     Nought on every other screen, which never sets it. */
  /* Where the film has been scrolled to, and it is deliberately not state here.

     It was: one number, set fifty times over the length of the reel, held on
     this component. This component is two thousand lines and five screens, so
     every one of those fifty was a full reconciliation of the card - its cut
     recomputed, all five screens diffed - to move a headline a few pixels. On a
     desk that is invisible; on a mid-range phone it is the wheel feeling heavy
     exactly while somebody is scrubbing a film.

     The number goes straight to the one component that draws with it instead.
     `FilmWords` hands its own setter up through `bind`, this holds it in a ref,
     and the reel calls it - so a scrub re-renders four lines of type and nothing
     else. */
  const reel = useRef<((along: number) => void) | null>(null);

  const bindReel = useCallback((tell: ((along: number) => void) | null) => {
    reel.current = tell;
  }, []);

  const tellReel = useCallback((along: number) => reel.current?.(along), []);

  /* No clock. The card turns when somebody turns it - the arrows, the thumbnail
     and the keyboard all do it - and nothing moves it on its own. A carousel
     that advances by itself takes the picture out from under whoever is looking
     at it, and the first slide here is a film, which is motion enough. */

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

  /* Turning the card with a thumb.
   *
   * The three controls in the notch are the way through this on a desk, and on a
   * phone they are a 26px target in the middle of the top edge - reachable, but
   * not what anybody's hand does with a card that has five faces. A swipe is,
   * and a card that ignores one reads as a picture rather than as a thing you
   * can turn.
   *
   * Touch listeners rather than pointer ones, deliberately: this should happen
   * for a thumb and not for a mouse dragged across the card. A mouse has the
   * arrows, and the pit on the second screen answers to a pointer drag by moving
   * its spheres - turning the card underneath that would be two things
   * responding to one gesture.
   *
   * Read at the end rather than followed as it goes. Following it means the card
   * has to move with the finger, which means the five screens have to exist side
   * by side to be moved - and four of them are canvases. What this does instead
   * is decide, once, what the gesture was: the card crossfades exactly as it
   * does from the arrows, and nothing is mounted that was not already.
   *
   * Three tests, and all three are needed. Far enough that a tap with a wobble
   * in it is not a swipe; quick enough that a finger resting and later lifting
   * somewhere else is not one either; and more sideways than up, or every scroll
   * down the page that drifts a little would turn the card under the reader's
   * hand. The ratio is what makes vertical scrolling safe, so it is deliberately
   * generous - a gesture has to be clearly horizontal to count.
   *
   * Passive, and nothing is prevented. The page must stay scrollable through the
   * card at all times: a swipe that turns out to be a scroll has to have been
   * scrolling the whole way down, not from the moment this decided it was not
   * interested.
   */
  useEffect(() => {
    const node = box.current;
    if (!node) return;

    /* How far, how fast, and how straight a swipe has to be. */
    const FAR = 56;
    const QUICK = 600;
    const STRAIGHT = 1.6;

    let x = 0;
    let y = 0;
    let at = 0;
    let live = false;

    const start = (event: TouchEvent) => {
      /* One finger. Two is a pinch, and a pinch that ends wide of where it
         began is not somebody asking for the next screen. */
      if (event.touches.length !== 1) {
        live = false;
        return;
      }

      const touch = event.touches[0];
      x = touch.clientX;
      y = touch.clientY;
      at = event.timeStamp;
      live = true;
    };

    const end = (event: TouchEvent) => {
      if (!live) return;
      live = false;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - x;
      const dy = touch.clientY - y;

      if (event.timeStamp - at > QUICK) return;
      if (Math.abs(dx) < FAR) return;
      if (Math.abs(dx) < Math.abs(dy) * STRAIGHT) return;

      /* Left takes you forward, which is the direction the card moves rather
         than the direction the finger does - the same way a page of anything is
         turned. */
      setAt(
        (was) =>
          (was + (dx < 0 ? 1 : -1) + HERO_SLIDES.length) % HERO_SLIDES.length,
      );
    };

    const drop = () => {
      live = false;
    };

    node.addEventListener("touchstart", start, { passive: true });
    node.addEventListener("touchend", end, { passive: true });
    node.addEventListener("touchcancel", drop, { passive: true });

    return () => {
      node.removeEventListener("touchstart", start);
      node.removeEventListener("touchend", end);
      node.removeEventListener("touchcancel", drop);
    };
  }, []);

  /* Which slide is showing, read before the geometry rather than after it.

     It used to come later, because the cuts were the same on every screen and
     the shape had no reason to know what was standing on it. The notch changed
     that: the picture screens do not cut one, so `outline` needs the view. */
  const shown = HERO_SLIDES[at];

  /**
   * The four numbers that decide whether this looks drawn or assembled.
   *
   * The flare is the outward curve where a cut meets the card's edge, and it has
   * to be about as large as the cut is deep. Smaller than that and the edge drops
   * into the notch rather than sweeping into it, which is the difference between
   * a shape and a hole. The bar's own corners are half its depth, which makes it
   * a pill rather than a rounded box.
   *
   * Everything scales with the card and is then held inside what the card can
   * actually give: on a narrow screen a bar plus two flares can want more room
   * than the top edge has, and a path that overruns its own box folds inside out.
   */
  /**
   * Both cuts, from one set of numbers.
   *
   * There is one flare and one corner radius on this card, and the top notch and
   * the bottom bite are both built from them. Given two of each they drift, and a
   * card whose two cuts curve by different amounts looks like two decisions
   * rather than one.
   *
   * The depth of the notch is not chosen at all: it is the flare plus the corner,
   * which is exactly where those two arcs meet. Any other number puts a straight
   * wall between them, and the cut reads as a shallow shelf with a deeper notch
   * inside it rather than as one unbroken curve.
   */
  const cut: Cuts = ((): Cuts => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    /* Down from a floor of twenty two and a ceiling of forty eight.

       The card fills the window now, and a corner is read against what is left
       of the page around it - there used to be a good deal of that and there is
       almost none. At forty eight the card looked like a phone in a case; at
       thirty four the edge is still soft and the shape is still a card. */
    const radius = Math.max(18, Math.min(w * 0.018 + 14, 34));

    /* The one curve every cut on this card is made of. */
    const flare = Math.max(22, Math.min(h * 0.04, 34));

    /* Except the notch, which takes its curve from what stands in it.

       A notch cannot be shallower than twice its own flare: that is where its
       two arcs meet, and any less leaves a straight wall between them. So depth
       and curve are one number, and taking the card's flare gave a notch
       sixty-eight deep on a tall screen to hold a bar forty high - twenty-eight
       pixels of nothing, cut out of the top of the picture.

       This is the same argument the width below already makes. The floor is the
       thing standing in it, measured, not a fraction of the card. Held under the
       card's own flare as well, so on a short screen where the two agree the
       notch is drawn with the same curve as the bite and the corner. */
    const tool = w < TIGHT ? TOOL_TIGHT : TOOL;
    const barFlare = Math.min(flare, (tool + 12) / 2);
    const barDepth = barFlare * 2;

    /* Only as wide as the bar it holds, plus a little air. Wider and the notch
       stops being a place for something and becomes a shape in its own right.

       The floor is that bar, measured, not a fraction of the card: a fraction of
       a narrow card is narrower than the thing standing in it, and the bar ended
       up hanging over the card's own top edge on a phone. The cap is the other
       end of the same argument - a notch stops reading as one when there is no
       edge left either side of it. */

    const barWidth = Math.min(
      Math.max((w < TIGHT ? BAR_TIGHT : BAR) + 12, Math.min(w * 0.11, 178)),
      Math.max(flare * 2 + 60, w - 2 * (radius + flare) - 24),
    );

    /* The corner for the way on. Square, like the bite, and only as large as
       the control standing in it needs: `flare * 2` is the smallest a cut can
       be before its two arcs overlap, and the sixteen on top of it is the air
       around a 44px target. */
    const drop = Math.max(flare * 2 + 16, Math.min(w * 0.075, 96));

    const dropW = drop;
    const dropH = drop;

    return {
      radius,
      barWidth,
      barDepth,
      barRadius: barFlare,
      barFlare: barFlare,
      /* Nought, which `outline` reads as no cut at all - and the bottom left
         corner comes back as an ordinary rounded one. The numbers above are
         still worked out because the day something stands there again, what it
         has to fit inside is the argument, not a fraction of the card. */
      biteWidth: 0,
      biteHeight: 0,
      biteRadius: flare,
      biteFlare: flare,
      dropWidth: dropW,
      dropHeight: dropH,
      dropRadius: flare,
      dropFlare: flare,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  /* The card's own side inset, from its width rather than a breakpoint: this is
     a surface that fills the window, so what it can afford at the sides is a
     question about the surface and not about the class of device.

     A fourteenth of the width, capped at a hundred and thirty two. It was taken down to a
     thirty-fifth so the screens would line up with the header inside the card,
     and that was the wrong way round: the header reads `--page-gutter`, and the
     card sets that variable to this number when it renders the bar. The two
     agree either way, so this can be whatever the card wants rather than
     whatever the page happens to use. */
  /* Except on a phone, where a sixteenth of the width is what the words are
     paying for it.

     A card three hundred and seventy-five points wide gives 24 to each side by
     the floor above, and what is left has to hold "Connected to your systems."
     on one line at a size a headline can be read at - which it does not, so the
     last line of a three line claim wrapped onto a fourth. There is nothing in
     the margin to protect: it is a card standing in a page that already insets
     itself, so the gutter here is drawn against the card's own edge rather than
     against the window's. Fourteen leaves the words the difference. */
  const pad =
    size.w < TIGHT
      ? Math.max(14, size.w * 0.035)
      : Math.max(24, Math.min(size.w * 0.06, 112));

  /* Clear of the floor of the cut, not level with it.

     Level was tried and it is wrong, for a reason the arcs make easy to
     miss: the notch's two bottom corners curve away from its middle, so the
     cut is at its deepest exactly where the centred links are widest. Type
     set on the floor line has the middle of the shape resting on its cap
     height - which is what "How we work" was doing under the arrows.

     Twelve, which is the notch's own corner radius at the sizes this card
     runs at. A gap the size of the curve that made it is the one number here
     that cannot read as arbitrary. */
  const headTop = cut.barDepth + 12;

  /* How far down the card anything else can start.

     The floor of the notch and a little air, and nothing else. It used to add
     the height of a row of links as well, because the links stood in this edge;
     they are in the page's own header now, above the card, so there is nothing
     up here to clear but the cut itself - and every pixel this reserved was one
     the words below were pushed down by. */
  const head = headTop + 8;

  /* The measurement that placed the name on the picture went with the name. It
     worked out whether the bottom edge had room for it beside the thumbnail, and
     with nothing set over the artwork there is nothing left to place. */

  return (
    <div
      ref={box}
      /* A column on a phone, and only there.

         The one screen that stands in the flow rather than over the card needs
         the card to stretch it, or it sits at the top with the rest of the
         height empty underneath. Everything else here is `absolute` and out of
         the flow, so a flex column changes nothing for any of them. */
      className={cn("relative max-sm:flex max-sm:flex-col", className)}
    >
      {/* The slide, cut to the card's outline, and the one before it still
          drawn underneath while they cross.

          Swapping the source under one element is a cut - the new picture simply
          replaces the old on the next frame. Two elements crossing over is a
          dissolve, and at nearly a second it reads as the card turning rather
          than as a slide changing.

          A slide with no picture draws its tone and nothing else. Two of the
          three are waiting for artwork, and `image` is empty on them rather than
          borrowed from elsewhere on the site - so the card has to be able to be
          a colour. Guarded rather than left to `next/image`, which is handed an
          empty `src` otherwise and throws. */}
      {/* The first screen: the wave.

          Drawn outside the slides rather than inside them.

          It was inside the layer keyed on the slide's id, so every press of an
          arrow unmounted the canvas and built another one: a WebGL-free redraw,
          but still a fresh context, a fresh lattice and a restarted clock. What
          that looked like was a flash and then the same picture - which is most
          of why pressing an arrow appeared to do nothing.

          Out here it persists, and the slide moves it instead. Each slide stands
          at a different place in the same swell, and the loop eases to it, so an
          arrow rolls the surface rather than swapping it. */}
      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden bg-field"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      >
        {/* The ground: one grid, edge to edge, and barely there.

            Not a picture made of dots, which is what the mark drawn as a
            halftone was on the screen that used to close this card - that one
            wanted shaping. This is paper, and paper does not fade out in the
            middle: a texture with a hole in it reads as a spotlight nobody
            switched on.

            Held to the edges, though. Uniform, it ran under the headline, the
            paragraph and the buttons, and a texture behind a block of type is a
            texture the type has to be read through. Clear through the middle and
            arriving in the last third, it does what a margin does: it says where
            the card ends without drawing a line there.

            Grey, not the mark's blue. The blue made the texture a colour
            decision - a faint tint across the card that the eye reads as
            something, and the one thing this is meant to say is nothing. Ash is
            the paper showing its weave, with no opinion about blue.

            Just over half the border grey, at one and a half pixels on a
            twenty pixel pitch. A third was a dot you could only find by looking
            for it and three quarters was a texture with an opinion; this is the
            place between them, where you see that the surface is not blank and
            never quite see what it is made of.

            And a swell running through it now, which is why it is drawn rather
            than set as a background. `background-position` slides a whole sheet,
            which is a pattern being dragged; the dots only move against each
            other if each one is placed, so `DotField` draws the same grid on a
            canvas and lifts every dot by a travelling wave. Same pitch, same
            dot, same grey - the texture is unchanged and the surface it is
            printed on is no longer flat.

            The mask stays out here rather than going into the drawing. Where a
            texture fades is a decision about this screen's composition - it
            clears the middle so the words are not read through it - and the
            thing that draws dots has no business holding an opinion about where
            the type is.

            The artwork gets its own clearing on top of this, a halo of the
            card's white inside `MarkStage`, because it sits in the last third
            too and the mask cannot know that. */}
        {shown.view === "mark" ? (
          <span
            aria-hidden
            className="absolute inset-0"
            /* The clearing is a shade smaller than it was: 18 and 66 rather
               than 22 and 74. The texture is a wave now, and a wave shown only
               in the last quarter of the card is a wave nobody can see travel -
               there was no run of field long enough for a crest to cross. This
               still clears the whole of the headline, the paragraph and the
               buttons, which is all it was ever for. */
            style={{
              maskImage:
                "radial-gradient(ellipse 62% 66% at 50% 50%, transparent 0%, transparent 18%, black 66%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 62% 66% at 50% 50%, transparent 0%, transparent 18%, black 66%)",
            }}
          >
            <DotField className="absolute inset-0" />
          </span>
        ) : null}

        {/* The fourth screen: a film, filling the card.

            Muted, looping and inline, which between them are the only way a
            browser will start it without being asked. `playsInline` is the one
            that is easy to miss: without it iOS takes any playing video full
            screen, so a background on a card becomes the whole phone.

            `preload="metadata"` rather than `auto`. Four of the five screens are
            not this one, and somebody who never turns the card should not have
            fetched two and a half megabytes of it - the metadata is enough for
            the element to size itself, and the rest arrives when the screen is
            reached. It is `Boot` that waits for the film to be playable before
            it lifts, so the first screen is not held up by it either.

            No controls and nothing announced. It is scenery on a surface, not
            something to watch through, and a control bar drawn over a card is a
            player somebody has parked on a page.

            The tone underneath is the card's own white, so the moment before the
            first frame is a white card rather than a black rectangle.

            Cut, not boxed. It sits in a shape drawn by the same `outline` this
            card is drawn by - a notch in its top edge saying what it is, and a
            corner given up for the one control it has. A rectangle in the middle
            of a page made of cut surfaces is the one element that looks pasted
            on. See `film-stage`.

            Shown at its own size, and never above it.

            The file is 1280 by 720. This card is most of a window - around 1900
            points across, and twice that in device pixels on a good screen - so
            filling it meant blowing 720 lines up to three times their height,
            which is not a video playing, it is a video being enlarged. Cropping
            it to the card's shape on top of that threw away a sixth of the frame
            as well.

            `max-w-full max-h-full` on the element and nothing else: a `video`
            has an intrinsic size, so this lets it shrink to fit a narrow screen
            and stops it growing past what it actually contains. On a wide card
            it plays at 1280 by 720 in the middle of the surface, which is the
            sharpest it can ever be, and the card's own white stands round it -
            the same white it stands on everywhere else.

            The one way to make it larger is a larger file. Re-exported at 2560
            wide this fills the card at full sharpness with nothing else to
            change, because the cap is the file's own dimensions rather than a
            number written here. */}
        {/* The third screen: the pit, and nothing over it either.

            No gravity. With it, every ball ends up in a heap along the bottom
            edge within two seconds and the top two thirds of the card is white -
            which is a picture of a pile, and this is meant to be a picture of a
            field. At nought they bounce off all four walls instead and fill the
            card, and the cursor cuts a hole through them.

            Friction at one for the same reason: anything less and the whole
            field slows to a stop after half a minute, which is a screen that
            looks broken to the second person who arrives. It cannot run away
            either, because `maxVelocity` is a hard clamp and the walls take five
            per cent at every bounce.

            `followCursor` off, which does not mean the cursor does nothing. It
            only stops sphere zero being drawn. That sphere is still there in the
            physics, still pulled to wherever the pointer is, and still shoving
            everything out of its way - and it still carries the light, so the
            field brightens where the cursor is. What goes is the ball stuck to
            the pointer, which reads as a cursor somebody has decorated.

            Two colours, and both of them on every ball: the list is painted
            down the sphere the balls share - first at the foot, last at the
            crown - so each one carries the mark's blue running into its green
            rather than being flatly one or the other. A field of flat colours is
            a bag of sweets; a field of one gradient is a material.

            Then under a fifth of them on five gradients of their own - yellow,
            orange, red, a green that is not the mark's and a blue that is not
            either - taken in turn, so each is about a twenty-fifth of the field.
            The last two are the point of the other three: a red beside a field
            of blue-green is a warning light, and a red beside a red-orange-
            yellow-green-blue scattering is one of the colours. Gradients rather than flat
            colours, because a flat ball beside a graded one reads as a ball that
            has not finished loading. Few of them, because the point of an
            exception is to be one: enough to stop the field being a swatch, and
            not so many that the two colours that are ours stop being what the
            card is made of.

            The key light is fixed, above and in front, and it takes the
            middle of the ramp so the colour lighting the field is the one
            between the two rather than either end of them. It used to ride on
            sphere zero, which is the sphere the pointer drags about - so the
            brightest part of the card followed the cursor around it, which is a
            torch rather than a room. */}
        {/* The fourth screen: a field of points, answering the pointer.

            Inside the clipped layer with the other grounds, so the card's own
            outline cuts it like everything else on the card.

            It came in from another project carrying two dependencies this site
            does not have: a theme switch and a music player's audio analyser.
            Both are gone rather than installed - there is one palette here and
            nothing plays - and every path that read them already fell back to
            what is wanted, which is a still field in the light set. */}
        {shown.view === "particles" ? <ParticleCanvas /> : null}

        {shown.view === "balls" ? (
          <Ballpit
            className="absolute inset-0"
            count={220}
            gravity={0}
            friction={1}
            wallBounce={0.95}
            followCursor={false}
            colors={[0x2a98fe, 0x06dbaf]}
            accents={[
              [0xf5c518, 0xffa41a],
              [0xff8a1a, 0xff4d1a],
              [0xff5a5a, 0xe11d38],
              [0x3ddc84, 0x0f9d58],
              [0x4aa8ff, 0x1663d6],
            ]}
            accentShare={0.18}
            ambientColor={0xffffff}
            ambientIntensity={1}
            lightIntensity={2.4}
            minSize={0.3}
            maxSize={0.7}
            size0={1.1}
            maxVelocity={0.05}
            maxZ={1.6}
          />
        ) : null}

        {/* And the middle taken back for the type. Light ground, dark words,
            white wash - the pit is a field of pale glass and the one thing it is
            not is a surface you can read small type off.

            Only as large as the words, though.

            It was a radius of sixty-eight per cent of the width, which is an
            ellipse most of the card across - so the pit was a border of balls
            round a white middle, and the picture the screen is made of was
            pushed out to the edges. The block it exists for is a headline, two
            lines of paragraph and one button: about a sixth of the card wide and
            a seventh of it tall.

            Thirty-six by thirty is that block with room to fade in. The stops
            matter as much as the size - the wash holds near full strength to
            most of its own radius and does all of its fading in the last
            quarter, so the type sits on white rather than on the shoulder of a
            gradient, and the balls come back within a hand's width of it.

            No edge, still. Anything harder here would be a panel drawn round the
            words, and the whole point is that there is no panel. */}
        {shown.view === "balls" ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 36% 30% at 50% 47%, color-mix(in oklab, var(--color-field) 94%, transparent) 0%, color-mix(in oklab, var(--color-field) 90%, transparent) 46%, color-mix(in oklab, var(--color-field) 52%, transparent) 74%, transparent 100%)",
            }}
          />
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key={shown.id}
          layoutId={`shot-${shown.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          /* It takes no clicks any more.

             The whole card opened the panel, which made sense while every
             screen was a picture of a piece of work: pressing the picture
             opened the piece. It stopped making sense the moment the screens
             became things in their own right - a headline with three doors under
             it, a field that answers the pointer, a reel that scrubs to the
             scroll. On those, a press anywhere is a press on something, and the
             panel arriving over it is the card interrupting whatever was
             happening.

             The control in the notch is the way in, and it is the only one. It
             is drawn, labelled and sits between the two arrows that turn the
             card, so the way to open a screen is beside the way to leave it.

             `aria-hidden` stays: it is the crossfade layer, scenery either
             way. */
          aria-hidden
          /* `artwork` only where there is artwork.

             That class lays two things over whatever is inside it: an ink
             gradient graded from a third to nearly nine tenths, and a layer of
             grain. Both exist to hold a photograph down so type can sit on it.
             Over a white surface with no picture in it they do not soften
             anything - they simply paint the card dark grey and dust it. */
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden",
            shown.image && "artwork",
          )}
          style={{
            /* Only where there is a picture to hold up.

               This layer is the crossfade: two of it exist while one slide
               replaces another, and its `tone` is the colour a picture arrives
               on. With no picture, that tone is white and it was an opaque sheet
               laid over the drawing - which is why the field vanished, and why
               pressing an arrow flashed it: the incoming sheet starts at nought
               opacity and rises, so for half a second the drawing showed through
               its own cover.

               The card's white now belongs to the layer underneath, which is
               where a card's ground belongs. */
            backgroundColor: shown.image ? shown.tone : undefined,
            clipPath: path ? `path("${path}")` : undefined,
          }}
        >
          {shown.image ? (
            <Image
              src={shown.image}
              alt={shown.alt}
              fill
              quality={100}
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {/* The fourth screen: the film, filling the card.

          Above the layer that crossfades the slides, not inside the clipped
          ground with the other drawings - and that is not a preference, it is
          the difference between the reel scrubbing and doing nothing at all.
          The crossfade layer is `inset-0` and takes clicks, because pressing the
          card is what opens the panel; laid over the film it swallowed every
          wheel event before the scroller underneath could see one.

          Cut to the card by hand, since it is no longer inside the thing that
          clips. Same `path`, so it is the same outline: the notch in the top
          edge, the corner given up at the foot, the flares at every turn.

          Under the buttons, which are `z-10`. They are the only things on this
          screen that take a press, and a scroller over them is a scroller that
          eats it. */}
      {shown.view === "film" && shown.reel ? (
        <div
          className="absolute inset-0 z-[5]"
          style={{ clipPath: path ? `path("${path}")` : undefined }}
        >
          <FilmStage
            base={shown.reel.base}
            frames={shown.reel.frames}
            onProgress={tellReel}
          />
        </div>
      ) : null}

      {/* No header in here any more.

          It carried one for a long time, `bare`, with its gutter overridden to
          the card's and its links dropped past the floor of the notch. It is in
          the layout now, above the card, like every other page - see
          `site-shell`. What is left in this edge is the notch and the three
          controls standing in it, which is what it was cut for. */}

      {/* The bar, standing in the top of the cut. No plate behind it: the notch
          is already the outline, and a pill drawn inside it is a second shape
          inside the first.

          The notch is cut on every screen, including the two that are pictures.
          It was taken off those for a while, because the notch is the one cut
          with nothing standing in it - the bite holds the thumbnail and the
          corner holds the way on, so what shows through those is that thing,
          while what shows through the notch is the page. On a white card nobody
          can tell; on the water it is a lighter rectangle in the top edge. That
          is what a cut in a card looks like, and the card is the same card on
          all three screens: worth keeping over a top edge that changes shape
          depending on what is drawn under it. */}
      {/* `pointer-events-none` on the box, `auto` on the pill inside it.

          The mobile menu has to escape this band rather than out-rank it. It is
          rendered inside the header, and the header is inside a `z-20` box on
          this card - so its own `z-50` only ever competed inside that box, and
          this band at `z-30` painted straight through an opaque white panel. It
          is portalled to `body` now; see `site-header`.

          This is a full-width band across the top of the card at `z-30`, there
          only to centre the three controls in the notch - and sitting above the
          header at `z-20`, it was taking every click meant for the menu button
          at the far right of that row. On a phone that button is the only way
          into the site, so it was the one control on the screen that did
          nothing at all. A box whose whole job is to position something should
          never be the thing that gets pressed. */}
      <div
        className="pointer-events-none absolute top-0 right-0 left-0 z-30 flex justify-center"
        style={{
          /* The full width rather than the notch's own, so the pill centres
             on the card - the notch it stands in is centred the same way. */
          height: cut.barDepth,
          paddingTop: 4,
        }}
      >
        {/* The row itself comes down with the notch it stands in - the cut is
            measured from these, so a bar drawn at full size inside a smaller
            hole would hang out of it. */}
        <div className="pointer-events-auto flex h-[26px] items-center gap-0 rounded-pill px-1 sm:h-9 sm:gap-0.5 sm:px-1.5">
          <Tool
            label="Previous project"
            onClick={() =>
              setAt(
                (was) => (was - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
              )
            }
          >
            <ArrowLeft className="size-3.5 sm:size-4" />
          </Tool>
          {/* `Expand` rather than `Maximize2`.

              The two arrows of `Maximize2` point the same way as the two
              arrows either side of it, so all three read as one row of
              direction and the middle one looks like a diagonal step rather
              than a way in. Four arrows leaving a centre is the only one of
              them that is not a direction. */}
          <Tool label={`Open ${shown.name}`} onClick={() => setOpen(shown)}>
            <Expand className="size-3.5 sm:size-4" />
          </Tool>
          <Tool
            label="Next project"
            onClick={() => setAt((was) => (was + 1) % HERO_SLIDES.length)}
          >
            <ArrowRight className="size-3.5 sm:size-4" />
          </Tool>
        </div>
      </div>

      {/* The fourth screen's own words, over the film.

          Set on the picture, which is the one screen here where that is the
          right answer: there is nothing else on it, and a caption beside a
          full-bleed reel would be a caption about a picture rather than a title
          on one. The header is off this screen, so the top of the card is free
          for them.

          White, and shadowed rather than washed. The other screens take the
          card back under their type with a radial of the card's own ground;
          that cannot work here, because this reel is nearly white and a white
          wash on a white frame is a smear. A drop shadow does the same job on
          the letters alone and leaves the picture untouched.

          Cleared of the notch by its own depth rather than by `head`, which
          also allows for the row of links - and there are no links up there on
          this screen. */}
      {/* The film's titles, running with the scroll.

          Four lines rather than one, each in its own place on the frame and
          each with its own moment - see `TITLES`. The reel answers to the
          reader, so the words on it do too: they are not revealed once and left,
          they arrive, hold and go as the film runs, which is what titles on a
          film do.

          White and shadowed rather than washed. The other screens take the card
          back under their type with a radial of the card's own ground; that
          cannot work here, because this reel is nearly white and a white wash on
          a white frame is a smear. A shadow does the same job on the letters
          alone and leaves the picture untouched.

          The whole run is inset by the card's own gutter and cleared of the
          notch by its depth - not by `head`, which also allows for the row of
          links, and there are no links on this screen. */}
      {shown.view === "film" ? (
        <FilmWords bind={bindReel} barDepth={cut.barDepth} pad={pad} />
      ) : null}

      {/* The fourth screen's ways on, and nothing else.

          The film is the whole screen - it fills the card and takes the card's
          own shape - so these stand on the picture rather than in a cut of their
          own. That is the one place this screen departs from how the rest of the
          site draws a control, and it earns the departure twice over: the reel
          is signed with a four-pointed star in its bottom right that cannot come
          off a hundred and twenty stills, and something opaque standing exactly
          there covers it. The thing that has to be on this screen anyway does
          the hiding.

          Down as far as that corner allows, because the badge is what they are
          covering. They cleared the cut by a comfortable margin and the star sat
          in the gap underneath - close enough to look like something the buttons
          had missed. Sixteen above the cut is still clear of the way down the
          page, and it is the difference between hiding the mark and framing it.

          Stacked and one width: in a row the eye reads left to right and the
          loud one goes first; in a stack it reads top to bottom, so the filled
          one is at the top and all three are as wide as the longest label. */}
      {/* No ways on standing over the film.

          There were three, stacked in the bottom right - the same three the
          first screen offers - and the argument for them was that somebody
          turning from that screen to this one should find the doors where they
          left them. What it cost was the thing this screen is: a photograph with
          a panel of controls parked on it, and a corner of the card given over
          to holding them.

          The card's own way on is a disc standing in the corner cut, on every
          other screen, and there is no reason for this one to differ. The three
          doors are one turn of an arrow away. */}

      {/* The fourth screen: the other company's name, and nothing else.

          Centred on the card rather than set at one corner, because there is
          nothing else on the screen to balance it against - the field behind it
          is even in every direction, so anything off-centre reads as having
          slipped. It is the one screen here that is a name rather than a claim,
          and a name wants the middle.

          Set as one word in two colours, which is what the header does with
          TwinLoom: the tint marks where the name divides rather than adding a
          second idea. Inline rather than blocked, so it stays one line and never
          breaks in the middle of itself.

          `pointer-events-none` throughout. The field answers the pointer, and a
          block of type laid over it is a rectangle in the middle of the card
          where nothing moves. */}
      {shown.view === "particles" && shown.claim ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            paddingTop: size.w < TIGHT ? cut.barDepth + 26 : head,
            paddingBottom: cut.barDepth + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={shown.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
              className="text-center"
            >
              {/* Two sizes, not one, and the jump is the whole of it.

                  Set at one size the pair is a sentence broken over two lines,
                  which is a headline that happens to wrap. At two - the first
                  about two fifths of the second - they become an instruction and
                  the thing it is about: small "Get creative.", enormous "Your
                  canvas." The eye lands on the noun and picks up the rest on the
                  way back, which is how a poster is read and not how a paragraph
                  is. It is the same device the film titles use, and this is the
                  other screen with nothing on it but words.

                  The gradient stays on the second, so the largest thing on the
                  card is also the one thing carrying the mark's colour - and it
                  is the word that names what the field under it is. */}
              <span className="block text-[clamp(15px,2.6vw,40px)] leading-[1.05] font-extrabold tracking-[-0.03em] text-quiet">
                {shown.claim[0]}
              </span>

              <h1 className="thread-text mt-1 block text-[clamp(38px,6.6vw,104px)] leading-[0.95] font-extrabold tracking-[-0.05em] sm:mt-1.5">
                {shown.claim[1]}
              </h1>

              {/* And nothing under it. A line explaining a field that explains
                  itself is a caption on a picture nobody needs captioned - the
                  points move when the pointer does, and that is the whole of
                  what this screen has to say. */}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* The third screen's words: centred, dark, and one way on.

          The same block as the second screen at the same sizes, set the other
          way up because the ground is the other way up. Written out rather than
          shared with it: they are two screens and not one screen with two
          pictures, and the day either wants its own measure or a second way on,
          that is an edit here rather than a condition threaded through a block
          serving both. */}
      {shown.view === "balls" ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          style={{
            paddingTop: head,
            paddingBottom: cut.barDepth + 12,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          <div className="w-full text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shown.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.34, ease: [0.4, 0, 0.2, 1] }}
              >
                <h1 className="mx-auto max-w-[20ch] text-[clamp(32px,5.4vw,92px)] leading-[1.02] font-extrabold tracking-[-0.045em] text-ink">
                  {shown.claim?.[0]}
                  <span className="thread-text block">{shown.claim?.[1]}</span>
                </h1>

                {/* The claim, and nothing under it.

                    A paragraph and a button stood here. Both were explaining a
                    screen that explains itself: the beads answer to the pointer,
                    so the invitation to play with the design is the field, not a
                    sentence about the field. And the card already carries every
                    way on it needs - four of them on the first screen, three on
                    the fourth - so a fifth here was the same door offered
                    again. */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      {/* The first screen: the mark staged, with the whole offer beside it.

          The long version, and the only screen here that is. The two behind it
          each make one argument and open one door - right for a card that turns,
          wrong for the one somebody might not turn past. This one names the
          trades, makes the claim, says the line under it, gives the paragraph
          and puts all four ways in on the same row.

          Two columns on a wide card and one on a narrow one, and the artwork
          leads on the narrow one: a picture at the top of a phone screen says
          which company this is before the first line of type does. `order` moves
          it, so the reading order and the composition stay separate decisions.

          The buttons wrap rather than scroll. Four of them across a phone is
          four rows, which is fine - a row that scrolls sideways hides doors. */}
      {shown.view === "mark" ? (
        <div
          /* In the flow on a phone rather than laid over the card.

             Every screen here is `absolute inset-0`, which is right for the ones
             that are pictures: they fill whatever the card is and the card is a
             screenful. This one is a column of type, and an absolutely
             positioned column cannot make the thing behind it taller - so on a
             short screen it simply ran out through the bottom edge.

             Relative below `sm`, it is what gives the card its height, and the
             card grows to hold it. Above `sm` nothing changes: the contents fit
             the screen, so being laid over it and being in it come to the same
             thing.

             No floor of its own. It had `min-h-svh`, which made it a screenful
             tall inside a card that was already at least a screenful inside a
             section with padding above and below - three screenfuls stacked
             where one was wanted, and a hand's depth of empty card under the
             last button. Its height is its contents; the card is what holds the
             floor, and the card gets that from the section it fills. */
          /* `flex-1` on a phone, and it is what makes `justify-center` below
             true rather than nearly true. In the card's column this block was
             sized by its own minimum, so any height the card had past that
             minimum - and it has some, because the card's floor and this one are
             worked out from different sums - was card with nothing in it under
             the last button. Told to take what is left, the block is the card,
             and the column centred inside it is centred on the screen.

             The minimum stays as the floor for the case where the contents
             overrun it, which is what stops a long headline being squeezed. */
          className="pointer-events-none absolute inset-0 z-10 flex items-stretch max-sm:relative max-sm:inset-auto max-sm:min-h-[calc(100svh-var(--nav-height)-var(--sill-top)/2)] max-sm:flex-1"
          style={{
            /* `head` clears the row of links, and there is no row of links on a
               phone - the bar is a wordmark and a menu button, and the notch
               beside them is shallower too. Reserving the full desktop number
               left a hand's depth of empty card above the mark and pushed
               everything into the bottom half of the screen.

               The notch and nothing on top of it. It was the notch plus
               forty-four, then plus twenty - a floor the whole column is
               measured from, and every pixel of it is one the column cannot
               use. There is nothing up there to clear but the cut itself, and
               the mark below it is a drawing in the middle of a square file with
               its own air on every side: what looked like a gap above the logo
               was mostly the file, and the padding was being paid twice. */
            paddingTop: size.w < TIGHT ? cut.barDepth : head,
            /* Almost nothing at the foot on a desk. It used to clear the
               notch's depth, which was right while the notch was in the top edge
               and one number did both ends - the notch is in the corner now and
               the bottom edge is straight, so all that clearance did was hold
               the last line off the floor it is meant to be standing on.

               On a phone it clears the corner instead. The card gives up its
               bottom right for the way down the page, and there the column is
               nearly the full width - so the last of the three doors ran under
               that cut and came out sliced by the outline with the arrow sitting
               on top of it. Measured from the cut rather than guessed, so it
               follows if the corner ever changes size. */
            paddingBottom: size.w < TIGHT ? cut.dropHeight + 12 : 14,
            paddingLeft: pad,
            paddingRight: pad,
          }}
        >
          {/* The trail, laid on the floor rather than set into it.

              In the flow it was a block at the end of the column, and it had
              to be pulled out past the card's own side padding to reach the
              edges - which is a negative margin escaping a rounded corner, so
              the beads ran off the bottom of the card and onto the page.

              Absolute against this box instead. The box is `inset-0` of the
              card, so `inset-x-0 bottom-0` is the card's own floor exactly:
              no margin to escape with, and nothing to overrun. Drawn before
              the words so it paints under them, and taking no clicks, because
              it is scenery on the surface the sentence beside it stands on. */}
          {/* Cut to the card, not to the box.

              `inset-0` of the card is a rectangle; the card is not. Its shape
              is the clipped ground underneath - rounded at three corners and
              bitten at the fourth - and only the ground was ever cut to it, so
              a trail running the full width of the rectangle carried on past
              the curve and left its last beads sitting on the page.

              The outer box takes the card's own outline, which is why it is
              `inset-0` rather than pinned to the bottom: `path()` is drawn in
              the coordinates of the element it is set on, so the element has
              to be the whole card for the path to describe it. The trail is
              then hung off the bottom of that. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{ clipPath: path ? `path("${path}")` : undefined }}
          >
            <div className="absolute inset-x-0 bottom-0">
              <BeadTrail />
            </div>
          </div>

          {/* `initial` left on, unlike the other screens.

              It was `false`, which is right for a carousel - a card that
              animates its first slide in has animated something nobody asked
              to see change. But this is the screen the page opens on, and the
              cost of that setting was that the one screen everybody sees was
              the one screen that never moved. Here the first render is the
              performance. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={shown.id}
              variants={HERO_RUN}
              initial="hidden"
              animate="shown"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.22 } }}
              /* One rhythm down the screen, and it is worth naming because it
                 was five arbitrary numbers before: 4 between the trades and the
                 claim, 5 between the claim and the line under it, 4 again
                 between that and the paragraph, 7 before the buttons, 7 again
                 before the sister company. Tight where two things are one thing,
                 wide where one thing ends. */
              /* Full height, so the sister company can sit on the floor.

                 It was a column centred as one block, which left the two-up in
                 the middle and the line under it wherever the block happened to
                 end - halfway down the card, with a screenful of nothing beneath
                 it. The two-up takes the room that is going and centres in it;
                 the line takes only its own height and stays at the bottom,
                 which is where a footnote belongs. */
              /* Positioned, so it paints over the trail behind it. The trail
                 is absolute and this was static, and a positioned element
                 beats static content in the same stacking context however
                 early in the markup it appears - the beads came out on top of
                 the sentence they are meant to be under. */
              className="relative flex h-full w-full flex-col gap-5"
            >
              {/* The words take the larger share, not the picture.

                  It was 52 to the artwork and what was left to the type, and
                  what was left could not hold the claim on two lines or the four
                  doors on one row - so a headline broke into three and the last
                  button dropped onto a second line. The picture loses ten points
                  and reads no smaller for it; the words gain a column. */}
              {/* Centred in the room going, then biased up off the middle.

                  Dead centre put the block low: the trail is drawn across the
                  floor and the sister company's line sits on it, so the bottom
                  of this screen is doing something and the top is not - and a
                  block centred between a busy floor and an empty ceiling reads
                  as having sunk. The padding is inside the centred box, so it
                  takes half its own height off the middle and lifts the whole
                  two-up by that much. */}
              {/* Below `sm` every number here comes down, and every one of them
                  is written as `max-sm` rather than as a lower base with an `sm`
                  restore. The desktop screen is then provably untouched: there
                  is no shared value to get wrong, and reading any line tells you
                  which width it is for. */}
              <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-6 max-sm:gap-1 max-sm:pb-0 sm:pb-10 lg:flex-row lg:items-center lg:gap-8 2xl:gap-12">
                {/* Drawn wider than the room it takes, and grown leftward.

                    At a straight 52 per cent the mark was half the row and the
                    four doors beside it broke onto a second line - a picture
                    deciding how a row of controls reads, the wrong way round.
                    The negative margin is the fix and it is not a fudge: a
                    flex item contributes `width + margin` to the layout, so
                    this asks for 54 and takes 42, and the twelve it does not
                    take is drawn anyway.

                    On the left, not the right. Taken off the right the mark
                    kept its left edge and ran out past the card, so growing it
                    moved it - the artwork slid sideways and lost its outer
                    edge to the clip. Taken off the left it keeps its right
                    edge exactly where it was and grows back towards the words,
                    over the empty card between the end of a 62ch measure and
                    the start of the picture. Nothing is covered: that gap had
                    nothing in it.

                    A margin rather than a transform, deliberately. The image
                    carries `mix-blend-multiply` and its own mask, and a scale
                    anywhere above it would make a stacking context and cut the
                    blend group - the white box this file has already come back
                    as twice. */}
                <motion.div
                  variants={HERO_MARK}
                  /* Smaller on a phone than on a desk, but not by as much as it
                     was. At 84 per cent it took half the height of the card and
                     pushed the last button off the bottom; at 52 it had gone
                     from being the thing the screen opens on to a badge above
                     some type.

                     Seventy-four per cent, capped at 248, and it was ninety
                     capped at 310. The screen has gained a third line of
                     headline since that number was chosen, and between them the
                     mark and the words were taking the whole card - the first
                     thing on a screen does not have to be the largest thing on
                     it, and this one shares the height with the trades, three
                     lines of claim, a line under them and three doors.

                     What still holds is why it can be as large as it is: the
                     picture is a mark in the middle of a square file with a good
                     deal of air round it, so the drawing grows and the ink stops
                     well short of either edge.

                     The room for it came from the clearance above, which was
                     reserving space for a row of links a phone does not
                     have. */
                  className="pointer-events-none w-[84%] max-w-[320px] shrink-0 max-sm:w-[66%] max-sm:max-w-[212px] lg:order-2 lg:-ml-[12%] lg:w-[54%] lg:max-w-none"
                >
                  <MarkStage />
                </motion.div>

                {/* A run of its own, so the words stagger among themselves
                    rather than against the picture beside them. Nested
                    orchestration: this is a child of the screen's run and the
                    parent of the five below it. */}
                <motion.div
                  variants={HERO_RUN}
                  className="min-w-0 text-center lg:order-1 lg:flex-1 lg:text-left"
                >
                  {/* The trades, as a list rather than a sentence. Dots between
                    them, because a comma would make it a sentence and it is a
                    label.

                    Off on a phone. Four trades set in caps with letter-spacing
                    is a line about three hundred and fifty points long, so on a
                    handset it wrapped - and a label that takes two lines has
                    stopped being a label. The headline directly under it names
                    the same ground in words somebody reads rather than scans,
                    and on a screen that has to earn every line, one of the two
                    goes. */}
                  <motion.ul
                    variants={HERO_RISE}
                    className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 font-mono text-[10px] font-bold tracking-[0.15em] text-idx uppercase max-sm:hidden lg:justify-start lg:gap-x-3.5 lg:text-[11px] 2xl:text-[11.5px]"
                  >
                    {shown.kicker?.map((trade, n) => (
                      <li
                        key={trade}
                        className="flex items-center gap-2.5 max-sm:gap-1.5"
                      >
                        {n > 0 ? (
                          <span
                            aria-hidden
                            className="size-1 rounded-pill bg-mark max-sm:size-[3px]"
                          />
                        ) : null}
                        {trade}
                      </li>
                    ))}
                  </motion.ul>

                  {/* The gaps are the grouping, and they climb with the screen.

                      Every one of them steps at `lg` and the two largest step
                      again at `2xl`. A ladder set for a laptop is a ladder a
                      wide screen reads as a block: the type grows with the
                      window - the claim and the lead are both `clamp`, and
                      their caps are what a wide screen actually gets, since
                      `3.4vw` passes fifty-one well before fifteen hundred - so
                      gaps that do not grow with it close up. The paragraph and
                      the doors are told in so many words, because neither is
                      fluid: a fixed thirteen and a half on a two thousand pixel
                      window is a caption.

                      The proportions are the same at every width, which is what
                      makes it one ladder rather than three:

                      The gaps were all much of a muchness once: four, five,
                      four, seven, which says the trades belong to the headline
                      about as much as the headline belongs to the line under it
                      - and the lead and the paragraph, which are a claim and its
                      explanation, sat closer together than either sat to
                      anything else.

                      Set as a ladder instead. The trades are a label on the
                      headline and stay tight to it. The lead is the second
                      half of the claim, so it takes a real step. The
                      paragraph explains the lead rather than continuing it,
                      so it takes a larger one. The doors take the largest:
                      everything above is reading and they are the first thing
                      to do, and a control set at a paragraph's distance from
                      a paragraph reads as one more line of it.

                      Each grows a little past `sm`, because a gap that is
                      right at 62px of headline is mean at 32. */}
                  <motion.h1
                    variants={HERO_RISE}
                    className="mx-auto mt-3 max-w-[26ch] text-[clamp(28px,3.2vw,88px)] leading-[1.05] font-extrabold tracking-[-0.042em] text-ink max-sm:mt-3 max-sm:max-w-none max-sm:text-[min(23px,5.9vw)] max-sm:leading-[1.08] max-sm:tracking-[-0.045em] sm:mt-4 lg:mx-0 lg:mt-5"
                  >
                    {/* Larger where there is room to be larger.

                        The ceiling was what was wrong, not the slope. It was
                        3.4vw capped at 62 - a headline sized for a laptop and
                        then held there however wide the window gets, so on a 2K
                        screen it was the same 62 pixels with twice as much white
                        either side, which reads as type left behind rather than
                        as a headline.

                        Raising the slope instead was the wrong fix and it showed
                        at once: at 3.8 the longest of the three lines no longer
                        fitted the column the words have - the mark takes the
                        right half of the card - so "Connected to your systems."
                        wrapped and the claim came out in four lines.

                        3.2 capped at 88 sits a shade under the width that was
                        already fitting, so nothing wraps that did not wrap
                        before, and the cap is high enough that a window past
                        about two thousand keeps growing instead of stopping.

                        The phone has its own number below `sm` and does not read
                        the ramp at all: `min(25px, 6.4vw)`, down from a flat 28.
                        The claim is three lines there rather than two, and its
                        last line is twenty-six characters - at 28 that wrapped
                        onto a fourth, which is the one thing a claim set in three
                        cannot afford.

                        The `vw` half is what handles the narrow ones: below
                        about 390 points a fixed size wraps that last line again,
                        so it comes down with the screen instead. Above `sm`
                        neither half is read.

                        Both halves came down a step - 25 and 6.4vw were set
                        against a claim of two lines and a card with more room
                        above it, and on a real handset at 411 points the three
                        lines were most of the screen before the doors. Every
                        number on this screen is now a ceiling with a `vw` under
                        it, so a 360 or a 320 gets a smaller card rather than the
                        same card with less of it visible.

                        A line each, and the last one coloured.

                        The parts were two - an ink half that wrapped wherever
                        the measure put it, and a gradient half on its own line.
                        "Your website. Your brand." is two sentences, so wrapping
                        it as one line made two claims share a line and read as a
                        list; broken by the measure rather than by the full stop,
                        where they broke depended on the width.

                        Every part is a block now, so the break is where the
                        sentence ends at every width, and the last of them is the
                        one in the mark's own gradient however many there
                        are. */}
                    {shown.claim?.map((part, n) => (
                      <span
                        key={part}
                        className={cn(
                          "block",
                          n === (shown.claim?.length ?? 0) - 1 && "thread-text",
                        )}
                      >
                        {part}
                      </span>
                    ))}
                  </motion.h1>

                  <motion.p
                    variants={HERO_RISE}
                    className="mx-auto mt-4 max-w-[44ch] text-[clamp(15px,1.3vw,24px)] leading-[1.4] font-bold tracking-[-0.022em] text-ink max-sm:mt-2 max-sm:max-w-[34ch] max-sm:text-[min(13px,3.4vw)] max-sm:leading-[1.45] sm:mt-5 lg:mx-0 lg:mt-6 2xl:mt-7"
                  >
                    {shown.lead}
                  </motion.p>

                  {/* The paragraph, with the other company's name as a link.

                      The same splitter the services cards use, rather than a
                      second copy of it here. It was its own: its own `SISTER`
                      constant, its own `map`, and its own destination - and that
                      destination was `/#services`, which is our own services
                      section rather than the company whose name had just been
                      pressed. Two copies of a link is two addresses, and one of
                      them is wrong the day the other is fixed. */}
                  {/* No paragraph under the claim.

                      It ran to four lines and said at length what the two lines
                      above it say in eight words - the offer, then the offer
                      again with the sister company named a second time. It had
                      already been taken off the phone for being the fourth block
                      of type in a column that had three; what that left was a
                      paragraph carried on a desk because there was room for one,
                      which is the wrong reason to keep any words.

                      The screen now reads: the trades, the claim, the line under
                      it, and three doors. Everything on it is a thing to read or
                      a thing to press. */}

                  {/* Three doors, one row, and the first one filled. Where they
                    all look the same there is no first choice, and a row of
                    equal buttons is three decisions rather than one.

                    "Custom software" was a fourth, and it pointed at the same
                    place "View our services" does - two of four doors onto one
                    page, which is a row that looks like a choice and is not
                    one. The sister company is named in the paragraph above with
                    that link on it, and again on the line at the foot. */}
                  {/* Wrapping below `lg`, one row at and above it.

                      Doors on two lines are decisions in two groups,
                      and the group a button falls into is decided by whatever
                      width the picture beside it happened to leave. On a wide
                      card they hold one line; on a narrow one, where there is
                      genuinely no line to hold, they wrap as they always
                      did. */}
                  <motion.div
                    variants={HERO_RISE}
                    /* Stacked and full width on a phone.

                       Three pills of three different lengths wrapped and centred
                       is a block ragged on both sides, under a headline that is
                       centred and a paragraph justified by its measure - three
                       different edges in four elements. One width down the
                       column gives the screen a single left and right edge, and
                       it is what a control at the foot of a phone looks like
                       everywhere else.

                       And the whole of that width, with no cap on it. There was
                       one - 268, then 236 - which held the three of them to a
                       measure in the middle of the card, so the block was
                       narrower than the headline above it and the trades above
                       that. On a phone the card is already a narrow column;
                       another measure inside it is a second margin nobody
                       asked for. They run to the card's own padding now, which
                       is the edge everything else on this screen runs to. */
                    className="pointer-events-auto mt-6 flex flex-wrap justify-center gap-2 max-sm:mx-auto max-sm:mt-3.5 max-sm:w-full max-sm:flex-col max-sm:gap-1.5 sm:mt-8 lg:mt-9 lg:flex-nowrap lg:justify-start lg:gap-2.5 2xl:mt-10"
                  >
                    <Link
                      href={ROUTES.build}
                      className="group/way thread-fill inline-flex items-center gap-2 rounded-pill px-4.5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90 max-sm:justify-center max-sm:gap-2 max-sm:px-3.5 max-sm:py-2 max-sm:text-[min(13px,3.4vw)] lg:px-5 lg:py-3 lg:text-[14.5px] 2xl:px-5.5 2xl:py-3.5 2xl:text-[15.5px]"
                    >
                      <PencilLine aria-hidden className="size-4 shrink-0" />
                      Scope your website
                      <ArrowRight
                        aria-hidden
                        className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                        strokeWidth={2.4}
                      />
                    </Link>

                    {[
                      {
                        at: ROUTES.services,
                        icon: LayoutGrid,
                        say: "View our services",
                      },
                      {
                        at: ROUTES.book,
                        icon: CalendarDays,
                        say: "Book a meeting",
                      },
                    ].map((way) => {
                      const className =
                        "group/way inline-flex items-center gap-2 rounded-pill border border-hair bg-field px-4.5 py-2.5 text-[13.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:border-ink max-sm:justify-center max-sm:gap-2 max-sm:px-3.5 max-sm:py-2 max-sm:text-[min(13px,3.4vw)] lg:px-5 lg:py-3 lg:text-[14.5px] 2xl:px-5.5 2xl:py-3.5 2xl:text-[15.5px]";
                      const body = (
                        <>
                          <way.icon
                            aria-hidden
                            className="size-4 shrink-0 text-idx"
                          />
                          {way.say}
                          <ArrowRight
                            aria-hidden
                            className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                          />
                        </>
                      );

                      /* "View our services" points into this same page's own
                         `#services` - a plain anchor, or `Link` doubles the
                         fragment when the section is already open. */
                      return way.at.includes("#") ? (
                        <a key={way.say} href={way.at} className={className}>
                          {body}
                        </a>
                      ) : (
                        <Link key={way.say} href={way.at} className={className}>
                          {body}
                        </Link>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </div>

              {/* The floor line arrives last, after everything it sits under.

                  All of it is the link, not the name alone. The mark, the name
                  and the sentence after it are one lockup for one company -
                  every part of it is about the same place, so a row where only
                  the middle word can be pressed is a row that has to be aimed
                  at. Whole, it is a target the width of the card.

                  A plain anchor rather than `Link`, because it leaves this
                  site: `Link` is for routes this application owns, and
                  prefetching somebody else's domain is a request we have no
                  business making.

                  `pointer-events-auto` because the screen around it takes no
                  clicks - the whole block is laid over a drawing, and only the
                  things that are actually controls take the pointer back. */}
              {/* On every width now, and it used to start at `md`.

                  What was under it on a phone was nothing: the three doors ended
                  around two thirds of the way down the card and the rest was
                  dotted ground. Padding is not what that room wanted - a screen
                  ends on something, and the thing this screen ends on everywhere
                  else is who else is behind the work. It is the floor line; a
                  phone has a floor.

                  Stacked there rather than strung out. The row is a name, a rule
                  and a sentence, which is a caption and needs about sixty
                  characters of line to be one - so below `sm` the name sits over
                  the sentence, the rule between them goes (it separates things
                  side by side, and these are not), and the sentence centres under
                  the name it belongs to. */}
              <motion.div
                variants={HERO_RISE}
                className="flex justify-center max-sm:pt-1"
              >
                <a
                  href={SISTER.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/sister pointer-events-auto flex items-center gap-3.5 max-sm:flex-col max-sm:gap-1"
                >
                  <span className="flex items-center gap-2.5 max-sm:gap-2">
                    <Image
                      src="/assets/logo.png"
                      alt=""
                      width={64}
                      height={64}
                      aria-hidden
                      draggable={false}
                      sizes="64px"
                      className="size-7 flex-none object-contain max-sm:size-5"
                    />
                    {/* One sentence, and it is the only thing this line has
                        ever needed to say.

                        It was the sister company's name set bold, a rule, and a
                        description of what that company does - a lockup for
                        TwinCoreTech at the foot of TwinLoom's own front page,
                        which reads as somebody else's advertisement on it.

                        What a reader wants at that point is the answer to the
                        question the two names raise: which is which. The
                        relationship is the fact, so the fact is the line. The
                        name is in it, in the ink the rest of the sentence is
                        set in, because it is a clause rather than a brand
                        standing on its own. */}
                    <span className="text-[13px] leading-[1.4] font-semibold tracking-[-0.01em] text-quiet max-sm:text-center max-sm:text-[min(11.5px,3vw)] lg:text-[13.5px]">
                      {/* The name in the ink, the rest in the quiet grey.

                          The sentence is about the two companies, and the one it
                          is on is TwinLoom - so that word is the subject and the
                          rest is what is being said about it. Weight rather than
                          a second colour: the line stands on the card's own
                          floor beside a logo, and a third colour down there
                          would be an ornament. */}
                      <b className="font-bold text-ink">TwinLoom</b> is a
                      trading name of TwinCoreTech Ltd
                    </span>
                    {/* The arrow travels with the name on a phone, where the
                        sentence is on its own line under both - left at the end
                        of the block it would be pointing away from a caption
                        rather than from the thing that is a link. */}
                    <ArrowUpRight
                      aria-hidden
                      className="hidden size-3.5 flex-none text-idx max-sm:block"
                    />
                  </span>
                  {/* The one mark that says this goes somewhere, and now the
                      only one. A tinted pill grew behind the row on hover, and
                      a plate under a line standing on the card's own floor is a
                      second surface on a surface - the trail of beads runs
                      under it, so what appeared was a grey window in the
                      picture. The arrow moves instead: it is already the thing
                      that says this is a link, so it is the right thing to
                      answer with. */}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 flex-none text-idx transition-transform duration-200 group-hover/sister:translate-x-0.5 group-hover/sister:-translate-y-0.5 max-sm:hidden"
                  />
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* Nothing stands in the bottom left any more.

          A thumbnail of the next slide did, and the card was cut back for it.
          Both are gone together, and they had to go together: the cut is a hole
          in the card, so a cut with nothing in it shows the page through the
          bottom left corner - which is the fault the notch has and gets away
          with because it is small and holds three arrows.

          What it cost is the way on to the next screen, and that was already in
          the arrows. What it bought is a card with one fewer thing on it, on a
          screen that now carries a headline, a paragraph and four doors. */}

      {/* No caption on the picture.

          The project's name and its trade were set over the bottom right of the
          artwork, and they are gone from it. What they were doing was labelling
          a photograph that is already the whole page - and the panel that opens
          from the corner says the same two things properly, with the rest of the
          project under them. A line of type over an image is a caption; the same
          line inside the thing it describes is a title. */}

      <ProjectPanel project={open} onClose={() => setOpen(null)} />

      {/* The way on, standing in the corner the card gives up for it.
          On the page rather than on the picture, which is the rule the rest of
          this card already followed: nothing floats over the artwork, and
          anything you can press has a piece cut out for it to stand in.

          An anchor rather than a scroll handler. It works before the JavaScript
          arrives, it can be opened in a new tab or copied, and the smooth part
          is the browser's job through `scroll-behavior`. */}
      {/* On every screen, the film included. It was off there while that screen
          carried its own stack of ways on - a black disc beside a black plate is
          a control nobody can see. Both have gone, so the corner holds the disc
          again: one way on, in one place, on all five. */}
      <div
        className="absolute right-0 bottom-0 flex items-center justify-center"
        style={{ width: cut.dropWidth, height: cut.dropHeight }}
      >
        <a
          href="#build"
          aria-label="Go to Build your website"
          className="group/down relative flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-pill bg-ink text-white transition-opacity hover:opacity-90 hover:[--drip:1s]"
        >
          {/* The column above the arrowhead. One class, three indexes: `--i`
                both places a dot and delays it, so the cascade always runs top
                to bottom at the spacing it is drawn at. Hidden from anything
                reading the page out, because it is the button's rhythm and not
                part of what the button says. */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              aria-hidden
              className="drip"
              style={{ "--i": i } as React.CSSProperties}
            />
          ))}

          <ArrowDown
            className="relative size-[18px] transition-transform duration-300 group-hover/down:translate-y-0.5"
            strokeWidth={2.2}
          />
        </a>
      </div>
    </div>
  );
}

/** One of the three controls that stand in the notch. */
function Tool({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[26px] cursor-pointer items-center justify-center rounded-pill text-quiet transition-colors hover:bg-well hover:text-ink sm:size-9"
    >
      {children}
    </button>
  );
}

/**
 * The three doors on the film screen, and the plate they stand on.
 *
 * The same three the first screen offers, in the same order and with the same
 * icons. They were two of their own once - "What we make" and "Send us a
 * message" - which is a third and fourth way of saying what the card already
 * says twice. Somebody turning from the first screen to this one should find
 * the doors where they left them.
 *
 * Stacked and at one width, because they stand in a corner rather than on a
 * row. The filled one leads, since a stack is read top to bottom.
 *
 * As wide as its longest label and no wider, which is what `w-max` on a column
 * of stretched children gives: the three come out the same width as each other,
 * and that width is the widest thing said on any of them.
 */

/**
 * The words over the film, and the only thing a scrub redraws.
 *
 * All of it is driven by one number - how far through the reel the scroll has
 * got - and that number changes fifty times over the length of the screen. Held
 * on the card, each change re-rendered the card; held here, it re-renders four
 * lines of type and a scroll cue.
 *
 * The setter is handed upward rather than the number downward, which is the
 * whole of the trick: the card keeps a reference to it and the reel calls it
 * directly, so nothing between the two has any reason to render at all.
 */
function FilmWords({
  bind,
  barDepth,
  pad,
}: {
  bind: (tell: ((along: number) => void) | null) => void;
  barDepth: number;
  pad: number;
}) {
  const [at, setAt] = useState(0);

  useEffect(() => {
    bind(setAt);
    return () => bind(null);
  }, [bind]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        paddingTop: barDepth + 26,
        paddingBottom: 26,
        paddingLeft: pad,
        paddingRight: pad,
      }}
    >
      <div className="relative size-full">
        {/* What to do, said once and then got out of the way.

            Nothing else on this card answers to a scroll, so nobody would
            try it unasked - and the whole screen depends on somebody trying
            it. It is set large because it is an instruction on a picture
            rather than a label on a control, and there is nothing at the top
            right of the frame competing with it.

            It leaves on the first turn of the wheel. An instruction that
            stays after it has been followed is a sign nobody took down; this
            is gone by a twentieth of the reel, which is about one notch, and
            the arrow drifts down as it goes so the last thing it does is
            point the way it was asking for. */}
        <div
          aria-hidden
          className="absolute top-0 right-0 flex items-center gap-3 text-right"
          style={{
            opacity: Math.max(0, 1 - at / 0.05),
            transform: `translateY(${Math.min(1, at / 0.05) * 18}px)`,
          }}
        >
          <span className="font-mono text-[13px] font-bold tracking-[0.24em] text-white uppercase drop-shadow-[0_2px_14px_rgba(24,32,44,0.55)] sm:text-[16px]">
            Scroll down
          </span>
          <ArrowDown
            className="size-5 shrink-0 text-white drop-shadow-[0_2px_14px_rgba(24,32,44,0.55)] sm:size-6"
            strokeWidth={2.4}
          />
        </div>

        {TITLES.map((line) => (
          <div
            key={line.lead}
            className={cn("absolute", PLACE[line.place])}
            style={title(at, line.show, line.hide, line.from)}
          >
            {/* No kicker over the line any more.

                There was one - four titles, each with a small uppercase
                label above it - and the case for it was that it filled the
                room the picture leaves without filling it with more
                shouting. What it actually did was announce each title before
                the title arrived, on a screen whose whole idea is that the
                words appear one at a time as the reel is scrolled. A caption
                read a beat before the thing it captions is a spoiler, and
                two lines fading up together is not a sequence.

                `over` is still written on each entry. It is four short
                phrases somebody wrote for these frames, and the day one of
                them is wanted again it should be the same words rather than
                words invented twice. */}

            {/* Two colours in one sentence, and it is not decoration.

                This reel is pale and busy: white type holds against the
                shadowed folds and disappears against the bright floor, and
                ink does the opposite. Splitting the sentence gives each half
                the colour that survives where it sits - and what falls out of
                that is a sentence with a stress in it, where the second half
                is the half that lands.

                The white half carries a shadow and the ink half does not.
                Ink on a pale frame needs no help; a shadow under it would be
                a grey edge on a black letter. */}
            {/* Two sizes as well as two colours, and the jump is the point.

                Set at one size the two halves are one sentence broken over
                two lines, which is a headline that happens to wrap. At two -
                the first about two fifths of the second - they become a
                qualifier and the thing it qualifies: small "Your clothing",
                enormous "store." The eye lands on the noun and picks up the
                rest on the way back, which is how a poster is read and not
                how a paragraph is.

                Two fifths was too far apart. At that ratio the white half
                stopped being the first half of a sentence and became a
                label above a word - and it is the half carrying "Your", so
                losing it costs the line the thing that makes it about the
                reader. Two thirds keeps the jump doing its work and keeps
                both halves reading as type of the same size family.

                The halves are sized in `em` off the block, so one clamp still
                decides the scale of the whole thing and the ratio between
                them holds at every width. Two clamps would be two curves
                crossing somewhere in the middle of the breakpoints.

                The small half is not simply smaller: it is lighter and its
                tracking opens, because type shrunk without either reads as
                the same headline further away. */}
            {/* The ceiling is what a wide screen actually gets, and it is
                set for the widest ones rather than for a laptop.

                `7.8vw` passed its old cap at about seventeen hundred points,
                so every screen above a laptop saw the same size - a 2K and a
                4K panel both got the number a fifteen-inch screen had
                already reached. The slope is what a small screen uses and
                the cap is what a large one gets, so raising the cap is the
                only thing a monitor feels.

                Three hundred, which the slope reaches at about thirty-five
                hundred points - so 2K is still fluid and climbing, and 4K
                settles just under it. The card is the height of the window
                on those screens too, so a title this size is a fraction of
                the frame rather than most of it. */}
            <p className="mt-2 text-[clamp(40px,8.6vw,300px)] leading-[0.9] font-extrabold tracking-[-0.055em] sm:mt-3">
              <span className="block text-[0.66em] leading-[1] font-extrabold tracking-[-0.04em] text-white drop-shadow-[0_2px_18px_rgba(24,32,44,0.5)]">
                {line.lead}
              </span>
              <span className="mt-[0.06em] block text-ink">{line.tail}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
