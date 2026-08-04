"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleArrowUp, SquareArrowOutUpRight } from "lucide-react";

import { ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { PageSection } from "./page-shell";

/**
 * The section index that sits to the right of the copy.
 *
 * It is inside the flex flow rather than floating over the page, which is the
 * draft's own decision and the right one: when the Freeflow panel opens and takes
 * 360px, an index that was positioned over the page would end up on top of the
 * copy instead of beside it.
 *
 * The active section is tracked with an IntersectionObserver rather than a scroll
 * handler. A scroll handler runs on every frame of every scroll and then has to
 * measure, which is the expensive half; the observer is told once what to watch
 * and only speaks when something crosses.
 *
 * The top margin on the root is what makes "active" mean the section you are
 * reading rather than the one about to leave: a section counts once it reaches the
 * top quarter of the viewport, and stops counting when the next one gets there.
 */
export function OnThisPage({ sections }: { sections: readonly PageSection[] }) {
  const [active, setActive] = useState<string | null>(
    sections[0]?.id ?? null,
  );

  useEffect(() => {
    if (!sections.length) return;

    const seen = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          seen.set(entry.target.id, entry.isIntersecting);
        }

        /* The first one still in the band, in document order, so scrolling back
           up hands the mark back rather than keeping it on the lowest section. */
        const current = sections.find((section) => seen.get(section.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: 0 },
    );

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav
      aria-label="On this page"
      /* Fixed, not sticky. Sticky holds only within its own parent, so the index
         let go as soon as the article ended and rode the footer up the screen.
         Fixed takes it out of the flow entirely: it is pinned to the right gutter
         for the whole page and never moves at all.
   
         The copy reserves the space it vacated, in `PageShell`, so nothing runs
         underneath it. */
      className="quiet-scroll fixed hidden overflow-y-auto pb-6 xl:block"
      style={{
        top: "calc(var(--nav-height) + 28px)",
        right: "var(--page-gutter)",
        width: "var(--index-width)",
        maxHeight: "calc(100svh - var(--nav-height) - 56px)",
      }}
    >
      <h2 className="mb-3 text-[14px] font-semibold text-ink">On this page</h2>

      <ol>
        {sections.map((section) => {
          const on = section.id === active;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "block py-[7px] text-[14px] leading-[1.35] transition-colors",
                  on ? "text-mark" : "text-quiet hover:text-ink",
                )}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>

      {/* Under a rule, the things that are about the page rather than in it. */}
      <div className="mt-6 flex flex-col items-start gap-2.5 border-t border-border pt-4">
        <Link
          href={ROUTES.contact}
          className="flex items-center gap-1.5 text-[13.5px] text-quiet transition-colors hover:text-ink"
        >
          Something wrong on this page?
          <SquareArrowOutUpRight aria-hidden className="size-3.5 shrink-0" />
        </Link>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
            })
          }
          className="flex items-center gap-1.5 text-[13.5px] text-quiet transition-colors hover:text-ink"
        >
          Scroll to top
          <CircleArrowUp aria-hidden className="size-3.5 shrink-0" />
        </button>
      </div>
    </nav>
  );
}
