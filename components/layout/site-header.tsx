"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { RailNav } from "./rail-nav";
import { Wordmark } from "./wordmark";

import { HEADER_CTA, HEADER_NAV, ROUTES } from "@/lib/site";
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

export function SiteHeader() {
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
      const gone = Math.min(Math.max(window.scrollY, 0) / FADE_OVER, 1);
      node.style.setProperty("--header-fade", String(1 - gone));
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
  }, []);

  /* No rule under it, and opaque. The two go together: a translucent bar shows the
     page sliding through it, and without a rule there is nothing left to mark where
     the header stops. Opaque also removes the shimmer, since a blurred backdrop has
     to recomposite the whole strip on every scroll frame.

     What marks where it stops is `.header-fade`: the bar's own white running out
     over the fourteen pixels below it. The bar is white and the page is the
     tinted ground, so the two met in a hard line across the whole window - a
     rule by accident on a header that deliberately has none. A fade is that
     edge given to the page rather than drawn on it. */
  return (
    <header ref={bar} className="header-fade sticky top-0 z-40 bg-field">
      <div className="page-frame flex items-center gap-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center">
          <Wordmark />
        </div>

        <nav
          aria-label="Primary"
          className="hidden shrink-0 flex-nowrap items-center gap-x-4 xl:flex 2xl:gap-x-6"
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
                  "text-[13.5px] whitespace-nowrap hover:underline 2xl:text-[14.5px]",
                  on ? "font-semibold text-mark" : "text-quiet hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
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

          {/* Inset by the sheet's own gutter less the marker's hang, so the
              labels land on the same left edge as the name above them and the
              button below them while the 2px bar sits out in the gutter. The
              rail hangs its markers off the panel edge for the same reason; a
              sheet has a gutter to hang them into, so they hang into that. */}
          <nav
            aria-label="All pages, mobile"
            className="flex-1 overflow-x-hidden overflow-y-auto pb-8 pe-5 ps-2 sm:pe-8 sm:ps-5"
          >
            <RailNav
              size="menu"
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </nav>

          <div className="border-t border-border px-5 py-4 sm:px-8">
            <Link
              href={HEADER_CTA.href}
              onClick={() => setOpen(false)}
              className="block rounded-field bg-mark px-3.5 py-2.5 text-center text-[15px] font-semibold text-white"
            >
              {HEADER_CTA.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
