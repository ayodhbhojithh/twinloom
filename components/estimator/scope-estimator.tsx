"use client";

import { LiveMockup } from "./mockup";
import { PortalGrid } from "./portal-grid";
import { ScopeProvider } from "./scope-context";
import { ScopeTable } from "./scope-table";
import { EstimateCard, MobileEstimateBar } from "./summary";

/**
 * The estimator, as one scope shared by three views.
 *
 * The circles are the friendly way in: one tap adds or drops a whole component.
 * The detail table is where a specific mix of options gets chosen. The wireframe
 * shows what the site becomes, and clicking a block jumps the table to that
 * component's row. Everything reads and writes the same selection, so no view
 * can disagree with another.
 */
export function ScopeEstimator() {
  return (
    <ScopeProvider>
      <PortalGrid />

      <div className="mt-5 grid gap-5 lg:mt-[22px] lg:grid-cols-[1.45fr_1fr] lg:items-start lg:gap-[22px]">
        <ScopeTable
          label="The detail"
          hint="tick any mix · options are features, not tiers"
          className="min-w-0"
          scrollerClassName="max-h-[58svh] lg:max-h-[620px]"
        />

        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-card border border-hairline bg-surface p-4 sm:p-5">
            <LiveMockup variant="rail" />
          </div>

          <EstimateCard />
        </div>
      </div>

      <MobileEstimateBar hideFrom="lg" />
    </ScopeProvider>
  );
}
