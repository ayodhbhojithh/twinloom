"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";

import { RailNav } from "./rail-nav";
import { Wordmark } from "./wordmark";

import { HEADER_CTA, HEADER_NAV, ROUTES } from "@/lib/site";
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
 * What is shown when: the brand and the way into the menu are always there; the
 * search field arrives at `lg`, where the rail has docked and there is room; the
 * seven links arrive at `2xl`, which is the first width at which all four zones fit
 * without crowding. Nothing is lost below those widths, because the menu carries
 * the whole rail and the rail carries every page.
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
          className="hidden shrink-0 flex-nowrap items-center gap-x-6 2xl:flex"
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
                  "text-[14.5px] whitespace-nowrap hover:underline",
                  on ? "font-semibold text-mark" : "text-quiet hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          {/* Not on the landing page. The hero already carries this exact button
              one row below, and the same call to action twice in one eyeline
              reads as a mistake rather than as emphasis. Every other route keeps
              it, where it is the only standing way to the build page. */}
          {landing ? null : (
            <Link
              href={HEADER_CTA.href}
              className="hidden h-8 shrink-0 items-center rounded-field bg-mark px-3.5 text-[13.5px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:inline-flex"
            >
              {HEADER_CTA.label}
            </Link>
          )}

          {/* No border on it. The header carries none, and a ring drawn round a
              20px icon is more line than the icon has. */}
          <Link
            href={ROUTES.contact}
            aria-label="Contact us"
            title="Contact us"
            className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-well text-ink transition-colors hover:bg-hair"
          >
            <UserRound className="size-[17px]" strokeWidth={1.9} />
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex size-8 shrink-0 items-center justify-center rounded-field text-ink transition-colors hover:bg-hair lg:hidden"
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
          className="fixed inset-0 z-50 flex flex-col bg-field lg:hidden"
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

          {/* The same gutter as the name above it and the button below it, so the
              three parts of the sheet share one left edge. The list used to sit
              on a tighter one and carry the difference as padding of its own,
              which put the links a few pixels inside everything else. */}
          <nav
            aria-label="All pages, mobile"
            className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-8 sm:px-8"
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
