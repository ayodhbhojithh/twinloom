"use client";

import { Container, Eyebrow } from "@/components/shared";
import { STEP_COUNT } from "@/lib/scoping";

import { ActionBar } from "./action-bar";
import { DialReadout } from "./dial-readout";
import { EffortDial } from "./effort-dial";
import { MiniProgress } from "./mini-progress";
import { ScopingProvider, useScopingSession } from "./scoping-context";
import { StepCard } from "./step-card";
import { StepList } from "./step-list";

function Journey() {
  const { step, index, applies } = useScopingSession();

  return (
    <>
      <MiniProgress />

      <Container className="pt-3 pb-4 sm:pt-4">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8">
          {/* Orientation. Sticky from lg up, so the dial, the readout and the
              section list stay put while the questions scroll past them. Its own
              height is capped to the viewport and scrolls internally, so a long
              readout can never push the list out of reach. */}
          <aside className="hidden lg:sticky lg:top-[calc(var(--nav-height)+20px)] lg:block lg:max-h-[calc(100svh-var(--nav-height)-40px)] lg:overflow-y-auto">
            <div className="rounded-card border border-line bg-card p-4">
              <EffortDial className="w-full" />

              <div className="mt-5 border-t border-line pt-4">
                <DialReadout />
              </div>
            </div>

            <div className="mt-3 rounded-card border border-line bg-card p-3">
              <p className="px-2 pb-2 font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
                The eight sections
              </p>
              <StepList />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <Eyebrow tone="faint">Scope your website</Eyebrow>

              <p className="font-mono text-[10.5px] font-bold tracking-[0.08em] text-faint uppercase tabular-nums">
                Section {index + 1} of {STEP_COUNT}
              </p>
            </div>

            {/* Keyed on the step, so moving section replays the enter animation
                rather than swapping the text in place. */}
            <div
              key={step.key}
              className="animate-in duration-400 fade-in slide-in-from-bottom-2"
            >
              <h1 className="mt-3 text-[22px] font-extrabold tracking-[-0.02em] text-balance sm:text-[27px]">
                {step.heading}
              </h1>

              <p className="mt-2 max-w-[680px] text-[14px] leading-[1.6] text-body">
                {applies
                  ? step.lead
                  : "Only applies if you chose an online shop. Skip it, or go back and add one."}
              </p>

              <div className="mt-5">
                <StepCard />
              </div>
            </div>
          </div>
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
 * Three zones rather than the artifact's two. A sticky rail on the left holds the
 * dial, the readout and the section list, so orientation never scrolls away. The
 * questions get the whole middle. The focus panel opens inline directly under
 * whatever was clicked, rather than in a third column, because that is where the
 * eye already is and it works identically on a phone.
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
