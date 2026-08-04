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
import { cn } from "@/lib/utils";

import { NotesDock } from "./notes";
import { Panel } from "./panel";
import { QuickPane } from "./quick";
import { StageArrive, StageDo, StageLayout, StageWho } from "./stages-a";
import { StageHave, StageRefs, StageSell, StageStyle } from "./stages-b";
import { StageAsking, StageKeep, StageRead, StageSubmit } from "./stages-c";
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

  const [tab, setTab] = useState<"quick" | "full">("full");
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
      case "arrive":
        return <StageArrive at={step} {...props} />;
      case "layout":
        return <StageLayout at={step} {...props} />;
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
      case "read":
        return <StageRead at={step} {...props} />;
      case "asking":
        return <StageAsking at={step} {...props} />;
      case "keep":
        return <StageKeep at={step} {...props} />;
      default:
        return <StageSubmit at={step} {...props} />;
    }
  })();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        {/* The two ways in. A segmented pill rather than two cards: it is one
            choice with two settings, and the header is not the place for a
            second surface. */}
        <div
          role="radiogroup"
          aria-label="How you want to do this"
          className="inline-flex rounded-pill bg-well p-1"
        >
          {(
            [
              { key: "full", label: "Detailed scoping" },
              { key: "quick", label: "Quick submission" },
            ] as const
          ).map((entry) => (
            <button
              key={entry.key}
              type="button"
              role="radio"
              aria-checked={tab === entry.key}
              onClick={() => setTab(entry.key)}
              className={cn(
                "cursor-pointer rounded-pill px-4 py-1.5 text-[13.5px] font-semibold transition-colors",
                tab === entry.key
                  ? "bg-ink text-white"
                  : "text-quiet hover:text-ink",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <p className="hidden text-[12.5px] text-quiet lg:block">
          Moving between them keeps every answer you have given.
        </p>
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

          <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_330px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">{stage}</div>

            {/* Held to the screen and scrolled inside itself from xl, where it
                is a second column. Below that it follows the surface as
                ordinary content. */}
            <div className="quiet-scroll min-w-0 xl:sticky xl:top-[calc(var(--nav-height)+20px)] xl:max-h-[calc(100svh-var(--nav-height)-40px)] xl:overflow-y-auto">
              <Panel answers={answers} />
            </div>
          </div>
        </>
      )}

      {/* Reachable from every step and belonging to none, so it lives against
          the edge of the window rather than inside one column of one step. */}
      <NotesDock answers={answers} where={where} onGoStep={goKey} />
    </>
  );
}
