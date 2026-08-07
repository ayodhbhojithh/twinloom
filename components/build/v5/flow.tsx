"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { STEPS } from "@/lib/build/v5";
import { STEP_ORDER } from "@/lib/build/v5-derive";
import {
  getAnswers,
  getServerAnswers,
  setShort,
  subscribeAnswers,
  type Where,
} from "@/lib/build/v5-store";

import { NotesDock } from "./notes";
import { QuickPane } from "./quick";
import { StageDo, StageWho } from "./stages-a";
import { StageHave, StageRefs, StageSell, StageStyle } from "./stages-b";
import { StageRead, StageSubmit } from "./stages-c";
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

  /* The short way round is what opens. It is first in the pill and it is what
     most people want, and a page that lists the quick route first then starts
     you on the long one is telling you two different things. */
  const [tab, setTab] = useState<"quick" | "full">("quick");
  const [step, setStep] = useState(0);

  /* Where the reader is standing, so anything written on the desk files under
     the answer behind it rather than in a pile at the end. */
  const where = useMemo<Where>(
    () => ({ stepKey: STEPS[step].k, step: STEPS[step].n }),
    [step],
  );

  const goStep = (at: number) =>
    setStep(Math.max(0, Math.min(STEPS.length - 1, at)));

  const goKey = (key: string) => {
    const at = STEP_ORDER.indexOf(key);
    if (at < 0) return;
    setTab("full");
    goStep(at);
  };

  const props = { answers, onGo: goStep, onGoKey: goKey };

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
      case "read":
        return <StageRead at={step} {...props} />;
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
      {/* Centred, like the booking page's head and like every step heading on
          the surface below it. Left against the edge it was one short block in
          the corner of a very wide screen, with the question it introduces
          centred underneath. */}
      <div className="mb-7 text-center sm:mb-8">
        {/* `text-balance` off below `sm`. Balancing evens the lines, which on a
            phone turns a four line headline into four short ones with a ragged
            block of space beside them - the measure is already doing the
            breaking there. */}
        <h1 className="section-head mx-auto max-w-[26ch] text-ink max-sm:[text-wrap:pretty]">
          Build your website.
          <span className="text-quiet">
            {" "}
            Answer what you like, we write it down.
          </span>
        </h1>
      </div>

      {tab === "quick" ? (
        <QuickPane
          answers={answers}
          onCarryOn={() => {
            setShort(false);
            setTab("full");
          }}
        />
      ) : (
        <>
          <StepStrip step={step} answers={answers} onGo={goStep} />

          {/* One column while the panel is out. Two columns with nothing in
              the second is a step held to two thirds of its own surface. */}
          <div className="grid items-start gap-7">
            <div className="min-w-0">{stage}</div>

            {/* The panel, held.

                It ran beside every step listing the pages the answers add up
                to. Out for now, so a step has the whole surface and the
                read-back is the one place the site is described.

                Commented rather than deleted: it is the running answer, and it
                is the first thing to want back.

                <div className="quiet-scroll min-w-0 xl:sticky xl:top-[calc(var(--nav-height)+20px)] xl:max-h-[calc(100svh-var(--nav-height)-40px)] xl:overflow-y-auto">
                  <Panel answers={answers} />
                </div> */}
          </div>
        </>
      )}

      <NotesDock answers={answers} where={where} onGoStep={goKey} />
    </div>
  );
}
