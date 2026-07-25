"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";

import { clamp, rgbToHex } from "@/lib/colour/convert";
import { extractPalette } from "@/lib/colour/extract";
import type { StudioController } from "@/lib/hooks/use-colour-studio";

const WIDTH = 640;
const HEIGHT = 420;
/** Half width of the loupe's sample, in image pixels. */
const LOUPE_RADIUS = 6;

interface View {
  /** Scale that fits the whole image in the canvas. */
  fit: number;
  scale: number;
  panX: number;
  panY: number;
}

/**
 * The picking surface.
 *
 * Zoom, pan, and a magnifier that reads the image at pixel level so a colour can
 * be lifted from a single pixel rather than from roughly the right area. The
 * canvas keeps smoothing off throughout, because a blurred pixel is a wrong
 * colour.
 */
export function ImageStage({
  studio,
  onAddColours,
}: {
  studio: StudioController;
  onAddColours: (hexes: string[]) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<View>({ fit: 1, scale: 1, panX: 0, panY: 0 });

  /* An offscreen copy at natural size. Every sample reads from this, so reading
     a pixel never depends on how the image happens to be displayed. */
  const sourceRef = useRef<{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [loupe, setLoupe] = useState<{
    x: number;
    y: number;
    hex: string;
    px: number;
    py: number;
  } | null>(null);

  const loupeCanvasRef = useRef<HTMLCanvasElement>(null);
  const image = studio.active?.image ?? null;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || !image) return;

    const view = viewRef.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(
      image,
      view.panX,
      view.panY,
      image.naturalWidth * view.scale,
      image.naturalHeight * view.scale,
    );
  }, [image]);

  /**
   * Centres the image at its fit scale. Touches only the view ref and the
   * canvas, never React state, so the setup effect below stays a pure sync with
   * an external system.
   */
  const fitView = useCallback(() => {
    if (!image) return;

    const fit = Math.min(
      WIDTH / image.naturalWidth,
      HEIGHT / image.naturalHeight,
    );

    viewRef.current = {
      fit,
      scale: fit,
      panX: (WIDTH - image.naturalWidth * fit) / 2,
      panY: (HEIGHT - image.naturalHeight * fit) / 2,
    };

    draw();
  }, [image, draw]);

  /* The Reset button is an event handler, so it can put the slider back too. */
  function reset() {
    fitView();
    setZoom(1);
  }

  /* Build the offscreen copy and fit the view. The parent keys this component on
     the active image, so a different image arrives as a fresh mount with the
     zoom already at 1 and there is nothing to reset here. */
  useEffect(() => {
    if (!image) {
      sourceRef.current = null;
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.drawImage(image, 0, 0);
    sourceRef.current = { canvas, context };

    fitView();
  }, [image, fitView]);

  function applyZoom(next: number) {
    const view = viewRef.current;

    /* Zoom about the middle of the canvas, so the thing being looked at stays
       where it was. */
    const centreX = (WIDTH / 2 - view.panX) / view.scale;
    const centreY = (HEIGHT / 2 - view.panY) / view.scale;

    view.scale = view.fit * next;
    view.panX = WIDTH / 2 - centreX * view.scale;
    view.panY = HEIGHT / 2 - centreY * view.scale;

    setZoom(next);
    draw();
  }

  function canvasPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function sample(event: React.PointerEvent<HTMLCanvasElement>) {
    const source = sourceRef.current;
    if (!source) return null;

    const view = viewRef.current;
    const { x, y } = canvasPoint(event);

    const px = clamp(
      Math.floor((x - view.panX) / view.scale),
      0,
      source.canvas.width - 1,
    );
    const py = clamp(
      Math.floor((y - view.panY) / view.scale),
      0,
      source.canvas.height - 1,
    );

    const [r, g, b] = source.context.getImageData(px, py, 1, 1).data;
    return { r, g, b, px, py };
  }

  function paintLoupe(px: number, py: number) {
    const source = sourceRef.current;
    const canvas = loupeCanvasRef.current;
    const context = canvas?.getContext("2d");
    if (!source || !canvas || !context) return;

    const span = LOUPE_RADIUS * 2 + 1;
    canvas.width = span;
    canvas.height = span;

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, span, span);
    context.drawImage(
      source.canvas,
      px - LOUPE_RADIUS,
      py - LOUPE_RADIUS,
      span,
      span,
      0,
      0,
      span,
      span,
    );

    /* Ring the exact pixel, twice, so the marker survives any background. */
    context.lineWidth = 0.15;
    context.strokeStyle = "#fff";
    context.strokeRect(LOUPE_RADIUS + 0.075, LOUPE_RADIUS + 0.075, 0.85, 0.85);
    context.strokeStyle = "#000";
    context.strokeRect(LOUPE_RADIUS + 0.15, LOUPE_RADIUS + 0.15, 0.7, 0.7);
  }

  const drag = useRef({ down: false, moved: false, x: 0, y: 0, panX: 0, panY: 0 });

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const view = viewRef.current;
    drag.current = {
      down: true,
      moved: false,
      x: event.clientX,
      y: event.clientY,
      panX: view.panX,
      panY: view.panY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (drag.current.down) {
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;

      /* Four pixels of slack, so a click with a shaky hand is still a click. */
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        const rect = canvas.getBoundingClientRect();
        const view = viewRef.current;

        drag.current.moved = true;
        view.panX = drag.current.panX + dx * (canvas.width / rect.width);
        view.panY = drag.current.panY + dy * (canvas.height / rect.height);

        setLoupe(null);
        draw();
        return;
      }
    }

    const hit = sample(event);
    if (!hit) return;

    const rect = canvas.getBoundingClientRect();
    paintLoupe(hit.px, hit.py);

    setLoupe({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      hex: rgbToHex(hit),
      px: hit.px,
      py: hit.py,
    });
  }

  function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    if (drag.current.down && !drag.current.moved) {
      const hit = sample(event);
      if (hit) studio.setFromRgb({ r: hit.r, g: hit.g, b: hit.b });
    }

    drag.current.down = false;
  }

  if (!image) return null;

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setLoupe(null)}
          className="block h-auto w-full cursor-crosshair touch-none rounded-card border border-line bg-panel-bg"
        />

        {/* Absolute inside this wrapper rather than fixed: the studio box is
            transformed while it animates, and a fixed child would anchor to it
            anyway. This keeps the loupe correct either way. */}
        {loupe ? (
          <div
            aria-hidden
            style={{ left: loupe.x, top: loupe.y }}
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[115%]"
          >
            <canvas
              ref={loupeCanvasRef}
              className="block size-30 rounded-full border-[3px] border-white bg-ink shadow-[0_8px_24px_rgba(18,35,59,0.35)] [image-rendering:pixelated]"
            />
            <span className="mx-auto mt-1.5 block w-max rounded-nav bg-ink px-2 py-0.5 font-mono text-[11.5px] text-white">
              {loupe.hex}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label
          htmlFor="studio-zoom"
          className="font-mono text-[11px] font-bold tracking-[0.08em] text-faint uppercase"
        >
          Zoom
        </label>
        <input
          id="studio-zoom"
          type="range"
          min={1}
          max={8}
          step={0.1}
          value={zoom}
          onChange={(event) => applyZoom(Number(event.target.value))}
          className="range-slider min-w-24 flex-1 text-brand"
          style={{
            background: `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${((zoom - 1) / 7) * 100}%, var(--color-line) ${((zoom - 1) / 7) * 100}%, var(--color-line) 100%)`,
          }}
        />

        <button
          type="button"
          onClick={reset}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-btn-sm border border-line bg-card px-3 text-[12px] font-semibold transition-colors hover:bg-soft"
        >
          <RotateCcw aria-hidden className="size-3.5" />
          Reset
        </button>

        <button
          type="button"
          onClick={() => onAddColours(extractPalette(image, 5))}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-btn-sm bg-brand px-3 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
        >
          <Sparkles aria-hidden className="size-3.5" />
          Auto-pick 5
        </button>
      </div>

      <p className="mt-2 text-[11.5px] text-faint">
        Hover to magnify · click to pick · drag to pan when zoomed.
      </p>
    </div>
  );
}
