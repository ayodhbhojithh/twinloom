import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Our partners.

   Built on the arrangement home v6 uses: everything on one axis down the
   middle, and a row of words drifting underneath it so a centred page has a
   second direction to read in. A column of centred text finishes and stops;
   something crossing beneath it gives the eye somewhere to go.

   What it does not do is name people we have not agreed to name. Every
   discipline here is one a build genuinely reaches for, and each says what the
   specialist covers rather than who they are - because a page of invented
   partner logos is a lie about credentials, not a placeholder.
--------------------------------------------------------------------------- */

/**
 * How far below the top each card hangs, in order.
 *
 * Set by hand rather than generated, exactly as the landing wall sets it. A row
 * of cards all on one line is a contact sheet; the same row with each card hung
 * at its own height is a wall, and which card sits where is a composition
 * rather than a random number.
 */
const HANG = [48, 0, 30, 66, 14, 54];

const DISCIPLINES = [
  {
    n: "01",
    plate: "/work-investor.png",
    name: "Brand and identity",
    covers:
      "A mark, its type, its colours and the rules for using them. We apply a brand you already have; where one has to be made, this is who makes it.",
    when: "Where the brand cannot carry the site it is being asked to carry.",
  },
  {
    n: "02",
    plate: "/work-shop.png",
    name: "Photography and film",
    covers:
      "A shot list built from the page designs, the day itself, the selection and the licensing record afterwards.",
    when: "Where pictures of the actual business would do more than anything from a library.",
  },
  {
    n: "03",
    plate: "/work-trade.png",
    name: "Copywriting",
    covers:
      "Interviews with the people who know the business, then drafts, revisions and copy prepared for approval.",
    when: "Where the words have to be written rather than edited.",
  },
  {
    n: "04",
    plate: "/work-careers.png",
    name: "Accessibility audit",
    covers:
      "Testing beyond our own: assistive technology, and where the scope calls for it, testing with disabled people.",
    when: "Where a written conformance position has to stand up to scrutiny.",
  },
  {
    n: "05",
    plate: "/right-image.png",
    name: "Search and paid media",
    covers:
      "Demand research, campaign structure, measurement, and the ongoing work of it after launch.",
    when: "Where search matters commercially and the opportunity justifies continued spend.",
  },
  {
    n: "06",
    plate: "/work-investor.png",
    name: "Regulated and legal review",
    covers:
      "Review of claims, terms and notices by somebody qualified to sign them off.",
    when: "Where a claim on the page carries a legal weight we are not qualified to carry.",
  },
] as const;

const RULES = [
  "One contract, and it is with us.",
  "One invoice, and it comes from us.",
  "Named in the proposal before the work starts.",
  "Briefed and reviewed inside the project, not beside it.",
  "Their part of the result is our responsibility.",
  "Where they handle personal data, they are listed as a sub-processor.",
] as const;

export function PartnersView() {
  const drift = [
    ...DISCIPLINES.map((entry) => entry.name),
    "One contract",
    "One invoice",
    "Named in advance",
  ];

  return (
    <>
      {/* One axis down the middle, as v6 has it. */}
      <section className="page-frame pt-4 pb-10 text-center">
        <h1 className="mx-auto max-w-[24ch] text-[clamp(32px,4.6vw,68px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-balance text-ink">
          Specialists are part of the build.
          <span className="text-quiet"> Never an extra line on it.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[68ch] text-[16.5px] leading-[1.65] text-quiet sm:text-[18px]">
          Some work is led by somebody who does that one thing all day. When a
          project needs it, we say so in the proposal, brief them inside the
          work and stay responsible for what comes back. You deal with us
          throughout.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={ROUTES.build}
            className="group inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Build your website
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href={ROUTES.book}
            className="group inline-flex items-center gap-2 rounded-pill bg-field px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            Talk it through
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* The disciplines, drifting. Full bleed, so they leave the page rather
          than stopping at a margin - which is what lets the row have no edges
          without anything faded over them. */}
      <div aria-hidden className="overflow-hidden py-2">
        <div className="drift flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {drift.map((word, index) => (
                <span
                  key={`${copy}-${word}-${index}`}
                  className="flex items-center gap-10 px-10 text-[19px] font-semibold whitespace-nowrap text-planned sm:text-[22px]"
                >
                  {word}
                  <span className="text-hair">&middot;</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="page-frame pt-10 pb-16">
        {/* What each one covers, as a wall that drifts past.

            The same arrangement the work uses on the landing page: one track
            holding the run twice and shifting by exactly half its width, so the
            loop has no seam and no gap, and each card hung at its own height so
            the row reads as a wall rather than as a contact sheet. It stops
            under the pointer, because a card nobody can hold still is a card
            nobody can read. */}
        {/* Clipped to this column, not to the window.

            The usual full bleed trick - a negative margin of `50vw - 50%` -
            assumes the content is centred in the viewport. Every page but the
            landing one carries the rail, so it is not: the wall escaped to the
            left and ran underneath the sidebar. Running off the edges of the
            column says the same thing and is true on both kinds of page. */}
        <div className="group -mx-4 overflow-hidden px-4 py-3 sm:-mx-6 sm:px-6">
          <div className="drift drift-slow flex w-max gap-4 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 gap-4"
              >
                {DISCIPLINES.map((entry, index) => (
                  <article
                    key={`${copy}-${entry.n}`}
                    style={{ marginTop: HANG[index % HANG.length] }}
                    className="group/card flex w-[clamp(260px,24vw,330px)] shrink-0 flex-col overflow-hidden rounded-[20px] bg-field transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    {/* The picture first, and faded out into the card rather
                        than stopped by an edge. A photograph with a hard bottom
                        line is a photograph stuck on a card; faded, the card is
                        one thing that happens to begin as a picture. */}
                    <span className="relative block aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={entry.plate}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 70vw, 330px"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-[1.05]"
                        style={{
                          /* Curved rather than linear, and over most of the
                             lower half: a short straight fade reads as a band
                             with an edge at each end, which is the one thing a
                             blend must not have. */
                          maskImage:
                            "linear-gradient(to bottom, black 34%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,0.72) 62%, rgba(0,0,0,0.44) 76%, rgba(0,0,0,0.18) 88%, transparent 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, black 34%, rgba(0,0,0,0.92) 48%, rgba(0,0,0,0.72) 62%, rgba(0,0,0,0.44) 76%, rgba(0,0,0,0.18) 88%, transparent 100%)",
                        }}
                      />

                      <span className="absolute top-3 left-3 flex size-7 items-center justify-center rounded-pill bg-field/85 font-mono text-[10px] font-bold text-ink backdrop-blur-sm tabular-nums">
                        {entry.n}
                      </span>
                    </span>

                    <h2 className="-mt-3 px-5 max-w-[18ch] text-[17px] leading-[1.2] font-extrabold tracking-[-0.028em] text-ink">
                      {entry.name}
                    </h2>

                    <p className="mt-2.5 px-5 text-[13.5px] leading-[1.6] text-body">
                      {entry.covers}
                    </p>

                    <p className="mt-auto flex gap-2.5 px-5 pt-4 pb-5 text-[12.5px] leading-[1.5] text-quiet">
                      <span
                        aria-hidden
                        className="mt-[7px] size-1 flex-none rounded-pill bg-mark"
                      />
                      {entry.when}
                    </p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* How a partner is handled, on the surface the site uses for the thing
            a page is about. */}
        <CutPanel
          tone="field"
          className="mt-4 w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              What you are agreeing to
            </span>
          }
          corner={
            <Link
              href={ROUTES.build}
              aria-label="Build your website"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          <h2 className="max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(21px,2.1vw,30px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
            You deal with us, whoever does the work.
          </h2>

          <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.6] text-quiet">
            A specialist joining a project changes who does a piece of it. It
            does not change who you have an agreement with, who invoices you, or
            who answers when something is wrong.
          </p>

          <ul className="mt-6 grid max-w-[76ch] gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {RULES.map((rule) => (
              <li key={rule} className="flex gap-2.5">
                <Check
                  aria-hidden
                  className="mt-[4px] size-3.5 flex-none text-mark"
                  strokeWidth={3}
                />
                <span className="text-[14px] leading-[1.55] text-body">
                  {rule}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-[64ch] text-[12.5px] leading-[1.6] text-label">
            Most projects need none of this. A specialist is added because the
            work justifies one, not to make the team look larger than it is.
          </p>
        </CutPanel>
      </section>
    </>
  );
}
