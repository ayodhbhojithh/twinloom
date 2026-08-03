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
  "k": "arrive",
  "ph": "shape",
  "n": "Arrive",
  "can": true
 },
 {
  "k": "layout",
  "ph": "shape",
  "n": "Pick a shape",
  "can": true
 },
 {
  "k": "who",
  "ph": "detail",
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
  "n": "What you are selling",
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
  "n": "What you already have",
  "can": true
 },
 {
  "k": "refs",
  "ph": "detail",
  "n": "Reference points",
  "can": true
 },
 {
  "k": "read",
  "ph": "detail",
  "n": "Read it back",
  "can": true
 },
 {
  "k": "asking",
  "ph": "send",
  "n": "Who is asking",
  "can": false
 },
 {
  "k": "keep",
  "ph": "send",
  "n": "Keep it",
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
  "The only compulsory part, and it is four fields."
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
  "layout",
  "The shape of it"
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
  "What you already have"
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
 "you": "asking"
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
 "you": "No strong view — choose for us"
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
 "layout": "We choose a layout to suit what you tell us.",
 "who": "We assume the site is for customers buying for themselves.",
 "do": "We assume the standard inclusions and nothing beyond them, and we choose what the home page leads with.",
 "sell": "We assume nothing is bought on the website.",
 "style": "We choose a direction and show it to you before we build it.",
 "have": "We assume you have a logo and nothing else ready.",
 "refs": "No reference points, so we work from the answers alone."
} as const;
