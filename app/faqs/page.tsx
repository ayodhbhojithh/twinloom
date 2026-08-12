import type { Metadata } from "next";

import { FAQ_ASKS, FaqsView } from "@/components/pages/faqs-view";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";
import { ROUTES, SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "FAQs",
  description:
    "What it costs to ask, how a project runs, what is included, who owns the work, when you pay, what happens after launch, and what we do with your data.",
  path: ROUTES.faq,
});

export default function Page() {
  return (
    <>
      {/* The questions as data as well as as a page.

          Twenty-nine answers, each written from the clause it rests on, and
          this is the one set of them a search result or an assistant can show
          in place of the page. That is a fair trade here and would not be
          everywhere: an answer that only makes sense with the rest of the
          screen around it becomes a wrong answer the moment it is quoted
          alone. */}
      <JsonLd
        data={[
          faqLd(FAQ_ASKS),
          breadcrumbLd([
            { name: SITE.name, path: ROUTES.home },
            { name: "FAQs", path: ROUTES.faq },
          ]),
        ]}
      />

      <FaqsView />
    </>
  );
}
