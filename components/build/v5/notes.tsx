"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import {
  addRef,
  dropRef,
  setLike,
  type Answers,
  type Where,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { AddRow, Kicker } from "./kit";

/* ---------------------------------------------------------------------------
   The desk, as a panel that floats.

   A journey made of steps can only take what the step in front of you happens
   to ask for, and the thing you think of on the way to step nine has nowhere
   else to go. So the desk is reachable from every step, and it is reachable
   without leaving the one you are on: a tab against the edge of the window,
   and a panel that comes out over the page when it is pressed.

   It files what you write under wherever you were standing when you wrote it,
   so a note turns up in the document beside that answer rather than in a pile
   at the end. Nothing here is required and nothing is checked against
   anything: an empty desk is a finished answer.
--------------------------------------------------------------------------- */

/** What something on the desk is filed under. */
function whereName(where: Where | null) {
  if (!where) return "General";
  const parts = [where.step, where.card, where.q].filter(Boolean);
  return parts.length ? parts.join(" / ") : "General";
}

export function NotesDock({
  answers,
  where,
  onGoStep,
}: {
  answers: Answers;
  /** Where the reader is standing, so a note files under the right answer. */
  where: Where | null;
  onGoStep: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [general, setGeneral] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const came = useRef<HTMLElement | null>(null);

  const filed = general ? null : where;
  const count = answers.refs.length;

  useEffect(() => {
    if (!open) return;

    came.current = document.activeElement as HTMLElement | null;
    panel.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      came.current?.focus?.();
    };
  }, [open]);

  return (
    <>
      {/* The tab, turned on its side, against the right edge of the tool.

          It belongs to this tool, not to the window: fixed to the screen it
          followed the reader onto pages that have no notes to keep and no step
          to file them under. So it hangs off the edge of the run-through and
          leaves with it, and it sticks to the middle of the screen for as long
          as the run-through is on it - which is the whole of the time anybody
          has something to write down. */}
      <div
        aria-hidden={open}
        /* Out to the edge of the window, not the edge of the column.

           Measured back through the page frame's own gutter, which is the
           padding standing between this column and the window.

           It was `50% - 50vw`, the centred-container trick, and that is only
           the same distance when the container is actually centred. This page
           has the rail down its side, so it is not: the trick overshot by half
           the rail's width and pushed the tab off the right of the window -
           thirty pixels on a tablet, a hundred and fourteen on a laptop, and a
           sideways scrollbar on a page that has nothing to its right. */
        className="pointer-events-none absolute inset-y-0 -right-(--page-gutter) z-30 w-0"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className={cn(
            "sticky top-[46vh] flex -translate-x-full cursor-pointer flex-col items-center gap-2.5 rounded-l-[12px] bg-ink px-2.5 py-4 text-white transition-colors hover:bg-body",
            open ? "pointer-events-none opacity-0" : "pointer-events-auto",
          )}
        >
          <span
            className="font-mono text-[9.5px] font-bold tracking-[0.16em] uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            Your notes
          </span>
          <span
            className={cn(
              "flex min-w-[19px] items-center justify-center rounded-pill px-1 py-0.5 font-mono text-[9.5px] font-bold tabular-nums",
              count ? "bg-mark text-white" : "bg-white/15 text-white/60",
            )}
          >
            {count}
          </span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/25"
          />

          <div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Your notes"
            tabIndex={-1}
            className="quiet-scroll relative flex h-full w-full max-w-[440px] flex-col overflow-y-auto bg-field p-6 outline-none sm:rounded-l-[26px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Kicker className="block">Your notes</Kicker>
                <h2 className="mt-2 text-[22px] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
                  {count
                    ? `${count} on the desk`
                    : "Anything you like, any time"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notes"
                className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-pill bg-well text-quiet transition-colors hover:bg-hair hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Where the next one lands, said before it is written rather than
                discovered afterwards. */}
            <p className="mt-4 rounded-[12px] bg-well px-3.5 py-2.5 text-[12px] leading-[1.5] text-quiet">
              Filed under{" "}
              <b className="font-semibold text-ink">{whereName(filed)}</b> - it
              turns up in the document beside that answer, not in a pile at the
              end.
            </p>

            <div className="mt-3">
              <AddRow
                placeholder="Anything at all, in your own words"
                onAdd={(value) =>
                  addRef({ kind: "Note", text: value, where: filed })
                }
              />
            </div>

            <label className="mt-2.5 flex cursor-pointer items-center gap-2 text-[12px] text-quiet">
              <input
                type="checkbox"
                checked={general}
                onChange={(event) => setGeneral(event.target.checked)}
                className="size-3.5 accent-ink"
              />
              Keep this one on its own, under General
            </label>

            {answers.refs.length ? (
              <ul className="mt-5 flex flex-col gap-2">
                {answers.refs.map((ref) => (
                  <li key={ref.n} className="rounded-[14px] bg-well p-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <Kicker>{ref.kind}</Kicker>
                      <button
                        type="button"
                        onClick={() => dropRef(ref.n)}
                        className="cursor-pointer font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase transition-colors hover:text-ink"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="mt-1 text-[13px] leading-[1.45] text-ink">
                      {ref.text}
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        if (!ref.where?.stepKey) return;
                        onGoStep(ref.where.stepKey);
                        setOpen(false);
                      }}
                      className="mt-1.5 cursor-pointer text-left font-mono text-[8.5px] font-bold tracking-[0.1em] text-quiet uppercase transition-colors hover:text-ink"
                    >
                      {whereName(ref.where)}
                    </button>

                    <input
                      value={answers.like[ref.n] ?? ""}
                      placeholder="What you like about it"
                      onChange={(event) => setLike(ref.n, event.target.value)}
                      className="mt-2 h-8 w-full rounded-field border border-border bg-field px-3 text-[12px] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-[14px] bg-well p-4 text-[12.5px] leading-[1.55] text-quiet">
                Nothing on the desk yet, and that is a finished answer - nothing
                here is required or checked against anything.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
