import type { Metadata } from "next";

import { BuildView } from "@/components/build";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Build your website",
  description:
    "Two questions: who comes to your website, and what each of them should be able to do. Every answer changes the site we describe back to you.",
  path: ROUTES.build,
});

export default function BuildPage() {
  return <BuildView />;
}
