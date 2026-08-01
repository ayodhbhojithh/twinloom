"use client";

import {
  Btn,
  EmptyPill,
  ROUTES,
  SITE,
  Stage,
  Tape,
  splitTagline,
} from "./shared";

const EDGE = ["The Very Good Website Company", "A written scope in your words"];

/**
 * 10. Frame.
 *
 * The claim held in the middle of a ruled frame, with a band of type running
 * along the top and the bottom of it. It is the most formal of the ten: nothing
 * is loose, everything is enclosed, and the sentence sits in the middle of it
 * like a plate in a book.
 *
 * The centre is centred here on purpose, and it is the only version where that
 * is true. A frame with its contents ranged left would read as a frame somebody
 * had put the wrong thing in.
 */
export function V10Frame() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="py-6">
      <div className="flex min-h-0 flex-1 flex-col border border-border">
        <Tape words={EDGE} className="shrink-0 border-x-0 border-t-0" />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-12">
          <span className="font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
            Home
          </span>

          <h1 className="mx-auto mt-7 max-w-[17ch] text-[clamp(34px,5.2vw,74px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-balance text-ink">
            {claim}
            <span className="text-active"> {promise}</span>
          </h1>

          <span
            aria-hidden
            className="mt-8 block h-px w-16 bg-planned"
          />

          <p className="mx-auto mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-body sm:text-[18.5px]">
            {SITE.description}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Btn href={ROUTES.build} variant="primary" size="large">
              Build your website
            </Btn>
            <Btn href={ROUTES.book} size="large">
              Book a meeting
            </Btn>
          </div>

          <EmptyPill className="mt-9" />
        </div>

        <Tape
          words={EDGE}
          reverse
          slow
          className="shrink-0 border-x-0 border-b-0"
        />
      </div>
    </Stage>
  );
}
