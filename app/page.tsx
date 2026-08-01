import type { Metadata } from "next";

import { VersionSwitcher } from "@/components/home";

export const metadata: Metadata = {
  /* `absolute` because the layout appends the company name to every title, and
     this one is the company name. */
  title: { absolute: "The Very Good Website Company" },
  description:
    "Tell us who your website is for and we write the rest down for you. One question, a written scope back within two working days, and no obligation.",
};

/**
 * Home, as ten versions to choose between.
 *
 * Not a `PageShell`. Every other screen here is a document, with a reading
 * measure, a section index and a previous/next pair at the foot of it. This one
 * is an argument, and it wants the full width and none of that furniture, so it
 * sets its own frame.
 *
 * Nothing under the fold, either. The framework note and the metadata block that
 * every other screen carries are gone from this one: a version built to a single
 * screen is not built to a single screen if something is waiting below it, and
 * the metadata belongs in the `metadata` export above, where a crawler will
 * actually read it, rather than printed on the page.
 *
 * The switcher is scaffolding. Once one version is chosen the other nine are
 * deleted, `VersionSwitcher` goes with them, and this file imports the winner
 * directly.
 */
export default function HomePage() {
  return (
    <div className="page-frame">
      <VersionSwitcher />
    </div>
  );
}
