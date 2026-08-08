"use client";

import { X } from "lucide-react";

import { pagesFrom } from "@/lib/build/v5-derive";
import { type Answers, type Where } from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Kicker } from "./kit";
import { NotesBody } from "./notes";
import { Panel } from "./panel";
import { Disc, Plate, Stage } from "./stage";

/* ---------------------------------------------------------------------------
   The dock: what is going in, and what is coming out.

   Two panels behind one tab. Notes are what you are putting in and the site is
   what is coming out, and they were two tabs against opposite edges of the
   window for a while - a run-through with something clipped to its left and
   something else clipped to its right reads as a screen with two problems
   rather than one desk. One shape, one place, two tabs.

   It does not float. It was a drawer over a scrim: a rectangle sliding over the
   page, which is the one thing this site's shape language does not do - and
   worse, it covered the question you opened it to compare against. Now it is a
   surface in the layout. Opening it moves the tool left and the panel takes the
   room, so both are on screen and neither is over the other.

   And it is cut, not boxed. The tabs stand in a notch in its top edge and the
   way out stands in the corner it gives up for it, which is the rule the whole
   site is drawn by: anything you can press stands in a piece cut out of the
   surface rather than floating on top of it.
--------------------------------------------------------------------------- */

export type Face = "site" | "notes";

/** The two, and what each has to show. Read by the tab and by the panel. */
function faces(answers: Answers, withSite: boolean) {
  const list: { k: Face; label: string; short: string; count: number }[] = [];

  if (withSite) {
    list.push({
      k: "site",
      label: "Your site",
      short: "Site",
      count: pagesFrom(answers).length,
    });
  }

  list.push({
    k: "notes",
    label: "Your notes",
    short: "Notes",
    count: answers.refs.length,
  });

  return list;
}

/**
 * The tab, turned on its side against the right edge of the tool.
 *
 * It belongs to this tool, not to the window: fixed to the screen it followed
 * the reader onto pages that have no notes to keep and no step to file them
 * under. So it hangs off the edge of the run-through and leaves with it, and it
 * sticks to the middle of the screen for as long as the run-through is on it.
 */
export function DockTab({
  answers,
  withSite = true,
  open,
  onOpen,
}: {
  answers: Answers;
  withSite?: boolean;
  open: boolean;
  onOpen: (face: Face) => void;
}) {
  return (
    /* Out to the edge of the window, not the edge of the column. Measured back
       through the page frame's own gutter, which is the padding standing between
       this column and the window. */
    <div
      aria-hidden={open}
      className="pointer-events-none absolute inset-y-0 -right-(--page-gutter) z-30 w-0"
    >
      {/* `w-max` is not optional. The box this stands in is `w-0` - a zero-width
          line at the edge of the window, there only to hang the tab off. A form
          control with `width: auto` sizes to its content, which is why the tab
          worked while it was a single button; a `div` with `width: auto` fills
          its containing block, which here is nothing at all. */}
      <div
        className={cn(
          "sticky top-[42vh] flex w-max -translate-x-full flex-col overflow-hidden rounded-l-[10px] bg-ink text-white",
          open ? "pointer-events-none opacity-0" : "pointer-events-auto",
        )}
      >
        {faces(answers, withSite).map((entry, n) => (
          <button
            key={entry.k}
            type="button"
            onClick={() => onOpen(entry.k)}
            aria-expanded={open}
            className={cn(
              /* A hairline of the page between the two, not a border. The tab is
                 one shape with two halves; a drawn rule would make it two shapes
                 that happen to touch. */
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
  );
}

/**
 * The panel, as a cut surface standing beside the question.
 *
 * White where the run-through is warm paper, because it is a second surface on
 * the same ground rather than a hole in the first one. The tabs are in the notch
 * and the way out is in the corner cut, so nothing about it is drawn on top of
 * anything.
 */
export function DockPanel({
  answers,
  where,
  onGoStep,
  face,
  onFace,
  onClose,
  withSite = true,
}: {
  answers: Answers;
  /** Where the reader is standing, so a note files under the right answer. */
  where: Where | null;
  onGoStep: (key: string) => void;
  face: Face;
  onFace: (face: Face) => void;
  onClose: () => void;
  withSite?: boolean;
}) {
  const list = faces(answers, withSite);
  const on = withSite ? face : "notes";
  const here = list.find((entry) => entry.k === on) ?? list[0];
  const pages = pagesFrom(answers).length;
  const notes = answers.refs.length;

  return (
    <Stage
      tone="field"
      /* Back to the top when the tab changes. The two are different lengths, and
         a panel left where the last one ended opens the next halfway down. */
      scrollKey={on}
      className="w-full"
      toolbar={
        /* The two, standing in the notch. Short labels here and the full ones in
           the heading below: the notch is a bar cut out of a 400px edge, and
           "Your site" beside "Your notes" in it is two truncations. */
        <Plate className="gap-1">
          {list.length > 1
            ? list.map((entry) => {
                const chosen = entry.k === on;

                return (
                  <button
                    key={entry.k}
                    type="button"
                    role="tab"
                    aria-selected={chosen}
                    onClick={() => onFace(entry.k)}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                      chosen
                        ? "bg-ink text-white"
                        : "text-quiet hover:bg-well hover:text-ink",
                    )}
                  >
                    {entry.short}
                    <span
                      className={cn(
                        "font-mono text-[9.5px] font-bold tabular-nums",
                        chosen
                          ? "text-white/60"
                          : entry.count
                            ? "text-mark"
                            : "text-idx",
                      )}
                    >
                      {entry.count}
                    </span>
                  </button>
                );
              })
            : (
                <span className="px-2">
                  <Kicker>{here?.label}</Kicker>
                </span>
              )}
        </Plate>
      }
      /* What it adds up to, standing in the bite the same way the run-through's
         own surfaces put their page count there. */
      aside={
        <div className="flex size-full flex-col items-center justify-center">
          <b className="font-mono text-[21px] leading-none font-bold text-ink tabular-nums">
            {here?.count ?? 0}
          </b>
          <span className="mt-1 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
            {on === "site" ? "Pages" : "Notes"}
          </span>
        </div>
      }
      corner={
        <Disc label="Close the panel" onClick={onClose}>
          <X className="size-4" />
        </Disc>
      }
    >
      {/* Held to the screen and scrolling inside it, but only where it is docked
          beside the question. Stacked above the tool on a narrower window it is
          in the page's own flow and the page scroll is the right one. */}
      <div className="quiet-scroll w-full xl:max-h-[calc(100svh-var(--nav-height)-190px)] xl:overflow-y-auto">
        <Kicker className="block">
          {on === "site" ? "The site you are building" : "Your notes"}
        </Kicker>

        <h2 className="mt-2 text-[20px] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink">
          {on === "site"
            ? pages
              ? `${pages} pages, as it stands`
              : "Nothing described yet"
            : notes
              ? `${notes} on the desk`
              : "Anything you like, any time"}
        </h2>

        {on === "site" ? (
          <>
            {/* What the list is, said before it is read. Four of these pages are
                on every site we build and the rest were put there by an answer,
                and a list that does not say which is which reads as a quote. */}
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
            onClose={onClose}
          />
        )}
      </div>
    </Stage>
  );
}
