import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { pageMeta } from "@/lib/seo";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Home v1",
  description: SITE.description,
  path: ROUTES.homeV1,
});

/** The first version, kept beside the others now that v7 has the front door. */
export default function HomeV1Page() {
  return <Hero />;
}
