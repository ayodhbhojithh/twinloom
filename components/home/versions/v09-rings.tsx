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
 * 09. Rings.
 *
 * Concentric outlines spreading from behind the claim, like something dropped
 * in water. It is the quietest device of the ten and the only one that is
 * purely geometric, which makes it the safest to live with for a long time.
 *
 * Six rings at even steps with the accent kept for the innermost two, so the
 * colour lands where the eye already is rather than shouting from the edge.
 */
export function V09Rings() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="justify-center py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[6%] -z-10 -translate-x-1/2 -translate-y-1/2"
      >
        {[0, 1, 2, 3, 4, 5].map((ring) => (
          <span
            key={ring}
            style={{
              width: `${(ring + 1) * 14}vw`,
              height: `${(ring + 1) * 14}vw`,
            }}
            className={[
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-pill border",
              ring < 2 ? "border-active/25" : "border-border",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="lg:pl-[12vw]">
        <Kicker>Home</Kicker>

        <h1 className="mt-6 max-w-[18ch] text-[clamp(36px,5.4vw,78px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
          {claim}
          <span className="block text-active">{promise}</span>
        </h1>

        <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.55] text-body sm:text-[19px]">
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

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-10 gap-y-4 pt-12 lg:pl-[12vw]">
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
