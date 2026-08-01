import type { Metadata } from "next";

import { ActionLink, Actions } from "@/components/blocks/action-link";
import { BuildNote, EmptyMark } from "@/components/blocks/build-note";
import { PageMeta, type PageMetaValues } from "@/components/blocks/page-meta";
import { Item, List, P } from "@/components/blocks/prose";
import { PageHeading, PageShell } from "@/components/layout";
import { ROUTES, SITE } from "@/lib/site";

/** One source: the route's metadata and the block at the foot of the page. */
const META: PageMetaValues = {
  title: "The Very Good Website Company",
  description:
    "Tell us who your website is for and we write the rest down for you. One question, a written scope back within two working days, and no obligation.",
};

export const metadata: Metadata = {
  /* `absolute` because the layout appends the company name to every title, and
     this one is the company name. */
  title: { absolute: META.title },
  description: META.description,
};

/**
 * Home.
 *
 * v4 reduced this to one claim and one way in. There is no services list, no
 * pricing, no proof strip: the whole page is a sentence about what you get, a
 * sentence about what it costs you, and two buttons.
 *
 * The note below is the framework's own, and it stays. It is the brief for this
 * page, and on a screen this bare it is the most useful thing on it.
 */
export default function HomePage() {
  return (
    <PageShell>
      <PageHeading tag="Home" title={SITE.tagline} lead={SITE.description} />

      <Actions>
        <ActionLink href={ROUTES.build} variant="primary">
          Build your website
        </ActionLink>
        <ActionLink href={ROUTES.book}>Book a meeting</ActionLink>
      </Actions>

      <div className="mt-9">
        <EmptyMark />
      </div>

      <BuildNote>
        <List className="mb-0">
          <Item>The one line that says what you do, in your words.</Item>
          <Item>The single way in, which is the build page.</Item>
          <Item>Enough proof that somebody feels safe starting.</Item>
          <Item>
            A short answer to &ldquo;what will this cost me&rdquo;, now that
            pricing is off the nav.
          </Item>
        </List>
      </BuildNote>

      <P className="text-quiet">{SITE.status}</P>

      <PageMeta values={META} />
    </PageShell>
  );
}
