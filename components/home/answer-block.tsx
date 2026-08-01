"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";

/* Straight from the module, not the barrel: importing it from
   `@/components/build` would pull the whole tool into this page's bundle for
   the sake of one 24px frame. */
import { Glyph } from "@/components/build/glyph";
import { GROUPS } from "@/lib/build/data";
import {
  derivedPages,
  findGroup,
  pageCount,
  pruneActions,
  type PageZone,
} from "@/lib/build/derive";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  updateAnswers,
} from "@/lib/build/store";
import { cn } from "@/lib/utils";

const COUNT_WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven"];

const sentenceCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** "a, b and c", which is how a list belongs in a sentence. */
function listWords(words: readonly string[]): string {
  if (words.length < 2) return words[0] ?? "";
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

/**
 * The three columns the scope is built in, including the two that are empty
 * until something is answered.
 *
 * The empty ones are drawn rather than hidden. A column that appears out of
 * nowhere on the fourth click is a surprise; a column that has been standing
 * there saying what it is waiting for is an instruction. It is also what keeps
 * the width in use before anybody has answered anything.
 */
const ZONES = [
  {
    key: "always",
    title: "Always there",
    waiting: "",
  },
  {
    key: "who",
    title: "Who it is for",
    waiting:
      "Name two or more kinds of visitor and each one gets its own way in.",
  },
  {
    key: "do",
    title: "What they can do",
    waiting:
      "Say what each visitor should be able to do, and the pages that need doing it land here.",
  },
] as const;

/**
 * The question, and the document it writes.
 *
 * The page's own claim is above this, in the framework's words. This is the
 * proof of it: the one question asked here rather than described, so that
 * "we write the rest down" is something the reader watches happen rather than
 * something they have to take on trust.
 *
 * Its heading is a sentence with a gap in it, and the gap is the control: "A
 * website for ____." The gap holds names while there are few enough to read and
 * a count once there are not. Setting all seven in display type made a wall of
 * blue that pushed the rest of the page under the fold, which is the opposite of
 * what a live heading is for.
 *
 * Both bands run the full width: the seven answers as one row of tiles, the
 * scope as the three columns it is actually built in.
 *
 * It writes to the same session store the build screen reads, which is the point
 * of doing it here: whatever is named on this page is already named when they
 * arrive there. This is step one of the tool, not a picture of it.
 */
export function AnswerBlock() {
  const answers = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const zones = useMemo(() => derivedPages(answers), [answers]);
  const pages = pageCount(answers);

  const attrs = useMemo(
    () =>
      answers.groups
        .map((key) => findGroup(key)?.attr)
        .filter((attr): attr is string => Boolean(attr)),
    [answers.groups],
  );

  /* Short enough to read in a headline, or a count. Never a list of seven. */
  const filled =
    attrs.length === 0
      ? ""
      : attrs.length <= 2
        ? listWords(attrs)
        : `${COUNT_WORDS[attrs.length]} kinds of visitor`;

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
    <section className="mt-16 border-t border-border pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <p className="font-mono text-[10.5px] font-bold tracking-[0.2em] text-active uppercase">
          The one question
        </p>
        <p className="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-label uppercase tabular-nums">
          {answers.groups.length} of {GROUPS.length} named
        </p>
      </div>

      <h2 className="mt-6 max-w-[28ch] text-[clamp(30px,4.1vw,56px)] leading-[1.06] font-extrabold tracking-[-0.035em] text-ink">
        A website for{" "}
        {filled ? (
          <span className="text-active">{filled}</span>
        ) : (
          /* The gap, drawn as a gap. A rule on the baseline the width of a few
             characters, with a caret waiting in it. */
          <span
            aria-hidden
            className="blank-caret inline-block w-[3.2ch] border-b-[0.06em] border-planned align-baseline"
          />
        )}
        <span className="text-planned">.</span>
      </h2>

      {attrs.length > 2 ? (
        <p className="mt-4 max-w-[90ch] text-[18px] leading-[1.5] font-semibold text-active sm:text-[20px]">
          {sentenceCase(listWords(attrs))}.
        </p>
      ) : null}

      <p className="mt-5 max-w-[76ch] text-[16.5px] leading-[1.6] text-quiet sm:text-[17.5px]">
        {attrs.length
          ? "Take any of them back and their pages go with them. Nothing is sent, and nothing is fixed until you have read the scope and agreed it."
          : "Tick anyone who might arrive at your website. That is the whole question, and the scope below writes itself as you answer it."}
      </p>

      <Answers picked={answers.groups} onToggle={toggle} />

      <Scope
        zones={zones}
        pages={pages}
        named={attrs.length > 0}
        onClear={clear}
      />
    </section>
  );
}

/**
 * The seven answers, as one row.
 *
 * Seven equal tiles across at the widest size, which is the whole question
 * visible at once with nothing left over. Below that the row folds to four and
 * then two, and the last tile takes whatever its row has spare so no breakpoint
 * ever leaves a hole beside it.
 */
function Answers({
  picked,
  onToggle,
}: {
  picked: readonly string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="mt-9">
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 [&>*:last-child]:sm:col-span-2 [&>*:last-child]:lg:col-span-2 [&>*:last-child]:xl:col-span-1">
        {GROUPS.map((group) => {
          const on = picked.includes(group.key);

          return (
            <li key={group.key} className="min-w-0">
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onToggle(group.key)}
                className={cn(
                  "flex h-full w-full cursor-pointer items-center gap-3 rounded-card border px-4 py-3.5 text-left transition-colors xl:flex-col xl:items-start xl:gap-4 xl:px-4 xl:py-5",
                  on
                    ? "border-active bg-active text-white"
                    : "border-border bg-field hover:border-ink",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-pill border transition-colors",
                    on
                      ? "border-white/35 text-white"
                      : "border-border text-label",
                  )}
                >
                  <Glyph path={group.icon} className="size-[18px]" />
                </span>

                <span
                  className={cn(
                    "min-w-0 text-[15px] leading-[1.3] font-semibold",
                    on ? "text-white" : "text-ink",
                  )}
                >
                  {sentenceCase(group.attr)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The scope, as a table of contents in the three columns it is built in.
 *
 * A contents page is the right object here and a dashboard card is the wrong
 * one: this company sells a written scope, the deliverable is a document, and a
 * numbered list with leaders running out to what put each line there is what a
 * document looks like from the front.
 *
 * `initial={false}`: the four pages every site has should be present on arrival
 * rather than flying in at the reader. Only what an answer adds is worth
 * animating, because the movement is what says "you did that".
 */
function Scope({
  zones,
  pages,
  named,
  onClear,
}: {
  zones: readonly PageZone[];
  pages: number;
  named: boolean;
  onClear: () => void;
}) {
  return (
    <div className="mt-14">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-2.5">
        <h2 className="font-mono text-[10.5px] font-bold tracking-[0.2em] text-ink uppercase">
          The scope so far
        </h2>

        <div className="flex items-baseline gap-6">
          {named ? (
            <button
              type="button"
              onClick={onClear}
              className="flex cursor-pointer items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.14em] text-label uppercase transition-colors hover:text-ink"
            >
              <RotateCcw aria-hidden className="size-3.5" />
              Start again
            </button>
          ) : null}

          <span className="flex items-baseline gap-2 font-mono text-[10.5px] font-bold tracking-[0.14em] text-quiet uppercase tabular-nums">
            <span
              aria-hidden
              className="pulse-dot size-[6px] translate-y-[-1px] rounded-pill bg-done"
            />
            {pages} pages
          </span>
        </div>
      </div>

      <div className="grid gap-x-14 gap-y-9 pt-7 md:grid-cols-2 lg:grid-cols-3">
        {ZONES.map((zone) => {
          const live = zones.find((entry) => entry.key === zone.key);

          return (
            <section key={zone.key} className="min-w-0">
              <div className="mb-2.5 flex items-baseline justify-between gap-3 border-b border-hair pb-2">
                <h3
                  className={cn(
                    "font-mono text-[10px] font-bold tracking-[0.16em] uppercase",
                    live ? "text-ink" : "text-planned",
                  )}
                >
                  {zone.title}
                </h3>
                <span className="font-mono text-[10px] text-idx tabular-nums">
                  {live ? live.pages.length : 0}
                </span>
              </div>

              {live ? (
                <AnimatePresence initial={false}>
                  {live.pages.map((page) => (
                    <motion.div
                      key={`${zone.key}-${page.name}`}
                      layout
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="flex items-baseline gap-2.5 overflow-hidden py-[5px]"
                    >
                      <span className="w-[2ch] shrink-0 font-mono text-[11px] text-idx tabular-nums">
                        {page.index}
                      </span>

                      <span className="shrink-0 text-[15.5px] font-medium text-ink">
                        {page.name}
                      </span>

                      {/* The leader is what makes this a contents page rather
                          than a list, and it carries the argument: every line
                          points at the answer that put it there. */}
                      <span
                        aria-hidden
                        className="leader h-[1em] min-w-4 flex-1"
                      />

                      <span className="shrink-0 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-label uppercase">
                        {page.who
                          ? `for ${page.who}`
                          : page.flag
                            ? page.flag
                            : "always"}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                /* Standing here saying what it is waiting for, rather than
                   appearing out of nowhere on the fourth click. */
                <div>
                  {[0, 1, 2].map((at) => (
                    <div
                      key={at}
                      aria-hidden
                      className="flex items-baseline gap-2.5 py-[5px] opacity-70"
                    >
                      <span className="w-[2ch] shrink-0 font-mono text-[11px] text-planned">
                        &ndash;&ndash;
                      </span>
                      <span className="h-[7px] flex-1 rounded-pill bg-hair" />
                    </div>
                  ))}
                  <p className="mt-3 text-[13.5px] leading-[1.5] text-label">
                    {zone.waiting}
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
