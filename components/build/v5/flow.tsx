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
      {/* Two ways in, on top.

          Not one slab of black beside one wash of near-white. That pairing said
          the chosen route was the only real one and left the other barely
          drawn, when the whole point of this screen is that both are complete
          answers. Both are cards with a real edge; the chosen one is marked by
          its edge going to ink and by saying so in words. */}
      <div
        role="tablist"
        aria-label="How you want to do this"
        className="grid max-w-wide gap-3 sm:grid-cols-2"
      >
        {(
          [
            {
              key: "quick",
              n: "01",
              title: "Quick submission",
              note: "Say it in your own words and send it. A few minutes.",
            },
            {
              key: "full",
              n: "02",
              title: "Detailed scoping",
              note: "Answer as much as you like and read it back. Twelve steps.",
            },
          ] as const
        ).map((entry) => {
          const on = tab === entry.key;

          return (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTab(entry.key)}
              className={cn(
                "group/way cursor-pointer rounded-card border bg-field p-5 text-left transition-colors",
                on ? "border-ink" : "border-border hover:border-planned",
              )}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] font-bold text-idx tabular-nums">
                    {entry.n}
                  </span>
                  <b className="text-[16.5px] font-bold text-ink">
                    {entry.title}
                  </b>
                </span>

                {/* The mark is a word, not a colour. A reader should not have to
                    work out which of two shades means "this one". */}
                <span
                  className={cn(
                    "flex flex-none items-center gap-1.5 font-mono text-[9.5px] font-bold tracking-[0.14em] uppercase",
                    on ? "text-done" : "text-transparent",
                  )}
                >
                  <span aria-hidden className="size-1.5 rounded-pill bg-current" />
                  On this
                </span>
              </span>

              <span className="mt-2 block text-[14px] leading-[1.55] text-quiet">
                {entry.note}
              </span>
            </button>
          );
        })}
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
          <div className="min-w-0 lg:sticky lg:top-[calc(var(--nav-height)+24px)] lg:max-h-[calc(100svh-var(--nav-height)-48px)] lg:self-start lg:overflow-y-auto lg:pr-3">
            <Spine step={step} answers={answers} onGo={setStep} />
          </div>

          <div className="min-w-0">
            <PhaseBar step={step} />
            <Step at={step} answers={answers} onGo={setStep} onGoKey={goKey} />
          </div>

          {/* Held to the screen and scrolled inside itself, rather than being
              as tall as the answer happens to be. A panel taller than the
              window stops following you down the page at the exact moment the
              page gets long enough to need it.

              Only from `xl`, where it is a third column. Below that it sits
              under the questions as ordinary content, and capping the height of
              something already in the flow would put a second scrollbar in the
              middle of the page for no reason. */}
          <div className="min-w-0 xl:sticky xl:top-[calc(var(--nav-height)+24px)] xl:max-h-[calc(100svh-var(--nav-height)-48px)] xl:self-start xl:overflow-y-auto xl:pr-3">
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
