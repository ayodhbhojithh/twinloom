import type {
  ScopeComponent,
  ScopeSection,
  ScopeSectionId,
  ScopeSelection,
} from "./types";

/* ---------------------------------------------------------------------------
   The scope catalogue.

   Adding a service is adding a seed entry, nothing else. No component reads a
   hardcoded price or a hardcoded component id, so the full catalogue (proofing,
   starter blogs, CRM integration and the rest) drops in here with no
   structural change. See Docs/README.md, "Known follow-up".

   Prices are the figures carried in the prototype. They are held in one place
   so a confirmed rate card is a single edit.
--------------------------------------------------------------------------- */

interface OptionSeed {
  name: string;
  description: string;
  price: number;
  defaultOn?: boolean;
}

interface ComponentSeed {
  id: string;
  name: string;
  what: string;
  options: OptionSeed[];
}

interface SectionSeed {
  id: ScopeSectionId;
  name: string;
  tag: string;
  accent: string;
  components: ComponentSeed[];
}

const SEED: readonly SectionSeed[] = [
  {
    id: "structure",
    name: "Structure",
    tag: "the frame every page shares",
    accent: "#7c3aed",
    components: [
      {
        id: "header",
        name: "Header and navigation",
        what: "The top bar visitors use to move around your site.",
        options: [
          {
            name: "Logo and simple menu",
            description: "Your logo and a clear menu of your main pages.",
            price: 150,
            defaultOn: true,
          },
          {
            name: "Dropdown menus",
            description: "Grouped menus so a larger site stays tidy.",
            price: 200,
            defaultOn: true,
          },
          {
            name: "Sticky nav and mega menu",
            description:
              "Menu that follows on scroll, with a rich multi column panel.",
            price: 350,
          },
        ],
      },
      {
        id: "footer",
        name: "Footer",
        what: "Links, contact details and legal bits at the base of every page.",
        options: [
          {
            name: "Simple footer",
            description: "Contact details, key links and the legal bits.",
            price: 75,
            defaultOn: true,
          },
          {
            name: "Link columns",
            description: "A fuller footer with organised columns of links.",
            price: 150,
          },
        ],
      },
    ],
  },
  {
    id: "sections",
    name: "Hero and sections",
    tag: "your homepage story, top to bottom",
    accent: "#2563eb",
    components: [
      {
        id: "hero",
        name: "Hero section",
        what: "The first thing visitors see: your headline promise and main button.",
        options: [
          {
            name: "Headline, image and button",
            description: "A strong headline, image and main call to action.",
            price: 300,
            defaultOn: true,
          },
          {
            name: "Custom layout and tuned button",
            description: "A tailored layout with a sharpened call to action.",
            price: 400,
          },
          {
            name: "Bespoke, conversion designed",
            description: "A one off hero designed specifically to convert.",
            price: 800,
          },
        ],
      },
      {
        id: "value",
        name: "Value proposition band",
        what: "A crisp line on who you help and why you are the right choice.",
        options: [
          {
            name: "Simple statement band",
            description: "A single clear line on who you help.",
            price: 150,
          },
          {
            name: "Icons and key points",
            description: "The same, dressed up with icons or key points.",
            price: 200,
          },
        ],
      },
      {
        id: "services",
        name: "Services and offer sections",
        what: "What you offer, laid out so visitors quickly see if you fit.",
        options: [
          {
            name: "Basic list of services",
            description: "Your services listed clearly.",
            price: 300,
            defaultOn: true,
          },
          {
            name: "Detailed sections",
            description: "A richer section for each service area.",
            price: 400,
            defaultOn: true,
          },
          {
            name: "Per service treatment",
            description: "In depth, individually designed service blocks.",
            price: 700,
          },
        ],
      },
      {
        id: "testimonials",
        name: "Testimonials and social proof",
        what: "Quotes, reviews and logos that show others already trust you.",
        options: [
          {
            name: "Testimonials",
            description: "A few customer quotes.",
            price: 100,
          },
          {
            name: "Client logos and reviews",
            description: "Add recognisable logos and star reviews.",
            price: 150,
          },
          {
            name: "Case study highlights",
            description: "Short success stories with real results.",
            price: 250,
          },
        ],
      },
      {
        id: "cta",
        name: "Call to action band",
        what: "A clear prompt telling visitors exactly what to do next.",
        options: [
          {
            name: "Simple CTA band",
            description: "A prompt telling visitors what to do next.",
            price: 100,
          },
          {
            name: "Built around an offer",
            description: "The same, designed around a specific offer.",
            price: 150,
          },
        ],
      },
      {
        id: "contact",
        name: "Contact and enquiry form",
        what: "How visitors reach you, from a simple form to full lead capture.",
        options: [
          {
            name: "Basic contact form",
            description: "Name, email and message, straight to your inbox.",
            price: 100,
            defaultOn: true,
          },
          {
            name: "Enhanced fields and routing",
            description: "Extra fields, routed to the right person.",
            price: 300,
            defaultOn: true,
          },
          {
            name: "Multi step and segmented",
            description: "A guided, multi step enquiry flow.",
            price: 800,
          },
        ],
      },
    ],
  },
  {
    id: "content",
    name: "Content pages",
    tag: "the pages people browse",
    accent: "#0d9488",
    components: [
      {
        id: "about",
        name: "About page",
        what: "Your story and the people behind the business. Builds trust.",
        options: [
          {
            name: "Basic about page",
            description: "A short, credible about page.",
            price: 150,
          },
          {
            name: "Story, team and values",
            description: "Your fuller story, team and values.",
            price: 300,
          },
        ],
      },
      {
        id: "blog",
        name: "Blog and news",
        what: "Regular articles that help you get found on Google.",
        options: [
          {
            name: "Blog and article template",
            description: "A blog listing and a clean article layout.",
            price: 200,
          },
          {
            name: "Categories and search",
            description: "Add categories and search to the blog.",
            price: 300,
          },
          {
            name: "Full content hub",
            description: "A rich, organised content hub.",
            price: 500,
          },
        ],
      },
      {
        id: "faq",
        name: "FAQ page",
        what: "Answers to common questions. Reassures visitors and cuts repeat enquiries.",
        options: [
          {
            name: "Simple FAQ section",
            description: "A handful of common questions answered.",
            price: 120,
          },
          {
            name: "Full FAQ page",
            description: "A categorised, searchable FAQ page.",
            price: 280,
          },
        ],
      },
    ],
  },
  {
    id: "legal",
    name: "Legal and trust",
    tag: "the required legal bits",
    accent: "#64748b",
    components: [
      {
        id: "privacy",
        name: "Privacy policy",
        what: "Legally required in the UK once you collect any visitor details.",
        options: [
          {
            name: "Standard privacy policy",
            description: "A solid, standard UK privacy policy.",
            price: 75,
            defaultOn: true,
          },
          {
            name: "Tailored to your data use",
            description: "Written around exactly what you collect.",
            price: 150,
          },
        ],
      },
      {
        id: "cookie",
        name: "Cookie consent banner",
        what: "Required before non essential cookies run.",
        options: [
          {
            name: "Consent banner",
            description: "The banner asking permission for cookies.",
            price: 100,
            defaultOn: true,
          },
          {
            name: "Granular controls",
            description: "Let visitors choose cookie categories.",
            price: 200,
          },
        ],
      },
    ],
  },
  {
    id: "foundation",
    name: "Foundation",
    tag: "invisible essentials that make it work",
    accent: "#f97316",
    components: [
      {
        id: "seo",
        name: "SEO setup",
        what: "Titles, headings and structure so Google understands and ranks you.",
        options: [
          {
            name: "Titles and meta done properly",
            description: "Every page titled and described for Google.",
            price: 150,
            defaultOn: true,
          },
          {
            name: "On page SEO across pages",
            description: "Headings, structure and keywords across the site.",
            price: 350,
            defaultOn: true,
          },
          {
            name: "Technical SEO and schema",
            description: "Deeper technical setup and rich result markup.",
            price: 600,
          },
        ],
      },
      {
        id: "copy",
        name: "Copywriting",
        what: "Writing or polishing the words so they sell, not just inform.",
        options: [
          {
            name: "Light polish of your copy",
            description: "We tidy the words you provide.",
            price: 100,
            defaultOn: true,
          },
          {
            name: "Rewrite of key pages",
            description: "We rewrite your most important pages.",
            price: 350,
          },
          {
            name: "Full write across the site",
            description: "We write the whole site with you.",
            price: 700,
          },
        ],
      },
      {
        id: "analytics",
        name: "Analytics and tracking",
        what: "See who visits, where from, and what they do.",
        options: [
          {
            name: "GA4 and Search Console",
            description: "See visits and search performance.",
            price: 100,
            defaultOn: true,
          },
          {
            name: "Events and conversions",
            description: "Track enquiries and key actions.",
            price: 350,
            defaultOn: true,
          },
          {
            name: "Reporting dashboard",
            description: "A simple dashboard of what matters.",
            price: 600,
          },
        ],
      },
      {
        id: "hosting",
        name: "Hosting, domain and SSL",
        what: "Getting the site live, secure and on your own web address.",
        options: [
          {
            name: "Setup, domain and SSL",
            description: "Live, secure, on your own address.",
            price: 75,
            defaultOn: true,
          },
          {
            name: "Performance tuning",
            description: "Speed and performance improvements.",
            price: 300,
          },
        ],
      },
    ],
  },
] as const;

/** The catalogue, with ids and back references filled in. */
export const SCOPE_SECTIONS: readonly ScopeSection[] = SEED.map((section) => ({
  id: section.id,
  name: section.name,
  tag: section.tag,
  accent: section.accent,
  components: section.components.map<ScopeComponent>((component) => ({
    id: component.id,
    sectionId: section.id,
    name: component.name,
    what: component.what,
    options: component.options.map((option, index) => ({
      id: `${component.id}.${index}`,
      componentId: component.id,
      name: option.name,
      description: option.description,
      price: option.price,
      defaultOn: option.defaultOn ?? false,
    })),
  })),
}));

export const SCOPE_COMPONENTS: readonly ScopeComponent[] =
  SCOPE_SECTIONS.flatMap((section) => section.components);

const sectionIndex = new Map(SCOPE_SECTIONS.map((s) => [s.id, s]));
const componentIndex = new Map(SCOPE_COMPONENTS.map((c) => [c.id, c]));

export function getSection(id: string): ScopeSection | undefined {
  return sectionIndex.get(id as ScopeSectionId);
}

export function getComponent(id: string): ScopeComponent | undefined {
  return componentIndex.get(id);
}

/**
 * Section a component belongs to. Used by the mock-up, where a block only knows
 * the component id it maps to but needs the section accent to tint itself.
 */
export function getSectionForComponent(
  componentId: string,
): ScopeSection | undefined {
  const component = componentIndex.get(componentId);
  return component ? sectionIndex.get(component.sectionId) : undefined;
}

/** Pre ticked options on first load. Lands on 3,125 with the seed above. */
export const DEFAULT_SELECTION: ScopeSelection = Object.freeze(
  Object.fromEntries(
    SCOPE_COMPONENTS.flatMap((component) =>
      component.options
        .filter((option) => option.defaultOn)
        .map((option) => [option.id, true] as const),
    ),
  ),
);
