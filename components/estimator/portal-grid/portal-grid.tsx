"use client";

import { money, SCOPE_COMPONENTS, SCOPE_SECTIONS } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";
import { PortalCircle } from "./portal-circle";

/**
 * The picker. Every component in the catalogue as a circle that lights up when
 * it is in the build, with the section legend underneath so the structure stays
 * legible even though the grid itself is flat.
 */
export function PortalGrid({ className }: { className?: string }) {
  const { totals, jumpToComponent } = useScope();

  return (
    <div
      className={cn(
        "rounded-panel border border-hairline bg-surface px-2 pt-4 pb-2 sm:px-4 sm:pt-6",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {SCOPE_COMPONENTS.map((component) => (
          <PortalCircle key={component.id} component={component} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline-soft px-2 py-3.5">
        {SCOPE_SECTIONS.map((section) => {
          const subtotal = totals.sectionTotals[section.id] ?? 0;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => jumpToComponent(section.components[0].id)}
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] text-mono uppercase transition-colors hover:text-ink"
            >
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{ background: section.accent }}
              />
              {section.name}
              <span className="tabular-nums text-ink-5">{money(subtotal)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
