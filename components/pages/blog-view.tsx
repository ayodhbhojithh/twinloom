import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { PageShell } from "@/components/layout";
import { ARTICLES, TOPICS } from "@/lib/articles";
import { ROUTES } from "@/lib/site";

/**
 * Blogs and articles.
 *
 * Four pieces, so this is not a feed. A grid of equal cards would be pretending
 * there is a stream here and would make the longest article look the same size
 * as the shortest; instead the first one takes the surface and the rest are a
 * numbered run beneath it, which is what a short list of considered pieces
 * actually looks like.
 *
 * The lead article stands on a cut surface, with its reading time in the bite
 * and the way in as the disc in the corner - the same arrangement the landing
 * card uses for the thing it wants you to open.
 */
export function BlogView() {
  const [lead, ...rest] = ARTICLES;

  return (
    <PageShell>
      <header className="mb-9 flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
        <div className="min-w-0">
          <p className="font-mono text-[9.5px] font-bold tracking-[0.16em] text-label uppercase">
            {ARTICLES.length} pieces · {TOPICS.length} subjects
          </p>

          <h1 className="mt-3 max-w-[20ch] text-[clamp(28px,3vw,44px)] leading-[1.04] font-extrabold tracking-[-0.04em] text-ink">
            Blogs and articles.
          </h1>
        </div>

        <p className="max-w-[46ch] text-[14px] leading-[1.55] text-quiet">
          The decisions behind a website, written out in full: what each piece of
          technology actually touches, what it costs to run, and where we would
          tell you to do something other than what we sell.
        </p>
      </header>

      {/* The lead piece, on the surface. */}
      <CutPanel
        className="w-full"
        toolbar={
          <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
            Start here
          </span>
        }
        aside={
          <div className="flex size-full flex-col items-center justify-center">
            <b className="font-mono text-[22px] leading-none font-bold text-ink tabular-nums">
              {lead.minutes}
            </b>
            <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
              Min
            </span>
          </div>
        }
        corner={
          <Link
            href={`${ROUTES.blog}/${lead.slug}`}
            aria-label={`Read ${lead.title}`}
            className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
          >
            <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
          </Link>
        }
      >
        <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
          {lead.topic}
        </p>

        <h2 className="mt-3 max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(24px,2.6vw,38px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink">
          <Link
            href={`${ROUTES.blog}/${lead.slug}`}
            className="transition-opacity hover:opacity-70"
          >
            {lead.title}
          </Link>
        </h2>

        <p className="mt-4 max-w-[64ch] text-[15px] leading-[1.6] text-body">
          {lead.lead}
        </p>
      </CutPanel>

      {/* The rest, as a numbered run. A short list of considered pieces reads
          better down the page than across it: the eye takes one title at a
          time, and the number says how few there are. */}
      <ol className="mt-4">
        {rest.map((article, n) => (
          <li key={article.slug}>
            <Link
              href={`${ROUTES.blog}/${article.slug}`}
              className="group/piece grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-2 rounded-[20px] px-5 py-6 transition-colors hover:bg-canvas sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-7"
            >
              <span className="mt-1 font-mono text-[11px] font-bold text-idx tabular-nums">
                {String(n + 2).padStart(2, "0")}
              </span>

              <span className="min-w-0">
                <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                  {article.topic}
                </span>

                <b className="mt-1.5 block max-w-[30ch] text-[clamp(18px,1.7vw,24px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
                  {article.title}
                </b>

                <span className="mt-2 block max-w-[62ch] text-[13.5px] leading-[1.55] text-quiet">
                  {article.note}
                </span>
              </span>

              <span className="col-start-2 flex items-center gap-3 sm:col-start-3 sm:mt-1 sm:justify-end">
                <span className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-label uppercase tabular-nums">
                  {article.minutes} min
                </span>
                <span
                  aria-hidden
                  className="flex size-8 flex-none items-center justify-center rounded-pill bg-well text-quiet transition-colors group-hover/piece:bg-ink group-hover/piece:text-white"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
