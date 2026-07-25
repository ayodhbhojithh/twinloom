"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";

import { clamp } from "@/lib/colour/convert";
import type { StudioController } from "@/lib/hooks/use-colour-studio";

/**
 * The fine tune column: a saturation and value square, a hue strip, and the
 * numbers. Whatever the colour came from, this is where it gets nudged to
 * exactly right before it joins the palette.
 */
export function ColourTuner({
  studio,
  onAdd,
  disabled,
}: {
  studio: StudioController;
  onAdd: (hex: string) => void;
  disabled: boolean;
}) {
  const { hsv, rgb, hex } = studio;

  const squareRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [hexDraft, setHexDraft] = useState<string | null>(null);

  function setFromSquare(event: React.PointerEvent) {
    const rect = squareRef.current?.getBoundingClientRect();
    if (!rect) return;

    studio.setHsv({
      h: hsv.h,
      s: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      v: 1 - clamp((event.clientY - rect.top) / rect.height, 0, 1),
    });
  }

  function setFromHue(event: React.PointerEvent) {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;

    studio.setHsv({
      ...hsv,
      h: clamp((event.clientX - rect.left) / rect.width, 0, 1) * 360,
    });
  }

  const channels: { key: "r" | "g" | "b"; label: string }[] = [
    { key: "r", label: "R" },
    { key: "g", label: "G" },
    { key: "b", label: "B" },
  ];

  return (
    <div>
      <div
        ref={squareRef}
        role="presentation"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromSquare(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) setFromSquare(event);
        }}
        style={{
          background: `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(${hsv.h} 100% 50%))`,
        }}
        className="relative h-40 w-full cursor-crosshair touch-none rounded-card border border-line"
      >
        <span
          aria-hidden
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
          className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(18,35,59,0.45)]"
        />
      </div>

      <div
        ref={hueRef}
        role="presentation"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromHue(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) setFromHue(event);
        }}
        className="relative mt-3 h-4 cursor-pointer touch-none rounded-pill bg-[linear-gradient(to_right,#f00,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00)]"
      >
        <span
          aria-hidden
          style={{ left: `${(hsv.h / 360) * 100}%` }}
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(18,35,59,0.45)]"
        />
      </div>

      <div className="mt-3 flex items-start gap-3">
        <span
          aria-hidden
          style={{ background: hex }}
          className="size-12 shrink-0 rounded-card border border-ink/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]"
        />

        <div className="grid min-w-0 flex-1 grid-cols-3 gap-2">
          {channels.map((channel) => (
            <label key={channel.key} className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold tracking-[0.08em] text-faint uppercase">
                {channel.label}
              </span>
              <input
                inputMode="numeric"
                value={rgb[channel.key]}
                onChange={(event) =>
                  studio.setFromRgb({
                    ...rgb,
                    [channel.key]: clamp(Number(event.target.value) || 0, 0, 255),
                  })
                }
                className="h-8 w-full rounded-btn-sm border border-line bg-card px-2 font-mono text-[12px] outline-none transition-colors focus:border-brand"
              />
            </label>
          ))}

          <label className="col-span-3 block">
            <span className="mb-1 block font-mono text-[10px] font-bold tracking-[0.08em] text-faint uppercase">
              Hex
            </span>
            <input
              value={hexDraft ?? hex}
              spellCheck={false}
              onChange={(event) => {
                setHexDraft(event.target.value);
                studio.setFromHex(event.target.value);
              }}
              onBlur={() => setHexDraft(null)}
              className="h-8 w-full rounded-btn-sm border border-line bg-card px-2 font-mono text-[12px] outline-none transition-colors focus:border-brand"
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAdd(hex)}
        disabled={disabled}
        className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-btn-sm bg-brand text-[13px] font-bold text-white shadow-cta transition-all hover:-translate-y-px hover:shadow-cta-hover disabled:translate-y-0 disabled:opacity-35 disabled:shadow-none"
      >
        <Plus aria-hidden className="size-4" />
        Add to palette
      </button>

      <p className="mt-2 text-[11.5px] leading-[1.5] text-faint">
        Your weighted palette lives in the Colours panel behind this window.
      </p>
    </div>
  );
}
