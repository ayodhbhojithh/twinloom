/* ---------------------------------------------------------------------------
   The run-through, as data.

   Transcribed from the v5.2 prototype rather than retyped, so the wording, the
   keys and the page each answer adds are the prototype's own. Every screen that
   shows a question, and every derivation that turns answers into a site, reads
   this one file: a page name changed here changes it in the question, in the
   running panel, and in the read-back at once.
--------------------------------------------------------------------------- */

/** One step of the run-through. `can` is whether it may be skipped. */
export interface Step {
  k: string;
  ph: PhaseKey;
  n: string;
  can: boolean;
}

export type PhaseKey = "shape" | "detail" | "send";

/** A kind of visitor, and the page naming them puts on the site. */
export interface Group {
  k: string;
  n: string;
  pages: readonly string[];
}

/**
 * Something a visitor can do.
 *
 * `band` is the group it belongs to, or `inc` and `std` for the ways of getting
 * in touch that every site has. `pre` is `fix` for the two that cannot be
 * unticked and `tick` for the ones that start ticked. `l2` names the card of
 * follow-up questions this one opens, where it has one.
 */
export interface Action {
  k: string;
  band: string;
  n: string;
  pages: readonly string[];
  pre: "" | "fix" | "tick";
  l2: string;
}

/** Something you sell, and the pages selling it needs. */
export interface SellKind {
  k: string;
  n: string;
  pages: readonly string[];
}

export const STEPS: readonly Step[] = [
 {
  "k": "org",
  "ph": "shape",
  "n": "Your organisation and industry",
  "can": true
 },
 {
  "k": "who",
  "ph": "shape",
  "n": "Your visitors",
  "can": true
 },
 {
  "k": "do",
  "ph": "detail",
  "n": "What your visitors can do",
  "can": true
 },
 {
  "k": "sell",
  "ph": "detail",
  "n": "Are you selling?",
  "can": true
 },
 {
  "k": "style",
  "ph": "detail",
  "n": "Styling and colour",
  "can": true
 },
 {
  "k": "have",
  "ph": "detail",
  "n": "Your branding and identity",
  "can": true
 },
 {
  "k": "refs",
  "ph": "detail",
  "n": "Reference points",
  "can": true
 },
 {
  "k": "widgets",
  "ph": "detail",
  "n": "Widgets and applications",
  "can": true
 },
 {
  "k": "systems",
  "ph": "detail",
  "n": "Connecting to back end systems",
  "can": true
 },
 {
  "k": "read",
  "ph": "send",
  "n": "The site your answers describe",
  "can": true
 },
 {
  "k": "submit",
  "ph": "send",
  "n": "Submit",
  "can": false
 }
] as const;

/** The three phases, as `[key, name, note]`. */
export const PHASES: readonly (readonly [PhaseKey, string, string])[] = [
 [
  "shape",
  "Your shape",
  "Two minutes. Nothing compulsory."
 ],
 [
  "detail",
  "Your detail",
  "As much or as little as you like."
 ],
 [
  "send",
  "Sending it",
  "Read it back, then send it."
 ]
] as const;

export const GROUPS: readonly Group[] = [
 {
  "k": "consumer",
  "n": "Customers, buying for themselves",
  "pages": [
   "For customers"
  ]
 },
 {
  "k": "b2b",
  "n": "Business customers",
  "pages": [
   "For business buyers"
  ]
 },
 {
  "k": "investor",
  "n": "Investors, funders or a board",
  "pages": [
   "For investors"
  ]
 },
 {
  "k": "partner",
  "n": "Franchisees, agents or resellers",
  "pages": [
   "For franchisees and agents"
  ]
 },
 {
  "k": "staff",
  "n": "Staff, and people who want to work for you",
  "pages": [
   "Working here"
  ]
 },
 {
  "k": "press",
  "n": "Press, or the wider public",
  "pages": [
   "Press and media"
  ]
 },
 {
  "k": "regulator",
  "n": "Regulators, auditors or awarding bodies",
  "pages": [
   "Governance"
  ]
 }
] as const;

export const ACTIONS: readonly Action[] = [
 {
  "k": "enq",
  "band": "inc",
  "n": "Send an enquiry with details",
  "pages": [
   "Contact"
  ],
  "pre": "fix",
  "l2": ""
 },
 {
  "k": "mail",
  "band": "inc",
  "n": "Email you",
  "pages": [
   "Contact"
  ],
  "pre": "fix",
  "l2": ""
 },
 {
  "k": "call",
  "band": "std",
  "n": "Call you",
  "pages": [
   "Contact"
  ],
  "pre": "tick",
  "l2": ""
 },
 {
  "k": "msg",
  "band": "std",
  "n": "Message you",
  "pages": [
   "Contact"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "book",
  "band": "std",
  "n": "Book an appointment",
  "pages": [
   "Book a time",
   "Booked, and what happens next"
  ],
  "pre": "",
  "l2": "book"
 },
 {
  "k": "loc",
  "band": "std",
  "n": "Get to your nearest location",
  "pages": [
   "Where to find you"
  ],
  "pre": "tick",
  "l2": "loc"
 },
 {
  "k": "mine",
  "band": "consumer",
  "n": "Sign in and see their own things",
  "pages": [
   "Sign in",
   "Your account",
   "Your documents"
  ],
  "pre": "",
  "l2": "signin"
 },
 {
  "k": "buy",
  "band": "consumer",
  "n": "Buy something online",
  "pages": [
   "Shop",
   "A product",
   "Basket and checkout"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "quote",
  "band": "b2b",
  "n": "Request a quote or proposal",
  "pages": [
   "Request a quote"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "demo",
  "band": "b2b",
  "n": "Book a demo or a meeting",
  "pages": [
   "Book a demo"
  ],
  "pre": "",
  "l2": "book"
 },
 {
  "k": "broch",
  "band": "b2b",
  "n": "Download your brochure",
  "pages": [
   "Brochure"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "trade",
  "band": "b2b",
  "n": "Open a trade account",
  "pages": [
   "Trade account"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "reports",
  "band": "investor",
  "n": "View or download reports and results",
  "pages": [
   "Reports and results"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "updates",
  "band": "investor",
  "n": "Register for investor updates",
  "pages": [
   "Investor updates"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "named",
  "band": "investor",
  "n": "Contact the right person directly",
  "pages": [],
  "pre": "",
  "l2": ""
 },
 {
  "k": "apply",
  "band": "partner",
  "n": "Apply to become a franchisee or reseller",
  "pages": [
   "Apply to join"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "pack",
  "band": "partner",
  "n": "Download the prospectus or partner pack",
  "pages": [
   "Prospectus"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "interest",
  "band": "partner",
  "n": "Register interest",
  "pages": [
   "Register interest"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "jobs",
  "band": "staff",
  "n": "See vacancies and apply for a job",
  "pages": [
   "Vacancies",
   "A job"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "spec",
  "band": "staff",
  "n": "Send a speculative application",
  "pages": [],
  "pre": "",
  "l2": ""
 },
 {
  "k": "portal",
  "band": "staff",
  "n": "Sign in to a staff area",
  "pages": [
   "Sign in",
   "Your account"
  ],
  "pre": "",
  "l2": "signin"
 },
 {
  "k": "kit",
  "band": "press",
  "n": "Download the press kit",
  "pages": [
   "Press kit"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "media",
  "band": "press",
  "n": "Contact you about media",
  "pages": [
   "Media enquiries"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "certs",
  "band": "regulator",
  "n": "View certifications, policies and documents",
  "pages": [
   "Certifications and policies"
  ],
  "pre": "",
  "l2": ""
 },
 {
  "k": "verify",
  "band": "regulator",
  "n": "Verify a credential",
  "pages": [
   "Check a credential"
  ],
  "pre": "",
  "l2": "verify"
 },
 {
  "k": "email",
  "band": "any",
  "n": "Leave their email address",
  "pages": [],
  "pre": "",
  "l2": ""
 },
 {
  "k": "chat",
  "band": "talk",
  "n": "Live chat with a person",
  "pages": [],
  "pre": "",
  "l2": ""
 },
 {
  "k": "bot",
  "band": "talk",
  "n": "A chat assistant",
  "pages": [],
  "pre": "",
  "l2": ""
 }
] as const;

export const SELL_KINDS: readonly SellKind[] = [
 {
  "k": "goods",
  "n": "Physical goods, posted or delivered",
  "pages": [
   "Shop",
   "A product",
   "Basket and checkout"
  ]
 },
 {
  "k": "digital",
  "n": "Digital downloads",
  "pages": [
   "Downloads",
   "A document"
  ]
 },
 {
  "k": "software",
  "n": "Software, or a product people subscribe to",
  "pages": [
   "Pricing and plans"
  ]
 },
 {
  "k": "service",
  "n": "Services at a fixed price, paid online",
  "pages": [
   "Pay online"
  ]
 },
 {
  "k": "time",
  "n": "Bookings",
  "pages": [
   "Book a time",
   "Booked, and what happens next"
  ]
 },
 {
  "k": "project",
  "n": "Projects and bespoke work, quoted first",
  "pages": [
   "Request a quote"
  ]
 },
 {
  "k": "member",
  "n": "Memberships",
  "pages": [
   "Membership",
   "Sign in",
   "Your account"
  ]
 },
 {
  "k": "support",
  "n": "Donations, and support",
  "pages": [
   "Donate"
  ]
 }
] as const;

/** Ways to pay, asked once something is being sold. */
export const PAY_WAYS: readonly SellKind[] = [
 {
  "k": "paypal",
  "n": "PayPal as well",
  "pages": []
 },
 {
  "k": "instal",
  "n": "Instalments",
  "pages": []
 },
 {
  "k": "repeat",
  "n": "Repeat payments",
  "pages": []
 },
 {
  "k": "dd",
  "n": "Direct debit for recurring",
  "pages": []
 },
 {
  "k": "acct",
  "n": "Some customers pay on account",
  "pages": [
   "Trade account"
  ]
 }
] as const;

/** The read-back, in order: `[step key, heading]`. */
export const REPORT: readonly (readonly [string, string])[] = [
 [
  "org",
  "Your organisation"
 ],
 [
  "who",
  "Who the site is for"
 ],
 [
  "do",
  "What people can do"
 ],
 [
  "sell",
  "What you sell"
 ],
 [
  "style",
  "How it should feel"
 ],
 [
  "have",
  "Your branding and identity"
 ],
 [
  "widgets",
  "Widgets and applications"
 ],
 [
  "systems",
  "Back end systems"
 ]
] as const;

/** The pages every site has, whatever the answers say. */
export const ALWAYS_PAGES: readonly string[] = [
 "Home",
 "About",
 "What we do",
 "Contact"
] as const;

/** How the derived site is grouped: `[key, title, note]`. */
export const ZONES: readonly (readonly [string, string, string])[] = [
 [
  "always",
  "Always there",
  "In every site we build."
 ],
 [
  "who",
  "Who it is for",
  "You named more than one group, so each gets a way in."
 ],
 [
  "do",
  "What they can do",
  "Each thing you picked needs somewhere to happen."
 ],
 [
  "sell",
  "What you sell",
  "A page for each thing you sell. Anything already on the list above keeps its first home rather than turning up twice."
 ]
] as const;

/** How complete the answer is, as `[name, what it means]`. */
export const STATES: Record<"ready" | "near" | "thin", readonly [string, string]> = {
 "ready": [
  "Ready to send",
  "This is enough for us to come back to you properly."
 ],
 "near": [
  "Nearly there",
  "One or two things and we can take this away. Each one is a link straight to the question."
 ],
 "thin": [
  "Not enough yet",
  "You can still send it. It simply becomes a conversation rather than a scope."
 ]
} as const;

/** What each missing thing links back to. */
export const MIN_MAP: Record<string, string> = {
 "who": "who",
 "do": "do",
 "sell": "sell",
 "you": "submit"
} as const;

/** The only fields anybody has to fill in. */
export const REQUIRED: readonly string[] = [
 "name",
 "company",
 "email",
 "part"
] as const;

export const LAYOUTS: Record<string, string> = {
 "classic": "Classic business",
 "product": "Product led",
 "store": "Storefront",
 "local": "Locations",
 "editorial": "Editorial",
 "onepage": "One long page"
} as const;

export const FEELS: Record<string, string> = {
 "min": "Minimal and plain",
 "warm": "Warm and friendly",
 "bold": "Bold and confident",
 "classic": "Classic and formal",
 "edit": "Editorial, words first",
 "play": "Bright and playful",
 "tech": "Quiet and technical"
} as const;

export const COLOUR_ANSWERS: Record<string, string> = {
 "have": "Use the colours we already have",
 "tidy": "We have colours, but they need tidying",
 "start": "Start from these",
 "you": "No strong view - choose for us"
} as const;

/** The things somebody might already have. */
export const HAVE_ROWS: Record<string, string> = {
 "domain": "A domain name",
 "email": "A business email address",
 "logo": "A logo",
 "vi": "A written visual identity",
 "photos": "Photographs of your own",
 "prodpics": "Pictures of the things you sell",
 "video": "Video",
 "copy": "Words already written",
 "writer": "Somebody who will keep writing after launch",
 "site": "A website that exists today",
 "landing": "A landing page you have already paid for",
 "social": "Social accounts",
 "ads": "Advertising or campaign measurement"
} as const;

/** The three answers each of them takes. */
export const HAVE_ANSWERS: Record<string, string> = {
 "have": "We have it",
 "tidy": "We have something, it needs tidying",
 "help": "We would like help"
} as const;

/** Kinds of thing somebody can put on the desk. */
export const REF_KINDS: Record<string, string> = {
 "note": "Note",
 "file": "Document",
 "image": "Image",
 "shot": "Screenshot",
 "site": "Website"
} as const;

/**
 * What a skipped step becomes.
 *
 * Not a hole and not a percentage: a sentence written in the reader's own
 * terms, so a run-through with half of it walked past still describes a
 * website rather than listing what is missing.
 */
export const ASSUMPTIONS: Record<string, string> = {
 "org": "We take it from the rest of your answers, and ask on the call.",
 "who": "We assume the site is for customers buying for themselves.",
 "do": "We assume the standard inclusions and nothing beyond them, and we choose what the home page leads with.",
 "sell": "We assume nothing is bought on the website.",
 "style": "We choose a direction and show it to you before we build it.",
 "have": "We assume you have a logo and nothing else ready.",
 "refs": "No reference points, so we work from the answers alone.",
 "widgets": "We assume nothing beyond the standard inclusions sits inside a page.",
 "systems": "We assume the website stands on its own and joins to nothing."
} as const;

/* ---------------------------------------------------------------------------
   v5.4: the organisation, what sits inside a page, and what the site joins to.

   Three steps the earlier draft did not have. They are transcribed from the
   prototype exactly as the rest of this file is, for the same reason: the
   wording a visitor reads and the wording we scope from have to be one string.
--------------------------------------------------------------------------- */

/** What kind of organisation this is. The first fork; the rest follows it. */
export const ORG_KINDS: Record<string, string> = {
 "sole": "Sole trader or freelancer",
 "small": "Small business",
 "group": "Larger company, or a group",
 "charity": "Charity or not for profit",
 "public": "Public sector or education",
 "member": "Membership body or club",
 "pre": "Not trading yet"
} as const;

/**
 * The industries, by key.
 *
 * Fifty-five of them, and the list is deliberately specific: "Bakery and cakes"
 * rather than "Food", because the second tells us nothing we did not already
 * know and the first tells us the stock is perishable before anybody asks.
 */
export const SECTORS: Record<string, string> = {
 "womenswearm": "Womenswear / menswear / childrenswear",
 "footwear": "Footwear",
 "jewelleryan": "Jewellery and accessories",
 "bagsandleat": "Bags and leather goods",
 "vintageandp": "Vintage and preloved",
 "sportswear": "Sportswear",
 "bridalandoc": "Bridal and occasion",
 "bakeryandca": "Bakery and cakes",
 "coffeeandte": "Coffee and tea",
 "alcohol": "Alcohol",
 "preservesco": "Preserves, condiments and confectionery",
 "mealkitsand": "Meal kits and prepared food",
 "supplements": "Supplements and health foods",
 "farmproduce": "Farm produce and boxes",
 "furniture": "Furniture",
 "homewareand": "Homeware and decor",
 "kitchenware": "Kitchenware / bedding and textiles",
 "gardenandou": "Garden and outdoor",
 "candlesandh": "Candles and home fragrance",
 "skincareand": "Skincare and cosmetics",
 "salonsbarbe": "Salons, barbers and spas",
 "wellnessand": "Wellness and therapies",
 "originalart": "Original art",
 "printsanded": "Prints and editions",
 "ceramicsand": "Ceramics and glass",
 "handmadeand": "Handmade and artisan",
 "personalise": "Personalised gifts",
 "craftsuppli": "Craft supplies and stationery",
 "gymsandstud": "Gyms and studios",
 "yogapilates": "Yoga, pilates and classes",
 "personaltra": "Personal training and coaching",
 "sportsequip": "Sports equipment",
 "onlinecours": "Online courses",
 "tutoringand": "Tutoring and lessons",
 "workshopsan": "Workshops and in-person classes",
 "professiona": "Professional training",
 "accountingl": "Accounting, legal and consulting",
 "agenciesmar": "Agencies - marketing, design, digital",
 "buildingele": "Building, electrical, plumbing",
 "cleaninggar": "Cleaning, gardening and regular services",
 "restaurants": "Restaurants, cafes and bars",
 "venueandequ": "Venue and equipment hire",
 "cateringand": "Catering and events",
 "holidaylets": "Holiday lets and stays",
 "appsandsoft": "Apps and software",
 "photography": "Photography and video services",
 "musicaudioa": "Music, audio and publishing",
 "registeredc": "Registered charities",
 "clubsandsoc": "Clubs and societies",
 "faithandcom": "Faith and community groups",
 "schoolsptas": "Schools, PTAs and friends-of",
 "petfoodands": "Pet food and supplies",
 "groomingtra": "Grooming, training and care",
 "partsandacc": "Parts and accessories",
 "servicingan": "Servicing and repairs"
} as const;

/** What an industry implies: the family it sits in, what it sells, and what that brings with it. */
export interface SectorTag {
  /** The industry's own name, so a tag can be read without the key. */
  n: string;
  /** The family it belongs to, for grouping the picker. */
  g: string;
  /** What it sells, in the vocabulary of `TYPE_NAMES`. */
  t: readonly string[];
  /** What comes with it. Written as facts about the trade, not as features. */
  p: readonly string[];
}

export const SECTOR_TAGS: Record<string, SectorTag> = {
 "womenswearm": {
  "n": "Womenswear / menswear / childrenswear",
  "g": "Fashion and apparel",
  "t": [
   "GOODS"
  ],
  "p": [
   "Sizes and options",
   "Returns",
   "Seasonal, probably"
  ]
 },
 "footwear": {
  "n": "Footwear",
  "g": "Fashion and apparel",
  "t": [
   "GOODS"
  ],
  "p": [
   "Sizes",
   "Returns"
  ]
 },
 "jewelleryan": {
  "n": "Jewellery and accessories",
  "g": "Fashion and apparel",
  "t": [
   "GOODS"
  ],
  "p": [
   "Gifting, probably",
   "Fragile post"
  ]
 },
 "bagsandleat": {
  "n": "Bags and leather goods",
  "g": "Fashion and apparel",
  "t": [
   "GOODS"
  ],
  "p": [
   "Gifting, probably"
  ]
 },
 "vintageandp": {
  "n": "Vintage and preloved",
  "g": "Fashion and apparel",
  "t": [
   "GOODS"
  ],
  "p": [
   "Condition: one-of-a-kind - singleton stock"
  ]
 },
 "sportswear": {
  "n": "Sportswear",
  "g": "Fashion and apparel",
  "t": [
   "GOODS"
  ],
  "p": [
   "Sizes"
  ]
 },
 "bridalandoc": {
  "n": "Bridal and occasion",
  "g": "Fashion and apparel",
  "t": [
   "GOODS",
   "TIME"
  ],
  "p": [
   "Made to order, probably",
   "Appointments, probably"
  ]
 },
 "bakeryandca": {
  "n": "Bakery and cakes",
  "g": "Food and drink",
  "t": [
   "GOODS",
   "TIME"
  ],
  "p": [
   "Perishable",
   "Local delivery/collection, probably",
   "Made to order, probably"
  ]
 },
 "coffeeandte": {
  "n": "Coffee and tea",
  "g": "Food and drink",
  "t": [
   "GOODS"
  ],
  "p": [
   "Subscriptions, probably"
  ]
 },
 "alcohol": {
  "n": "Alcohol",
  "g": "Food and drink",
  "t": [
   "GOODS"
  ],
  "p": [
   "Regulated - provider check first",
   "Age verification"
  ]
 },
 "preservesco": {
  "n": "Preserves, condiments and confectionery",
  "g": "Food and drink",
  "t": [
   "GOODS"
  ],
  "p": [
   "Allergen labelling",
   "Gifting, probably"
  ]
 },
 "mealkitsand": {
  "n": "Meal kits and prepared food",
  "g": "Food and drink",
  "t": [
   "GOODS"
  ],
  "p": [
   "Perishable - cold chain",
   "Subscriptions, probably"
  ]
 },
 "supplements": {
  "n": "Supplements and health foods",
  "g": "Food and drink",
  "t": [
   "GOODS"
  ],
  "p": [
   "Regulated",
   "Labelling"
  ]
 },
 "farmproduce": {
  "n": "Farm produce and boxes",
  "g": "Food and drink",
  "t": [
   "GOODS"
  ],
  "p": [
   "Perishable",
   "Local rounds, probably",
   "Subscriptions, probably"
  ]
 },
 "furniture": {
  "n": "Furniture",
  "g": "Home and living",
  "t": [
   "GOODS"
  ],
  "p": [
   "Oversized - freight, two-person delivery"
  ]
 },
 "homewareand": {
  "n": "Homeware and decor",
  "g": "Home and living",
  "t": [
   "GOODS"
  ],
  "p": [
   "Fragile, probably",
   "Gifting, probably"
  ]
 },
 "kitchenware": {
  "n": "Kitchenware / bedding and textiles",
  "g": "Home and living",
  "t": [
   "GOODS"
  ],
  "p": []
 },
 "gardenandou": {
  "n": "Garden and outdoor",
  "g": "Home and living",
  "t": [
   "GOODS"
  ],
  "p": [
   "Oversized, probably",
   "Seasonal"
  ]
 },
 "candlesandh": {
  "n": "Candles and home fragrance",
  "g": "Home and living",
  "t": [
   "GOODS"
  ],
  "p": [
   "Gifting",
   "Postal restrictions, probably"
  ]
 },
 "skincareand": {
  "n": "Skincare and cosmetics",
  "g": "Health and beauty",
  "t": [
   "GOODS"
  ],
  "p": [
   "Labelling compliance",
   "Returns hygiene rules"
  ]
 },
 "salonsbarbe": {
  "n": "Salons, barbers and spas",
  "g": "Health and beauty",
  "t": [
   "TIME"
  ],
  "p": [
   "Appointments",
   "Deposits, probably"
  ]
 },
 "wellnessand": {
  "n": "Wellness and therapies",
  "g": "Health and beauty",
  "t": [
   "TIME",
   "SERVICE"
  ],
  "p": [
   "Insurance - we will check",
   "Appointments"
  ]
 },
 "originalart": {
  "n": "Original art",
  "g": "Arts, crafts and gifts",
  "t": [
   "GOODS"
  ],
  "p": [
   "One-of-a-kind",
   "Fragile"
  ]
 },
 "printsanded": {
  "n": "Prints and editions",
  "g": "Arts, crafts and gifts",
  "t": [
   "GOODS",
   "DIGITAL"
  ],
  "p": [
   "Editions/limits, probably"
  ]
 },
 "ceramicsand": {
  "n": "Ceramics and glass",
  "g": "Arts, crafts and gifts",
  "t": [
   "GOODS"
  ],
  "p": [
   "Fragile",
   "One-of-a-kind, probably"
  ]
 },
 "handmadeand": {
  "n": "Handmade and artisan",
  "g": "Arts, crafts and gifts",
  "t": [
   "GOODS"
  ],
  "p": [
   "Made to order, probably",
   "Consignment: ask"
  ]
 },
 "personalise": {
  "n": "Personalised gifts",
  "g": "Arts, crafts and gifts",
  "t": [
   "GOODS"
  ],
  "p": [
   "Made to order - personalisation question opens"
  ]
 },
 "craftsuppli": {
  "n": "Craft supplies and stationery",
  "g": "Arts, crafts and gifts",
  "t": [
   "GOODS"
  ],
  "p": [
   "By weight/length, probably"
  ]
 },
 "gymsandstud": {
  "n": "Gyms and studios",
  "g": "Sport and fitness",
  "t": [
   "MEMBERSHIP",
   "TIME"
  ],
  "p": [
   "Memberships",
   "Timetable",
   "Children: safeguarding check"
  ]
 },
 "yogapilates": {
  "n": "Yoga, pilates and classes",
  "g": "Sport and fitness",
  "t": [
   "TIME",
   "MEMBERSHIP"
  ],
  "p": [
   "Class passes, probably",
   "Insurance - we will check"
  ]
 },
 "personaltra": {
  "n": "Personal training and coaching",
  "g": "Sport and fitness",
  "t": [
   "TIME",
   "SERVICE"
  ],
  "p": [
   "Blocks of sessions, probably"
  ]
 },
 "sportsequip": {
  "n": "Sports equipment",
  "g": "Sport and fitness",
  "t": [
   "GOODS"
  ],
  "p": [
   "Oversized, probably"
  ]
 },
 "onlinecours": {
  "n": "Online courses",
  "g": "Education",
  "t": [
   "DIGITAL",
   "MEMBERSHIP"
  ],
  "p": [
   "Entitlements",
   "Foreign VAT: early"
  ]
 },
 "tutoringand": {
  "n": "Tutoring and lessons",
  "g": "Education",
  "t": [
   "TIME"
  ],
  "p": [
   "Children: safeguarding check",
   "Recurring slots, probably"
  ]
 },
 "workshopsan": {
  "n": "Workshops and in-person classes",
  "g": "Education",
  "t": [
   "TIME"
  ],
  "p": [
   "Venue capacity",
   "Children - we will check"
  ]
 },
 "professiona": {
  "n": "Professional training",
  "g": "Education",
  "t": [
   "TIME",
   "DIGITAL",
   "SERVICE"
  ],
  "p": [
   "Invoicing employers - on account, probably"
  ]
 },
 "accountingl": {
  "n": "Accounting, legal and consulting",
  "g": "Professional services",
  "t": [
   "PROJECT",
   "SERVICE"
  ],
  "p": [
   "Quotes then invoices"
  ]
 },
 "agenciesmar": {
  "n": "Agencies - marketing, design, digital",
  "g": "Professional services",
  "t": [
   "PROJECT"
  ],
  "p": [
   "Portfolio",
   "Quotes"
  ]
 },
 "buildingele": {
  "n": "Building, electrical, plumbing",
  "g": "Trades and home services",
  "t": [
   "PROJECT"
  ],
  "p": [
   "Quote form",
   "Local area",
   "Reviews: valuable"
  ]
 },
 "cleaninggar": {
  "n": "Cleaning, gardening and regular services",
  "g": "Trades and home services",
  "t": [
   "SERVICE",
   "TIME"
  ],
  "p": [
   "Recurring visits - direct debit, probably"
  ]
 },
 "restaurants": {
  "n": "Restaurants, cafes and bars",
  "g": "Hospitality and venues",
  "t": [
   "TIME"
  ],
  "p": [
   "Table bookings",
   "Deposits for groups, probably"
  ]
 },
 "venueandequ": {
  "n": "Venue and equipment hire",
  "g": "Hospitality and venues",
  "t": [
   "TIME",
   "PROJECT"
  ],
  "p": [
   "Availability calendar",
   "Damage deposits"
  ]
 },
 "cateringand": {
  "n": "Catering and events",
  "g": "Hospitality and venues",
  "t": [
   "PROJECT"
  ],
  "p": [
   "Quotes",
   "Deposits"
  ]
 },
 "holidaylets": {
  "n": "Holiday lets and stays",
  "g": "Hospitality and venues",
  "t": [
   "TIME"
  ],
  "p": [
   "Booking calendar",
   "Usually a platform conversation"
  ]
 },
 "appsandsoft": {
  "n": "Apps and software",
  "g": "Digital and media",
  "t": [
   "SOFTWARE"
  ],
  "p": [
   "Own billing or merchant of record"
  ]
 },
 "photography": {
  "n": "Photography and video services",
  "g": "Digital and media",
  "t": [
   "SERVICE",
   "PROJECT",
   "DIGITAL"
  ],
  "p": [
   "Galleries and digital delivery, probably"
  ]
 },
 "musicaudioa": {
  "n": "Music, audio and publishing",
  "g": "Digital and media",
  "t": [
   "DIGITAL",
   "GOODS"
  ],
  "p": [
   "Licensing"
  ]
 },
 "registeredc": {
  "n": "Registered charities",
  "g": "Charity and community",
  "t": [
   "SUPPORT"
  ],
  "p": [
   "Gift Aid - declaration capture"
  ]
 },
 "clubsandsoc": {
  "n": "Clubs and societies",
  "g": "Charity and community",
  "t": [
   "MEMBERSHIP",
   "SUPPORT"
  ],
  "p": [
   "Member register",
   "Renewals"
  ]
 },
 "faithandcom": {
  "n": "Faith and community groups",
  "g": "Charity and community",
  "t": [
   "SUPPORT",
   "TIME"
  ],
  "p": [
   "Giving + events, probably"
  ]
 },
 "schoolsptas": {
  "n": "Schools, PTAs and friends-of",
  "g": "Charity and community",
  "t": [
   "SUPPORT",
   "MEMBERSHIP"
  ],
  "p": [
   "Gift Aid - we will check",
   "Events tickets, probably"
  ]
 },
 "petfoodands": {
  "n": "Pet food and supplies",
  "g": "Pets and animals",
  "t": [
   "GOODS"
  ],
  "p": [
   "Subscriptions, probably",
   "Weight-based, probably"
  ]
 },
 "groomingtra": {
  "n": "Grooming, training and care",
  "g": "Pets and animals",
  "t": [
   "TIME"
  ],
  "p": [
   "Appointments"
  ]
 },
 "partsandacc": {
  "n": "Parts and accessories",
  "g": "Automotive",
  "t": [
   "GOODS"
  ],
  "p": [
   "Fitment data - which vehicle does it fit"
  ]
 },
 "servicingan": {
  "n": "Servicing and repairs",
  "g": "Automotive",
  "t": [
   "TIME",
   "PROJECT"
  ],
  "p": [
   "Bookings + quotes"
  ]
 }
} as const;

/** How many industries there are, for the picker to say so without counting. */
export const SECTOR_COUNT = 55;

/** The kinds of thing a sector sells, named for a reader rather than in code. */
export const TYPE_NAMES: Record<string, string> = {
 "GOODS": "Physical goods",
 "DIGITAL": "Downloads and digital goods",
 "MEMBERSHIP": "Memberships",
 "SUPPORT": "Donations and giving",
 "SERVICE": "Fixed-price services",
 "PROJECT": "Quoted projects",
 "TIME": "Bookings and appointments",
 "SOFTWARE": "Software products"
} as const;

/** What a back end system would be running, if there is one. */
export const SYS_TYPES: Record<string, string> = {
 "goods": "Physical goods, a full shop",
 "digital": "Tracked downloads",
 "member": "Memberships, gyms, clubs",
 "support": "Donations and friends-of schemes",
 "service": "Fixed-price services",
 "project": "Quoted projects",
 "time": "Bookings and appointments",
 "software": "Software products"
} as const;

/** Whether there is one already, and in what state. */
export const SYS_WHO: Record<string, string> = {
 "have": "We already run something",
 "ready": "Something ready-made, off the shelf",
 "none": "Nothing yet",
 "unsure": "Not sure"
} as const;

/** The things a website is asked to join to. */
export const SYS_LINKS: Record<string, string> = {
 "epos": "Till, or point of sale",
 "paycard": "Card payments",
 "accts": "Accounting or bookkeeping",
 "stock": "Stock or inventory",
 "crm": "Customer list, or CRM",
 "mailer": "Email marketing",
 "memsys": "Memberships or subscriptions",
 "giving": "Donations and Gift Aid",
 "diary": "Booking diary or calendar",
 "rota": "Rotas, staff or payroll",
 "deliv": "Delivery, couriers or collection",
 "venue": "Tables, rooms or venue",
 "jobs": "Jobs, tickets or cases",
 "quotes": "Quotes and proposals",
 "files": "Document or file store",
 "learn": "Courses or learning platform",
 "feeds": "Listing or portal feeds",
 "bespoke": "Something built for you already"
} as const;

/* ---------------------------------------------------------------------------
   Who is asking, and when they are asked.

   Three lists rather than one form. The two on `ASK_SEND` are what it takes to
   reply at all; `ASK_DOOR` is what the scoping document is addressed to; and
   `ASK_LATER` is worth knowing and worth nobody's time before they have decided
   to send anything.
--------------------------------------------------------------------------- */

/** The least it takes to answer somebody. */
export const ASK_SEND: readonly string[] = ["name","email"];

/** What the document is made out to. */
export const ASK_DOOR: readonly string[] = ["name","company","email","phone"];

/** Asked once the rest is done, and never before. */
export const ASK_LATER: readonly string[] = ["part","when"];

/** What each field is called on the screen. */
export const ASK_LABELS: Record<string, string> = {
 "name": "Your name",
 "company": "Company",
 "email": "Email",
 "phone": "Phone",
 "part": "What part do you play in this decision",
 "when": "When do you need it live"
} as const;
