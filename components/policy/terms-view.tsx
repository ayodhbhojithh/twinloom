import { PageShell, type PageSection } from "@/components/layout";
import {
  Clause,
  Facts,
  Mail,
  P,
  Point,
  Points,
  PolicyFoot,
  PolicyHead,
  POLICY_UPDATED,
  Ref,
} from "@/components/policy/kit";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Terms of use.

   The website, and nothing else. The distinction this page exists to draw is
   the one at the top of it: these terms are not the agreement for building a
   website, and somebody who has signed a proposal is reading the wrong
   document. It is said in the scope card, again in the opening line, and again
   at the foot.
--------------------------------------------------------------------------- */

const S = {
  who: { id: "who", title: "1. Who runs this website" },
  using: { id: "using", title: "2. Using the website" },
  info: { id: "info", title: "3. Information on the website" },
  submitted: {
    id: "submitted",
    title: "4. Scoping requests and material you submit",
  },
  ip: { id: "ip", title: "5. Intellectual property" },
  links: { id: "links", title: "6. Links and third-party services" },
  availability: { id: "availability", title: "7. Availability" },
  liability: { id: "liability", title: "8. Liability" },
  law: { id: "law", title: "9. Governing law" },
  contact: { id: "contact", title: "10. Contact" },
} satisfies Record<string, PageSection>;

export const TERMS_SECTIONS: readonly PageSection[] = Object.values(S);

export function TermsView() {
  return (
    <PageShell sections={TERMS_SECTIONS}>
      <PolicyHead
        title="Terms of use"
        updated={POLICY_UPDATED}
        scope="Governs use of this public website. Client work is governed separately, by an accepted proposal together with our Terms of Business."
        note="These terms apply to your use of this website. They do not form the agreement for website development or managed services."
      />

      <Clause s={S.who}>
        <P>
          This website is operated by <b>TwinCoreTech Ltd</b>, trading as
          TwinLoom.
        </P>

        <Facts
          rows={[
            { k: "Company number", v: "15997244" },
            {
              k: "Registered office",
              v: "Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE",
            },
            { k: "VAT number", v: "489 0108 74" },
            { k: "Email", v: <Mail address="hello@twincoretech.com" /> },
          ]}
        />
      </Clause>

      <Clause s={S.using}>
        <P>You may:</P>
        <Points>
          <Point>Browse the website</Point>
          <Point>Print pages for your own use</Point>
          <Point>Share links</Point>
          <Point>Quote reasonable extracts with attribution</Point>
        </Points>

        <P className="mt-6">You must not:</P>
        <Points>
          <Point>Use the website unlawfully</Point>
          <Point>
            Attempt to bypass security or reach non-public areas
          </Point>
          <Point>Introduce malware or harmful material</Point>
          <Point>
            Overload, scrape or harvest the service in a way that disrupts it or
            infringes rights
          </Point>
          <Point>
            Copy a substantial part of the content, design or code for
            republication
          </Point>
          <Point>Misrepresent our content or our identity</Point>
          <Point>
            Use another person&apos;s request reference or submitted material
            without their authority
          </Point>
        </Points>
      </Clause>

      <Clause s={S.info}>
        <P>
          The website contains general information about our services and our
          approach.
        </P>
        <P>
          Any indicative prices are not quotations. Articles about technology,
          search, privacy, cookies or accessibility are general information, and
          not legal, tax, financial or other regulated professional advice.
        </P>
        <P>
          We try to keep material accurate, but technology, supplier prices,
          laws and platform behaviour all change. Check the date, and ask us
          about anything material to a decision.
        </P>
      </Clause>

      <Clause s={S.submitted}>
        <P>
          Material you have entered but not sent is held in your browser and is
          not received by us until you send it.
        </P>
        <P>When you send us material:</P>
        <Points>
          <Point>You keep ownership of it</Point>
          <Point>You confirm that you have the right to share it</Point>
          <Point>
            You give us permission to use it to review your enquiry,
            communicate with you and prepare a proposal
          </Point>
          <Point>
            You agree not to submit unlawful material, malware, passwords,
            payment-card data or unnecessary sensitive records
          </Point>
        </Points>
        <P>
          The outline of a website generated from your answers is indicative. It
          is a description of what you have told us, not an offer, an
          acceptance, professional advice, a quotation or a contract.
        </P>
        <P>
          Anything you add to a request after sending it amends that same
          request rather than creating a new one. The reference we give you
          identifies the request as a whole.
        </P>
        <P>
          What happens to your details is set out in our{" "}
          <Ref href={ROUTES.privacy}>Privacy notice</Ref>.
        </P>
      </Clause>

      <Clause s={S.ip}>
        <P>
          Unless stated otherwise, the content, design, branding and code of
          this website are owned by or licensed to TwinCoreTech Ltd.
        </P>
        <P>
          Client ownership of commissioned work is governed by the relevant
          client agreement, not by these website terms.
        </P>
        <P>
          Third-party names, marks and content remain the property of their
          respective owners.
        </P>
      </Clause>

      <Clause s={S.links}>
        <P>
          We provide links because they may be useful. We do not control
          external websites, and we do not guarantee their availability, content
          or privacy practices.
        </P>
        <P>
          Where a feature opens or embeds a third-party service, that
          provider&apos;s terms may also apply.
        </P>
      </Clause>

      <Clause s={S.availability}>
        <P>We may change, suspend or withdraw parts of the website.</P>
        <P>
          We do not guarantee uninterrupted access, and we cannot guarantee that
          material held in your browser but not sent can be recovered.
        </P>
      </Clause>

      <Clause s={S.liability}>
        <P>
          Nothing in these terms excludes liability that cannot legally be
          excluded, including liability for death or personal injury caused by
          negligence, for fraud, or for fraudulent misrepresentation.
        </P>
        <P>Subject to that, and to any rights that cannot be limited:</P>
        <Points>
          <Point>
            The website is provided for general information and enquiry
          </Point>
          <Point>
            We are not liable for a decision made solely from general website
            material
          </Point>
          <Point>
            We are not liable for indirect or consequential business loss
            arising from ordinary use or unavailability of this website
          </Point>
          <Point>
            Liability for client services is governed by the client agreement
            rather than by these terms
          </Point>
        </Points>
      </Clause>

      <Clause s={S.law}>
        <P>
          These terms are governed by the law of England and Wales.
        </P>
        <P>
          The courts of England and Wales have jurisdiction, subject to any
          mandatory rights that apply to you.
        </P>
      </Clause>

      <Clause s={S.contact}>
        <P>
          Questions about these terms: <Mail address="hello@twincoretech.com" />
        </P>
        <P>
          See also the{" "}
          <Ref href={ROUTES.termsOfBusiness}>Terms of Business</Ref> and the{" "}
          <Ref href={ROUTES.privacy}>Privacy notice</Ref>.
        </P>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
