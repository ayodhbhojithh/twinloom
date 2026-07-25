import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/layout";
import { ScopingJourney } from "@/components/scoping";

export const metadata: Metadata = {
  title: "Scope your website",
  description:
    "Eight short sections and you have a clear picture of your website. Tell us the outcomes and we work out the pages, the size and the price band.",
};

export default function ScopePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <ScopingJourney />
      </main>

      <SiteFooter />
    </>
  );
}
