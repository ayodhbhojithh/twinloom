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
          {/* Thirteen stops on one spine.

              The staircase needed a screen and a half of height to say what a
              column says in a third of it - and a climb only reads as a climb if
              you can see the top of it from the bottom.

              So: one vertical rule down the left, every stop hanging off it as a
              row, and the three zones as bands along it. A row can be compact
              because it reads across rather than down - number, icon, name, what
              happens, how long - and thirteen of them stack without any of it
              needing to be scrolled sideways or shrunk to fit.

              The spine is the drawing. It runs unbroken through all three zones,
              which is the one thing the earlier versions kept losing. */}
          <div className="mt-8 hidden lg:block">
            {ZONES.map((zone, at) => (
              <section key={zone.key} className="min-w-0">
                {/* The zone, on the spine rather than above it: its own mark
                    sits where a stop's would, so a change of hands reads as
                    part of the run rather than as a heading over it. */}
                <div
                  className="reveal relative flex gap-5 pl-[46px]"
                  style={{ ["--step" as string]: 0 }}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-0 bottom-0 left-[15px] w-px",
                      at === 0 ? "top-1/2" : "",
                      zone.key === "after" ? "bg-planned" : "bg-border",
                    )}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-1/2 left-[9px] size-3.5 -translate-y-1/2 rounded-pill ring-[3px]",
                      zone.key === "after"
                        ? "bg-field ring-planned"
                        : "bg-field ring-ink",
                    )}
                  />

                  <p
                    className={cn(
                      "flex flex-wrap items-baseline gap-x-3 gap-y-1",
                      at === 0 ? "pb-5" : "py-5",
                    )}
                  >
                    <b className="text-[14.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                      {zone.n}
                    </b>
                    <span className="text-[12px] leading-[1.5] text-quiet">
                      {zone.note}
                    </span>
                  </p>
                </div>

                <ol>
                  {zone.stops.map((stop, n) => (
                    <li
                      key={stop.ix}
                      className="reveal group/stop relative flex gap-5 pl-[46px]"
                      style={{ ["--step" as string]: n + 1 }}
                    >
                      {/* The spine, drawn by each row so it arrives unbroken
                          and stops with the last stop rather than running on. */}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute left-[15px] w-px",
                          zone.key === "after" ? "bg-planned" : "bg-border",
                          at === ZONES.length - 1 && n === zone.stops.length - 1
                            ? "top-0 h-1/2"
                            : "inset-y-0",
                        )}
                      />

                      {/* What the stop is, standing on the spine. */}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-1/2 left-0 flex size-[31px] -translate-y-1/2 items-center justify-center rounded-pill transition-colors",
                          stop.mark === "launch"
                            ? "bg-mark text-white"
                            : stop.mark === "interchange"
                              ? "bg-field text-ink ring-1 ring-border"
                              : "bg-canvas text-quiet",
                        )}
                      >
                        <stop.icon className="size-[15px]" strokeWidth={1.9} />
                      </span>

                      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-hair py-3.5 transition-colors group-last/stop:border-b-0 group-hover/stop:border-border">
                        <span className="font-mono text-[9.5px] font-bold text-idx tabular-nums">
                          {stop.ix}
                        </span>

                        <b
                          className={cn(
                            "min-w-[15ch] flex-none text-[14px] leading-[1.25] font-extrabold tracking-[-0.02em]",
                            stop.mark === "launch" ? "text-mark" : "text-ink",
                          )}
                        >
                          {stop.n}
                        </b>

                        <span className="min-w-0 flex-1 text-[12.5px] leading-[1.5] text-quiet">
                          {stop.sub}
                        </span>

                        {stop.takes ? (
                          <span className="flex-none font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase tabular-nums">
                            {stop.takes}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
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
