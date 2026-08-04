"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The name, as a liquid.

   The word is drawn once to an offscreen canvas and then put back on screen in
   narrow vertical strips, each lifted by its own amount. Move a cursor through
   it and the surface takes the disturbance, passes it to its neighbours, and
   carries on ringing after the cursor has gone.

   The displacement is a wave simulation, not a sine dressed up as one. Every
   strip is a mass tied to the two beside it, so a disturbance genuinely travels,
   reflects off the ends of the word and interferes with itself on the way back.
   Two crossing sines look like a flag; this looks like a liquid, and the whole
   difference is that the strips are coupled.

   Sampled from live text in the site's own typeface, so changing the name
   changes the liquid with nothing to re-export.
--------------------------------------------------------------------------- */

/** Strip width in CSS pixels. Narrow enough that the surface is continuous. */
const STRIP = 3;

/** The simulation runs at a fixed step so its stiffness never depends on frame rate. */
const TICK = 1 / 120;

/** How hard a strip is pulled toward its neighbours. Above ~0.5 it explodes. */
const TENSION = 0.34;
/** How hard it is pulled back to flat. */
const RESTORE = 0.0055;
/** What is left after each step. */
const DAMPING = 0.9955;

export function LiquidWord({
  word,
  className,
}: {
  word: string;
  className?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const box = frame.current;
    const canvas = surface.current;
    if (!box || !canvas) return;

    const paper = canvas.getContext("2d");
    if (!paper) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Two copies of the word: one in ink, one in the accent. The blue is drawn
       over the ink in proportion to how steep the surface is, which is what a
       liquid does with a light source and the cheapest way to say "this is not
       a flat picture of letters". */
    let inkArt: HTMLCanvasElement | null = null;
    let litArt: HTMLCanvasElement | null = null;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let strips = 0;

    /* Height and velocity per strip: the whole simulation. */
    let lift = new Float32Array(0);
    let speed = new Float32Array(0);

    let raf = 0;
    let last = 0;
    let carry = 0;
    let born = 0;

    let pointerX = Number.NaN;
    let wasX = Number.NaN;

    function paint(colour: string): HTMLCanvasElement | null {
      const art = document.createElement("canvas");
      art.width = Math.round(width * ratio);
      art.height = Math.round(height * ratio);

      const ink = art.getContext("2d");
      if (!ink || !box) return null;

      ink.scale(ratio, ratio);

      const family = getComputedStyle(box).fontFamily || "system-ui, sans-serif";

      /* As large as the box will take, then measured and corrected, because the
         guess from character count is only ever close. */
      let size = Math.min((width * 0.96) / (word.length * 0.52), height * 0.72);
      ink.font = `900 ${size}px ${family}`;
      const measured = ink.measureText(word).width;
      if (measured > width * 0.96) size *= (width * 0.96) / measured;

      ink.font = `900 ${size}px ${family}`;
      ink.textAlign = "center";
      ink.textBaseline = "middle";
      ink.fillStyle = colour;
      ink.fillText(word, width / 2, height / 2);

      return art;
    }

    async function build() {
      if (document.fonts?.ready) await document.fonts.ready;
      if (!box || width < 2) return;

      inkArt = paint("#111827");
      litArt = paint("#2563eb");

      strips = Math.ceil(width / STRIP);
      lift = new Float32Array(strips);
      speed = new Float32Array(strips);
      born = performance.now();
    }

    function resize() {
      if (!box || !canvas || !paper) return;

      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.clientWidth;
      height = box.clientHeight;
      if (!width || !height) return;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      paper.setTransform(ratio, 0, 0, ratio, 0, 0);

      void build();
    }

    /** Push the surface down at a point, spread over a few strips. */
    function disturb(at: number, force: number, spread: number) {
      for (let off = -spread; off <= spread; off += 1) {
        const on = at + off;
        if (on < 0 || on >= strips) continue;
        /* A raised cosine, so the dent has no corners to ring at. */
        const share = (Math.cos((off / spread) * Math.PI) + 1) / 2;
        speed[on] += force * share;
      }
    }

    function simulate() {
      const previous = lift;

      for (let at = 0; at < strips; at += 1) {
        /* The ends are held, which is what lets a wave reflect off them instead
           of walking out of the word and vanishing. */
        const left = previous[at === 0 ? 0 : at - 1];
        const right = previous[at === strips - 1 ? strips - 1 : at + 1];

        const pull = (left + right - 2 * previous[at]) * TENSION;
        speed[at] = (speed[at] + pull - previous[at] * RESTORE) * DAMPING;
      }

      for (let at = 0; at < strips; at += 1) lift[at] += speed[at];
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!paper || !inkArt || !litArt || !strips) return;

      const dt = Math.min((now - last) / 1000, 1 / 15) || 0;
      last = now;

      if (!still) {
        /* Fixed steps, so the surface has the same stiffness on every machine.
           A variable step would make the liquid thicker on a slow frame. */
        carry = Math.min(carry + dt, 0.1);
        while (carry >= TICK) {
          simulate();
          carry -= TICK;
        }

        /* A slow swell fed in at both ends, so it is never quite at rest. */
        const t = now / 1000;
        speed[1] += Math.sin(t * 0.9) * 0.012;
        speed[strips - 2] += Math.sin(t * 0.72 + 2) * 0.012;

        /* The cursor drags the surface with it, harder the faster it moves. */
        if (!Number.isNaN(pointerX)) {
          const at = Math.round(pointerX / STRIP);
          const swept = Number.isNaN(wasX) ? 0 : Math.abs(pointerX - wasX);
          disturb(at, -0.55 - Math.min(swept, 60) * 0.045, 9);
          wasX = pointerX;
        }
      }

      const settle = still ? 1 : Math.min((now - born) / 900, 1);

      paper.clearRect(0, 0, width, height);

      const sourceStrip = STRIP * ratio;
      const sourceHeight = height * ratio;

      for (let at = 0; at < strips; at += 1) {
        const x = at * STRIP;
        const y = lift[at] * settle;

        /* How steep the surface is here. It drives both the stretch and the
           sheen: a liquid thins where it is pulled and catches the light there. */
        const slope =
          Math.abs(
            (lift[Math.min(strips - 1, at + 1)] -
              lift[Math.max(0, at - 1)]) /
              2,
          ) * settle;

        const stretch = 1 + Math.min(slope * 0.05, 0.22);
        const drawn = height * stretch;
        const top = y - (drawn - height) / 2;

        /* A pixel wider than the strip, so neighbours overlap and no seam shows
           where two of them meet. */
        paper.drawImage(
          inkArt,
          at * sourceStrip,
          0,
          sourceStrip + ratio,
          sourceHeight,
          x,
          top,
          STRIP + 1,
          drawn,
        );

        const sheen = Math.min(slope * 0.09, 0.85);
        if (sheen > 0.01) {
          paper.globalAlpha = sheen;
          paper.drawImage(
            litArt,
            at * sourceStrip,
            0,
            sourceStrip + ratio,
            sourceHeight,
            x,
            top,
            STRIP + 1,
            drawn,
          );
          paper.globalAlpha = 1;
        }
      }
    }

    function onPointer(event: PointerEvent) {
      if (!box) return;
      const bounds = box.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
    }

    function onLeave() {
      pointerX = Number.NaN;
      wasX = Number.NaN;
    }

    function onDown(event: PointerEvent) {
      if (!box || still) return;
      const bounds = box.getBoundingClientRect();
      disturb(Math.round((event.clientX - bounds.left) / STRIP), -5.5, 16);
    }

    const watcher = new ResizeObserver(resize);
    watcher.observe(box);

    box.addEventListener("pointermove", onPointer, { passive: true });
    box.addEventListener("pointerleave", onLeave, { passive: true });
    box.addEventListener("pointerdown", onDown, { passive: true });

    resize();
    last = performance.now();
    born = performance.now();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      watcher.disconnect();
      box.removeEventListener("pointermove", onPointer);
      box.removeEventListener("pointerleave", onLeave);
      box.removeEventListener("pointerdown", onDown);
    };
  }, [word]);

  return (
    /* The height is a class rather than an inline style so a caller can take it
       off. An inline height beats every class, so anywhere this had to fill a
       box it was stuck at its own clamp and left a strip of empty under itself.
       Through the merge, a height passed in wins and this is the default. */
    <div
      ref={frame}
      className={cn("h-[clamp(160px,30svh,300px)]", className)}
    >
      <canvas ref={surface} aria-hidden className="block h-full w-full" />
    </div>
  );
}
