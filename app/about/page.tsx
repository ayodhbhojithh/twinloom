import type { Metadata } from "next";

import { AboutView } from "@/components/pages/about-view";
import { frameworkMetadata } from "@/components/pages/framework-page";
import { JsonLd } from "@/components/seo/json-ld";
import { trailLd } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = frameworkMetadata(ROUTES.about);

export default function Page() {
  return (
    <>
      <JsonLd data={trailLd("About us", ROUTES.about)} />
      <AboutView />
    </>
  );
}
