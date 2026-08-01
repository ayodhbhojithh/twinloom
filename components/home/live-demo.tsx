"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

/* Straight from the module, not the barrel: importing it from
   `@/components/build` would pull the whole tool into this page's bundle for
   the sake of one 24px frame. */
import { Glyph } from "@/components/build/glyph";
import { GROUPS } from "@/lib/build/data";
import {
  derivedPages,
  namedGroups,
  pageCount,
  pruneActions,
} from "@/lib/build/derive";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  updateAnswers,
} from "@/lib/build/store";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

const sentenceCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/**
 * The product, on the landing page, working.
 *
 * Describing this tool takes a paragraph nobody reads. Letting somebody tick one
 * chip and watch four pages become six takes two seconds and needs no paragraph
 * at all, so the first question is asked here rather than explained here.
 *
 * It writes to the same session store the build screen reads, which is the point
 * of doing it on this page: whatever is ticked here is already ticked when they
 * arrive there. The landing page is the first step of the tool, not a preview of
 * it.
 *
 * `initial={false}` on the list: the pages that are always there should be
 * present on arrival, not fly in at the reader. Only what an answer adds is
 * worth animating, because the movement is what says "you did that".
 */
export function LiveDemo() {
  const answers = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const zones = useMemo(() => derivedPages(answers), [answers]);
  const pages = pageCount(answers);
  const picked = answers.groups.length;

  function toggle(key: string) {
    updateAnswers((current) => {
      const groups = current.groups.includes(key)
        ? current.groups.filter((entry) => entry !== key)
        : [...current.groups, key];

      return {
        ...current,
        groups,
        actions: pruneActions(groups, current.actions),
      };
    });
  }

  function clear() {
    updateAnswers((current) => ({
      ...current,
      groups: [],
      actions: pruneActions([], current.actions),
    }));
  }

  return (
    <section className="grid gap-10 border-t border-border pt-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 2xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-active uppercase">
          Try it now
        </p>

        <h2 className="mt-3 text-[28px] leading-[1.14] font-extrabold tracking-[-0.028em] text-ink sm:text-[36px]">
          Who comes to your website?
        </h2>

        <p className="mt-3 max-w-measure text-[16.5px] leading-[1.6] text-quiet">
          That is the whole question. Tick anyone who might arrive, and watch the
          site beside this build itself. Nothing is sent, and you can untick as
          freely as you tick.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2.5">
          {GROUPS.map((group) => {
            const on = answers.groups.includes(group.key);

            return (
              <li key={group.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(group.key)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-pill border py-2.5 pr-5 pl-3 text-[15px] font-semibold transition-colors",
                    on
                      ? "border-active bg-active text-white"
                      : "border-border bg-field text-body hover:border-ink hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(on ? "text-white" : "text-label")}
                  >
                    <Glyph path={group.icon} className="size-[19px]" />
                  </span>
                  {sentenceCase(group.attr)}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-hair pt-6">
          <p className="min-w-0 flex-1 text-[17px] leading-[1.5] text-ink">
            {picked ? (
              <>
                A website for{" "}
                <b className="font-semibold text-active">
                  {namedGroups(answers)}
                </b>
                . That is {pages} pages so far.
              </>
            ) : (
              <span className="text-quiet">
                Four pages are in every site we build. Tick anyone above and the
                fifth appears.
              </span>
            )}
          </p>

          {picked ? (
            <button
              type="button"
              onClick={clear}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-label uppercase transition-colors hover:text-ink"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Start again
            </button>
          ) : null}
        </div>
      </div>

      {/* The answer, lifted off the page. The shadow is the only one on the
          site: this is the one thing that is supposed to look like an object
          rather than part of the document. */}
      <div className="min-w-0">
        <div className="overflow-hidden rounded-card border border-border bg-field shadow-[0_1px_2px_rgba(17,24,39,0.04),0_18px_44px_-20px_rgba(17,24,39,0.22)]">
          <div className="flex items-center justify-between gap-3 border-b border-hair px-5 py-3">
            <span className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-label uppercase">
              The site your answers describe
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.14em] text-done uppercase">
              <span
                aria-hidden
                className="pulse-dot size-[6px] rounded-pill bg-done"
              />
              Live
            </span>
          </div>

          <div className="flex items-baseline gap-3 px-5 pt-5 pb-4">
            <span className="font-mono text-[52px] leading-none font-bold text-active tabular-nums">
              {pages}
            </span>
            <span className="text-[15px] text-quiet">pages, as it stands</span>
          </div>

          <div className="border-t border-hair">
            {zones.map((zone) => (
              <div key={zone.key} className="border-t border-hair px-5 py-4 first:border-t-0">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-mono text-[10px] font-bold tracking-[0.14em] text-ink uppercase">
                    {zone.title}
                  </h3>
                  <span className="font-mono text-[10px] text-idx tabular-nums">
                    {zone.pages.length}
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {zone.pages.map((page) => (
                    <motion.div
                      key={`${zone.key}-${page.name}`}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="flex items-baseline gap-3 overflow-hidden py-[3px]"
                    >
                      <span className="min-w-[18px] font-mono text-[10px] text-idx tabular-nums">
                        {page.index}
                      </span>
                      <span className="text-[14.5px] font-medium text-ink">
                        {page.name}
                      </span>
                      {page.who ? (
                        <span className="font-mono text-[9.5px] font-semibold tracking-[0.07em] text-quiet uppercase">
                          for {page.who}
                        </span>
                      ) : null}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <Link
            href={ROUTES.build}
            className="group flex items-center justify-between gap-3 border-t border-hair bg-well px-5 py-4 text-[14.5px] font-semibold text-active transition-colors hover:bg-hair"
          >
            Keep going, and say what each of them can do
            <ArrowRight
              aria-hidden
              className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
