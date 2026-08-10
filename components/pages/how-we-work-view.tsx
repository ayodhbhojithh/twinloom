import { ArrowUpRight, CalendarClock } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { STOPS, ZONES } from "@/lib/journey";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   How we work.

   Three cut surfaces, one per zone, in the shapes the rest of the site is
   built from: the zone's numeral standing in the bite at the bottom left, its
   range of steps in the notch at the top, and the way on in the corner cut at
   the bottom right. A page about how a company works that looks unlike the
   company's own work is arguing against itself.

   Nothing is drawn with a border. The site says a thing is a surface by giving
   it a colour and cutting its outline, never by ruling a box round it - and a
   page that mixes the two reads as two design systems. The only line left on
   this page is the rail the steps hang off, which is the one place a line is
   carrying meaning rather than making an edge.

   The accordions are gone with the borders. Three panels that each opened and
   shut needed a control, a state and a rule between them, and what it bought
   was a shorter page nobody had asked for: the whole claim here is that you
   can see the run before committing to any of it, and hiding two thirds of it
   behind a plus sign argues the other way.
--------------------------------------------------------------------------- */

/**
 * The gradient each zone's numeral carries, from Docs/Engagement Process.html.
 *
 * One ramp across the three: it starts where this page's green already sits
 * and arrives at the site's blue, which is what makes the three read as one
 * run rather than as three coloured tiles.
 */
const RAMP = [
  { from: "#10b981", to: "#06b6d4" },
  { from: "#06b6d4", to: "#3b82f6" },
  { from: "#3b82f6", to: "#8b5cf6" },
] as const;

/**
 * The one line under a zone's name.
 *
 * Short on purpose, and the count comes from the data rather than from the
 * words, so a step added to a zone cannot leave this saying five.
 */
const HOW_MANY = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];

const ZONE_LINE: Record<string, string> = {
  start: "and you start here",
  build: "scope agreed up front, delivered in milestones",
  after: "chosen rather than assumed, and priced separately",
};

export function HowWeWorkView() {
  return (
    <>
      {/* The head, on the centre line every surface below it shares. */}
      <section className="page-frame pt-10 pb-10 text-center sm:pt-14">
        {/* No kicker over it. The nav item that got somebody here says "How we
            work", the tab says it, and a third copy directly above a headline
            that means the same thing is the page introducing itself twice. */}
        <h1 className="section-head mx-auto max-w-[22ch] text-ink">
          How we
          <span className="text-quiet"> Work.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-[70ch] text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-quiet">
          The same run of {STOPS.length} steps for every project. What changes
          between them is what happens inside a step, never which steps there
          are - so you can see the whole of it before you have committed to any
          of it.
        </p>
      </section>

      {/* The three zones, each on a surface of its own. */}
      <section className="page-frame flex flex-col gap-4 pb-14">
        {ZONES.map((zone, at) => {
          const ramp = RAMP[at] ?? RAMP[RAMP.length - 1];
          const first = zone.stops[0]?.ix;
          const last = zone.stops[zone.stops.length - 1]?.ix;
          const opening = at === 0;

          return (
            <CutPanel
              key={zone.key}
              tone="field"
              className="w-full"
              toolbar={
                <span className="flex h-10 w-full items-center justify-center gap-2.5">
                  <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                    Zone {at + 1}
                  </span>
                  <span
                    className="font-mono text-[9px] font-bold tracking-[0.16em] uppercase tabular-nums"
                    style={{ color: ramp.to }}
                  >
                    Steps {first} - {last}
                  </span>
                </span>
              }
              /* The numeral, standing in the bite.

                 A disc, like every other thing that stands in a cut on this
                 site - the arrows on the landing card, the way on in the
                 corner, the marks on the rail below. A rounded square was one
                 shape the site does not otherwise use, sitting inside a cut
                 whose own corners are round.

                 It is the feature of the page: everything else is ink and
                 grey, which is what lets one object on each surface carry the
                 colour. */
              aside={
                <div
                  aria-hidden
                  className="flex size-[52px] items-center justify-center rounded-pill text-[18px] leading-none font-bold tracking-[-0.02em] text-white tabular-nums"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${ramp.from}, ${ramp.to})`,
                  }}
                >
                  {String(at + 1).padStart(2, "0")}
                </div>
              }
              corner={
                <Link
                  href={opening ? ROUTES.book : ROUTES.build}
                  aria-label={
                    opening ? "Book a meeting" : "Build your website"
                  }
                  title={opening ? "Book a meeting" : "Build your website"}
                  className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
                >
                  <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
                </Link>
              }
            >
              <div className="mx-auto mt-6 max-w-[70rem]">
                <div className="text-center">
                  <h2 className="mx-auto max-w-[24ch] text-[clamp(21px,2vw,28px)] leading-[1.12] font-extrabold tracking-[-0.035em] text-ink">
                    {zone.n}
                  </h2>
                  <p className="mx-auto mt-2 max-w-[58ch] text-[13.5px] leading-[1.55] text-quiet">
                    {HOW_MANY[zone.stops.length - 1] ?? zone.stops.length} steps,{" "}
                    {ZONE_LINE[zone.key]}
                  </p>
                </div>

                {/* The steps, and beside the first zone the way into it.

                    The card used to stand above all three, which read as
                    though booking a call applied to the whole run. It is a way
                    into step one, so it belongs to step one. */}
                <div
                  className={cn(
                    "mt-9 gap-10",
                    opening &&
                      "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]",
                  )}
                >
                  {/* One line on the page, and it is the rail.

                      Drawn in the zone's own gradient rather than in the
                      hairline grey, and faded to nothing at both ends. A rule
                      that starts and stops abruptly reads as a border somebody
                      forgot to finish; one that arrives and leaves reads as a
                      run passing through - which is the claim the page makes,
                      that these thirteen are one thing and not three lists.

                      The marks sit on it with a ring of the surface's own
                      white, so the line breaks cleanly at each rather than
                      running under a disc that happens to be opaque. */}
                  <div className="relative">
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-[16px] hidden w-0.5 rounded-pill sm:block"
                      style={{
                        backgroundImage: `linear-gradient(180deg, transparent 0%, ${ramp.from} 14%, ${ramp.to} 72%, transparent 100%)`,
                      }}
                    />

                    <ol>
                      {zone.stops.map((stop, n) => (
                        <li
                          key={stop.ix}
                          className="relative flex flex-col items-start gap-x-7 gap-y-1.5 py-3 sm:flex-row sm:items-baseline"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "relative z-10 flex h-[34px] w-[34px] shrink-0 grow-0 basis-[34px] items-center justify-center self-start rounded-pill text-[13px] font-bold text-white tabular-nums",
                              stop.mark === "launch" ? "" : "bg-ink",
                            )}
                            style={{
                              /* The gap the line breaks at. A ring of the
                                 surface's own colour rather than a margin,
                                 because the rail is positioned and a margin
                                 would not move it. */
                              boxShadow: "0 0 0 5px var(--color-field)",
                              ...(stop.mark === "launch"
                                ? {
                                    backgroundImage: `linear-gradient(135deg, ${ramp.from}, ${ramp.to})`,
                                  }
                                : {}),
                            }}
                          >
                            {n + 1}
                          </span>

                          <b className="min-w-0 text-[15.5px] leading-[1.35] font-bold tracking-[-0.018em] text-ink sm:w-[240px] sm:shrink-0 sm:grow-0">
                            {stop.n}
                          </b>

                          {/* No duration column. Two of the thirteen steps
                              have one, so eleven rows carried an empty track
                              on the right and the two that did not read as an
                              annotation floating in the margin. What a step
                              takes is a thing to say in the conversation it
                              belongs to, not a column. */}
                          <span className="min-w-0 grow text-[13.5px] leading-[1.6] text-quiet">
                            {stop.sub}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {opening ? (
                    <aside className="mt-8 flex flex-col items-start gap-3 self-start rounded-[18px] bg-canvas p-6 lg:mt-0">
                      <span
                        aria-hidden
                        className="flex size-10 items-center justify-center rounded-pill bg-field text-ink"
                      >
                        <CalendarClock className="size-[18px]" strokeWidth={1.9} />
                      </span>

                      <b className="mt-1 text-[15.5px] leading-[1.25] font-extrabold tracking-[-0.025em] text-ink">
                        Get us involved from the start
                      </b>

                      <p className="text-[13px] leading-[1.6] text-quiet">
                        Not sure yet what it looks like? Book a call and we work
                        the requirements out with you. Nothing is priced and
                        nothing is committed.
                      </p>

                      <Link
                        href={ROUTES.book}
                        className="group/go mt-1 inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
                      >
                        Book a meeting
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
                        />
                      </Link>
                    </aside>
                  ) : null}
                </div>
              </div>
            </CutPanel>
          );
        })}
      </section>

    </>
  );
}
