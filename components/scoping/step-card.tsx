"use client";

import { ArrowLeft } from "lucide-react";

import { AssetAudit } from "./asset-audit";
import { BudgetField } from "./budget-field";
import { FocusPanel } from "./focus-panel";
import { OptionRow } from "./option-row";
import { useScopingSession } from "./scoping-context";

/**
 * The questions for the section in play.
 *
 * Groups are separated by a hairline rather than each being boxed. Four bordered
 * cards holding bordered rows holding bordered checkboxes is three levels of
 * outline for one list of choices, and it reads as scaffolding rather than as
 * questions. The only outlines left on this column belong to the options
 * themselves, which are the things you actually click.
 *
 * Below lg the focus panel is rendered inline, directly under the group whose
 * option is focused. On a wide screen it has its own column instead, so the list
 * never moves when something opens.
 */
export function StepCard() {
  const { step, applies, goTo, focus, answers, setFree } = useScopingSession();

  if (!applies) {
    return (
      <div className="rounded-card bg-panel-bg p-5 sm:p-6">
        <p className="text-[14px] leading-[1.6] text-body">
          Nothing to size here yet. This section only applies if you are selling
          online, so skip it, or go back and add a shop.
        </p>

        <button
          type="button"
          onClick={() => goTo(2)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-btn-sm px-3.5 py-2 text-[13px] font-semibold ring-1 ring-line ring-inset transition-colors hover:ring-brand/45"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Add an online shop
        </button>
      </div>
    );
  }

  if (step.special === "assets") return <AssetAudit />;

  const focusedGroup = focus ? focus.split(":")[0] : null;
  const groups = step.groups ?? [];

  /* Space, not a rule. The gap only exists to separate one block from the one
     above it, so the first thing on the page never gets one. */
  const divider = groups.length ? "mt-8" : undefined;

  return (
    <div className="flex flex-col">
      {groups.map((group, at) => (
        <div
          key={group.key}
          className={at > 0 ? "mt-8" : undefined}
        >
          <div
            role={group.type === "single" ? "radiogroup" : "group"}
            aria-label={group.question}
          >
            <h3 className="text-[14.5px] font-extrabold tracking-[-0.01em]">
              {group.question}
              {group.type === "multi" ? (
                <span className="ml-2 font-mono text-[10px] font-bold tracking-[0.06em] text-faint uppercase">
                  pick any
                </span>
              ) : null}
            </h3>

            {/* Spacing only. No fill, no rule and no shadow between rows, so
                the list is the choices and nothing else. */}
            <div className="mt-2.5 flex flex-col gap-0.5">
              {group.options.map((option) => (
                <OptionRow key={option.value} group={group} option={option} />
              ))}
            </div>
          </div>

          {focusedGroup === group.key ||
          (step.deepen &&
            focus === `${step.deepen.when.key}:${step.deepen.when.value}`) ? (
            <FocusPanel className="mt-3 lg:hidden" />
          ) : null}
        </div>
      ))}

      {step.special === "budget" ? (
        <div className={divider}>
          <BudgetField />
        </div>
      ) : null}

      {step.special === "free" ? (
        <div className={divider}>
          <label
            htmlFor="scoping-free"
            className="text-[14.5px] font-extrabold tracking-[-0.01em]"
          >
            Anything unusual or specific
          </label>

          <textarea
            id="scoping-free"
            value={answers.free}
            onChange={(event) => setFree(event.target.value)}
            rows={5}
            placeholder="Calculators, integrations, a member area, a quirk of how you work. Anything at all."
            className="field-sizing-content mt-3 max-h-72 min-h-32 w-full resize-none rounded-btn-sm bg-panel-bg p-3.5 text-[13.5px] leading-[1.6] outline-none transition-shadow ring-inset placeholder:text-faint focus:ring-1 focus:ring-brand/40"
          />
        </div>
      ) : null}
    </div>
  );
}
