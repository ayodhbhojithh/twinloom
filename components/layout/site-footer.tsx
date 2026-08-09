import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import {
  FOOTER_COLUMNS,
  FOOTER_LEGAL,
  LEGAL,
  ROUTES,
  SITE,
} from "@/lib/site";

import { CutPanel, TopDisc } from "./cut-panel";

/**
 * The site footer.
 *
 * One cut surface, the same shape the landing card and every working screen are
 * built from. The year stands in the bite at the bottom left and the way back up
 * is a disc in the corner cut, so the last thing on the page is recognisably the
 * same site as the first rather than a slab bolted underneath it.
 *
 * No mark in a notch at the top. The header carries the name three lines above
 * the fold and it is still on screen at the foot of a short page; a second one
 * here was the site introducing itself on the way out. With nothing standing in
 * it the notch closes, and the surface keeps a clean top edge.
 *
 * Minimal by subtraction. There are no rules, no boxes and no fills inside the
 * surface: what separates one band from the next is space, and the shape does
 * the work an ornament would otherwise be asked to do.
 *
 * It invents nothing. There is no phone number, address or inbox here because
 * the site does not have those written down anywhere, and a footer is the last
 * place to start guessing at facts.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="page-frame pt-6 pb-7">
      {/* No bite at the bottom left any more, and the year has gone with it.

          It said the same thing the copyright line says a few pixels away, and
          it cost more than a duplicate: the bottom band has to clear whatever
          stands in that cut, so the registration wording underneath was indented
          past the width of it and lined up with nothing on the page. Without the
          cut the band starts where the content starts, and the small print reads
          down the same edge as everything above it. */}
      <CutPanel
        className="w-full"
        corner={<TopDisc />}
        foot={
          /* Last, smallest, and still legible. It is the one thing here nobody
             reads by choice, and burying it any further would be a decision
             about somebody else's rights - so it runs along the bottom band
             between the year and the way up, rather than above an empty
             strip. */
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-x-10 gap-y-4 lg:flex-row lg:items-end lg:justify-between">
              <p className="order-2 min-w-0 max-w-[74ch] text-[11.5px] leading-[1.55] text-label lg:order-1">
                {LEGAL.line}
              </p>

              {/* Right, at the far end of the row from the entity line.

                  The two are a pair - who we are on one side, the documents
                  that say so on the other - and putting both against the same
                  edge made one long ragged column of small print rather than a
                  band with something at each end.

                  At every width, not only from `lg`. Below that the row stacks
                  and the set was falling back to the left, so the same links
                  sat on a different edge depending on the size of the window.
                  Wrapped onto two lines it still ends on the right, which is
                  where the eye is now looking for it. */}
              <nav
                aria-label="Legal"
                className="order-1 min-w-0 text-right lg:order-2"
              >
                {/* Fourteen pixels tall is not a target, it is a line of type
                    that happens to be pressable. The padding gives each one the
                    height a thumb needs; the negative margin on the row keeps
                    the set sitting where it did on the line above. */}
                <ul className="-my-1 flex flex-wrap justify-end gap-x-5">
                  {FOOTER_LEGAL.map((link) => (
                    <li key={link.href} className="flex">
                      <Link
                        href={link.href}
                        className="py-1.5 text-[12.5px] font-medium text-quiet underline decoration-planned decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* The notice, last, and on the same left edge as the rest of the
                foot. It was centred, which put the only centred line on a page
                of left-aligned columns directly under them. */}
            <p className="text-[11.5px] leading-[1.55] text-quiet">
              &copy; {year} {LEGAL.entity}. {LEGAL.rights}
              <span className="sr-only"> {SITE.name}.</span>
            </p>
          </div>
        }
      >
        {/* Two blocks, not four columns.

            Given a column each across the whole width, three short lists of
            links spread until the gaps between them were wider than the links
            themselves. They are one thing - everywhere else on the site - so
            they hold together as a block against the right edge, and the ask
            holds the left. */}
        {/* Set proportions rather than `auto`. The links used to be shrunk to
            their own content and pushed right, so `auto` was small; left
            aligned they take what they are given, and `auto` gave them enough
            to wrap the tagline onto five lines. Two fractions say what each
            side is worth. */}
        <div className="grid gap-x-12 gap-y-11 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <div className="min-w-0">
            {/* The ask, in the words the about page ends on.

                It was "Send us your requirements" set as the heading itself -
                the offer and the way to take it in one line. What replaced it
                names the reader's position rather than our process: somebody at
                the foot of a page has not decided what they want yet, and
                "start with what you need" is the sentence that meets them
                there. The instruction it used to be is now the first button,
                which is where an instruction belongs.

                Two ways rather than three. Writing it down and putting it in
                the diary are the two anybody actually chooses between, and a
                third in a row of three is a third of the attention gone. */}
            <h2 className="max-w-[24ch] text-[clamp(21px,2.1vw,30px)] leading-[1.12] font-extrabold tracking-[-0.035em] text-ink">
              Start with what you need.
            </h2>

            <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.65] text-quiet">
              Tell us what you are looking to build, improve or connect. We will
              help you work out the rest.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Link
                href={ROUTES.build}
                className="group/way thread-fill inline-flex items-center gap-2 rounded-pill px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
              >
                Send us your requirements
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                  strokeWidth={2.4}
                />
              </Link>

              <Link
                href={ROUTES.book}
                className="group/way inline-flex items-center gap-2 rounded-pill bg-field px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hair"
              >
                Book a meeting
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>

          {/* Left aligned, on the edge everything above them starts from.

              Right aligned they read down a ragged edge, which is the harder
              way round for a list of names - and it only ever worked by
              accident: the moment the rows became flex items to give the links
              a thumb-sized target, `text-align` stopped reaching them and the
              headings sat right while their own links sat left.

              The legal row at the foot is the exception and stays right, but
              that is one line of small print rather than three columns of
              names to read down. */}
          {/* A row of columns, not a three column grid.

              A grid splits the whole width into three equal tracks, so the
              columns stood a third of the footer apart however small the gap
              between them was set - the space was in the tracks, not in the
              gap. As flex items they are each as wide as their longest link
              and sit next to one another, which is what a group of three short
              lists should look like.

              Pushed to the right end of the surface, where the legal row and
              the way back up already are. On the left they were three short
              lists with two thirds of the footer empty beside them; on the
              right the whole foot of the page ends on one edge. They wrap back
              to the left on a narrow screen, where there is no room to be
              anywhere else. */}
          <div className="flex flex-wrap gap-x-12 gap-y-8 sm:justify-end sm:gap-x-16">
            {FOOTER_COLUMNS.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className="min-w-0"
              >
                <h3 className="font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
                  {column.title}
                </h3>

                {/* The gap moved off the list and into the links.

                    Set on the list, the rows were fifteen pixels tall with ten
                    of air between them: a thumb aiming at one had a fifteen
                    pixel window and the ten pixels either side did nothing.
                    Made padding instead, the same rhythm now belongs to the
                    links, so each is a 25px target with no gap left to miss
                    into and the column looks exactly as it did. */}
                <ul className="mt-2.5 flex flex-col">
                  {column.links.map((link) => {
                    const className =
                      "py-1.5 text-[13.5px] leading-[1.3] font-medium text-quiet transition-colors hover:text-ink";

                    /* A section of the home page rather than a page of its
                       own, and `Link` mishandles the jump when the section is
                       on the page already open - see the header for the long
                       version. A plain anchor leaves it to the browser. */
                    return (
                      <li key={`${column.title}-${link.href}`} className="flex">
                        {link.href.includes("#") ? (
                          <a href={link.href} className={className}>
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className={className}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </CutPanel>
    </footer>
  );
}
