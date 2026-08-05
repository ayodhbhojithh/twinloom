import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { PageShell } from "@/components/layout";
import { ARTICLES, TOPICS, plateFor } from "@/lib/articles";
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

        {/* Wider, and allowed to take what the row has left.

            It was capped at 46 characters and sat in a flex row that gives it
            whatever the headline does not want - so it wrapped to four short
            lines against a headline of three long ones, and the pair read as
            two columns that had failed to line up.

            `w-full` first and `flex-1` only from `sm`. Given `flex-1` at every
            width it shrank to nothing once the row wrapped on a phone - sixty
            pixels wide and twenty-two lines deep.  */}
        <p className="w-full min-w-0 max-w-[68ch] text-[14.5px] leading-[1.6] text-quiet sm:flex-1">
          The decisions behind a website, written out in full: what each piece
          of technology actually touches, what it costs to run, and where we
          would tell you to do something other than what we sell.
        </p>
      </header>

      {/* The lead piece, on the surface. */}
      {/* White, like the rows under it. The panel's own default is the canvas
          grey, which on a canvas page made the lead article the one card that
          did not read as a card while the three below it did. */}
      <CutPanel
        tone="field"
        className="w-full"
        image={plateFor(lead.slug)}
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

        <h2 className="mt-3 max-w-[min(18ch,var(--notch-free,62ch))] text-[clamp(24px,2.6vw,38px)] leading-[1.06] font-extrabold tracking-[-0.038em] text-ink">
          <Link
            href={`${ROUTES.blog}/${lead.slug}`}
            className="transition-opacity hover:opacity-70"
          >
            {lead.title}
          </Link>
        </h2>

        <p className="mt-4 max-w-[46ch] text-[15px] leading-[1.6] text-body lg:max-w-[42%]">
          {lead.lead}
        </p>
      </CutPanel>

      {/* The rest. Cards of their own rather than rows on the page: each one
          carries the ground, and each one carries its own picture on the right,
          so the list reads as three more of the thing above it rather than as
          an index underneath it. */}
      <ol className="mt-4 flex flex-col gap-3">
        {rest.map((article, n) => (
          <li key={article.slug}>
            <Link
              href={`${ROUTES.blog}/${article.slug}`}
              className="group/piece relative block overflow-hidden rounded-[22px] bg-field transition-colors hover:bg-well"
            >
              {/* The picture, on the right and faded into the ground it sits
                  on. The same arrangement as the card above, at the size a row
                  can carry. */}
              <span
                aria-hidden
                className="absolute inset-y-0 right-0 hidden w-[46%] lg:block"
              >
                <Image
                  src={plateFor(article.slug)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 46vw, 0px"
                  className="object-cover object-center"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 14%, rgba(0,0,0,0.2) 26%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.66) 52%, rgba(0,0,0,0.86) 68%, black 84%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.06) 14%, rgba(0,0,0,0.2) 26%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.66) 52%, rgba(0,0,0,0.86) 68%, black 84%)",
                  }}
                />

                {/* A wash of the row's own colour over the picture. The mask
                    thins it out towards the words; this puts what is left
                    behind the row rather than on top of it, so the left of
                    every card is the same shade as the card.

                    It has to follow the hover, not just the resting colour.
                    Held at white while the card went grey, the two met in a
                    line down the middle of the row and the card looked like
                    two cards. */}
                <span className="absolute inset-0 bg-field/35 transition-colors group-hover/piece:bg-well/35" />
              </span>

              <span className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-3 p-6 sm:p-7 lg:max-w-[56%]">
                <span className="mt-[3px] font-mono text-[11px] font-bold text-idx tabular-nums">
                  {String(n + 2).padStart(2, "0")}
                </span>

                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                      {article.topic}
                    </span>
                    <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-idx uppercase tabular-nums">
                      {article.minutes} min
                    </span>
                  </span>

                  <b className="mt-2 block max-w-[26ch] text-[clamp(18px,1.7vw,24px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
                    {article.title}
                  </b>

                  <span className="mt-2 block max-w-[46ch] text-[13.5px] leading-[1.55] text-quiet">
                    {article.note}
                  </span>

                  <span className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.14em] text-quiet uppercase transition-colors group-hover/piece:text-ink">
                    Read it
                    <span
                      aria-hidden
                      className="flex size-7 items-center justify-center rounded-pill bg-field text-quiet transition-colors group-hover/piece:bg-ink group-hover/piece:text-white"
                    >
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
