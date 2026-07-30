"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

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
      /* Hidden when the copy column matters more than the index: below 1240px
         outright, and below 1560px once Freeflow has taken its 360px. */
      className="quiet-scroll sticky top-6 hidden w-[212px] shrink-0 self-start overflow-y-auto pb-6 xl:block"
      style={{ maxHeight: "calc(100vh - 48px)" }}
    >
      <h2 className="mb-[13px] font-mono text-[11px] font-bold tracking-[0.18em] text-idx uppercase">
        On this page
      </h2>

      <ol className="border-l border-border">
        {sections.map((section) => {
          const on = section.id === active;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={on ? "true" : undefined}
                className={cn(
                  "relative block py-2 pl-5 text-[14px] leading-[1.35] transition-colors",
                  on ? "font-semibold text-active" : "text-quiet hover:text-ink",
                )}
              >
                {/* The dot sits on the rule, so the index reads as a track with
                    stops rather than as a list with bullets. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-3.5 -left-1 size-[7px] rounded-pill border transition-colors",
                    on ? "border-active bg-active" : "border-border bg-field",
                  )}
                />
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>

      {/* Under a rule, the two things that are about the page rather than in it. */}
      <div className="mt-5 border-t border-border pt-4">
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
          <ArrowUp aria-hidden className="size-3.5" />
        </button>
      </div>
    </nav>
  );
}
