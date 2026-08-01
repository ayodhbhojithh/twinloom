"use client";

import {
  Btn,
  EmptyPill,
  Kicker,
  PROMISES,
  ROUTES,
  SITE,
  Stage,
  splitTagline,
} from "./shared";

/**
 * 04. Ruled.
 *
 * Ruled paper. The lines run the full width at the rhythm of a line of text,
 * and the claim is written across them, so the page looks like the thing this
 * company sells: something written down.
 *
 * The rules fade out at the top and bottom rather than stopping, which is what
 * keeps it from reading as a table.
 */
export function V04Ruled() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="justify-center py-8">
      <div
        aria-hidden
        className="ruled pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(180deg,transparent,#000_16%,#000_84%,transparent)]"
      />

      <Kicker>Home</Kicker>

      <h1 className="mt-8 max-w-[18ch] text-[clamp(34px,5.2vw,74px)] leading-[1.12] font-extrabold tracking-[-0.045em] text-ink">
        {claim}
        <span className="text-active"> {promise}</span>
      </h1>

      <p className="mt-9 max-w-[52ch] text-[17px] leading-[1.6] text-body sm:text-[18.5px]">
        {SITE.description}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Btn href={ROUTES.build} variant="primary" size="large">
          Build your website
        </Btn>
        <Btn href={ROUTES.book} size="large">
          Book a meeting
        </Btn>
      </div>

      {/* A margin rule down the left of the foot, as ruled paper has. */}
      <div className="mt-auto flex items-end gap-6 pt-12">
        <span aria-hidden className="h-16 w-px shrink-0 bg-blocked/25" />

        <div className="flex flex-1 flex-wrap items-end justify-between gap-6">
          <ul className="flex flex-wrap items-baseline gap-x-10 gap-y-2">
            {PROMISES.map((promise) => (
              <li
                key={promise}
                className="text-[16px] font-semibold text-ink"
              >
                {promise}
              </li>
            ))}
          </ul>

          <EmptyPill />
        </div>
      </div>
    </Stage>
  );
}
