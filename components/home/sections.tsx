import { Check, FileCheck2, LayoutList, Users } from "lucide-react";
import Link from "next/link";

import { EVERY_SITE } from "@/lib/build/data";
import { ROUTES } from "@/lib/site";

/**
 * How it works, in three.
 *
 * The accent walks blue to amber to green across the three, so the row reads as
 * a progression rather than as three of the same thing. That is the only place
 * on the site where more than one accent is used at once, and it is doing work:
 * green is already "done" everywhere else, so it belongs on the last step.
 */
const STEPS = [
  {
    n: "01",
    title: "Say who it is for",
    body: "Tick the kinds of people who come to your website. Seven to choose from, and you can write in anyone we have missed.",
    icon: Users,
    accent: "text-active",
    rule: "bg-active",
  },
  {
    n: "02",
    title: "Watch it write itself",
    body: "Every answer adds a page, and every page says which of your answers put it there. Take an answer back and its pages go with it.",
    icon: LayoutList,
    accent: "text-amber",
    rule: "bg-amber",
  },
  {
    n: "03",
    title: "Read it back in two days",
    body: "We send a written scope in your own words, within two working days. Nothing is fixed until you have read it and agreed it.",
    icon: FileCheck2,
    accent: "text-done",
    rule: "bg-done",
  },
] as const;

export function Steps() {
  return (
    <section className="border-t border-border pt-12">
      <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-label uppercase">
        How it works
      </p>

      <h2 className="mt-3 max-w-[20ch] text-[28px] leading-[1.14] font-extrabold tracking-[-0.028em] text-ink sm:text-[36px]">
        Three steps, and you only do the first one.
      </h2>

      <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n} className="min-w-0">
            <div className={`mb-5 h-[3px] w-10 rounded-pill ${step.rule}`} />

            <div className="mb-4 flex items-center gap-3">
              <step.icon
                aria-hidden
                className={`size-[22px] ${step.accent}`}
                strokeWidth={1.7}
              />
              <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-idx tabular-nums">
                {step.n}
              </span>
            </div>

            <h3 className="text-[19.5px] leading-[1.25] font-bold tracking-[-0.015em] text-ink">
              {step.title}
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-[1.6] text-quiet">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/**
 * The floor.
 *
 * It sits after the tool rather than before it, because it answers the question
 * the tool provokes: having watched pages appear, the next thought is "what do I
 * get if I answer nothing at all". Six things, and none of them are ticked
 * because none of them are optional.
 */
export function Included() {
  return (
    <section className="border-t border-border pt-12">
      <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-done uppercase">
            The floor
          </p>

          <h2 className="mt-3 text-[28px] leading-[1.14] font-extrabold tracking-[-0.028em] text-ink sm:text-[36px]">
            Six things are in every site we build.
          </h2>

          <p className="mt-4 max-w-measure text-[16.5px] leading-[1.6] text-quiet">
            Nothing to tick and nothing to add on. Whatever you answer, and even
            if you answer nothing, your website can do all six of these on the
            day it goes live.
          </p>
        </div>

        <ul className="grid min-w-0 gap-x-8 sm:grid-cols-2">
          {EVERY_SITE.map((thing) => (
            <li
              key={thing}
              className="flex items-start gap-3 border-b border-hair py-3.5 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0"
            >
              <Check
                aria-hidden
                className="mt-0.5 size-[18px] shrink-0 text-done"
                strokeWidth={2.4}
              />
              <span className="text-[15.5px] leading-[1.4] font-medium text-ink">
                {thing}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The last word.
 *
 * One panel, one sentence, one button. It repeats the hero's ask on purpose:
 * somebody who has read the whole page should not have to scroll back up to act
 * on it.
 */
export function Closing() {
  return (
    <section className="hero-ground mt-16 rounded-card border border-border px-6 py-12 text-center sm:px-10 sm:py-16">
      <h2 className="mx-auto max-w-[18ch] text-[30px] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink sm:text-[46px]">
        Start with one answer.
      </h2>

      <p className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-body sm:text-[18.5px]">
        You do not need a brief, a budget or a list of features. Say who your
        website is for, and we will write the rest down for you.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={ROUTES.build}
          className="inline-flex items-center rounded-field bg-active px-6 py-[13px] text-[15.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Build your website
        </Link>
        <Link
          href={ROUTES.book}
          className="inline-flex items-center rounded-field border border-ink bg-field px-6 py-[13px] text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Book a meeting
        </Link>
      </div>
    </section>
  );
}
