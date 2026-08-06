import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { ZONES } from "@/lib/journey";
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
          {/* The ascent.

              Every stop stands a little higher than the one before it, and a
              riser drops from each back down to the floor of its flight. A flat
              row of thirteen cards says these are thirteen things; a climb says
              each one is only reachable from the one below it, which is the
              actual claim being made.

              Three flights rather than one, because that is where the work
              changes hands - and because six cards is the most that can climb
              across a screen while still holding a sentence each.

              The rise is set from the count, so a flight of two and a flight of
              six reach the same height and the three read as one building
              rather than three unrelated staircases. */}
          <div className="mt-8 hidden flex-col gap-10 lg:flex">
            {ZONES.map((zone, at) => (
              <section key={zone.key} className="min-w-0">
                <div
                  className="reveal flex flex-wrap items-baseline gap-x-4 gap-y-1"
                  style={{ ["--step" as string]: 0 }}
                >
                  <p className="font-mono text-[8.5px] font-bold tracking-[0.16em] text-mark uppercase">
                    Flight {["one", "two", "three"][at]}
                  </p>
                  <b className="text-[15.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                    {zone.n}
                  </b>
                  <span className="text-[12.5px] leading-[1.5] text-quiet">
                    {zone.note}
                  </span>
                </div>

                {/* The floor each riser lands on. It is the only rule in the
                    drawing, and it is what makes a flight a flight. */}
                <ol className="mt-6 flex items-end border-b border-hair">
                  {zone.stops.map((stop, n) => {
                    const climb = (zone.stops.length - 1 - n) * 38;

                    return (
                      <li
                        key={stop.ix}
                        className="reveal flex min-w-0 flex-1 flex-col px-1.5"
                        style={{
                          paddingTop: climb,
                          ["--step" as string]: n + 1,
                        }}
                      >
                        <article
                          className={cn(
                            "min-w-0 rounded-[16px] p-4 transition-transform duration-300 hover:-translate-y-1",
                            stop.mark === "launch"
                              ? "bg-mark"
                              : stop.mark === "interchange"
                                ? "bg-canvas ring-1 ring-border"
                                : "bg-canvas",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span
                              aria-hidden
                              className={cn(
                                "flex size-7 items-center justify-center rounded-pill",
                                stop.mark === "launch"
                                  ? "bg-white/20 text-white"
                                  : "bg-field text-quiet",
                              )}
                            >
                              <stop.icon className="size-3.5" strokeWidth={2} />
                            </span>

                            <span
                              className={cn(
                                "font-mono text-[9.5px] font-bold tabular-nums",
                                stop.mark === "launch"
                                  ? "text-white/60"
                                  : "text-idx",
                              )}
                            >
                              {stop.ix}
                            </span>
                          </span>

                          <b
                            className={cn(
                              "mt-3 block text-[13.5px] leading-[1.2] font-extrabold tracking-[-0.02em]",
                              stop.mark === "launch"
                                ? "text-white"
                                : "text-ink",
                            )}
                          >
                            {stop.n}
                          </b>

                          <p
                            className={cn(
                              "mt-1.5 text-[11.5px] leading-[1.45]",
                              stop.mark === "launch"
                                ? "text-white/75"
                                : "text-quiet",
                            )}
                          >
                            {stop.sub}
                          </p>

                          {stop.takes ? (
                            <p
                              className={cn(
                                "mt-2 font-mono text-[8.5px] font-bold tracking-[0.12em] uppercase",
                                stop.mark === "launch"
                                  ? "text-white/70"
                                  : "text-label",
                              )}
                            >
                              {stop.takes}
                            </p>
                          ) : null}
                        </article>

                        {/* The riser. It falls from the card to the floor, so
                            the height of a stop is readable without counting
                            anything. */}
                        <span
                          aria-hidden
                          className={cn(
                            "mx-auto block w-px flex-1",
                            stop.mark === "launch" ? "bg-mark/40" : "bg-border",
                          )}
                          style={{ minHeight: 18 + climb / 2 }}
                        />
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
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
