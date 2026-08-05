import type { Metadata } from "next";

import { NotFoundView } from "@/components/pages/not-found-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

/**
 * The 404 at a readable address.
 *
 * The rail lists it as a screen, so it needs a route of its own to sit at. The
 * real 404 is served by `app/not-found.tsx`; both render the same component, so
 * there is one page and two ways of arriving at it.
 *
 * Noindex, as the draft's own metadata block specifies. A route that renders an
 * error page with a 200 status is exactly the soft 404 crawlers penalise, which is
 * why this one is kept out of the index rather than left to be discovered.
 */
export const metadata: Metadata = pageMeta({
  title: "Page not found",
  description: "The page is not here. What the site does have is on every other screen.",
  path: ROUTES.notFound,
});

export default function NotFoundPage() {
  return <NotFoundView />;
}
