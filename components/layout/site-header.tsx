"use client";

import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

import { ActionButton, Container } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  BUILDER_CTA,
  PRIMARY_CTA,
  PRIMARY_NAV,
  SITE,
} from "@/lib/content/site";

import { BrandMark } from "./brand-mark";

/**
 * The global nav. One scrollable page, so every link is an in page anchor.
 *
 * No bottom border: the page is white throughout and the separation comes from
 * spacing rather than rules.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white">
      <Container
        width="wide"
        className="flex min-h-[var(--nav-height)] items-center gap-[18px] py-3"
      >
        <a href="#top" aria-label={`${SITE.name}, top of page`} className="shrink-0">
          <BrandMark />
        </a>

        {/* flex-1 so the links centre in the space between the wordmark and the
            two doors, rather than sitting up against the wordmark. */}
        <nav
          aria-label="Primary"
          className="hidden flex-1 flex-wrap justify-center gap-0.5 lg:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              /* 13.5px at 600 is the weight the prototype pairs with Manrope.
                 At 400 the face reads thin and almost monospaced. */
              className="rounded-nav px-2.5 py-1.5 text-[13.5px] font-semibold text-body transition-colors hover:bg-soft hover:text-ink"
            >
              {item.label}
              {item.count === undefined ? null : (
                <span className="ml-1 font-mono text-[11px] font-normal text-faint tabular-nums">
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* The Builder, not "Book a call": the two doors in the nav are the
              two ways of getting a website out of us, and the call is still one
              tap away in the footer and on the closing block. */}
          <ActionButton
            variant="secondary"
            size="sm"
            href={BUILDER_CTA.href}
            className="hidden sm:inline-flex"
          >
            {BUILDER_CTA.label}
          </ActionButton>

          {/* Dark, not purple: 2a keeps the brand colour for the hero's call to
              action and lets the nav's sit quietly in ink. */}
          <a
            href={PRIMARY_CTA.href}
            className="hidden items-center gap-1.5 rounded-btn-sm bg-ink px-[18px] py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-85 sm:inline-flex"
          >
            {PRIMARY_CTA.label}
            <ArrowRight aria-hidden className="size-3.5" />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="size-9 rounded-btn-sm border-line lg:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <BrandMark size="large" />
                </SheetTitle>
              </SheetHeader>

              <nav
                aria-label="Primary, mobile"
                className="flex flex-col gap-0.5 px-4"
              >
                {PRIMARY_NAV.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-baseline justify-between rounded-nav px-2 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-soft"
                    >
                      {item.label}
                      {item.count === undefined ? null : (
                        <span className="font-mono text-[11px] font-normal text-faint tabular-nums">
                          {item.count}
                        </span>
                      )}
                    </a>
                  </SheetClose>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-2.5 border-t border-line p-4">
                <SheetClose asChild>
                  <ActionButton href={PRIMARY_CTA.href} size="lg">
                    {PRIMARY_CTA.label}
                    <ArrowRight aria-hidden className="size-4" />
                  </ActionButton>
                </SheetClose>
                <SheetClose asChild>
                  <ActionButton
                    variant="secondary"
                    href={BUILDER_CTA.href}
                    size="lg"
                  >
                    {BUILDER_CTA.label}
                  </ActionButton>
                </SheetClose>
                <a
                  href={`mailto:${SITE.email}`}
                  className="pt-1 text-center text-[13px] font-medium text-body"
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
