"use client";

import { LiveMockup } from "../mockup";
import { ScopeTable } from "../scope-table";
import { EstimateCard, MobileEstimateBar } from "../summary";

/**
 * Layout 9a, the Living Blueprint. The table is the editor and takes the room;
 * the mock-up and the estimate follow every tick from a column on the right.
 *
 * Below lg the three parts unstack in the order that keeps the tool usable on a
 * phone: wireframe first for context, then the table, then the full estimate,
 * with the running total pinned to the bottom of the viewport.
 */
export function BlueprintLayout() {
  return (
    <div className="rounded-card border border-hairline bg-canvas px-4 pt-5 pb-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          <h3 className="text-[22px] font-extrabold tracking-[-0.02em] sm:text-[26px]">
            The whole scope, <span className="text-brand">on one table</span>
          </h3>
          <span className="font-mono text-[10.5px] tracking-[0.04em] text-ink-5">
            section, component, option. Every line explained. Options are
            features, not tiers.
          </span>
        </div>
        <p className="font-script text-[20px] leading-tight text-ink-3 sm:text-[22px]">
          no pop-ups. Tick any mix, and the mock-up and the estimate follow
        </p>
      </header>

      <div className="mt-4 flex flex-col gap-4 lg:mt-[18px] lg:flex-row lg:items-start lg:gap-[22px]">
        <ScopeTable
          className="order-2 min-w-0 lg:order-1 lg:flex-1"
          scrollerClassName="max-h-[58svh] lg:max-h-[640px]"
        />

        {/* `contents` lets these two order themselves against the table on
            mobile, then become a real column at lg. */}
        <div className="contents lg:order-2 lg:flex lg:w-[400px] lg:shrink-0 lg:flex-col lg:gap-3">
          <div className="order-1 rounded-card border border-hairline bg-surface p-4 lg:order-none">
            <LiveMockup variant="rail" />
          </div>
          <EstimateCard className="order-3 lg:order-none" />
        </div>
      </div>

      <MobileEstimateBar hideFrom="lg" />

      <p className="mt-4 font-mono text-[10px] leading-[1.6] tracking-[0.04em] text-ink-6">
        Defaults are pre ticked from your scoping answers, not hardcoded. Untick
        a whole component and it reads &ldquo;not included&rdquo;, and its block
        fades out of the mock-up.
      </p>
    </div>
  );
}
