import { Suspense } from "react";
import type { Metadata } from "next";

import { PageShell } from "@/components/layout";
import { SearchView } from "@/components/pages/search-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

/** The draft's own metadata note for this screen: normally noindex. */
export const metadata: Metadata = pageMeta({
  title: "Search",
  description:
    "Find a page on this site by name, or by a word from what is written on it.",
  path: ROUTES.search,
});

/**
 * `useSearchParams` opts a route into client rendering, so the boundary is drawn
 * here rather than around the whole page. Everything outside it, including the
 * rail and the header, still renders on the server.
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<PageShell />}>
      <SearchView />
    </Suspense>
  );
}
