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

/**
 * The way in.
 *
 * One, not two. The second card sent people to the scoping run, which is what
 * the button in the header does on every page of the site and what the two
 * home page sections above it do - a third copy of it here was the same offer
 * for the third time, and it made the pair read as a choice when only one of
 * them was about this page.
 */
const PATH = {
  href: ROUTES.book,
  kicker: "Before anything is written down",
  n: "Get us involved from the start",
  sub: "You know you need something, but not yet what it looks like. Book a call and we will work the requirements out with you - nothing is priced and nothing is committed.",
  go: "Book a meeting",
  tint: "#8b5cf6",
} as const;

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
          <div className="text-center">
            <p
              className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
              style={{ color: RAMP[0].to }}
            >
              How we work
            </p>

            <h1 className="mx-auto mt-3 max-w-[22ch] text-[clamp(26px,3vw,34px)] leading-[1.14] font-extrabold tracking-[-0.03em] text-ink">
              How we normally work
            </h1>

            <p className="mx-auto mt-4 max-w-[64ch] text-[14px] leading-[1.65] text-quiet">
              The same run for every project. What changes between them is what
              happens inside a step, never which steps there are - so you can
              see the whole of it before you have committed to any of it.
            </p>
          </div>

          {/* The two ways in. Ruled cards rather than cut surfaces: they are a
              pair of equal choices, and a cut is for a control standing in it -
              these carry theirs on the face. */}
          <div className="mx-auto mt-9 flex max-w-[46rem] flex-col items-center gap-3 rounded-[14px] border border-hair p-7 text-center sm:p-8">
            <p
              className="font-mono text-[9.5px] font-bold tracking-[0.16em] uppercase"
              style={{ color: PATH.tint }}
            >
              {PATH.kicker}
            </p>

            <h2 className="max-w-[24ch] text-[20px] leading-[1.3] font-bold tracking-[-0.022em] text-ink">
              {PATH.n}
            </h2>

            <p className="max-w-[52ch] text-[13.5px] leading-[1.6] text-quiet">
              {PATH.sub}
            </p>

            <Link
              href={PATH.href}
              className="group/go mt-2 inline-flex items-center gap-2 rounded-[9px] border-[1.5px] bg-field px-6 py-3 text-[14px] font-semibold transition-opacity hover:opacity-85"
              style={{ borderColor: PATH.tint, color: PATH.tint }}
            >
              {PATH.go}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
              />
            </Link>
          </div>

          {/* The rule that joins the two. */}
          <div className="mt-7 flex items-center gap-5">
            <span aria-hidden className="h-px flex-1 bg-hair" />
            <span className="text-center font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase">
              However it starts, the process is the same
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
                  {/* The steps, on one rail and in one column.

                      Held to a measure and centred rather than spread across
                      the whole card: at full width the title and its sentence
                      were a hundred and eighty pixels apart with nothing
                      between them, and the duration ended up so far right it
                      wrapped onto two lines.

                      One line in the whole block, and it is the rail. The
                      hairline under every row was five more rules saying what
                      the marks on the rail already say, on a page whose point
                      is that there is a single run through it. */}
                  <div className="relative mx-auto max-w-[62rem] pb-8">
                    <span
                      aria-hidden
                      className="absolute top-6 bottom-8 left-[16px] w-0.5 bg-hair"
                    />

                    <ol>
                      {zone.stops.map((stop, n) => (
                        <li
                          key={stop.ix}
                          className="relative flex flex-col items-start gap-x-7 gap-y-1.5 py-3.5 sm:flex-row sm:items-baseline"
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "flex h-[34px] w-[34px] shrink-0 grow-0 basis-[34px] items-center justify-center self-start rounded-pill text-[13px] font-bold tabular-nums",
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

                          <b className="min-w-0 text-[15.5px] leading-[1.35] font-bold tracking-[-0.018em] text-ink sm:w-[250px] sm:shrink-0 sm:grow-0">
                            {stop.n}
                          </b>

                          <span className="min-w-0 grow text-[13.5px] leading-[1.6] text-quiet">
                            {stop.sub}
                          </span>

                          <span className="shrink-0 font-mono text-[9.5px] font-bold tracking-[0.1em] whitespace-nowrap text-label uppercase tabular-nums">
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
