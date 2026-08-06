"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { cutCardPath, cutCardPathTop } from "@/lib/shape";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { PROJECTS } from "./projects";

/* ---------------------------------------------------------------------------
   The work.

   Everything else on this page is a claim about what we can build. This is the
   answer to it: the things that got built, each one openable where it stands.

   It was a bench before - a shelf of widgets on the left, one of them running
   on the right, and the work in a row underneath. The shelf was the loudest
   thing in the section and it was advertising components rather than finished
   sites, so the work it stood above was the smaller half of a surface named
   after it. Gone, the section says one thing.

   Laid out as a mosaic rather than as five equal tiles. Five of one size in a
   row is a contact sheet: nothing in it is worth looking at first, so nothing
   in it gets looked at. Given different sizes there is a way in, and the run
   reads as an arrangement somebody made rather than as whatever the grid did.
--------------------------------------------------------------------------- */

/**
 * Where each piece of work sits in the mosaic.
 *
 * By position rather than by project, because it is a fact about the shape of
 * the run and not about the work: reorder the list and the first one still
 * leads. Anything past the end of this falls back to a third-width tile, so a
 * sixth project widens the run rather than breaking it.
 *
 * One column on a phone, two from `sm`, and the mosaic only from `lg`, where
 * there is room for one to be one.
 *
 *   row 1:  lead (5)      |  (4)  |  (3)
 *   row 2:  lead, still   |  (3)  |  (4)
 */
const PLACE = [
  "sm:col-span-2 lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
];

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

export function SandboxSection() {
  /* Which piece of work is open, if any. */
  const [open, setOpen] = useState<string | null>(null);
  const bench = useRef<HTMLDivElement>(null);

  /* Closing has the same problem opening did, in reverse: the reader is looking
     at the foot of a tall panel, and the moment it goes the surface under them
     is a short run they are scrolled past the bottom of. So the work comes
     back to them rather than them having to go and find it. */
  const close = useCallback(() => {
    setOpen(null);

    const node = bench.current;
    if (!node) return;

    requestAnimationFrame(() => {
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
  }, []);

  const shown = PROJECTS.findIndex((entry) => entry.id === open);

  return (
    <section className="page-frame pt-14 pb-14 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-28">
      <div className="flex flex-col items-center text-center">
        <h2 className="reveal section-head max-w-[26ch] text-ink">
          Things we built.
          <span className="text-quiet"> Opened, not listed.</span>
        </h2>

        <p className="reveal mt-5 max-w-[74ch] text-[15px] leading-[1.6] text-quiet [--step:1] sm:text-[16.5px]">
          Press one and it opens where it stands - what it was for, who it was
          written for, and how long it took. None of it is dressed up as a
          client we do not have.
        </p>
      </div>

      {/* The surface, cut the way every working surface on this site is cut:
          how many there are stands in the bite, and the way on is the disc in
          the corner.

          Nothing stands in the notch, so there is no notch. Left empty the cut
          closes itself and the panel keeps a clean top edge.

          No rules inside it either. A plain box divided by hairlines was the one
          surface on this page that did not belong to the site - here the shape
          separates the parts and space does the rest. */}
      <div ref={bench} className="scroll-mt-[calc(var(--nav-height)+20px)]" />

      <CutPanel
        tone="field"
        className="reveal mt-10 w-full [--step:2] lg:mt-12"
        aside={
          /* How many there are, and which one you are in once you are in one.
             It counted shelf rows before, and with the shelf gone a counter
             that still pointed at it would have been counting nothing. */
          <div className="flex size-full flex-col items-center justify-center">
            <b className="font-mono text-[20px] leading-none font-bold text-ink tabular-nums">
              {String(shown >= 0 ? shown + 1 : PROJECTS.length).padStart(
                2,
                "0",
              )}
            </b>
            <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
              {shown >= 0 ? `of ${PROJECTS.length}` : "built"}
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
        {/* One at a time.

            `popLayout` was meant to avoid the pause between them, but it takes
            the leaving panel out of the flow while leaving it drawn - so the
            mosaic laid itself out underneath a full height ghost, and closing
            showed both at once with the run stranded below the fading panel.
            Waiting is honest about the swap; keeping both moves short is what
            makes it read as one. */}
        <LayoutGroup>
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              /* Opened, it takes the whole surface. Expanding underneath the
                 mosaic made it a second thing on the same panel; taking the
                 panel makes it the thing you opened. */
              <WorkOpen
                key="open"
                project={PROJECTS[shown]}
                n={shown}
                onClose={close}
              />
            ) : (
              <motion.div
                key="work"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {/* The work, as a mosaic. The first one leads and the rest
                    fall in around it; each card measures itself, so a run of
                    different widths is one the shape can actually follow. */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
                  {PROJECTS.map((project, n) => (
                    <WorkCard
                      key={project.id}
                      project={project}
                      n={n}
                      lead={n === 0}
                      className={PLACE[n] ?? "lg:col-span-4"}
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
  lead,
  className,
  onOpen,
}: {
  project: (typeof PROJECTS)[number];
  n: number;
  /** The one that takes two rows, and is given the room to say more. */
  lead?: boolean;
  /** Where it sits in the mosaic. Passed in, because the shape of the run is
      the run's business rather than the card's. */
  className?: string;
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

  /* The card is the shape of the picture in it, except where the grid says
     otherwise.

     The covers are sixteen by nine posters with a layout inside them, so an
     ordinary tile takes that ratio and puts the words underneath - which is the
     only arrangement that shows a poster whole. The lead spans two rows of the
     mosaic, so its height comes from the grid instead and its picture is given
     the room that leaves. */
  return (
    <button
      ref={box}
      type="button"
      onClick={onOpen}
      aria-label={`Open ${project.name}`}
      className={cn(
        "group/work relative flex min-w-0 cursor-pointer flex-col text-left transition-transform duration-300 hover:-translate-y-1",
        lead && "lg:h-full",
        className,
      )}
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
        <span
          className={cn(
            "absolute inset-x-0 top-0 block w-full",
            lead ? "aspect-video lg:aspect-auto lg:h-[74%]" : "aspect-video",
          )}
        >
          <Image
            src={project.image}
            alt=""
            fill
            quality={100}
            sizes={
              lead
                ? "(max-width: 640px) 92vw, (max-width: 1024px) 94vw, 44vw"
                : "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            }
            className="object-cover object-center transition-transform duration-500 group-hover/work:scale-[1.06]"
            style={{ maskImage: SCRIM, WebkitMaskImage: SCRIM }}
          />
        </span>
      </motion.span>

      {/* The picture's own space, kept by an empty box of its ratio rather than
          by a guessed height. */}
      <span
        aria-hidden
        className={cn(
          "block w-full",
          lead ? "aspect-video lg:aspect-auto lg:h-[74%]" : "aspect-video",
        )}
      />

      <div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col justify-end p-5 pt-3",
          /* Only the card whose cut is at the foot has to keep out of it. */
          top ? "" : "pr-16",
          lead ? "sm:p-6 sm:pt-3" : "",
        )}
      >
        {/* The lead is bigger because it is the way in, and being bigger is the
            only thing that makes it one. It gets the summary as well: on a card
            of that height a name and a date leave a third of the surface empty,
            and the words are already written. */}
        <b
          className={cn(
            "block leading-[1.18] font-extrabold tracking-[-0.025em] text-ink",
            lead
              ? "max-w-[20ch] text-[16px] sm:text-[19px] lg:text-[22px]"
              : "max-w-[18ch] text-[14.5px]",
          )}
        >
          {project.name}
        </b>

        {/* `max-lg:hidden` rather than `hidden lg:block`: `line-clamp` sets a
            display of its own, and which of the two won below `lg` came down to
            which rule the stylesheet happened to emit last. */}
        {lead ? (
          <p className="mt-2 line-clamp-2 max-w-[46ch] text-[13px] leading-[1.55] text-quiet max-lg:hidden">
            {project.summary}
          </p>
        ) : null}

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
      /* No `layout` on the panel itself. The picture inside it already carries
         a `layoutId`, and a parent animating its own size at the same time
         fights the child that is animating between two boxes - which is what
         made closing snap rather than settle. One thing measures, the rest
         fade. */
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.18 },
      }}
      className="relative overflow-hidden rounded-[22px] bg-canvas"
    >
      {/* Words on the left, the picture on the right.

          Stacked, the poster took the whole width and pushed everything worth
          reading below the fold of the panel - and a cover that is already a
          left-to-right composition looked cropped a second time. Side by side,
          the reading order is the order it is read in, and the picture keeps
          its own ratio at whatever width it is given. */}
      {/* The inset is on the panel, not on one column of it. Padding the words
          and leaving the picture to the edges made the panel look like two
          different surfaces stuck together. */}
      <div className="grid items-center gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,54%)] lg:gap-10 lg:p-8">
        <div className="order-2 min-w-0 lg:order-1">
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

        {/* The picture, whole. It carries the `layoutId`, so it is the same
            element that was on the card - the panel around it only fades. */}
        <motion.span
          layoutId={`work-${project.id}`}
          onClick={onClose}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-1 block aspect-video w-full cursor-pointer overflow-hidden rounded-[16px] lg:order-2"
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            quality={100}
            sizes="(max-width: 1024px) 96vw, 54vw"
            className="object-cover object-center"
          />
        </motion.span>
      </div>
    </motion.article>
  );
}
