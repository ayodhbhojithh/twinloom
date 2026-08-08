"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   A field of dots, woven.

   Six waves crossing through one band, each drawn as separate marks rather than
   as a stroke. That is the mark's own idea at the size of a card: a line says "a
   path", and a line made of separate marks says "a thread", which is the word
   this company is named for. Six of them at different phases cross constantly,
   and at a crossing the dots simply interleave - no thread has to be cut for
   another to pass.

   Painted on a 2D canvas rather than in a fragment shader, and that is a
   downgrade in nothing that matters here. A shader's cost is per pixel and it
   needs a WebGL context, a compile step and a library; this is about seven
   hundred filled circles a frame, which is a rounding error, and it needs
   nothing. It is also the only one of the two that can be told to draw a dot -
   the shader drew bands, and bands were the thing that was wrong with it.

   The colours are read off the stylesheet rather than repeated here, so the
   field, the name in the header and the gradient on the buttons are painted from
   one pair of values.
--------------------------------------------------------------------------- */

/** How many threads cross the band. */
const THREADS = 6;

/** Roughly how far apart the dots sit along a thread, in CSS pixels. */
const STEP = 21;

/** Where the mark's colours come from, and what to use before CSS has loaded. */
const FALLBACK = { from: "#2a98fe", to: "#06dbaf" };

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function readRgb(value: string, fallback: string): Rgb {
  const hex = (value.trim() || fallback).replace("#", "");
  const full =
    hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex.slice(0, 6);

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function WaveDots({
  className,
  /** How far the threads swing, as a share of the band's own height. */
  amplitude = 1,
  /** How fast the waves travel. */
  speed = 1,
  /** Whether the field answers the pointer. */
  interactive = true,
}: {
  className?: string;
  amplitude?: number;
  speed?: number;
  interactive?: boolean;
}) {
  const surface = useRef<HTMLCanvasElement>(null);

  /* The live settings, for the loop to read. Written in an effect rather than
     during render, because assigning to a ref while rendering is a side effect
     in render - and read from the loop, so changing one sets a number rather
     than restarting the whole field. */
  const live = useRef({ amplitude, speed, interactive });

  useEffect(() => {
    live.current = { amplitude, speed, interactive };
  });

  useEffect(() => {
    const canvas = surface.current;
    const ink = canvas?.getContext("2d");
    if (!canvas || !ink) return;

    const roots = getComputedStyle(document.documentElement);
    const from = readRgb(
      roots.getPropertyValue("--color-thread-blue"),
      FALLBACK.from,
    );
    const to = readRgb(
      roots.getPropertyValue("--color-thread-teal"),
      FALLBACK.to,
    );

    /* Asked for less motion, and this is nothing but motion. One frame is drawn
       so the card is not blank, and the loop never starts. */
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;

    const size = () => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = box.width;
      height = box.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      /* Drawn in CSS pixels and scaled once, so nothing below has to know what
         kind of screen it is on. */
      ink.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* The pointer, and how far it has been let in. Both held rather than used
       raw, so the field follows rather than snaps. */
    const wanted = { x: -1e4, y: -1e4, pull: 0 };
    const held = { x: -1e4, y: -1e4, pull: 0 };

    const draw = (ms: number) => {
      const now = live.current;
      const t = (ms / 1000) * now.speed;

      ink.clearRect(0, 0, width, height);

      held.x += (wanted.x - held.x) * 0.08;
      held.y += (wanted.y - held.y) * 0.08;
      held.pull += (wanted.pull - held.pull) * 0.06;

      const middle = height / 2;
      /* The band is a share of the box rather than a number of pixels, so the
         field fills a short card and a tall one the same way. */
      const swing = height * 0.17 * now.amplitude;
      const across = Math.max(Math.ceil(width / STEP), 2);

      for (let thread = 0; thread < THREADS; thread += 1) {
        /* Each thread is the same wave at its own phase and its own slightly
           different wavelength. Equal wavelengths would run them in parallel
           forever; unequal ones make them cross, which is the whole picture. */
        const phase = (thread / THREADS) * Math.PI * 2;
        const length = 2.1 + thread * 0.28;
        const drift = t * (0.22 + thread * 0.03);
        const lean = (thread - (THREADS - 1) / 2) * (height * 0.028);

        for (let n = 0; n <= across; n += 1) {
          const along = n / across;
          const x = along * width;

          /* Tallest in the middle of the run and settling at both ends, so the
             band opens out of a point and closes back into one rather than
             running off the edges at full height. */
          const taper = Math.sin(along * Math.PI);

          const y =
            middle +
            lean +
            Math.sin(along * length * Math.PI * 2 + phase + drift) *
              swing *
              (0.3 + 0.7 * taper);

          /* What the pointer does. A dot near it lifts towards it and grows,
             falling off smoothly with distance - so the field bulges under the
             cursor rather than a circle of it changing at once. */
          let cx = x;
          let cy = y;
          let bulge = 0;

          if (now.interactive && held.pull > 0.01) {
            const dx = x - held.x;
            const dy = y - held.y;
            const reach = Math.max(width, height) * 0.22;
            const near = Math.exp(-(dx * dx + dy * dy) / (2 * reach * reach));

            bulge = near * held.pull;
            cx -= dx * 0.06 * bulge;
            cy -= dy * 0.16 * bulge;
          }

          const r = (1.1 + 2.4 * taper) * (1 + bulge * 0.9);
          const alpha = (0.2 + 0.6 * taper) * (1 + bulge * 0.5);

          /* The gradient across the width, worked out per dot rather than as a
             canvas gradient: each dot is one flat colour, which is what keeps
             them reading as beads rather than as a shaded ribbon. */
          const mix = along;
          const red = Math.round(from.r + (to.r - from.r) * mix);
          const green = Math.round(from.g + (to.g - from.g) * mix);
          const blue = Math.round(from.b + (to.b - from.b) * mix);

          ink.beginPath();
          ink.arc(cx, cy, r, 0, Math.PI * 2);
          ink.fillStyle = `rgba(${red}, ${green}, ${blue}, ${Math.min(alpha, 1)})`;
          ink.fill();
        }
      }
    };

    size();
    draw(0);

    let frame = 0;
    let seen = true;

    const loop = (ms: number) => {
      frame = requestAnimationFrame(loop);
      /* Nothing is drawn for a card four screens down or a tab in the
         background. A field that keeps painting where it cannot be seen is a
         phone's battery spent on nothing. */
      if (!seen || document.hidden) return;
      draw(ms);
    };

    if (!still) frame = requestAnimationFrame(loop);

    const watcher = new ResizeObserver(() => {
      size();
      if (still) draw(0);
    });
    watcher.observe(canvas);

    const watchingView = new IntersectionObserver(
      (entries) => {
        seen = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
    watchingView.observe(canvas);

    const onMove = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      wanted.x = event.clientX - box.left;
      wanted.y = event.clientY - box.top;
      wanted.pull = 1;
    };

    const onLeave = () => {
      wanted.pull = 0;
    };

    if (!still) {
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      watcher.disconnect();
      watchingView.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={surface}
      aria-hidden
      className={cn("block size-full", className)}
    />
  );
}
