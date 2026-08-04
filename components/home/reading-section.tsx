import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CutPanel } from "@/components/layout/cut-panel";
import { ARTICLES, plateFor } from "@/lib/articles";
import { ROUTES } from "@/lib/site";

/**
 * Blogs and articles, on the landing page.
 *
 * The third screen, after the card and the tool. Somebody who has read the
 * first two either wants to start or wants to know how we think, and this is
 * the answer to the second - the pieces where we say what a thing costs to run
 * and where we would tell them to do something other than what we sell.
 *
 * The first article takes the surface and the rest are a short run beside it.
 * Four equal cards would say "here is a feed"; there is no feed, there are four
 * considered pieces, and the shape should say that before a word is read.
 */
export function ReadingSection() {
  const [lead, ...rest] = ARTICLES;

  return (
    <section className="page-frame pt-20 pb-16 lg:pt-32 lg:pb-20">
      {/* Left, over the wide surface that starts on the left. */}
      <div className="flex flex-col items-start text-left">
        <h2 className="section-head max-w-[38ch] text-ink">
          How we think.
          <span className="text-quiet">
            {" "}
            Decisions behind a website, written out.
          </span>
        </h2>

        <Link
          href={ROUTES.blog}
          className="group/all mt-6 inline-flex items-center gap-2 rounded-pill bg-field px-4.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
        >
          All {ARTICLES.length} pieces
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
          />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-stretch">
        {/* The lead piece, on the surface, with the picture cut to its own
            outline the way the landing card carries its photograph. */}
        <CutPanel
          tone="field"
          className="w-full"
          image={plateFor(lead.slug)}
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
          <div className="lg:max-w-[52%]">
            <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
              {lead.topic} · {lead.minutes} min
            </p>

            <h3 className="mt-3 max-w-[18ch] text-[clamp(20px,2vw,29px)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
              <Link
                href={`${ROUTES.blog}/${lead.slug}`}
                className="transition-opacity hover:opacity-70"
              >
                {lead.title}
              </Link>
            </h3>

            <p className="mt-3 max-w-[44ch] text-[14px] leading-[1.6] text-body">
              {lead.note}
            </p>
          </div>
        </CutPanel>

        {/* The other three, stacked, each carrying its own picture small. */}
        <ul className="flex flex-col gap-4">
          {rest.map((article) => (
            <li key={article.slug} className="flex-1">
              <Link
                href={`${ROUTES.blog}/${article.slug}`}
                className="group/piece flex h-full items-center gap-4 overflow-hidden rounded-[20px] bg-field p-4 transition-colors hover:bg-hair sm:p-5"
              >
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
                    {article.topic} · {article.minutes} min
                  </span>

                  <b className="mt-1.5 block max-w-[26ch] text-[15.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                    {article.title}
                  </b>
                </span>

                <span
                  aria-hidden
                  className="relative hidden size-[74px] flex-none overflow-hidden rounded-[14px] sm:block"
                >
                  <Image
                    src={plateFor(article.slug)}
                    alt=""
                    fill
                    sizes="74px"
                    className="object-cover transition-transform duration-500 group-hover/piece:scale-[1.06]"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
