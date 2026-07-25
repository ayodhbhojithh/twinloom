"use client";

import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

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

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur">
      <Container className="flex h-16 items-center gap-6">
        <a href="#top" className="shrink-0">
          <BrandMark />
        </a>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center gap-6 lg:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-medium text-ink-3 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button asChild size="lg" className="hidden h-9 sm:inline-flex">
            <a href={SITE.bookingHref}>
              Book a scope call
              <ArrowRight data-icon="inline-end" />
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-9 lg:hidden"
                aria-label="Open menu"
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
                      className="rounded-row px-2 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-canvas"
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3 border-t border-hairline p-4">
                <SheetClose asChild>
                  <Button asChild size="lg" className="h-11 justify-center">
                    <a href={SITE.bookingHref}>
                      Book a scope call
                      <ArrowRight data-icon="inline-end" />
                    </a>
                  </Button>
                </SheetClose>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-center font-mono text-[11px] tracking-[0.04em] text-ink-4"
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
