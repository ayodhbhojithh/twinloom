"use client";

import { useEffect, useRef, useState } from "react";

import { outline, type Cuts } from "./notched-card";

/* ---------------------------------------------------------------------------
   A film you scroll rather than watch.

   It was a `<video>`, and a video plays at its own speed whatever anybody is
   doing. This runs at the reader's: the frames are stills, and which one is on
   screen is decided by where the scroll inside the card has got to. Stop and it
   stops on that frame. Go back and it goes back.

   Stills rather than seeking the video, and that is the whole reason this
   exists. Setting `currentTime` on an H.264 file makes the browser jump to the
   nearest keyframe and decode forward to the one asked for, which at scroll
   rates is a decode per frame and a stutter anybody can count. A JPEG is already
   a frame: drawing one is a copy.

   The cost is honest and worth naming - a hundred and twenty stills at 1280 is
   about four and a half megabytes against two and a half for the film. They are
   fetched in the background in the order they will be needed, one after another
   rather than all at once, so nothing waits for the set and nothing competes
   with the frame that is actually on screen.

   Scrolled inside its own frame, not by the page. The card is one screenful and
   the page behind it has its own job; a picture that hijacked the page scroll
   would be a picture that stops anybody leaving. This has a scroller of its own,
   and a wheel that reaches either end of it hands the scroll back to the page -
   which is what a browser does by default, and the one behaviour nobody has to
   be taught.
--------------------------------------------------------------------------- */

/**
 * What stands in the notch, measured rather than guessed.
 *
 * The notch is sized from the plate in it, exactly as it is on the card. A cut
 * sized as a fraction of the picture is a cut too small for its contents on a
 * phone and a hole on a desk.
 */
const PLATE = 26;

/**
 * What stands in the corner given up at the bottom right.
 *
 * The height of the control that goes there plus the air round it, and a floor
 * under the width so a short label does not give a cut narrower than its own
 * curves. Measured from the thing rather than taken as a share of the picture:
 * a fraction of a phone is a hole too small for a button, and a fraction of a
 * desk is a bite out of the film.
 *
 * The corner rather than the middle of the bottom edge. A notch cut into the
 * centre of an edge is a piece taken out of a symmetrical thing, and it reads as
 * a handle on the picture - which is right for the label at the top, because a
 * label belongs to the whole frame. A control is not about the whole frame; it
 * is the thing you do next, and the thing you do next belongs where reading
 * ends. The card behind this puts its own way on in exactly the same corner.
 */
const FOOT = 42;
const FOOT_WIDE = 186;

/**
 * How wide the film may ever be drawn: the source's own width.
 *
 * The stills are 1280 across. Anything past this is the browser inventing
 * pixels, and a frame invented at half again its size is soft across the whole
 * of it - which on a screen given over entirely to one picture is the only thing
 * there is to look at.
 */
const NATIVE = 1280;

/**
 * How much scrolling the whole reel takes, as multiples of its own height.
 *
 * Four, which is about two turns of a wheel. Less and the frames flick past too
 * fast to read as motion; more and somebody is scrolling a picture for longer
 * than they would have spent watching it.
 */
const RUN = 4;

/** How many to settle for early, so a small scroll is never blank. */
const AHEAD = 12;

export function FilmStage({
  base,
  frames,
  kind,
  foot,
}: {
  /** The folder the stills are in, without a trailing slash. */
  base: string;
  /** How many there are. They are named `001.jpg` upward. */
  frames: number;
  kind: string;
  /**
   * What stands in the notch cut out of the bottom edge.
   *
   * Optional, and the cut only exists when something is given for it - a notch
   * with nothing in it is a hole in the picture. Passed in rather than built
   * here, because what the screen is asking anybody to do is the screen's
   * business and this only knows how to make room for it.
   */
  foot?: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const face = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const outer = box.current;
    const scroller = track.current;
    const canvas = face.current;
    if (!outer || !scroller || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    /* Every still, in one array, filled in as each arrives. A slot still empty
       is skipped rather than waited for - see `nearest`. */
    const shots: (HTMLImageElement | null)[] = new Array(frames).fill(null);
    let alive = true;
    let want = 0;
    let drawn = -1;
    let ticking = 0;

    const src = (n: number) => `${base}/${String(n + 1).padStart(3, "0")}.jpg`;

    const load = (n: number) =>
      new Promise<void>((done) => {
        if (!alive || shots[n]) return done();
        /* `window.Image`, not `Image`. The name is taken in this file by
           `next/image`, and `new Image()` on that is a component being
           constructed rather than a bitmap being fetched. */
        const img = new window.Image();
        img.decoding = "async";
        img.onload = () => {
          if (alive) shots[n] = img;
          done();
        };
        img.onerror = () => done();
        img.src = src(n);
      });

    /**
     * The nearest frame that has actually arrived.
     *
     * While the set is still coming in, the honest thing to show is the closest
     * one there is rather than nothing: a picture a few frames stale reads as a
     * slightly coarse film, where a blank reads as broken.
     */
    const nearest = (at: number) => {
      for (let off = 0; off < frames; off += 1) {
        const back = at - off;
        const on = at + off;
        if (back >= 0 && shots[back]) return shots[back];
        if (on < frames && shots[on]) return shots[on];
      }
      return null;
    };

    const paint = () => {
      ticking = 0;
      if (want === drawn) return;

      const shot = nearest(want);
      if (!shot) return;
      drawn = want;

      const w = canvas.width;
      const h = canvas.height;
      /* Cover, worked out here rather than left to CSS: the canvas is the size
         of the box and the still is sixteen by nine, and the two only differ
         while the box is being resized. */
      const scale = Math.max(w / shot.naturalWidth, h / shot.naturalHeight);
      const dw = shot.naturalWidth * scale;
      const dh = shot.naturalHeight * scale;

      ctx.drawImage(shot, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    /* One paint a frame at most. A wheel fires far more often than the screen
       refreshes, and painting on every event is the same picture drawn three
       times before anybody sees one of them. */
    const settle = () => {
      if (!ticking) ticking = requestAnimationFrame(paint);
    };

    const onScroll = () => {
      const room = scroller.scrollHeight - scroller.clientHeight;
      const along = room > 0 ? scroller.scrollTop / room : 0;
      want = Math.min(
        frames - 1,
        Math.max(0, Math.round(along * (frames - 1))),
      );
      settle();
    };

    const measure = () => {
      const rect = outer.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;

      /* One and a half at most. This is a photograph redrawn on every wheel
         notch; past that the copy costs more than the sharpness is worth, and
         the stills are 1280 wide either way. */
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      setSize({ w: rect.width, h: rect.height });

      drawn = -1;
      settle();
    };

    const bounds = new ResizeObserver(measure);
    bounds.observe(outer);
    scroller.addEventListener("scroll", onScroll, { passive: true });

    measure();

    /* The first frame, then the next dozen, then the rest - in the order they
       are scrolled through. One at a time rather than all at once: a hundred and
       twenty parallel requests is a hundred and twenty things competing with the
       one that is on screen. */
    void (async () => {
      await load(0);
      settle();

      for (let n = 1; n < frames && alive; n += 1) {
        await load(n);
        if (n <= AHEAD) settle();
      }
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(ticking);
      bounds.disconnect();
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [base, frames]);

  const cut: Cuts = (() => {
    const w = Math.max(size.w, 1);
    const h = Math.max(size.h, 1);

    /* The card's own two numbers at this size, from the same expressions. */
    const radius = Math.max(14, Math.min(w * 0.018 + 10, 26));
    const flare = Math.max(14, Math.min(h * 0.04, 22));

    /* The notch takes its depth from what stands in it, which is where its two
       arcs meet - anything deeper is a straight wall between them. */
    const barFlare = Math.min(flare, (PLATE + 8) / 2);

    return {
      radius,
      barWidth: Math.min(Math.max(96, w * 0.14), w - 2 * (radius + flare) - 20),
      barDepth: barFlare * 2,
      barRadius: barFlare,
      barFlare,
      /* Nought, which `outline` reads as no cut at all - and the bottom left
         comes back as an ordinary rounded corner. */
      biteWidth: 0,
      biteHeight: 0,
      biteRadius: flare,
      biteFlare: flare,
      /* The bottom right, given up for whatever stands there. Wider than it is
         deep, because what stands there is a pill rather than a disc - the drop
         takes its two dimensions separately for exactly this. Collapsed to
         nothing when there is nothing to hold, which `outline` reads as a
         corner. */
      dropWidth: foot ? Math.min(Math.max(FOOT_WIDE, w * 0.2), w * 0.55) : 0,
      dropHeight: foot ? FOOT : 0,
      dropRadius: foot ? Math.min(flare, FOOT / 2) : flare,
      dropFlare: foot ? Math.min(flare, FOOT / 2) : flare,
    };
  })();

  const path = size.w > 40 ? outline(size.w, size.h, cut) : "";

  return (
    <div
      ref={box}
      className="relative aspect-video max-h-full w-full"
      style={{ maxWidth: NATIVE }}
    >
      {/* The scroller, cut to the shape. The clip is drawn in the coordinates of
          the element it is set on, so this has to be exactly the picture. */}
      <div
        ref={track}
        className="pointer-events-auto absolute inset-0 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      >
        {/* Four screenfuls of nothing, with the picture stuck to the top of
            them. Nothing is drawn down here - the height is the only thing this
            element is for, and it is what turns a wheel into a frame number. */}
        <div className="relative" style={{ height: `${RUN * 100}%` }}>
          <div
            className="sticky top-0 w-full"
            style={{ height: `${100 / RUN}%` }}
          >
            <canvas
              ref={face}
              aria-hidden
              className="block size-full bg-field"
            />
          </div>
        </div>
      </div>

      {/* And what the screen is asking for, standing in the corner it gives up.

          In a cut rather than on the picture, which is the rule the whole site
          is drawn by: anything you can press stands in a piece taken out of the
          surface. A button laid over a photograph is a button somebody has put
          there; a button standing in a hole in it is part of the same object.

          It is also the only place on this screen a control could go without
          being on the film. Over the frame it would move with whatever is behind
          it, and beside the words it was one more line of a column that already
          had four. */}
      {foot ? (
        <div
          className="pointer-events-none absolute right-0 bottom-0 flex items-center justify-center"
          style={{ width: cut.dropWidth, height: cut.dropHeight }}
        >
          {foot}
        </div>
      ) : null}

      {/* What it is, standing in the notch. No plate behind it: the notch is
          already the outline, and a pill drawn inside it is a second shape
          inside the first. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 flex -translate-x-1/2 items-center justify-center"
        style={{ width: cut.barWidth, height: cut.barDepth }}
      >
        <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-label uppercase">
          {kind}
        </span>
      </div>
    </div>
  );
}
