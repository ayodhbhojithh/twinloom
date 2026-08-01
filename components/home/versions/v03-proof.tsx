"use client";

import {
  Btn,
  EmptyPill,
  ROUTES,
  SITE,
  Stage,
  splitTagline,
} from "./shared";

/** A crop mark: two rules meeting at a corner, not touching it. */
function Crop({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const vertical = corner.startsWith("t") ? "top-0" : "bottom-0";
  const horizontal = corner.endsWith("l") ? "left-0" : "right-0";

  return (
    <span aria-hidden className={`absolute ${vertical} ${horizontal} size-8`}>
      <span
        className={`absolute ${horizontal} h-px w-full bg-planned ${
          corner.startsWith("t") ? "top-0" : "bottom-0"
        }`}
      />
      <span
        className={`absolute ${vertical} w-px h-full bg-planned ${
          corner.endsWith("l") ? "left-0" : "right-0"
        }`}
      />
    </span>
  );
}

/**
 * 03. Proof.
 *
 * The page presented as something still being checked: crop marks at the four
 * corners, a registration mark on the centre line, and the job details set as
 * mono along the foot.
 *
 * It is the right register for this site, which says openly that it is a
 * framework rather than a finished thing. Marks rather than a border, so the
 * page is bracketed rather than boxed.
 */
export function V03Proof() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="justify-center px-6 py-10 sm:px-10">
      <Crop corner="tl" />
      <Crop corner="tr" />
      <Crop corner="bl" />
      <Crop corner="br" />

      {/* The registration mark: a ringed cross, as a proof sheet carries. */}
      <span
        aria-hidden
        className="absolute top-8 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-pill border border-planned"
      >
        <span className="absolute h-full w-px bg-planned" />
        <span className="absolute h-px w-full bg-planned" />
      </span>

      <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
        Home / proof / not for issue
      </p>

      <h1 className="mt-8 max-w-[18ch] text-[clamp(34px,5.4vw,78px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
        {claim}
        <span className="text-active"> {promise}</span>
      </h1>

      <p className="mt-8 max-w-[52ch] text-[17px] leading-[1.55] text-body sm:text-[18.5px]">
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

      <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-12">
        <dl className="flex flex-wrap gap-x-12 gap-y-3">
          {[
            ["Job", "The Very Good Website Company"],
            ["Sheet", "Home"],
            ["State", "Draft"],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="font-mono text-[9px] font-bold tracking-[0.18em] text-label uppercase">
                {term}
              </dt>
              <dd className="mt-1.5 font-mono text-[11.5px] font-bold tracking-[0.06em] text-ink uppercase">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <EmptyPill />
      </div>
    </Stage>
  );
}
