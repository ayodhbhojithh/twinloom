import type { Metadata } from "next";

import { ActionLink, Actions } from "@/components/blocks/action-link";
import {
  Aside,
  GuideNote,
  Pick,
  Picks,
  QuietLink,
} from "@/components/blocks/picks";
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
 * The page is four ways in and two ways to read up first, and nothing else. No
 * hero, no proof strip, no feature grid. That restraint is the design: someone who
 * has arrived wanting a website is offered the four doors immediately, and someone
 * who is not ready is offered the reading instead.
 */
export default function HomePage() {
  return (
    <PageShell sections={SECTIONS}>
      <PageHeading title={SITE.name} lead={SITE.tagline} />

      <p className="mb-4 max-w-[720px] text-[16.5px]">{SITE.description}</p>

      <p className="mb-4 max-w-[720px] text-[16.5px]">That may be:</p>

      <Picks>
        <Pick>a clear, well-made website that explains what you offer</Pick>
        <Pick>an online shop</Pick>
        <Pick>a booking journey</Pick>
        <Pick>a better way to collect enquiries</Pick>
        <Pick>a website connected to the systems you already use</Pick>
        <Pick more>
          <QuietLink href={ROUTES.services}>
            Everything we do, and what is included
          </QuietLink>
        </Pick>
      </Picks>

      <Section id={SECTIONS[0].id} title={SECTIONS[0].title} first>
        <p className="mb-4 max-w-[720px] text-[16.5px]">
          Four ways in. Use whichever suits you.
        </p>

        <Picks>
          <Pick>
            <QuietLink href={ROUTES.freeflow}>Send us what you have</QuietLink>{" "}
            <Aside>
              A brief, screenshots, photographs, links, colours or a few
              sentences. We read it before responding.
            </Aside>
          </Pick>

          <Pick>
            <QuietLink href={ROUTES.guided}>Use our guided journey</QuietLink>{" "}
            <Aside>
              A more structured set of answers, with room to attach documents
              and thoughts of your own as you go.
            </Aside>
          </Pick>

          <Pick>
            <QuietLink href={ROUTES.contact}>Email us your request</QuietLink>{" "}
            <Aside>
              Or call. Tell us what the business does and what you are trying to
              sort out, and we will say whether it fits.
            </Aside>
          </Pick>

          <Pick>
            <QuietLink href={ROUTES.book}>
              Book a thirty-minute meeting
            </QuietLink>{" "}
            <Aside>
              A conversation about the requirement, free and with no obligation.
              We write up what we heard afterwards and send it to you.
            </Aside>
          </Pick>
        </Picks>

        <Actions>
          <ActionLink href={ROUTES.start} variant="primary">
            Start your project
          </ActionLink>
        </Actions>

        <div className="mt-[22px]">
          <GuideNote>
            Nothing reaches us until you choose to send it. You can stop at any
            point and pick it up again later.
          </GuideNote>
        </div>
      </Section>

      <Section id={SECTIONS[1].id} title={SECTIONS[1].title}>
        <p className="mb-4 max-w-[720px] text-[16.5px]">
          These may be of interest first.
        </p>

        <Picks className="mb-0">
          <Pick>
            <QuietLink href={ROUTES.how}>
              How a project runs, stage by stage
            </QuietLink>
          </Pick>
          <Pick>
            <QuietLink href={ROUTES.pricing}>How our pricing works</QuietLink>
          </Pick>
          <Pick>
            <QuietLink href={ROUTES.advice}>
              Our advice and FAQ section
            </QuietLink>
          </Pick>
        </Picks>
      </Section>
    </PageShell>
  );
}
