"use client";

import { Container, Rise } from "@/components/shared";
import { STEP_COUNT } from "@/lib/scoping";

import { ActionBar } from "./action-bar";
import { DetailColumn } from "./detail-column";
import { DialReadout } from "./dial-readout";
import { EffortDial } from "./effort-dial";
import { MiniProgress } from "./mini-progress";
import { ScopingProvider, useScopingSession } from "./scoping-context";
import { StepCard } from "./step-card";
import { StepSwitcher } from "./step-switcher";

function Journey() {
  const { step, index, applies } = useScopingSession();

  return (
    <>
      <MiniProgress />

      <Container className="pt-3 pb-4 sm:pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-faint uppercase">
            Scope your website
          </p>

          <p className="font-mono text-[10.5px] font-bold tracking-[0.1em] text-faint uppercase tabular-nums">
            Step {index + 1} / {STEP_COUNT}
          </p>
        </div>

        {/* The stage. The dial is the thing people come to this page for, so it
            gets the full width and the top of the page rather than a sidebar.
            One soft slab, no outline: the fill is what groups it, which keeps the
            page from reading as a stack of boxes.

            Three zones, in the order the eye needs them. The dial is the shape of
            the whole brief, the readout says what the section in play amounts to,
            and the section list is how you move. Same information, three levels of
            zoom, none of it in a different place on the page. */}
        <div className="mt-3 grid gap-6 rounded-[22px] bg-panel-bg p-4 sm:p-5 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)_minmax(0,264px)] lg:gap-7 lg:p-6 xl:grid-cols-[minmax(0,290px)_minmax(0,1fr)_minmax(0,290px)] xl:gap-8">
          <EffortDial className="mx-auto w-full max-w-[210px] sm:max-w-[240px] xl:max-w-[290px] lg:self-center" />

          <div className="lg:self-center">
            <DialReadout />
          </div>

          <StepSwitcher />
        </div>

        {/* Questions left, detail right. Neither is a card: the left column sits
            on the page and the right one is a soft fill, so the only outlines on
            this screen belong to things you can actually click. */}
        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,470px)]">
          <div className="min-w-0">
            {/* Keyed on the step, so moving section replays the spring rather
                than swapping the text in place. */}
            <Rise key={step.key} y={12}>
              <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-brand uppercase">
                {step.kicker}
              </p>

              <h1 className="mt-2 text-[21px] font-extrabold tracking-[-0.02em] text-balance sm:text-[25px]">
                {step.heading}
              </h1>

              <p className="mt-2 max-w-[640px] text-[14px] leading-[1.6] text-body">
                {applies
                  ? step.lead
                  : "Only applies if you chose an online shop. Skip it, or go back and add one."}
              </p>

              <div className="mt-5">
                <StepCard />
              </div>
            </Rise>
          </div>

          <DetailColumn />
        </div>

        {/* Sits inside the container so the island sticks while the journey is
            on screen and scrolls away with it, rather than floating over the
            footer. */}
        <ActionBar />
      </Container>
    </>
  );
}

/**
 * The scoping journey, from TCT_Scope_Spec.md §2.
 *
 * Orientation across the top, work underneath. The stage is one wide slab holding
 * the dial, the readout for the section in play, and the list of all eight; below
 * it the questions take the width they need and their detail sits beside them.
 *
 * Nothing here asks for a page count or a site size: both are derived from the
 * answers and confirmed in the Blueprint.
 */
export function ScopingJourney() {
  return (
    <ScopingProvider>
      <Journey />
    </ScopingProvider>
  );
}
