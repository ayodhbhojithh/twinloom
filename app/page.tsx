import type { Metadata } from "next";

import { ActionLink, Actions } from "@/components/blocks/action-link";
import { GuideNote, TextLink } from "@/components/blocks/text-link";
import { Item, List, P } from "@/components/blocks/prose";
import {
  PageHeading,
  PageShell,
  Section,
  type PageSection,
} from "@/components/layout";
import { ROUTES, SITE } from "@/lib/site";

/**
 * The draft prints its SEO title and meta description on the page inside a block
 * marked "not shown on the page". They belong here instead, where a crawler will
 * actually read them.
 *
 * `absolute` because the root layout appends the company name to every title, and
 * the draft's own title already ends with it.
 */
export const metadata: Metadata = {
  title: {
    absolute:
      "Website design and development for growing businesses | Very Good Website Company",
  },
  description:
    "Websites, online shops, booking journeys and connected features, for businesses and organisations. Tell us what you need in the way that suits you.",
};

/** Declared once, and passed to both the index and the sections it points at. */
const SECTIONS: PageSection[] = [
  { id: "start-your-project", title: "Start your project" },
  { id: "before-you-start", title: "Before you start" },
];

/**
 * Home.
 *
 * Copy is the draft's, with one change throughout: its em dashes are gone. Each
 * one joined a link to its explanation, so the explanation is a sentence of its
 * own now. It reads the same and it reads aloud better.
 *
 * The four ways in are set as a list of terms: the route in the accent, then what
 * it means. That pairing is the page's whole job, and running the two together in
 * a paragraph made them one grey block with bold words in it.
 *
 * The page is four ways in and two things to read first, and nothing else. No
 * hero, no proof strip, no feature grid. That restraint is the design: someone who
 * has arrived wanting a website is offered the four doors immediately, and someone
 * who is not ready is offered the reading instead.
 */
export default function HomePage() {
  return (
    <PageShell sections={SECTIONS}>
      <PageHeading title={SITE.name} lead={SITE.tagline} />

      <P>{SITE.description}</P>

      <P>That may be:</P>

      <List>
        <Item>a clear, well-made website that explains what you offer</Item>
        <Item>an online shop</Item>
        <Item>a booking journey</Item>
        <Item>a better way to collect enquiries</Item>
        <Item>a website connected to the systems you already use</Item>
      </List>

      <P>
        <TextLink href={ROUTES.services} arrow>
          Everything we do, and what is included
        </TextLink>
      </P>

      <Section id={SECTIONS[0].id} title={SECTIONS[0].title} first>
        <P>Four ways in. Use whichever suits you.</P>

        <List>
          <Item>
            <TextLink href={ROUTES.freeflow}>Send us what you have</TextLink>:{" "}
            A brief, screenshots, photographs, links, colours or a few
            sentences. We read it before responding.
          </Item>

          <Item>
            <TextLink href={ROUTES.guided}>Use our guided journey</TextLink>: A
            more structured set of answers, with room to attach documents and
            thoughts of your own as you go.
          </Item>

          <Item>
            <TextLink href={ROUTES.contact}>Email us your request</TextLink>:
            Or call. Tell us what the business does and what you are trying to
            sort out, and we will say whether it fits.
          </Item>

          <Item>
            <TextLink href={ROUTES.book}>Book a thirty-minute meeting</TextLink>
            : A conversation about the requirement, free and with no obligation.
            We write up what we heard afterwards and send it to you.
          </Item>
        </List>

        <Actions>
          <ActionLink href={ROUTES.start} variant="primary">
            Start your project
          </ActionLink>
        </Actions>

        <div className="mt-5">
          <GuideNote>
            Nothing reaches us until you choose to send it. You can stop at any
            point and pick it up again later.
          </GuideNote>
        </div>
      </Section>

      <Section id={SECTIONS[1].id} title={SECTIONS[1].title}>
        <P>These may be of interest first.</P>

        <List className="mb-0">
          <Item>
            <TextLink href={ROUTES.how} arrow>
              How a project runs, stage by stage
            </TextLink>
          </Item>
          <Item>
            <TextLink href={ROUTES.pricing} arrow>
              How our pricing works
            </TextLink>
          </Item>
          <Item>
            <TextLink href={ROUTES.advice} arrow>
              Our advice and FAQ section
            </TextLink>
          </Item>
        </List>
      </Section>
    </PageShell>
  );
}
