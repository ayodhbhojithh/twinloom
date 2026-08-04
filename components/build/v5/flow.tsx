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
      {/* The head, arranged the way the landing page arranges its own: the
          line on the left, the way in on the right, both on one baseline and
          both reaching the edges. A control dropped under a headline with a
          note floating off at the far margin is three things placed
          separately; this is one row. */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
        <h1 className="min-w-0 max-w-[24ch] text-[clamp(28px,2.9vw,46px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
          Build your website.
          <span className="text-quiet">
            {" "}
            Answer what you like - we write it down.
          </span>
        </h1>

        <div className="flex flex-none flex-col items-start gap-2 sm:items-end">
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

          <p className="text-[12px] text-quiet sm:text-right">
            Moving between them keeps every answer you have given.
          </p>
        </div>
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

      <NotesDock answers={answers} where={where} onGoStep={goKey} />
    </div>
  );
}
