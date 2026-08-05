import { ArrowUpRight, Handshake } from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { PartnerWall } from "@/components/pages/partners-view";
import { HOW_WE_WORK } from "@/lib/build/v5-work";
import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   About us.

   Built out of the shapes the rest of the site is built out of - one cut
   surface at the top, and everything under it a plain column - rather than
   invented for this page. A page about how a company works that looks unlike
   the company's own work is arguing against itself.

   Nothing here is made up. The thirteen steps are the same list the submit
   screen shows, so what somebody reads here and what they are told after
   pressing send cannot disagree; the partner wall is the partners page's own.
   What is not written down anywhere yet - who does the work, by name - is
   marked as missing rather than filled with plausible people.
--------------------------------------------------------------------------- */

/** What we will not do. Said plainly, because it is the useful half. */
const WONT = [
  {
    n: "Build a diary you can buy",
    sub: "Bookings, shops and calendars are solved. We connect to one rather than write another and charge you for it.",
  },
  {
    n: "Price it before we understand it",
    sub: "A number given in the first conversation is a guess with a decimal point in it. The scope comes first, and it costs nothing.",
  },
  {
    n: "Score you, or grade what you sent",
    sub: "There is no bar and no percentage anywhere in the run-through. An answer you left is written down as an assumption you can correct.",
  },
  {
    n: "Keep the work where you cannot reach it",
    sub: "The domain, the words and the pictures are yours. Nothing is held to keep you.",
  },
];

export function AboutView() {
  return (
    <PageShell>
      {/* The head, on the surface every working screen here is drawn on. */}
      <CutPanel
        className="w-full"
        image="/partners/arch.png"
        aside={
          <div className="flex size-full flex-col items-center justify-center">
            <b className="font-mono text-[22px] leading-none font-bold text-ink tabular-nums">
              13
            </b>
            <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
              Steps
            </span>
          </div>
        }
        corner={
          <Link
            href={ROUTES.build}
            aria-label="Build your website"
            title="Build your website"
            className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
          >
            <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
          </Link>
        }
      >
        <div className="max-w-[52ch]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            About us
          </p>

          <h1 className="mt-3 max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            We write it down first.
          </h1>

          <p className="mt-4 text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
            {SITE.description}
          </p>
        </div>
      </CutPanel>

      {/* How we work: the same thirteen steps the submit screen shows, so the
          page and the process cannot drift apart. Numbered down the left, which
          is the only ordering a sequence needs. */}
      <section className="mt-14">
        <h2 className="max-w-[22ch] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
          How we work, in the order it happens.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-quiet">
          Thirteen steps, and the same thirteen you are shown the moment you
          send anything. Nothing here is a stage we invented for a page about
          ourselves.
        </p>

        <ol className="mt-7 flex flex-col">
          {HOW_WE_WORK.map((step) => (
            <li
              key={step.ix}
              className="grid gap-x-5 gap-y-1 border-t border-hair py-4 sm:grid-cols-[auto_minmax(0,1fr)]"
            >
              <span
                className={cn(
                  "font-mono text-[10px] font-bold tabular-nums",
                  step.state === "here" ? "text-mark" : "text-idx",
                )}
              >
                {step.ix}
              </span>

              <div className="min-w-0">
                <b className="block max-w-[46ch] text-[15.5px] leading-[1.3] font-bold tracking-[-0.015em] text-ink">
                  {step.n}
                </b>
                <p className="mt-1 max-w-[72ch] text-[13.5px] leading-[1.6] text-quiet">
                  {step.sub}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* What we will not do. On cut surfaces of their own, because each one is
          a position rather than a line in a list. */}
      <section className="mt-16">
        <h2 className="max-w-[24ch] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
          What we will not do.
        </h2>
        <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-quiet">
          Which matters as much as the rest of it, and is the part most pages
          like this leave out.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {WONT.map((entry) => (
            <div
              key={entry.n}
              className="rounded-[18px] bg-canvas p-5 transition-colors hover:bg-canvas-firm"
            >
              <b className="block max-w-[24ch] text-[15.5px] leading-[1.25] font-extrabold tracking-[-0.02em] text-ink">
                {entry.n}
              </b>
              <p className="mt-2 max-w-[46ch] text-[13.5px] leading-[1.6] text-quiet">
                {entry.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The partners, borrowed from their own page rather than restated. */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div className="min-w-0">
            <h2 className="max-w-[26ch] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
              Specialists are part of the build.
            </h2>
            <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-quiet">
              Named in the proposal before the work starts, on one contract and
              one invoice. Most projects need none of them.
            </p>
          </div>

          <Link
            href={ROUTES.partners}
            className="group/all inline-flex flex-none items-center gap-2 rounded-pill bg-canvas px-4.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            <Handshake aria-hidden className="size-4" strokeWidth={1.9} />
            How partners work
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
            />
          </Link>
        </div>

        <PartnerWall className="mt-7" />
      </section>
    </PageShell>
  );
}
