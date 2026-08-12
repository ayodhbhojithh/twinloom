import type { MetadataRoute } from "next";

import { NOINDEX, SITE_URL } from "@/lib/seo";

/**
 * robots.txt.
 *
 * The pages here are the same list the `noindex` comes from, so the two cannot
 * drift apart. They do different jobs and both are needed: `Disallow` asks a
 * crawler not to fetch the page, `noindex` tells it not to list one it has
 * fetched. A page that is only disallowed can still be listed - from a link
 * elsewhere - with no description under it, because the crawler was told not to
 * look at what it was listing.
 *
 * Nothing is blocked beyond those. Blocking a script or a stylesheet stops the
 * page being rendered as a visitor sees it, and a crawler that cannot render the
 * page judges what is left.
 *
 * The AI crawlers are allowed, deliberately. This site's whole proposition is
 * that it writes things down in plain words; being read by the things people now
 * ask instead of searching is the point, not a leak. Turning that off is a
 * business decision, and it belongs here where it can be made rather than
 * assumed either way.
 */
/**
 * The crawlers that read a site in order to answer a question about it.
 *
 * Named rather than left to the `*` rule they already match, because "allowed
 * by omission" and "allowed on purpose" look identical in a file and are not
 * the same decision. Anybody who later wants one of these gone can delete a
 * line here instead of working out what the wildcard was doing.
 *
 * Two kinds, and both are wanted. The training crawlers - GPTBot,
 * ClaudeBot, Google-Extended, Applebot-Extended, CCBot - read to learn, and
 * being in what a model knows is how this site gets named at all when somebody
 * asks a question it has spent twenty pages answering. The fetchers -
 * OAI-SearchBot, ChatGPT-User, Claude-User, PerplexityBot - read live, at the
 * moment somebody asks, and they cite. Blocking either is a decision to be
 * absent from the place people now ask first.
 */
const ANSWER_ENGINES = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "CCBot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...NOINDEX],
      },
      {
        userAgent: ANSWER_ENGINES,
        allow: "/",
        disallow: [...NOINDEX],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    /* Which spelling of the domain is the real one, for the crawlers that still
       read this. It is not a substitute for the canonicals, which are. */
    host: SITE_URL,
  };
}
