"use client";

import { useState } from "react";
import { ChevronsLeftRight, ChevronsRightLeft } from "lucide-react";

import { cn } from "@/lib/utils";

import { LiveMockup } from "../mockup";
import { ScopeTable } from "../scope-table";
import { EstimateStack, MobileEstimateBar } from "../summary";

/**
 * Layout 9b, the Anatomy Lanes. The scope folds into a left rail, the mock-up
 * takes centre stage and the numbers keep a slim column of their own.
 *
 * The widen control only exists at xl, because that is the only width where the
 * rail is narrow enough to be worth widening. Below it the rail is full width
 * and already has room for every description.
 */
export function LanesLayout() {
  const [wide, setWide] = useState(false);

  return (
    <div className="rounded-card border border-hairline bg-surface px-4 pt-5 pb-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
      <header>
        <h3 className="text-[22px] font-extrabold tracking-[-0.02em] sm:text-[26px]">
          Every option on the left, the site takes centre stage
        </h3>
        <p className="mt-1.5 max-w-[680px] text-[13.5px] text-ink-3">
          The same nested scope, folded into a left rail. The mock-up gets the
          room and the price keeps a slim column of its own. Widen the rail when
          you want every option&rsquo;s description on screen.
        </p>
      </header>

      <div className="mt-4 flex flex-col gap-4 lg:mt-[18px] xl:flex-row xl:items-stretch">
        <div
          className={cn(
            "order-2 min-w-0 xl:order-1 xl:shrink-0 xl:transition-[width] xl:duration-[350ms] xl:ease-[var(--ease-out-soft)]",
            wide ? "xl:w-[486px]" : "xl:w-[318px]",
          )}
        >
          <ScopeTable
            density="compact"
            descriptionClassName={wide ? undefined : "xl:hidden"}
            label="Scope"
            className="h-full bg-canvas"
            scrollerClassName="max-h-[58svh] xl:max-h-[660px]"
            action={
              <button
                type="button"
                onClick={() => setWide((value) => !value)}
                aria-pressed={wide}
                className="hidden items-center gap-1.5 rounded-lg border border-hairline bg-surface px-2.5 py-1.5 font-mono text-[9.5px] font-semibold tracking-[0.08em] text-ink-3 uppercase transition-colors hover:bg-canvas xl:inline-flex"
              >
                {wide ? (
                  <ChevronsRightLeft aria-hidden className="size-3" />
                ) : (
                  <ChevronsLeftRight aria-hidden className="size-3" />
                )}
                {wide ? "Narrow" : "Widen"}
              </button>
            }
          />
        </div>

        <div className="order-1 min-w-0 xl:order-2 xl:flex-1">
          <div className="h-full rounded-card border border-hairline bg-canvas p-4">
            <LiveMockup
              variant="stage"
              label="The site, live mock-up"
              hint="click any block to show it in the scope"
            />
          </div>
        </div>

        <EstimateStack className="order-3 xl:order-3 xl:w-[236px] xl:shrink-0" />
      </div>

      <MobileEstimateBar hideFrom="xl" />

      <p className="mt-4 font-mono text-[10px] leading-[1.6] tracking-[0.04em] text-ink-6">
        One scope, shared. Tick in either layout and both follow. Ticked options
        flow straight into the &ldquo;what is included&rdquo; list in your plan.
      </p>
    </div>
  );
}
