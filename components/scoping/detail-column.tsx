"use client";

import { MousePointerClick } from "lucide-react";

import { FocusPanel } from "./focus-panel";
import { useScopingSession } from "./scoping-context";

/**
 * The right hand column: whatever is focused, or an invitation to focus something.
 *
 * On a wide screen the detail gets its own column so the question list never moves
 * when something opens. Below lg the same panel is mounted inline under the group
 * instead, because on a phone a second column is just further down the page and
 * the eye has already moved on.
 *
 * The empty state is deliberate. A column that appears and disappears makes the
 * layout jump, and it never explains what would fill it.
 */
export function DetailColumn() {
  const { focus } = useScopingSession();

  return (
    <div className="hidden lg:sticky lg:top-[calc(var(--nav-height)+18px)] lg:block">
      {focus ? (
        <FocusPanel />
      ) : (
        <div className="rounded-card bg-panel-bg px-5 py-6">
          <p className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
            <MousePointerClick aria-hidden className="size-3" />
            Detail
          </p>

          <p className="mt-2.5 text-[14.5px] leading-[1.35] font-extrabold tracking-[-0.01em]">
            Nothing focused yet
          </p>

          <p className="mt-2 text-[13px] leading-[1.6] text-body">
            Pick a choice on the left and it opens here, just that one, so you can
            read what it means and set how far to push it.
          </p>
        </div>
      )}
    </div>
  );
}
