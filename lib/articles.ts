/* ---------------------------------------------------------------------------
   The articles, as a list of what they are.

   Not their contents. An article's body is written out and arranged by hand in
   `components/articles/bodies.tsx`, because the arranging is the work: a
   comparison wants cards, a run of platforms wants named rows, and a set of
   figures wants figures. Holding the body as data would only push that decision
   into a renderer, which is what produced a grey column with six pipe tables in
   it.

   What is here is what both the index and the article itself have to agree on:
   the title, the subject, the one line each, and how long it takes to read.
--------------------------------------------------------------------------- */

export interface Article {
  slug: string;
  /** What it is about, used to group the index. */
  topic: string;
  title: string;
  /** The article in one sentence, in its own words. */
  lead: string;
  /** The article in one line, written for the index. */
  note: string;
  /** Reading time, at 210 words a minute. */
  minutes: number;
}

export const ARTICLES: readonly Article[] = [
  {
    slug: "how-your-website-is-made",
    topic: "How websites are built",
    title: "The real difference is when your pages get made",
    lead: "Every website a visitor sees is plain HTML. What separates one website technology from another is a single question: when does that HTML get made, and by what?",
    note: "WordPress, Astro, React, Node. Which part of your website each one actually touches, and when.",
    minutes: 5,
  },
  {
    slug: "why-shopify",
    topic: "Selling online",
    title: "Why we build shops on Shopify, and what else we work with",
    lead: "Our starting position for a shop, what it costs to run, the alternatives in plain words, and the three situations where we would tell you to do something else.",
    note: "Our starting position for a shop, the alternatives in plain words, and when we would say something else.",
    minutes: 5,
  },
  {
    slug: "selling-online-options",
    topic: "Selling online",
    title:
      "The real question is what you are selling, not which software to pick",
    lead: "Selling online is not one thing. A shop, a paid download, a booking with a deposit, a subscription, a donation - each needs different machinery, and most need far less than a full shop.",
    note: "Products, bookings, subscriptions, services. What you sell decides the software, not the other way round.",
    minutes: 6,
  },
  {
    slug: "systems-behind-selling",
    topic: "Selling online",
    title: "Behind every sale there are three systems, and one should be yours",
    lead: "The one that shows the thing, the one that takes the money, and the one that keeps the record. The third is the one nobody names, and it is the one you cannot afford to rent.",
    note: "The shop window, the money and the record. Which of the three has to be yours, and why.",
    minutes: 4,
  },
];

/**
 * A picture each, so four heads are not one head four times.
 *
 * Held here rather than in a view, because the index shows the same picture for
 * the same article and two lists of these would drift apart the first time one
 * of them was edited.
 */
const PLATES: Record<string, string> = {
  "how-your-website-is-made": "/work-investor.png",
  "why-shopify": "/work-shop.png",
  "selling-online-options": "/work-trade.png",
  "systems-behind-selling": "/work-careers.png",
};

export const plateFor = (slug: string) => PLATES[slug] ?? "/right-image.png";

export const articleBy = (slug: string) =>
  ARTICLES.find((article) => article.slug === slug) ?? null;

/** The topics, in the order they first appear. */
export const TOPICS: readonly string[] = [
  ...new Set(ARTICLES.map((article) => article.topic)),
];
