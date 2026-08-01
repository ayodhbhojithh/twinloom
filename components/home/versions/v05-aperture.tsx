"use client";

import {
  Btn,
  EmptyPill,
  ROUTES,
  SITE,
  Stage,
  splitTagline,
} from "./shared";

/**
 * 05. Aperture.
 *
 * A window drawn in the middle of the screen with the claim deliberately too
 * big for it, so the second half of the sentence breaks out over the edge. The
 * window is what we promise to give you; the type running past it is the point
 * that a scope is a beginning and not a boundary.
 *
 * The overflow has to be real, which is why the heading is not inside the box:
 * it is a sibling laid over it, so nothing clips and nothing has to be nudged
 * back into place.
 */
export function V05Aperture() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="items-center justify-center py-10">
      <div className="relative flex w-full max-w-[62rem] items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 -z-10 h-[clamp(220px,34vw,400px)] -translate-y-1/2 rounded-[26px] border border-border bg-well/60"
        />

        <div className="w-full px-4 py-10 sm:px-10">
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
            Home
          </p>

          <h1 className="mt-6 max-w-[16ch] text-[clamp(34px,5.4vw,80px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
            {claim}
            <span className="block text-active">{promise}</span>
          </h1>
        </div>
      </div>

      <div className="mt-10 w-full max-w-[62rem] px-4 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <p className="max-w-[50ch] text-[16.5px] leading-[1.55] text-body sm:text-[18px]">
            {SITE.description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Btn href={ROUTES.build} variant="primary" size="large">
              Build your website
            </Btn>
            <Btn href={ROUTES.book} size="large">
              Book a meeting
            </Btn>
          </div>
        </div>

        <EmptyPill className="mt-8" />
      </div>
    </Stage>
  );
}
