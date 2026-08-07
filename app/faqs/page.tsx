import type { Metadata } from "next";

import { FaqsView } from "@/components/pages/faqs-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "FAQs",
  description:
    "What it costs to ask, how a project runs, what is included, who owns the work, when you pay, what happens after launch, and what we do with your data.",
  path: ROUTES.faq,
});

export default function Page() {
  return <FaqsView />;
}
