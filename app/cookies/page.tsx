import type { Metadata } from "next";

import { CookiesView } from "@/components/policy/cookies-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Cookies and similar technologies",
  description:
    "What this website stores on or reads from your device, the categories it falls into, and how to change your choice.",
  path: ROUTES.cookies,
});

export default function Page() {
  return <CookiesView />;
}
