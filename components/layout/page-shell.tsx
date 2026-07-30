import { Link as LinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { OnThisPage } from "./on-this-page";
import { PageNav } from "./page-nav";

/** One entry in the section index, and the section it points at. */
export interface PageSection {
  id: string;
  title: string;
}

/**
 * The page shell: the copy column, with the section index pinned beside it.
 *
 * No outer cap. The copy caps itself at the reading measure and the index is fixed
 * to the right gutter, so a wider window opens the space between the two rather
 * than stranding both on the left with a corridor of nothing to the right.
 *
 * A page declares its sections once, here, and passes the same entries to the
 * `Section` components below. That is one list rather than two, so the index can
 * never point at a section that does not exist.
 *
 * The draft also prints a `.url` line and an SEO metadata block on every screen.
 * Neither belongs on a real page: the URL is in the address bar, and the metadata
 * belongs in the route's `metadata` export where a crawler will actually read it.
 */
export function PageShell({
  sections = [],
  className,
  children,
}: {
  sections?: readonly PageSection[];
  className?: string;
  children?: React.ReactNode;
}) {
  const indexed = sections.length > 0;

  return (
    <div
      data-indexed={indexed || undefined}
      className={cn(
        "page-frame pt-8 pb-20 sm:pt-11 lg:pb-[110px] xl:pt-14",
        className,
      )}
    >
      <div className="min-w-0">
        {children}
        <PageNav />
      </div>

      {indexed ? <OnThisPage sections={sections} /> : null}
    </div>
  );
}

/**
 * The top of a page: the mono tag, the title, and the standfirst.
 *
 * `h1` here rather than the draft's `h2`. The draft is one document holding
 * forty-eight screens, so its screens could not each own an `h1`; a real page must,
 * and it is the first thing a screen reader is asked for.
 *
 * The ladder across this file is 38 / 26 / 19, each step a clear third smaller
 * than the one above it. The draft's own is 34 / 21 / 16.5, which puts its section
 * headings close enough to body text that a rule has to do the separating on its
 * own. Widening the gaps lets the type carry the structure and leaves the rules as
 * confirmation rather than as the only signal.
 */
export function PageHeading({
  tag,
  title,
  lead,
  children,
}: {
  tag?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {tag ? (
        <p className="mb-4 font-mono text-[12px] font-bold tracking-[0.18em] text-idx uppercase">
          {tag}
        </p>
      ) : null}

      <h1 className="mb-4 max-w-[980px] text-[30px] leading-[1.12] font-extrabold tracking-[-0.028em] text-ink sm:text-[38px]">
        {title}
      </h1>

      {lead ? (
        <p className="mb-6 max-w-measure text-[17.5px] leading-[1.6] text-ink sm:text-[19px]">
          {lead}
        </p>
      ) : null}

      {children}
    </div>
  );
}

/**
 * One section of a page.
 *
 * A rule above and space, which is the only divider the draft uses, with enough
 * of it that the rule reads as a break rather than as a box edge. The first
 * section drops the rule: a line immediately under the standfirst reads as an
 * underline for it rather than as the start of something new.
 *
 * `scroll-mt` keeps a jumped-to heading clear of the top edge rather than flush
 * against it.
 */
export function Section({
  id,
  title,
  first,
  className,
  children,
}: {
  id: string;
  title: string;
  first?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn(
        "scroll-mt-6",
        first
          ? "mt-8"
          : "mt-14 border-t border-border pt-12",
        className,
      )}
    >
      {/* The heading links to itself, revealed on hover. A page with a section
          index is a page whose sections get linked to, and the link people want
          is the one for the section they are looking at. */}
      <h2
        id={`${id}-heading`}
        className="group/h mb-4 flex items-baseline gap-2 text-[23px] leading-[1.22] font-bold tracking-[-0.02em] text-ink sm:text-[26px]"
      >
        {title}

        <a
          href={`#${id}`}
          aria-label={`Link to ${title}`}
          className="text-idx opacity-0 transition-opacity group-hover/h:opacity-100 focus-visible:opacity-100"
        >
          <LinkIcon aria-hidden className="size-3.5" />
        </a>
      </h2>

      {children}
    </section>
  );
}

/**
 * A subsection: a heading inside a section, with no rule.
 *
 * The rule is what says "new section", so a subsection must not have one or the
 * two levels look identical and the hierarchy collapses. Space and a smaller
 * heading do the work instead, which is the arrangement every well set document
 * uses and the one the reference uses too.
 *
 * It takes an id like a section does, because a subsection is still a place
 * somebody may want to link to, but it does not appear in the page index. An index
 * listing every heading stops being a summary.
 */
export function SubSection({
  id,
  title,
  className,
  children,
}: {
  id?: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={cn("mt-9 scroll-mt-6", className)}>
      <h3
        className={cn(
          "mb-3 text-[18px] leading-[1.3] font-bold tracking-[-0.012em] text-ink sm:text-[19.5px]",
          id && "group/h flex items-baseline gap-2",
        )}
      >
        {title}

        {id ? (
          <a
            href={`#${id}`}
            aria-label={`Link to ${title}`}
            className="text-idx opacity-0 transition-opacity group-hover/h:opacity-100 focus-visible:opacity-100"
          >
            <LinkIcon aria-hidden className="size-3.5" />
          </a>
        ) : null}
      </h3>

      {children}
    </div>
  );
}
