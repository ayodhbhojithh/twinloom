"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Palette, Plus, X } from "lucide-react";

import { roleFor } from "@/lib/thoughts/palette";

import { PaletteBar } from "./palette-bar";
import { PanelSection } from "./panel-section";
import { SectionCount } from "./section-count";
import { useThoughtsSession } from "./thoughts-context";
import { WeightSlider } from "./weight-slider";

/**
 * The weighted palette. Order sets the role, and dragging one weight rebalances
 * the rest so the palette always sums to 100.
 *
 * Three ways in: the Colour Studio for picking from images, a screen or anywhere
 * on screen; the system picker; or a typed code.
 */
export function ColoursSection() {
  const {
    colours,
    addColour,
    setColourWeight,
    nudgeColour,
    removeColour,
    colourLimit,
    openStudio,
  } = useThoughtsSession();

  const [picked, setPicked] = useState("#2f6fb0");
  const [typed, setTyped] = useState("");
  const full = colours.length >= colourLimit;

  function submit(value: string) {
    if (full) return;
    addColour(value);
    setTyped("");
  }

  return (
    <PanelSection
      label="Colours"
      icon={<Palette className="size-3.5" />}
      meta={<SectionCount value={colours.length} limit={colourLimit} />}
    >
      <button
        type="button"
        onClick={openStudio}
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-btn-sm bg-brand text-[12.5px] font-bold text-white shadow-cta transition-all hover:-translate-y-px hover:shadow-cta-hover"
      >
        <Palette aria-hidden className="size-3.5" />
        Colour Studio
      </button>

      <div className="mt-2 flex items-center gap-2">
        <label className="shrink-0" title="Pick a colour">
          <span className="sr-only">Pick a colour</span>
          <input
            type="color"
            value={picked}
            onChange={(event) => setPicked(event.target.value)}
            className="swatch-input size-9 rounded-btn-sm"
          />
        </label>

        <div className="relative min-w-0 flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-[12px] text-faint"
          >
            #
          </span>
          <input
            value={typed}
            onChange={(event) => setTyped(event.target.value.replace(/^#/, ""))}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit(typed);
              }
            }}
            placeholder="2f6fb0"
            aria-label="Colour code"
            spellCheck={false}
            className="h-9 w-full rounded-btn-sm border border-line bg-card pr-3 pl-6 font-mono text-[12px] outline-none transition-colors placeholder:text-faint focus:border-brand"
          />
        </div>

        <button
          type="button"
          onClick={() => submit(typed || picked)}
          disabled={full}
          aria-label="Add colour"
          className="flex size-9 shrink-0 items-center justify-center rounded-btn-sm bg-brand text-white transition-all hover:opacity-90 disabled:opacity-35"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {colours.length ? (
        <>
          <div className="mt-3">
            <PaletteBar colours={colours} />
          </div>

          <ul className="mt-1 flex flex-col">
            {colours.map((colour, index) => (
              <li
                key={colour.id}
                className="group border-b border-line/70 py-3 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-6 shrink-0 rounded-nav border border-ink/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.35)]"
                    style={{ background: colour.hex }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10px] font-bold tracking-[0.08em] text-faint uppercase">
                      {roleFor(index)}
                    </span>
                    <span className="block font-mono text-[12px] leading-tight">
                      {colour.hex}
                    </span>
                  </span>

                  <span className="w-10 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums">
                    {colour.weight}%
                  </span>

                  <span className="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => nudgeColour(colour.id, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${colour.hex} up`}
                      className="flex size-6 items-center justify-center rounded-nav text-faint transition-colors hover:bg-soft hover:text-ink disabled:opacity-25"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeColour(colour.id, 1)}
                      disabled={index === colours.length - 1}
                      aria-label={`Move ${colour.hex} down`}
                      className="flex size-6 items-center justify-center rounded-nav text-faint transition-colors hover:bg-soft hover:text-ink disabled:opacity-25"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeColour(colour.id)}
                      aria-label={`Remove ${colour.hex}`}
                      className="flex size-6 items-center justify-center rounded-nav text-faint transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                </div>

                <div className="mt-2 flex pl-8">
                  <WeightSlider
                    id={`weight-${colour.id}`}
                    hex={colour.hex}
                    weight={colour.weight}
                    label={`Weight of ${colour.hex}`}
                    onChange={(weight) => setColourWeight(colour.id, weight)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-3 rounded-btn-sm border border-dashed border-line px-3 py-3 text-[11.5px] leading-[1.5] text-faint">
          No colours yet. Open the Colour Studio, pick one, or type a code.
        </p>
      )}

      <p className="mt-3 text-[11px] leading-[1.5] text-faint">
        Order sets the role: Primary, Secondary, Tertiary. Drag a weight and the
        rest rebalance to 100%.
      </p>
    </PanelSection>
  );
}
