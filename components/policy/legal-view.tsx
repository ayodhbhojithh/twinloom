import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PageShell, type PageSection } from "@/components/layout";
import {
  Clause,
  Facts,
  Grid,
  Mail,
  P,
  PolicyFoot,
  PolicyHead,
  POLICY_UPDATED,
} from "@/components/policy/kit";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Legal.

   The way into the other seven, and the one place the company details are set
   out rather than mentioned. Somebody arrives here for one of two reasons: to
   find a document, or to copy a company number into a supplier form. Both are
   answered above the fold.

   The seven are listed with what each one is for, not just named. "Terms of
   use" and "Terms of Business" are two documents a client can pick wrongly
   between, and the only thing that stops that is a sentence saying which is
   which.
--------------------------------------------------------------------------- */

const DOCS = [
  {
    href: ROUTES.privacy,
    n: "Privacy notice",
    sub: "What personal information we collect, why we use it, who receives it, how long we keep it, and your rights.",
  },
  {
    href: ROUTES.cookies,
    n: "Cookies and similar technologies",
    sub: "What this website stores on or reads from your device, and how to change your choice.",
  },
  {
    href: ROUTES.terms,
    n: "Terms of use",
    sub: "The terms that apply to using this website and sending us a scoping request.",
  },
  {
    href: ROUTES.termsOfBusiness,
    n: "Terms of Business",
    sub: "The standard commercial terms for a client engagement, which apply alongside an accepted proposal.",
  },
  {
    href: ROUTES.accessibility,
    n: "Accessibility",
    sub: "The standard we build to, what has been tested, known limitations, and how to report a problem.",
  },
  {
    href: ROUTES.complaints,
    n: "Complaints and data requests",
    sub: "How to raise a complaint or a personal-data request, and when to expect a response.",
  },
  {
    href: ROUTES.subProcessors,
    n: "Sub-processors",
    sub: "The providers that process personal data on our behalf, what each is used for, and where.",
  },
] as const;

const S = {
  company: { id: "company", title: "1. The company" },
  documents: { id: "documents", title: "2. Our documents" },
  contact: { id: "contact", title: "3. Contact" },
} satisfies Record<string, PageSection>;

export const LEGAL_SECTIONS: readonly PageSection[] = Object.values(S);

export function LegalView() {
  return (
    <PageShell sections={LEGAL_SECTIONS}>
      <PolicyHead
        title="Legal"
        updated={POLICY_UPDATED}
        scope="The company behind TwinLoom, and the seven documents that govern this website, your personal information and a client engagement."
      />

      <Clause s={S.company}>
        <P>
          TwinLoom is a trading name of <b>TwinCoreTech Ltd</b>.
        </P>

        <Facts
          rows={[
            { k: "Registered in", v: "England and Wales" },
            { k: "Company number", v: "15997244" },
            {
              k: "Registered office",
              v: "Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE",
            },
            { k: "VAT number", v: "489 0108 74" },
          ]}
        />
      </Clause>

      <Clause s={S.documents}>
        <P>
          Seven documents. Two of them are easy to pick wrongly between:{" "}
          <b>Terms of use</b> governs this website, and{" "}
          <b>Terms of Business</b> governs a client engagement.
        </P>

        <ul className="mt-6 grid max-w-measure gap-3 sm:grid-cols-2">
          {DOCS.map((doc) => (
            <li key={doc.href}>
              <Link
                href={doc.href}
                className="group/doc flex h-full flex-col rounded-[18px] bg-canvas p-5 transition-colors hover:bg-canvas-firm"
              >
                <span className="flex items-start justify-between gap-3">
                  <b className="max-w-[26ch] text-[15.5px] leading-[1.25] font-extrabold tracking-[-0.022em] text-ink">
                    {doc.n}
                  </b>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-0.5 size-4 flex-none text-idx transition-transform group-hover/doc:translate-x-0.5 group-hover/doc:-translate-y-0.5"
                  />
                </span>
                <span className="mt-2 block text-[13px] leading-[1.6] text-quiet">
                  {doc.sub}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Clause>

      <Clause s={S.contact}>
        <Grid
          head={["Purpose", "Address"]}
          rows={[
            [
              "General enquiries",
              <Mail key="hello" address="hello@twincoretech.com" />,
            ],
            [
              "Data protection and rights requests",
              <Mail key="privacy" address="privacy@twincoretech.com" />,
            ],
            [
              "Accessibility problems",
              <Mail key="info" address="info@twincoretech.com" />,
            ],
          ]}
        />
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
