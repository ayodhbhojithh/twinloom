"use client";

import { Check } from "lucide-react";

import {
  effortRag,
  optionEffort,
  RAG_COLOUR,
  type ScopeGroup,
  type ScopeOption,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * One choice, on one line: the label, then what it means beside it.
 *
 * The treatment is 6a's from the design canvas, where a row lights up as it is
 * chosen. A 4px bar down the left edge takes the option's own effort colour, the
 * fill lifts to a barely-there tint of it, and a soft glow of the same colour
 * settles under the row. Unchosen rows are a dashed hairline on near-white, which
 * says "available, not yet picked" without adding another solid outline to the
 * page.
 *
 * Colouring by effort rather than by brand purple is what ties this row to the
 * dial: a heavy choice glows amber here and burns amber out there, and the two are
 * the same fact rendered twice.
 *
 * Single choice groups get a round tick box, multi choice a square, which is the
 * radio and checkbox convention without nesting either inside a button.
 */
export function OptionRow({
  group,
  option,
}: {
  group: ScopeGroup;
  option: ScopeOption;
}) {
  const { answers, isChosen, choose, focus } = useScopingSession();

  const chosen = isChosen(group.key, option.value, group.type);
  const focused = focus === `${group.key}:${option.value}`;
  const effort = optionEffort(answers, group.key, option);
  const colour = RAG_COLOUR[effortRag(effort)];

  return (
    <button
      type="button"
      role={group.type === "single" ? "radio" : "checkbox"}
      aria-checked={chosen}
      onClick={() => choose(group.key, option.value, group.type)}
      style={
        chosen
          ? {
              borderColor: `color-mix(in oklab, ${colour} 40%, transparent)`,
              background: `linear-gradient(180deg, color-mix(in oklab, ${colour} 7%, white), white)`,
              boxShadow: `0 8px 22px -16px color-mix(in oklab, ${colour} 67%, transparent)`,
            }
          : undefined
      }
      className={cn(
        "flex w-full items-stretch gap-3 rounded-btn-sm border p-[3px] pr-3 text-left transition-all duration-200",
        chosen
          ? "border-solid"
          : "border-dashed border-[#cbd2de] bg-[#fafbfc] hover:border-brand/40 hover:bg-white",
        focused && "ring-2 ring-brand/40",
      )}
    >
      {/* The bar is the whole height of the row, so a column of choices reads as a
          set of levels rather than a set of ticks. */}
      <span
        aria-hidden
        style={
          chosen
            ? {
                background: `linear-gradient(180deg, ${colour}, color-mix(in oklab, ${colour} 55%, white))`,
              }
            : undefined
        }
        className={cn(
          "w-[4px] shrink-0 self-stretch rounded-[4px] transition-colors duration-300",
          !chosen && "bg-[#e2e6ec]",
        )}
      />

      <span className="flex min-w-0 flex-1 items-start gap-2.5 py-[7px]">
        <span
          aria-hidden
          style={chosen ? { background: colour, borderColor: colour } : undefined}
          className={cn(
            "mt-px flex size-[17px] shrink-0 items-center justify-center border-[1.5px] transition-all duration-200",
            group.type === "single" ? "rounded-full" : "rounded-[5px]",
            chosen
              ? "text-white"
              : "border-faint/45 bg-white text-transparent",
          )}
        >
          <Check className="size-2.5" strokeWidth={3.5} />
        </span>

        <span className="min-w-0 flex-1 text-[13.5px] leading-[1.45]">
          <span className={cn("font-bold", chosen ? "text-ink" : "text-ink/90")}>
            {option.label}
          </span>{" "}
          <span className="text-faint">{option.desc}</span>
        </span>

        {chosen ? (
          <span
            aria-hidden
            title={`Effort ${effort} out of 10`}
            className="mt-1 font-mono text-[9.5px] font-bold tracking-[0.06em] tabular-nums"
            style={{ color: colour }}
          >
            {effort}
          </span>
        ) : null}
      </span>
    </button>
  );
}
