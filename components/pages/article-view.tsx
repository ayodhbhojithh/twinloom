import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { PageShell } from "@/components/layout";
import { ArticleBody } from "@/components/articles/bodies";
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
  const next = ARTICLES.filter((entry) => entry.slug !== article.slug).slice(
    0,
    2,
  );

  return (
    <PageShell>
      {/* White, like every other card on the site. The panel's own default is
          the canvas grey, and on a canvas page that makes the one card with a
          picture in it the one card that does not read as a card. */}
      <CutPanel
        tone="field"
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

      {/* The body, on a surface of its own and at a measure.

          It was running the full width of the window with the page showing
          through behind it, which is two faults at once: a line of nearly two
          hundred characters is a line nobody can find their way back along,
          and prose on the page's own grey reads as something that has not been
          set yet.

          White, inset, and capped at the reading measure the rest of the site
          uses. Centred, because the column is now narrower than the surface it
          sits on and the alternative is a page of type against one edge.

          The corner is 28, near the 34 that `CutPanel` settles on at this
          width. The head panel is directly above this one, and a much smaller
          radius under it does not read as a softer corner, it reads as a
          square one. */}
      <div className="mt-10 overflow-hidden rounded-[28px] bg-field px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
        <article className="mx-auto max-w-measure text-[16.5px] leading-[1.75] [&>*:first-child]:mt-0">
          <ArticleBody slug={article.slug} />
        </article>
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
