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

   It floats at the right of the window, the full height of it. It was a column
   in the tool's own grid for a while, which is why it was as tall as whichever
   step happened to be beside it - a panel for a running list, sized by
   something that is not the list. Against the window it is the window's
   height, and the list scrolls inside it.

   What it must not become again is the drawer it started as: a rectangle
   sliding over a scrim, covering the question you opened it to compare
   against. It is inset from the edge rather than flush to it, and on a wide
   screen there is no scrim at all - the page is still there and still
   readable, which is the difference between a panel resting against the side
   of a page and a panel over it.

   And it is cut, not boxed. The tabs stand in a notch in its top edge and the
   way out stands in a cut taken out of the corner beside them, which is the
   rule the whole site is drawn by: anything you can press stands in a piece cut
   out of the surface rather than floating on top of it.
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
 * The tab, turned on its side against the right edge of the window.
 *
 * It belonged to the tool and hung off the edge of it, on the argument that a
 * tab following the reader onto pages with no step to file a note under was a
 * tab in the way. That argument has been dropped rather than lost to: a note
 * worth keeping is worth keeping wherever the thought arrived, and the panel
 * files under General when there is no step behind it. The desk is the site's
 * now, so the tab is the window's.
 *
 * Fixed rather than absolute-and-sticky. It had a zero-width absolute box to
 * hang off the tool's own edge and a sticky child to hold it near the middle
 * of the screen - both of which need the tool to be the positioned thing
 * around them. In the shell there is nothing to be absolute against but the
 * page itself, so it is simply fixed where it belongs.
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
    /* Against the window's own right edge, halfway down it. */
    <div
      aria-hidden={open}
      className="pointer-events-none fixed top-1/2 right-0 z-30 w-0 -translate-y-1/2"
    >
      {/* `w-max` is not optional. The box this stands in is `w-0` - a zero-width
          line at the edge of the window, there only to hang the tab off. A form
          control with `width: auto` sizes to its content, which is why the tab
          worked while it was a single button; a `div` with `width: auto` fills
          its containing block, which here is nothing at all. */}
      <div
        className={cn(
          "flex w-max -translate-x-full flex-col overflow-hidden rounded-l-[10px] bg-ink text-white",
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
                entry.count
                  ? "bg-mark text-white"
                  : "bg-white/15 text-white/60",
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
  return (
    <Stage
      tone="field"
      /* Back to the top when the tab changes. The two are different lengths, and
         a panel left where the last one ended opens the next halfway down. */
      scrollKey={on}
      /* The whole of whatever it is given, which is now the height of the
         window rather than the height of the step it used to stand beside -
         and so its contents start at the top and scroll, rather than being
         centred in a screenful of room. */
      top
      className="h-full min-h-0 w-full"
      toolbar={
        /* The two, standing in the notch. Short labels here and the full ones in
           the heading below: the notch is a bar cut out of a 400px edge, and
           "Your site" beside "Your notes" in it is two truncations. */
        <Plate className="gap-1">
          {list.length > 1 ? (
            list.map((entry) => {
              const chosen = entry.k === on;

              return (
                <button
                  key={entry.k}
                  type="button"
                  role="tab"
                  aria-selected={chosen}
                  onClick={() => onFace(entry.k)}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 rounded-pill px-3 py-1.5 text-[12.5px] font-semibold transition-colors max-sm:px-2.5 max-sm:py-1 max-sm:text-[11.5px]",
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
          ) : (
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
          <b className="font-mono text-[21px] leading-none font-bold text-ink tabular-nums max-sm:text-[17px]">
            {here?.count ?? 0}
          </b>
          <span className="mt-1 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
            {on === "site" ? "Pages" : "Notes"}
          </span>
        </div>
      }
      head={
        /* At the top right, which is where a panel is shut from.

           It stood in the corner cut at the foot, and that cut is for the way
           on: a step carries the thing that takes you forward at the end of the
           reading. Nothing about this takes anybody forward - it puts the panel
           away - and every window anybody has ever closed is closed from its
           top right corner. At the bottom of a panel the height of the screen
           it was also the furthest point on it from the tab that opened it.

           Filled, not bare. It stands in a piece taken out of the surface, so
           bare it was a grey mark on the page showing through with nothing to
           say it was a control at all. Ink is what the site's other cut discs
           are. */
        <Disc label="Close the panel" onClick={onClose} tone="ink">
          <X className="size-4" />
        </Disc>
      }
    >
      {/* Held to the screen and scrolling inside it, but only where it is docked
          beside the question. Stacked above the tool on a narrower window it is
          in the page's own flow and the page scroll is the right one. */}
      <div className="quiet-scroll w-full xl:max-h-[calc(100svh-var(--nav-height)-190px)] xl:overflow-y-auto">
        <DeskBody
          answers={answers}
          where={where}
          onGoStep={onGoStep}
          onClose={onClose}
          on={on}
        />
      </div>
    </Stage>
  );
}

/**
 * What is on the desk, whichever shell is holding it.
 *
 * Two shells now: the cut surface on a wide screen and a sheet on a phone, and
 * the thing inside them is the same list either way. Written once, because the
 * day the notes list gains a column is the day the two would have parted
 * company.
 */
function DeskBody({
  answers,
  where,
  onGoStep,
  onClose,
  on,
}: {
  answers: Answers;
  where: Where | null;
  onGoStep: (key: string) => void;
  onClose: () => void;
  on: Face;
}) {
  const pages = pagesFrom(answers).length;
  const notes = answers.refs.length;

  return (
    <>
      <Kicker className="block">
        {on === "site" ? "The site you are building" : "Your notes"}
      </Kicker>

      <h2 className="mt-2 text-[20px] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink max-sm:mt-1.5 max-sm:text-[17px]">
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
          <p className="mt-4 rounded-[12px] bg-well px-3.5 py-2.5 text-[12px] leading-[1.5] text-quiet max-sm:mt-3 max-sm:px-3 max-sm:py-2 max-sm:text-[11.5px]">
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
    </>
  );
}

/**
 * The desk on a phone: a sheet up from the bottom edge.
 *
 * Not the cut surface at a smaller size. That shape is a panel resting beside a
 * page - it has a notch in its top edge, a bite at one corner and a disc in
 * another, and all three are read against the page showing round it. On a phone
 * nothing shows round it: it covers the screen, so the cuts are cut out of
 * nothing and the shape reads as a rectangle with dents.
 *
 * A sheet is what a phone already means by this. It comes up from the edge the
 * thumb is nearest, it keeps a handle at the top to say which way it goes, and
 * it stops short of the top of the screen so the page behind is still visible -
 * which is the same thing the desktop panel says by floating beside the page.
 *
 * It is capped at seven eighths of the screen rather than filling it, for the
 * same reason: a sheet that reaches the top is a page, and a page is something
 * you have navigated to rather than something you have opened.
 */
function DockSheet({
  answers,
  where,
  onGoStep,
  face,
  onFace,
  onClose,
  withSite = true,
}: {
  answers: Answers;
  where: Where | null;
  onGoStep: (key: string) => void;
  face: Face;
  onFace: (face: Face) => void;
  onClose: () => void;
  withSite?: boolean;
}) {
  const list = faces(answers, withSite);
  const on = withSite ? face : "notes";

  return (
    <div className="flex max-h-[87svh] w-full flex-col rounded-t-[22px] bg-field shadow-[0_-8px_40px_rgba(12,32,56,0.16)]">
      {/* The handle. It does nothing - the sheet is not draggable - and it is
          still the right mark: it is how a phone says which edge this came from
          and which edge it goes back to. */}
      <span
        aria-hidden
        className="mx-auto mt-2.5 h-1 w-9 flex-none rounded-pill bg-hair"
      />

      <div className="flex flex-none items-center gap-2 px-4 pt-3 pb-3">
        {list.length > 1 ? (
          /* A segmented control rather than two pills in a notch. The notch is
             a hole in a surface with a page behind it; there is no page behind
             this one. */
          <div className="flex min-w-0 flex-1 rounded-pill bg-well p-0.5">
            {list.map((entry) => {
              const chosen = entry.k === on;

              return (
                <button
                  key={entry.k}
                  type="button"
                  role="tab"
                  aria-selected={chosen}
                  onClick={() => onFace(entry.k)}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-pill py-1.5 text-[12px] font-semibold transition-colors",
                    chosen ? "bg-field text-ink shadow-sm" : "text-quiet",
                  )}
                >
                  {entry.short}
                  <span
                    className={cn(
                      "font-mono text-[9.5px] font-bold tabular-nums",
                      chosen ? "text-mark" : "text-idx",
                    )}
                  >
                    {entry.count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <span className="min-w-0 flex-1">
            <Kicker>{list[0]?.label}</Kicker>
          </span>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close the panel"
          className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-90"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="quiet-scroll min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-6">
        <DeskBody
          answers={answers}
          where={where}
          onGoStep={onGoStep}
          onClose={onClose}
          on={on}
        />
      </div>
    </div>
  );
}

export { DockSheet };
