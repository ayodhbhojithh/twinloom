import type { Metadata } from "next";

import { BuildNote } from "@/components/blocks/build-note";
import { PageMeta, type PageMetaValues } from "@/components/blocks/page-meta";
import { Item, List } from "@/components/blocks/prose";
import { Closing, Hero, Included, LiveDemo, Steps } from "@/components/home";

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
 * Not a `PageShell`. Every other screen here is a document, with a reading
 * measure, a section index and a previous/next pair at the foot of it. This one
 * is an argument, and it needs the full width and none of that furniture, so it
 * sets its own frame.
 *
 * The order is the argument: make the claim, let them test it, explain what just
 * happened, say what it costs, ask again. The tool sits second rather than last
 * because it is the only thing on the page that proves anything, and a proof
 * nobody scrolls to is not a proof.
 *
 * One client boundary, at `LiveDemo`. Everything else is rendered on the server
 * and ships no JavaScript.
 */
export default function HomePage() {
  return (
    <div className="page-frame pt-6 pb-20 sm:pt-8 lg:pb-[110px]">
      <div className="max-w-wide">
        <Hero />
        <LiveDemo />

        <div className="mt-16 space-y-16">
          <Steps />
          <Included />
        </div>

        <Closing />

        <div className="mt-16 border-t border-border pt-10">
          <BuildNote>
            <List className="mb-0">
              <Item>
                Enough proof that somebody feels safe starting: named work, or
                named clients.
              </Item>
              <Item>
                A short answer to &ldquo;what will this cost me&rdquo;, now that
                pricing is off the nav.
              </Item>
            </List>
          </BuildNote>

          <PageMeta values={META} />
        </div>
      </div>
    </div>
  );
}
