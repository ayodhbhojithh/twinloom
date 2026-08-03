"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { TextLink } from "@/components/blocks/text-link";
import { PageMeta } from "@/components/blocks/page-meta";
import { P } from "@/components/blocks/prose";
import { SimpleList } from "@/components/blocks/simple-list";
import { PageHeading, PageShell } from "@/components/layout";
import { FLAT_PAGES, ROUTES } from "@/lib/site";
import { pluralWord } from "@/lib/text";

/**
 * Site search.
 *
 * It searches the site's own table of contents, which for forty eight pages is
 * both sufficient and honest. There is no index to build, nothing to keep in step
 * with the content, and no request: the list of pages is already in the bundle
 * because the rail renders from it.
 *
 * Every word of the query has to appear somewhere in a page's title or its group,
 * so "care pricing" finds nothing rather than everything, and word order does not
 * matter. That is closer to what people expect than matching the whole phrase.
 *
 * The query lives in the URL. A results page you can link to, share and reload is
 * the reason to have a page rather than a dropdown.
 */
export function SearchView() {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  const [draft, setDraft] = useState(query);

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];

    return FLAT_PAGES.filter((page) => {
      /* The path is searched as well as the label: "faq" should find "FAQs"
         and "sub" should find sub-processors, and the path carries wording the
         label does not. */
      const haystack = `${page.label} ${page.href}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [query]);

  return (
    <PageShell>
      <PageHeading title="Search this website" />

      <form
        role="search"
        className="mb-9 flex max-w-measure flex-wrap gap-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          const next = draft.trim();
          router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
        }}
      >
        <label htmlFor="site-search" className="sr-only">
          What are you looking for?
        </label>

        <input
          id="site-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What are you looking for?"
          className="min-w-0 flex-1 rounded-field border border-border bg-field px-3.5 py-2.5 text-[15.5px] text-body outline-none transition-colors placeholder:text-label focus:border-active"
        />

        <button
          type="submit"
          className="shrink-0 rounded-field accent-fill px-[18px] py-[10px] text-[14.5px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Search
        </button>
      </form>

      {!query ? (
        <P className="text-quiet">
          Type what you are looking for. You can also work through everything in
          the list on the left.
        </P>
      ) : results.length ? (
        <>
          <P className="mb-5">
            <b className="text-ink">
              {results.length} {pluralWord(results.length, "result")} for
              &ldquo;{query}&rdquo;
            </b>
          </P>

          <SimpleList
            rows={results.map((page) => ({
              label: page.label,
              note: page.href,
              href: page.href,
              tone: "active" as const,
            }))}
          />
        </>
      ) : (
        <>
          <h2 className="mb-2 text-[19px] font-bold text-ink sm:text-[21px]">
            No results
          </h2>

          <p className="mb-4 max-w-measure text-[18px] leading-[1.55] text-ink sm:text-[20px]">
            We could not find a page matching <b>{query}</b>.
          </p>

          <P>
            Try a shorter phrase, browse{" "}
            <TextLink href={ROUTES.build}>building your website</TextLink>
            , or <TextLink href={ROUTES.contact}>contact us</TextLink>.
          </P>
        </>
      )}

      <PageMeta
        values={{
          title: "Search",
          description: "Search every page on this website.",
          indexing: "Normally noindex",
        }}
      />
    </PageShell>
  );
}
