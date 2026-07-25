"use client";

import { Check, MousePointerClick } from "lucide-react";

import {
  dialEffort,
  dialKey,
  EFFORT_GENERIC,
  findOption,
  optionEffort,
  optionKey,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "rounded-card border border-line bg-card p-5 sm:p-6",
        className,
      )}
    >
      <p className="font-mono text-[10px] font-bold tracking-[0.12em] text-faint uppercase">
        {label}
      </p>
      <h3 className="mt-1.5 text-[17px] font-extrabold tracking-[-0.01em]">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * The reacting panel. Whatever was clicked on the left opens here, on its own, so
 * there is one thing to read and one slider to move rather than a wall of them.
 *
 * On a wide screen it is a sticky column. Below that it is rendered inline, right
 * under the question the focused option belongs to, because a side panel that has
 * scrolled off screen is not a panel.
 */
export function FocusPanel({ className }: { className?: string }) {
  const { step, answers, focus, deepen, choose, isChosen } =
    useScopingSession();

  if (step.special === "assets") {
    return (
      <Shell label="Detail" title="What you've got" className={className}>
        <p className="mt-2.5 text-[13px] leading-[1.6] text-body">
          These tell us what to provide. Every no adds the matching help to your
          brief, so there is nothing to tune here.
        </p>
      </Shell>
    );
  }

  if (step.special === "budget" || step.special === "free") {
    return (
      <Shell label="Detail" title={step.kicker} className={className}>
        <p className="mt-2.5 text-[13px] leading-[1.6] text-body">
          Fill this in on the left. It feeds your brief directly.
        </p>
      </Shell>
    );
  }

  /* The redesign path opens a block of its own: what is driving it, then one
     slider per area so the client can push each independently. */
  if (deepen && step.deepen && focus === `${step.deepen.when.key}:${step.deepen.when.value}`) {
    const { drivers, dials } = step.deepen;

    return (
      <Shell label="Focused" title="Redesign" className={className}>
        <p className="mt-2.5 text-[13px] leading-[1.6] text-body">
          Tell us what is driving it, then push each area as far as you like.
        </p>

        <p className="mt-5 font-mono text-[10px] font-bold tracking-[0.1em] text-faint uppercase">
          {drivers.question}
        </p>

        <div className="mt-2.5 flex flex-col gap-1.5">
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
                  "flex w-full items-start gap-2.5 rounded-btn-sm border px-3 py-2 text-left transition-all",
                  on
                    ? "border-brand/45 bg-soft"
                    : "border-line bg-card hover:border-brand/30",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-px flex size-[16px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px]",
                    on
                      ? "border-brand bg-brand text-white"
                      : "border-faint/55 text-transparent",
                  )}
                >
                  <Check className="size-2.5" strokeWidth={3.5} />
                </span>

                <span className="min-w-0 flex-1 text-[13px] leading-[1.45]">
                  <span className="font-bold">{driver.label}</span>{" "}
                  <span className="text-faint">{driver.desc}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 font-mono text-[10px] font-bold tracking-[0.1em] text-faint uppercase">
          How far to push each area
        </p>

        <div className="mt-3 flex flex-col gap-5">
          {dials.map((dial) => (
            <div key={dial.key}>
              <h4 className="text-[14px] font-bold">{dial.label}</h4>
              <div className="mt-2">
                <EffortSlider
                  effortKey={dialKey(dial.key)}
                  value={dialEffort(answers, dial.key)}
                  explain={dial.explain}
                  label={dial.label}
                />
              </div>
            </div>
          ))}
        </div>
      </Shell>
    );
  }

  if (!focus) {
    return (
      <Shell label="Detail" title="Nothing focused yet" className={className}>
        <p className="mt-2.5 flex gap-2 text-[13px] leading-[1.6] text-body">
          <MousePointerClick
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-brand"
          />
          Click a choice on the left and it opens here, just that one, so you can
          read what it means and set how far to push it.
        </p>
      </Shell>
    );
  }

  const [groupKey, optionValue] = focus.split(":");
  const found = findOption(groupKey, optionValue);

  if (!found) {
    return (
      <Shell label="Detail" title="Nothing focused yet" className={className}>
        <p className="mt-2.5 text-[13px] leading-[1.6] text-body">
          Click a choice on the left to focus it here.
        </p>
      </Shell>
    );
  }

  const { group, option } = found;

  return (
    <Shell
      label={`Focused · ${group.question.replace(/\?$/, "")}`}
      title={option.label}
      className={className}
    >
      <div className="mt-4">
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
