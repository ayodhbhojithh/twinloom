"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

import {
  getDeskContext,
  getServerDeskContext,
  subscribeDeskContext,
} from "@/lib/build/desk-context";
import {
  getAnswers,
  getServerAnswers,
  subscribeAnswers,
} from "@/lib/build/v5-store";
import { ROUTES } from "@/lib/site";

import { DockPanel, DockTab, type Face } from "./dock";

/* ---------------------------------------------------------------------------
   The desk, on every page.

   It used to hang off the edge of the run-through, which meant it existed on
   one screen of one route: somebody reading the services page with a thought
   worth keeping had to find the tool first, and by then the thought is a thing
   they meant to write down. Hung off the window instead, it is always the same
   distance away.

   Full height, and that is the point of moving it as much as the reach is. In
   the flow it was a column in a grid, so it was as tall as the step beside it
   happened to be - a panel for a running list, sized by something that is not
   the list. Against the window it is the window's height, and the list scrolls
   inside it.

   Fixed rather than sticky. Sticky needs a scroll container to stick within
   and inherits its bounds; this belongs to the viewport and nothing else, and
   a panel that stopped at the foot of a section would be back where it
   started.
--------------------------------------------------------------------------- */

export function DeskDock({
  face,
  onFace,
  underHeader = true,
}: {
  /* Owned by the shell, because opening the desk moves the page aside -
     and the thing that lays the page out has to be the thing that knows. */
  face: Face | null;
  onFace: (face: Face | null) => void;
  /** Whether there is a bar at the top of the window to start below. */
  underHeader?: boolean;
}) {
  const answers = useSyncExternalStore(
    subscribeAnswers,
    getAnswers,
    getServerAnswers,
  );
  const desk = useSyncExternalStore(
    subscribeDeskContext,
    getDeskContext,
    getServerDeskContext,
  );
  const router = useRouter();

  /* A panel somebody asked for from somewhere that cannot open it.

     The door into the guided run promises the site is shown beside the
     questions, and it lives inside the flow where this state no longer does.
     Keyed on the count rather than the name, so asking twice for the same
     panel is heard twice.

     Adjusted during render rather than in an effect. An effect would be a
     second render pass after paint - the panel would flick open a frame late -
     and this is not synchronising with anything outside React, it is deriving
     one piece of state from another. React restarts the render when state is
     set this way, before anything is committed. */
  const [seen, setSeen] = useState(desk.asked);
  if (desk.asked !== seen) {
    setSeen(desk.asked);
    if (desk.wants) onFace(desk.wants);
  }

  /* Shut on the way back.

     The desk is mounted for the life of the site now, so nothing unmounts it
     to close it - and a panel left open across a navigation is a panel over a
     page nobody opened it on. */
  useEffect(() => {
    if (!face) return;
    const shut = () => onFace(null);
    window.addEventListener("popstate", shut);
    return () => window.removeEventListener("popstate", shut);
  }, [face, onFace]);

  return (
    <>
      {face ? (
        <>
          {/* A veil under it on a narrow screen, where the panel covers the
              page rather than floating beside it. On a wide one there is
              nothing to veil: the page is still there and still readable, and
              the desk is a thing on the page rather than a thing over it. */}
          <button
            type="button"
            aria-label="Close notes"
            onClick={() => onFace(null)}
            className="fixed inset-0 z-40 cursor-default bg-ink/25 backdrop-blur-[2px] lg:hidden"
          />

          {/* Floating at the right, from under the header to the floor.

              Not `inset-y-0`. Starting at the top of the window put the panel
              over the header and jammed its own top edge against the edge of
              the screen - and that top edge is a notch with the tabs standing
              in it, so what was cut off was the way between the two panels.
              A surface whose controls are cut out of its edge cannot have its
              edge at the edge of anything.

              Only where there is a bar to start below. The landing page keeps
              its header inside its own card, so there the panel takes the whole
              height and the offset would be a strip of empty window.

              Held off the sides and the floor as well: the inset is what makes
              it read as a panel resting against the page rather than a second
              column the page was built with. Full width on a phone, where
              there is no room to float anything. */}
          <div
            className="fixed right-0 bottom-0 z-50 flex w-full max-w-[560px] flex-col lg:w-(--desk-width) lg:max-w-none"
            style={{
              top: underHeader ? "var(--nav-height)" : 0,
              /* The landing card's own sill, so the two rest on the same
                 lines. They are the only two things on the site sized by the
                 window rather than by the page, and a panel beside a card that
                 stood a few pixels off it would read as very slightly wrong
                 without it being obvious why.

                 The head takes it either way. With no bar above, it is the
                 card's own gap to the window; with one, `top` has already
                 cleared the bar and this is the gap to that instead - the same
                 number doing the same job against a different edge. */
              paddingTop: "var(--sill-top)",
              paddingBottom: "var(--sill-bottom)",
              /* Nothing on the inner edge, and that is what makes the gap one
                 sill rather than two.

                 The page already ends a sill short of where the desk begins -
                 that is its own right gutter - so a sill of padding here as
                 well put two of them between the card and the panel, and the
                 one gap on screen that should match every other was the only
                 one that was double. The outer three keep theirs: those are
                 gaps to the window, and there is nothing on the far side of
                 them to have paid already. */
              paddingLeft: 0,
              paddingRight: "var(--sill-side)",
            }}
          >
            <DockPanel
              answers={answers}
              where={desk.where}
              /* Where there is no run-through listening, a step to open is a
                 page to open: the build route, which is where the steps are.
                 The desk is on every page, so this has to mean something on
                 every page. */
              onGoStep={desk.goStep ?? (() => router.push(ROUTES.build))}
              face={face}
              onFace={onFace}
              onClose={() => onFace(null)}
              withSite={desk.withSite}
            />
          </div>
        </>
      ) : null}

      <DockTab
        answers={answers}
        withSite={desk.withSite}
        open={Boolean(face)}
        onOpen={onFace}
      />
    </>
  );
}
