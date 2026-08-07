import type { MetadataRoute } from "next";

import { ARTICLES } from "@/lib/articles";
import { NOINDEX, SITE_URL } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

/**
 * The sitemap.
 *
 * Built from `ROUTES` rather than written out, so a page that gets added is a
 * page that gets submitted. A hand-kept sitemap is a list that is correct on the
 * day it is written and quietly wrong from the next deploy onwards, and the
 * failure is silent in both directions: pages that never get crawled, and dead
 * URLs reported as errors for months.
 *
 * Only what should be indexed. A sitemap is a recommendation, not a manifest -
 * listing a page and then telling it `noindex` is two contradictory instructions
 * about the same URL, and Search Console reports the pair as an error rather
 * than resolving it.
 *
 * `priority` is relative and only within this file: it says which of our own
 * pages matters most, not how we rank against anyone. The build page is the
 * site's one way in, so it sits with the landing page rather than under it.
 */

/** The pages, and how often each is actually likely to change. */
const PAGES: readonly {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: ROUTES.home, priority: 1, changeFrequency: "weekly" },
  { path: ROUTES.build, priority: 1, changeFrequency: "monthly" },
  { path: ROUTES.blog, priority: 0.9, changeFrequency: "weekly" },
  { path: ROUTES.about, priority: 0.8, changeFrequency: "monthly" },
  { path: ROUTES.services, priority: 0.9, changeFrequency: "monthly" },
  { path: ROUTES.contact, priority: 0.7, changeFrequency: "yearly" },
  { path: ROUTES.book, priority: 0.7, changeFrequency: "yearly" },
  { path: ROUTES.faq, priority: 0.6, changeFrequency: "monthly" },

  /* The legal set. Low, and honestly so: they exist to be found by somebody
     looking for them rather than to compete for anything. Dropping them
     entirely would be worse - a privacy policy that cannot be found is a
     compliance problem before it is an SEO one. */
  { path: ROUTES.legal, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.privacy, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.cookies, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.terms, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.termsOfBusiness, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.accessibility, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.complaints, priority: 0.3, changeFrequency: "yearly" },
  { path: ROUTES.subProcessors, priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  /* One timestamp for the build rather than one per entry. `new Date()` called
     inside the map would stamp each URL a few microseconds apart, which is a
     difference that means nothing and a diff that changes on every build. */
  const built = new Date();

  const pages = PAGES.filter((page) => !NOINDEX.includes(page.path)).map(
    (page) => ({
      url: `${SITE_URL}${page.path === "/" ? "" : page.path}`,
      lastModified: built,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }),
  );

  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}${ROUTES.blog}/${article.slug}`,
    lastModified: built,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...articles];
}
