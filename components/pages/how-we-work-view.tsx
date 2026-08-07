import { ArrowUpRight, Check, Plus } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { ZONES } from "@/lib/journey";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   How we work.

   Built to the arrangement in Docs/Engagement Process.html, option 5a: a
   vertical list with the title on the left, the detail on the right, and a
   gradient threading the numerals.

   One card holds the whole thing - the head, the two ways in, the rule that
   joins them, and the three zones. Split across separate surfaces they read as
   four unrelated blocks; on one surface they read as one account of how a
   project runs.

   The zones open and close rather than all thirteen steps standing on the page
   at once. Thirteen is the honest answer to "how does this work" and also more
   than anybody reads in one go; three named stretches, each of which can be
   opened, is the same answer at the size somebody actually asks it.

   `details` and `summary` rather than a state hook: they open before the
   JavaScript arrives, the browser's own find-in-page can open them, and they
   are reachable from a keyboard with no code at all.
--------------------------------------------------------------------------- */

/**
 * The gradient each zone's numeral carries, from the reference.
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

/** The two ways in, which join the same process. */
const PATHS = [
  {
    href: ROUTES.book,
    kicker: "Path one - from a blank page",
    n: "Get us involved from the start",
    sub: "You know you need something, but not yet what it looks like. Book a call and we will work the requirements out with you.",
    go: "Book a meeting",
    tint: "#8b5cf6",
    filled: false,
  },
  {
    href: ROUTES.build,
    kicker: "Path two - you have done the groundwork",
    n: "Send us what you have",
    sub: "Already worked out what you need? Write it down on this site and send it, or email us whatever you already have.",
    go: "Start a submission",
    tint: "#06b6d4",
    filled: true,
  },
] as const;

/**
 * The one line under a zone's name.
 *
 * Short on purpose. `zone.note` is a sentence written for a reader who has
 * opened the zone; on the closed summary row it wrapped to two lines and put
 * the numeral, the name and a paragraph on one row. This says how many steps
 * there are and what the stretch is for, and stops.
 *
 * The count comes from the data rather than from the words, so a step added to
 * a zone cannot leave this saying five.
 */
const HOW_MANY = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];

const ZONE_LINE: Record<string, string> = {
  start: "and you start here",
  build: "scope agreed up front, delivered in milestones",
  after: "chosen rather than assumed, and priced separately",
};

/** What holds across all thirteen. */
const RULES = [
  "Nothing is priced until there is a written scope to price.",
  "You sign off each milestone as it lands, not all of it at the end.",
  "Accounts are in your name from the day they are made.",
  "A written record at every stage, so nothing rests on a conversation.",
] as const;

export function HowWeWorkView() {
  return (
    <>
      <section className="page-frame pt-10 pb-12 sm:pt-14">
        <div className="rounded-[24px] border border-hair bg-field p-6 sm:p-9 lg:p-11">
          {/* The head: the line on the left, what it means on the right, both
              on one baseline. */}
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
            <div className="min-w-0">
              <p
                className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
                style={{ color: RAMP[0].to }}
              >
                How we work
              </p>

              <h1 className="mt-3 max-w-[18ch] text-[clamp(26px,3vw,34px)] leading-[1.14] font-extrabold tracking-[-0.03em] text-ink">
                How we normally work
              </h1>
            </div>

            <p className="max-w-[46ch] text-[13.5px] leading-[1.6] text-quiet">
              There are two broad ways in, depending on how far you have got
              with your requirements. Both join the same process, and neither
              commits you to anything.
            </p>
          </div>

          {/* The two ways in. Ruled cards rather than cut surfaces: they are a
              pair of equal choices, and a cut is for a control standing in it -
              these carry theirs on the face. */}
          <div className="mt-9 grid gap-3.5 lg:grid-cols-2">
            {PATHS.map((path) => (
              <div
                key={path.href}
                className="flex flex-col items-start gap-3 rounded-[14px] border border-hair p-6 sm:p-7"
              >
                <p
                  className="font-mono text-[9.5px] font-bold tracking-[0.16em] uppercase"
                  style={{ color: path.tint }}
                >
                  {path.kicker}
                </p>

                <h2 className="max-w-[24ch] text-[20px] leading-[1.3] font-bold tracking-[-0.022em] text-ink">
                  {path.n}
                </h2>

                <p className="max-w-[48ch] text-[13.5px] leading-[1.6] text-quiet">
                  {path.sub}
                </p>

                <Link
                  href={path.href}
                  className={cn(
                    "group/go mt-auto inline-flex items-center gap-2 rounded-[9px] px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-85",
                    path.filled ? "text-white" : "border-[1.5px] bg-field",
                  )}
                  style={
                    path.filled
                      ? {
                          backgroundImage: `linear-gradient(100deg, ${RAMP[0].from}, ${RAMP[0].to})`,
                        }
                      : { borderColor: path.tint, color: path.tint }
                  }
                >
                  {path.go}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* The rule that joins the two. */}
          <div className="mt-7 flex items-center gap-5">
            <span aria-hidden className="h-px flex-1 bg-hair" />
            <span className="text-center font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase">
              From there, the process is the same
            </span>
            <span aria-hidden className="h-px flex-1 bg-hair" />
          </div>

          {/* The three zones, each opening onto its own steps. */}
          <div className="mt-6">
            {ZONES.map((zone, at) => {
              const ramp = RAMP[at] ?? RAMP[RAMP.length - 1];
              const first = zone.stops[0]?.ix;
              const last = zone.stops[zone.stops.length - 1]?.ix;

              return (
                <details
                  key={zone.key}
                  open={at === 0}
                  className="group/zone border-t border-hair"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-5 py-6 sm:gap-6 [&::-webkit-details-marker]:hidden">
                    {/* The numeral, carrying the gradient. It is the feature of
                        this arrangement: everything else on the row is ink and
                        grey, which is what lets one object be coloured. */}
                    <span
                      aria-hidden
                      className="flex size-[62px] flex-none items-center justify-center rounded-[18px] text-[23px] leading-none font-bold tracking-[-0.02em] text-white tabular-nums sm:size-[74px] sm:text-[28px]"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${ramp.from}, ${ramp.to})`,
                        boxShadow: `0 6px 18px color-mix(in oklab, ${ramp.to} 28%, transparent)`,
                      }}
                    >
                      {String(at + 1).padStart(2, "0")}
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <b className="text-[clamp(19px,1.9vw,26px)] leading-[1.15] font-bold tracking-[-0.025em] text-ink">
                        {zone.n}
                      </b>
                      <span className="max-w-[62ch] text-[13px] leading-[1.5] text-quiet">
                        {HOW_MANY[zone.stops.length - 1] ?? zone.stops.length}{" "}
                        steps, {ZONE_LINE[zone.key]}
                      </span>
                    </span>

                    <span
                      className="hidden flex-none font-mono text-[10px] font-bold tracking-[0.14em] uppercase tabular-nums lg:block"
                      style={{ color: ramp.to }}
                    >
                      Steps {first} - {last}
                    </span>

                    {/* Open and shut, said with one mark that turns. */}
                    <span
                      aria-hidden
                      className="flex size-8 flex-none items-center justify-center rounded-pill border border-hair text-quiet transition-transform duration-300 group-open/zone:rotate-45"
                    >
                      <Plus className="size-4" strokeWidth={2} />
                    </span>
                  </summary>

                  {/* The steps, hanging off one rail.

                      A flex row with widths written on the children, not a
                      grid with an arbitrary template. `grid-cols-[34px_...]`
                      never made it into the stylesheet, so every row fell back
                      to one column and each child stretched the full width -
                      which is why the marks were rendering as black bars.
                      Widths on the children cannot fail that way.

                      It stacks below `sm` rather than wrapping. Wrapping put a
                      title on its own line and took the sentence with it, so a
                      row broke into three pieces at no particular width. */}
                  <div className="relative pb-7">
                    <span
                      aria-hidden
                      className="absolute top-9 bottom-12 left-[16px] hidden w-0.5 bg-hair sm:block"
                    />

                    <ol>
                      {zone.stops.map((stop, n) => (
                        <li
                          key={stop.ix}
                          className={cn(
                            "relative flex flex-col items-start gap-x-6 gap-y-1.5 py-4 sm:flex-row sm:items-start",
                            n > 0 && "border-t border-hair",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "flex h-[34px] w-[34px] shrink-0 grow-0 basis-[34px] items-center justify-center rounded-pill text-[13px] font-bold tabular-nums",
                              stop.mark === "launch"
                                ? "text-white"
                                : "bg-ink text-white",
                            )}
                            style={
                              stop.mark === "launch"
                                ? {
                                    backgroundImage: `linear-gradient(135deg, ${ramp.from}, ${ramp.to})`,
                                  }
                                : undefined
                            }
                          >
                            {n + 1}
                          </span>

                          <b className="min-w-0 pt-1.5 text-[16px] leading-[1.35] font-bold tracking-[-0.018em] text-ink sm:w-[300px] sm:shrink-0 sm:grow-0">
                            {stop.n}
                          </b>

                          <span className="min-w-0 grow text-[13.5px] leading-[1.6] text-quiet sm:pt-2">
                            {stop.sub}
                          </span>

                          <span className="shrink-0 font-mono text-[9.5px] font-bold tracking-[0.1em] text-label uppercase tabular-nums sm:w-[9ch] sm:pt-2.5 sm:text-right">
                            {stop.takes ?? ""}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* What holds across all thirteen. */}
      <section className="page-frame pb-16">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              True at every step
            </span>
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
          <h2 className="max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(21px,2.1vw,30px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
            The parts that do not move.
          </h2>

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
            After the last step the run usually starts again: the next piece of
            work arrives as a new submission rather than as a change to a
            finished one.
          </p>
        </CutPanel>
      </section>
    </>
  );
}
