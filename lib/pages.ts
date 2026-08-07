import { ROUTES } from "./site";

/* ---------------------------------------------------------------------------
   The framework's reserved screens.

   Thirteen of v4's screens are the same shape: a tag, a title, one line about
   what the page is for, the empty marker, and a note listing what belongs there.
   They are written here as data and rendered by one component, because thirteen
   copies of the same JSX is thirteen places for it to drift.

   The notes are the useful content on these pages. They are the brief for the
   page, and keeping them visible is the point of a framework.
--------------------------------------------------------------------------- */

export interface FrameworkPage {
  href: string;
  /** The mono eyebrow, and the title. Both the framework's own wording. */
  tag: string;
  title: string;
  lead: string;
  /** Meta description. Written from the lead where v4 gives none. */
  description: string;
  /** What belongs on the screen. A single string renders as a paragraph. */
  belongs: readonly string[] | string;
}

const LEGAL_NOTE =
  "Legal wording, written once and reviewed before it goes anywhere near a live site.";

export const FRAMEWORK_PAGES: readonly FrameworkPage[] = [
  {
    href: ROUTES.about,
    tag: "About us",
    title: "About us",
    lead: "Who we are, and how we work.",
    description:
      "TwinLoom builds websites, supported by our digital and consultancy services. The same eleven inclusions on every site, whatever its size.",
    belongs: [
      "What we build, and what TwinCoreTech builds behind it.",
      "The eleven inclusions every site gets, whatever its size.",
      "The services that run alongside the build.",
      "How a project proceeds, and where the scope comes from.",
      "Specialist partners, shown as integral rather than as an extra.",
    ],
  },
  {
    href: ROUTES.services,
    tag: "Our services",
    title: "Our services",
    lead: "Everything we do, and who actually does it.",
    description:
      "Websites and the custom software behind them, plus digital consultancy, ongoing services, brand identity and campaign management.",
    belongs: [
      "What we build, and what TwinCoreTech builds behind it.",
      "The services that run alongside a build, and what each covers.",
      "Which are ours and which are led by a specialist.",
      "Who you deal with when a specialist is involved, which is us.",
    ],
  },
  {
    href: ROUTES.contact,
    tag: "Contact us",
    title: "Contact us",
    lead: "Call us, or send an enquiry.",
    description:
      "A phone number that is answered, an email address written out, and an enquiry form with as few fields as will do.",
    belongs: [
      "A phone number that is answered, with the hours it is answered.",
      "An enquiry form with as few fields as will do.",
      "An email address, written out.",
      "Where we are, if somebody wants to come.",
    ],
  },
  {
    href: ROUTES.book,
    tag: "Book a meeting",
    title: "Book a meeting",
    lead: "Pick a time that suits you.",
    description:
      "Real availability, what the meeting is for, how long it takes, and what to have ready, which should be nothing.",
    belongs: [
      "A calendar with real availability.",
      "What the meeting is for, and how long it takes.",
      "What to have ready, which should be nothing.",
      "What happens if you cannot make it.",
    ],
  },
  {
    href: ROUTES.faq,
    tag: "FAQs",
    title: "FAQs",
    lead: "The questions people actually ask.",
    description:
      "The questions asked before a brief is started, before signing, and after launch, answered plainly.",
    belongs: [
      "The questions asked before somebody starts a brief.",
      "The questions asked before somebody signs.",
      "The questions asked after launch.",
      'Where the honest answer is "it depends", say what it depends on.',
    ],
  },
  {
    href: ROUTES.blog,
    tag: "Blogs and articles",
    title: "Blogs and articles",
    lead: "What we have written.",
    description: "What we have written, newest first.",
    belongs: [
      "A list, newest first, with the date shown.",
      "One post template.",
      "A way to subscribe, if we are going to keep writing.",
      "Where the blog actually lives, which is its own decision.",
    ],
  },
  {
    href: ROUTES.privacy,
    tag: "Privacy",
    title: "Privacy",
    lead: "What we do with your information.",
    description: "What we collect, why, how long we keep it and your rights.",
    belongs: LEGAL_NOTE,
  },
  {
    href: ROUTES.cookies,
    tag: "Cookies",
    title: "Cookies",
    lead: "What we set, and what you can turn off.",
    description: "The cookies this site sets, and how to turn them off.",
    belongs: LEGAL_NOTE,
  },
  {
    href: ROUTES.terms,
    tag: "Terms of use",
    title: "Terms of use",
    lead: "The terms for using this website.",
    description: "The terms that apply to using this website.",
    belongs: LEGAL_NOTE,
  },
  {
    href: ROUTES.termsOfBusiness,
    tag: "Terms of business",
    title: "Terms of business",
    lead: "The terms for working with us.",
    description: "The terms that apply to working with us on a project.",
    belongs: LEGAL_NOTE,
  },
  {
    href: ROUTES.accessibility,
    tag: "Accessibility",
    title: "Accessibility",
    lead: "How we build, and how to tell us when it fails.",
    description:
      "The standard we build to, and how to tell us when this site falls short of it.",
    belongs: LEGAL_NOTE,
  },
  {
    href: ROUTES.complaints,
    tag: "Complaints",
    title: "Complaints",
    lead: "How to complain, and what happens next.",
    description: "How to complain, who reads it, and what happens next.",
    belongs: LEGAL_NOTE,
  },
  {
    href: ROUTES.subProcessors,
    tag: "Sub-processors",
    title: "Sub-processors",
    lead: "Who else touches your information.",
    description:
      "The other companies that process information on our behalf, and what each one does.",
    belongs: LEGAL_NOTE,
  },
];

export function frameworkPage(href: string): FrameworkPage {
  const page = FRAMEWORK_PAGES.find((entry) => entry.href === href);
  if (!page) throw new Error(`No framework page for ${href}`);
  return page;
}
