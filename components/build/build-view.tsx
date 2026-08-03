import { PageMeta } from "@/components/blocks/page-meta";
import { PageHeading, PageShell } from "@/components/layout";

import { BuildFlow } from "./v5/flow";

/**
 * Build your website.
 *
 * The v5.2 run-through, whole: two ways through, twelve steps, the layer two
 * cards behind the rows, the layer three questions under the shop, and the
 * panel that writes the answer while the questions are being answered.
 *
 * The older two question picker is gone rather than kept beside it. It was an
 * earlier draft of this same screen, and shipping both would ask a visitor to
 * choose between our drafts.
 *
 * This file is only the page around the tool: a heading, and the metadata block
 * every screen carries.
 */
export function BuildView() {
  return (
    <PageShell>
      <PageHeading
        tag="Build your website"
        title="Build your website"
        lead="Two ways through, and you can move between them without losing anything. Two minutes gets you a shape. Everything after that is yours to give or to leave."
      />

      <BuildFlow />

      <PageMeta
        values={{
          title: "Build your website",
          description:
            "Two ways through: say it in your own words and send it, or work through twelve steps and read the whole thing back. Nothing is priced, nothing is scored, and you can stop at any step.",
        }}
      />
    </PageShell>
  );
}
