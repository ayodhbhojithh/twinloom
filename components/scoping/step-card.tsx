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
 * Below xl the focus panel is rendered inline, directly under the group whose
 * option is focused. A sticky side panel is right on a wide screen and useless on
 * a phone, so the same component gets two mount points and CSS picks.
 */
export function StepCard() {
  const { step, applies, goTo, focus, answers, setFree } = useScopingSession();

  if (!applies) {
    return (
      <div className="rounded-card border border-line bg-card p-5 sm:p-6">
        <p className="text-[14px] leading-[1.6] text-body">
          Nothing to size here yet. This section only applies if you are selling
          online, so skip it, or go back and add a shop.
        </p>

        <button
          type="button"
          onClick={() => goTo(2)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-btn-sm border border-line bg-card px-3.5 py-2 text-[13px] font-semibold transition-colors hover:border-brand/40 hover:bg-soft"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Add an online shop
        </button>
      </div>
    );
  }

  if (step.special === "assets") {
    return (
      <div className="rounded-card border border-line bg-card p-5 sm:p-6">
        <AssetAudit />
      </div>
    );
  }

  const focusedGroup = focus ? focus.split(":")[0] : null;

  return (
    <div className="flex flex-col gap-4">
      {(step.groups ?? []).map((group) => (
        <div key={group.key}>
          <div
            className="rounded-card border border-line bg-card p-5 sm:p-6"
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

            <div className="mt-3 flex flex-col gap-1.5">
              {group.options.map((option) => (
                <OptionRow key={option.value} group={group} option={option} />
              ))}
            </div>
          </div>

          {focusedGroup === group.key ||
          (step.deepen && focus === `${step.deepen.when.key}:${step.deepen.when.value}`) ? (
            <FocusPanel className="mt-3" />
          ) : null}
        </div>
      ))}

      {step.special === "budget" ? <BudgetField /> : null}

      {step.special === "free" ? (
        <div className="rounded-card border border-line bg-card p-5 sm:p-6">
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
            className="field-sizing-content mt-3 max-h-72 min-h-32 w-full resize-none rounded-btn-sm border border-line bg-card p-3 text-[13.5px] leading-[1.6] outline-none transition-colors placeholder:text-faint focus:border-brand"
          />
        </div>
      ) : null}
    </div>
  );
}
