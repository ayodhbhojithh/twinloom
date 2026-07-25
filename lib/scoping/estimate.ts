import {
  conditionMet,
  deepenActive,
  selectedOptions,
} from "./derive";
import { dialEffort, optionEffort } from "./effort";
import { STEPS } from "./steps";
import type { ScopeAnswers } from "./types";

/* ---------------------------------------------------------------------------
   The estimate.

   TCT_Scope_Spec.md §8 gives the model: build points per component are
   `base_points × (1 + effort/10)`, summed to a tier and a band. Every number in
   here is the spec's own and the spec calls them illustrative, so `PRICING_NOTE`
   travels with them wherever they are shown. Nothing is invented.

   Pure functions over the answers, no state and no I/O, so the Blueprint and any
   later server-side plan generator can reach the same figures from the same input.
   The spec has this living in `engine.py` eventually; keeping it pure is what will
   make that port a translation rather than a rewrite.
--------------------------------------------------------------------------- */

export const PRICING_NOTE =
  "A guide, not a quote. We confirm a fixed price in writing after a short call.";

/** One chosen thing, priced. */
export interface ScopeComponent {
  /** The section it came from, for grouping. */
  step: string;
  group: string;
  label: string;
  effort: number;
  points: number;
}

export type PackageTier =
  | "Launch Lite"
  | "SME Launch"
  | "SME Growth"
  | "SME Operating"
  | "Bespoke";

interface TierBand {
  tier: PackageTier;
  /** Upper bound of the points range, exclusive. Infinity for the last. */
  upTo: number;
  low: number;
  high: number | null;
  /** Working weeks, as a range. */
  weeks: [number, number];
  /** The care plan that fits a build of this size. */
  care: "Care Lite" | "Care Plus" | "Care Pro";
  why: string;
}

/**
 * The five tiers of §8. Timelines follow the artifacts' own quoted ranges: most
 * SME sites launch in 2 to 6 weeks, with the larger two tiers running longer.
 */
const TIERS: TierBand[] = [
  {
    tier: "Launch Lite",
    upTo: 20,
    low: 750,
    high: 1500,
    weeks: [1, 2],
    care: "Care Lite",
    why: "A small, sharp site. A few pages, done properly, live quickly.",
  },
  {
    tier: "SME Launch",
    upTo: 45,
    low: 1500,
    high: 3500,
    weeks: [2, 4],
    care: "Care Lite",
    why: "The proper company site: enough pages to explain the business, and a way to get in touch.",
  },
  {
    tier: "SME Growth",
    upTo: 85,
    low: 3500,
    high: 7500,
    weeks: [4, 6],
    care: "Care Plus",
    why: "More moving parts. A shop, a blog or bookings on top of the site itself.",
  },
  {
    tier: "SME Operating",
    upTo: 140,
    low: 7500,
    high: 12500,
    weeks: [6, 10],
    care: "Care Pro",
    why: "A site that runs part of the business, with several systems talking to each other.",
  },
  {
    tier: "Bespoke",
    upTo: Number.POSITIVE_INFINITY,
    low: 12500,
    high: null,
    weeks: [10, 16],
    care: "Care Pro",
    why: "Beyond a website. This needs its own conversation before anyone quotes it.",
  },
];

/**
 * Base points per section.
 *
 * The spec sets the model and the bands but leaves base points per component to
 * the catalogue it has not delivered yet. These weights are the honest reading of
 * its own tiers: what a site *does* costs most, selling and being found next,
 * taste and timing least. They are the one thing here that will change when the
 * real catalogue lands, so they sit in one table rather than scattered.
 */
const BASE_POINTS: Record<string, number> = {
  about: 3,
  assets: 2,
  does: 6,
  sell: 5,
  found: 4,
  look: 2,
  time: 2,
  else: 2,
};

const DEFAULT_BASE = 3;

/** `base × (1 + effort/10)`, rounded to keep totals readable. */
function pointsFor(base: number, effort: number): number {
  return Math.round(base * (1 + effort / 10) * 10) / 10;
}

/**
 * Every chosen option, priced, in section order.
 *
 * Sections that a condition rules out contribute nothing, and the redesign dials
 * are priced as components of their own: pushing "performance" to 8 is a real cost
 * and the dial is the only place it is recorded.
 */
export function resolveComponents(answers: ScopeAnswers): ScopeComponent[] {
  const components: ScopeComponent[] = [];

  for (const step of STEPS) {
    if (!conditionMet(step, answers)) continue;

    const base = BASE_POINTS[step.key] ?? DEFAULT_BASE;

    for (const group of step.groups ?? []) {
      for (const option of selectedOptions(group, answers)) {
        const effort = optionEffort(answers, group.key, option);

        components.push({
          step: step.kicker,
          group: group.question,
          label: option.label,
          effort,
          points: pointsFor(base, effort),
        });
      }
    }

    if (step.deepen && deepenActive(step, answers)) {
      for (const dial of step.deepen.dials) {
        const effort = dialEffort(answers, dial.key);
        /* Zero means the area is out of scope, so it costs nothing. */
        if (effort === 0) continue;

        components.push({
          step: step.kicker,
          group: "How far to push each area",
          label: dial.label,
          effort,
          points: pointsFor(base, effort),
        });
      }
    }
  }

  return components;
}

/**
 * The readiness score of §3, block 2.
 *
 * What the client already has, out of what the audit asks about. A "not sure" is
 * counted as a half: it is not a no, but it is not something anyone can plan
 * around either. The score is deliberately about *their* readiness, not ours, so a
 * low number is not a problem to hide but a list of things we will provide.
 */
export function readiness(answers: ScopeAnswers, assetCount: number) {
  const states = Object.values(answers.assets);

  const have = states.filter((state) => state === "yes").length;
  const unsure = states.filter((state) => state === "unsure").length;
  const answered = states.length;

  const score = assetCount
    ? Math.round(((have + unsure * 0.5) / assetCount) * 100)
    : 0;

  return {
    score,
    have,
    unsure,
    /** Things they said no to, which is what we will be supplying. */
    missing: states.filter((state) => state === "no").length,
    answered,
    outstanding: assetCount - answered,
  };
}

/**
 * The derived sitemap of §3, block 3.
 *
 * The journey never asks how many pages anyone wants, by design. The page list is
 * worked out from what the site has to do, which is the whole point: answering
 * "which pages" is our job, not the client's.
 */
export function deriveSitemap(answers: ScopeAnswers): string[] {
  const types = answers.multi.type ?? [];
  const services = answers.multi.services ?? [];

  /* Every site gets these four, whatever it is for. */
  const pages = ["Home", "About", "Contact", "Privacy and terms"];

  if (types.includes("brochure") || types.includes("lead")) {
    pages.splice(1, 0, "Services");
  }
  if (types.includes("shop")) {
    pages.splice(1, 0, "Shop", "Product pages", "Basket and checkout");
  }
  if (types.includes("booking")) pages.splice(1, 0, "Book a slot");
  if (types.includes("blog")) pages.splice(1, 0, "Insights");
  if (types.includes("portfolio")) pages.splice(1, 0, "Work");
  if (types.includes("members")) pages.splice(1, 0, "Member area");

  if (services.includes("local") || services.includes("seo")) {
    pages.push("Location or landing pages");
  }

  return [...new Set(pages)];
}

export interface Estimate {
  components: ScopeComponent[];
  points: number;
  tier: PackageTier;
  why: string;
  /** The build price, in whole pounds. `high` is null on the open-ended tier. */
  low: number;
  high: number | null;
  weeks: [number, number];
  care: TierBand["care"];
  sitemap: string[];
  /** Points per section, in section order, for the scope breakdown. */
  bySection: { step: string; points: number; count: number }[];
}

export function estimate(answers: ScopeAnswers, assetCount: number): Estimate {
  const components = resolveComponents(answers);

  /* Assets are scored as gaps rather than as choices: each thing they do not have
     is something we supply, and that is work. */
  const gaps = readiness(answers, assetCount);
  const assetPoints = gaps.missing * (BASE_POINTS.assets ?? DEFAULT_BASE);

  const points =
    Math.round(
      (components.reduce((total, item) => total + item.points, 0) +
        assetPoints) *
        10,
    ) / 10;

  const band = TIERS.find((entry) => points < entry.upTo) ?? TIERS[TIERS.length - 1];

  const bySection: Estimate["bySection"] = [];
  for (const component of components) {
    const existing = bySection.find((entry) => entry.step === component.step);
    if (existing) {
      existing.points = Math.round((existing.points + component.points) * 10) / 10;
      existing.count += 1;
    } else {
      bySection.push({
        step: component.step,
        points: component.points,
        count: 1,
      });
    }
  }

  return {
    components,
    points,
    tier: band.tier,
    why: band.why,
    low: band.low,
    high: band.high,
    weeks: band.weeks,
    care: band.care,
    sitemap: deriveSitemap(answers),
    bySection,
  };
}

/** `£1,500` and `£1,500 to £3,500`, or `£12,500+` on the open tier. */
export function formatPrice(low: number, high: number | null): string {
  const money = (value: number) => `£${value.toLocaleString("en-GB")}`;
  return high === null ? `${money(low)}+` : `${money(low)} to ${money(high)}`;
}
