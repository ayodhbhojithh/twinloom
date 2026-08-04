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

          One measure, one size of type, and the arranging done in the body
          itself rather than by anything here. The contents run down the side
          from `xl` and are dropped below that: an index of six headings is
          worth a column when there is a column spare and worth nothing at all
          when it costs the article its width. */}
      <div className="mt-9 grid gap-x-14 gap-y-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,200px)] xl:items-start">
        <article className="min-w-0">
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

            <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-2 xl:flex-col xl:gap-2.5">
              {heads.map((head, n) => (
                <li key={head} className="flex gap-2.5">
                  <span className="mt-[3px] font-mono text-[9px] font-bold text-idx tabular-nums">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${sectId(head)}`}
                    className="text-[12.5px] leading-[1.4] font-medium text-quiet transition-colors hover:text-ink"
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
