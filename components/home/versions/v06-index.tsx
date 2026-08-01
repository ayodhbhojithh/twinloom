"use client";

import {
  Btn,
  EmptyPill,
  Kicker,
  ROUTES,
  SITE,
  Stage,
  splitTagline,
} from "./shared";

const ENTRIES = [
  ["01", "One question", "Who your website is for"],
  ["02", "A written scope", "In your own words, not ours"],
  ["03", "Two working days", "From the moment you send it"],
  ["04", "No obligation", "Nothing is fixed until you agree it"],
] as const;

/**
 * 06. Index.
 *
 * The claim on the left and a numbered index of the offer down the right,
 * ruled, with the number, the term and what it means on one line each. It reads
 * like the summary page of a report, which is the register the whole site is
 * written in.
 *
 * The index is the only thing on the page that is a list, so it carries all the
 * detail and the left column can stay a single sentence.
 */
export function V06Index() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="py-8">
      <div className="grid min-h-0 flex-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
        <div className="flex min-w-0 flex-col justify-center">
          <Kicker>Home</Kicker>

          <h1 className="mt-6 max-w-[16ch] text-[clamp(34px,4.8vw,72px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
            {claim}
            <span className="block text-active">{promise}</span>
          </h1>

          <p className="mt-8 max-w-[46ch] text-[16.5px] leading-[1.55] text-body sm:text-[18px]">
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

        <div className="flex min-w-0 flex-col justify-center">
          <dl className="border-t border-ink">
            {ENTRIES.map(([n, term, note]) => (
              <div
                key={n}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-5 gap-y-1 border-b border-hair py-5"
              >
                <span className="row-span-2 font-mono text-[11px] font-bold text-idx tabular-nums">
                  {n}
                </span>
                <dt className="text-[19px] leading-[1.25] font-bold tracking-[-0.018em] text-ink">
                  {term}
                </dt>
                <dd className="text-[15px] leading-[1.5] text-quiet">{note}</dd>
              </div>
            ))}
          </dl>

          <EmptyPill className="mt-7 self-start" />
        </div>
      </div>
    </Stage>
  );
}
