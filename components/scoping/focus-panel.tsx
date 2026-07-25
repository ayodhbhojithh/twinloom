"use client";

import { Check } from "lucide-react";

import { Rise } from "@/components/shared";
import {
  dialEffort,
  dialKey,
  EFFORT_GENERIC,
  findOption,
  optionEffort,
  optionKey,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { EffortCard } from "./effort-card";
import { EffortSlider } from "./effort-slider";
import { useScopingSession } from "./scoping-context";

function Shell({
  label,
  title,
  className,
  children,
}: {
  label: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Rise
      y={-8}
      /* A fill, not an outline. It is already the only tinted block in its
         column, which is enough to say it is a different kind of thing. */
      className={cn("rounded-card bg-soft/60 p-5", className)}
    >
      <p className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-brand uppercase">
        {label}
      </p>
      <h3 className="mt-1.5 text-[16px] font-extrabold tracking-[-0.01em]">
        {title}
      </h3>
      {children}
    </Rise>
  );
}

/**
 * The detail for whatever was just clicked: what it means, and how far to push it.
 *
 * It opens inline directly under the question rather than in a far column, so it
 * appears where the eye already is and behaves identically on a phone. The parent
 * only mounts it when something in that question is focused, so it never has a
 * nothing-selected state to render.
 */
export function FocusPanel({ className }: { className?: string }) {
  const { step, answers, focus, deepen, choose, isChosen } =
    useScopingSession();

  if (!focus) return null;

  /* The redesign path opens a block of its own: what is driving it, then one
     slider per area, so each can be pushed independently. */
  if (
    deepen &&
    step.deepen &&
    focus === `${step.deepen.when.key}:${step.deepen.when.value}`
  ) {
    const { drivers, dials } = step.deepen;

    return (
      <Shell label="Focused" title="Redesign" className={className}>
        <p className="mt-2 text-[13px] leading-[1.6] text-body">
          Tell us what is driving it, then push each area as far as you like.
        </p>

        <p className="mt-5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-faint uppercase">
          {drivers.question}
        </p>

        <div className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
          {drivers.options.map((driver) => {
            const on = isChosen(drivers.key, driver.value, "multi");

            return (
              <button
                key={driver.value}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => choose(drivers.key, driver.value, "multi")}
                className={cn(
                  "flex w-full items-start gap-2 rounded-btn-sm px-2.5 py-2 text-left transition-all",
                  on
                    ? "bg-card ring-1 ring-brand/40 ring-inset"
                    : "bg-card/55 hover:bg-card",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-px flex size-4 shrink-0 items-center justify-center rounded-[5px] border-[1.5px]",
                    on
                      ? "border-brand bg-brand text-white"
                      : "border-faint/55 text-transparent",
                  )}
                >
                  <Check className="size-2.5" strokeWidth={3.5} />
                </span>

                <span className="min-w-0 flex-1 text-[12.5px] leading-[1.4]">
                  <span className="font-bold">{driver.label}</span>{" "}
                  <span className="text-faint">{driver.desc}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-5 font-mono text-[9.5px] font-bold tracking-[0.1em] text-faint uppercase">
          How far to push each area
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {dials.map((dial) => (
            <EffortCard
              key={dial.key}
              effortKey={dialKey(dial.key)}
              value={dialEffort(answers, dial.key)}
              explain={dial.explain}
              label={dial.label}
            />
          ))}
        </div>
      </Shell>
    );
  }

  const [groupKey, optionValue] = focus.split(":");
  const found = findOption(groupKey, optionValue);
  if (!found) return null;

  const { group, option } = found;

  return (
    <Shell
      label={`Focused · ${group.question.replace(/\?$/, "")}`}
      title={option.label}
      className={className}
    >
      <div className="mt-3">
        <EffortSlider
          effortKey={optionKey(group.key, option.value)}
          value={optionEffort(answers, group.key, option)}
          explain={option.explain ?? EFFORT_GENERIC}
          label={option.label}
        />
      </div>
    </Shell>
  );
}
