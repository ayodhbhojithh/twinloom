import { cn } from "@/lib/utils";

import { OnThisPage } from "./on-this-page";

/** One entry in the section index, and the section it points at. */
export interface PageSection {
  id: string;
  title: string;
}

/**
 * The page shell: the copy column, and the section index beside it.
 *
 * Measures are the draft's. 1100px when there is no index, 1360px when there is,
 * with a 48px gutter and a 212px index. Prose inside is capped at 720px by the
 * base styles, because a 1100px line of 16.5px text is unreadable however wide the
 * screen is; the extra width is for tables and boxes, not for paragraphs.
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
      className={cn(
        "px-5 pt-8 pb-20 sm:px-8 sm:pt-11 lg:px-10 lg:pb-[110px] xl:px-14 xl:pt-14",
        indexed ? "max-w-[1360px]" : "max-w-[1100px]",
        className,
      )}
    >
      <div className={cn(indexed && "xl:flex xl:items-start xl:gap-12")}>
        <div className="min-w-0 flex-1">{children}</div>

        {indexed ? <OnThisPage sections={sections} /> : null}
      </div>
    </div>
  );
}

/**
 * The top of a page: the mono tag, the title, and the standfirst.
 *
 * `h1` here rather than the draft's `h2`. The draft is one document holding
 * forty-eight screens, so its screens could not each own an `h1`; a real page must,
 * and it is the first thing a screen reader is asked for.
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
    <div className="mb-7">
      {tag ? (
        <p className="mb-4 font-mono text-[12px] font-bold tracking-[0.18em] text-idx uppercase">
          {tag}
        </p>
      ) : null}

      <h1 className="mb-4 max-w-[900px] text-[27px] leading-[1.14] font-extrabold tracking-[-0.025em] text-ink sm:text-[34px]">
        {title}
      </h1>

      {lead ? (
        <p className="mb-[26px] max-w-[760px] text-[18px] leading-[1.55] text-ink sm:text-[20px]">
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
 * A rule above and space, which is the only divider the draft uses. The first
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
          ? "mt-7"
          : "mt-10 border-t border-border pt-8",
        className,
      )}
    >
      <h2
        id={`${id}-heading`}
        className="mb-2.5 text-[19px] leading-[1.25] font-bold tracking-[-0.012em] text-ink sm:text-[21px]"
      >
        {title}
      </h2>

      {children}
    </section>
  );
}
