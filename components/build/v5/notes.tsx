"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Search, StickyNote, X } from "lucide-react";

import {
  addRef,
  dropRef,
  setLike,
  type Answers,
  type Where,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { isPicture, type Attached } from "@/lib/build/upload";

import { DropZone } from "./drop";
import { AddRow, Kicker, RefText } from "./kit";

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
  const [find, setFind] = useState("");
  const [files, setFiles] = useState<Attached[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const came = useRef<HTMLElement | null>(null);

  const filed = general ? null : where;
  const count = answers.refs.length;

  /* Grouped by what each thing is filed under, and searched before grouping so
     a search returns groups rather than a flat list that has lost its places. */
  const hunted = find.trim().toLowerCase();
  const groups = (() => {
    const shown = hunted
      ? answers.refs.filter((ref) =>
          (ref.text + " " + whereName(ref.where)).toLowerCase().includes(hunted),
        )
      : answers.refs;

    const byPlace = new Map<string, typeof answers.refs>();
    for (const ref of shown) {
      const place = whereName(ref.where);
      byPlace.set(place, [...(byPlace.get(place) ?? []), ref]);
    }
    return [...byPlace.entries()];
  })();

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
            /* Cut on its leading edge the way every other surface here is cut,
               and only there: the other three edges are the window's. A panel
               with four rounded corners floating over a page is a dialog; one
               that meets the screen on three sides is a drawer. */
            className="quiet-scroll relative flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-field p-6 outline-none sm:rounded-l-[28px]"
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

            {/* Files, on the desk as well as words.

                Somebody who has just thought of the thing they wanted to show
                us has it on their machine, not in a sentence. Sending them back
                to a step to attach it is asking them to remember where the
                attaching happens. */}
            <DropZone
              className="mt-5"
              label="Or drop a file here"
              note="Pictures, brochures, price lists, screenshots."
              files={files}
              onAdd={(taken) => {
                setFiles((was) => [...was, ...taken]);
                for (const file of taken) {
                  addRef({
                    kind: isPicture(file.type) ? "Image" : "Document",
                    text: file.name,
                    where: filed,
                    url: file.url,
                    publicId: file.publicId,
                  });
                }
              }}
              onDrop={(at) =>
                setFiles((was) => was.filter((_, index) => index !== at))
              }
            />

            {/* Search, once there is enough on the desk to lose something in.
                Below that it is a control asking to be used on four items. */}
            {count > 5 ? (
              <label className="mt-5 flex items-center gap-2.5 rounded-field bg-canvas px-3.5 py-2.5">
                <Search aria-hidden className="size-4 flex-none text-idx" />
                <input
                  value={find}
                  onChange={(event) => setFind(event.target.value)}
                  placeholder={`Search ${count} notes`}
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-label"
                />
              </label>
            ) : null}

            {groups.length ? (
              <div className="mt-5 flex flex-col gap-5">
                {groups.map(([place, items]) => (
                  <section key={place} className="min-w-0">
                    {/* Grouped by what each is filed under, which is the thing
                        the panel promises at the top. A flat list said "filed
                        under X" once and then showed twelve rows in the order
                        they happened to be written. */}
                    <div className="flex items-baseline justify-between gap-3">
                      <Kicker className="text-ink">{place}</Kicker>
                      <span className="font-mono text-[9px] font-bold text-idx tabular-nums">
                        {String(items.length).padStart(2, "0")}
                      </span>
                    </div>

                    <ul className="mt-2 flex flex-col gap-2.5">
                      {items.map((ref) => {
                        const written = ref.kind === "Note";
                        /* Kept reachable if it was ever filled in, so nothing
                           somebody typed can be stranded by the rule below. */
                        const liked = answers.like[ref.n] ?? "";

                        return (
                          <li
                            key={ref.n}
                            /* Paper, not a card.

                               Square corners and a turned one, which is the
                               single thing that separates a leaf of paper from
                               every other surface on this site. A written note
                               also gets the margin rule down its leading edge -
                               the line you write to the right of - so words
                               somebody wrote and a file somebody attached are
                               told apart before either is read. */
                            className={cn(
                              "note-leaf group/note bg-canvas py-3 pe-3.5 transition-colors hover:bg-canvas-firm",
                              written ? "note-rule ps-[26px]" : "ps-3.5",
                            )}
                          >
                            {/* A strip the height of the fold, so the first
                                line of the note is never cut by it. */}
                            <div className="flex h-5 items-center gap-1.5">
                              {written ? (
                                <StickyNote
                                  aria-hidden
                                  className="size-3 flex-none text-idx"
                                />
                              ) : (
                                <Paperclip
                                  aria-hidden
                                  className="size-3 flex-none text-idx"
                                />
                              )}
                              <Kicker>{ref.kind}</Kicker>
                            </div>

                            <p
                              className={cn(
                                "text-[13px] leading-[1.5] text-ink",
                                written
                                  ? "font-medium"
                                  : "font-mono text-[12px] break-all",
                              )}
                            >
                              <RefText text={ref.text} />
                            </p>

                            {/* Only where the question means anything. A note
                                is already your own words about the thing; being
                                asked what you like about your own sentence is a
                                field looking for something to do. */}
                            {!written || liked ? (
                              <input
                                value={liked}
                                placeholder="What you like about it"
                                onChange={(event) =>
                                  setLike(ref.n, event.target.value)
                                }
                                className="mt-2.5 h-8 w-full rounded-field border border-hair bg-field px-3 text-[12px] text-ink outline-none transition-colors placeholder:text-label focus:border-ink"
                              />
                            ) : null}

                            <div className="mt-2 flex items-center justify-between gap-3">
                              {ref.where?.stepKey ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const key = ref.where?.stepKey;
                                    if (!key) return;
                                    onGoStep(key);
                                    setOpen(false);
                                  }}
                                  className="cursor-pointer text-left font-mono text-[8.5px] font-bold tracking-[0.1em] text-quiet uppercase transition-colors hover:text-ink"
                                >
                                  Take me back to it
                                </button>
                              ) : (
                                <span />
                              )}

                              <button
                                type="button"
                                onClick={() => dropRef(ref.n)}
                                className="flex-none cursor-pointer font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase opacity-0 transition-opacity group-hover/note:opacity-100 focus-visible:opacity-100"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            ) : count ? (
              <p className="note-leaf mt-5 bg-canvas px-4 py-3.5 text-[12.5px] leading-[1.55] text-quiet">
                Nothing on the desk matches that.
              </p>
            ) : (
              /* The empty state is a blank leaf, which is the honest picture of
                 an empty desk and says what the panel is before anything has
                 been put on it. */
              <p className="note-leaf note-rule mt-5 bg-canvas py-4 pe-4 ps-[26px] text-[12.5px] leading-[1.55] text-quiet">
                Nothing on the desk yet, and that is a finished answer - nothing
                here is required or checked against anything.
              </p>
            )}

            {/* The foot, once there is something to say about the whole desk.
                It answers the question a note-taking panel raises and does not
                usually answer: will any of this be read. */}
            {count ? (
              <p className="mt-6 border-t border-hair pt-4 text-[12px] leading-[1.55] text-label">
                All {count} go with the scoping request, each one beside the
                answer it was written against. Nothing here is required, and
                nothing is scored.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
