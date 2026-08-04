import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { PageShell } from "@/components/layout";
import {
  ARTICLES,
  type Article,
  type Block,
  type Section,
  plateFor,
} from "@/lib/articles";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/site";

/**
 * One article.
 *
 * The head stands on a cut surface, because that is what the site does with the
 * thing a page is about. Under it the article is a plain column, because that
 * is what the site should do with six thousand words: one measure, one size of
 * type, and nothing in the margin competing for the eye.
 *
 * The contents run down the side from `xl` and are dropped below it. An index
 * of eight headings is worth a column when there is a column spare, and is
 * worth nothing at all when it costs the article its width.
 */
export function ArticleView({ article }: { article: Article }) {
  const heads = article.sections.filter((section) => section.h);
  const next = ARTICLES.filter((entry) => entry.slug !== article.slug).slice(
    0,
    2,
  );

  return (
    <PageShell>
      <CutPanel
        className="w-full"
        image={plateFor(article.slug)}
        toolbar={
          <Link
            href={ROUTES.blog}
            className="group/back flex h-10 w-full items-center justify-center gap-2 text-[13px] font-semibold text-quiet transition-colors hover:text-ink"
          >
            <ArrowLeft
              aria-hidden
              className="size-3.5 transition-transform group-hover/back:-translate-x-0.5"
            />
            Blogs and articles
          </Link>
        }
        aside={
          <div className="flex size-full flex-col items-center justify-center">
            <b className="font-mono text-[22px] leading-none font-bold text-ink tabular-nums">
              {article.minutes}
            </b>
            <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
              Min
            </span>
          </div>
        }
      >
        {/* The picture holds the right fifty five, the words what is left of
            the left. One card rather than two columns: the picture is cut to
            the surface's own outline, so there is no second edge in it - and
            the words stop short of the fade rather than running into it. */}
        <div className="max-w-full lg:max-w-[46%]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            {article.topic}
          </p>

          <h1 className="mt-3 max-w-[min(22ch,var(--notch-free,62ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            {article.title}
          </h1>

          <p className="mt-4 max-w-[46ch] text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
            {article.lead}
          </p>
        </div>
      </CutPanel>

      <div className="mt-10 grid gap-x-16 gap-y-10 xl:grid-cols-[minmax(0,78ch)_minmax(0,200px)] xl:items-start xl:justify-between">
        <article className="min-w-0">
          {article.sections.map((section, n) => (
            <Part key={section.h || `open-${n}`} section={section} at={n} />
          ))}
        </article>

        {heads.length > 3 ? (
          <nav
            aria-label="In this article"
            className="quiet-scroll hidden min-w-0 xl:sticky xl:top-[calc(var(--nav-height)+24px)] xl:block xl:max-h-[calc(100svh-var(--nav-height)-48px)] xl:overflow-y-auto"
          >
            <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              In this article
            </p>

            <ol className="mt-3.5 flex flex-col gap-2.5">
              {heads.map((section, n) => (
                <li key={section.h} className="flex gap-3">
                  <span className="mt-[3px] font-mono text-[9px] font-bold text-idx tabular-nums">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${headId(section.h)}`}
                    className="text-[12.5px] leading-[1.4] font-medium text-quiet transition-colors hover:text-ink"
                  >
                    {section.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>

      {/* What to read next. Two, named, rather than a wall of everything. */}
      <div className="mt-14">
        <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
          Read next
        </p>

        <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
          {next.map((entry) => (
            <Link
              key={entry.slug}
              href={`${ROUTES.blog}/${entry.slug}`}
              className="group/next flex flex-col rounded-[18px] bg-canvas p-5 transition-colors hover:bg-canvas-firm"
            >
              <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                {entry.topic} · {entry.minutes} min
              </span>

              <b className="mt-2 block max-w-[28ch] text-[16px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                {entry.title}
              </b>

              <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.12em] text-quiet uppercase transition-colors group-hover/next:text-ink">
                Read it
                <ArrowUpRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

/**
 * One section of the article.
 *
 * The sources are not a flat run of paragraphs, and setting them as one would
 * throw away the structure their authors wrote in. Two shapes turn up in all
 * four: a section of questions people ask, where every sub-heading is a
 * question, and a section of named things - platforms, technologies, kinds of
 * sale - where every sub-heading names one of them.
 *
 * Both are set as what they are. The questions become cards, so an answer can
 * be found by scanning for its question rather than by reading past it, and the
 * named things get their name in the margin, so the list can be run down the
 * left edge without reading a word of it.
 */
function Part({ section, at }: { section: Section; at: number }) {
  /* Sub-headings and the blocks that belong to them, which is what the source
     means by an h followed by paragraphs. */
  const groups: { h: string; b: Block[] }[] = [];
  for (const block of section.b) {
    if (block.k === "h") groups.push({ h: block.t, b: [] });
    else {
      if (!groups.length) groups.push({ h: "", b: [] });
      groups[groups.length - 1].b.push(block);
    }
  }

  const asked = /^questions/i.test(section.h);

  return (
    <section
      id={section.h ? headId(section.h) : undefined}
      className="scroll-mt-[calc(var(--nav-height)+24px)]"
    >
      {section.h ? (
        <h2 className="mt-14 mb-5 flex items-start gap-4 first:mt-0">
          <span className="mt-[9px] font-mono text-[10px] font-bold text-mark tabular-nums">
            {String(at).padStart(2, "0")}
          </span>
          <span className="max-w-[26ch] text-[clamp(20px,1.8vw,27px)] leading-[1.14] font-extrabold tracking-[-0.03em] text-ink">
            {section.h}
          </span>
        </h2>
      ) : null}

      {asked ? (
        <div className="flex max-w-[76ch] flex-col gap-2.5">
          {groups.map((group, n) => (
            <div key={n} className="rounded-[18px] bg-canvas p-5 sm:p-6">
              <b className="block max-w-[52ch] text-[15.5px] leading-[1.35] font-extrabold tracking-[-0.02em] text-ink">
                {group.h}
              </b>
              {group.b.map((block, k) => (
                <Piece key={k} block={block} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        groups.map((group, n) =>
          group.h ? (
            /* The name in the margin, the words beside it. A run of named
               things is a list even when it is written as prose, and this is
               the least drawing that makes it read as one. */
            <div
              key={n}
              className="mt-7 grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
            >
              <b className="text-[14px] leading-[1.35] font-extrabold tracking-[-0.02em] text-ink sm:mt-[5px] sm:text-right">
                {group.h}
              </b>
              <div className="min-w-0">
                {group.b.map((block, k) => (
                  <Piece key={k} block={block} first={k === 0} />
                ))}
              </div>
            </div>
          ) : (
            <div key={n}>
              {group.b.map((block, k) => (
                <Piece key={k} block={block} first={k === 0 && at === 0} />
              ))}
            </div>
          ),
        )
      )}
    </section>
  );
}

/** A heading, as something a link can point at. */
const headId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** One block of the article, at the one size the article is set in. */
function Piece({ block, first }: { block: Block; first?: boolean }) {
  if (block.k === "h") {
    return (
      <b className="mt-7 mb-2 block max-w-[62ch] text-[15.5px] leading-[1.3] font-bold text-ink">
        {block.t}
      </b>
    );
  }

  if (block.k === "table") {
    return (
      /* A table, set as one. These carry the comparisons the articles are
         actually written around - what each platform is, who it suits, what it
         costs - and running them together as prose, which is what a flat
         renderer does to a pipe table, makes the one thing worth scanning the
         one thing nobody can. */
      <div className="quiet-scroll mt-6 mb-2 max-w-[76ch] overflow-x-auto rounded-[16px] bg-canvas">
        <table className="w-full min-w-[540px] border-collapse text-left">
          <thead>
            <tr>
              {block.h.map((cell, n) => (
                <th
                  key={n}
                  className="px-5 py-3.5 font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {block.r.map((row, n) => (
              <tr key={n} className="align-top">
                {row.map((cell, k) => (
                  <td
                    key={k}
                    className={cn(
                      "px-5 py-3.5 text-[13.5px] leading-[1.55]",
                      k === 0 ? "font-semibold text-ink" : "text-body",
                    )}
                  >
                    <Bold text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.k === "ul") {
    return (
      <ul className="mt-4 mb-4 flex max-w-[72ch] flex-col gap-2">
        {block.i.map((item, n) => (
          <li key={n} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[9px] size-1 flex-none rounded-pill bg-mark"
            />
            <span className="text-[15px] leading-[1.65] text-body">
              <Bold text={item} />
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      className={cn(
        "max-w-[72ch] text-[15px] leading-[1.72] text-body",
        first ? "mt-0" : "mt-4",
      )}
    >
      <Bold text={block.t} />
    </p>
  );
}

/**
 * The only mark-up the source uses inside a line.
 *
 * Splitting on the pairs rather than reaching for a markdown renderer: one
 * pattern in four articles does not justify shipping a parser to every reader
 * of the page.
 */
function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, n) =>
        n % 2 ? (
          <b key={n} className="font-bold text-ink">
            {part}
          </b>
        ) : (
          part
        ),
      )}
    </>
  );
}
