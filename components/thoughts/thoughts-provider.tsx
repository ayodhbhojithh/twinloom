"use client";

import { cn } from "@/lib/utils";

import { ColourStudio } from "./studio";
import { ThoughtsContext, useThoughts } from "./thoughts-context";
import { ThoughtsLauncher } from "./thoughts-launcher";
import { ThoughtsPanel } from "./thoughts-panel";

/**
 * Wraps the whole site, so the panel and its session are present on every page.
 *
 * The page is padded rather than overlaid: opening the panel shifts the content
 * left instead of covering it, which is the behaviour the spec is specific about.
 * Below the panel breakpoint the panel is full width, so there is nothing to
 * shift and the padding is dropped.
 */
export function ThoughtsProvider({ children }: { children: React.ReactNode }) {
  const controller = useThoughts();

  return (
    <ThoughtsContext.Provider value={controller}>
      <div
        className={cn(
          "flex min-h-full flex-col transition-[padding] duration-[260ms]",
          controller.open && "panel:pr-panel",
        )}
      >
        {children}
      </div>

      <ThoughtsLauncher />
      <ThoughtsPanel />

      {/* Outside the panel deliberately: the panel is transformed while it
          slides, and a transformed ancestor would become the containing block
          for the studio's fixed positioning. */}
      <ColourStudio />
    </ThoughtsContext.Provider>
  );
}
