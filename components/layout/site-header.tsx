"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Mail, Menu, Phone, X } from "lucide-react";

import { RailNav } from "./rail-nav";
import { Wordmark } from "./wordmark";

import { CONTACT_INFO, HEADER_CTA, HEADER_NAV, ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The site header.
 *
 * The name at 700 in ink and the links in the quiet grey. No logo mark, no
 * shadow and no rule: the page starts far enough below that a line would only
 * draw a boundary the space already draws.
 *
 * Nothing on it but navigation. The call to action and the contact disc were at
 * the right hand end and both came off: every page ends in the two ways in, the
 * landing page carries them a row under the headline, and `Book a meeting` and
 * `Contact` are two of the eight links here - so that end of the bar held a
 * third and fourth copy of what was already on screen.
 *
 * Three zones with equal weight on the outside, so the links sit on the header's
 * true centre line rather than wherever the brand happens to end. Nothing wraps at
 * any width: a header that grows a second row as the window narrows shoves the
 * whole page down as it does it.
 *
 * What is shown when: the eight links arrive at `xl`, which is the first width
 * that holds them beside the brand without crowding. Below that the menu button
 * appears in their place and the sheet carries the same list - and the sheet
 * keeps a way in at its foot, because a phone has no bar to have lost it from.
 *
 * The menu used to stop at `lg` because the docked rail covered everything
 * above it. There is no rail now, so the two have to meet exactly: one of them
 * is on at every width, and between them every page is always one press away.
 */
/**
 * How far the page travels while the fade goes out, in pixels.
 *
 * Long enough that the change is a fade rather than an event, short enough that
 * it is over before anybody has read anything. Twenty is about one notch of a
 * wheel.
 */
const FADE_OVER = 20;

export function SiteHeader({
  bare,
  appear,
}: { bare?: boolean; appear?: number } = {}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /* The fade under the bar, tied to how far the page has gone.

     It is only right while it is covering nothing. At the top of a page there is
     nothing under the header but the ground, and the fade softens white meeting
     grey; once anything is scrolled there is content under it, and white over
     whatever is passing is a smear rather than a soft edge.

     A position, not a state. This was a boolean flipped at four pixels with a
     CSS transition trying to smooth the flip, and the two fought: the switch
     fires a frame late, the transition restarts from wherever it was
     interrupted, and a scroll that crosses four pixels more than once restarts
     it each time. What you see is a flick. Read as `1` at the top falling to
     `0` by twenty pixels, there is no threshold to cross and nothing to animate:
     the fade simply is wherever the page is.

     Written onto the element rather than through state. It changes every frame
     while the wheel is moving, and re-rendering a header sixty times a second to
     carry one number is the wrong way to carry one number. */
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = bar.current;
    if (!node) return;

    let frame = 0;

    const settle = () => {
      frame = 0;
      const down = Math.max(window.scrollY, 0);
      const gone = Math.min(down / FADE_OVER, 1);
      node.style.setProperty("--header-fade", String(1 - gone));

      /* And whether the bar is here at all.

         Only the copy that waits for the scroll has an `appear`, and it is a
         threshold rather than a ramp: a bar that is a third of the way in is a
         bar in the way. Written to the element for the same reason the fade is -
         it is read on every scroll frame and it is one value. */
      if (appear !== undefined) {
        node.dataset.here = down > appear ? "yes" : "no";
      }
    };

    const again = () => {
      if (!frame) frame = requestAnimationFrame(settle);
    };

    settle();
    window.addEventListener("scroll", again, { passive: true });
    window.addEventListener("resize", again);

    return () => {
      window.removeEventListener("scroll", again);
      window.removeEventListener("resize", again);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [appear]);

  /* No rule under it, and opaque. The two go together: a translucent bar shows the
     page sliding through it, and without a rule there is nothing left to mark where
     the header stops. Opaque also removes the shimmer, since a blurred backdrop has
     to recomposite the whole strip on every scroll frame.

     What marks where it stops is `.header-fade`: the bar's own white running out
     over the fourteen pixels below it. The bar is white and the page is the
     tinted ground, so the two met in a hard line across the whole window - a
     rule by accident on a header that deliberately has none. A fade is that
     edge given to the page rather than drawn on it. */
  /* Two headers, one component.

     Everywhere but the landing page it is the page's own bar: stuck to the top
     of the window, on the card white, with a fade under it so it does not meet
     the tinted ground in a hard line.

     On the landing page it stands inside the card. Nothing there is true any
     more - it is not at the top of the window, it has the card's white under it
     already, and a fade below it would be a fade in the middle of a picture. So
     `bare` takes all three off and leaves the row of links, which is the part
     that was ever the header. */
  return (
    <header
      ref={bar}
      className={cn(
        bare
          ? /* Inside the card, and the box that places it takes no clicks - so
               this has to take its own, or every link in it is dead. */
            "pointer-events-auto relative z-30"
          : appear === undefined
            ? "header-fade sticky top-0 z-40 bg-field"
            : /* Fixed, not sticky, and that is the whole of it: a sticky element
                 still takes its place in the flow, so this one reserved a bar's
                 height at the top of the landing page and left an empty band
                 above the card while it was translated out of sight. Fixed takes
                 nothing, which is right for a bar that is not there yet. */
              "header-fade fixed inset-x-0 top-0 z-40 bg-field",
        /* The copy that waits for the scroll.

           Off the top of the window and out of the pointer's way until the page
           has moved past whatever is at the top of it, then down. A transition
           on the transform and the opacity rather than on `display`, because a
           bar that appears is a bar that was already there. */
        appear !== undefined &&
          "transition-[transform,opacity] duration-300 ease-out data-[here=no]:pointer-events-none data-[here=no]:-translate-y-full data-[here=no]:opacity-0",
      )}
      data-here={appear !== undefined ? "no" : undefined}
    >
      <div className="page-frame flex items-center gap-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center">
          <Wordmark />
        </div>

        <nav
          aria-label="Primary"
          className="hidden shrink-0 flex-nowrap items-center gap-x-5 xl:flex 2xl:gap-x-7"
        >
          {HEADER_NAV.map((item) => {
            /* `startsWith` so a child route still marks its parent, but the home
               route has to match exactly or it would mark on every page. */
            const on =
              item.href === ROUTES.home
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  /* One size, not two.

                     It was 13.5 stepping to 14.5 at the widest breakpoint, which
                     is a step nobody sees and two numbers to keep. Fifteen at
                     every width, which is what the buttons under it are set at -
                     a bar of links smaller than every other line on the page
                     reads as a bar somebody shrank to make it fit. */
                  "text-[15px] whitespace-nowrap hover:underline",
                  on ? "font-semibold text-mark" : "text-quiet hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* The far right, and only as wide as what is in it.

            It used to be a third column with `flex-1` on it, which made the row
            three equal parts and left the nav sitting in the middle of the bar.
            That was fine while the header stood on its own; inside the landing
            card the notch is cut into the middle of the same edge, and the links
            ran straight through it.

            The name is left, the pages are right, and the middle is empty - so
            whatever the card puts in its top edge has the room, and every other
            page gets the arrangement a bar of links has anyway. */}
        <div className="flex shrink-0 items-center gap-2">
          {/* No call to action here, and no contact disc.

              Both were removed on purpose. Every page of this site already
              ends in the two ways in, the landing page carries them a row
              below the headline, and `Book a meeting` and `Contact` are two of
              the eight links in the bar - so the right hand end held a third
              and fourth copy of things already on screen.

              What is left is the name, the pages, and the way into the menu.
              A bar that only navigates is a bar nobody has to read twice. */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex size-8 shrink-0 items-center justify-center rounded-field text-ink transition-colors hover:bg-hair xl:hidden"
          >
            <Menu className="size-[18px]" />
          </button>
        </div>
      </div>

      {/* A panel rather than a library sheet: it is a list of links over a white
          field, and the whole header is already hairlines and type. */}
      {open ? (
        <div
          id="site-menu"
          className="fixed inset-0 z-50 flex flex-col bg-field xl:hidden"
        >
          <div className="flex items-center gap-4 border-b border-border px-5 py-2.5 sm:px-8">
            <Wordmark as="text" className="min-w-0" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-field text-ink transition-colors hover:bg-hair"
            >
              <X className="size-[18px]" />
            </button>
          </div>

          {/* One gutter, both sides.

              It used to be inset on the leading edge only, so the 2px marker
              could hang out into the sheet's own padding and the labels still
              lined up with the name above them. There is no marker now - the
              current row is filled instead - so there is nothing to hang, and
              a list whose rows are the target wants its rows to reach both
              edges of the sheet. */}
          <nav
            aria-label="All pages, mobile"
            className="flex-1 overflow-x-hidden overflow-y-auto px-3 pt-3 pb-8 sm:px-6"
          >
            <RailNav
              size="menu"
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </nav>

          {/* The foot: both ways in, and how to reach a person.

              It was one flat blue rectangle across the width of the sheet, which
              is the shape of an app's primary button and the one shape this site
              does not draw - everything else here is a pill. And it offered one
              of the two things somebody opens this menu to do; the other,
              booking a time, was a row in the list above with no more weight
              than `FAQs`.

              Two pills, then, the loud one carrying the mark's own gradient. And
              under them the phone number and the address, because a menu open on
              a phone is the one place on this site where the fastest thing to do
              is press a number. */}
          <div className="border-t border-border px-5 py-4 sm:px-8">
            <div className="flex gap-2.5">
              <Link
                href={ROUTES.book}
                onClick={() => setOpen(false)}
                className="group/way inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-canvas px-4 py-3 text-[14.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hair"
              >
                Book a meeting
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
                />
              </Link>

              <Link
                href={HEADER_CTA.href}
                onClick={() => setOpen(false)}
                className="group/way thread-fill inline-flex flex-1 items-center justify-center gap-2 rounded-pill px-4 py-3 text-[14.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
              >
                {HEADER_CTA.label}
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
                />
              </Link>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
              <a
                href={CONTACT_INFO.phoneHref}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-body transition-colors hover:text-ink"
              >
                <Phone aria-hidden className="size-3.5 text-label" />
                {CONTACT_INFO.phone}
              </a>

              <a
                href={`mailto:${CONTACT_INFO.primaryEmail}`}
                className="inline-flex items-center gap-1.5 text-[13px] text-quiet transition-colors hover:text-ink"
              >
                <Mail aria-hidden className="size-3.5 text-label" />
                {CONTACT_INFO.primaryEmail}
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
