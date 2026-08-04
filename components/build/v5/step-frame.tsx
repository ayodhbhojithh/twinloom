"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { ASSUMPTIONS, STEPS } from "@/lib/build/v5";
import { cn } from "@/lib/utils";

import { Kicker, StopNote } from "./parts";

/* ---------------------------------------------------------------------------
   One step, and the same furniture on every one of them.

   The phase it belongs to and whether it can be skipped at the top, the
   question in the middle, what it needs before you can stop at the bottom, and
   the same three controls under that. Twelve steps that each drew their own
   would be twelve chances for one of them to be missing the skip.
--------------------------------------------------------------------------- */

export function StepFrame({
  at,
  needs = "Nothing.",
  showBack,
  children,
  onGo,
}: {
  at: number;
  /** What this step needs before somebody can stop at it. */
  needs?: string;
  /** What the finished site shows back because of this step. */
  showBack?: string;
  children: React.ReactNode;
  onGo: (at: number) => void;
}) {
  const step = STEPS[at];
  const phase = step.ph;
  const phaseName =
    phase === "shape" ? "Your shape" : phase === "detail" ? "Your detail" : "Sending it";

  const first = at === 0;
  const last = at === STEPS.length - 1;

  return (
    <section
      aria-labelledby={`st-${step.k}-heading`}
      className="min-w-0 rounded-[14px] border border-border bg-field p-6 sm:p-8"
    >
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Kicker>{phaseName}</Kicker>
        <span
          className={cn(
            "rounded-pill px-2.5 py-1 font-mono text-[9.5px] font-bold tracking-[0.14em] uppercase",
            step.can ? "bg-well text-quiet" : "bg-ink text-white",
          )}
        >
          {step.can ? "Optional" : "Required"}
        </span>
      </div>

      <h2
        id={`st-${step.k}-heading`}
        className="text-[26px] leading-[1.12] font-extrabold tracking-[-0.03em] text-ink sm:text-[32px] lg:text-[36px]"
      >
        {step.n}
      </h2>

      {children}

      {showBack ? (
        <div className="mt-8 max-w-measure rounded-card bg-well p-5">
          <Kicker className="mb-2 block">What we show back</Kicker>
          <p className="text-[15px] leading-[1.6] text-quiet">{showBack}</p>
        </div>
      ) : null}

      <StopNote needs={needs} />

      {/* The way on, and what each way costs.

          "Continue" and "Back" are the two least useful words a wizard can put
          on its own controls: they say a direction and nothing about where it
          goes. Naming the step on each one turns the footer into the answer to
          the question somebody actually has, which is "what is next".

          And the skip says what skipping writes down. The site's whole promise
          is that a step walked past becomes a sentence in your own document
          rather than a hole, so the sentence is printed on the control that
          does it. Nobody should have to take that on trust when the words are
          sitting in the data. */}
      <div className="-mx-6 mt-9 border-t border-border px-6 pt-5 sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {!first ? (
            <button
              type="button"
              onClick={() => onGo(at - 1)}
              className="group/back flex h-11 cursor-pointer items-center gap-3 rounded-field border border-border px-3.5 text-left transition-colors hover:bg-well"
            >
              <ArrowLeft
                aria-hidden
                className="size-[18px] flex-none text-label transition-transform group-hover/back:-translate-x-0.5"
              />
              <span className="min-w-0">
                <Kicker className="block">Back</Kicker>
                <span className="mt-1 block text-[14px] leading-[1.2] font-semibold text-ink">
                  {STEPS[at - 1].n}
                </span>
              </span>
            </button>
          ) : (
            <span />
          )}

          {!last ? (
            <button
              type="button"
              onClick={() => onGo(at + 1)}
              className="group/next flex h-11 cursor-pointer items-center gap-3 rounded-field border border-ink bg-ink px-3.5 text-left transition-opacity hover:opacity-85"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[10.5px] font-bold tracking-[0.16em] text-white/50 uppercase">
                  Next
                </span>
                <span className="mt-1 block text-[14px] leading-[1.2] font-semibold text-white">
                  {STEPS[at + 1].n}
                </span>
              </span>
              <ArrowRight
                aria-hidden
                className="size-[18px] flex-none text-white transition-transform group-hover/next:translate-x-0.5"
              />
            </button>
          ) : null}
        </div>

        {step.can && !last ? (
          <p className="mt-4 max-w-measure text-[13.5px] leading-[1.55] text-quiet">
            <button
              type="button"
              onClick={() => onGo(at + 1)}
              className="cursor-pointer font-semibold text-ink underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:decoration-ink"
            >
              Skip this step
            </button>
            {ASSUMPTIONS[step.k]
              ? ` and we write down: ${ASSUMPTIONS[step.k]}`
              : " and nothing is written down, because there is nothing here to answer."}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** The standfirst under a step's title. */
export function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 mb-6 max-w-measure text-[17px] leading-[1.55] text-ink sm:text-[18.5px]">
      {children}
    </p>
  );
}

/** Body copy inside a step. */
export function Say({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-measure text-[16px] leading-[1.65] text-body [&>b]:font-semibold [&>b]:text-ink">
      {children}
    </p>
  );
}
