"use client";

import { Check } from "lucide-react";

import { money, type ScopeOption } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

interface OptionRowProps {
  option: ScopeOption;
  /**
   * Extra classes for the description line. The lanes rail passes `xl:hidden`
   * so descriptions drop away only once the rail is genuinely narrow.
   */
  descriptionClassName?: string;
}

/**
 * One tickable line. Options are features, not tiers: any mix within a
 * component is valid, which is why these are checkboxes and not radios.
 */
export function OptionRow({ option, descriptionClassName }: OptionRowProps) {
  const { isOptionTicked, toggleOption } = useScope();
  const ticked = isOptionTicked(option.id);

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={ticked}
      onClick={() => toggleOption(option.id, option.componentId)}
      className="flex w-full items-start gap-2.5 rounded-[9px] px-2 py-1.5 transition-colors hover:bg-sunken"
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-tick border-[1.5px] transition-all duration-150",
          ticked
            ? "border-[var(--scope-accent)] bg-[var(--scope-accent)] text-white"
            : "border-tick-border bg-surface text-transparent",
        )}
      >
        <Check className="size-2.5" strokeWidth={3.5} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span
          className={cn(
            "text-[13px] transition-all duration-150",
            ticked ? "font-bold text-ink" : "font-medium text-ink-3",
          )}
        >
          {option.name}
        </span>
        <span
          className={cn(
            "mt-px text-[11.5px] leading-[1.4] text-ink-4",
            descriptionClassName,
          )}
        >
          {option.description}
        </span>
      </span>

      <span
        className={cn(
          "mt-[3px] shrink-0 font-mono text-[11px] tabular-nums transition-all duration-150",
          ticked ? "font-semibold text-ink" : "font-normal text-ink-6",
        )}
      >
        {money(option.price)}
      </span>
    </button>
  );
}
