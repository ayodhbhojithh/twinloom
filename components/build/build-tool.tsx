"use client";

import { useState, useSyncExternalStore } from "react";
import { Check } from "lucide-react";

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
export function BuildTool({ idPrefix = "build" }: { idPrefix?: string }) {
  const [tab, setTab] = useState<TabKey>("what");

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
        className="mb-9 flex max-w-wide flex-wrap border-b border-border"
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
                "-mb-px cursor-pointer border-b-2 px-5 py-3 text-[15.5px] font-semibold transition-colors first:pl-0",
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
            <P>
              Answer as much or as little as you like. One question is enough to
              send.
            </P>
            <P>
              Every answer changes the site we describe back to you. Nothing here
              is a quote, and nothing is fixed until you have read the scope and
              agreed it.
            </P>

            <h3 className="mt-9 text-[20px] font-bold tracking-[-0.015em] text-ink sm:text-[22px]">
              Included in every site
            </h3>
            <P className="mt-1">
              Nothing to tick. These are in every site we build.
            </P>

            <ul className="mb-6 max-w-measure overflow-hidden rounded-card border border-border">
              {EVERY_SITE.map((thing) => (
                <li
                  key={thing}
                  className="flex items-center gap-3 border-t border-hair px-[17px] py-[11px] first:border-t-0"
                >
                  <Check
                    aria-hidden
                    className="size-[17px] shrink-0 text-done"
                    strokeWidth={2.3}
                  />
                  <span className="text-[14.5px] leading-[1.35] font-semibold text-ink">
                    {thing}
                  </span>
                </li>
              ))}
            </ul>

            <h3 className="mt-9 text-[20px] font-bold tracking-[-0.015em] text-ink sm:text-[22px]">
              What you have said so far
            </h3>

            <TallyStrip
              className="mt-4"
              tally={counts}
              title="The site your answers describe"
              note="Six things are in every site we build. Everything after that is yours to add."
              linkToSite
            />

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setTab("build")}
                className="cursor-pointer rounded-field accent-fill px-[18px] py-[10px] text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Start with the first area
              </button>
            </div>
          </>
        ) : null}

        {tab === "build" ? (
          <>
            <P>
              Two questions. Who comes to your website, and what each of them
              should be able to do.
            </P>
            <P>
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
            <P>
              Do not follow a structure. Send us what you have and tell us what
              you want.
            </P>
            <P>
              A brief on the back of an envelope, a competitor&rsquo;s site you
              like, three photos and a phone number. We read it and come back with
              questions.
            </P>

            <EmptyMark />

            <BuildNote>
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

            <P>
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
