import type { Metadata } from "next";

import { HowWeWorkView } from "@/components/pages/how-we-work-view";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMeta, trailLd } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

/* Through `pageMeta` like every other page, which it was not.

   Written out by hand here, it had a title and a description and none of the
   rest: no canonical, so every query string and tracking tag on a link to it
   was a separate page competing with it in the index; no Open Graph, so it
   unfurled as a bare URL everywhere it was shared; and none of the snippet
   directives, so it was the one page on the site limited to a truncated
   snippet and a thumbnail. */
export const metadata: Metadata = pageMeta({
  title: "How we work",
  description:
    "Thirteen steps in three zones, from the first email to live and hosted. The same run for every project: what changes between them is what happens inside a step, never which steps there are.",
  path: ROUTES.how,
});

export default function Page() {
  return (
    <>
      <JsonLd data={trailLd("How we work", ROUTES.how)} />
      <HowWeWorkView />
    </>
  );
}
