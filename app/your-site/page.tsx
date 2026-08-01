import type { Metadata } from "next";

import { SiteView } from "@/components/build";

export const metadata: Metadata = {
  title: "The site your answers describe",
  description:
    "The pages your answers have produced so far, each one shown under the answer that put it there.",
};

export default function YourSitePage() {
  return <SiteView />;
}
