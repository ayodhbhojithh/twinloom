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
 * 07. Diagonal.
 *
 * The screen cut corner to corner, white above and a pale field below, with one
 * accent hairline along the cut. The claim sits across it, so the sentence
 * spans both halves the way the offer spans both parties.
 *
 * `clip-path` rather than a rotated block: a rotated block has to be oversized
 * and hidden, and its edge softens at the corners. A clip is exact.
 */
export function V07Diagonal() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-well [clip-path:polygon(0_46%,100%_14%,100%_100%,0_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-active/60 [clip-path:polygon(0_46%,100%_14%,100%_calc(14%+1px),0_calc(46%+1px))]"
      />

      <div className="flex flex-1 flex-col justify-center">
        <Kicker>Home</Kicker>

        <h1 className="mt-6 max-w-[17ch] text-[clamp(34px,5.4vw,80px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
          {claim}
          <span className="block text-active">{promise}</span>
        </h1>

        <p className="mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-body sm:text-[18.5px]">
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
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-10 gap-y-4 pt-10">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {PROMISES.map((promise, at) => (
            <li key={promise} className="flex items-center gap-3">
              {at > 0 ? (
                <span aria-hidden className="text-planned">
                  &middot;
                </span>
              ) : null}
              <span className="font-mono text-[10.5px] font-bold tracking-[0.16em] text-quiet uppercase">
                {promise}
              </span>
            </li>
          ))}
        </ul>

        <EmptyPill />
      </div>
    </Stage>
  );
}
