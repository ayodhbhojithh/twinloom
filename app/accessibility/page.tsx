import type { Metadata } from "next";

import { AccessibilityView } from "@/components/policy/accessibility-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Accessibility",
  description:
    "The standard we build to, what has been tested, known limitations, and how to report a problem.",
  path: ROUTES.accessibility,
});

export default function Page() {
  return <AccessibilityView />;
}
