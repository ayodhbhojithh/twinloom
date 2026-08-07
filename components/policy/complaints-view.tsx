import { PageShell, type PageSection } from "@/components/layout";
import {
  Clause,
  Facts,
  Gap,
  Grid,
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
   Complaints and data requests.

   The shortest page of the set and the one most likely to be read by somebody
   who is already annoyed. So the addresses are at the top, the timings are a
   table rather than a paragraph, and the first line says that no particular
   form or legal phrase is needed - which is the thing that stops most people
   writing at all.
--------------------------------------------------------------------------- */

const S = {
  contact: { id: "contact", title: "1. Contact" },
  handling: { id: "handling", title: "2. How we handle a complaint" },
  rights: { id: "rights", title: "3. Personal-data rights requests" },
  dissatisfied: { id: "dissatisfied", title: "4. If you remain dissatisfied" },
  learning: { id: "learning", title: "5. Learning from complaints" },
} satisfies Record<string, PageSection>;

export const COMPLAINTS_SECTIONS: readonly PageSection[] = Object.values(S);

export function ComplaintsView() {
  return (
    <PageShell sections={COMPLAINTS_SECTIONS}>
      <PolicyHead
        title="Complaints and data requests"
        updated={POLICY_UPDATED}
        scope="How to raise a complaint or a personal-data request with TwinCoreTech Ltd, and when to expect a response."
        note="You do not need to use a particular form or a legal phrase. Tell us what happened, when it happened if you know, and what you would like us to do."
      />

      <Clause s={S.contact}>
        <Facts
          rows={[
            { k: "Email", v: <Mail address="hello@twincoretech.com" /> },
            {
              k: "Post",
              v: "TwinCoreTech Ltd, Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE",
            },
          ]}
        />

        <Gap>
          A telephone number for complaints, or a decision not to publish one.
          It belongs as a row in the table above.
        </Gap>

        <P>
          For anything about personal data, you can also write to{" "}
          <Mail address="privacy@twincoretech.com" />.
        </P>
        <P>
          For a problem using the website itself, including anything that makes
          it hard to read or operate, write to{" "}
          <Mail address="info@twincoretech.com" />.
        </P>
      </Clause>

      <Clause s={S.handling}>
        <Grid
          head={["Step", "When"]}
          rows={[
            [
              "Acknowledgement by a person, with a reference",
              "Within 2 working days",
            ],
            [
              "Initial review, and a request for anything missing",
              "As soon as practical",
            ],
            ["Full written response", "Within 10 working days"],
            [
              "Notice and a revised date, if the complaint is complex",
              "Before the original deadline",
            ],
            [
              "Senior review, if you ask for one",
              "Within a further 10 working days",
            ],
          ]}
        />
        <P>
          Where possible, a complaint is reviewed by somebody who was not
          directly responsible for what happened.
        </P>
        <P>Our response explains:</P>
        <Points>
          <Point>What we understood</Point>
          <Point>What we reviewed</Point>
          <Point>What we found</Point>
          <Point>What we will do, and when it will happen</Point>
          <Point>How to ask for a review</Point>
        </Points>
      </Clause>

      <Clause s={S.rights}>
        <P>
          You may ask about access, correction, deletion, restriction,
          objection, portability, or withdrawal of consent.
        </P>
        <P>
          We may ask for information needed to confirm your identity and to
          locate the relevant records.
        </P>
        <P>
          Requests are normally free. The response period, and any permitted
          extension, depend on the request and on applicable law. We will
          explain the position rather than delay without telling you.
        </P>
        <P>
          Our <Ref href={ROUTES.privacy}>Privacy notice</Ref> sets out how we
          use personal information.
        </P>
      </Clause>

      <Clause s={S.dissatisfied}>
        <P>
          For a concern about personal data, you can complain to the Information
          Commissioner&apos;s Office at{" "}
          <Ref href="https://ico.org.uk">ico.org.uk</Ref>, or on 0303 123 1113.
          You do not have to complete our process first.
        </P>
        <P>
          For a contractual dispute, our{" "}
          <Ref href={ROUTES.termsOfBusiness}>Terms of Business</Ref> set out the
          process and the applicable law.
        </P>
        <Gap>
          Whether TwinCoreTech Ltd belongs to an ombudsman scheme, trade
          association or alternative dispute resolution scheme. If it does, name
          it here. If it does not, nothing is added - a membership that does not
          exist must not be implied.
        </Gap>
      </Clause>

      <Clause s={S.learning}>
        <P>
          We record the issue, the response, the action taken and the timing,
          subject to appropriate access controls and retention periods.
        </P>
        <P>
          Patterns feed into how we run the service, and into our accessibility,
          security and content decisions.
        </P>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
