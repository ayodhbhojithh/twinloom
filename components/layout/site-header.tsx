"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";

import { RailNav } from "./rail-nav";
import { Wordmark } from "./wordmark";

import { HEADER_NAV, ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The site header.
 *
 * The name at 700 in ink, the links in the quiet grey, and one call to action
 * pushed to the right. No logo mark, no shadow and no rule: the page starts far
 * enough below that a line would only draw a boundary the space already draws.
 *
 * One departure: the draft outlines the call to action in ink, reserving ink for
 * primary actions. This fills it in `active` instead, the system's only accent, so
 * the one thing the site wants you to do is the one coloured thing in the chrome.
 *
 * The draft renders the nav as inert spans because it is a single file prototype
 * that switches screens with JavaScript. Here they are real links, and the one
 * matching the current route is marked, which the prototype had no way to do.
 *
 * Three zones with equal weight on the outside, so the links sit on the header's
 * true centre line rather than wherever the brand happens to end. Nothing wraps at
 * any width: a header that grows a second row as the window narrows shoves the
 * whole page down as it does it.
 *
 * Every control on the bar is 32px tall and shares one radius, so the search field,
 * the call to action and the menu button read as one set rather than three
 * borrowed parts.
 *
 * What is shown when: the eight links arrive at `xl`, which is the first width
 * that holds them, the brand and the call to action without crowding. Below that
 * the menu button appears in their place and the sheet carries the same list.
 *
 * The menu used to stop at `lg` because the docked rail covered everything
 * above it. There is no rail now, so the two have to meet exactly: one of them
 * is on at every width, and between them every page is always one press away.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const landing = pathname === ROUTES.home;

  /* No rule under it, and opaque. The two go together: a translucent bar shows the
     page sliding through it, and without a rule there is nothing left to mark where
     the header stops. Opaque also removes the shimmer, since a blurred backdrop has
     to recomposite the whole strip on every scroll frame. */
  return (
    <header className="sticky top-0 z-40 bg-field">
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
