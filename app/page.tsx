import type { Metadata } from "next";

import { BuildNote } from "@/components/blocks/build-note";
import { PageMeta, type PageMetaValues } from "@/components/blocks/page-meta";
import { Item, List } from "@/components/blocks/prose";
import {
  AnswerBlock,
  Clauses,
  Closing,
  Included,
  Masthead,
} from "@/components/home";

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
 * is an argument, and it wants the full width and none of that furniture, so it
 * sets its own frame.
 *
 * The copy at the top is the framework's own, verbatim. What follows is this
 * page answering the framework's note about itself: the one line that says what
 * we do, then the single way in, made single by putting the first question on
 * this page rather than behind a button. The two the note asks for that are not
 * ours to invent, proof and price, are still listed at the foot as outstanding.
 *
 * Everything hangs off the same left edge and every band runs to the same right
 * one. The width is used by giving each block two columns or seven, rather than
 * by stretching a line of prose across the whole window.
 *
 * One client boundary, at `AnswerBlock`. Everything else is rendered on the
 * server and ships no JavaScript.
 */
export default function HomePage() {
  return (
    <div className="page-frame pt-6 pb-20 sm:pt-8 lg:pb-[110px]">
      <div className="max-w-wide">
        <Masthead />
        <AnswerBlock />

        <div className="mt-24 space-y-20">
          <Clauses />
          <Included />
          <Closing />
        </div>

        <div className="mt-20 max-w-measure border-t border-border pt-10">
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

          <PageMeta values={META} />
        </div>
      </div>
    </div>
  );
}
