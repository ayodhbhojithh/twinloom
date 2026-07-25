"use client";

import { useState } from "react";
import Link from "next/link";
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
import { PRIMARY_CTA, PRIMARY_NAV, SECONDARY_CTA, SITE } from "@/lib/content/site";

import { BrandMark } from "./brand-mark";

/**
 * The global nav from the artifacts: white bar on a hairline, quiet text links
 * that tint on hover, and the two doors on the right. The journey is the primary
 * one; "Book a call" is the escape hatch that has to stay visible everywhere.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card">
      <Container className="flex min-h-[62px] items-center gap-[18px] py-3">
        <Link href="/" aria-label={`${SITE.name}, home`} className="shrink-0">
          <BrandMark />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-wrap gap-0.5 lg:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              /* 13.5px at 600 is the weight the prototype pairs with Manrope.
                 At 400 the face reads thin and almost monospaced. */
              className="rounded-nav px-2.5 py-1.5 text-[13.5px] font-semibold text-body transition-colors hover:bg-soft hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ActionButton
            variant="secondary"
            size="sm"
            href={SECONDARY_CTA.href}
            className="hidden sm:inline-flex"
          >
            {SECONDARY_CTA.label}
          </ActionButton>

          <ActionButton
            size="sm"
            href={PRIMARY_CTA.href}
            className="hidden sm:inline-flex"
          >
            {PRIMARY_CTA.label}
            <ArrowRight aria-hidden className="size-3.5" />
          </ActionButton>

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
                    <Link
                      href={item.href}
                      className="rounded-nav px-2 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-soft"
                    >
                      {item.label}
                    </Link>
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
                    href={SECONDARY_CTA.href}
                    size="lg"
                  >
                    {SECONDARY_CTA.label}
                  </ActionButton>
                </SheetClose>
                <a
                  href={`mailto:${SITE.email}`}
                  className="pt-1 text-center text-[13px] text-body"
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
