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
import { RouteMap } from "./route-map";
import { Spine } from "./spine";
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
      {/* Two ways in.

          The picture came first and that was the mistake: a thread of knots
          says how long each route is, but it does not say that either of them
          is a thing you press. So the row leads with the one control everybody
          already reads as "pick one of these" - a radio - and the thread sits
          under the words as what it always was, the difference between them
          drawn rather than described.

          No instruction over it. Two radios side by side already say a choice
          is being asked for, and the line under them says what pressing one
          does and does not change. */}
      <div className="max-w-wide">
        {/* Both on one row, and two lines deep. Stacked, they were a list
            of two things to read; side by side they are one question with two
            answers, which is what they are. */}
        <div
          role="radiogroup"
          aria-label="How you want to do this"
          className="grid overflow-hidden rounded-card border border-border sm:grid-cols-2"
        >
          {(
            [
              {
                key: "quick",
                knots: 1,
                title: "Quick submission",
                length: "One step",
                note: "Say it in your own words and send it. A few minutes.",
              },
              {
                key: "full",
                knots: STEPS.length,
                title: "Detailed scoping",
                length: `${STEPS.length} steps`,
                note: "Answer as much as you like and read it back.",
              },
            ] as const
          ).map((entry) => {
            const on = tab === entry.key;

            return (
              <button
                key={entry.key}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTab(entry.key)}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3.5 border-t border-border px-5 py-4 text-left transition-colors first:border-t-0 sm:border-t-0 sm:border-l sm:first:border-l-0",
                  on ? "bg-ink" : "bg-hair hover:bg-planned",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-px flex size-[19px] flex-none items-center justify-center rounded-pill border-2 transition-colors",
                    on ? "border-white" : "border-planned",
                  )}
                >
                  <span
                    className={cn(
                      "size-[9px] rounded-pill transition-colors",
                      on ? "bg-white" : "bg-transparent",
                    )}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                    <b
                      className={cn(
                        "text-[15.5px] leading-[1.2] font-bold",
                        on ? "text-white" : "text-ink",
                      )}
                    >
                      {entry.title}
                    </b>

                    <span
                      className={cn(
                        "font-mono text-[9.5px] font-bold tracking-[0.12em] uppercase tabular-nums",
                        on ? "text-white/55" : "text-idx",
                      )}
                    >
                      {entry.length}
                    </span>

                    {/* Last on the line, and only as long as it needs to be.
                        Held inside a fixed box, one knot left three quarters of
                        it empty and pushed its label somewhere the other row's
                        label never went. Trailing, the two threads start at
                        different points and end at different points, which is
                        the comparison rather than a broken alignment. */}
                    <span aria-hidden className="flex items-center gap-[7px]">
                      {Array.from({ length: entry.knots }, (_, n) => (
                        <span
                          key={n}
                          className={cn(
                            "size-[6px] flex-none rounded-pill transition-colors",
                            on ? "bg-white/70" : "bg-planned",
                          )}
                        />
                      ))}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "mt-1.5 block text-[13.5px] leading-[1.5]",
                      on ? "text-white/65" : "text-quiet",
                    )}
                  >
                    {entry.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
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
            <RouteMap step={step} onGo={setStep} />
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
