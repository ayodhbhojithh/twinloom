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

import { lit, litTick } from "./lit";
import { useScopingSession } from "./scoping-context";

/**
 * One choice, on one line: the label, then what it means beside it.
 *
 * Nothing on this row is outlined, chosen or not. Unchosen is a flat soft fill;
 * chosen lights up in the effort's own colour (see `lit`). Colouring by effort
 * rather than by brand purple is what ties the row to the dial: a heavy choice
 * glows amber here and burns amber out there, and the two are the same fact
 * rendered twice.
 *
 * The chevron only appears on the row whose detail is open. It points at the panel
 * that detail is in, which is the one thing a fill cannot say.
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
      style={chosen ? lit(colour) : undefined}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-btn-sm px-3 py-2.5 text-left transition-all duration-300",
        !chosen && "bg-panel-bg hover:bg-soft/70",
      )}
    >
      <span
        aria-hidden
        style={chosen ? litTick(colour) : undefined}
        className={cn(
          "mt-px flex size-[17px] shrink-0 items-center justify-center transition-all duration-300",
          group.type === "single" ? "rounded-full" : "rounded-[5px]",
          chosen
            ? "text-white"
            : "bg-white text-transparent ring-1 ring-faint/35 ring-inset",
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
          className="mt-0.5 flex shrink-0 items-center gap-0.5 font-mono text-[9.5px] font-bold tracking-[0.06em] tabular-nums"
          style={{ color: colour }}
          title={`Effort ${effort} out of 10`}
        >
          {effort}
          {focused ? (
            <ChevronRight aria-hidden className="size-3" strokeWidth={3} />
          ) : null}
        </span>
      ) : null}
    </button>
  );
}
