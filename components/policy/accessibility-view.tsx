import { PageShell, type PageSection } from "@/components/layout";
import {
  Clause,
  Gap,
  Grid,
  Mail,
  NotYet,
  P,
  Point,
  Points,
  PolicyFoot,
  PolicyHead,
  POLICY_UPDATED,
} from "@/components/policy/kit";

/* ---------------------------------------------------------------------------
   Accessibility.

   The conformance status is the whole point of an accessibility statement, and
   it is the one thing that cannot be written before the site is tested. So it
   is absent, and what is missing is named.

   The temptation on this page is to claim partial conformance because that
   sounds modest and safe. It is not: it is still a claim, made about criteria
   nobody checked, on a page whose entire purpose is to be a truthful account of
   what works. "Not yet assessed" is the only honest status before an audit, and
   it is what this says.
--------------------------------------------------------------------------- */

const S = {
  target: { id: "target", title: "1. Our target" },
  possible: { id: "possible", title: "2. What should be possible" },
  status: { id: "status", title: "3. Current conformance status" },
  limits: { id: "limits", title: "4. Known limitations" },
  third: { id: "third", title: "5. Third-party content" },
  report: { id: "report", title: "6. Report a problem" },
  prepared: { id: "prepared", title: "7. How this statement was prepared" },
} satisfies Record<string, PageSection>;

export const ACCESS_SECTIONS: readonly PageSection[] = Object.values(S);

export function AccessibilityView() {
  return (
    <PageShell sections={ACCESS_SECTIONS}>
      <PolicyHead
        title="Accessibility"
        updated={POLICY_UPDATED}
        scope="Covers this website. It is a statement of the standard we build to and what has been tested, not a claim that one standard covers every legal duty."
        note="We want this website to be usable by as many people as reasonably possible, including people using keyboards, screen readers, magnification, voice input, or changed text and colour settings."
      />

      <Clause s={S.target}>
        <P>
          Our design and development target is the Web Content Accessibility
          Guidelines <b>WCAG 2.2 Level AA</b>. It is also the standard we build
          client websites to, as one of the eleven things included in every site
          we build.
        </P>
        <P>
          For a private business the legal position is not identical to the
          public-sector accessibility regulations. The Equality Act 2010 can
          still require reasonable adjustments in the provision of services.
          This statement uses WCAG as a practical technical target, not as a
          claim that one standard covers every legal duty.
        </P>
      </Clause>

      <Clause s={S.possible}>
        <P>
          These are the things the site is built to allow. Each one is a claim
          that has to survive the audit before it stays on this page.
        </P>
        <Points>
          <Point>Navigate the website using a keyboard</Point>
          <Point>See a visible focus indicator</Point>
          <Point>
            Zoom and reflow the content without losing the main information
          </Point>
          <Point>Use headings and landmarks to move around</Point>
          <Point>Understand form labels, instructions and errors</Point>
          <Point>Avoid non-essential motion</Point>
          <Point>Use text alternatives for meaningful images</Point>
          <Point>
            Use every control without relying on colour alone
          </Point>
          <Point>
            Complete the enquiry and scoping journeys with supported assistive
            technology
          </Point>
        </Points>

        <Gap>
          Keep only the statements the test confirms, and delete any it does not
          support.
        </Gap>
      </Clause>

      <Clause s={S.status}>
        <NotYet what="Not yet assessed against WCAG 2.2 Level AA.">
          <P>
            The status is the point of an accessibility statement and it is the
            one thing that cannot be written before the site is tested. Nothing
            is claimed here until an audit has happened.
          </P>
          <P>
            Partial conformance is not a safer thing to write in the meantime.
            It is still a claim, about criteria nobody has checked, on the one
            page whose whole purpose is to be a truthful account of what works.
          </P>
          <P>
            An automated tool&apos;s score is not the audit either, and must not
            be recorded here as full conformance.
          </P>
        </NotYet>

        <P>
          The parts of this website that need particular attention during
          testing are the colour selection tool, file uploads, wide tables, the
          outline that updates as you answer, and the controls for returning to
          a request you have already sent.
        </P>

        <P className="mt-8">
          WCAG 2.2 adds nine success criteria over 2.1. These are the ones that
          commonly fail on a site of this shape, and the ones to test before the
          status above is filled in.
        </P>

        <Grid
          head={["Criterion", "What it means here"]}
          rows={[
            [
              "2.4.11 Focus not obscured",
              "A sticky header hiding the element that has focus.",
            ],
            [
              "2.4.13 Focus appearance",
              "The size and contrast of the focus indicator.",
            ],
            [
              "2.5.7 Dragging movements",
              "Any slider or drag interaction needs a single-pointer alternative. The colour ordering tool is the one to check.",
            ],
            [
              "2.5.8 Target size, minimum",
              "24 by 24 CSS pixels. Footer links and small icons are the usual failures.",
            ],
            [
              "3.2.6 Consistent help",
              "Help mechanisms in the same relative order across pages.",
            ],
            [
              "3.3.7 Redundant entry",
              "Not asking for the same information twice within one process. The scoping journey already satisfies this: the send step shows the contact details back rather than asking a second time.",
            ],
            [
              "3.3.8 Accessible authentication",
              "No cognitive function test. Not applicable unless a login is added.",
            ],
          ]}
        />
      </Clause>

      <Clause s={S.limits}>
        <Gap>
          One entry per real issue the audit finds, each saying what is
          affected, why it is not yet fixed, what somebody can do instead, and
          the planned action with a date. If the audit finds nothing, this
          section says so rather than staying empty.
        </Gap>
      </Clause>

      <Clause s={S.third}>
        <P>
          Some embedded booking, payment, map, video or commerce interfaces are
          controlled by another supplier.
        </P>
        <P>
          We remain responsible for selecting and integrating services
          carefully, and for providing a reasonable alternative where
          appropriate, but we cannot directly change every part of an
          independent platform.
        </P>
        <Gap>
          The specific third-party limitations found by the audit, named. This
          paragraph is not a general exemption and must not be left to read as
          one.
        </Gap>
      </Clause>

      <Clause s={S.report}>
        <P>
          Email <Mail address="info@twincoretech.com" />.
        </P>
        <P>It helps if you can tell us:</P>
        <Points>
          <Point>The page or feature</Point>
          <Point>What you were trying to do</Point>
          <Point>What happened</Point>
          <Point>Your browser and device</Point>
          <Point>Any assistive technology you were using</Point>
          <Point>How you would prefer us to reply</Point>
        </Points>
        <P>
          We acknowledge within two working days, and provide a substantive
          response or a plan within five working days.
        </P>
        <Gap>
          A telephone number, if a route other than email is to be offered. If
          not, nothing is added rather than a number nobody answers.
        </Gap>
      </Clause>

      <Clause s={S.prepared}>
        <Gap>
          The date this statement was prepared, the date the website was last
          tested, who tested it, a summary of the methods and assistive
          technologies used, and the next review date or trigger. All five
          follow from the audit and none can be written before it.
        </Gap>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
