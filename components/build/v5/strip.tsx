"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { PHASES, STEPS } from "@/lib/build/v5";
import { type Answers } from "@/lib/build/v5-store";
import { cutCardPath } from "@/lib/shape";
import { cn } from "@/lib/utils";

import { stateOf, stepStatus } from "./kit";
import { Disc } from "./stage";

/* ---------------------------------------------------------------------------
   The twelve steps, as cut cards on a rail.

   The switcher: what you press here decides what the surface below shows, so
   nothing is reached by scrolling past something else.

   Each card is cut the way everything else on this site is cut - a corner
   taken out for the mark that stands in it, drawn with the landing card's own
   outline rather than a rounded rectangle with a badge dropped on top. The
   mark is the only thing that changes: the step's number while it waits, a
   tick once it has been answered.

   The size is fixed rather than measured. Twelve cards of one size need one
   path worked out once, instead of twelve elements each watching themselves
   for a resize that is never coming.
--------------------------------------------------------------------------- */

/**
 * Two widths, one height, one shape.
 *
 * The card you are standing on is wider than the rest, and grows into it rather
 * than snapping. Every other way of marking the current step - a border, a
 * rule, a colour - is a thing added to the card; size is the card itself, and
 * it survives being glanced at from the corner of the eye.
 *
 * It used to be taller as well, and that is what made the rail look broken:
 * the cards sit on one baseline, so the current one grew upward and stood a
 * head above a row that was otherwise level. One height for all ten, and the
 * width alone says which one you are on.
 *
 * The cut, the radius and the flare are the same at both sizes, so the two
 * paths carry the same commands in the same order. That is what lets the
 * browser interpolate between them: a clip path can only animate into another
 * one built the same way.
 */
const CARD = {
  w: 228,
  h: 116,
  onW: 252,
  onH: 116,
  cut: 46,
  mark: 36,
  radius: 16,
  flare: 16,
};

const CARD_PATH = cutCardPath(CARD.w, CARD.h, CARD.cut, CARD.radius, CARD.flare);
const CARD_PATH_ON = cutCardPath(
  CARD.onW,
  CARD.onH,
  CARD.cut,
  CARD.radius,
  CARD.flare,
);

export function StepStrip({
  step,
  answers,
  onGo,
}: {
  step: number;
  answers: Answers;
  onGo: (at: number) => void;
}) {
  const rail = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [shift, setShift] = useState(0);
  const [landed, setLanded] = useState(false);
  const clip = useMemo(() => `path("${CARD_PATH}")`, []);
  const clipOn = useMemo(() => `path("${CARD_PATH_ON}")`, []);

  /* Move the track so the current card's middle meets the rail's middle.

     Measured from the card itself rather than from a width times an index: the
     current card is wider than the rest, so index arithmetic would be wrong for
     every step after the first. Re-measured on resize as well as on the step,
     because the middle of the rail is not where it was when the window
     changes. */
  useEffect(() => {
    const box = wrap.current;
    if (!box) return;

    const measure = () => {
      const card = cards.current[step];
      const rail = track.current;
      if (!card || !rail) return;

      const want =
        box.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);

      /* Centred, but never past the ends. Sliding the first card into the
         middle would put nothing at all to the left of it, and a rail that
         opens with half a screen of empty is worse than one whose first card
         sits where a first card sits. So the ends hold and the middle is where
         everything between them lands. */
      const floor = Math.min(0, box.clientWidth - rail.scrollWidth);
      setShift(Math.max(floor, Math.min(0, want)));
    };

    measure();
    /* Again on the next frame: the card either side of this one is changing
       size at the same time, and the first measurement catches it mid-move. */
    const again = requestAnimationFrame(measure);

    const watcher = new ResizeObserver(measure);
    watcher.observe(box);

    return () => {
      cancelAnimationFrame(again);
      watcher.disconnect();
    };
  }, [step]);

  /* How tall the rail is, published to the page.

     The working surface holds itself to what is left of the screen once the
     header and this are out of it, and this is the only thing that knows how
     tall it is: the cards, the label row above them and the padding round both
     have all changed size more than once. Written to the root element rather
     than passed down, because the surface is not a descendant of the rail and
     a number that travels through four components is a number that goes
     stale in one of them. */
  useEffect(() => {
    const node = rail.current;
    if (!node) return;

    const publish = () =>
      document.documentElement.style.setProperty(
        "--rail-height",
        `${Math.round(node.getBoundingClientRect().height)}px`,
      );

    publish();
    const watcher = new ResizeObserver(publish);
    watcher.observe(node);

    return () => {
      watcher.disconnect();
      document.documentElement.style.removeProperty("--rail-height");
    };
  }, []);

  /* Nothing slides on arrival. Being taken somewhere is a response to having
     done something, and landing on the page is not that. */
  useEffect(() => {
    const settle = requestAnimationFrame(() => setLanded(true));
    return () => cancelAnimationFrame(settle);
  }, []);

  const zoneOf = (phase: string) =>
    PHASES.find(([key]) => key === phase)?.[1] ?? "";

  return (
    /* Not sticky, and that is the point.

       It was, for a while: a step could be far longer than a screen and the
       rail scrolled away with the top of it, so from halfway down a long
       question there was no way to see which step you were on. But sticking it
       split the pair - the rail held still while the surface underneath slid
       up behind it, and the first line of every question was cut off by the
       bottom edge of the cards.

       The surface holds itself to the screen now and scrolls its own contents,
       so the rail and the surface together are one screenful and there is
       nothing for either to scroll behind. They move as one block or not at
       all, which is what they always were: a switcher and the thing it
       switches. `--stage-room` takes this rail's height out of the surface's
       ceiling, so the two are sized to sit together. */
    <section ref={rail} aria-label="Steps" data-step-rail className="mb-7">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase">
          {STEPS.length} steps · leave any of them alone · the one you are on
          comes to the middle
        </p>

        <div className="flex flex-none items-center gap-0.5">
          {/* The arrows move the step, not the scroll. Scrolling the rail on
              its own would only be undone the moment anything is chosen, since
              the rail always comes back to the card you are on. */}
          <Disc
            label="Previous step"
            disabled={step === 0}
            onClick={() => onGo(step - 1)}
          >
            <ArrowLeft className="size-4" />
          </Disc>
          <Disc
            label="Next step"
            disabled={step === STEPS.length - 1}
            onClick={() => onGo(step + 1)}
          >
            <ArrowRight className="size-4" />
          </Disc>
        </div>
      </div>

      <div
        ref={wrap}
        role="tablist"
        aria-label="Steps"
        className="-mx-1 overflow-hidden px-1 pt-2 pb-3"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onGo(step + 1);
          if (event.key === "ArrowLeft") onGo(step - 1);
        }}
      >
        <div
          ref={track}
          className={cn(
            "relative flex w-max items-end gap-3",
            landed && "transition-transform duration-400 ease-out",
          )}
          style={{ transform: `translateX(${shift}px)` }}
        >
          {STEPS.map((entry, n) => {
            const state = stateOf(n, step, answers);
            const on = state === "here";
            const done = state === "done";
            const status = stepStatus(entry.k, answers);

            return (
              <div
                key={entry.k}
                ref={(node) => {
                  cards.current[n] = node;
                }}
                className="group/step relative flex-none transition-[width,height,transform] duration-300 ease-out hover:-translate-y-0.5"
                style={{
                  width: on ? CARD.onW : CARD.w,
                  height: on ? CARD.onH : CARD.h,
                }}
              >
                {/* The ground, cut. It carries nothing, so clipping it costs
                  nothing and the words above it stay whole. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 transition-[clip-path,background-color] duration-300 ease-out",
                    on ? "bg-ink" : "glass group-hover/step:glass-firm",
                  )}
                  style={{ clipPath: on ? clipOn : clip }}
                />

                <button
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => onGo(n)}
                  className="relative flex size-full cursor-pointer flex-col px-3.5 pt-2.5 pb-3 text-left"
                >
                  <span
                    className={cn(
                      "font-mono text-[8.5px] font-bold tracking-[0.14em] uppercase",
                      on ? "text-white/45" : "text-idx",
                    )}
                  >
                    {entry.can ? zoneOf(entry.ph) : "Required"}
                  </span>

                  <b
                    className={cn(
                      "mt-1.5 block leading-[1.18] font-bold tracking-[-0.02em] transition-[font-size] duration-300",
                      on ? "text-[15px] text-white" : "text-[14.5px] text-ink",
                    )}
                  >
                    {entry.n}
                  </b>

                  <span
                    className={cn(
                      "mt-auto block max-w-[16ch] truncate text-[11px] font-semibold",
                      on ? "text-white/65" : done ? "text-mark" : "text-quiet",
                    )}
                  >
                    {state === "past" ? "Assumed for you" : status.line}
                  </span>

                  {/* How much of the step has had an answer, as its share rather
                    than a number. An empty bar is a finished step if that is
                    what you meant by it. */}
                  {status.total > 0 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "mt-2 block h-[3px] w-[58%] overflow-hidden rounded-pill",
                        on ? "bg-white/15" : "bg-planned",
                      )}
                    >
                      <span
                        className={cn(
                          "block h-full rounded-pill transition-[width] duration-300",
                          on ? "bg-white/70" : "bg-mark",
                        )}
                        style={{
                          width: `${Math.min(100, Math.round((status.done / status.total) * 100))}%`,
                        }}
                      />
                    </span>
                  ) : (
                    <span aria-hidden className="mt-2 block h-[3px]" />
                  )}
                </button>

                {/* The mark, standing in the corner the card gives up for it. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-0 bottom-0 flex items-center justify-center"
                  style={{ width: CARD.cut, height: CARD.cut }}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-pill font-mono text-[11px] font-bold tabular-nums transition-colors",
                      done
                        ? "bg-mark text-white"
                        : on
                          ? "bg-ink text-white"
                          : "bg-field text-quiet",
                    )}
                    style={{ width: CARD.mark, height: CARD.mark }}
                  >
                    {done ? (
                      <Check className="size-[15px]" strokeWidth={3} />
                    ) : (
                      String(n + 1).padStart(2, "0")
                    )}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
