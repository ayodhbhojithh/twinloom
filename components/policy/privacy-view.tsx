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
  Sub,
} from "@/components/policy/kit";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Privacy notice.

   Written out rather than rendered from the markdown it came from. A legal
   document is not content in a feed: the tables have to be tables, the lawful
   basis has to sit beside the purpose it belongs to, and the two things nobody
   has answered yet have to be visible as unanswered rather than swallowed by a
   parser that renders `[[NEEDS: …]]` as ordinary text.

   Sixteen numbered sections. Numbered because this is a document people quote
   at each other: a data request that says "section 11" and a page that agrees
   what section 11 is are the same conversation.
--------------------------------------------------------------------------- */

const S = {
  who: { id: "who", title: "1. Who is responsible for the information" },
  given: { id: "given", title: "2. Information you give us" },
  collected: {
    id: "collected",
    title: "3. Information collected when you use the website",
  },
  why: { id: "why", title: "4. Why we use personal information" },
  optional: {
    id: "optional",
    title: "5. What happens if you do not provide information",
  },
  receives: { id: "receives", title: "6. Who receives the information" },
  processor: {
    id: "processor",
    title: "7. Client information we process on instructions",
  },
  transfers: { id: "transfers", title: "8. International transfers" },
  retention: { id: "retention", title: "9. How long we keep it" },
  security: { id: "security", title: "10. Security" },
  rights: { id: "rights", title: "11. Your rights" },
  marketing: { id: "marketing", title: "12. Marketing" },
  children: { id: "children", title: "13. Children" },
  automated: { id: "automated", title: "14. Automated decisions" },
  complaints: { id: "complaints", title: "15. Complaints" },
  changes: { id: "changes", title: "16. Changes to this notice" },
} satisfies Record<string, PageSection>;

export const PRIVACY_SECTIONS: readonly PageSection[] = Object.values(S);

export function PrivacyView() {
  return (
    <PageShell sections={PRIVACY_SECTIONS}>
      <PolicyHead
        title="Privacy notice"
        updated={POLICY_UPDATED}
        scope="Applies to all personal information processed by TwinCoreTech Ltd across the TwinLoom and TwinCoreTech websites and the services provided under either name."
        note="Written to UK GDPR and the Data Protection Act 2018. It explains what we collect, why we use it, who receives it, how long it is kept, and the rights available to you."
      />

      <Clause s={S.who}>
        <P>
          TwinLoom is a trading name of <b>TwinCoreTech Ltd</b>.
        </P>

        <Facts
          rows={[
            { k: "Company number", v: "15997244" },
            {
              k: "Registered office",
              v: "Bromley Old Town Hall, 30 Tweedy Road, Bromley BR1 3FE",
            },
            { k: "VAT number", v: "489 0108 74" },
            {
              k: "Privacy contact",
              v: <Mail address="privacy@twincoretech.com" />,
            },
          ]}
        />

        <Gap>
          The ICO registration number, or confirmation that TwinCoreTech Ltd is
          not registered. It belongs in the table above.
        </Gap>

        <P>
          TwinCoreTech Ltd is the controller for the personal information
          described in this notice, except where we process information only on
          a client&apos;s instructions as part of providing a client website or
          a connected service. That situation is described in section 7.
        </P>

        <P>
          This notice covers the twinloom.com website and the twincoretech.com
          website, and services provided under either name.
        </P>
      </Clause>

      <Clause s={S.given}>
        <Sub>Enquiries and contact</Sub>
        <P>
          When you call, email, book a meeting or submit a form, we may collect
          your name, your business or organisation, your job title, your contact
          details, the content of your message, meeting details including the
          time booked and what you told us on the booking form, the written
          notes we take during a meeting, and any follow-up correspondence.
        </P>
        <P>
          We do not record introductory meetings. The notes we take are written
          up and sent to you afterwards as a summary for you to correct, and
          that summary is what we keep. Booking a meeting does not add you to a
          mailing list.
        </P>

        <Sub>Scoping requests</Sub>
        <P>
          The TwinLoom website lets you send us a description of the website you
          want. Where you do, we collect the contact details you give us, your
          description in your own words, your answers to any scoping questions
          you choose to answer, and any files, images, screenshots, links or
          notes you attach.
        </P>
        <P>
          We also keep a reference for your request, a record of anything you
          add to it afterwards, and the date and time of each. Adding to a
          request amends the original rather than creating a second one.
        </P>
        <P>
          Questions you leave unanswered are recorded as assumptions we have
          made, and shown to you as assumptions, rather than filled in on your
          behalf.
        </P>
        <P>
          Please do not submit passwords, payment-card details, unnecessary
          customer records, health information or other sensitive personal
          information unless we have agreed a secure and appropriate method with
          you in advance.
        </P>

        <Sub>Client projects</Sub>
        <P>
          If you become a client, we may collect client contacts and
          decision-makers, proposal, contract and billing information, project
          communications, approvals and decisions, account and access records,
          support requests, meeting notes and recordings where agreed, and the
          information needed to deliver, secure and maintain the work.
        </P>

        <Sub>Supplier and partner contacts</Sub>
        <P>
          We may hold business contact, contract, payment, performance and
          due-diligence information for suppliers, contractors and specialist
          partners.
        </P>

        <Sub>Marketing preferences</Sub>
        <P>
          Where you ask to receive updates, we record your contact details, your
          consent or other applicable basis, the topics you asked for, and your
          unsubscribe status.
        </P>
      </Clause>

      <Clause s={S.collected}>
        <P>
          Depending on your choices, we may receive your IP address, browser and
          device information, the pages you requested, the date and time,
          referral information, an approximate location derived from network
          information, your consent preferences, error and security logs, your
          interactions with forms and website features, and analytics events.
        </P>
        <P>
          The <Ref href={ROUTES.cookies}>Cookies page</Ref> lists the storage
          and access technologies actually used by this website.
        </P>
      </Clause>

      <Clause s={S.why}>
        <Grid
          head={["Purpose", "Information", "Lawful basis"]}
          rows={[
            [
              "Respond to an enquiry",
              "Contact details and enquiry content",
              "Legitimate interests in responding to business enquiries; steps requested before entering a contract",
            ],
            [
              "Receive and review a scoping request",
              "Submitted content, attachments and business information",
              "Steps requested before entering a contract",
            ],
            [
              "Let you add to a scoping request already sent",
              "The request, its reference and the record of changes",
              "Steps requested before entering a contract; legitimate interests in providing the requested feature",
            ],
            [
              "Prepare a written scope and a proposal",
              "Submitted content and business information",
              "Steps requested before entering a contract",
            ],
            [
              "Deliver a project or a care plan",
              "Client, project, account and support information",
              "Performance of a contract",
            ],
            [
              "Invoice and maintain financial records",
              "Client and transaction information",
              "Performance of a contract; legal obligations",
            ],
            [
              "Secure and operate the website",
              "Network, device, log and security information",
              "Legitimate interests in security, service operation and fraud prevention",
            ],
            ["Measure website use", "Usage and analytics information", "Consent"],
            [
              "Send requested or permitted marketing",
              "Contact details and preferences",
              "Consent, or legitimate interests subject to direct-marketing rules",
            ],
            [
              "Manage suppliers and partners",
              "Contact, contract and performance information",
              "Performance of a contract; legitimate interests",
            ],
            [
              "Establish or defend legal rights",
              "Relevant records",
              "Legitimate interests; legal obligations",
            ],
            [
              "Meet regulatory requirements",
              "Relevant business and personal information",
              "Legal obligations",
            ],
          ]}
        />
      </Clause>

      <Clause s={S.optional}>
        <P>
          You do not have to answer any scoping question, and you do not have to
          send files. The scoping journey is designed so that you can give as
          little or as much as you want to each question, and send at any point.
        </P>
        <P>
          We do need a name and a contact route we can reply to, and enough
          information to respond to your enquiry. If you become a client, some
          information is required to enter and perform the agreement, manage
          access and issue invoices.
        </P>
        <P>Optional fields are labelled optional.</P>
      </Clause>

      <Clause s={S.receives}>
        <P>We may share information with:</P>
        <Points>
          <Point>Hosting and deployment providers</Point>
          <Point>File-storage providers</Point>
          <Point>Email and business-productivity providers</Point>
          <Point>Booking providers</Point>
          <Point>Analytics and consent providers</Point>
          <Point>Accounting and payment providers</Point>
          <Point>Customer-relationship or project tools</Point>
          <Point>Professional advisers and insurers</Point>
          <Point>Specialist partners working under our contract</Point>
          <Point>
            Regulators, courts or public authorities, where required
          </Point>
          <Point>
            A potential buyer or successor, in a properly managed business
            transaction
          </Point>
        </Points>
        <P>
          <b>We do not sell personal information to advertisers.</b>
        </P>
        <P>
          The{" "}
          <Ref href={ROUTES.subProcessors}>Sub-processors page</Ref> names the
          suppliers that process personal information for us.
        </P>
      </Clause>

      <Clause s={S.processor}>
        <P>
          When we host or support a client website, we may process that
          client&apos;s customer, employee or user information solely to provide
          the agreed service.
        </P>
        <P>In that situation:</P>
        <Points>
          <Point>
            The client decides the purpose and means of the processing
          </Point>
          <Point>The client is the controller</Point>
          <Point>
            TwinCoreTech Ltd acts as processor under the agreement
          </Point>
          <Point>
            Sub-processors, security, assistance, deletion and return are
            governed by the data-processing terms in that agreement
          </Point>
        </Points>
        <P>
          This notice does not replace the client&apos;s own privacy notice to
          the people whose information it collects.
        </P>
      </Clause>

      <Clause s={S.transfers}>
        <P>Some suppliers may store or access information outside the UK.</P>
        <P>
          Where UK data-protection law requires safeguards, we use an applicable
          lawful transfer mechanism and assess the transfer and the supplier as
          required. The{" "}
          <Ref href={ROUTES.subProcessors}>Sub-processors page</Ref> identifies
          the locations and safeguards for each supplier.
        </P>
      </Clause>

      <Clause s={S.retention}>
        <Grid
          head={["Record", "Retention"]}
          rows={[
            ["A scoping request saved but not sent", "30 days from last activity"],
            [
              "A submitted enquiry that does not become a client",
              "12 months after the last meaningful contact",
            ],
            [
              "A proposal that is not accepted",
              "24 months after expiry or final contact",
            ],
            ["Client project and contract records", "The contract term plus 6 years"],
            [
              "Invoices and tax records",
              "The period required by tax and company law",
            ],
            [
              "Support and security logs",
              "Between 30 and 180 days, depending on purpose",
            ],
            ["Analytics", "The shortest useful setting the tool supports"],
            [
              "Marketing records",
              "Until unsubscribe, objection or an inactivity rule applies, plus a suppression record",
            ],
            ["Complaint and data-rights records", "6 years"],
            ["Backup copies", "A rotating schedule, then overwritten"],
          ]}
        />

        <Gap>
          The retention period for meeting notes and summaries. It belongs as a
          row in the table above.
        </Gap>

        <P>
          We may keep information for longer where it is necessary for a legal
          claim, a regulatory requirement, fraud prevention, or an agreed client
          instruction.
        </P>
      </Clause>

      <Clause s={S.security}>
        <P>
          We use proportionate technical and organisational measures designed to
          protect personal information. These include access control,
          multi-factor authentication, encryption in transit, supplier review,
          logging, secure development practices, backups, obligations on staff
          and contractors, and incident procedures.
        </P>
        <P>
          No internet service can promise absolute security. Please do not use
          ordinary website forms to send passwords or highly sensitive records.
        </P>
      </Clause>

      <Clause s={S.rights}>
        <P>Depending on the circumstances, you may have the right to:</P>
        <Points>
          <Point>Ask for access to your personal information</Point>
          <Point>Ask us to correct information that is inaccurate</Point>
          <Point>Ask for deletion</Point>
          <Point>Ask us to restrict how we use it</Point>
          <Point>
            Object to processing based on legitimate interests, or to direct
            marketing
          </Point>
          <Point>Receive certain information in a portable format</Point>
          <Point>Withdraw consent</Point>
          <Point>
            Complain to the Information Commissioner&apos;s Office
          </Point>
          <Point>
            Ask about the safeguards used for an international transfer
          </Point>
        </Points>
        <P>
          These rights are not absolute in every situation. We may need to
          confirm your identity and understand the request before acting on it.
        </P>
        <P>
          To exercise any of them, write to{" "}
          <Mail address="privacy@twincoretech.com" />.
        </P>
      </Clause>

      <Clause s={S.marketing}>
        <P>
          You can unsubscribe using the link in the message, or by contacting
          us.
        </P>
        <P>
          Stopping marketing does not prevent us sending service, contract,
          security or transaction messages that are still necessary.
        </P>
        <P>
          We keep a minimal suppression record where that is needed to respect
          an unsubscribe request.
        </P>
      </Clause>

      <Clause s={S.children}>
        <P>
          This website and these services are directed to businesses and are not
          designed for children to submit briefs.
        </P>
        <P>
          If you believe a child has sent us personal information, contact us so
          that we can assess it and remove it where appropriate.
        </P>
      </Clause>

      <Clause s={S.automated}>
        <P>
          We use your answers to generate an outline of the website they
          describe, and to produce a written scope.
        </P>
        <P>
          That output is a planning aid. It does not automatically accept or
          reject a client, create a contract, set a final price, or make any
          decision with a legal or similarly significant effect.{" "}
          <b>A person reviews every submitted request.</b>
        </P>
      </Clause>

      <Clause s={S.complaints}>
        <P>
          Contact us first at <Mail address="privacy@twincoretech.com" />, or
          use the <Ref href={ROUTES.complaints}>Complaints page</Ref>.
        </P>
        <P>
          You also have the right to complain to the Information
          Commissioner&apos;s Office at{" "}
          <Ref href="https://ico.org.uk">ico.org.uk</Ref> or on 0303 123 1113.
          You do not have to complete our process before doing so.
        </P>
      </Clause>

      <Clause s={S.changes}>
        <P>
          We update this notice when the website, our suppliers or our
          processing changes.
        </P>
        <P>
          Material changes are dated and, where appropriate, brought directly to
          the attention of affected clients and subscribers.
        </P>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
