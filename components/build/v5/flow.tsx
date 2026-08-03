"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { STEPS } from "@/lib/build/v5";
import { STEP_ORDER } from "@/lib/build/v5-derive";
import {
  getAnswers,
  getServerAnswers,
  setShort,
  subscribeAnswers,
  type Answers,
  type Where,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { Panel } from "./panel";
import { Kicker } from "./parts";
import { PhaseBar, Spine } from "./spine";
import { StepArrive } from "./steps/arrive";
import { StepLayout } from "./steps/layout";
import {
  StepAsking,
  StepDo,
  StepHave,
  StepKeep,
  StepRead,
  StepRefs,
  StepSell,
  StepStyle,
  StepSubmit,
  StepWho,
} from "./steps/rest";
import { QuickPane } from "./quick";

/* ---------------------------------------------------------------------------
   Build your website.

   Two ways through and one set of answers. The tabs are not two forms: moving
   between them keeps everything already given, which is why neither is chosen
   until somebody presses something inside one of them.

   The run-through itself is three columns. The steps down the left so the whole
   shape is visible from the first screen, the question in the middle, and the
   answer being written beside it. The panel is the reason this is a tool rather
   than a form: nothing is submitted, and the result is already on screen.
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

  const goKey = (key: string) => {
    const at = STEP_ORDER.indexOf(key);
    if (at < 0) return;
    setTab("full");
    setStep(at);
  };

  return (
    <>
      {/* Two ways in, on top. Cards rather than a tab bar, because the choice
          is between two different amounts of work and that has to be readable
          before either is pressed. */}
      <div
        role="tablist"
        aria-label="How you want to do this"
        className="grid max-w-wide gap-3 sm:grid-cols-2"
      >
        {(
          [
            {
              key: "quick",
              title: "Quick submission",
              note: "Say it in your own words and send it. A few minutes.",
            },
            {
              key: "full",
              title: "Detailed scoping",
              note: "Answer as much as you like and read it back. Twelve steps.",
            },
          ] as const
        ).map((entry) => (
          <button
            key={entry.key}
            type="button"
            role="tab"
            aria-selected={tab === entry.key}
            onClick={() => setTab(entry.key)}
            className={cn(
              "cursor-pointer rounded-card p-5 text-left transition-colors",
              tab === entry.key ? "bg-ink" : "bg-well hover:bg-hair",
            )}
          >
            <b
              className={cn(
                "block text-[16.5px] font-bold",
                tab === entry.key ? "text-white" : "text-ink",
              )}
            >
              {entry.title}
            </b>
            <span
              className={cn(
                "mt-1 block text-[14px] leading-[1.5]",
                tab === entry.key ? "text-white/65" : "text-quiet",
              )}
            >
              {entry.note}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-3 mb-10 max-w-measure text-[14px] leading-[1.6] text-quiet">
        Neither one is chosen until you press something. Looking at a tab changes
        nothing, and moving between them keeps every answer you have already
        given.
      </p>

      {tab === "quick" ? (
        <QuickPane
          answers={answers}
          onCarryOn={() => {
            setShort(false);
            setTab("full");
          }}
        />
      ) : (
        <div className="grid max-w-wide gap-x-10 gap-y-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_320px] 2xl:grid-cols-[260px_minmax(0,1fr)_360px]">
          <div className="min-w-0 lg:sticky lg:top-[calc(var(--nav-height)+24px)] lg:self-start">
            <Spine step={step} answers={answers} onGo={setStep} />
          </div>

          <div className="min-w-0">
            <PhaseBar step={step} />
            <Step at={step} answers={answers} onGo={setStep} onGoKey={goKey} />
          </div>

          <div className="min-w-0 xl:sticky xl:top-[calc(var(--nav-height)+24px)] xl:self-start">
            <Panel answers={answers} where={where} onGoStep={goKey} />
          </div>
        </div>
      )}
    </>
  );
}

function Step({
  at,
  answers,
  onGo,
  onGoKey,
}: {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  onGoKey: (key: string) => void;
}) {
  const props = { at, answers, onGo, onGoKey };

  switch (STEPS[at].k) {
    case "arrive":
      return <StepArrive at={at} onGo={onGo} />;
    case "layout":
      return <StepLayout at={at} answers={answers} onGo={onGo} />;
    case "who":
      return <StepWho {...props} />;
    case "do":
      return <StepDo {...props} />;
    case "sell":
      return <StepSell {...props} />;
    case "style":
      return <StepStyle {...props} />;
    case "have":
      return <StepHave {...props} />;
    case "refs":
      return <StepRefs {...props} />;
    case "read":
      return <StepRead {...props} />;
    case "asking":
      return <StepAsking {...props} />;
    case "keep":
      return <StepKeep {...props} />;
    default:
      return <StepSubmit {...props} />;
  }
}

export { Kicker };
