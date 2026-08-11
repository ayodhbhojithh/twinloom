"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { STEPS } from "@/lib/build/v5";
import {
  askDeskFace,
  clearDeskContext,
  setDeskContext,
} from "@/lib/build/desk-context";
import { STEP_ORDER } from "@/lib/build/v5-derive";
import {
  getAnswers,
  getPlace,
  getServerAnswers,
  getServerPlace,
  setPlace,
  setShort,
  subscribeAnswers,
  subscribePlace,
  type Where,
} from "@/lib/build/v5-store";

import { QuickPane } from "./quick";
import { StageDo, StageWho } from "./stages-a";
import { StageHave, StageRefs, StageSell, StageStyle } from "./stages-b";
import { StageSubmit } from "./stages-c";
import { StageOrg, StageSystems, StageWidgets } from "./stages-d";
import { StepStrip } from "./strip";

/* ---------------------------------------------------------------------------
   Build your website.

   Two ways through and one set of answers: moving between them keeps
   everything already given, which is why neither is chosen until somebody
   presses something inside one.

   The run-through is a strip of steps and one working surface. The strip
   decides what the surface shows - nothing is reached by scrolling past
   something else - and the panel beside it is the answer being written while
   the questions are answered, which is what makes this a tool rather than a
   form.
--------------------------------------------------------------------------- */

export function BuildFlow() {
  const answers = useSyncExternalStore(
    subscribeAnswers,
    getAnswers,
    getServerAnswers,
  );

  /* Where the reader is, read from the store rather than held here.

     The short way round is what opens - it is first in the pill and it is what
     most people want, and a page that lists the quick route first then starts
     you on the long one is telling you two different things. That is the
     starting place, and it stopped being the only place the moment the answers
     began surviving a reload: eight steps of work restored behind a screen
     somebody has to navigate back to is worse than losing the lot, because the
     run looks untouched.

     `useSyncExternalStore` for the same reason the answers use it - see
     `lib/build/v5-store`, which keeps this beside them for the visit. */
  const place = useSyncExternalStore(subscribePlace, getPlace, getServerPlace);
  const { tab, step } = place;

  const setTab = (next: "quick" | "full") => setPlace({ tab: next });

  /* Where the reader is standing, so anything written on the desk files under
     the answer behind it rather than in a pile at the end. */
  const where = useMemo<Where>(
    () => ({ stepKey: STEPS[step].k, step: STEPS[step].n }),
    [step],
  );

  const goStep = (at: number) =>
    setPlace({ step: Math.max(0, Math.min(STEPS.length - 1, at)) });

  const goKey = (key: string) => {
    const at = STEP_ORDER.indexOf(key);
    if (at < 0) return;
    setTab("full");
    goStep(at);
  };

  /* What the desk needs to know while this is on screen.

     `where` is nothing on the quick pane: there is no step being stood on
     there, and filing a note under step 01 because step 01 is what the run
     would have opened at is a place the reader never was. The site tab is
     held back for the same reason - the quick submission derives no pages,
     and a tab reading zero has nothing to say.

     Cleared on the way out, so the desk on every other page is a desk with no
     run-through behind it. */
  useEffect(() => {
    setDeskContext({
      where: tab === "full" ? where : null,
      withSite: tab === "full",
      goStep: goKey,
    });
    return clearDeskContext;
    /* `goKey` is rebuilt each render and is not worth a `useCallback` for a
       store that compares before it publishes: what matters is the step and
       the tab, and `setDeskContext` ignores a write that changes neither. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, where]);

  const props = { answers, onGo: goStep, onGoKey: goKey };

  /* No `face` here any more.

     Which panel of the dock is open used to live here, because opening it
     changed the layout of the tool - the panel was a column in this grid, so
     the thing laying the two out had to be the thing that knew. It is fixed to
     the window now and lays out nothing here, so the state belongs with it.

     Which leaves one loose end, deliberately left: the door into the run
     wanted to open the site tab as it went, and it cannot reach across to do
     that any more. See where it used to call `setFace`. */

  /* Back to the top of the tool when the step changes.

     This has to live here rather than on the surface, because the surface is
     not the same element from one step to the next: each step is its own
     component, so React unmounts one and mounts another, and anything the
     surface remembers about having already arrived is forgotten with it. Its
     own "skip the first run" guard was therefore skipping every run.

     What that left was this. Somebody presses the way on from the foot of a
     long step - the industry list is fifty-five rows - the next step is short,
     the document loses a screen or two of height in one frame, and the window
     keeps the scroll position it had. That position is now somewhere in the
     section below the tool, so finishing a step appeared to throw the reader
     into the articles. Nothing scrolled them there; the page shrank out from
     under them. */
  const run = useRef<HTMLDivElement>(null);
  const landed = useRef(false);

  useEffect(() => {
    if (!landed.current) {
      landed.current = true;
      return;
    }

    const box = run.current;
    if (!box) return;

    const head =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--nav-height",
        ),
      ) || 53;

    const rect = box.getBoundingClientRect();

    /* Only where the tool has been left behind. If its top is still on screen
       the reader can see the new step already, and moving the page under
       somebody who has not asked to be moved is its own fault. */
    if (rect.top >= head - 4) return;

    window.scrollTo({
      top: Math.max(0, rect.top + window.scrollY - head - 12),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [step, tab]);

  const stage = (() => {
    switch (STEPS[step].k) {
      case "org":
        return <StageOrg at={step} {...props} />;
      case "who":
        return <StageWho at={step} {...props} />;
      case "do":
        return <StageDo at={step} {...props} />;
      case "sell":
        return <StageSell at={step} {...props} />;
      case "style":
        return <StageStyle at={step} {...props} />;
      case "have":
        return <StageHave at={step} {...props} />;
      case "refs":
        return <StageRefs at={step} {...props} />;
      case "widgets":
        return <StageWidgets at={step} {...props} />;
      case "systems":
        return <StageSystems at={step} {...props} />;
      default:
        return <StageSubmit at={step} {...props} />;
    }
  })();

  return (
    /* Positioned, so the notes tab can hang off the right edge of the tool
       rather than off the edge of the window.

       And green, here only. The accent everywhere else on the site is the blue
       that means "this is set"; on these screens the same mark is doing a
       different job - it is saying an answer has been given - and green is the
       colour that says so without anyone being taught it. Scoped by overriding
       the variable rather than by swapping classes, so every tick, bar, count
       and rule inside changes together and nothing can be missed. */
    <div
      className="relative"
      style={{ ["--color-mark" as string]: "var(--color-done)" }}
    >
      {/* The head.

          The Quick / Detailed switch is gone from it. Two tabs above a screen
          that already opens on the quick way, with the way through to the
          questions standing at the foot of that screen, was the same choice
          offered twice - and the one at the top was offered before anybody had
          read what either of them meant. "Carry on through the questions" is
          the only place the choice needs to be, because it is the only place
          somebody has the information to make it. */}
      {/* No heading over the tool.

          It said "Build your website. Answer what you like, we write it down.",
          which is exactly what the section above it now says in type twice the
          size - and this component renders inside that section as well as on its
          own page. Two headings a hand's width apart saying the same thing is
          the page stammering.

          The step's own question is the heading from here down, which is the
          right one: it changes as somebody moves through the run, and it is the
          only thing on the surface they have to read. */}

      {/* The tool and the panel, side by side.

          Opening the dock moves this column left and gives the room to the
          panel. It used to slide over the top on a scrim, which covered the
          question somebody had opened it to compare against - and a rectangle
          floating over the page is the one thing the shape language on this site
          does not do.

          Stacked below `xl`, and above the tool rather than under it: there is
          no room to shift left on a narrow window, and a panel that opens below
          the fold has not opened. */}
      <div
        ref={run}
        className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-7"
      >
        <div className="min-w-0 flex-1">
          {tab === "quick" ? (
            <QuickPane
              answers={answers}
              onCarryOn={() => {
                setShort(false);
                setTab("full");
                /* And the panel, open.

                   The structured journey is sold on the panel: the door that
                   starts it says the site your answers describe is shown beside
                   them while you answer. Arriving to a closed tab and having to
                   find it makes that a claim rather than a fact. It is still
                   closeable - it is opened for somebody, not on them. */
                askDeskFace("site");
              }}
            />
          ) : (
            <>
              <StepStrip step={step} answers={answers} onGo={goStep} />

              {/* One column. The running answer is the panel beside this now
                  rather than a column inside it, so a step has the whole width
                  it is given. */}
              <div className="min-w-0">{stage}</div>
            </>
          )}
        </div>
      </div>

      {/* No dock here any more.

          The tab and the panel hung off the edge of this tool, which put the
          desk on one screen of one route - and the desk is where anything
          worth writing down goes, whatever page the thought arrived on. Both
          are in the shell now, so they are on every page and the panel is the
          height of the window rather than the height of whichever step it
          happened to stand beside.

          What this still owns is the context: which step is being stood on,
          whether the derived site is worth a tab, and how to open a step. It
          publishes those while it is mounted and takes them back on the way
          out - see `lib/build/desk`. */}
    </div>
  );
}
