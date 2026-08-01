import type { Metadata } from "next";

import {
  FrameworkPageView,
  frameworkMetadata,
} from "@/components/pages/framework-page";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = frameworkMetadata(ROUTES.about);

export default function Page() {
  return <FrameworkPageView href={ROUTES.about} />;
}
