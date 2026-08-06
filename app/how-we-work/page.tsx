import type { Metadata } from "next";

import { HowWeWorkView } from "@/components/pages/how-we-work-view";

export const metadata: Metadata = {
  title: "How we work",
  description:
    "Thirteen steps in three zones, from the first email to live and hosted. The same run for every project: what changes between them is what happens inside a step, never which steps there are.",
};

export default function Page() {
  return <HowWeWorkView />;
}
