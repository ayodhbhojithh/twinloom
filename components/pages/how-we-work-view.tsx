import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { STOPS, ZONES } from "@/lib/journey";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   How we work.

   One line with thirteen stops on it, in three zones. The line is the point:
   the question a reader actually has is not what step four is called, it is how
   far in they are and how many hands the thing changes before it is theirs.

   Drawn in the site's own shapes rather than as a diagram. Each zone is a cut
   surface with its number standing in the bite and its name in the notch, and
   the stops inside it are the same numbered cards the scoping run uses. A
   railway map would be a second visual language on a site that already has one.
--------------------------------------------------------------------------- */

const RULES = [
  "Nothing is priced until there is a written scope to price.",
  "You sign off each milestone as it lands, not all of it at the end.",
  "Accounts are in your name from the day they are made.",
  "A written record at every stage, so nothing rests on a conversation.",
] as const;

/**
 * Where each zone begins, and which stops are the optional stretch.
 *
 * Worked out from the data rather than written down: the dividers and the grey
 * run are facts about the zones, and a hand-kept list of indexes would be wrong
 * the first time a stop moved.
 */
const starts = new Set(
  ZONES.reduce<number[]>((at, zone, n) => {
    const from = at.length ? at[at.length - 1] + ZONES[n - 1].stops.length : 0;
    return n === 0 ? [] : [...at, from];
  }, []),
);

const after = new Set(
  ZONES.flatMap((zone, n) =>
    zone.key === "after"
      ? zone.stops.map(
          (_, at) =>
            ZONES.slice(0, n).reduce((sum, z) => sum + z.stops.length, 0) + at,
        )
      : [],
  ),
);

/** A stop's name, its line, and how long it takes. */
function Name({ stop }: { stop: (typeof STOPS)[number] }) {
  return (
    <>
      <span className="font-mono text-[9px] font-bold text-idx tabular-nums">
        {stop.ix}
      </span>

      <span
        className={cn(
          "mt-1.5 block text-[13.5px] leading-[1.18] font-extrabold tracking-[-0.02em]",
          stop.mark === "launch" ? "text-mark" : "text-ink",
        )}
      >
        {stop.n}
      </span>

      <span className="mt-1.5 block text-[11.5px] leading-[1.45] text-quiet">
        {stop.sub}
      </span>

      {stop.takes ? (
        <span className="mt-1.5 block font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
          {stop.takes}
        </span>
      ) : null}
    </>
  );
}

export function HowWeWorkView() {
  return (
    /* Green, on this page only.

       The accent everywhere else means "this is set". Here the one thing worth
       marking is the launch - the single stop that is an event rather than a
       stretch - and green is what says arrived without anybody being taught it.
       Scoped by overriding the variable rather than by swapping classes, so the
       launch dot, its name, the badge and the ends of the line all move
       together and nothing can be missed. */
    <div style={{ ["--color-mark" as string]: "var(--color-done)" }}>
      <section className="page-frame pt-10 pb-12 text-center sm:pt-16 sm:pb-14">
        <h1 className="section-head mx-auto max-w-[34ch] text-ink">
          One line from the first email
          <span className="text-quiet"> to live and hosted.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-[78ch] text-[16px] leading-[1.65] text-quiet sm:text-[17.5px]">
          The same run for every project. What changes between them is what
          happens inside a step, never which steps there are - so you can see
          the whole of it before you have committed to any of it.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href={ROUTES.build}
            className="group inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-[14.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Start at step one
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
          <Link
            href={ROUTES.book}
            className="group inline-flex items-center gap-2 rounded-pill bg-field px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            Talk it through first
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* The line itself.

          One rule across the whole run with thirteen stops on it, the labels
          alternating above and below so a stop has room for a name and a
          sentence without the next one touching it. The zones are bands behind
          the line rather than three separate cards: the point of the drawing is
          that it is one line, and cutting it into three says the opposite.

          Wide, and it says so. Thirteen stops cannot be read at phone width, so
          below `lg` the map gives up and the same thirteen become the cards
          underneath - which are not a fallback so much as the same information
          at the size it fits. */}
      <section className="page-frame pb-14">
        <CutPanel
          tone="field"
          className="w-full"
          corner={
            <Link
              href={ROUTES.build}
              aria-label="Start at step one"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          {/* What the three marks mean, said once and nowhere else. The only
              thing on this surface that is not the line itself. */}
          <div className="flex justify-end">
            <ul className="hidden items-center gap-5 lg:flex">
              {[
                { n: "Stop", cls: "bg-ink" },
                { n: "Changes hands", cls: "bg-field ring-2 ring-ink" },
                { n: "Launch", cls: "bg-mark" },
              ].map((key) => (
                <li key={key.n} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn("size-2.5 rounded-pill", key.cls)}
                  />
                  <span className="font-mono text-[8.5px] font-bold tracking-[0.14em] text-label uppercase">
                    {key.n}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The map, as one grid.

              Four rows and one column per stop: the zone heads, the names above
              the line, the line itself, and the names below it. Everything
              lands on the same thirteen columns, so a stop, its dot, its number
              and its zone head are all on one vertical - which is the whole
              difference between a drawing and three rows that happen to be near
              each other.

              It scrolls sideways rather than shrinking. A stop with a name it
              cannot fit is worse than a stop you have to scroll to, and below
              `lg` it gives up and becomes the cards underneath. */}
          <div className="quiet-scroll -mx-1 mt-6 hidden overflow-x-auto px-1 pb-2 lg:block">
            <div
              className="grid min-w-[1560px] items-end rounded-[18px] bg-canvas px-6 py-7"
              style={{
                gridTemplateColumns: `repeat(${STOPS.length}, minmax(0, 1fr))`,
              }}
            >
              {/* One: the zones, each spanning its own stops. */}
              {ZONES.map((zone, at) => (
                <div
                  key={zone.key}
                  style={{ gridColumn: `span ${zone.stops.length}` }}
                  className={cn(
                    "min-w-0 pb-6",
                    at > 0 && "border-l border-dashed border-border pl-5",
                  )}
                >
                  <p className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-label uppercase">
                    Zone {at + 1}
                  </p>
                  <b className="mt-1 block truncate text-[14.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                    {zone.n}
                  </b>
                </div>
              ))}

              {/* Two and four: the names, alternating. A stop is named above the
                  line or below it, never both, and the empty cell opposite is
                  what keeps the line straight. */}
              {STOPS.map((stop, n) => (
                <div
                  key={`up-${stop.ix}`}
                  className={cn(
                    "flex min-h-[124px] min-w-0 flex-col justify-end px-3 pb-3 text-center",
                    starts.has(n) && "border-l border-dashed border-border",
                  )}
                >
                  {n % 2 === 0 ? <Name stop={stop} /> : null}
                </div>
              ))}

              {/* Three: the line, and what stands on it. The rule is drawn in
                  every cell and the cells are adjacent, so it arrives as one
                  unbroken line without anything having to know how wide the
                  whole run is. */}
              {STOPS.map((stop, n) => (
                <div
                  key={`dot-${stop.ix}`}
                  className={cn(
                    "relative flex h-10 min-w-0 items-center justify-center",
                    starts.has(n) && "border-l border-dashed border-border",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2",
                      after.has(n) ? "bg-planned" : "bg-ink",
                      /* The line stops at the ends rather than running off the
                         edge of the surface. */
                      n === 0 && "left-1/2",
                      n === STOPS.length - 1 && "right-1/2",
                    )}
                  />

                  <span
                    className={cn(
                      "relative flex items-center justify-center rounded-pill",
                      stop.mark === "launch"
                        ? "size-8 bg-mark font-mono text-[10px] font-bold text-white tabular-nums"
                        : stop.mark === "interchange"
                          ? cn(
                              "size-4 bg-field ring-[3px]",
                              after.has(n) ? "ring-planned" : "ring-ink",
                            )
                          : cn(
                              "size-3",
                              after.has(n) ? "bg-planned" : "bg-ink",
                            ),
                    )}
                  >
                    {stop.mark === "launch" ? stop.ix : null}
                  </span>
                </div>
              ))}

              {STOPS.map((stop, n) => (
                <div
                  key={`down-${stop.ix}`}
                  className={cn(
                    "flex min-h-[124px] min-w-0 flex-col px-3 pt-3 text-center",
                    starts.has(n) && "border-l border-dashed border-border",
                  )}
                >
                  {n % 2 === 1 ? <Name stop={stop} /> : null}
                </div>
              ))}
            </div>
          </div>
        </CutPanel>
      </section>

      {/* The same thirteen, as cards. This is what the map becomes below `lg`,
          and it is the only version on a phone. */}
      <section className="page-frame flex flex-col gap-4 pb-14 lg:hidden">
        {ZONES.map((zone, at) => (
          <CutPanel
            key={zone.key}
            tone="field"
            className="w-full"
            toolbar={
              <span className="flex h-10 w-full items-center justify-center gap-2.5">
                <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                  Zone {at + 1}
                </span>
                <b className="truncate text-[13.5px] leading-none font-bold text-ink">
                  {zone.n}
                </b>
              </span>
            }
          >
            <p className="max-w-[58ch] text-[14px] leading-[1.6] text-quiet">
              {zone.note}
            </p>

            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {zone.stops.map((stop) => (
                <li
                  key={stop.ix}
                  className={cn(
                    "flex min-w-0 flex-col rounded-[18px] p-5",
                    stop.mark === "launch" ? "bg-ink" : "bg-canvas",
                  )}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "font-mono text-[10px] font-bold tabular-nums",
                        stop.mark === "launch" ? "text-white/50" : "text-idx",
                      )}
                    >
                      {stop.ix}
                    </span>
                    {stop.takes ? (
                      <span
                        className={cn(
                          "font-mono text-[8.5px] font-bold tracking-[0.12em] uppercase",
                          stop.mark === "launch"
                            ? "text-white/60"
                            : "text-label",
                        )}
                      >
                        {stop.takes}
                      </span>
                    ) : null}
                  </span>

                  <b
                    className={cn(
                      "mt-2.5 block max-w-[22ch] text-[15px] leading-[1.2] font-extrabold tracking-[-0.025em]",
                      stop.mark === "launch" ? "text-white" : "text-ink",
                    )}
                  >
                    {stop.n}
                  </b>

                  <p
                    className={cn(
                      "mt-2 text-[13px] leading-[1.55]",
                      stop.mark === "launch" ? "text-white/70" : "text-quiet",
                    )}
                  >
                    {stop.sub}
                  </p>
                </li>
              ))}
            </ol>
          </CutPanel>
        ))}
      </section>

      {/* What holds across all thirteen. */}
      <section className="page-frame pb-16">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              True at every stop
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
            After the last stop the run usually starts again: the next piece of
            work arrives as a new submission rather than as a change to a
            finished one.
          </p>
        </CutPanel>
      </section>
    </div>
  );
}
