"use client";

import { useState, useSyncExternalStore } from "react";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
  SendHorizontal,
  Tag,
  type LucideIcon,
} from "lucide-react";

import { BuildNote, EmptyMark } from "@/components/blocks/build-note";
import { Item, List, P } from "@/components/blocks/prose";
import { TextLink } from "@/components/blocks/text-link";
import { EVERY_SITE } from "@/lib/build/data";
import { tally } from "@/lib/build/derive";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/build/store";
import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Builder } from "./builder";
import { TallyStrip } from "./tally-strip";

const TABS = [
  { key: "what", n: "01", label: "What this does" },
  { key: "build", n: "02", label: "Build it" },
  { key: "free", n: "03", label: "Freeflow" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * A picture for each of the six things every site can do.
 *
 * Keyed off the data rather than its order, so rewording a line or moving one
 * up the list cannot quietly hand it somebody else's icon. It lives here and not
 * in `data.ts` because it is how the thing is drawn, and the data has no
 * business importing components.
 */
const INCLUDED_ICON: Record<string, LucideIcon> = {
  who: BookOpen,
  sell: Tag,
  call: Phone,
  mail: Mail,
  form: SendHorizontal,
  place: MapPin,
};

/**
 * The tool itself: three tabs and everything in them.
 *
 * Lifted out of the build screen so the landing page can render the same thing
 * rather than a second version of it. There is one implementation, so the two
 * cannot say different things, and an answer given on one is the answer the
 * other already has.
 *
 * Only the page heading is left to the caller. The build screen's is the
 * document's `h1`; the landing page already has one, and a second would leave
 * the page with two titles.
 *
 * Tabs rather than three pages. They are three ways of approaching one task, and
 * a visitor should be able to move between them without losing what they have
 * already ticked, which is exactly what a tab does and a route does not.
 */
export function BuildTool({
  idPrefix = "build",
  centred,
}: {
  idPrefix?: string;
  /**
   * Sets the writing in the middle of the column rather than against its left
   * edge. For the landing page, where this section is addressed to the room and
   * has the full width to sit in. The build screen keeps its left edge, because
   * there it is one page in a rail of pages and has to line up with them.
   *
   * A flag rather than a second component: the alignment is the only thing that
   * differs, and two copies would differ in more than that by the first edit.
   */
  centred?: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("what");

  /* The measure blocks and the writing in them, centred or not. Centred, they
     run the full width of the section rather than the site's prose
     measure. The measure exists to stop lines running long down a page you are
     reading top to bottom; this is a short address at the head of a section,
     and a 720px column adrift in the middle of a 1600px page only read as a
     narrow strip. */
  const mid = centred
    ? "mx-auto max-w-[1400px] text-center text-[17px] sm:text-[18.5px]"
    : undefined;
  const midBlock = centred ? "mx-auto max-w-[1400px]" : undefined;

  const answers = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const counts = tally(answers);

  return (
    <>
      <div
        role="tablist"
        aria-label="How to build"
        className={cn(
          "mb-9 flex max-w-wide flex-wrap",
          centred && "justify-center",
        )}
      >
        {TABS.map((entry) => {
          const on = entry.key === tab;

          return (
            <button
              key={entry.key}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${idPrefix}-panel-${entry.key}`}
              id={`${idPrefix}-tab-${entry.key}`}
              onClick={() => setTab(entry.key)}
              className={cn(
                /* The rule under the row is gone, so the active tab's own is
                   the only line here and it marks one tab rather than sitting
                   across the page. */
                "cursor-pointer border-b-2 px-4 py-3 text-[16px] font-semibold transition-colors sm:px-5 sm:text-[17.5px]",
                /* Flush left only when the row is. The first tab's padding is
                   dropped so it lines up with the type below it, which centred
                   would just make the row look off-centre. */
                !centred && "first:pl-0",
                on
                  ? "border-ink text-ink"
                  : "border-transparent text-quiet hover:text-ink",
              )}
            >
              <span className="mr-2 font-mono text-[11px] font-bold text-label tabular-nums">
                {entry.n}
              </span>
              {entry.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${idPrefix}-panel-${tab}`}
        aria-labelledby={`${idPrefix}-tab-${tab}`}
        tabIndex={-1}
      >
        {tab === "what" ? (
          <>
            <P className={mid}>
              Answer as much or as little as you like. One question is enough to
              send.
            </P>
            <P className={mid}>
              Every answer changes the site we describe back to you. Nothing here
              is a quote, and nothing is fixed until you have read the scope and
              agreed it.
            </P>

            <h3
              className={cn(
                "mt-10 text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[26px] lg:text-[29px]",
                centred && "text-center",
              )}
            >
              Included in every site
            </h3>
            <P className={cn("mt-1", mid)}>
              Nothing to tick. These are in every site we build.
            </P>

            {/* A grid of tiles, not a stack of rows.
                Six short lines down the full width of the page left most of
                every row empty and made a list of six read as long. Three
                across turns the same six into two rows you take in at once,
                which is what "these come as standard" should feel like.

                Each is a filled tile rather than an outlined one, and the
                picture stands on a white disc inside it. Two tones and no
                lines, so the grid reads as one block of six rather than
                eighteen edges. */}
            <ul
              className={cn(
                "mb-8 grid max-w-measure gap-3 sm:grid-cols-2 lg:grid-cols-3",
                midBlock,
              )}
            >
              {EVERY_SITE.map((thing, index) => {
                const Icon = INCLUDED_ICON[thing.key];

                return (
                  <li
                    key={thing.key}
                    className="group/inc flex items-center gap-4 rounded-card bg-well px-4 py-4 transition-colors hover:bg-hair sm:px-5 sm:py-5"
                  >
                    <span
                      aria-hidden
                      className="flex size-11 flex-none items-center justify-center rounded-pill bg-field text-ink transition-transform duration-300 group-hover/inc:-translate-y-0.5 sm:size-12"
                    >
                      {Icon ? <Icon className="size-[19px] sm:size-[21px]" /> : null}
                    </span>

                    <span className="min-w-0 text-left text-[15.5px] leading-[1.3] font-semibold text-ink sm:text-[16.5px]">
                      {thing.label}
                    </span>

                    {/* Numbered, so six things read as a set rather than as six
                        separate claims. Mono and quiet, the same way pages are
                        numbered in the site map. */}
                    <span
                      aria-hidden
                      className="ml-auto pl-3 font-mono text-[11px] font-bold tracking-[0.12em] text-idx tabular-nums"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </li>
                );
              })}
            </ul>

            <h3
              className={cn(
                "mt-10 text-[22px] font-bold tracking-[-0.02em] text-ink sm:text-[26px] lg:text-[29px]",
                centred && "text-center",
              )}
            >
              What you have said so far
            </h3>

            <TallyStrip
              className={cn("mt-5", midBlock)}
              tally={counts}
              title="The site your answers describe"
              note="Six things are in every site we build. Everything after that is yours to add."
              linkToSite
            />

            <div className={cn("mt-6", centred && "text-center")}>
              <button
                type="button"
                onClick={() => setTab("build")}
                className="cursor-pointer rounded-field bg-ink px-6 py-3 text-[15.5px] font-semibold text-white transition-opacity hover:opacity-85 sm:px-7 sm:py-3.5 sm:text-[16.5px]"
              >
                Start with the first area
              </button>
            </div>
          </>
        ) : null}

        {tab === "build" ? (
          <>
            <P className={mid}>
              Two questions. Who comes to your website, and what each of them
              should be able to do.
            </P>
            <P className={mid}>
              The second question is written by the first. Name a group and the
              things that group needs turn up underneath, in a band of their own.
              Take a group away and its things go with it, so the site we describe
              back to you can only hold what you asked for. The five ways of
              getting in touch are standard in every site we build, and three of
              them start off ticked.
            </P>

            <div className="mt-9">
              <Builder />
            </div>

            <BuildNote label="Framework note">
              <p>
                Two questions are still to come, and they are what make this
                answer usable: the order these things go in, and how you will know
                the site is working.
              </p>
            </BuildNote>
          </>
        ) : null}

        {tab === "free" ? (
          <>
            <P className={mid}>
              Do not follow a structure. Send us what you have and tell us what
              you want.
            </P>
            <P className={mid}>
              A brief on the back of an envelope, a competitor&rsquo;s site you
              like, three photos and a phone number. We read it and come back with
              questions.
            </P>

            <div className={centred ? "text-center" : undefined}>
              <EmptyMark />
            </div>

            <BuildNote className={midBlock}>
              <List className="mb-0">
                <Item>
                  A drop area for files, with what happens to them said plainly.
                </Item>
                <Item>
                  One open box, and no required fields except a way to reply.
                </Item>
                <Item>
                  The same two working days promise as the card route.
                </Item>
                <Item>
                  A note that this and the cards are two doors into the same room.
                </Item>
              </List>
            </BuildNote>

            <P className={mid}>
              If you would rather talk it through,{" "}
              <TextLink href={ROUTES.book} arrow>
                book a meeting
              </TextLink>
              .
            </P>
          </>
        ) : null}
      </div>
    </>
  );
}
