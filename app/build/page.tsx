import type { Metadata } from "next";

import { BuildView } from "@/components/build";

export const metadata: Metadata = {
  title: "Build your website",
  description:
    "Two questions: who comes to your website, and what each of them should be able to do. Every answer changes the site we describe back to you.",
};

export default function BuildPage() {
  return <BuildView />;
}
