"use client";

import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

const MIN = 1000;
const MAX = 25000;
const STEP = 500;

/**
 * The soft budget. Optional and skippable by design (TCT_Scope_Spec.md §2.7):
 * a required budget question makes people guess or leave.
 *
 * "Rather not say" is stored as null rather than as a number, so the engine can
 * tell a declined answer from a low one.
 */
export function BudgetField() {
  const { answers, setBudget } = useScopingSession();

  const declined = answers.budget === null;
  const value = answers.budget ?? 5000;
  const filled = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="rounded-card border border-line bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[14px] font-bold">
          Budget comfort{" "}
          <span className="ml-1 rounded-pill bg-soft px-2 py-0.5 font-mono text-[9.5px] font-bold tracking-[0.06em] text-brand uppercase">
            soft · optional
          </span>
        </h3>

        <span
          className={cn(
            "text-[20px] font-extrabold tabular-nums",
            declined && "text-[15px] font-bold text-faint tabular-nums",
          )}
        >
          {declined ? "Rather not say" : `£${value.toLocaleString("en-GB")}`}
        </span>
      </div>

      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        disabled={declined}
        aria-label="Budget comfort"
        onChange={(event) => setBudget(Number(event.target.value))}
        className="range-slider mt-4 w-full text-brand disabled:opacity-40"
        style={{
          background: declined
            ? "var(--color-line)"
            : `linear-gradient(to right, var(--color-brand) 0%, var(--color-brand) ${filled}%, var(--color-line) ${filled}%, var(--color-line) 100%)`,
        }}
      />

      <div className="mt-1.5 flex justify-between font-mono text-[10px] tracking-[0.06em] text-faint">
        <span>£1k</span>
        <span>£25k or more</span>
      </div>

      <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-[13px] font-medium text-body">
        <input
          type="checkbox"
          checked={declined}
          onChange={(event) => setBudget(event.target.checked ? null : 5000)}
          className="size-4 accent-brand"
        />
        Rather not say
      </label>
    </div>
  );
}
