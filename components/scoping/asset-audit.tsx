"use client";

import { ASSETS, type AssetState } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

const CHOICES: { state: AssetState; label: string }[] = [
  { state: "yes", label: "Yes, I have it" },
  { state: "no", label: "No, help me" },
  { state: "unsure", label: "Not sure" },
];

/**
 * Section 2, the asset and gap audit.
 *
 * Three states rather than a checkbox, because "not sure" is a real answer and
 * treating it as a no would quietly pad the brief. Both a no and a not sure add
 * the matching service.
 */
export function AssetAudit() {
  const { answers, setAsset } = useScopingSession();

  return (
    <ul className="flex flex-col gap-2">
      {ASSETS.map((asset, key) => {
        const state = answers.assets[key];

        return (
          <li
            key={asset}
            className="flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <span
              className={cn(
                "text-[13.5px] font-bold transition-colors",
                state ? "text-ink" : "text-body",
              )}
            >
              {asset}
            </span>

            <div
              role="radiogroup"
              aria-label={asset}
              className="flex shrink-0 gap-1.5"
            >
              {CHOICES.map((choice) => {
                const on = state === choice.state;

                return (
                  <button
                    key={choice.state}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setAsset(key, choice.state)}
                    className={cn(
                      "rounded-nav px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-all",
                      on
                        ? "bg-brand text-white"
                        : "text-faint ring-1 ring-line ring-inset hover:text-ink hover:ring-brand/45",
                    )}
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
