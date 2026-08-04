"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import type { Project } from "./projects";

/**
 * A project, opened.
 *
 * Shared by every screen that shows the work, because the opening is the same
 * gesture wherever it starts: the card grows from where it was standing into a
 * panel just inside the edge of the screen. Two copies of this would have drifted
 * apart on the first edit, and the drift would show as one page animating
 * differently from another.
 *
 * The morph is `layoutId`. The grey block on the card and the grey block here are
 * one element in two places, so the library measures both and tweens between
 * them. Nothing crossfades and nothing is replaced, which is what makes the card
 * you chose provably the card you are now reading.
 *
 * Whoever opens it owns the state. This component only knows how to show one and
 * how to ask to be shut.
 */
export function ProjectPanel({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const quiet = useReducedMotion();
  const closer = useRef<HTMLButtonElement>(null);
  const came = useRef<HTMLElement | null>(null);

  /* While a panel is open the page behind it must not scroll, and Escape must
     shut it. Focus goes to the close button and comes back to whatever opened
     it, so a keyboard is never left standing at the top of the document. */
  useEffect(() => {
    if (!project) return;

    came.current = document.activeElement as HTMLElement | null;
    const held = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closer.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = held;
      window.removeEventListener("keydown", onKey);
      came.current?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <>
          <motion.div
            key="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: quiet ? 0 : 0.28 }}
            onClick={onClose}
            /* Darkened and blurred. A flat wash tells you the page is out of
               play; blurring it takes the page out of focus as well, which is
               what stops the eye trying to read the headline behind the
               panel. */
            className="fixed inset-0 z-50 bg-ink/65 backdrop-blur-[14px]"
          />

          <div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-open-name"
            /* Inset rather than edge to edge. A panel with the page still
               showing around it reads as something lifted off the page, which is
               what it is; full bleed reads as a new page and loses the thread
               back to the card. */
            className="pointer-events-none fixed inset-3 z-50 sm:inset-6 lg:inset-10"
          >
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: quiet ? 0 : 0.2 }}
              className="pointer-events-auto relative grid h-full grid-rows-[minmax(0,34svh)_minmax(0,1fr)] overflow-hidden rounded-[20px] bg-field lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-1"
            >
              <motion.div
                layoutId={`shot-${project.id}`}
                className="artwork min-h-0 overflow-hidden"
                style={{ backgroundColor: project.tone }}
              >
                {/* `fill` because the panel's half is sized by the grid, not by
                    the picture, and `cover` because a scope illustration reads
                    from its middle. `sizes` keeps a 3360px master from being
                    fetched to fill a phone. */}
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </motion.div>

              <div className="quiet-scroll flex min-h-0 flex-col overflow-y-auto p-6 sm:p-9 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: quiet ? 0 : 0.4,
                    delay: quiet ? 0 : 0.16,
                  }}
                >
                  <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
                    {project.kind} / {project.year}
                  </p>

                  <h2
                    id="project-open-name"
                    className="mt-4 max-w-[18ch] text-[clamp(24px,2.8vw,42px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink"
                  >
                    {project.name}
                  </h2>

                  <p className="mt-5 max-w-[48ch] text-[15.5px] leading-[1.65] text-body sm:text-[16px]">
                    {project.summary}
                  </p>

                  <dl className="mt-8 grid grid-cols-3 border-t border-hair">
                    {project.facts.map((fact) => (
                      <div
                        key={fact.term}
                        className="border-b border-hair py-3.5"
                      >
                        <dt className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                          {fact.term}
                        </dt>
                        <dd className="mt-1.5 text-[15px] font-semibold text-ink">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </div>

              <button
                ref={closer}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-pill bg-ink/80 text-white transition-opacity hover:opacity-85 sm:top-6 sm:right-6"
              >
                <X className="size-[18px]" />
              </button>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
