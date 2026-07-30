import type { Metadata } from "next";

import { ActionLink, Actions } from "@/components/blocks/action-link";
import {
  FieldRow,
  FieldRows,
  Note,
  Statement,
} from "@/components/blocks/field-row";
import { Item, List, P } from "@/components/blocks/prose";
import { TextLink } from "@/components/blocks/text-link";
import {
  PageHeading,
  PageShell,
  Section,
  type PageSection,
} from "@/components/layout";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start your website project",
  description:
    "Send an existing brief or build one with us. Both routes end with a summary you can correct, a reference on screen and an email confirmation. An account is optional.",
};

const SECTIONS: PageSection[] = [
  { id: "route-1", title: "Route 1, send us what you have" },
  { id: "route-2", title: "Route 2, build the brief with us" },
  { id: "both-routes", title: "What happens on both routes" },
  { id: "keeping-track", title: "Keeping track of it" },
  { id: "rather-talk", title: "Would you rather talk it through?" },
  { id: "already-started", title: "Already started?" },
];

/**
 * Start your project.
 *
 * The page the whole site points at. Two routes, and the thing it keeps saying is
 * that neither commits you to anything: nothing is sent until you send it, the
 * account is optional, and a person replies either way.
 *
 * The draft's copy throughout, with its em dashes rewritten. Its route headings
 * read "Route 1 - Send us what you already have"; that dash is a comma here, the
 * same treatment the rail already uses for these two.
 */
export default function StartPage() {
  return (
    <PageShell sections={SECTIONS}>
      <PageHeading
        title="Tell us about the business in the way that suits you"
        lead="There are two routes. Both end the same way: a consolidated summary you can correct, and a person who reads it."
      />

      <P>
        You can change route halfway through, and nothing reaches us until you
        choose to send it.
      </P>

      <Section id={SECTIONS[0].id} title={SECTIONS[0].title} first>
        <P>Use Freeflow to send:</P>

        <List>
          <Item>a specification;</Item>
          <Item>notes;</Item>
          <Item>screenshots;</Item>
          <Item>photographs;</Item>
          <Item>a logo;</Item>
          <Item>colours;</Item>
          <Item>websites you like or dislike;</Item>
          <Item>an existing site;</Item>
          <Item>documents;</Item>
          <Item>or a few sentences.</Item>
        </List>

        <P>There is no questionnaire on this route.</P>

        <P>
          All we need is your name, a way to contact you and at least one useful
          piece of context. We read the material and come back with the next
          sensible questions.
        </P>

        <FieldRows>
          <FieldRow label="Estimated time">
            As long as it takes to attach what you already have.
          </FieldRow>
        </FieldRows>

        <Actions>
          <ActionLink href={ROUTES.freeflow}>Open Freeflow</ActionLink>
        </Actions>
      </Section>

      <Section id={SECTIONS[1].id} title={SECTIONS[1].title}>
        <P>We ask about:</P>

        <List>
          <Item>the business;</Item>
          <Item>customers;</Item>
          <Item>services or products;</Item>
          <Item>what the website needs to change;</Item>
          <Item>important actions;</Item>
          <Item>content and evidence;</Item>
          <Item>existing systems;</Item>
          <Item>timing and constraints.</Item>
        </List>

        <P>
          We do not ask you to guess a page count or choose technical
          architecture before the requirement is understood.
        </P>

        <P>
          As you answer, you can see the emerging summary, correct assumptions
          and add anything the questions missed. Freeflow stays open as a panel
          throughout, so anything that does not fit a question still reaches us.
        </P>

        <FieldRows>
          <FieldRow label="Estimated time">
            Around 20 minutes for the full route; you can send a partial brief
            sooner.
          </FieldRow>
        </FieldRows>

        <Actions>
          <ActionLink href={ROUTES.guided}>Start the guided brief</ActionLink>
        </Actions>
      </Section>

      <Section id={SECTIONS[2].id} title={SECTIONS[2].title}>
        <P>
          The routes gather different amounts of detail. After that they behave
          identically.
        </P>

        <List>
          <Item>
            <b>You tell us.</b> In your own words on route 1, or through the
            questions on route 2.
          </Item>
          <Item>
            <b>We consolidate it and show it back to you.</b> What we understood,
            what is still open, the next steps and an indicative timeline. You
            correct it before it goes anywhere.
          </Item>
          <Item>
            <b>We confirm on screen.</b> A reference, what happens next, and the
            date by which you will hear from us.
          </Item>
          <Item>
            <b>We email you a copy.</b> The same reference, a private link to
            what was submitted, and the option to keep track of it.
          </Item>
        </List>

        <Statement>A person replies within two working days.</Statement>

        <P>
          That is a commitment about us rather than an estimate about your
          project. The indicative timeline for the work itself is set out in the
          summary, and again in any proposal.
        </P>

        <P>
          We then either suggest a conversation, ask a small number of focused
          questions, or tell you plainly that the requirement is not a good fit
          for us. No work begins and no charge is created until a proposal is
          accepted.
        </P>

        <P>
          <TextLink href={ROUTES.summary} arrow>
            What the consolidated summary contains
          </TextLink>
        </P>
      </Section>

      <Section id={SECTIONS[3].id} title={SECTIONS[3].title}>
        <P>
          You do not need an account to send us anything, and both routes work
          without one.
        </P>

        <P>
          At the point of submitting there is a tick, <b>keep track of this
          brief</b>. It is not ticked for you. Tick it and an account is created
          against the email address you have already given us; leave it and the
          submission is unaffected, and the confirmation email still carries the
          link that creates one if you change your mind.
        </P>

        <P>
          There is no password. When you want to sign in, you enter your email
          address and we send a single-use link.
        </P>

        <P>The account shows:</P>

        <List>
          <Item>
            every brief you have sent us, and where each one has got to;
          </Item>
          <Item>the consolidated summary for each one;</Item>
          <Item>
            the proposal, the written checks and the handover record as they are
            issued;
          </Item>
          <Item>a way to add something to a brief already sent.</Item>
        </List>

        <P>
          It is a record of your submissions and the documents attached to them.
          Questions and answers still happen by email or in a conversation, where
          they are easier to have.
        </P>

        <Actions>
          <ActionLink href={ROUTES.account}>What the account shows</ActionLink>
          <ActionLink href={ROUTES.signIn} variant="quiet">
            Sign in
          </ActionLink>
        </Actions>
      </Section>

      <Section id={SECTIONS[4].id} title={SECTIONS[4].title}>
        <P>
          Call, email, or book a thirty-minute introductory meeting. If talking
          suits you better than typing, we take the notes and do the writing.
        </P>

        <Note>
          <p className="mb-2 font-mono text-[11px] font-semibold tracking-[0.1em] text-label uppercase">
            The written brief still exists
          </p>
          <p>
            After the meeting we write up what we heard and send you the same
            consolidated summary that both routes produce, for you to correct.
            Every project runs from a written brief. You just did not have to
            fill in a form to get one.
          </p>
        </Note>

        <P>
          Existing Freeflow material or a partial guided brief can be attached to
          the conversation so that you do not have to repeat it.
        </P>

        <Actions>
          <ActionLink href={ROUTES.book}>Book a thirty-minute meeting</ActionLink>
          <ActionLink href={ROUTES.contact} variant="quiet">
            Contact us
          </ActionLink>
        </Actions>
      </Section>

      <Section id={SECTIONS[5].id} title={SECTIONS[5].title}>
        <P>
          Use the reference and private resume link provided when you stopped, or
          sign in if you created an account.
        </P>

        <Actions>
          <ActionLink href={ROUTES.resume}>Resume a saved brief</ActionLink>
        </Actions>
      </Section>
    </PageShell>
  );
}
