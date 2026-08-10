import type { Metadata } from "next";

import { BlogView } from "@/components/pages/blog-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Insight",
  description:
    "The decisions behind a website, written out: what each piece of technology touches, what it costs to run, and where we would tell you to do something other than what we sell.",
  path: ROUTES.insights,
});

export default function Page() {
  return <BlogView />;
}
