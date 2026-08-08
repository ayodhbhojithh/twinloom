"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { pagesFrom } from "@/lib/build/v5-derive";
import { type Answers, type Where } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Kicker } from "./kit";
import { NotesBody } from "./notes";
import { Panel } from "./panel";

/* ---------------------------------------------------------------------------
   The dock: what is going in, and what is coming out.

   Two panels behind one tab. They were two tabs against opposite edges of the
   window for a while, and a run-through with something clipped to the left of
   it and something else clipped to the right reads as a screen with two
   problems rather than one desk - so they are one shape, in one place, and the
   thing that separates them is a pair of tabs, which is what they always were.

   Your site is first because it is the answer. Your notes are second because
   they are the working. Both are one press from every step, and neither is
   ever the thing you have to leave a question to reach.
--------------------------------------------------------------------------- */

type Face = "site" | "notes";

export function Dock({
  answers,
  where,
  onGoStep,
  withSite = true,
}: {
  answers: Answers;
  /** Where the reader is standing, so a note files under the right answer. */
  where: Where | null;
  onGoStep: (key: string) => void;
  /**
   * Whether the site half is shown at all.
   *
   * Off on the quick submission, which derives no pages: a tab reading zero on
   * every screen it appears is a tab that has nothing to say. The desk stays,
   * because the quick pane writes to the same one and somebody who has
   * attached four files there should be able to see the four.
   */
  withSite?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [face, setFace] = useState<Face>(withSite ? "site" : "notes");
  const panel = useRef<HTMLDivElement>(null);
  const came = useRef<HTMLElement | null>(null);

  const pages = pagesFrom(answers).length;
  const notes = answers.refs.length;

  const FACES: { k: Face; label: string; count: number }[] = [
    ...(withSite
      ? [{ k: "site" as const, label: "Your site", count: pages }]
      : []),
    { k: "notes", label: "Your notes", count: notes },
  ];

  /* Whichever half is actually on show. Moving from the run-through back to
     the quick pane takes the site half away, and a drawer left pointing at a
     face that is no longer there would open on nothing. */
  const on: Face = withSite ? face : "notes";

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

  const show = (next: Face) => {
    setFace(next);
    setOpen(true);
  };

  return (
    <>
      {/* The tab, turned on its side, against the right edge of the tool.

          It belongs to this tool, not to the window: fixed to the screen it
          followed the reader onto pages that have no notes to keep and no step
          to file them under. So it hangs off the edge of the run-through and
          leaves with it, and it sticks to the middle of the screen for as long
          as the run-through is on it.

          Out to the edge of the window, not the edge of the column. Measured
          back through the page frame's own gutter, which is the padding
          standing between this column and the window. */}
      <div
        aria-hidden={open}
        className="pointer-events-none absolute inset-y-0 -right-(--page-gutter) z-30 w-0"
      >
        {/* `w-max`, and it is not optional.

            The box this stands in is `w-0` - a zero-width line at the edge of
            the window, there only to hang the tab off. A form control with
            `width: auto` sizes to its content, which is why the tab was a
            button and was visible; a `div` with `width: auto` fills its
            containing block, which here is nothing at all. Two halves in one
            shape needs an element round them, so that element has to ask for
            its own width. */}
        <div
          className={cn(
            "sticky top-[42vh] flex w-max -translate-x-full flex-col overflow-hidden rounded-l-[10px] bg-ink text-white",
            open ? "pointer-events-none opacity-0" : "pointer-events-auto",
          )}
        >
          {FACES.map((entry, n) => (
            <button
              key={entry.k}
              type="button"
              onClick={() => show(entry.k)}
              aria-expanded={open}
              className={cn(
                /* A hairline of the page between the two, not a border. The
                   tab is one shape with two halves; a drawn rule would make it
                   two shapes that happen to touch. */
                "flex cursor-pointer flex-col items-center gap-2 px-2 py-3 transition-colors hover:bg-body",
                n ? "border-t border-white/12" : "",
              )}
            >
              <span
                className="font-mono text-[8.5px] font-bold tracking-[0.14em] uppercase"
                style={{ writingMode: "vertical-rl" }}
              >
                {entry.label}
              </span>
              <span
                className={cn(
                  "flex min-w-4 items-center justify-center rounded-pill px-1 py-px font-mono text-[8.5px] font-bold tabular-nums",
                  entry.count ? "bg-mark text-white" : "bg-white/15 text-white/60",
                )}
              >
                {entry.count}
              </span>
            </button>
          ))}
        </div>
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
            aria-label={withSite ? "Your site and your notes" : "Your notes"}
            tabIndex={-1}
            /* Cut on its leading edge the way every other surface here is cut,
               and only there: the other three edges are the window's. A panel
               with four rounded corners floating over a page is a dialog; one
               that meets the screen on three sides is a drawer. */
            className="quiet-scroll relative flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-field p-6 outline-none sm:rounded-l-[28px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <Kicker className="block">
                  {on === "site" ? "The site you are building" : "Your notes"}
                </Kicker>
                <h2 className="mt-2 text-[22px] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
                  {on === "site"
                    ? pages
                      ? `${pages} pages, as it stands`
                      : "Nothing described yet"
                    : notes
                      ? `${notes} on the desk`
                      : "Anything you like, any time"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close the dock"
                className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-pill bg-well text-quiet transition-colors hover:bg-hair hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* The two, as a pair to move between rather than as a pair to
                choose from once. Both counts stay on show while either is
                open, so the one you are not reading is still telling you it
                has something in it.

                Not drawn where there is only one of them: a switch with a
                single position is a label pretending to be a control. */}
            {FACES.length > 1 ? (
              <div
                role="tablist"
                aria-label="What the dock is showing"
                className="mt-5 flex gap-1 rounded-pill bg-well p-1"
              >
                {FACES.map((entry) => {
                  const here = entry.k === on;

                  return (
                    <button
                      key={entry.k}
                      type="button"
                      role="tab"
                      aria-selected={here}
                      onClick={() => setFace(entry.k)}
                      className={cn(
                        "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-pill px-3 py-1.5 text-[13px] font-semibold transition-colors",
                        here ? "bg-field text-ink" : "text-quiet hover:text-ink",
                      )}
                    >
                      {entry.label}
                      <span
                        className={cn(
                          "font-mono text-[9.5px] font-bold tabular-nums",
                          here ? "text-mark" : "text-idx",
                        )}
                      >
                        {entry.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {on === "site" ? (
              <>
                {/* What the list is, said before it is read. Four of these
                    pages are on every site we build and the rest were put
                    there by an answer, and a list that does not say which is
                    which reads as a quote. */}
                <p className="mt-4 rounded-[12px] bg-well px-3.5 py-2.5 text-[12px] leading-[1.5] text-quiet">
                  Every answer adds to this and nothing here is fixed. Leave a
                  question alone and we write down{" "}
                  <b className="font-semibold text-ink">what we will assume</b>{" "}
                  instead, which is at the foot of this panel.
                </p>

                <div className="mt-5">
                  <Panel answers={answers} bare />
                </div>
              </>
            ) : (
              <NotesBody
                answers={answers}
                where={where}
                onGoStep={onGoStep}
                onClose={() => setOpen(false)}
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
