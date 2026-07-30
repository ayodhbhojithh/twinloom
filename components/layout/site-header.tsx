"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { HEADER_CTA, HEADER_NAV, RAIL_GROUPS, ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The site header.
 *
 * The draft's own: a hairline under it, the name at 700 in ink, seven links in
 * the quiet grey, and one call to action pushed to the right. No logo mark and no
 * shadow. The rule under it is the only thing separating it from the page, which
 * is the same device the page uses between its own sections.
 *
 * One departure: the draft outlines the call to action in ink, reserving ink for
 * primary actions. This fills it in `active` instead, the system's only accent, so
 * the one thing the site wants you to do is the one coloured thing in the chrome.
 *
 * The draft renders the nav as inert spans because it is a single file prototype
 * that switches screens with JavaScript. Here they are real links, and the one
 * matching the current route is marked, which the prototype had no way to do.
 *
 * Below the nav's breakpoint the links move into a panel rather than wrapping.
 * Seven items at 14.5px wrap to three ragged rows on a phone, and a header that
 * changes height as it wraps pushes the page around underneath it.
 *
 * That panel carries the whole rail, not the seven. The rail is the site's real
 * navigation and it is hidden below `lg`, so without this a phone could reach
 * seven pages out of forty-eight.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-field">
      <div className="flex items-center gap-5 px-5 py-3 sm:px-8 lg:px-14">
        <Link
          href={ROUTES.home}
          className="min-w-0 truncate text-[14.5px] font-bold text-ink hover:underline"
        >
          {SITE.name}
        </Link>

        {/* Nothing here may wrap. A header that grows a second row as the window
            narrows shoves the whole page down, and the rail is already carrying
            every page from `lg` up, so these seven are a convenience rather than
            the navigation. They appear only once there is room beside it. */}
        {/* `flex-1` and centred, so the links sit on the header's centre line
            rather than trailing the brand. The right group keeps `ml-auto` for
            the widths where the nav is not rendered at all. */}
        <nav
          aria-label="Primary"
          className="hidden flex-1 flex-nowrap items-center justify-center gap-x-5 2xl:flex"
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
                  on ? "font-semibold text-ink" : "text-quiet",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href={HEADER_CTA.href}
            className="hidden rounded-field bg-active px-[14px] py-[7px] text-[13.5px] font-semibold whitespace-nowrap text-white transition-opacity hover:opacity-90 sm:inline-block"
          >
            {HEADER_CTA.label}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex size-9 items-center justify-center rounded-field text-ink transition-colors hover:bg-hair lg:hidden"
          >
            <Menu className="size-5" />
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
          <div className="flex items-center gap-5 border-b border-border px-5 py-3.5 sm:px-8">
            <span className="text-[14.5px] font-bold text-ink">
              {SITE.name}
            </span>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="ml-auto flex size-9 items-center justify-center rounded-field text-ink transition-colors hover:bg-hair"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav
            aria-label="All pages, mobile"
            className="quiet-scroll flex-1 overflow-y-auto px-5 pt-2 pb-6 sm:px-8"
          >
            {RAIL_GROUPS.map((group) => (
              <div key={group.title} className="pt-5">
                <p className="pb-1.5 font-mono text-[11px] font-bold tracking-[0.18em] text-idx uppercase">
                  {group.title}
                </p>

                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "block border-b border-hair py-3 text-[15.5px]",
                      item.level === 3
                        ? "pl-8"
                        : item.level === 2
                          ? "pl-4"
                          : "",
                      pathname === item.href
                        ? "font-semibold text-ink"
                        : "text-body",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <div className="border-t border-border px-5 py-4 sm:px-8">
            <Link
              href={HEADER_CTA.href}
              onClick={() => setOpen(false)}
              className="block rounded-field bg-active px-[14px] py-2.5 text-center text-[15px] font-semibold text-white"
            >
              {HEADER_CTA.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
