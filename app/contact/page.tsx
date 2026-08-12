import type { Metadata } from "next";

import { ContactView } from "@/components/pages/contact-view";
import { frameworkMetadata } from "@/components/pages/framework-page";
import { JsonLd } from "@/components/seo/json-ld";
import { trailLd } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = frameworkMetadata(ROUTES.contact);

export default function Page() {
  return (
    <>
      <JsonLd data={trailLd("Contact us", ROUTES.contact)} />
      <ContactView />
    </>
  );
}
