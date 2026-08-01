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
 * 01. Arc.
 *
 * One enormous circle, drawn in outline and cropped by three edges of the
 * screen, so what is visible is a single sweeping curve rather than a shape.
 * The claim sits inside its opening.
 *
 * Two strokes, not one: a pale ring for the structure and a thin accent ring
 * just inside it, so the colour reads as a highlight along the curve rather than
 * as a coloured circle.
 */
export function V01Arc() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="justify-center py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[24vw] -bottom-[42vw] -z-10 size-[92vw] rounded-pill border border-border"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[21vw] -bottom-[39vw] -z-10 size-[86vw] rounded-pill border border-active/25"
      />

      <Kicker>Home</Kicker>

      <h1 className="mt-7 max-w-[17ch] text-[clamp(36px,5.6vw,82px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
        {claim}
        <span className="block text-active">{promise}</span>
      </h1>

      <p className="mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-body sm:text-[19px]">
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

      <div className="mt-auto flex flex-wrap items-center gap-x-10 gap-y-3 pt-12">
        <EmptyPill />
        {PROMISES.map((promise) => (
          <span
            key={promise}
            className="font-mono text-[10.5px] font-bold tracking-[0.16em] text-quiet uppercase"
          >
            {promise}
          </span>
        ))}
      </div>
    </Stage>
  );
}
