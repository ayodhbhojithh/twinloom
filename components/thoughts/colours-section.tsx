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
 *
 * The Studio used to be a full width filled button carrying the primary call to
 * action's own glow, which made it the loudest thing in the panel and a rival to
 * the page's real CTA. It is tinted now: still the first thing in the section, no
 * longer shouting.
 *
 * The paragraph explaining that order sets the role is gone. Every row already
 * says PRIMARY or SECONDARY above its hex, so the rule was stated twice and only
 * the paragraph could fall out of date.
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

  const [picked, setPicked] = useState("#2563eb");
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
      active={colours.length > 0}
      meta={<SectionCount value={colours.length} limit={colourLimit} />}
    >
      <button
        type="button"
        onClick={openStudio}
        className="flex h-8 w-full items-center justify-center gap-1.5 rounded-btn-sm bg-soft text-[11.5px] font-bold text-brand transition-colors hover:bg-brand hover:text-white"
      >
        <Palette aria-hidden className="size-3.5" />
        Colour Studio
      </button>

      <div className="mt-1.5 flex items-center gap-1.5">
        {/* flex, not inline: an inline colour input sits on the text baseline and
            picks up descender space, which nudges the swatch out of line with
            the field and button beside it. */}
        <label className="flex shrink-0" title="Pick a colour">
          <span className="sr-only">Pick a colour</span>
          <input
            type="color"
            value={picked}
            onChange={(event) => setPicked(event.target.value)}
            className="swatch-input size-8 rounded-full"
          />
        </label>

        <input
          value={typed}
          onChange={(event) => setTyped(event.target.value.replace(/^#/, ""))}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit(typed);
            }
          }}
          placeholder="2563eb"
          aria-label="Colour code"
          spellCheck={false}
          className="h-8 min-w-0 flex-1 rounded-btn-sm bg-panel-bg px-2.5 font-mono text-[11.5px] outline-none ring-inset transition-shadow placeholder:text-faint focus:ring-1 focus:ring-brand/45"
        />

        <button
          type="button"
          onClick={() => submit(typed || picked)}
          disabled={full}
          aria-label="Add colour"
          className="flex size-8 shrink-0 items-center justify-center rounded-btn-sm bg-brand text-white transition-all hover:opacity-90 disabled:opacity-35"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {colours.length ? (
        <>
          <div className="mt-2.5">
            <PaletteBar colours={colours} />
          </div>

          <ul className="mt-0.5 flex flex-col">
            {colours.map((colour, index) => (
              <li
                key={colour.id}
                className="group border-b border-line/60 py-2.5 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-5 shrink-0 rounded-full"
                    style={{ background: colour.hex }}
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[9px] font-bold tracking-[0.1em] text-faint uppercase">
                      {roleFor(index)}
                    </span>
                    <span className="block font-mono text-[11.5px] leading-tight">
                      {colour.hex}
                    </span>
                  </span>

                  <span className="shrink-0 font-mono text-[11.5px] font-bold tabular-nums">
                    {colour.weight}%
                  </span>

                  {/* Hidden until the row is hovered or focused. Three icons per
                      colour, always on, is more chrome than palette. */}
                  <span className="flex shrink-0 items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => nudgeColour(colour.id, -1)}
                      disabled={index === 0}
                      aria-label={`Move ${colour.hex} up`}
                      className="flex size-5 items-center justify-center rounded-nav text-faint transition-colors hover:bg-soft hover:text-ink disabled:opacity-25"
                    >
                      <ChevronUp className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nudgeColour(colour.id, 1)}
                      disabled={index === colours.length - 1}
                      aria-label={`Move ${colour.hex} down`}
                      className="flex size-5 items-center justify-center rounded-nav text-faint transition-colors hover:bg-soft hover:text-ink disabled:opacity-25"
                    >
                      <ChevronDown className="size-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeColour(colour.id)}
                      aria-label={`Remove ${colour.hex}`}
                      className="flex size-5 items-center justify-center rounded-nav text-faint transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                </div>

                <div className="mt-1.5 flex pl-7">
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
        <p className="mt-2 font-mono text-[10px] leading-[1.5] text-faint">
          none yet · order sets the role, weights rebalance to 100%
        </p>
      )}
    </PanelSection>
  );
}
