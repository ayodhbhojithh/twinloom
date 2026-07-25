import type { Metadata } from "next";

import { BlueprintView } from "@/components/blueprint";
import { SiteFooter, SiteHeader } from "@/components/layout";

export const metadata: Metadata = {
  title: "Your blueprint",
  description:
    "The resolved output of your scoping journey: the package that fits, the pages we derived, the build band, the timeline and the care plan to match.",
};

export default function BlueprintPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <BlueprintView />
      </main>

      <SiteFooter />
    </>
  );
}
