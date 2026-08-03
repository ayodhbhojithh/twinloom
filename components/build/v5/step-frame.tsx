"use client";

import { STEPS } from "@/lib/build/v5";
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
    <section aria-labelledby={`st-${step.k}-heading`} className="min-w-0">
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

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hair pt-6">
        {!first ? (
          <button
            type="button"
            onClick={() => onGo(at - 1)}
            className="cursor-pointer rounded-field bg-well px-5 py-3 text-[15px] font-semibold text-quiet transition-colors hover:bg-hair hover:text-ink"
          >
            Back
          </button>
        ) : null}

        {!last ? (
          <button
            type="button"
            onClick={() => onGo(at + 1)}
            className="cursor-pointer rounded-field bg-ink px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Continue
          </button>
        ) : null}

        {/* Skipping is the same move as continuing, and it is drawn as a
            different one on purpose. Nothing is recorded either way: what
            separates them is that a step you touched is answered and a step you
            walked past becomes an assumption, and that is decided by the
            questions, not by which button was pressed. */}
        {step.can && !last ? (
          <button
            type="button"
            onClick={() => onGo(at + 1)}
            className="cursor-pointer text-[14.5px] font-semibold text-quiet underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
          >
            Skip this step
          </button>
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
