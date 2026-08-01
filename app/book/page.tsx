import type { Metadata } from "next";

import { BuildNote } from "@/components/blocks/build-note";
import { PageMeta } from "@/components/blocks/page-meta";
import { Item, List, P } from "@/components/blocks/prose";
import { TextLink } from "@/components/blocks/text-link";
import { SlotPicker } from "@/components/book/slot-picker";
import { PageHeading, PageShell } from "@/components/layout";
import { frameworkPage } from "@/lib/pages";
import { ROUTES } from "@/lib/site";

const page = frameworkPage(ROUTES.book);

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

/**
 * Book a meeting.
 *
 * The framework asks this screen for four things: a calendar with real
 * availability, what the meeting is for and how long it takes, what to have
 * ready, and what happens if you cannot make it. Three of the four are answered
 * outright. The fourth needs a diary behind it, so the picker is built and the
 * note at the foot says plainly that nothing is connected to one yet.
 *
 * No section index. The page is one task, and an index over a task is furniture
 * standing between somebody and the thing they came to do.
 */
export default function BookPage() {
  return (
    <PageShell>
      <PageHeading tag={page.tag} title={page.title} lead={page.lead} />

      <P className="mb-10">
        Fifteen minutes to talk through what you need. Nothing to prepare and
        nothing to bring. If you would rather write it down than say it,{" "}
        <TextLink href={ROUTES.build} arrow>
          build your website
        </TextLink>{" "}
        instead and we will read it before we speak.
      </P>

      <SlotPicker />

      <BuildNote>
        <List className="mb-0">
          <Item>
            A diary behind the times above. They are shaped like real
            availability, and until one is connected that is all they are.
          </Item>
          <Item>
            A confirmation, by email and as a calendar invitation, with the way
            in to the call in it.
          </Item>
        </List>
      </BuildNote>

      <PageMeta values={{ title: page.title, description: page.description }} />
    </PageShell>
  );
}
