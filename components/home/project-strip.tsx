"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { ProjectPanel } from "./project-panel";
import { PROJECTS, type Project } from "./projects";

/**
 * How far below the top each card hangs, in order.
 *
 * Set by hand rather than generated. A row of cards all on one line is a
 * contact sheet; the same row with each card hung at its own height is a wall,
 * and which card sits where is a composition rather than a random number.
 */
const HANG = [46, 0, 30, 62, 14, 52];

/**
 * The work, as a wall that drifts past.
 *
 * A single track holding the run twice and shifting by exactly half its width,
 * so the loop has no seam and no gap. It runs the full width of the page and off
 * both edges, which is what makes it read as a wall carrying on rather than a
 * row that has been cut.
 *
 * It stops under the pointer. That is not only manners: the opening animation
 * measures where a card is at the moment it is clicked, and measuring something
 * still in motion would start the morph from the wrong place.
 */
export function ProjectStrip({ className }: { className?: string }) {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <div className={cn("relative", className)}>
      <div className="group overflow-hidden py-2">
        <div className="drift drift-slow flex w-max gap-5 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 gap-5" aria-hidden={copy === 1}>
              {PROJECTS.map((project, index) => (
                <button
                  key={`${copy}-${project.id}`}
                  type="button"
                  tabIndex={copy === 1 ? -1 : 0}
                  aria-label={`Open ${project.name}`}
                  onClick={() => setOpen(project)}
                  style={{ marginTop: HANG[index % HANG.length] }}
                  className="group/card w-[clamp(160px,17vw,240px)] shrink-0 cursor-pointer rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
                >
                  {/* Only the first run carries the shared identity. Two elements
                      claiming one `layoutId` is undefined behaviour, and the
                      second run exists solely to make the loop seamless. */}
                  <motion.div
                    layoutId={copy === 0 ? `shot-${project.id}` : undefined}
                    className="aspect-[4/5] w-full overflow-hidden rounded-[16px] border border-border transition-transform duration-300 group-hover/card:-translate-y-1.5"
                    style={{ backgroundColor: project.tone }}
                  />

                  <span className="mt-3 block text-left">
                    <span className="block truncate text-[13.5px] font-semibold text-ink">
                      {project.name}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
                      {project.kind} / {project.year}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ProjectPanel project={open} onClose={() => setOpen(null)} />
    </div>
  );
}
