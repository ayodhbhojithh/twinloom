"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";

import { ProjectPanel } from "./project-panel";
import { PROJECTS, type Project } from "./projects";

/** How long a card holds the front before the deck turns itself. */
const DWELL = 4200;

const COUNT = PROJECTS.length;
const HALF = Math.floor(COUNT / 2);

/**
 * How far a card is from the front, the short way round.
 *
 * The deck is a ring, so the last card is one step before the first rather than
 * five steps after it. Without this the strip runs out at both ends and the
 * cards nearest the edges are the ones you can never quite reach.
 */
function distance(index: number, front: number) {
  return (((index - front) % COUNT) + COUNT + HALF) % COUNT - HALF;
}

/**
 * The work, as a deck you can pull cards out of.
 *
 * Three cards in view, the middle one forward, turning on its own until somebody
 * takes hold of it. Clicking the front card opens it, and the opening is the
 * point: the same element grows from where it was standing into a panel just
 * inside the edge of the screen. Nothing crossfades and nothing is replaced, so
 * the card you chose is provably the card you are now reading.
 *
 * That is `layoutId`, which hands the whole problem to the animation library:
 * two elements a page apart, one identity, and it measures both and tweens
 * between them. Written by hand it is a FLIP with a scale correction on every
 * child, and it is never quite right.
 */
export function ProjectCarousel({ className }: { className?: string }) {
  const [front, setFront] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(true);

  /* Measured rather than guessed, and solved rather than nudged.
     The card, the gap and how many cards stand either side are one decision:
     given the room, work out the largest deck whose outermost card still ends
     inside the column. A fixed step overflows a narrow column, and clipping or
     fading the overflow only hides the arithmetic that was never done. */
  const [size, setSize] = useState({ card: 230, step: 180, aside: 2 });

  const quiet = useReducedMotion();
  const deck = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = deck.current;
    if (!box) return;

    const measure = () => {
      const room = box.clientWidth;
      if (!room) return;

      const card = Math.max(140, Math.min(room * 0.44, 290));
      const want = card * 0.8;
      const edge = 6;

      /* Half the width of the furthest card once it has been scaled back. That
         is what has to clear the edge of the column, not the card's full size. */
      const reach = (aside: number) =>
        (card * (0.84 - (aside - 1) * 0.07)) / 2;

      /* Two either side if the room allows a step worth having; otherwise one,
         which is a better deck than five cards crushed together. */
      const roomFor2 = (room / 2 - reach(2) - edge) / 2;
      if (roomFor2 >= card * 0.44) {
        setSize({ card, step: Math.min(want, roomFor2), aside: 2 });
        return;
      }

      const roomFor1 = room / 2 - reach(1) - edge;
      setSize({
        card,
        step: Math.max(card * 0.3, Math.min(want, roomFor1)),
        aside: 1,
      });
    };

    const watcher = new ResizeObserver(measure);
    watcher.observe(box);
    measure();

    return () => watcher.disconnect();
  }, []);

  /* It turns itself, and stops the moment anybody is looking at one card: while
     the pointer is on it, while a panel is open, while the tab is in the
     background, and forever once the pause is pressed. A carousel that moves
     while you are reading it is worse than one that never moves at all. */
  useEffect(() => {
    if (quiet || open || held || !running) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setFront((was) => (was + 1) % COUNT);
    }, DWELL);

    return () => window.clearInterval(timer);
  }, [quiet, open, held, running]);

  const turn = (by: number) =>
    setFront((was) => (was + by + COUNT) % COUNT);

  return (
    <div className={className}>
      <div
        ref={deck}
        role="group"
        aria-roledescription="carousel"
        aria-label="Recent work"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            turn(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            turn(-1);
          }
        }}
        /* No mask and nothing to clip. The deck is sized so its outermost card
           ends inside the column, so there is no overflow to hide and no reason
           to blur the edges of a picture nobody is looking past. */
        className="relative"
        style={{ height: size.card / 0.7 }}
      >
        {PROJECTS.map((project, index) => {
          const away = distance(index, front);
          const far = Math.abs(away);
          const gone = far > size.aside;

          return (
            <motion.button
              key={project.id}
              type="button"
              aria-hidden={gone}
              tabIndex={gone ? -1 : 0}
              aria-label={
                away === 0 ? `Open ${project.name}` : `Show ${project.name}`
              }
              onClick={() => (away === 0 ? setOpen(project) : setFront(index))}
              /* Stacked and pushed apart rather than laid in a row, so the front
                 card is centred without measuring where the row has got to. */
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-active"
              style={{
                width: size.card,
                height: size.card / 0.7,
                zIndex: 10 - far,
              }}
              animate={{
                x: away * size.step,
                scale: away === 0 ? 1 : 0.84 - (far - 1) * 0.07,
                /* The cards beside the front one stay fully present. Fading
                   them made a deck of six look like a deck of one with ghosts
                   either side; scale alone is enough to say which is forward. */
                opacity: gone ? 0 : 1,
              }}
              /* A card crossing the back of the ring teleports rather than
                 flying the width of the deck to get there. It is invisible at
                 that moment, so nobody sees the cut. */
              transition={
                quiet || gone
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 220, damping: 28, mass: 0.9 }
              }
            >
              <motion.div
                layoutId={`shot-${project.id}`}
                /* A hairline rather than a shadow. Nothing else on this site
                   casts one, and a grey card on white needs an edge to be a
                   card, not a cloud under it to be a card. */
                className="size-full overflow-hidden rounded-[18px] border border-border"
                style={{ backgroundColor: project.tone }}
              >
                {/* The picture, when there is one. Until then the grey it will
                    sit in, with the plate it will be captioned by. */}
                <span className="flex size-full items-end p-3.5">
                  <span
                    className={cn(
                      "block w-full rounded-[10px] bg-field/85 px-3 py-2.5 backdrop-blur-[2px] transition-opacity duration-300",
                      away === 0 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <span className="block truncate text-[13px] font-bold text-ink">
                      {project.name}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
                      {project.kind} / {project.year}
                    </span>
                  </span>
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex items-center gap-2">
          <Step label="Previous project" onClick={() => turn(-1)}>
            <ArrowLeft className="size-4" />
          </Step>
          <Step label="Next project" onClick={() => turn(1)}>
            <ArrowRight className="size-4" />
          </Step>
          <Step
            label={running ? "Stop the carousel" : "Start the carousel"}
            onClick={() => setRunning((was) => !was)}
            pressed={!running}
          >
            {running ? (
              <Pause className="size-[15px]" />
            ) : (
              <Play className="size-[15px]" />
            )}
          </Step>
        </div>

        <ul className="flex items-center gap-2">
          {PROJECTS.map((project, index) => (
            <li key={project.id}>
              <button
                type="button"
                aria-label={`Show ${project.name}`}
                aria-current={index === front}
                onClick={() => setFront(index)}
                className={cn(
                  "block h-1.5 cursor-pointer rounded-pill transition-all",
                  index === front
                    ? "w-5 bg-ink"
                    : "w-1.5 bg-planned hover:bg-label",
                )}
              />
            </li>
          ))}
        </ul>
      </div>

      <ProjectPanel project={open} onClose={() => setOpen(null)} />

    </div>
  );
}

function Step({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "flex size-9 cursor-pointer items-center justify-center rounded-pill border transition-colors",
        pressed
          ? "border-ink bg-ink text-white"
          : "border-border text-quiet hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
