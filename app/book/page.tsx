import type { Metadata } from "next";

import { P } from "@/components/blocks/prose";
import { TextLink } from "@/components/blocks/text-link";
import { BookingFlow } from "@/components/book/booking-flow";
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
 * ready, and what happens if you cannot make it. Three are answered outright.
 * The fourth needs a diary behind it, and the last screen of the flow says so
 * in the one place it matters, which is at the moment somebody presses confirm.
 *
 * Four questions on four screens rather than one long form. A booking is a short
 * sequence where each answer narrows the next, and asking them together produces
 * a form nobody finishes.
 *
 * Nothing under the flow: no framework note, and no metadata block. This screen
 * is a task, and a task should end at the last step rather than at a list of
 * things still to build. The metadata is in the `metadata` export above, which
 * is where a crawler reads it.
 *
 * No section index either, for the same reason: an index over a task is
 * furniture standing between somebody and the thing they came to do.
 */
export default function BookPage() {
  return (
    <PageShell>
      <PageHeading tag={page.tag} title={page.title} lead={page.lead} />

      <P className="mb-10">
        Fifteen or thirty minutes to talk through what you need. Nothing to
        prepare and nothing to bring, and you can move it or cancel any time
        without explaining why. If you would rather write it down than say it,{" "}
        <TextLink href={ROUTES.build} arrow>
          build your website
        </TextLink>{" "}
        instead and we will read it before we speak.
      </P>

      <BookingFlow />
    </PageShell>
  );
}
