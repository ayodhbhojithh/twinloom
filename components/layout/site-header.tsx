"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PRIMARY_NAV, SITE } from "@/lib/content/site";

import { BrandMark } from "./brand-mark";

/**
 * The navbar, straight from option 2a: white bar on a hairline, links carrying a
 * mono count, and a dark call to action rather than a purple one, so the purple
 * is saved for the estimator itself.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface">
      <Container className="flex h-[62px] items-center gap-6 lg:gap-[26px]">
        <a href="#top" aria-label={`${SITE.name}, home`} className="shrink-0">
          <BrandMark />
        </a>

        <nav
          aria-label="Primary"
          className="ml-auto hidden items-baseline gap-[22px] lg:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-semibold text-ink-3 transition-colors hover:text-ink"
            >
              {item.label}
              {item.count === undefined ? null : (
                <span className="ml-1 font-mono text-[11px] font-normal text-ink-5 tabular-nums">
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a
            href={SITE.ctaHref}
            className="hidden rounded-row bg-ink px-[18px] py-2.5 text-[13.5px] font-bold text-white transition-opacity hover:opacity-85 sm:block"
          >
            + {SITE.ctaLabel}
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="size-9 rounded-row border-edge lg:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <BrandMark />
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label="Primary, mobile"
                className="flex flex-col gap-1 px-4"
              >
                {PRIMARY_NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-baseline justify-between rounded-row px-2 py-2.5 text-[15px] font-bold text-ink transition-colors hover:bg-sunken"
                    >
                      {item.label}
                      {item.count === undefined ? null : (
                        <span className="font-mono text-[11px] font-normal text-ink-5 tabular-nums">
                          {item.count}
                        </span>
                      )}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-hairline p-4">
                <SheetClose asChild>
                  <a
                    href={SITE.ctaHref}
                    className="rounded-row bg-ink px-4 py-3 text-center text-[14.5px] font-bold text-white"
                  >
                    + {SITE.ctaLabel}
                  </a>
                </SheetClose>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-center font-mono text-[11px] tracking-[0.04em] text-mono"
                >
                  {SITE.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
