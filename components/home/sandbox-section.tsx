"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarClock,
  Droplets,
  Map,
  Pause,
  Pipette,
  Play,
  PoundSterling,
  Sparkles,
  Waves,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { cutCardPath, cutCardPathTop } from "@/lib/shape";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { LiquidWord } from "./liquid-word";
import { LoomStrings } from "./loom-strings";
import { PROJECTS } from "./projects";
import { ParticleWordmark } from "./particle-wordmark";

/* ---------------------------------------------------------------------------
   The sandbox.

   Everything else on this page is a claim about what we can build. This is a
   bench: a shelf of pieces on the left, one of them running on the right, and
   a way to say you want it in yours.

   A grid of tiles was the wrong shape for it. Tiles say "look at these"; a
   bench says "pick one up", which is the difference between a showreel and a
   thing you can actually try - and it gives each widget the whole stage rather
   than a quarter of a screen it immediately overran.

   Three of these run. The rest are named as ideas rather than drawn as though
   they were finished, because a mock-up of something that does not exist is the
   same lie as a logo of a client we do not have.
--------------------------------------------------------------------------- */

/**
 * The pieces on the shelf, in the order they are offered.
 *
 * A name, a mark and whether it runs. No line of copy under each one: the three
 * that are live say what they are by running, and a sentence describing a thing
 * the reader is looking at is a caption for a picture that is not a picture.
 * The four that are not built carry their explanation on the stage instead,
 * where there is nothing else to look at and it is the whole point.
 *
 * The live ones lead. The bench opens on whatever is first here, and opening on
 * a piece that is only an idea would make the shelf a list of things we have
 * not done.
 */
const PIECES = [
  {
    key: "loom",
    name: "The loom",
    icon: Waves,
    live: true,
  },
  {
    key: "liquid",
    name: "Liquid wordmark",
    icon: Droplets,
    live: true,
  },
  {
    key: "particles",
    name: "Particle wordmark",
    icon: Sparkles,
    live: true,
  },
  {
    key: "diary",
    name: "Availability, live",
    icon: CalendarClock,
    live: false,
  },
  {
    key: "estimate",
    name: "What it will cost",
    icon: PoundSterling,
    live: false,
  },
  {
    key: "sitemap",
    name: "Your sitemap, drawn",
    icon: Map,
    live: false,
  },
  {
    key: "colour",
    name: "A colour studio",
    icon: Pipette,
    live: false,
    at: ROUTES.build,
  },
] as const;

/**
 * A few notes, for the loom's bench.
 *
 * Web Audio rather than a file: six notes of a pentatonic scale weigh nothing,
 * cannot be out of tune and need no network. Nothing sounds until somebody
 * presses play, because audio that arrives uninvited is not a feature.
 */
const SCALE = [261.63, 293.66, 349.23, 392.0, 440.0, 523.25];

/**
 * How the picture leaves the card: thinned out into it, never cut.
 *
 * A mask rather than a wash over the top. Painting white over a photograph
 * dulls it; taking the photograph away lets the card's own white through, so
 * the picture stays as bright as it was where it is still there.
 *
 * Ten stops on a curve rather than five on a ramp, and it starts giving way at
 * a quarter of the way down rather than half. A short linear fade reads as a
 * band with an edge at each end - which is exactly the thing a blend must not
 * have, and exactly what a photograph of a sky shows up.
 */
const SCRIM =
  "linear-gradient(to bottom, black 0%, black 26%, rgba(0,0,0,0.96) 38%, rgba(0,0,0,0.88) 48%, rgba(0,0,0,0.74) 58%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.35) 78%, rgba(0,0,0,0.18) 87%, rgba(0,0,0,0.06) 95%, transparent 100%)";

function useNotes() {
  const rig = useRef<{ ctx: AudioContext; master: GainNode } | null>(null);
  const timer = useRef<number | null>(null);
  const step = useRef(0);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    if (rig.current) {
      const { ctx, master } = rig.current;
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    }
    setPlaying(false);
  }, []);

  /* Nothing is left running when this goes away. An interval holding a live
     audio context is the one thing on a page that carries on making itself
     heard after nobody is looking at it. */
  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    if (!rig.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      rig.current = { ctx, master };
    }

    const { ctx, master } = rig.current;
    void ctx.resume();
    master.gain.setTargetAtTime(0.15, ctx.currentTime, 0.15);

    const pluck = () => {
      const at = ctx.currentTime;
      /* A wandering step rather than a loop, so it does not become a ringtone
         inside twenty seconds. */
      step.current = Math.max(
        0,
        Math.min(
          SCALE.length - 1,
          step.current + (Math.random() < 0.5 ? -1 : 1),
        ),
      );

      const tone = ctx.createOscillator();
      const swell = ctx.createGain();

      tone.type = "sine";
      tone.frequency.value = SCALE[step.current];
      swell.gain.setValueAtTime(0, at);
      swell.gain.linearRampToValueAtTime(1, at + 0.02);
      swell.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);

      tone.connect(swell).connect(master);
      tone.start(at);
      tone.stop(at + 2.5);
    };

    pluck();
    timer.current = window.setInterval(pluck, 1300);
    setPlaying(true);
  }, []);

  return { playing, toggle: () => (playing ? stop() : start()) };
}

export function SandboxSection() {
  /* Whatever is at the top of the shelf, rather than a key written out again
     here. Named, the two drifted apart the moment the order changed and the
     bench opened on the second row with the first one lit. */
  const [at, setAt] = useState<string>(PIECES[0].key);
  /* Which piece of work is open, if any. */
  const [open, setOpen] = useState<string | null>(null);
  const { playing, toggle } = useNotes();

  const piece = PIECES.find((entry) => entry.key === at) ?? PIECES[0];

  return (
    <section className="page-frame pt-20 pb-20 lg:pt-32 lg:pb-28">
      <div className="flex flex-col items-center text-center">
        <h2 className="section-head max-w-[26ch] text-ink">
          Things we built.
          <span className="text-quiet"> Running, not described.</span>
        </h2>

        <p className="mt-5 max-w-[74ch] text-[15px] leading-[1.6] text-quiet sm:text-[16.5px]">
          A bench rather than a showreel. Pick a piece up, let it run, and ask
          for it in yours - every one of these is a component a site could
          carry.
        </p>
      </div>

      {/* The bench, cut the way every working surface on this site is cut:
          which one of the set you are on stands in the bite, and the way on is
          the disc in the corner.

          Nothing stands in the notch, so there is no notch. It named the piece
          the shelf had already named one row to the left and lit in ink - the
          surface was being cut open at the top to repeat a word the reader had
          just pressed. Left empty the cut closes itself and the bench keeps a
          clean top edge.

          No rules inside it either. A plain box divided by hairlines was the one
          surface on this page that did not belong to the site - here the shape
          separates the parts and space does the rest. */}
      <CutPanel
        tone="field"
        className="mt-10 w-full lg:mt-12"
        aside={
          <div className="flex size-full flex-col items-center justify-center">
            <b className="font-mono text-[20px] leading-none font-bold text-ink tabular-nums">
              {String(
                PIECES.findIndex((entry) => entry.key === at) + 1,
              ).padStart(2, "0")}
            </b>
            <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
              of {PIECES.length}
            </span>
          </div>
        }
        footIn="notch"
        foot={
          /* On the bottom edge itself, in the band between the two cuts. A
             caption above a set of pictures tells you what you are about to
             see; on the foot of the surface it names what the whole thing was
             - which is the only version of it worth reading. */
          <p className="w-full text-center font-mono text-[12.5px] font-bold tracking-[0.22em] text-label uppercase sm:text-[14px]">
            Immersive projects
          </p>
        }
        corner={
          <Link
            href={ROUTES.build}
            aria-label="Add one to your journey"
            title="Add one to your journey"
            className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
          >
            <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
          </Link>
        }
      >
        {/* `popLayout` rather than `wait`. Waiting holds the whole surface
            empty for the length of the exit before the next thing starts, which
            is what makes a swap read as a blink; popping takes the leaving one
            out of the flow so both moves happen at once and the surface never
            goes blank. */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout" initial={false}>
            {open ? (
              /* Opened, it takes the whole bench. Expanding underneath the
                 shelf and the stage made it a third thing on a crowded
                 surface; taking the surface makes it the thing you opened. */
              <WorkOpen
                key="open"
                project={PROJECTS[PROJECTS.findIndex((e) => e.id === open)]}
                n={PROJECTS.findIndex((e) => e.id === open)}
                onClose={() => setOpen(null)}
              />
            ) : (
              <motion.div
                key="bench"
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.985 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid gap-7 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:grid-cols-[264px_minmax(0,1fr)]">
                  {/* The shelf. Ink for the one in hand, the ground for the rest. */}
                  <ul
                    role="listbox"
                    aria-label="Pieces"
                    className="flex flex-col gap-1.5"
                  >
                    {PIECES.map((entry) => {
                      const on = entry.key === at;

                      return (
                        <li key={entry.key}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={on}
                            onClick={() => setAt(entry.key)}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors",
                              on ? "bg-ink" : "bg-canvas hover:bg-canvas-firm",
                            )}
                          >
                            <span
                              aria-hidden
                              className={cn(
                                "flex size-8 flex-none items-center justify-center rounded-pill transition-colors",
                                on
                                  ? "bg-white/15 text-white"
                                  : entry.live
                                    ? "bg-field text-quiet"
                                    : "bg-field text-planned",
                              )}
                            >
                              <entry.icon className="size-4" />
                            </span>

                            {/* The name, and nothing after it. Six rows each ending in
                        LIVE or IDEA made a second column of shouting mono down
                        the shelf, and it was saying twice over what the notch
                        already says about the piece in hand and what the greyed
                        mark already says about the rest. */}
                            <span
                              className={cn(
                                "min-w-0 flex-1 truncate text-[13.5px] font-semibold",
                                on ? "text-white" : "text-body",
                              )}
                            >
                              {entry.name}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* The stage. Clipped and given a height, because both widgets size
              themselves to whatever box they are in and without one they grow
              until they have taken the section.

              Beside the shelf that height is the shelf's, and it is taken by
              lifting the stage out of the flow rather than by asking it for
              `height: 100%`. The percentage cannot work here: it would resolve
              against a column whose own height is whatever its content asks
              for, and the content asking is the stage - so the browser drops
              back to the canvas's intrinsic size and the stage runs to twice
              the shelf. Out of the flow it adds nothing to the row, the row is
              the six shelf rows tall, and the stage fills exactly that.

              Below `md` there is no shelf beside it to match, so it goes back
              into the flow with a height of its own. */}
                  <div className="relative min-w-0">
                    <div className="relative h-[220px] overflow-hidden rounded-[18px] sm:h-[280px] md:absolute md:inset-0 md:h-auto">
                      {piece.key === "particles" ? (
                        <ParticleWordmark
                          word="TwinLoom"
                          className="h-full w-full"
                        />
                      ) : null}

                      {piece.key === "liquid" ? (
                        /* The home page's own liquid, at the bench's height rather than
                   its own clamp. Crosshair because it is a surface you disturb
                   rather than a picture you look at. */
                        <LiquidWord
                          word="TwinLoom"
                          className="h-full w-full cursor-crosshair"
                        />
                      ) : null}

                      {piece.key === "loom" ? (
                        <>
                          <div className="flex h-full items-center px-2">
                            <LoomStrings word="Play it" className="w-full" />
                          </div>

                          {/* The one control that belongs to a piece rather than to the
                      bench, so it stands on the piece. */}
                          <button
                            type="button"
                            onClick={toggle}
                            aria-pressed={playing}
                            className={cn(
                              "absolute top-3 right-3 flex cursor-pointer items-center gap-2 rounded-pill px-3.5 py-1.5 font-mono text-[8.5px] font-bold tracking-[0.12em] uppercase transition-colors",
                              playing
                                ? "bg-ink text-white"
                                : "bg-field text-quiet hover:text-ink",
                            )}
                          >
                            {playing ? (
                              <Pause className="size-3" />
                            ) : (
                              <Play className="size-3" />
                            )}
                            {playing ? "Stop" : "Play"}
                          </button>
                        </>
                      ) : null}

                      {!piece.live ? (
                        /* Not built, and said so. The bench names what it would carry
                   rather than drawing a picture of a thing that does not
                   exist. */
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                          <span
                            aria-hidden
                            className="flex size-12 items-center justify-center rounded-pill bg-field text-idx"
                          >
                            <piece.icon className="size-5" />
                          </span>

                          <p className="mt-4 max-w-[44ch] text-[13.5px] leading-[1.6] text-quiet">
                            Not built yet. A piece we would write into a build
                            rather than a thing we are pretending to have
                            finished.
                          </p>

                          <Link
                            href={
                              "at" in piece && piece.at
                                ? piece.at
                                : ROUTES.build
                            }
                            className="group/ask mt-5 inline-flex items-center gap-2 rounded-pill bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
                          >
                            {"at" in piece && piece.at
                              ? "See it working"
                              : "Ask for it"}
                            <ArrowUpRight
                              aria-hidden
                              className="size-3.5 transition-transform group-hover/ask:translate-x-0.5 group-hover/ask:-translate-y-0.5"
                            />
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Where the pieces end up: the work, as numbered cards cut the
                    way everything else here is cut. */}
                <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {PROJECTS.map((project, n) => (
                    <WorkCard
                      key={project.id}
                      project={project}
                      n={n}
                      onOpen={() => setOpen(project.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </CutPanel>
    </section>
  );
}

/**
 * One piece of work, cut to whatever width the grid gives it.
 *
 * A clip path is drawn in pixels, so a fluid card has to measure itself: fixed
 * sizes meant the row could only ever be a multiple of one card, and left a
 * ragged gap at the end of every width that was not.
 *
 * The corner it gives up alternates, so a row reads as a run rather than as
 * five of the same thing.
 */
function WorkCard({
  project,
  n,
  onOpen,
}: {
  project: (typeof PROJECTS)[number];
  n: number;
  onOpen: () => void;
}) {
  const box = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const measure = () =>
      setSize({ w: node.clientWidth, h: node.clientHeight });
    const watcher = new ResizeObserver(measure);
    watcher.observe(node);
    measure();

    return () => watcher.disconnect();
  }, []);

  /* The cut is held to what the card can give: on a narrow card a corner of
     sixty would eat most of the bottom edge, and a path that overruns its own
     box folds inside out. */
  const cut = Math.max(46, Math.min(size.w * 0.22, 62));
  const draw = n % 2 ? cutCardPathTop : cutCardPath;
  const path = size.w > 60 ? draw(size.w, size.h, cut, 20, 18) : "";
  const top = n % 2 === 1;

  return (
    <button
      ref={box}
      type="button"
      onClick={onOpen}
      aria-label={`Open ${project.name}`}
      className="group/work relative h-[clamp(180px,17vw,230px)] min-w-0 cursor-pointer text-left transition-transform duration-300 hover:-translate-y-1"
    >
      {/* The picture is the card, cut to the outline and faded into ink at the
          foot so the name is read off the picture rather than off a bar laid
          over it. */}
      <motion.span
        aria-hidden
        layoutId={`work-${project.id}`}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 block overflow-hidden bg-field"
        style={{ clipPath: path ? `path("${path}")` : undefined }}
      >
        {/* The picture takes the top of the card and thins out before the
            words. Run to the bottom it had to be darkened to be read over, and
            a dark card on a light page is the one object here wearing another
            scheme. */}
        <span className="absolute inset-x-0 top-0 block h-[78%]">
          <Image
            src={project.image}
            alt=""
            fill
            quality={95}
            sizes="(max-width: 640px) 92vw, (max-width: 1280px) 34vw, 20vw"
            className="object-cover object-center transition-transform duration-500 group-hover/work:scale-[1.06]"
            style={{ maskImage: SCRIM, WebkitMaskImage: SCRIM }}
          />
        </span>
      </motion.span>

      <div
        className={cn(
          "relative flex size-full flex-col justify-end p-5",
          /* Only the card whose cut is at the foot has to keep out of it. */
          top ? "" : "pr-16",
        )}
      >
        <b className="block max-w-[18ch] text-[14.5px] leading-[1.18] font-extrabold tracking-[-0.025em] text-ink">
          {project.name}
        </b>
        <span className="mt-1.5 block font-mono text-[8.5px] font-bold tracking-[0.14em] text-label uppercase">
          {project.kind} / {project.year}
        </span>
      </div>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute right-0 flex items-center justify-center",
          top ? "top-0" : "bottom-0",
        )}
        style={{ width: cut, height: cut }}
      >
        <span
          className="flex items-center justify-center rounded-pill bg-ink font-mono text-[12px] font-bold text-white tabular-nums"
          style={{ width: cut - 16, height: cut - 16 }}
        >
          {String(n + 1).padStart(2, "0")}
        </span>
      </span>
    </button>
  );
}

/**
 * One piece of work, opened in place.
 *
 * The picture arrives from the card rather than appearing: it carries the same
 * `layoutId`, so the browser is moving one element between two positions rather
 * than crossing two of them over. That is the difference between a transition
 * and a cut.
 *
 * What it adds is what a card cannot hold - the summary, the facts as pills,
 * and the way to talk about one like it.
 */
function WorkOpen({
  project,
  n,
  onClose,
}: {
  project: (typeof PROJECTS)[number];
  n: number;
  onClose: () => void;
}) {
  const box = useRef<HTMLElement>(null);

  /* Opened from a card near the foot of the bench, this arrives with its own
     top somewhere above the window. Nobody should have to scroll up to find
     the thing they just pressed, so it brings itself to the top of the screen -
     but only if it is actually above it, since scrolling a panel that is
     already in view is a jolt for no reason. */
  useEffect(() => {
    const node = box.current;
    if (!node) return;

    const settle = requestAnimationFrame(() => {
      const top = node.getBoundingClientRect().top + window.scrollY;
      const header =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) || 53;

      if (window.scrollY <= top - header - 24) return;

      window.scrollTo({
        top: Math.max(0, top - header - 20),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => cancelAnimationFrame(settle);
  }, []);

  /* Escape, and a press anywhere outside it. Something opened in place has no
     scrim to press, so the page itself is the way out - and a reader who has
     finished with it will press away from it long before they look for a
     button. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const onDown = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) onClose();
    };

    window.addEventListener("keydown", onKey);
    /* On the next frame: the press that opened this is still travelling up the
       document, and listening now would close it in the same gesture. */
    const armed = requestAnimationFrame(() =>
      window.addEventListener("pointerdown", onDown),
    );

    return () => {
      cancelAnimationFrame(armed);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);

  return (
    <motion.article
      ref={box}
      layout
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.985 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[22px] bg-canvas"
    >
      {/* The picture, and it fades into the ground it sits on rather than
          stopping at a line - so the panel is one surface that happens to begin
          as a photograph. */}
      <motion.span
        layoutId={`work-${project.id}`}
        onClick={onClose}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative block h-[clamp(220px,32vw,440px)] w-full cursor-pointer overflow-hidden"
      >
        <Image
          src={project.image}
          alt={project.alt}
          fill
          quality={95}
          sizes="(max-width: 1024px) 96vw, 60vw"
          className="object-cover object-center"
        />
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-canvas) 0%, color-mix(in oklab, var(--color-canvas) 55%, transparent) 34%, transparent 68%)",
          }}
        />
      </motion.span>

      <div className="relative -mt-16 px-6 pb-6 sm:px-8 sm:pb-8">
        <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
          {String(n + 1).padStart(2, "0")} · {project.kind} / {project.year}
        </span>

        <h4 className="mt-2 max-w-[24ch] text-[clamp(20px,2.2vw,30px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
          {project.name}
        </h4>

        <p className="mt-3 max-w-[68ch] text-[14px] leading-[1.65] text-body">
          {project.summary}
        </p>

        {/* The facts as pills, and the two ways on. A preview is only offered
            where there is one to open: a dead "live preview" is worse than no
            preview at all. */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.facts.map((fact) => (
            <span
              key={fact.term}
              className="inline-flex items-center gap-2 rounded-pill bg-field px-3.5 py-1.5 text-[12.5px] text-body"
            >
              <span className="font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
                {fact.term}
              </span>
              <b className="font-semibold text-ink">{fact.value}</b>
            </span>
          ))}

          <span className="inline-flex items-center gap-2 rounded-pill bg-field px-3.5 py-1.5 text-[12.5px] text-body">
            <span className="font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
              Preview
            </span>
            <b className="font-semibold text-quiet">On request</b>
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Link
            href={ROUTES.build}
            className="group/like inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Ask for one like this
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/like:translate-x-0.5 group-hover/like:-translate-y-0.5"
            />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center gap-2 rounded-pill bg-field px-4 py-2 text-[13px] font-semibold text-quiet transition-colors hover:text-ink"
          >
            <X className="size-3.5" />
            Back to the work
          </button>
        </div>
      </div>
    </motion.article>
  );
}
