import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home v1",
  description: SITE.description,
};

/** The first version, kept beside the others now that v7 has the front door. */
export default function HomeV1Page() {
  return <Hero />;
}
