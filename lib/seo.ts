import type { Metadata } from "next";

import { LEGAL, ROUTES, SITE } from "./site";

/* ---------------------------------------------------------------------------
   The site, as search engines and social cards see it.

   One file, for the same reason `site.ts` is one file: a canonical written in
   two places is a canonical that will disagree with itself, and a page that
   disagrees with itself about its own address is the single most expensive
   mistake available here. Everything that needs an absolute URL - canonicals,
   the sitemap, robots, Open Graph, the structured data - is built from the one
   origin below.
--------------------------------------------------------------------------- */

/**
 * Where the site actually lives.
 *
 * From the environment first, so a preview deployment describes itself as the
 * preview rather than claiming to be production - a preview that emits
 * production canonicals invites the index to replace the real page with a
 * throwaway one.
 *
 * No trailing slash, ever. `new URL("/about", origin)` is only predictable when
 * the origin has none, and one stray slash turns every absolute URL on the site
 * into a double-slashed variant of itself.
 *
 * No `www`, and that is the fix rather than the preference.
 *
 * It named `www.twinloom.twincoretech.com`, on the reasoning that `www.host` and
 * `host` are two sites to a crawler and one of them has to be named as the
 * original. That reasoning is right for an apex domain and wrong here: this site
 * is already a subdomain, so the `www` form is a fourth-level host that nobody
 * has ever pointed anywhere. It does not resolve.
 *
 * What it cost was not a ranking. Every absolute URL this file makes goes into
 * the emails somebody gets after sending us their requirements - the link back
 * into their answers, the privacy notice - and all of them landed on a host that
 * does not exist. The one link in the message that invites somebody to carry on
 * was the one link that could not be followed.
 *
 * `NEXT_PUBLIC_SITE_URL` still wins where it is set, which is how a preview
 * deployment describes itself rather than claiming to be production.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://twinloom.twincoretech.com"
).replace(/\/+$/, "");

/** A path, as the absolute URL a crawler is given. */
export const absolute = (path: string) => new URL(path, SITE_URL).toString();

/**
 * The card image, named rather than inherited.
 *
 * `app/opengraph-image.tsx` is picked up automatically, but only where nothing
 * below it states an `openGraph` block of its own - and `pageMeta` states one on
 * every route. Left implicit, exactly one page on the site had an image and the
 * other twenty-five unfurled as a bare link. Naming it costs one line and cannot
 * be lost by a page doing the ordinary thing.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE.name} - ${SITE.tagline}`,
} as const;

/**
 * The locale, in the two forms that want it.
 *
 * `en_GB` for Open Graph, which uses underscores, and `en-GB` for the document
 * and the structured data, which use a hyphen. Written once because they are
 * one fact, and because the pair is exactly the sort of thing that gets typed
 * the wrong way round.
 */
export const LOCALE = { og: "en_GB", tag: "en-GB" } as const;

/**
 * The pages that stay out of the index.
 *
 * The six home variants are one page's copy rendered six ways. Left indexable
 * they are near-duplicates competing with the landing page for its own words,
 * and the usual result is not that all seven rank - it is that Google picks one
 * of them for you and it is rarely the one you wanted.
 *
 * `/your-site` is a reading of somebody's own answers, so it has no stable
 * content to index and what it does have belongs to whoever typed it. Search
 * and the error page are not content at all.
 *
 * They stay in the rail and stay reachable. This is about the index, not about
 * access.
 */
export const NOINDEX: readonly string[] = [
  ROUTES.homeV1,
  ROUTES.homeV2,
  ROUTES.homeV3,
  ROUTES.homeV4,
  ROUTES.homeV5,
  ROUTES.homeV6,
  ROUTES.site,
  ROUTES.search,
  ROUTES.notFound,
];

/**
 * How much of a page a search engine may show.
 *
 * The defaults are conservative in a way nobody wants: a truncated snippet and
 * a thumbnail-sized image. These are the directives that let Google show a full
 * snippet and a large image, which is most of the difference between a result
 * somebody clicks and one they scroll past.
 */
const CRAWLING = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
} as const;

/** Kept off the index, and off the trail out of it. */
const HIDDEN = {
  index: false,
  follow: true,
  googleBot: { index: false, follow: true },
} as const;

/**
 * Everything a page has to say about itself, from the three things it knows.
 *
 * Every route on the site goes through here. Written per page, the Open Graph
 * block would be right on the two pages somebody remembered and missing on the
 * other twenty, which is how a site ends up with half its links unfurling as a
 * bare URL.
 *
 * The canonical is not optional and not inferred. A page that does not name its
 * own address lets every query string, every trailing slash and every campaign
 * tag become a separate page in the index, all of them competing with the one
 * that was meant to rank.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  published,
  modified,
  noindex,
}: {
  title: string;
  description: string;
  /** The route, from `ROUTES`, so the canonical cannot drift from the link. */
  path: string;
  type?: "website" | "article";
  published?: string;
  modified?: string;
  /** Overrides the list above, for a page that is hidden for its own reasons. */
  noindex?: boolean;
}): Metadata {
  const url = absolute(path);
  const hidden = noindex ?? NOINDEX.includes(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: hidden ? HIDDEN : CRAWLING,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE.name,
      locale: LOCALE.og,
      images: [OG_IMAGE],
      ...(type === "article" && published
        ? { publishedTime: published, modifiedTime: modified ?? published }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/* ---------------------------------------------------------------------------
   Structured data.

   Only ever a description of what is on the page. Marking up questions and
   answers a page does not carry, or reviews nobody wrote, is not an
   optimisation - it is the specific thing Google issues manual actions for, and
   the penalty outlives whatever the markup was supposed to win.

   That is why there is no `FAQPage` here. The FAQs page is a framework screen
   with no questions on it yet; the schema goes in the day the questions do.
--------------------------------------------------------------------------- */

/** Who this is, said once, for the knowledge panel and for every AI reading it. */
export const organisationLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organisation`,
  name: SITE.name,
  legalName: LEGAL.entity,
  url: SITE_URL,
  description: SITE.description,
  slogan: SITE.tagline,
  logo: {
    "@type": "ImageObject",
    url: absolute("/opengraph-image"),
  },
  areaServed: "GB",
});

/** The site itself, which is what carries the search box into a rich result. */
export const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE.name,
  url: SITE_URL,
  description: SITE.description,
  inLanguage: LOCALE.tag,
  publisher: { "@id": `${SITE_URL}/#organisation` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}${ROUTES.search}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

/**
 * The trail to a page.
 *
 * Written from the route rather than from the rail, because this has to be the
 * path a crawler took to the page and the rail is a table of contents. Google
 * draws these in place of the URL in a result, so a wrong trail is a wrong
 * address shown to everybody who searches.
 */
export const breadcrumbLd = (
  trail: readonly { name: string; path: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((step, at) => ({
    "@type": "ListItem",
    position: at + 1,
    name: step.name,
    item: absolute(step.path),
  })),
});

/** One article, as the thing it is rather than as a page with words on it. */
export const articleLd = (article: {
  slug: string;
  title: string;
  note: string;
  lead: string;
  minutes: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.note,
  abstract: article.lead,
  url: absolute(`${ROUTES.insights}/${article.slug}`),
  mainEntityOfPage: absolute(`${ROUTES.insights}/${article.slug}`),
  inLanguage: LOCALE.tag,
  timeRequired: `PT${article.minutes}M`,
  author: { "@id": `${SITE_URL}/#organisation` },
  publisher: { "@id": `${SITE_URL}/#organisation` },
});
