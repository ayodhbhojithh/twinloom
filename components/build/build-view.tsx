import { PageMeta } from "@/components/blocks/page-meta";
import { PageHeading, PageShell } from "@/components/layout";

import { BuildTool } from "./build-tool";

/**
 * Build your website.
 *
 * The prototype carries three versions of the picker side by side, because it is
 * a framework and it was still choosing. Only the newest is here: v3, the two
 * question version, which its own note describes as the answer that matters.
 * Shipping all three would ask a visitor to choose between our drafts.
 *
 * The tool itself lives in `BuildTool`, because the landing page shows the same
 * thing and two implementations of one screen drift apart on the first edit.
 * This file is the page around it: a heading, and the metadata block every
 * screen carries.
 */
export function BuildView() {
  return (
    <PageShell>
      <PageHeading
        tag="Build your website"
        title="Build your website"
        lead="Read what this does, work through the areas, or just send us what you have."
      />

      <BuildTool />

      <PageMeta
        values={{
          title: "Build your website",
          description:
            "Two questions: who comes to your website, and what each of them should be able to do. Every answer changes the site we describe back to you.",
        }}
      />
    </PageShell>
  );
}
