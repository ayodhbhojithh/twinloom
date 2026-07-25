"use client";

import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

import { useThoughtsSession } from "./thoughts-context";

/**
 * Two launchers for one panel, as TCT_Scope_Spec.md §5.1 asks:
 *
 * - a vertical tab on the right edge from the panel breakpoint up
 * - a bottom launcher below it, where a right edge tab would fight the thumb
 *
 * Both are the brand blue, the same fill and lift as the primary call to action,
 * because this is the same kind of invitation.
 */
function Badge({ count }: { count: number }) {
  if (count < 1) return null;

  return (
    <span className="min-w-[18px] rounded-pill bg-white px-1.5 py-px text-center text-[10px] font-extrabold text-brand tabular-nums">
      {count}
    </span>
  );
}

export function ThoughtsLauncher() {
  const { open, setOpen, count } = useThoughtsSession();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="thoughts-panel"
        className={cn(
          "group fixed top-32 right-0 z-30 hidden flex-col items-center gap-3 rounded-l-card bg-brand py-4 pr-2 pl-3 text-white shadow-cta transition-all duration-[240ms] hover:pr-3 hover:shadow-cta-hover panel:flex",
          open && "pointer-events-none translate-x-full opacity-0",
        )}
      >
        <Sparkles
          aria-hidden
          className="size-4 shrink-0 transition-transform group-hover:scale-110"
        />
        <span className="text-[12.5px] font-bold tracking-[0.01em] [writing-mode:vertical-rl]">
          Thoughts &amp; inspiration
        </span>
        <Badge count={count} />
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="thoughts-panel"
        className={cn(
          "fixed inset-x-4 bottom-4 z-30 flex items-center justify-center gap-2 rounded-btn bg-brand px-4 py-3 text-white shadow-cta transition-all duration-[240ms] panel:hidden",
          open && "pointer-events-none translate-y-6 opacity-0",
        )}
      >
        <Sparkles aria-hidden className="size-4 shrink-0" />
        <span className="text-[13.5px] font-bold">Thoughts &amp; inspiration</span>
        <Badge count={count} />
      </button>
    </>
  );
}
