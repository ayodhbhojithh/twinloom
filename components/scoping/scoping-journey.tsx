"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Container, Eyebrow } from "@/components/shared";
import { STEP_COUNT } from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { DialReadout } from "./dial-readout";
import { EffortDial } from "./effort-dial";
import { FocusPanel } from "./focus-panel";
import { ScopingProvider, useScopingSession } from "./scoping-context";
import { StepCard } from "./step-card";
import { StepRail } from "./step-rail";

function Journey() {
  const { step, index, applies, isFirst, isLast, next, back } =
    useScopingSession();

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Eyebrow tone="faint">Scope your website</Eyebrow>

        <p className="font-mono text-[11px] font-bold tracking-[0.08em] text-faint uppercase tabular-nums">
          Step {index + 1} of {STEP_COUNT}
        </p>
      </div>

      <div className="mt-4">
        <StepRail />
      </div>

      {/* The dial and its readout: side by side from sm up, stacked below, and the
          dial never grows past the point where it stops being readable. */}
      <div className="mt-6 flex flex-col items-center gap-6 rounded-card border border-line bg-card p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
        <EffortDial className="w-[220px] shrink-0 sm:w-[248px] lg:w-[268px]" />

        <div className="min-w-0 flex-1">
          <DialReadout />
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em] sm:text-[26px]">
          {step.heading}
        </h1>

        <p className="mt-2 max-w-[720px] text-[14.5px] leading-[1.6] text-body">
          {applies
            ? step.lead
            : "Only applies if you chose an online shop. Skip it, or go back and add one."}
        </p>
      </div>

      {/* Questions and the focus panel. The panel becomes a sticky column at xl;
          below that StepCard renders it inline under the focused question. */}
      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)] xl:items-start">
        <StepCard />

        <div className="hidden xl:sticky xl:top-[calc(var(--nav-height)+16px)] xl:block">
          <FocusPanel />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={back}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 rounded-btn-sm border border-line bg-card px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:border-brand/40 hover:bg-soft disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back
        </button>

        <button
          type="button"
          onClick={next}
          disabled={isLast}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-btn-sm bg-brand px-4 py-2.5 text-[13.5px] font-bold text-white shadow-cta transition-all hover:-translate-y-px hover:shadow-cta-hover",
            isLast && "pointer-events-none opacity-40",
          )}
        >
          {isLast ? "Build my blueprint" : "Next"}
          <ArrowRight aria-hidden className="size-3.5" />
        </button>

        {!applies ? (
          <button
            type="button"
            onClick={next}
            className="text-[13px] font-semibold text-brand underline-offset-4 hover:underline"
          >
            Skip this
          </button>
        ) : null}
      </div>

      {isLast ? (
        <p className="mt-4 max-w-[720px] text-[12.5px] leading-[1.6] text-faint">
          The Blueprint is the next thing to build: it takes these answers and
          shows the sitemap, the component scope, the price band and the timeline
          worked out from them.
        </p>
      ) : null}
    </Container>
  );
}

/**
 * The scoping journey, from TCT_Scope_Spec.md §2.
 *
 * Eight sections, one at a time, with the effort dial above and a panel on the
 * right that reacts to whatever is clicked. Nothing here asks for a page count or
 * a site size: those are derived and confirmed in the Blueprint.
 */
export function ScopingJourney() {
  return (
    <ScopingProvider>
      <Journey />
    </ScopingProvider>
  );
}
