import { PageShell, type PageSection } from "@/components/layout";
import {
  Clause,
  NotYet,
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
   Sub-processors.

   The page states that we disclose the providers who process personal data for
   us. A version of it that names none does exactly the opposite of what it
   says, in public, which is worse than not having the page - so the tables are
   absent and what has to fill them is written out instead.

   Ten providers, each with a name, a purpose and a processing location, plus a
   transfer safeguard for anything outside the UK. Most large providers publish
   the safeguard in their own data processing agreement and it lifts straight
   across.
--------------------------------------------------------------------------- */

const S = {
  what: { id: "what", title: "1. What this page is" },
  operations: { id: "operations", title: "2. Website and business operations" },
  managed: { id: "managed", title: "3. Managed client services" },
  partners: { id: "partners", title: "4. Specialist partners" },
  changes: { id: "changes", title: "5. Changes" },
} satisfies Record<string, PageSection>;

export const SUBPROCESSOR_SECTIONS: readonly PageSection[] = Object.values(S);

export function SubProcessorsView() {
  return (
    <PageShell sections={SUBPROCESSOR_SECTIONS}>
      <PolicyHead
        title="Sub-processors"
        updated={POLICY_UPDATED}
        scope="The providers that process personal data on behalf of TwinCoreTech Ltd, what each is used for, and where the processing happens."
        note="Each provider listed here processes personal data on our behalf under written terms. We give clients at least 30 days' notice before adding or replacing a sub-processor used for their services."
      />

      <Clause s={S.what}>
        <NotYet what="The provider list has not been compiled, so no list is shown.">
          <P>
            This is the one page that cannot be partially published. A
            sub-processor page states publicly that we disclose the providers
            who process personal data for us; a version of it naming none does
            the opposite of what it says, which is worse than not having the
            page at all.
          </P>
          <P>Each provider needs three things, and a fourth where it applies:</P>
          <Points>
            <Point>The provider&apos;s name</Point>
            <Point>What we use it for</Point>
            <Point>
              The country or region where it processes data
            </Point>
            <Point>
              Where that is outside the UK, the transfer safeguard - usually UK
              adequacy regulations, the International Data Transfer Agreement,
              or the UK Addendum to the EU standard contractual clauses. Most
              large providers publish this in their own data processing
              agreement and it can be lifted straight across.
            </Point>
          </Points>
          <P>
            Two things have to agree with the finished list. The analytics
            provider named here must be the one named on the{" "}
            <Ref href={ROUTES.cookies}>Cookies page</Ref>. The scheduling and
            video-call providers named here are the ones the{" "}
            <Ref href={ROUTES.privacy}>Privacy notice</Ref> refers to in its
            section about meetings.
          </P>
        </NotYet>
      </Clause>

      <Clause s={S.operations}>
        <P>
          Eight providers belong in this section, covering website hosting,
          business email, file storage and sharing, website analytics, client
          records and project management, meeting scheduling, online meetings,
          and invoicing and accounts.
        </P>
      </Clause>

      <Clause s={S.managed}>
        <P>
          Two providers belong in this section, covering client website hosting
          and uptime monitoring and support.
        </P>
      </Clause>

      <Clause s={S.partners}>
        <P>
          Where a specialist partner carries out work involving access to client
          data, they are engaged under written terms with equivalent
          obligations, and named to the client before they begin.
        </P>
        <P>
          The partners who need listing here are the ones whose work involves
          seeing client data: brand identity, photography, and campaign
          management. Each needs its name, what it does, and what data it sees.
        </P>
      </Clause>

      <Clause s={S.changes}>
        <P>
          We keep this page current. Clients on a care plan are notified of a
          change in advance, in accordance with their agreement.
        </P>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
