"use client";

import { Check } from "lucide-react";

import { pluralise } from "@/lib/format";

import { useThoughtsSession } from "./thoughts-context";

/**
 * The panel's footer: the capture reflection from TCT_Scope_Spec.md §5.6.
 *
 * One quiet line. It only has to answer "did that land?", so it says what is in
 * the session and that it is saved, and takes no more room than that.
 */
export function PanelFooter() {
  const { files, colours, links, notes } = useThoughtsSession();

  const parts = [
    files.length ? pluralise(files.length, "file") : null,
    colours.length ? pluralise(colours.length, "colour") : null,
    links.length ? pluralise(links.length, "link") : null,
    notes.trim() ? "notes" : null,
  ].filter(Boolean);

  const captured = parts.length > 0;

  return (
    <div className="flex items-center gap-2 px-4 pt-2 pb-4 text-[11px]">
      <span className="shrink-0 font-mono font-extrabold tracking-[0.08em] text-faint uppercase">
        Captured
      </span>

      <span className="min-w-0 flex-1 truncate text-body">
        {captured ? parts.join(" · ") : "nothing yet"}
      </span>

      {captured ? (
        <span className="flex shrink-0 items-center gap-1 font-semibold text-ok">
          <Check aria-hidden className="size-3.5" strokeWidth={3} />
          Saved
        </span>
      ) : null}
    </div>
  );
}
