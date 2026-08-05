import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { PageShell } from "@/components/layout";
import { ArticleBody, CONTENTS } from "@/components/articles/bodies";
import { sectId } from "@/components/articles/kit";
import { ARTICLES, plateFor, type Article } from "@/lib/articles";
import { ROUTES } from "@/lib/site";

/**
 * One article.
 *
 * A document, in the shape a document is read in. No rules across it: space is
 * what separates the head from the piece and the piece from what follows, and a
 * line drawn as well is the same break said twice. The only rules left on the
 * page are the ones inside a section, where they are doing work.
 *
 * The head is the cut surface the rest of the site is built from, with the
 * piece's own picture in it. That part is unchanged, and deliberately: it is
 * how every other surface here opens, and an article that opened differently
 * would be the one page that had wandered off.
 *
 * What changed is everything under it. Every measure is set on the column now
 * rather than on each element, so the article takes the room it is given and
 * one number decides how wide a line gets. Capped per element, a paragraph
 * stopped at eighty characters while the heading above it stopped at twenty
 * four and the page they sat on was twice either - three different ideas of
 * how wide the page was, on the same page.
 *
 * Left aligned throughout, including the term column in a definition list,
 * which used to be set right. Ragged-left is a shape the eye has to find the
 * start of on every line, and in a column of terms beside their meanings it
 * put two edges in the middle of the page with nothing on either one.
 */
export function ArticleView({ article }: { article: Article }) {
  const heads = CONTENTS[article.slug] ?? [];
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

      {/* The article, and its contents beside it.

          The index is a second column only from `xl`, where there is width to
          spare. Below that it runs across the top as a short wrapped row: a
          fixed lane held open for four links is width the words could have had,
          and on this page the words are the whole of it. */}
      <div className="mt-12 grid gap-x-16 gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,190px)] xl:items-start">
        {/* One measure, set here, and set in pixels rather than characters.

            `72ch` came out at 681 and left a quarter of the page empty beside
            the index - a measure that ignores how much room it was actually
            given. A thousand is a ceiling instead: below it the column takes
            whatever the grid has, which on a laptop is the whole of it, and
            above it the line stops growing. Without a ceiling an ultrawide
            gives a single line of prose nineteen hundred pixels, and nobody
            finds the start of the next one. */}
        <article className="min-w-0 max-w-[1000px] text-[16.5px] leading-[1.75]">
          <ArticleBody slug={article.slug} />
        </article>

        {heads.length ? (
          <nav
            aria-label="In this article"
            className="quiet-scroll order-first min-w-0 xl:sticky xl:top-[calc(var(--nav-height)+24px)] xl:order-none xl:max-h-[calc(100svh-var(--nav-height)-48px)] xl:overflow-y-auto"
          >
            <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              In this article
            </p>

            {/* The gap lives in the rows rather than between them, so each
                entry is a target big enough to press on a phone. */}
            <ol className="-my-1 mt-2 flex flex-wrap gap-x-5 xl:-my-1 xl:flex-col xl:gap-x-0">
              {heads.map((head, n) => (
                <li key={head} className="flex gap-2.5">
                  <span className="mt-[7px] font-mono text-[9px] font-bold text-idx tabular-nums">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${sectId(head)}`}
                    className="py-1 text-[12.5px] leading-[1.4] font-medium text-quiet transition-colors hover:text-ink"
                  >
                    {head}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>

      {/* What to read next. Two, named, rather than a wall of everything. */}
      <div className="mt-16">
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
