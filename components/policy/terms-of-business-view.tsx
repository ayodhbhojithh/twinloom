import { PageShell, type PageSection } from "@/components/layout";
import {
  Clause,
  Gap,
  P,
  Point,
  Points,
  PolicyFoot,
  PolicyHead,
  POLICY_UPDATED,
  Ref,
  Sub,
} from "@/components/policy/kit";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Terms of Business.

   Twenty-five clauses, numbered as they are numbered in the source, because
   this is the document a proposal incorporates by reference and a proposal that
   says "clause 18" has to point at clause 18.

   Two things are outstanding and both are drawn as outstanding: the liability
   cap in clause 18, which is an insurance decision rather than a drafting one,
   and the solicitor review the whole document needs before it is relied on.
   Neither is something to guess at, and a plausible number in clause 18 is the
   single most expensive sentence anybody could put on this site.
--------------------------------------------------------------------------- */

const S = {
  c1: { id: "c1", title: "1. Parties and definitions" },
  c2: { id: "c2", title: "2. Scope" },
  c3: { id: "c3", title: "3. Client responsibilities" },
  c4: { id: "c4", title: "4. Timetable" },
  c5: { id: "c5", title: "5. Fees and payment" },
  c6: { id: "c6", title: "6. Expenses and third-party costs" },
  c7: { id: "c7", title: "7. Changes" },
  c8: { id: "c8", title: "8. Review and acceptance" },
  c9: { id: "c9", title: "9. Launch and post-launch defects" },
  c10: { id: "c10", title: "10. Intellectual property" },
  c11: { id: "c11", title: "11. Portfolio use" },
  c12: { id: "c12", title: "12. Third-party services" },
  c13: { id: "c13", title: "13. Hosting and care" },
  c14: { id: "c14", title: "14. Security" },
  c15: { id: "c15", title: "15. Data protection" },
  c16: { id: "c16", title: "16. Confidentiality" },
  c17: { id: "c17", title: "17. Warranties" },
  c18: { id: "c18", title: "18. Liability" },
  c19: { id: "c19", title: "19. Indemnities" },
  c20: { id: "c20", title: "20. Suspension" },
  c21: { id: "c21", title: "21. Termination" },
  c22: { id: "c22", title: "22. Exit and handover" },
  c23: { id: "c23", title: "23. Events outside reasonable control" },
  c24: { id: "c24", title: "24. General" },
  c25: { id: "c25", title: "25. Governing law and disputes" },
} satisfies Record<string, PageSection>;

export const BUSINESS_SECTIONS: readonly PageSection[] = Object.values(S);

export function TermsOfBusinessView() {
  return (
    <PageShell sections={BUSINESS_SECTIONS}>
      <PolicyHead
        title="Terms of Business"
        updated={POLICY_UPDATED}
        scope="The standard commercial terms for a client engagement. They apply where a proposal incorporates them, and only to services supplied to businesses for business purposes."
        note="The accepted proposal, its schedules and these terms form the agreement. Where the proposal expressly conflicts with these terms, the proposal takes priority for that project."
      />

      <Clause s={S.c1}>
        <P>
          <b>Supplier, we, us.</b> TwinCoreTech Ltd, a company registered in
          England and Wales, company number 15997244, registered office Bromley
          Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE. TwinLoom is a trading
          name of TwinCoreTech Ltd.
        </P>
        <P>
          <b>Client, you.</b> The person or organisation identified in the
          proposal.
        </P>
        <P>
          <b>Services.</b> The work described in the proposal.
        </P>
        <P>
          <b>Deliverables.</b> The outputs expressly listed in the proposal.
        </P>
        <P>
          <b>Third-party service.</b> Software, hosting, content, licence or
          platform supplied by somebody other than us.
        </P>
        <P>
          <b>Acceptance date.</b> The date the proposal is signed, accepted
          electronically, or otherwise accepted as stated in it.
        </P>
      </Clause>

      <Clause s={S.c2}>
        <P>The proposal defines the work.</P>
        <P>
          Anything not stated as a deliverable, a responsibility or an included
          assumption is not included merely because it was discussed, appears
          elsewhere on our website, or is commonly associated with a website.
        </P>
        <P>
          We may suggest changes. We do not carry out chargeable additional work
          until the effect on price and timing has been agreed in writing.
        </P>
      </Clause>

      <Clause s={S.c3}>
        <P>You will:</P>
        <Points>
          <Point>Provide accurate and complete business information</Point>
          <Point>
            Provide content, assets, data, access and decisions by the agreed
            dates
          </Point>
          <Point>
            Appoint one person authorised to approve work and resolve
            conflicting feedback
          </Point>
          <Point>
            Ensure that material you supply can lawfully be used
          </Point>
          <Point>
            Review factual, commercial, legal and regulated claims
          </Point>
          <Point>
            Maintain client-controlled accounts and payment methods
          </Point>
          <Point>
            Make staff and operational processes ready for shops, bookings or
            integrations
          </Point>
          <Point>
            Use systems in accordance with training and supplier terms
          </Point>
          <Point>
            Notify us promptly of an issue or a material business change
          </Point>
        </Points>
        <P>
          We may rely on an approval given by the authorised client contact.
        </P>
      </Clause>

      <Clause s={S.c4}>
        <P>
          The project plan depends on both parties meeting their
          responsibilities.
        </P>
        <P>If client material or approval is late:</P>
        <Points>
          <Point>Planned dates move by at least the resulting delay</Point>
          <Point>Booked capacity may be reassigned</Point>
          <Point>We may provide a revised start or launch date</Point>
          <Point>Work already completed remains payable</Point>
        </Points>
        <P>
          Where required client input is more than four weeks late, we may move
          the project to the next available slot. Where there has been no
          meaningful response for eight weeks, we may invoice completed work and
          close the active project after written notice.
        </P>
      </Clause>

      <Clause s={S.c5}>
        <P>
          Fees and milestones appear in the proposal. Unless the proposal says
          otherwise, the payment profile is 40 per cent on acceptance, 40 per
          cent on approval of the main design and working build, and 20 per cent
          before or on launch. Care plans are payable monthly in advance.
        </P>
        <P>
          Invoices are due within 14 days of the invoice date unless the
          proposal says otherwise.
        </P>
        <P>
          All fees are exclusive of VAT, which is charged at the prevailing rate
          where applicable.
        </P>
        <P>
          The deposit books capacity and is not refundable once work has begun,
          except where the agreement or the law requires otherwise.
        </P>
        <P>
          We may suspend work or managed services after giving notice where an
          undisputed invoice is overdue.
        </P>
        <P>
          Interest and recovery costs on late payment of a business debt may be
          applied in accordance with the Late Payment of Commercial Debts
          (Interest) Act 1998.
        </P>
      </Clause>

      <Clause s={S.c6}>
        <P>The proposal identifies foreseeable third-party costs.</P>
        <P>
          Client-owned platforms, such as domain, email, e-commerce, booking,
          CRM, advertising and content systems, are normally paid directly by
          the client.
        </P>
        <P>
          Where we purchase an item or a specialist service as part of the
          proposal, the proposal states the treatment and any management fee.
        </P>
        <P>
          We are not responsible for supplier price changes occurring after a
          quotation validity period, unless we expressly accepted that risk.
        </P>
      </Clause>

      <Clause s={S.c7}>
        <P>Either party may request a change.</P>
        <P>
          We assess the effect on deliverables, dependencies, timing, fees,
          testing and ongoing support. A change is not approved until both
          parties agree it in writing. We may group minor requests into a
          periodic change note.
        </P>
        <P>
          Corrections needed to make an agreed deliverable conform to the agreed
          scope are not chargeable changes.
        </P>
      </Clause>

      <Clause s={S.c8}>
        <P>
          Review points and included revision rounds appear in the proposal. You
          will provide consolidated feedback within the agreed period.
        </P>
        <P>A deliverable is accepted when:</P>
        <Points>
          <Point>You approve it in writing</Point>
          <Point>
            It meets the stated acceptance criteria and you have not rejected it
            with specific reasons within five working days
          </Point>
          <Point>It is used in production with your approval</Point>
        </Points>
        <P>
          Where the proposal requires an express legal, factual or launch
          approval, that approval must be given in writing and is not implied by
          silence.
        </P>
      </Clause>

      <Clause s={S.c9}>
        <P>
          We will not intentionally launch without the approval and access
          required by the proposal.
        </P>
        <P>
          Defects in the agreed build should be reported within 30 days after
          launch. We correct a confirmed defect without an additional
          development fee.
        </P>
        <P>A defect does not include:</P>
        <Points>
          <Point>A new or changed requirement</Point>
          <Point>Inaccurate client content</Point>
          <Point>A third-party outage or change</Point>
          <Point>Misuse, or an unsupported client modification</Point>
          <Point>
            A browser or platform change occurring after acceptance
          </Point>
          <Point>A matter recorded as an accepted limitation</Point>
        </Points>
        <P>
          Urgent security or data issues should be reported immediately,
          regardless of the defect period.
        </P>
      </Clause>

      <Clause s={S.c10}>
        <P>
          Subject to payment in full, you own the bespoke final design, approved
          copy created specifically for you, bespoke project code, and
          commissioned assets identified in the proposal. You retain ownership
          of material supplied by you, and you grant us the rights needed to
          perform the Services.
        </P>
        <P>Third-party materials remain subject to their own licences.</P>
        <P>
          We retain ownership of our pre-existing tools, general libraries,
          frameworks, methods, know-how and reusable components that are not
          client-specific. We grant the rights necessary for the delivered
          website to use those retained components as stated in the proposal.
        </P>
        <P>
          The proposal identifies any asset carrying restricted transfer, user,
          territory or duration terms.
        </P>
      </Clause>

      <Clause s={S.c11}>
        <P>
          Unless the proposal says otherwise, after public launch we may
          identify the client, link to the public website, show screenshots,
          describe the work at a reasonable level, and use non-confidential
          performance information approved by the client.
        </P>
        <P>
          We will not disclose confidential information or unpublished
          commercial data.
        </P>
        <P>
          You may opt out of portfolio use by telling us in writing, and the
          proposal may record an opt-out agreed in advance.
        </P>
      </Clause>

      <Clause s={S.c12}>
        <P>
          Third-party services are governed by their own terms, availability,
          pricing and product decisions.
        </P>
        <P>
          We exercise reasonable care in selection and integration, but we do
          not control the supplier.
        </P>
        <P>
          If a third-party change affects the website, we will identify the
          options. Work required to adapt may be chargeable, unless it is
          included in the care plan or caused by our failure to meet the agreed
          scope.
        </P>
        <P>
          You must maintain client-owned accounts, billing and appropriate
          administrator access.
        </P>
      </Clause>

      <Clause s={S.c13}>
        <P>
          Where we provide managed hosting or care, the service schedule states
          the environment, monitoring, backups, maintenance, support channel,
          response targets, included change allowance, planned maintenance,
          exclusions, notice and exit process, and data return or deletion.
        </P>
        <P>
          Response targets are targets to begin and manage a response. They are
          not guarantees that an independent platform can be restored within the
          same time.
        </P>
        <P>
          We may take urgent proportionate action to protect the service, the
          data or other clients, including temporary suspension of a compromised
          feature.
        </P>
      </Clause>

      <Clause s={S.c14}>
        <P>
          Each party will use appropriate security for the accounts and
          information it controls.
        </P>
        <P>
          You will use strong authentication, protect administrator access, and
          tell us promptly about a suspected compromise.
        </P>
        <P>
          We will maintain the controls stated in the proposal or care schedule,
          and notify you of a relevant personal-data breach in accordance with
          the data-processing terms.
        </P>
        <P>Neither party will knowingly introduce malicious code.</P>
      </Clause>

      <Clause s={S.c15}>
        <P>
          Each party will comply with applicable data-protection law for its
          role.
        </P>
        <P>
          Where we process personal information on your instructions, the
          agreement includes data-processing terms covering subject matter and
          duration, nature and purpose, data types and categories of people,
          documented instructions, confidentiality, security, sub-processors,
          rights assistance, incident assistance, assessments and consultations,
          deletion or return, audit information, and international transfers.
        </P>
        <P>
          Our published <Ref href={ROUTES.privacy}>Privacy notice</Ref>{" "}
          describes our own processing. It does not replace these contractual
          terms.
        </P>
      </Clause>

      <Clause s={S.c16}>
        <P>
          Each party will protect confidential information received from the
          other and use it only for the agreement.
        </P>
        <P>
          This does not apply to information that is public without breach, was
          already lawfully known, is independently developed, is lawfully
          obtained without restriction, or must be disclosed by law or by an
          authority.
        </P>
        <P>
          The obligation survives termination for five years, and continues
          indefinitely for trade secrets.
        </P>
      </Clause>

      <Clause s={S.c17}>
        <P>We warrant that:</P>
        <Points>
          <Point>
            We will perform the Services with reasonable care and skill
          </Point>
          <Point>We have authority to enter the agreement</Point>
          <Point>
            To our knowledge, bespoke work created by us will not knowingly
            infringe third-party rights
          </Point>
          <Point>
            We will address defects in accordance with the agreed process
          </Point>
        </Points>
        <P>
          You warrant that you have the rights and authority needed for the
          material, instructions and data you provide.
        </P>
        <P>
          Except as expressly stated, outcomes dependent on third parties or on
          markets, including search rankings, traffic, sales and inclusion in
          AI-generated answers, are not guaranteed.
        </P>
      </Clause>

      <Clause s={S.c18}>
        <P>
          Nothing in the agreement limits liability that cannot legally be
          limited, including fraud, fraudulent misrepresentation, and death or
          personal injury caused by negligence.
        </P>
        <P>
          Subject to that, neither party is liable for indirect or consequential
          loss, or for lost profit, revenue, business, goodwill or anticipated
          savings, except where the proposal expressly allocates that risk.
        </P>

        <Gap>
          The liability cap. This is a commercial and insurance decision rather
          than a drafting one: it has to match what the professional indemnity
          policy covers. A cap above the cover leaves the difference exposed;
          well below it and any client with a procurement function will push
          back. The usual shapes are fees paid in the preceding 12 months, a
          fixed sum, or the higher of the two. Worth deciding at the same time
          whether data protection, confidentiality and IP claims sit outside the
          general cap.
        </Gap>

        <P>
          You remain responsible for business decisions, content accuracy,
          fulfilment, and use of the website.
        </P>
      </Clause>

      <Clause s={S.c19}>
        <P>
          You will indemnify us against a third-party claim arising from
          unlawful material or instructions supplied by you.
        </P>
        <P>
          We will indemnify you against a third-party claim that bespoke work
          created solely by us infringes that party&apos;s intellectual property
          rights.
        </P>
        <P>
          In each case the indemnity is conditional on prompt written notice of
          the claim, the indemnifying party having control of the defence and
          settlement, and reasonable cooperation from the other party. Each
          indemnity is subject to the limits in clause 18.
        </P>
      </Clause>

      <Clause s={S.c20}>
        <P>
          We may suspend affected work or service where reasonably necessary
          because of overdue undisputed payment, a security risk, unlawful use,
          material breach, a client instruction, a third-party suspension, or
          risk to other clients or systems.
        </P>
        <P>
          Where practicable we give notice, and we limit any suspension to what
          is necessary.
        </P>
      </Clause>

      <Clause s={S.c21}>
        <P>Either party may terminate:</P>
        <Points>
          <Point>
            Under any notice period stated in the proposal or care schedule
          </Point>
          <Point>
            For a material breach not remedied within 14 days after written
            notice
          </Point>
          <Point>
            Immediately on insolvency or an irremediable serious breach, subject
            to applicable law
          </Point>
        </Points>
        <P>
          On termination, completed work and committed third-party costs become
          payable, each party returns or deletes confidential information as
          required, licences dependent on payment or on continuing service may
          end, the exit and data process applies, and clauses intended to
          survive continue in force.
        </P>
      </Clause>

      <Clause s={S.c22}>
        <P>
          After payment of amounts due, we provide the standard handover
          identified in the proposal or care schedule. This may include code,
          agreed assets, a content export, an account record, a current backup,
          and reasonable transfer information.
        </P>
        <P>
          Additional migration, reconfiguration, training, or work alongside a
          replacement supplier is chargeable at our stated rate unless it is
          included in the proposal.
        </P>
        <P>
          <b>We will not deliberately obstruct a move to another supplier.</b>
        </P>
      </Clause>

      <Clause s={S.c23}>
        <P>
          Neither party is liable for delay caused by an event outside its
          reasonable control, provided it takes reasonable steps to reduce the
          effect and communicates promptly.
        </P>
        <P>
          Payment for work already properly performed remains due.
        </P>
      </Clause>

      <Clause s={S.c24}>
        <Sub>Notices</Sub>
        <P>
          Notices must be in writing and sent to the address or email stated in
          the proposal.
        </P>

        <Sub>Assignment</Sub>
        <P>
          Neither party may assign the agreement without the other&apos;s
          written consent, which will not be unreasonably withheld. We may
          assign to a group company or on a transfer of our business.
        </P>

        <Sub>Subcontracting</Sub>
        <P>
          We may subcontract parts of the Services and remain responsible for
          work performed by our subcontractors.
        </P>

        <Sub>Waiver</Sub>
        <P>A failure to enforce a term is not a waiver of it.</P>

        <Sub>Severability</Sub>
        <P>
          If a term is unenforceable, the rest of the agreement continues in
          force.
        </P>

        <Sub>Entire agreement</Sub>
        <P>
          The proposal, its schedules and these terms are the entire agreement
          and replace earlier discussions, except that nothing excludes
          liability for fraudulent misrepresentation.
        </P>

        <Sub>Variation</Sub>
        <P>A variation is effective only when agreed in writing.</P>

        <Sub>Third-party rights</Sub>
        <P>
          A person who is not a party has no rights under the Contracts (Rights
          of Third Parties) Act 1999.
        </P>

        <Sub>Relationship</Sub>
        <P>
          The parties are independent contractors. Nothing creates a
          partnership, joint venture or employment relationship.
        </P>
      </Clause>

      <Clause s={S.c25}>
        <P>
          The agreement is governed by the law of England and Wales.
        </P>
        <P>
          Before starting court proceedings, the parties will attempt a
          good-faith discussion at senior level and will consider mediation
          where proportionate.
        </P>
        <P>
          The courts of England and Wales have exclusive jurisdiction, subject
          to any mandatory rule.
        </P>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
