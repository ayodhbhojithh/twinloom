import type { ScopeStep } from "./types";

/* ---------------------------------------------------------------------------
   The eight sections, ported from twincoretech_site.html.

   Wording is the artifact's, with em dashes and en dashes rewritten. Notably
   absent, and deliberately so (TCT_Scope_Spec.md §2): "which pages?" and
   "roughly how big?". Both are derived from type, outcomes and services, then
   confirmed in the Blueprint.
--------------------------------------------------------------------------- */

/** Shown on an effort slider that has nothing more specific to say. */
export const EFFORT_GENERIC =
  "Light is a simpler build. Heavy is more custom work and polish.";

/** The things a client might already have, for the section 2 audit. */
export const ASSETS = [
  "Domain name",
  "Hosting",
  "Brand: logo and colours",
  "Photography",
  "Written copy",
  "An existing website",
  "Social media accounts",
] as const;

export const STEPS: readonly ScopeStep[] = [
  {
    key: "about",
    kicker: "About you and your goal",
    heading: "Let's start with the basics.",
    lead: "Pick a choice and it opens underneath, so you can read what it means and set how far to push it.",
    groups: [
      {
        question: "What are we building?",
        key: "build",
        type: "single",
        options: [
          {
            value: "new",
            label: "Brand new",
            desc: "Blank canvas.",
            band: 2,
            explain:
              "More effort means more custom pages and bespoke design, rather than starting from a template.",
          },
          {
            value: "redesign",
            label: "Redesign",
            desc: "Rework an existing site.",
            band: 2,
            explain:
              "Tell us what is driving it, then push each area as far as you like.",
          },
          {
            value: "upgrade",
            label: "Upgrade",
            desc: "Improve parts.",
            band: 1,
            explain: "Keep the base, improve the bits that matter.",
          },
        ],
      },
      {
        question: "Where's your business right now?",
        key: "stage",
        type: "single",
        options: [
          {
            value: "starting",
            label: "Just starting up",
            desc: "People need to find you.",
            band: 1,
            explain: "A clean, credible start to get you found.",
          },
          {
            value: "established",
            label: "Established",
            desc: "Look the part.",
            band: 1,
            explain: "Polish and trust for an established name.",
          },
          {
            value: "growing",
            label: "Growing rapidly",
            desc: "Keep up with growth.",
            band: 2,
            explain: "More pages, features and scale as you grow.",
          },
        ],
      },
      {
        question: "What kind of business are you in?",
        key: "industry",
        type: "single",
        options: [
          { value: "trades", label: "Trades", desc: "Construction and trades." },
          { value: "prof", label: "Professional", desc: "Services and consulting." },
          { value: "health", label: "Health", desc: "Clinics and wellbeing." },
          { value: "hosp", label: "Hospitality", desc: "Food and drink." },
          { value: "retail", label: "Retail", desc: "Shops and products." },
          { value: "creative", label: "Creative", desc: "Studios and events." },
          { value: "other", label: "Something else", desc: "Tell us more later." },
        ].map((option) => ({
          ...option,
          band: 1 as const,
          explain: "Tailors the wording and imagery to your world.",
        })),
      },
      {
        question: "If your site nailed one thing?",
        key: "goal",
        type: "single",
        options: [
          {
            value: "enquiries",
            label: "More enquiries",
            desc: "Visits into contacts.",
            band: 1,
            explain: "Everything nudged towards getting in touch.",
          },
          {
            value: "sell",
            label: "Sell online",
            desc: "Orders and payments.",
            band: 2,
            explain: "Selling adds a shop, a checkout and order handling.",
          },
          {
            value: "credible",
            label: "Look credible",
            desc: "Win trust.",
            band: 1,
            explain: "Design and proof that build confidence fast.",
          },
          {
            value: "admin",
            label: "Save admin time",
            desc: "Automate the manual.",
            band: 2,
            explain: "Automation and integrations take more setup up front.",
          },
          {
            value: "reach",
            label: "Reach new areas",
            desc: "Find new people.",
            band: 2,
            explain: "Reaching new audiences leans on SEO and content.",
          },
        ],
      },
    ],
    deepen: {
      when: { key: "build", value: "redesign" },
      drivers: {
        question: "What's driving it?",
        key: "drivers",
        options: [
          { value: "dated", label: "Looks dated", desc: "Style has aged." },
          { value: "mobile", label: "Poor on mobile", desc: "Hard on a phone." },
          { value: "slow", label: "Too slow", desc: "Loads slowly." },
          { value: "rank", label: "Not ranking", desc: "Hard to find." },
          { value: "leads", label: "Too few sales", desc: "Not converting." },
          { value: "update", label: "Hard to update", desc: "Cannot self-edit." },
        ],
      },
      dials: [
        {
          key: "look",
          label: "Look and feel",
          explain:
            "How far to push the visual redesign, from a light refresh to a whole new look.",
        },
        {
          key: "perf",
          label: "Performance and speed",
          explain: "From a basic tidy-up to chasing top Core Web Vitals.",
        },
        {
          key: "seo",
          label: "SEO visibility",
          explain: "From tidy basics to a serious visibility push.",
        },
        {
          key: "conv",
          label: "Conversion",
          explain: "From clear calls to action to tested, optimised journeys.",
        },
        {
          key: "mob",
          label: "Mobile experience",
          explain: "From responsive to mobile-first bespoke.",
        },
      ],
    },
  },

  {
    key: "assets",
    kicker: "What you've got already",
    heading: "What's in place today?",
    lead: "Every no quietly adds the right help to your brief. Nothing to tune here, just tell us what exists.",
    special: "assets",
  },

  {
    key: "does",
    kicker: "What your website needs to do",
    heading: "What should your site actually do?",
    lead: "Tell us the outcomes and we work out the pages and the size for you. Choosing an online shop unlocks the selling questions.",
    groups: [
      {
        question: "What type(s) fit best?",
        key: "type",
        type: "multi",
        options: [
          {
            value: "brochure",
            label: "Simple presence or brochure",
            desc: "A credible presence.",
            band: 1,
            explain: "A clean, credible presence. A few key pages, no complexity.",
          },
          {
            value: "lead",
            label: "Lead generation",
            desc: "Built for enquiries.",
            band: 2,
            explain: "More effort means tuned landing pages and stronger lead capture.",
          },
          {
            value: "shop",
            label: "Online shop",
            desc: "Sell products.",
            band: 3,
            explain:
              "More effort means more products, variants, payment methods and automation.",
          },
          {
            value: "booking",
            label: "Bookings",
            desc: "Book time.",
            band: 2,
            explain: "More effort means availability, staff, deposits and reminders.",
          },
          {
            value: "blog",
            label: "Blog or content",
            desc: "Publish yourself.",
            band: 1,
            explain: "A simple, self-managed blog to keep content fresh.",
          },
          {
            value: "members",
            label: "Membership",
            desc: "Login area.",
            band: 3,
            explain: "More effort means richer member features, roles and gated content.",
          },
          {
            value: "portfolio",
            label: "Portfolio or showcase",
            desc: "Showcase work.",
            band: 1,
            explain: "A gallery or case study showcase of your work.",
          },
        ],
      },
      {
        question: "What should visitors be able to do?",
        key: "visitor",
        type: "multi",
        options: [
          {
            value: "understand",
            label: "Find and understand you",
            desc: "Get what you offer.",
            band: 1,
            explain: "Clear services and messaging.",
          },
          {
            value: "enquire",
            label: "Get in touch",
            desc: "Contact you.",
            band: 1,
            explain: "An enquiry form with alerts.",
          },
          {
            value: "book",
            label: "Book an appointment",
            desc: "Pick a time.",
            band: 2,
            explain: "A booking system.",
          },
          {
            value: "buy",
            label: "Buy or pay online",
            desc: "Checkout.",
            band: 2,
            explain: "A shop and checkout.",
          },
          {
            value: "read",
            label: "Read your blog",
            desc: "Articles.",
            band: 1,
            explain: "A blog feed.",
          },
          {
            value: "login",
            label: "Log into a members area",
            desc: "Private area.",
            band: 2,
            explain: "Accounts and gated content.",
          },
        ],
      },
      {
        question: "What should you be able to do?",
        key: "owner",
        type: "multi",
        options: [
          {
            value: "edit",
            label: "Edit content myself",
            desc: "No developer needed.",
            band: 1,
            explain: "An easy CMS.",
          },
          {
            value: "stats",
            label: "See visitor stats",
            desc: "Traffic dashboard.",
            band: 1,
            explain: "Analytics.",
          },
          {
            value: "alerts",
            label: "Get enquiry alerts",
            desc: "Instant notifications.",
            band: 1,
            explain: "Enquiry notifications.",
          },
          {
            value: "manage",
            label: "Manage bookings or orders",
            desc: "Admin view.",
            band: 2,
            explain: "A bookings and orders admin.",
          },
          {
            value: "news",
            label: "Send newsletters",
            desc: "Email your list.",
            band: 1,
            explain: "Email tools.",
          },
        ],
      },
    ],
  },

  {
    key: "sell",
    kicker: "Selling online",
    heading: "The detail that sizes a shop.",
    lead: "The questions that size a shop. Only relevant if you are selling.",
    condition: { key: "type", value: "shop" },
    groups: [
      {
        question: "How many products?",
        key: "products",
        type: "single",
        options: [
          {
            value: "10",
            label: "1 to 10",
            desc: "A few lines.",
            band: 1,
            explain: "A handful of products, simple to set up.",
          },
          {
            value: "50",
            label: "10 to 50",
            desc: "Modest.",
            band: 1,
            explain: "A modest catalogue.",
          },
          {
            value: "250",
            label: "50 to 250",
            desc: "Fuller.",
            band: 2,
            explain: "A fuller catalogue takes more setup and management.",
          },
          {
            value: "250plus",
            label: "250 or more",
            desc: "Large.",
            band: 3,
            explain: "A large catalogue. Heavy setup, imports and structure.",
          },
          {
            value: "unsure",
            label: "Not sure",
            desc: "Deciding.",
            band: 1,
            explain: "We'll plan for flexibility.",
          },
        ],
      },
      {
        question: "What are you selling?",
        key: "selling",
        type: "multi",
        options: [
          {
            value: "physical",
            label: "Physical goods",
            desc: "Shipped.",
            band: 1,
            explain: "Physical items that need shipping.",
          },
          {
            value: "digital",
            label: "Digital downloads",
            desc: "Instant.",
            band: 1,
            explain: "Files delivered instantly.",
          },
          {
            value: "services",
            label: "Services",
            desc: "Bookable.",
            band: 1,
            explain: "Services sold or quoted online.",
          },
          {
            value: "subs",
            label: "Subscriptions",
            desc: "Recurring.",
            band: 2,
            explain: "Subscriptions add recurring billing and account logic.",
          },
        ],
      },
      {
        question: "Payments and delivery",
        key: "pay",
        type: "multi",
        options: [
          {
            value: "card",
            label: "Card and Apple Pay",
            desc: "Card checkout.",
            band: 1,
            explain: "Standard card checkout.",
          },
          {
            value: "paypal",
            label: "PayPal",
            desc: "PayPal option.",
            band: 1,
            explain: "PayPal as a payment option.",
          },
          {
            value: "uk",
            label: "UK shipping",
            desc: "UK only.",
            band: 1,
            explain: "Deliver within the UK.",
          },
          {
            value: "intl",
            label: "International",
            desc: "Worldwide.",
            band: 2,
            explain: "International adds tax, currency and logistics.",
          },
          {
            value: "collect",
            label: "Click and collect",
            desc: "In person.",
            band: 1,
            explain: "Collect in person.",
          },
        ],
      },
    ],
  },

  {
    key: "found",
    kicker: "Getting found and growing",
    heading: "The digital services wrap.",
    lead: "Click a service to open it and set how hard to push. Delivered with our partners, and you talk to them directly.",
    groups: [
      {
        question: "Services",
        key: "services",
        type: "multi",
        options: [
          {
            value: "seo",
            label: "SEO",
            desc: "Rank on Google.",
            band: 2,
            explain: "More effort means deeper keyword, content and technical SEO.",
          },
          {
            value: "ai",
            label: "AI visibility",
            desc: "AI answers.",
            band: 2,
            explain: "More effort means structured content tuned for AI answers.",
          },
          {
            value: "blog",
            label: "Blog",
            desc: "Run yourself.",
            band: 1,
            explain: "A blog you publish to yourself.",
          },
          {
            value: "email",
            label: "Email marketing",
            desc: "Newsletters.",
            band: 1,
            explain: "Newsletters and simple campaigns.",
          },
          {
            value: "social",
            label: "Social media",
            desc: "Setup and management.",
            band: 2,
            explain: "More effort means more channels and ongoing management.",
          },
          {
            value: "ads",
            label: "Paid ads",
            desc: "Google and Meta.",
            band: 2,
            explain: "More effort means more campaigns, budget and optimisation.",
          },
          {
            value: "local",
            label: "Local SEO",
            desc: "Business Profile.",
            band: 1,
            explain: "Get found locally on Google.",
          },
          {
            value: "report",
            label: "Reporting",
            desc: "Monthly.",
            band: 1,
            explain: "Monthly performance reporting.",
          },
        ],
      },
    ],
  },

  {
    key: "look",
    kicker: "Look and feel",
    heading: "The direction.",
    lead: "Pick a style. Colours and reference sites go in the Thoughts panel, where you can show us rather than describe it.",
    groups: [
      {
        question: "Style",
        key: "style",
        type: "multi",
        options: [
          {
            value: "min",
            label: "Clean and minimal",
            desc: "Spacious.",
            band: 1,
            explain: "Simple, with plenty of space.",
          },
          {
            value: "bold",
            label: "Bold and modern",
            desc: "Strong colour.",
            band: 1,
            explain: "Strong colour and type.",
          },
          {
            value: "warm",
            label: "Warm and friendly",
            desc: "Approachable.",
            band: 1,
            explain: "Approachable and human.",
          },
          {
            value: "classic",
            label: "Classic",
            desc: "Timeless.",
            band: 1,
            explain: "Timeless and established.",
          },
          {
            value: "premium",
            label: "Premium",
            desc: "High end.",
            band: 2,
            explain: "A premium look needs more bespoke design and polish.",
          },
          {
            value: "playful",
            label: "Playful",
            desc: "Characterful.",
            band: 1,
            explain: "Fun and characterful.",
          },
        ],
      },
      {
        question: "Tone of voice",
        key: "tone",
        type: "single",
        options: [
          {
            value: "prof",
            label: "Professional",
            desc: "Polished.",
            band: 1,
            explain: "Polished and measured.",
          },
          {
            value: "friendly",
            label: "Friendly",
            desc: "Conversational.",
            band: 1,
            explain: "Warm and conversational.",
          },
          {
            value: "straight",
            label: "Straight talking",
            desc: "Direct.",
            band: 1,
            explain: "Plain and direct.",
          },
          {
            value: "auth",
            label: "Authoritative",
            desc: "Expert.",
            band: 1,
            explain: "Expert and confident.",
          },
        ],
      },
    ],
  },

  {
    key: "time",
    kicker: "Timeline and budget",
    heading: "A couple of practicalities.",
    lead: "How soon, who does the content, who looks after it afterwards, and a soft budget you can skip.",
    groups: [
      {
        question: "How quickly do you want it live?",
        key: "speed",
        type: "single",
        options: [
          {
            value: "asap",
            label: "As soon as possible",
            desc: "Fastest route.",
            band: 3,
            explain: "A fast turnaround compresses the schedule, so it is more intensive.",
          },
          {
            value: "month",
            label: "Within a month",
            desc: "Tight.",
            band: 2,
            explain: "A one month build is tight and needs focus.",
          },
          {
            value: "13",
            label: "1 to 3 months",
            desc: "Comfortable.",
            band: 1,
            explain: "A comfortable pace.",
          },
          {
            value: "36",
            label: "3 to 6 months",
            desc: "Roomy.",
            band: 1,
            explain: "Plenty of room.",
          },
          {
            value: "norush",
            label: "No rush",
            desc: "Right over fast.",
            band: 1,
            explain: "Getting it right over getting it quickly.",
          },
        ],
      },
      {
        question: "Who provides words and images?",
        key: "content",
        type: "single",
        options: [
          {
            value: "you",
            label: "You",
            desc: "You supply it.",
            band: 1,
            explain: "You'll supply the content.",
          },
          {
            value: "us",
            label: "Us",
            desc: "We create it.",
            band: 2,
            explain:
              "Us writing and sourcing the content is more work than you supplying it.",
          },
          {
            value: "mix",
            label: "A mix",
            desc: "Shared.",
            band: 1,
            explain: "Shared between us.",
          },
        ],
      },
      {
        question: "After launch, who looks after it?",
        key: "aftercare",
        type: "single",
        options: [
          {
            value: "you",
            label: "You",
            desc: "You'll manage it.",
            band: 1,
            explain: "We hand over and you take the reins.",
          },
          {
            value: "us",
            label: "Us, on a care plan",
            desc: "We keep it running.",
            band: 1,
            explain: "Ongoing care, security and improvements.",
          },
          {
            value: "unsure",
            label: "Not sure",
            desc: "Decide later.",
            band: 1,
            explain: "We'll recommend an option.",
          },
        ],
      },
    ],
    special: "budget",
  },

  {
    key: "else",
    kicker: "Anything else",
    heading: "Last thing. Anything special?",
    lead: "In your own words. Calculators, integrations, member areas, anything unusual. The Thoughts panel saves alongside all of this.",
    special: "free",
  },
] as const;

export const STEP_COUNT = STEPS.length;
