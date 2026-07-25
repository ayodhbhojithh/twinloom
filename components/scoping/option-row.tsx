"use client";

import { Check, ChevronRight } from "lucide-react";

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
 * No fill, no rule and no shadow, chosen or not. Six rows with six rectangles
 * behind them is six shapes to look at before you read a word. Take all of it away
 * and the list is the choices, held apart by spacing alone.
 *
 * Every signal sits in the tick and the type. The box fills with the option's own
 * effort colour and the label goes from grey to bold ink, which ties the row to the
 * dial: a heavy choice burns amber here and amber out there.
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
      className="group/opt flex w-full items-start gap-2.5 rounded-btn-sm py-2.5 text-left transition-colors"
    >
      <span
        aria-hidden
        style={chosen ? { background: colour } : undefined}
        className={cn(
          "mt-px flex size-[17px] shrink-0 items-center justify-center transition-all duration-300",
          group.type === "single" ? "rounded-full" : "rounded-[5px]",
          chosen
            ? "text-white"
            : "text-transparent ring-1 ring-faint/40 ring-inset group-hover/opt:ring-brand/60",
        )}
      >
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>

      <span className="min-w-0 flex-1 text-[13.5px] leading-[1.45]">
        <span
          className={cn(
            "font-bold transition-colors",
            chosen ? "text-ink" : "text-body group-hover/opt:text-ink",
          )}
        >
          {option.label}
        </span>{" "}
        <span className="text-faint">{option.desc}</span>
      </span>

      {/* Only on the row whose detail is open, pointing at the panel it opened
          in. The effort itself is already in the colour of the tick, so a number
          beside it was the same fact twice. */}
      {focused ? (
        <ChevronRight
          aria-hidden
          className="mt-1 size-3 shrink-0"
          strokeWidth={3}
          style={{ color: colour }}
        />
      ) : null}
    </button>
  );
}
