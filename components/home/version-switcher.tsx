"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { V01Arc } from "./versions/v01-arc";
import { V02Rule } from "./versions/v02-rule";
import { V03Proof } from "./versions/v03-proof";
import { V04Ruled } from "./versions/v04-ruled";
import { V05Aperture } from "./versions/v05-aperture";
import { V06Index } from "./versions/v06-index";
import { V07Diagonal } from "./versions/v07-diagonal";
import { V08Baseline } from "./versions/v08-baseline";
import { V09Rings } from "./versions/v09-rings";
import { V10Frame } from "./versions/v10-frame";

const VERSIONS = [
  {
    n: "01",
    name: "Arc",
    note: "One enormous circle cropped by three edges. The claim sits in its opening.",
    render: V01Arc,
  },
  {
    n: "02",
    name: "Rule",
    note: "A heavy vertical spine with the name set along it.",
    render: V02Rule,
  },
  {
    n: "03",
    name: "Proof",
    note: "Crop marks, a registration mark and the job details. Bracketed, not boxed.",
    render: V03Proof,
  },
  {
    n: "04",
    name: "Ruled",
    note: "Ruled paper. The claim written across the lines.",
    render: V04Ruled,
  },
  {
    n: "05",
    name: "Aperture",
    note: "A window with the sentence deliberately too big for it.",
    render: V05Aperture,
  },
  {
    n: "06",
    name: "Index",
    note: "The claim on the left, a numbered index of the offer on the right.",
    render: V06Index,
  },
  {
    n: "07",
    name: "Diagonal",
    note: "The screen cut corner to corner, one accent hairline along the cut.",
    render: V07Diagonal,
  },
  {
    n: "08",
    name: "Baseline",
    note: "Four ruled lines, each with a bar that grows as the sentence goes on.",
    render: V08Baseline,
  },
  {
    n: "09",
    name: "Rings",
    note: "Concentric outlines spreading from behind the claim.",
    render: V09Rings,
  },
  {
    n: "10",
    name: "Frame",
    note: "Held in a ruled frame with type running along both edges.",
    render: V10Frame,
  },
] as const;

/**
 * Ten home pages, one at a time, each built to a single screenful.
 *
 * All ten carry the framework's own copy: `SITE.tagline` as the headline,
 * `SITE.description` as the standfirst, the same two actions and the same
 * "nothing in here yet" marker. What differs is entirely the design, which is
 * the only way a comparison between them means anything.
 *
 * The tab bar stands between the header and the page, so it takes its own height
 * back out of `--stage` here. That keeps the arithmetic in one place: no version
 * knows the chooser exists, and deleting the chooser restores the full screen
 * without touching any of them.
 *
 * This is scaffolding for a decision. Once one is chosen the other nine come out
 * and the page imports the winner directly.
 */
export function VersionSwitcher() {
  const [at, setAt] = useState(0);
  const current = VERSIONS[at];
  const Version = current.render;

  return (
    <div
      style={
        { "--stage": "calc(100svh - var(--nav-height) - 96px)" } as React.CSSProperties
      }
    >
      <div className="sticky top-[var(--nav-height)] z-30 -mx-[var(--page-gutter)] border-b border-border bg-field px-[var(--page-gutter)] py-3">
        <div className="max-w-wide">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
              Home page, ten versions, one screen each
            </p>
            <p className="font-mono text-[10px] tracking-[0.14em] text-idx uppercase">
              {current.note}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Home page versions"
            className="quiet-scroll mt-2.5 -mb-1 flex gap-1.5 overflow-x-auto pb-1"
          >
            {VERSIONS.map((version, index) => {
              const on = index === at;

              return (
                <button
                  key={version.n}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setAt(index)}
                  className={cn(
                    "flex shrink-0 cursor-pointer items-center gap-2 rounded-field border px-3 py-1.5 text-[13px] font-semibold transition-colors",
                    on
                      ? "border-ink bg-ink text-white"
                      : "border-border bg-field text-quiet hover:border-ink hover:text-ink",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold tabular-nums",
                      on ? "text-white/55" : "text-planned",
                    )}
                  >
                    {version.n}
                  </span>
                  {version.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-wide">
        <Version />
      </div>
    </div>
  );
}
