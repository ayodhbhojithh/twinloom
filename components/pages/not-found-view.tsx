"use client";

import { usePathname } from "next/navigation";

import { Actions, ActionLink } from "@/components/blocks/action-link";
import { P } from "@/components/blocks/prose";
import { TextLink } from "@/components/blocks/text-link";
import { SimpleList } from "@/components/blocks/simple-list";
import { PageHeading, PageShell } from "@/components/layout";
import { ROUTES } from "@/lib/site";

/** The draft's four, and where each one sits, so the note is not decoration. */
const USEFUL = [
  {
    label: "Our products and services",
    note: "Services",
    href: ROUTES.services,
  },
  { label: "Pricing", note: "Pricing", href: ROUTES.pricing },
  { label: "Start your project", note: "Start", href: ROUTES.start },
  { label: "Contact us", note: "Contact", href: ROUTES.contact },
] as const;

/**
 * The 404.
 *
 * The copy is the draft's, word for word. The treatment is the system's own, and
 * the whole idea is that a system this quiet does not need a new voice to make an
 * error page feel considered. It needs its own voice, used well.
 *
 * Three decisions carry it.
 *
 * The numeral is set in mono at display size. The draft's one rule about mono is
 * that it is for machine labels, and `404` is the most machine label there is: it
 * is a status code, not a word. Setting it huge and in the faintest grey makes it
 * a graphic without inventing any ink the site does not already use.
 *
 * The address that failed is shown back. A visitor who mistyped can see the typo,
 * and a visitor who followed a bad link has the thing to quote when they tell us,
 * which is the last line the draft asks for. `usePathname` is why this is a client
 * component, and it is the only reason.
 *
 * The four useful links use the simple list rather than a bulleted list, so the
 * page ends in a component the rest of the site already uses instead of in raw
 * markup that happens to be here.
 */
export function NotFoundView() {
  const pathname = usePathname();

  return (
    <PageShell>
      {/* aria-hidden: a screen reader gets "We could not find that page" from
          the heading. Reading out "404" first is noise. */}
      <p
        aria-hidden
        className="mb-1 font-mono text-[84px] leading-[0.82] font-bold tracking-[-0.04em] text-unrated select-none sm:text-[120px] lg:text-[150px]"
      >
        404
      </p>

      <PageHeading
        title="We could not find that page"
        lead="The address may be old, incomplete or mistyped."
      >
        <Actions>
          <ActionLink href={ROUTES.home} variant="primary">
            Go to the homepage
          </ActionLink>
          <ActionLink href={ROUTES.search}>Search the website</ActionLink>
        </Actions>
      </PageHeading>

      {/* The fact, in the typeface the system reserves for facts. */}
      <div className="mt-9 max-w-measure rounded-card border border-hair bg-well px-5 py-4">
        <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-label uppercase">
          Address requested
        </p>
        <p className="mt-1.5 font-mono text-[13px] break-all text-body">
          {pathname}
        </p>
      </div>

      <SimpleList
        className="mt-10"
        title="Where you may have been going"
        rows={USEFUL.map((row) => ({ ...row, tone: "planned" as const }))}
      />

      <P className="mt-9">
        If you followed a link on this website,{" "}
        <TextLink href={ROUTES.contact} arrow>
          tell us
        </TextLink>{" "}
        so that we can fix it.
      </P>
    </PageShell>
  );
}
