import type { Metadata } from "next";

import { BuildNote, EmptyMark } from "@/components/blocks/build-note";
import { PageMeta } from "@/components/blocks/page-meta";
import { Item, List } from "@/components/blocks/prose";
import { PageHeading, PageShell } from "@/components/layout";
import { frameworkPage } from "@/lib/pages";

/**
 * One of the framework's reserved screens.
 *
 * Thirteen pages, one component, driven from `lib/pages.ts`. Each route is four
 * lines: read its entry, export the metadata, render this.
 *
 * There is no section index on these, because there are no sections. A page whose
 * whole content is "here is what belongs here" does not need a table of contents
 * pointing at one heading.
 */
export function FrameworkPageView({ href }: { href: string }) {
  const page = frameworkPage(href);
  const list = Array.isArray(page.belongs) ? page.belongs : null;

  return (
    <PageShell>
      <PageHeading tag={page.tag} title={page.title} lead={page.lead} />

      <EmptyMark />

      <BuildNote>
        {list ? (
          <List className="mb-0">
            {list.map((entry) => (
              <Item key={entry}>{entry}</Item>
            ))}
          </List>
        ) : (
          <p>{page.belongs as string}</p>
        )}
      </BuildNote>

      <PageMeta
        values={{ title: page.title, description: page.description }}
      />
    </PageShell>
  );
}

/** The route's metadata, from the same entry the page renders from. */
export function frameworkMetadata(href: string): Metadata {
  const page = frameworkPage(href);
  return { title: page.title, description: page.description };
}
