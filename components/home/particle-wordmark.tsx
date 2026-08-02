"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   The name, as a cloud of points, turning.

   Canvas and a projection written out by hand rather than a 3D library. What
   this needs is a few thousand dots, one rotation and a perspective divide, and
   three.js would be about six hundred kilobytes to do arithmetic that fits in
   this file. It also means the points can be the palette's own ink and blue
   instead of whatever a material system decides.

   The shape is sampled from the word itself, drawn once to an offscreen canvas
   in the site's own typeface and read back pixel by pixel. So the cloud is
   always the real wordmark: change `SITE.name` and the particles change with it,
   with no model to re-export.

   Everything about how it moves is written to be smooth rather than merely
   correct. Points are soft sprites, not rectangles; easing is measured against
   the clock, not the frame; and depth is graded finely enough that nothing steps
   as it turns. Those three are the whole difference between this reading as a
   cloud and reading as a spreadsheet.
--------------------------------------------------------------------------- */

/** How far apart the samples are taken, in pixels of the offscreen drawing. */
const STEP = 5;

/** Beyond this the cloud is thinned rather than drawn. Smoothness over census. */
const MAX_POINTS = 6500;

/** Distance from the eye to the plane, in the same units as the cloud. */
const FOV = 900;

/** How deep the ribbon of points runs, front to back. */
const DEPTH = 130;

/**
 * How finely depth is graded.
 *
 * Each band is one fill state per frame, so this trades draw calls for
 * smoothness. At six the points visibly stepped as they turned through the
 * boundaries; at sixteen the gradient is continuous and it is still only
 * thirty-two state changes a frame.
 */
const BANDS = 16;

/** The soft dot every point is drawn with, in device pixels. */
const SPRITE = 26;

/** A sine lookup, so the idle shimmer costs a table read rather than a call. */
const WAVE_STEPS = 512;
const WAVE = Float32Array.from({ length: WAVE_STEPS }, (_unused, at) =>
  Math.sin((at / WAVE_STEPS) * Math.PI * 2),
);

interface Cloud {
  tx: Float32Array;
  ty: Float32Array;
  tz: Float32Array;
  /** Where each point comes in from. */
  sx: Float32Array;
  sy: Float32Array;
  sz: Float32Array;
  /** 0 for ink, 1 for the accent. */
  tone: Uint8Array;
  /** A share of the entrance each point waits before it starts. */
  wait: Float32Array;
  /** Where each point sits in the idle shimmer, so no two breathe together. */
  phase: Uint16Array;
  count: number;
}

/** Quintic, which leaves almost no landing at the end of the entrance. */
const easeOut = (t: number) => 1 - (1 - t) ** 5;

/**
 * A soft round dot, drawn once and reused.
 *
 * Rectangles were the wrong primitive. A one pixel square landing on fractional
 * coordinates redraws its own anti-aliasing every frame, and a few thousand of
 * them doing that at once is the fizz that reads as jank however steady the
 * frame rate is. A pre-rendered sprite is sampled smoothly instead, and costs
 * less than filling a rect.
 */
function makeDot(colour: string): HTMLCanvasElement {
  const dot = document.createElement("canvas");
  dot.width = SPRITE;
  dot.height = SPRITE;

  const ink = dot.getContext("2d");
  if (!ink) return dot;

  const mid = SPRITE / 2;
  const glow = ink.createRadialGradient(mid, mid, 0, mid, mid, mid);
  glow.addColorStop(0, colour);
  glow.addColorStop(0.55, colour);
  glow.addColorStop(1, "rgba(0,0,0,0)");

  ink.fillStyle = glow;
  ink.beginPath();
  ink.arc(mid, mid, mid, 0, Math.PI * 2);
  ink.fill();

  return dot;
}

/**
 * Read the word into points.
 *
 * The text is drawn to an offscreen canvas and every few pixels are checked for
 * ink. Sampling the glyphs rather than describing them is what keeps this honest
 * to the typeface: the cloud has Archivo's own curves in it, including the ones
 * nobody could reproduce by hand.
 */
function sample(word: string, font: string, width: number): Cloud | null {
  const size = Math.min(width / (word.length * 0.56), 190);
  const pad = Math.round(size * 0.4);

  const probe = document.createElement("canvas");
  const ink = probe.getContext("2d", { willReadFrequently: true });
  if (!ink) return null;

  ink.font = `900 ${size}px ${font}`;
  const measured = ink.measureText(word);

  probe.width = Math.ceil(measured.width) + pad * 2;
  probe.height = Math.ceil(size * 1.5) + pad * 2;

  /* Setting the size clears the context, so the font has to be set again. */
  ink.font = `900 ${size}px ${font}`;
  ink.textBaseline = "middle";
  ink.fillStyle = "#000";
  ink.fillText(word, pad, probe.height / 2);

  const pixels = ink.getImageData(0, 0, probe.width, probe.height).data;

  const halfW = probe.width / 2;
  const halfH = probe.height / 2;

  const found: number[] = [];
  for (let y = 0; y < probe.height; y += STEP) {
    for (let x = 0; x < probe.width; x += STEP) {
      /* Alpha, which is the fourth byte of the pixel. */
      if (pixels[(y * probe.width + x) * 4 + 3] < 128) continue;
      found.push(x, y);
    }
  }

  const total = found.length / 2;
  if (!total) return null;

  /* Thin evenly rather than cropping, so a big screen loses density and not a
     limb of the word. */
  const stride = Math.max(1, Math.ceil(total / MAX_POINTS));
  const count = Math.ceil(total / stride);

  const cloud: Cloud = {
    tx: new Float32Array(count),
    ty: new Float32Array(count),
    tz: new Float32Array(count),
    sx: new Float32Array(count),
    sy: new Float32Array(count),
    sz: new Float32Array(count),
    tone: new Uint8Array(count),
    wait: new Float32Array(count),
    phase: new Uint16Array(count),
    count,
  };

  for (let at = 0, from = 0; at < count; at += 1, from += stride) {
    const x = found[from * 2];
    const y = found[from * 2 + 1];

    cloud.tx[at] = x - halfW;
    cloud.ty[at] = y - halfH;

    /* Depth is a slow wave across the word rather than noise. Random depth reads
       as a fog; a wave reads as a ribbon, and a ribbon is the thing that makes
       the rotation legible. */
    const across = (x - halfW) / halfW;
    cloud.tz[at] = Math.sin(across * 2.4) * (DEPTH / 2);

    /* Points arrive from a shell around the word, not from a point, so the
       entrance reads as a gathering rather than an explosion. */
    const angle = (at * 2.399963) % (Math.PI * 2);
    const spread = 320 + ((at * 37) % 260);
    cloud.sx[at] = Math.cos(angle) * spread * 1.9;
    cloud.sy[at] = Math.sin(angle) * spread * 0.75;
    cloud.sz[at] = ((at * 53) % 700) - 350;

    /* Deterministic, so the colour of a point never changes between renders. */
    cloud.tone[at] = (at * 7) % 41 < 7 ? 1 : 0;

    /* Left to right, so the word writes itself. */
    cloud.wait[at] = (x / probe.width) * 0.38;

    cloud.phase[at] = (at * 137) % WAVE_STEPS;
  }

  return cloud;
}

/**
 * The wordmark, drawn as points and turning slowly.
 *
 * It follows the pointer within a few degrees and drifts on its own otherwise,
 * so it is alive without being a toy. Under `prefers-reduced-motion` it is drawn
 * once, square on, and never touched again: a still picture of the same thing
 * rather than nothing at all.
 */
export function ParticleWordmark({
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

    const paper = canvas.getContext("2d", { alpha: true });
    if (!paper) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dots = [makeDot("rgb(17,24,39)"), makeDot("rgb(37,99,235)")];

    let cloud: Cloud | null = null;
    let width = 0;
    let height = 0;
    let sampledAt = 0;
    let raf = 0;
    let began = 0;
    let last = 0;
    let alive = true;
    let resampling: number | undefined;

    /* Where the pointer is, and where the cloud has got to on its way there. */
    let wantYaw = 0;
    let wantPitch = 0;
    let yaw = 0;
    let pitch = 0;
    let rawX = Number.NaN;
    let rawY = Number.NaN;
    let pushX = Number.NaN;
    let pushY = Number.NaN;

    /* Preallocated, so a frame allocates nothing and the collector stays out of
       the animation. Two coordinates and a size per point, per band. */
    const bandXY: Float32Array[] = [];
    const bandSize: Float32Array[] = [];
    const bandCount = new Int32Array(BANDS * 2);

    function reserve(count: number) {
      bandXY.length = 0;
      bandSize.length = 0;
      for (let band = 0; band < BANDS * 2; band += 1) {
        bandXY.push(new Float32Array(count * 2));
        bandSize.push(new Float32Array(count));
      }
    }

    async function build() {
      /* Without this the word is sampled in the fallback face and every curve is
         wrong until something else forces a repaint. */
      if (document.fonts?.ready) await document.fonts.ready;
      if (!alive || !box) return;

      const family = getComputedStyle(box).fontFamily || "system-ui, sans-serif";

      cloud = sample(word, family, width || box.clientWidth);
      if (cloud) reserve(cloud.count);
      sampledAt = width;
      began = performance.now();
    }

    function resize() {
      if (!box || !canvas || !paper) return;

      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box.clientWidth;
      height = box.clientHeight;

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      paper.setTransform(ratio, 0, 0, ratio, 0, 0);

      /* Re-sampling reads back a whole bitmap, so it waits for the drag to stop
         and only runs if the width moved enough to matter. Doing it on every
         resize event is what turns a window drag into a slideshow. */
      if (!cloud) {
        void build();
        return;
      }

      if (Math.abs(width - sampledAt) < 40) return;
      window.clearTimeout(resampling);
      resampling = window.setTimeout(() => void build(), 180);
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!cloud || !paper) return;

      /* Clamped, so returning to a backgrounded tab resumes rather than jumps. */
      const dt = Math.min((now - last) / 1000, 1 / 20) || 0;
      last = now;

      const settled = still ? 1 : Math.min((now - began) / 1600, 1);

      if (!still) {
        /* Exponential smoothing against the clock rather than a fixed share of
           each frame. The old form moved twice as fast on a 120Hz screen as on a
           60Hz one, which is the difference between considered and twitchy. */
        const ease = 1 - Math.exp(-5 * dt);
        const drift = WAVE[((now * 0.045) | 0) % WAVE_STEPS] * 0.22;

        yaw += (wantYaw + drift - yaw) * ease;
        pitch += (wantPitch - pitch) * ease;

        /* The shove follows an eased pointer, so a fast cursor pulls the cloud
           along instead of snapping it. */
        if (Number.isNaN(rawX)) {
          pushX = Number.NaN;
          pushY = Number.NaN;
        } else if (Number.isNaN(pushX)) {
          pushX = rawX;
          pushY = rawY;
        } else {
          const follow = 1 - Math.exp(-14 * dt);
          pushX += (rawX - pushX) * follow;
          pushY += (rawY - pushY) * follow;
        }
      }

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);

      const midX = width / 2;
      const midY = height / 2;

      /* One step through the shimmer table per frame, shared by every point. */
      const swell = still ? 0 : (now * 0.06) | 0;

      bandCount.fill(0);

      for (let at = 0; at < cloud.count; at += 1) {
        let px = cloud.tx[at];
        let py = cloud.ty[at];
        let pz = cloud.tz[at];

        if (settled < 1) {
          const local = Math.max(
            0,
            Math.min((settled - cloud.wait[at]) / (1 - cloud.wait[at]), 1),
          );
          const eased = easeOut(local);
          px = cloud.sx[at] + (px - cloud.sx[at]) * eased;
          py = cloud.sy[at] + (py - cloud.sy[at]) * eased;
          pz = cloud.sz[at] + (pz - cloud.sz[at]) * eased;
        } else if (!still) {
          /* A breath, out of phase per point. Without it the settled word is a
             solid, and a solid made of dots looks like a mistake. */
          py += WAVE[(swell + cloud.phase[at]) % WAVE_STEPS] * 1.7;
        }

        /* Yaw about the upright axis, then pitch, then the perspective divide. */
        const ax = px * cosY - pz * sinY;
        const az = px * sinY + pz * cosY;
        const ay = py * cosX - az * sinX;
        const bz = py * sinX + az * cosX;

        const scale = FOV / (FOV + bz);
        let sx = midX + ax * scale;
        let sy = midY + ay * scale;

        /* The pointer pushes points aside in screen space. Doing it here rather
           than in the cloud keeps the shove the same size wherever the word has
           turned to. */
        if (!Number.isNaN(pushX)) {
          const dx = sx - pushX;
          const dy = sy - pushY;
          const away = dx * dx + dy * dy;
          if (away < 14000 && away > 0.01) {
            /* Squared falloff, so the edge of the field is imperceptible rather
               than a ring the points cross. */
            const push = (1 - away / 14000) ** 2;
            const len = Math.sqrt(away);
            sx += (dx / len) * push * 40;
            sy += (dy / len) * push * 40;
          }
        }

        if (sx < -30 || sx > width + 30 || sy < -30 || sy > height + 30) {
          continue;
        }

        /* Nearer points are bigger and firmer. That, and nothing else, is what
           makes a flat canvas read as depth. */
        const near = Math.max(0, Math.min((scale - 0.82) / 0.36, 1));
        const band = Math.min(BANDS - 1, (near * BANDS) | 0);
        const slot = cloud.tone[at] * BANDS + band;

        const n = bandCount[slot];
        bandXY[slot][n * 2] = sx;
        bandXY[slot][n * 2 + 1] = sy;
        bandSize[slot][n] = (1.6 + near * 2.4) * settled;
        bandCount[slot] = n + 1;
      }

      paper.clearRect(0, 0, width, height);

      /* One alpha per band, so a few thousand points cost thirty-two state
         changes a frame instead of one each. */
      for (let slot = 0; slot < BANDS * 2; slot += 1) {
        const n = bandCount[slot];
        if (!n) continue;

        const band = slot % BANDS;
        paper.globalAlpha = 0.14 + (band / (BANDS - 1)) * 0.8;

        const dot = dots[slot < BANDS ? 0 : 1];
        const xy = bandXY[slot];
        const size = bandSize[slot];

        for (let at = 0; at < n; at += 1) {
          const d = size[at];
          paper.drawImage(dot, xy[at * 2] - d, xy[at * 2 + 1] - d, d * 2, d * 2);
        }
      }

      paper.globalAlpha = 1;
    }

    function onPointer(event: PointerEvent) {
      if (!box) return;
      const bounds = box.getBoundingClientRect();
      rawX = event.clientX - bounds.left;
      rawY = event.clientY - bounds.top;
      wantYaw = (rawX / bounds.width - 0.5) * 0.8;
      wantPitch = (rawY / bounds.height - 0.5) * -0.3;
    }

    function onLeave() {
      rawX = Number.NaN;
      rawY = Number.NaN;
      wantYaw = 0;
      wantPitch = 0;
    }

    const watcher = new ResizeObserver(resize);
    watcher.observe(box);

    if (!still) {
      box.addEventListener("pointermove", onPointer);
      box.addEventListener("pointerleave", onLeave);
    }

    resize();
    last = performance.now();
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(resampling);
      watcher.disconnect();
      box.removeEventListener("pointermove", onPointer);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, [word]);

  return (
    <div ref={frame} className={className}>
      <canvas ref={surface} aria-hidden className="block h-full w-full" />
    </div>
  );
}
