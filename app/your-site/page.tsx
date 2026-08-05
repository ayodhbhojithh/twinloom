import type { Metadata } from "next";

import { SiteView } from "@/components/build";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "The site your answers describe",
  description:
    "The pages your answers have produced so far, each one shown under the answer that put it there.",
  path: ROUTES.site,
});

export default function YourSitePage() {
  return <SiteView />;
}
