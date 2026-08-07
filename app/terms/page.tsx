import type { Metadata } from "next";

import { TermsView } from "@/components/policy/terms-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of use",
  description:
    "The terms that apply to using this website and sending us a scoping request. Client work is governed separately by an accepted proposal and our Terms of Business.",
  path: ROUTES.terms,
});

export default function Page() {
  return <TermsView />;
}
