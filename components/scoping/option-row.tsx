"use client";

import { Check } from "lucide-react";

import { effortRag, optionEffort, RAG_COLOUR, type ScopeGroup, type ScopeOption } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/**
 * One choice, on one line: the label, then what it means beside it.
 *
 * Chosen options carry a small effort dot in their RAG colour, which is the only
 * hint on this side of the screen that effort exists. The detail and the slider
 * live in the focus panel, so the list stays scannable.
 *
 * Single choice groups get a round box, multi choice a square, which is the same
 * convention as a radio and a checkbox without either being nested in a button.
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

  return (
    <button
      type="button"
      role={group.type === "single" ? "radio" : "checkbox"}
      aria-checked={chosen}
      onClick={() => choose(group.key, option.value, group.type)}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-btn-sm border px-3 py-2.5 text-left transition-all",
        chosen
          ? "border-brand/45 bg-soft"
          : "border-line bg-card hover:border-brand/30 hover:bg-soft/50",
        focused && "ring-2 ring-brand/25",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-px flex size-[17px] shrink-0 items-center justify-center border-[1.5px] transition-all",
          group.type === "single" ? "rounded-full" : "rounded-[5px]",
          chosen
            ? "border-brand bg-brand text-white"
            : "border-faint/55 bg-card text-transparent",
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
          className="mt-1.5 size-2 shrink-0 rounded-full"
          style={{ background: RAG_COLOUR[effortRag(effort)] }}
        />
      ) : null}
    </button>
  );
}
