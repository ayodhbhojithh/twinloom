"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The mark, at the size of a card.

   A figure of eight drawn as a glossy thread, with two balls carried round it,
   dotted haloes standing off each lobe, and a few small coloured spheres
   floating clear of the whole thing. Not a word on it. It is the second screen
   of the landing card and it is a picture, not a slide with a picture behind
   it.

   The figure is a Gerono lemniscate rather than two touching circles. Two
   circles meet at a corner and the eye finds it immediately; the lemniscate is
   one curve that passes through itself, which is what the name means and what
   the logo draws.

     x = cos t
     y = sin 2t / 2

   The third dimension is the whole trick. `z = sin t` puts the crossing at
   z = +1 on one pass and z = -1 on the other, so the thread genuinely goes over
   itself rather than two flat strokes meeting. Everything else follows from it:
   the perspective, how fat the thread is, how far its colour has been washed
   toward white by the air in front of it, and the order things are painted in.

   Painted in three passes per half, and that ordering is not cosmetic. Each
   capsule is drawn with a round cap so the joins disappear, which means every
   capsule reaches a little way into its neighbours. Draw base-then-highlight
   one segment at a time and the next segment's base lands on the last one's
   highlight, all the way along: what you get is a comb of white crescents. Base
   for the whole half, then the soft highlight for the whole half, then the hot
   one, and each pass only ever overlaps itself.

   None of the thread moves, so none of it is redrawn. Both halves are painted
   once into their own canvas at the size on the screen, and a frame is two
   `drawImage` calls with the depth-sorted spheres dropped in between them. What
   is left to compute is what actually moves: the balls round the thread, the
   light running along it, the haloes turning and the motes bobbing.
--------------------------------------------------------------------------- */

const TAU = Math.PI * 2;

/** How many capsules the thread is drawn as, and how many on a phone. */
const SEGMENTS = 220;
const PHONE_SEGMENTS = 132;

/** How tall the lobes stand, against how wide the figure runs. */
const RISE = 0.66;

/** Where each lobe's halo is centred, along the figure's own half-width. */
const LOBE = 0.52;

/** How much nearer reads as bigger: on the thread, and on a ball riding it. */
const NEAR = 0.1;
const LIFT = 0.14;

/** Where the light is. Everything glossy is lit from the same upper left. */
const LIT_X = -0.45;
const LIT_Y = -0.89;

/* The haloes, as a radius against the figure's half-width.

   Four of them, each thinner and fainter than the last, and each turning at its
   own rate and in its own direction. Equal spacing at one shared speed would be
   a target drawn round the lobe; unequal, they read as air. */
const HALOES = [
  { at: 0.4, dots: 62, size: 2, alpha: 0.46, spin: 0.055 },
  { at: 0.48, dots: 78, size: 1.6, alpha: 0.34, spin: -0.041 },
  { at: 0.56, dots: 96, size: 1.3, alpha: 0.24, spin: 0.029 },
  { at: 0.64, dots: 116, size: 1, alpha: 0.16, spin: -0.021 },
] as const;

/** How much of each halo ring is drawn, centred on the lobe's outer side. */
const SPAN = Math.PI * 1.34;

/** How much the haloes are squashed, so they stand in the same space as the mark. */
const SQUASH = 0.9;

/* The motes: coloured spheres floating clear of the figure.

   Seven of them, placed by hand in the card's own coordinates rather than
   scattered, and every one of them kept out of the four cuts in the card's edge
   - a sphere half eaten by the notch is not a sphere in the distance, it is a
   sphere that has broken.

   The colours are not the mark's. Purple, orange, red, cyan and a green that is
   not quite the mark's green appear nowhere else on the site, and that is what
   they are for: two colours on a white card is a logo, and this is meant to be a
   picture of one. Sizes run from a third of a ball down to a fifth, which is
   what puts them at different distances without anything else having to say so. */
const MOTES = [
  { x: 0.265, y: 0.135, r: 0.065, z: 0.55, ink: "#7c4dff", bob: 1.1 },
  { x: 0.745, y: 0.1, r: 0.048, z: -0.35, ink: "#ff7a1a", bob: 0.9 },
  { x: 0.565, y: 0.88, r: 0.058, z: 0.7, ink: "#ff4d5e", bob: 1.25 },
  { x: 0.075, y: 0.3, r: 0.045, z: -0.6, ink: "#22bde8", bob: 0.7 },
  { x: 0.935, y: 0.48, r: 0.03, z: -0.8, ink: "#2e7cff", bob: 0.55 },
  { x: 0.335, y: 0.9, r: 0.034, z: -0.45, ink: "#10c996", bob: 1.4 },
  { x: 0.885, y: 0.17, r: 0.026, z: 0.35, ink: "#9b5cff", bob: 0.8 },
] as const;

/** Two balls and the motes, all sorted into the thread by depth. */
const ORBS = 2 + MOTES.length;

/** How far either side of a glint the light reaches, in capsules. */
const GLINT = 13;

/* How the glow is built.

   Ten strokes of the same thread, each a little narrower and each barely
   visible, is a soft edge without a blur filter - and since the thread is
   painted once into a canvas that is then only ever copied, the cost of ten
   passes is paid once per resize rather than sixty times a second. */
const GLOW = 10;

type Ink = [number, number, number];

/** A hex triple as numbers, or the fallback if it is anything else. */
function ink(value: string, fallback: Ink): Ink {
  const hex = value.trim();
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return fallback;
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

const blend = (a: Ink, b: Ink, u: number): Ink => [
  a[0] + (b[0] - a[0]) * u,
  a[1] + (b[1] - a[1]) * u,
  a[2] + (b[2] - a[2]) * u,
];

const css = (c: Ink, a = 1) =>
  `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

/** Everything a frame reads, worked out once per resize and then left alone. */
interface Table {
  cx: number;
  cy: number;
  reach: number;
  width: number;
  /* The thread. `split` is where the far half ends in `order`. */
  n: number;
  split: number;
  px: Float32Array;
  py: Float32Array;
  pz: Float32Array;
  order: Int32Array;
  /* The highlight, offset across the thread toward the light. Static, because
     the thread is. */
  gx: Float32Array;
  gy: Float32Array;
  /* The haloes, the blue lobe first, so a frame sets two fills and not eight
     hundred. */
  hx: Float32Array;
  hr: Float32Array;
  ha: Float32Array;
  hs: Float32Array;
  hal: Float32Array;
  hspin: Float32Array;
  blues: number;
  /* The thread, already painted, one canvas per half. */
  far: HTMLCanvasElement;
  near: HTMLCanvasElement;
}

/**
 * The mark, drawn.
 *
 * `speed` scales the whole animation, so a card that wants it calmer asks for
 * less rather than the numbers above being edited.
 */
export function LoomMark({
  className,
  speed = 1,
}: {
  className?: string;
  speed?: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = box.current;
    const canvas = sheet.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* The two colours are the mark's own, read from the stylesheet rather than
       written here, so the day the brand moves this moves with it. */
    const style = getComputedStyle(document.documentElement);
    const BLUE = ink(
      style.getPropertyValue("--color-thread-blue"),
      [42, 152, 254],
    );
    const TEAL = ink(
      style.getPropertyValue("--color-thread-teal"),
      [6, 219, 175],
    );
    const WHITE: Ink = [255, 255, 255];
    const blueCss = css(BLUE);
    const tealCss = css(TEAL);

    let table: Table | null = null;
    let frame = 0;
    let seen = true;
    let clock = 0;
    let last = 0;
    let dpr = 1;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** Where a point of the figure lands, and how near it is. */
    const spot = { x: 0, y: 0, z: 0 };
    const at = (t: number, cx: number, cy: number, reach: number) => {
      const z = Math.sin(t);
      const k = 1 + z * NEAR;
      spot.x = cx + reach * Math.cos(t) * k;
      spot.y = cy + reach * RISE * 0.5 * Math.sin(t * 2) * k;
      spot.z = z;
    };

    /** How fat the thread is where it is this near. */
    const fat = (width: number, z: number) => width * (0.78 + 0.11 * (z + 1));

    const build = (w: number, h: number) => {
      const reach = Math.min(w * 0.345, h * 0.84);
      const cx = w / 2;
      const cy = h / 2;
      const width = reach * 0.125;
      const n = w < 640 ? PHONE_SEGMENTS : SEGMENTS;

      const px = new Float32Array(n);
      const py = new Float32Array(n);
      const pz = new Float32Array(n);
      const gx = new Float32Array(n);
      const gy = new Float32Array(n);
      const base: string[] = new Array(n);
      const soft: string[] = new Array(n);
      const hot: string[] = new Array(n);

      for (let i = 0; i < n; i += 1) {
        at((i / n) * TAU, cx, cy, reach);
        px[i] = spot.x;
        py[i] = spot.y;
        pz[i] = spot.z;
      }

      for (let i = 0; i < n; i += 1) {
        const j = (i + 1) % n;
        const z = pz[i];
        const t = (i / n) * TAU;

        /* Blue on the left of the figure and the mark's green on the right, and
           the change happens through the crossing rather than at a seam. Then
           washed toward white by how far back it is, which is the only reason
           the far strand reads as far. Baked into the colour rather than left to
           `globalAlpha`, because a transparent capsule and its neighbour double
           up where their round caps overlap. */
        const along = (1 + Math.cos(t)) / 2;
        const haze = 0.3 - z * 0.26;
        const paint = blend(blend(BLUE, TEAL, along), WHITE, haze);

        /* Across the thread, toward the light. Signed rather than flipped: as
           the thread turns away the offset runs back to nothing and the
           highlight fades out with it, where a flip would tear it in half. */
        const dx = px[j] - px[i];
        const dy = py[j] - py[i];
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const face = nx * LIT_X + ny * LIT_Y;
        const off = fat(width, z) * 0.19 * face;

        gx[i] = nx * off;
        gy[i] = ny * off;
        base[i] = css(paint);
        soft[i] = css(blend(paint, WHITE, 0.18 + 0.2 * Math.abs(face)));
        hot[i] = css(blend(paint, WHITE, 0.3 + 0.42 * Math.abs(face)));
      }

      const order = Int32Array.from({ length: n }, (_, i) => i).sort(
        (a, b) => pz[a] - pz[b],
      );
      let split = 0;
      while (split < n && pz[order[split]] < 0) split += 1;

      /* The haloes. One side at a time and all of it, so the frame sets one
         fill for every blue dot and one for every green. */
      const thin = w < 640 ? 0.6 : 1;
      let count = 0;
      for (const ring of HALOES) count += Math.round(ring.dots * thin);
      count *= 2;

      const hx = new Float32Array(count);
      const hr = new Float32Array(count);
      const ha = new Float32Array(count);
      const hs = new Float32Array(count);
      const hal = new Float32Array(count);
      const hspin = new Float32Array(count);

      let put = 0;
      for (const side of [-1, 1] as const) {
        for (const ring of HALOES) {
          const dots = Math.round(ring.dots * thin);
          for (let d = 0; d < dots; d += 1) {
            const along = d / (dots - 1);
            /* Centred on the lobe's outer side and stopping short of the
               crossing, so a ring stands off the figure rather than being drawn
               through it. The ends fade rather than stop. */
            hx[put] = cx + side * reach * LOBE;
            hr[put] = reach * ring.at;
            ha[put] = (side < 0 ? Math.PI : 0) + (along - 0.5) * SPAN;
            hs[put] = ring.size;
            hal[put] = ring.alpha * Math.pow(Math.sin(along * Math.PI), 0.5);
            hspin[put] = ring.spin;
            put += 1;
          }
        }
      }

      /* Both halves, painted once each. */
      const far = table?.far ?? document.createElement("canvas");
      const near = table?.near ?? document.createElement("canvas");

      for (const layer of [far, near]) {
        layer.width = canvas.width;
        layer.height = canvas.height;
      }

      const half = (layer: HTMLCanvasElement, from: number, to: number) => {
        const on = layer.getContext("2d");
        if (!on) return;
        on.setTransform(dpr, 0, 0, dpr, 0, 0);
        on.clearRect(0, 0, w, h);
        on.lineCap = "round";

        /* The glow, widest first. */
        on.globalAlpha = 0.035;
        for (let g = 0; g < GLOW; g += 1) {
          const swell = 3 - (g / GLOW) * 2;
          for (let s = from; s < to; s += 1) {
            const i = order[s];
            const j = (i + 1) % n;
            on.strokeStyle = base[i];
            on.lineWidth = fat(width, pz[i]) * swell;
            on.beginPath();
            on.moveTo(px[i], py[i]);
            on.lineTo(px[j], py[j]);
            on.stroke();
          }
        }
        on.globalAlpha = 1;

        /* Then the thread, its soft highlight, and its hot one - each pass
           whole, so no pass ever paints over the one before it. */
        for (let pass = 0; pass < 3; pass += 1) {
          for (let s = from; s < to; s += 1) {
            const i = order[s];
            const j = (i + 1) % n;
            const k = fat(width, pz[i]);

            if (pass === 0) {
              on.strokeStyle = base[i];
              on.lineWidth = k;
              on.beginPath();
              on.moveTo(px[i], py[i]);
              on.lineTo(px[j], py[j]);
            } else {
              on.strokeStyle = pass === 1 ? soft[i] : hot[i];
              on.lineWidth = pass === 1 ? k * 0.58 : k * 0.26;
              on.beginPath();
              on.moveTo(px[i] + gx[i], py[i] + gy[i]);
              on.lineTo(px[j] + gx[i], py[j] + gy[i]);
            }
            on.stroke();
          }
        }
      };

      table = {
        cx,
        cy,
        reach,
        width,
        n,
        split,
        px,
        py,
        pz,
        order,
        gx,
        gy,
        hx,
        hr,
        ha,
        hs,
        hal,
        hspin,
        blues: count / 2,
        far,
        near,
      };

      half(far, 0, split);
      half(near, split, n);
    };

    /* A sphere: a body lit from the upper left, a rim where the light wraps
       round the far side, one specular, and a soft shadow beneath it. */
    const orb = (x: number, y: number, r: number, tint: Ink) => {
      if (r < 0.8) return;

      const under = ctx.createRadialGradient(
        x,
        y + r * 1.05,
        0,
        x,
        y + r * 1.05,
        r * 1.6,
      );
      under.addColorStop(0, "rgba(23,40,58,0.19)");
      under.addColorStop(1, "rgba(23,40,58,0)");
      ctx.fillStyle = under;
      ctx.beginPath();
      ctx.ellipse(x, y + r * 1.05, r * 1.6, r * 0.44, 0, 0, TAU);
      ctx.fill();

      const body = ctx.createRadialGradient(
        x - r * 0.3,
        y - r * 0.36,
        r * 0.04,
        x,
        y,
        r * 1.06,
      );
      body.addColorStop(0, css(blend(tint, WHITE, 0.72)));
      body.addColorStop(0.42, css(tint));
      body.addColorStop(1, css(blend(tint, [12, 30, 56], 0.3)));
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();

      const rim = ctx.createRadialGradient(x, y, r * 0.78, x, y, r);
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(1, css(blend(tint, WHITE, 0.6), 0.55));
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();

      const shine = ctx.createRadialGradient(
        x - r * 0.34,
        y - r * 0.4,
        0,
        x - r * 0.34,
        y - r * 0.4,
        r * 0.36,
      );
      shine.addColorStop(0, "rgba(255,255,255,0.95)");
      shine.addColorStop(0.45, "rgba(255,255,255,0.3)");
      shine.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = shine;
      ctx.beginPath();
      ctx.ellipse(x - r * 0.32, y - r * 0.38, r * 0.36, r * 0.28, -0.5, 0, TAU);
      ctx.fill();
    };

    /* The orbs, sorted by depth each frame. Seven of them, so the sort is four
       lines of insertion rather than a comparator and an allocation. */
    const ox = new Float64Array(ORBS);
    const oy = new Float64Array(ORBS);
    const oz = new Float64Array(ORBS);
    const orr = new Float64Array(ORBS);
    const otint: Ink[] = new Array(ORBS);
    const seq = new Int32Array(ORBS);

    const draw = (t: number) => {
      const set = table;
      if (!set) return;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const { n, px, py, pz, gx, gy, width, reach, cx, cy } = set;

      /* The haloes, behind everything. Two fills for eight hundred dots. */
      ctx.fillStyle = blueCss;
      for (let i = 0; i < set.hx.length; i += 1) {
        if (i === set.blues) ctx.fillStyle = tealCss;
        const a = set.ha[i] + t * set.hspin[i];
        ctx.globalAlpha = set.hal[i];
        ctx.beginPath();
        ctx.arc(
          set.hx[i] + set.hr[i] * Math.cos(a),
          cy + set.hr[i] * SQUASH * Math.sin(a),
          set.hs[i],
          0,
          TAU,
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* The two balls, half a circuit apart, so there is one on each lobe for
         most of the way round and they pass through each other at the crossing -
         which is the one place on the figure where passing through each other is
         the point. Their colour comes from where they are, so a ball is always
         the colour of the thread it is riding. */
      const travel = t * 0.19 * speed;
      for (let b = 0; b < 2; b += 1) {
        const tt = travel + b * Math.PI;
        at(tt, cx, cy, reach);
        ox[b] = spot.x;
        oy[b] = spot.y;
        oz[b] = spot.z;
        orr[b] = width * 1.06 * (1 + spot.z * LIFT);
        otint[b] = blend(BLUE, TEAL, (1 + Math.cos(tt)) / 2);
      }

      for (let m = 0; m < MOTES.length; m += 1) {
        const mote = MOTES[m];
        const i = 2 + m;
        ox[i] = mote.x * w;
        oy[i] = mote.y * h + Math.sin(t * mote.bob + m * 1.7) * reach * 0.022;
        oz[i] = mote.z;
        orr[i] = mote.r * reach;
        otint[i] = ink(mote.ink, BLUE);
      }

      for (let i = 0; i < ORBS; i += 1) seq[i] = i;
      for (let i = 1; i < ORBS; i += 1) {
        const held = seq[i];
        let k = i - 1;
        while (k >= 0 && oz[seq[k]] > oz[held]) {
          seq[k + 1] = seq[k];
          k -= 1;
        }
        seq[k + 1] = held;
      }

      /* The far strand, then whatever is floating between the strands, then the
         near one over the top of it. Both strands are pictures by now. */
      ctx.drawImage(set.far, 0, 0, w, h);

      let put = 0;
      while (put < ORBS && oz[seq[put]] < 0) {
        const o = seq[put];
        orb(ox[o], oy[o], orr[o], otint[o]);
        put += 1;
      }

      ctx.drawImage(set.near, 0, 0, w, h);

      /* The light running along the thread, just ahead of each ball.

         Four strokes, each shorter than the last and each barely there, so the
         run brightens toward its middle without a gradient - and each is one
         path rather than a row of capsules, which is what keeps it a run of
         light and not a row of ticks. Faded out by depth, so when it goes round
         the back it goes out. */
      ctx.lineCap = "round";
      for (let b = 0; b < 2; b += 1) {
        const head = travel + b * Math.PI + 0.55;
        const lead = Math.round((head / TAU) * n);
        const deep = Math.sin(head);
        const show = Math.max(0, deep) * 0.5;
        if (show < 0.02) continue;

        for (const span of [1, 0.66, 0.4, 0.2]) {
          const arm = Math.max(1, Math.round(GLINT * span));
          ctx.strokeStyle = `rgba(255,255,255,${show * 0.34})`;
          ctx.beginPath();
          for (let k = -arm; k <= arm; k += 1) {
            const i = (((lead + k) % n) + n) % n;
            const x = px[i] + gx[i];
            const y = py[i] + gy[i];
            if (k === -arm) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineWidth = fat(width, pz[((lead % n) + n) % n]) * 0.26;
          ctx.stroke();
        }
      }

      while (put < ORBS) {
        const o = seq[put];
        orb(ox[o], oy[o], orr[o], otint[o]);
        put += 1;
      }
    };

    const tick = (now: number) => {
      const gap = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += gap;
      draw(clock);
      frame = requestAnimationFrame(tick);
    };

    const run = () => {
      cancelAnimationFrame(frame);
      if (still.matches || !seen) {
        draw(clock);
        return;
      }
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const size = () => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build(rect.width, rect.height);
      draw(clock);
    };

    const bounds = new ResizeObserver(size);
    bounds.observe(wrap);

    /* Off the screen, it stops. The landing card holds three screens and only
       one of them is being looked at. */
    const eye = new IntersectionObserver(
      (entries) => {
        seen = entries[0]?.isIntersecting ?? true;
        run();
      },
      { threshold: 0 },
    );
    eye.observe(wrap);

    still.addEventListener("change", run);
    size();
    run();

    return () => {
      cancelAnimationFrame(frame);
      bounds.disconnect();
      eye.disconnect();
      still.removeEventListener("change", run);
    };
  }, [speed]);

  return (
    <div ref={box} className={cn("relative", className)} aria-hidden>
      <canvas ref={sheet} className="block size-full" />
    </div>
  );
}
