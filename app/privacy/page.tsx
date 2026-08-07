import type { Metadata } from "next";

import { PrivacyView } from "@/components/policy/privacy-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy notice",
  description:
    "What personal information TwinCoreTech Ltd collects, why we use it, who receives it, how long it is kept, and the rights available to you.",
  path: ROUTES.privacy,
});

export default function Page() {
  return <PrivacyView />;
}
