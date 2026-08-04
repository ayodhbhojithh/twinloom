"use client";

import { useMemo, useSyncExternalStore } from "react";

import { ActionLink, Actions } from "@/components/blocks/action-link";
import { BuildNote } from "@/components/blocks/build-note";
import { Item, List } from "@/components/blocks/prose";
import { PageHeading, PageShell } from "@/components/layout";
import { derivedPages, namedGroups, pageCount, tally } from "@/lib/build/derive";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/build/store";
import { ROUTES } from "@/lib/site";

import { SiteMap } from "./site-map";
import { TallyStrip } from "./tally-strip";

/**
 * The site your answers describe.
 *
 * Every page here comes from something that has been said on the build screen,
 * and each one is shown under the answer that put it there. That grouping is the
 * whole point: it is not a sitemap, it is an argument, and the client should be
 * able to see which of their own answers is responsible for each page.
 *
 * Four pages are there before anybody answers anything, which is why the screen
 * is worth reading even when it is empty.
 */
export function SiteView() {
  const answers = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const zones = useMemo(() => derivedPages(answers), [answers]);
  const counts = useMemo(() => tally(answers), [answers]);
  const pages = pageCount(answers);
  const started = answers.groups.length > 0;

  return (
    <PageShell>
      <PageHeading
        tag="The site your answers describe"
        title="The site your answers describe"
        lead="Every page here comes from something you have said so far."
      />

      <TallyStrip
        tally={counts}
        note="Six things are in every site we build. Everything after that is yours to add."
      />

      <section className="mt-10 border-t border-border pt-8">
        <div className="mb-1.5 flex items-baseline gap-3">
          <h2 className="text-[23px] leading-[1.22] font-bold tracking-[-0.02em] text-ink sm:text-[26px]">
            Pages
          </h2>
          <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-idx uppercase tabular-nums">
            {pages} {pages === 1 ? "page" : "pages"}
          </span>
        </div>

        <p className="mb-[18px] max-w-measure text-[14.5px] text-quiet">
          {started
            ? `You have named ${namedGroups(answers)}. Every page sits under the answer that put it there.`
            : "Nothing has been answered yet, so this is the site anybody would get. Every page sits under the answer that put it there."}
        </p>

        <SiteMap zones={zones} />

        <div className="mt-[22px]">
          <Actions>
            <ActionLink href={ROUTES.build} variant="primary">
              Add more to it
            </ActionLink>
            <ActionLink href={ROUTES.book}>Talk it through</ActionLink>
          </Actions>
        </div>
      </section>

      <BuildNote label="Still to decide">
        <List className="mb-0">
          <Item>
            Whether this screen can be sent on its own, or only from the build
            page.
          </Item>
          <Item>Whether a page here can be opened to say what goes on it.</Item>
        </List>
      </BuildNote>
    </PageShell>
  );
}
