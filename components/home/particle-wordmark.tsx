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
--------------------------------------------------------------------------- */

/** How far apart the samples are taken, in pixels of the offscreen drawing. */
const STEP = 4;

/** Distance from the eye to the plane, in the same units as the cloud. */
const FOV = 900;

/** How deep the ribbon of points runs, front to back. */
const DEPTH = 130;

/** Alpha is quantised into this many bands so the whole cloud draws in a few passes. */
const BANDS = 6;

interface Cloud {
  /** Where each point belongs, once it has settled. */
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
  count: number;
}

const easeOut = (t: number) => 1 - (1 - t) ** 3;

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

  const tx: number[] = [];
  const ty: number[] = [];
  const tz: number[] = [];

  const halfW = probe.width / 2;
  const halfH = probe.height / 2;

  for (let y = 0; y < probe.height; y += STEP) {
    for (let x = 0; x < probe.width; x += STEP) {
      /* Alpha, which is the fourth byte of the pixel. */
      if (pixels[(y * probe.width + x) * 4 + 3] < 128) continue;

      tx.push(x - halfW);
      ty.push(y - halfH);

      /* Depth is a slow wave across the word rather than noise. Random depth
         reads as a fog; a wave reads as a ribbon, and a ribbon is the thing that
         makes the rotation legible. */
      const across = (x - halfW) / halfW;
      tz.push(Math.sin(across * 2.4) * (DEPTH / 2));
    }
  }

  const count = tx.length;
  if (!count) return null;

  const cloud: Cloud = {
    tx: Float32Array.from(tx),
    ty: Float32Array.from(ty),
    tz: Float32Array.from(tz),
    sx: new Float32Array(count),
    sy: new Float32Array(count),
    sz: new Float32Array(count),
    tone: new Uint8Array(count),
    wait: new Float32Array(count),
    count,
  };

  for (let at = 0; at < count; at += 1) {
    /* Points arrive from a shell around the word, not from a point, so the
       entrance reads as a gathering rather than an explosion. */
    const angle = (at * 2.399963) % (Math.PI * 2);
    const spread = 320 + ((at * 37) % 260);

    cloud.sx[at] = Math.cos(angle) * spread * 1.9;
    cloud.sy[at] = Math.sin(angle) * spread * 0.75;
    cloud.sz[at] = ((at * 53) % 700) - 350;

    /* Deterministic, so the colour of a given point never changes between
       renders. Roughly one in six takes the accent. */
    cloud.tone[at] = (at * 7) % 41 < 7 ? 1 : 0;

    /* Left to right, so the word writes itself. */
    cloud.wait[at] = ((cloud.tx[at] + halfW) / probe.width) * 0.38;
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

    const paper = canvas.getContext("2d");
    if (!paper) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cloud: Cloud | null = null;
    let width = 0;
    let height = 0;
    let raf = 0;
    let began = 0;
    let alive = true;

    /* Where the pointer is, and where the cloud has got to on its way there. */
    let wantYaw = 0;
    let wantPitch = 0;
    let yaw = 0;
    let pitch = 0;
    let pointerX = Number.NaN;
    let pointerY = Number.NaN;

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
      if (!alive) return;

      const family =
        getComputedStyle(box!).fontFamily || "system-ui, sans-serif";

      cloud = sample(word, family, width || box!.clientWidth);
      if (cloud) reserve(cloud.count);
      began = performance.now();
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = box!.clientWidth;
      height = box!.clientHeight;

      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      paper!.setTransform(ratio, 0, 0, ratio, 0, 0);

      void build();
    }

    function draw(now: number) {
      raf = requestAnimationFrame(draw);
      if (!cloud) return;

      const settled = still
        ? 1
        : Math.min((now - began) / 1500, 1);

      /* Idle drift plus whatever the pointer asked for, eased rather than
         snapped: the cloud should follow a cursor, not chase it. */
      if (!still) {
        const drift = Math.sin(now / 4200) * 0.26;
        yaw += (wantYaw + drift - yaw) * 0.045;
        pitch += (wantPitch - pitch) * 0.045;
      }

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);

      const midX = width / 2;
      const midY = height / 2;

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
        if (!still && !Number.isNaN(pointerX)) {
          const dx = sx - pointerX;
          const dy = sy - pointerY;
          const away = dx * dx + dy * dy;
          if (away < 13000 && away > 0.01) {
            const push = (13000 - away) / 13000;
            const len = Math.sqrt(away);
            sx += (dx / len) * push * 34;
            sy += (dy / len) * push * 34;
          }
        }

        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) {
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
        bandSize[slot][n] = (0.9 + near * 1.5) * settled;
        bandCount[slot] = n + 1;
      }

      paper!.clearRect(0, 0, width, height);

      /* One fill colour per band, so a few thousand points cost a handful of
         state changes instead of one each. */
      for (let slot = 0; slot < BANDS * 2; slot += 1) {
        const n = bandCount[slot];
        if (!n) continue;

        const band = slot % BANDS;
        const alpha = 0.16 + (band / (BANDS - 1)) * 0.78;

        paper!.fillStyle =
          slot < BANDS
            ? `rgba(17, 24, 39, ${alpha})`
            : `rgba(37, 99, 235, ${alpha})`;

        const xy = bandXY[slot];
        const size = bandSize[slot];

        for (let at = 0; at < n; at += 1) {
          const s = size[at];
          paper!.fillRect(xy[at * 2], xy[at * 2 + 1], s, s);
        }
      }
    }

    function onPointer(event: PointerEvent) {
      const bounds = box!.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
      wantYaw = (pointerX / bounds.width - 0.5) * 0.85;
      wantPitch = (pointerY / bounds.height - 0.5) * -0.34;
    }

    function onLeave() {
      pointerX = Number.NaN;
      pointerY = Number.NaN;
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
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
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
