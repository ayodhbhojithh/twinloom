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
   Cookies and similar technologies.

   The one page here that cannot be finished by writing. What it has to contain
   is an inventory of what this website actually stores on and reads from a
   device, and that comes from scanning the production site - not from a list of
   the tools a site like this usually has.

   So the table is absent rather than filled with examples. A cookie table of
   plausible entries is not a draft: it is a public statement about what this
   website does, made by somebody who did not look. Everything that is true
   without a scan - the categories, the choice, how to change it - is here.
--------------------------------------------------------------------------- */

const S = {
  choice: { id: "choice", title: "1. Your choice" },
  categories: { id: "categories", title: "2. Categories" },
  inventory: { id: "inventory", title: "3. What this website uses" },
  embedded: { id: "embedded", title: "4. Embedded and external services" },
  browser: { id: "browser", title: "5. Changing your browser settings" },
  changes: { id: "changes", title: "6. Changes" },
} satisfies Record<string, PageSection>;

export const COOKIES_SECTIONS: readonly PageSection[] = Object.values(S);

export function CookiesView() {
  return (
    <PageShell sections={COOKIES_SECTIONS}>
      <PolicyHead
        title="Cookies and similar technologies"
        updated={POLICY_UPDATED}
        scope="Covers everything that stores information on, or reads information from, your browser or device when you use this website. Not only items technically named cookies."
        note="This website sets no cookies and loads no third-party content on arrival. Where a technology is not strictly necessary and consent is required, it is not activated before you choose."
      />

      <Clause s={S.choice}>
        <P>
          This website sets no cookies. What it stores is what you type - a
          brief, a booking - kept on your own device so you can come back to it,
          and one note of the choice you make below. None of it is shared, and
          none of it follows you anywhere.
        </P>
        <P>
          The notice on your first visit offers two answers, presented with
          equal prominence: keep to what is needed, or allow the optional as
          well. There are no optional technologies in use today, so the two
          behave alike - the answer is recorded now because anything optional
          added later has to read it before it can run.
        </P>
        <P>
          You can change your answer at any time through <b>Cookie settings</b>{" "}
          in the footer, which asks the question again.
        </P>
      </Clause>

      <Clause s={S.categories}>
        <P>
          <b>Strictly necessary.</b> Used to provide a feature you have asked
          for, maintain security, remember a consent choice, or operate an
          essential part of the website. These cannot be turned off through the
          website without preventing the relevant feature from working.
        </P>
        <P>
          <b>Preferences.</b> Remember a choice that changes how the website
          behaves, where that storage is not already strictly necessary.
        </P>
        <P>
          <b>Analytics.</b> Help us understand aggregate use, the journeys that
          matter, and technical problems. These are only activated with your
          consent.
        </P>
        <P>
          <b>Marketing.</b> Used for advertising measurement, audience creation
          or cross-site tracking. These are only activated with your consent.
        </P>
      </Clause>

      <Clause s={S.inventory}>
        <NotYet what="This table has to come from a scan of the production website.">
          <P>
            It is the one section of this page that cannot be written. What
            belongs here is a row per item actually present, with its name, its
            provider, its category, what it is for, how long it lasts, and
            whether it is first or third party.
          </P>
          <P>
            The scan has to cover local storage, pixels, fingerprinting and
            SDKs, not only items technically named cookies. Two things must then
            agree with it: every provider named here has to appear on the{" "}
            <Ref href={ROUTES.subProcessors}>Sub-processors page</Ref>, and the
            analytics row has to name the same provider that page does.
          </P>
          <P>
            No example table is shown in the meantime. A plausible list of tools
            is not a draft of this page, it is a public statement about what
            this website does made by somebody who did not look.
          </P>
        </NotYet>
      </Clause>

      <Clause s={S.embedded}>
        <P>
          A booking, map, video, social or payment service may set or read
          information when it loads.
        </P>
        <P>
          We do not load optional third-party content before you have made the
          relevant choice. Where you actively ask for an external service, we
          explain what happens and link to that provider&apos;s own information.
        </P>
      </Clause>

      <Clause s={S.browser}>
        <P>
          Browsers let you remove or block stored information. Blocking strictly
          necessary storage may prevent saved drafts, consent preferences and
          other features from working.
        </P>
        <P>
          The <b>Cookie settings</b> control on this website is the primary
          route for changing optional consent here.
        </P>
      </Clause>

      <Clause s={S.changes}>
        <P>
          We update the date and the inventory above before any new storage or
          access technology goes live.
        </P>
        <Points>
          <Point>
            See also the <Ref href={ROUTES.privacy}>Privacy notice</Ref>
          </Point>
          <Point>
            And the <Ref href={ROUTES.subProcessors}>Sub-processors page</Ref>,
            which names the providers behind each item
          </Point>
        </Points>
      </Clause>

      <PolicyFoot />
    </PageShell>
  );
}
