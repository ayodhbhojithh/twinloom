/* ---------------------------------------------------------------------------
   The build tool's catalogue.

   Generated from the "Build it v3" tab of
   Docs/new-ui/vgwc-website-framework-v4_2026-08-01.html, so the wording, the
   ordering and the rules about which action belongs to which visitor are the
   prototype's rather than a retyping of them.

   Icons are the prototype's own SVG paths. Keeping them is the faithful choice:
   picking twenty six lucide equivalents by eye would change the drawing without
   improving it, and these are already drawn on one 24px grid at one weight.
--------------------------------------------------------------------------- */

/** Who a visitor is. Layer one of the first question. */
export interface VisitorGroup {
  key: string;
  /** What the group is called, in the list. */
  name: string;
  /** One line about who they are. */
  sub: string;
  /** The band heading used above the things this group can do. */
  cta: string;
  /** The page label this group produces in the derived site. */
  short: string;
  /** How the group is named in a sentence. */
  attr: string;
  icon: string;
}

/**
 * Something a visitor can do.
 *
 * `need` decides when it is offered: `""` is standard and always on offer,
 * `"any"` arrives as soon as any group is named, `"talk"` is never automatic and
 * is flagged as a conversation, and anything else is a group key.
 */
export interface VisitorAction {
  key: string;
  need: string;
  name: string;
  sub: string;
  /** The page it creates, if it creates one. */
  page: string;
  icon: string;
}

export interface Band {
  name: string;
  sub: string;
}

export const GROUPS: readonly VisitorGroup[] = [
  {
    "key": "consumer",
    "name": "Customers (D2C)",
    "sub": "People buying from you for themselves.",
    "cta": "What somebody buying for themselves should be able to do.",
    "icon": "<circle cx=\"12\" cy=\"7.6\" r=\"3.2\"/><path d=\"M5.5 20.5a6.5 6.5 0 0 1 13 0\"/>",
    "short": "For customers",
    "attr": "customers"
  },
  {
    "key": "b2b",
    "name": "Business customers (B2B)",
    "sub": "Companies and organisations buying from you.",
    "cta": "What somebody buying for an organisation should be able to do.",
    "icon": "<rect x=\"3.5\" y=\"8.5\" width=\"7.5\" height=\"12\"/><rect x=\"13\" y=\"4.5\" width=\"7.5\" height=\"16\"/><path d=\"M6 12h2.5M6 15.5h2.5M15.5 8h2.5M15.5 11.5h2.5M15.5 15h2.5\"/>",
    "short": "For business buyers",
    "attr": "business buyers"
  },
  {
    "key": "investor",
    "name": "Investors, funders or a board",
    "sub": "People who put money in, or oversee it.",
    "cta": "What somebody with money or oversight should be able to do.",
    "icon": "<path d=\"M3.5 20.5h17\"/><path d=\"M6 16.5 10.5 11l3.5 3 4.5-6.5\"/><path d=\"M18.5 7.5H15M18.5 7.5V11\"/>",
    "short": "For investors",
    "attr": "investors"
  },
  {
    "key": "partner",
    "name": "Franchisees, agents or resellers",
    "sub": "People who sell your product or run your model.",
    "cta": "What somebody selling on your behalf should be able to do.",
    "icon": "<circle cx=\"6\" cy=\"9\" r=\"2.4\"/><circle cx=\"18\" cy=\"9\" r=\"2.4\"/><circle cx=\"12\" cy=\"17.5\" r=\"2.4\"/><path d=\"M7.6 10.9 10.6 15.6M16.4 10.9 13.4 15.6M8.4 9h7.2\"/>",
    "short": "For franchisees and agents",
    "attr": "franchisees and agents"
  },
  {
    "key": "staff",
    "name": "Staff, and people who want to work for you",
    "sub": "Your current team, and people looking for a job.",
    "cta": "What your team, and the people who want to join it, should be able to do.",
    "icon": "<rect x=\"4.5\" y=\"6.5\" width=\"15\" height=\"13\" rx=\"2\"/><path d=\"M9 3.5h6v3H9z\"/><circle cx=\"12\" cy=\"12\" r=\"2.2\"/><path d=\"M8.4 17.4a4 4 0 0 1 7.2 0\"/>",
    "short": "Working here",
    "attr": "staff and candidates"
  },
  {
    "key": "press",
    "name": "Press, or the wider public",
    "sub": "Journalists, researchers, the curious.",
    "cta": "What somebody writing about you should be able to do.",
    "icon": "<rect x=\"3\" y=\"5.5\" width=\"14.5\" height=\"13\" rx=\"1.5\"/><path d=\"M17.5 9.5H21v7a2 2 0 0 1-3.5 1.3\"/><path d=\"M6 9h8M6 12.5h8M6 16h5\"/>",
    "short": "Press and media",
    "attr": "press"
  },
  {
    "key": "regulator",
    "name": "Regulators, auditors or awarding bodies",
    "sub": "People checking that you meet a standard.",
    "cta": "What somebody checking you should be able to do.",
    "icon": "<path d=\"M12 3.2 20 6v6.2c0 4.4-3.2 7.5-8 8.6-4.8-1.1-8-4.2-8-8.6V6Z\"/><path d=\"m8.8 12 2.4 2.4 4-4.6\"/>",
    "short": "Governance",
    "attr": "regulators"
  }
];

export const ACTIONS: readonly VisitorAction[] = [
  {
    "key": "mail",
    "need": "",
    "name": "Email you",
    "sub": "A real address, answered by a person, for anybody who would rather write.",
    "page": "",
    "icon": "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"14\" rx=\"2\"/><path d=\"m4 6.6 8 5.7 8-5.7\"/>"
  },
  {
    "key": "enq",
    "need": "",
    "name": "Send an enquiry with details",
    "sub": "A form that asks the right questions, and the answers arrive in your email.",
    "page": "",
    "icon": "<path d=\"M6 3.5h8l4 4v13H6Z\"/><path d=\"M14 3.5v4h4\"/><path d=\"M9 12.6h6M9 16h4\"/>"
  },
  {
    "key": "call",
    "need": "",
    "name": "Call you",
    "sub": "The number impossible to miss, with a reason to dial it.",
    "page": "",
    "icon": "<path d=\"M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z\"/>"
  },
  {
    "key": "msg",
    "need": "",
    "name": "Message you",
    "sub": "WhatsApp, Messenger or similar, for people who would rather not call.",
    "page": "",
    "icon": "<path d=\"M20.5 4.5h-17v12h5v3.6l4.2-3.6h7.8Z\"/><path d=\"M8 9h8M8 12.4h5\"/>"
  },
  {
    "key": "book",
    "need": "",
    "name": "Book an appointment",
    "sub": "Pick a time with you, straight from the site.",
    "page": "Book an appointment",
    "icon": "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15.5\" rx=\"2\"/><path d=\"M3.5 10h17M8 3v4M16 3v4\"/>"
  },
  {
    "key": "buy",
    "need": "consumer",
    "name": "Buy something online",
    "sub": "Pay for products or services on the site.",
    "page": "Shop",
    "icon": "<path d=\"M5 8h14l-1.2 12.5H6.2Z\"/><path d=\"M9 10.5V7a3 3 0 0 1 6 0v3.5\"/>"
  },
  {
    "key": "quote",
    "need": "b2b",
    "name": "Request a quote or proposal",
    "sub": "They say what they need, you come back with a price.",
    "page": "Request a quote",
    "icon": "<path d=\"M6 3.5h8l4 4v13H6Z\"/><path d=\"M14 3.5v4h4\"/><circle cx=\"12\" cy=\"14.2\" r=\"2.6\"/><path d=\"M12 11.6v-1.2M12 16.8v1.2\"/>"
  },
  {
    "key": "demo",
    "need": "b2b",
    "name": "Book a demo or a meeting",
    "sub": "The business version of an appointment.",
    "page": "Book a demo",
    "icon": "<rect x=\"3\" y=\"4.5\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M8 20.5h8M12 16.5v4\"/><path d=\"m10.6 8.2 4 2.3-4 2.3Z\"/>"
  },
  {
    "key": "broch",
    "need": "b2b",
    "name": "Download your brochure",
    "sub": "The thing they forward to whoever decides.",
    "page": "Brochure",
    "icon": "<path d=\"M6 3.5h8l4 4v13H6Z\"/><path d=\"M14 3.5v4h4\"/><path d=\"M12 11v6M9.5 14.5 12 17l2.5-2.5\"/>"
  },
  {
    "key": "trade",
    "need": "b2b",
    "name": "Open a trade account",
    "sub": "For buying from you again and again.",
    "page": "Trade account",
    "icon": "<rect x=\"2.5\" y=\"5.5\" width=\"19\" height=\"13\" rx=\"2\"/><path d=\"M2.5 10h19M6 14.6h4\"/>"
  },
  {
    "key": "reports",
    "need": "investor",
    "name": "View or download reports and results",
    "sub": "Accounts, impact reports, annual reviews.",
    "page": "Reports and results",
    "icon": "<rect x=\"3.5\" y=\"3.5\" width=\"17\" height=\"17\" rx=\"2\"/><path d=\"M8 16.5v-4M12 16.5v-7M16 16.5v-2.5\"/>"
  },
  {
    "key": "updates",
    "need": "investor",
    "name": "Register for investor updates",
    "sub": "A quieter list, kept apart from the rest.",
    "page": "Investor updates",
    "icon": "<path d=\"M18 16.5H6l1.5-2.5V11a4.5 4.5 0 0 1 9 0v3Z\"/><path d=\"M10.2 19.4a2 2 0 0 0 3.6 0\"/>"
  },
  {
    "key": "named",
    "need": "investor",
    "name": "Contact the right person directly",
    "sub": "A named route, rather than the general enquiry form.",
    "page": "",
    "icon": "<circle cx=\"12\" cy=\"8.5\" r=\"3.5\"/><path d=\"M5.5 20.5a6.5 6.5 0 0 1 13 0\"/>"
  },
  {
    "key": "apply",
    "need": "partner",
    "name": "Apply to become a franchisee or reseller",
    "sub": "A structured application, not just get in touch.",
    "page": "Apply to join",
    "icon": "<path d=\"M6 3.5h8l4 4v13H6Z\"/><path d=\"M14 3.5v4h4\"/><path d=\"m9 14 2.2 2.2L15.5 12\"/>"
  },
  {
    "key": "pack",
    "need": "partner",
    "name": "Download the prospectus or partner pack",
    "sub": "What somebody reads before they apply.",
    "page": "Prospectus",
    "icon": "<path d=\"M12 7.5S10 5.5 3.5 5.5v12C10 17.5 12 19.5 12 19.5s2-2 8.5-2v-12C14 5.5 12 7.5 12 7.5Z\"/><path d=\"M12 7.5v12\"/>"
  },
  {
    "key": "interest",
    "need": "partner",
    "name": "Register interest",
    "sub": "For a model that is not open yet, or a waiting list.",
    "page": "Register interest",
    "icon": "<path d=\"M6.5 3.5h11v17l-5.5-4-5.5 4Z\"/>"
  },
  {
    "key": "jobs",
    "need": "staff",
    "name": "See vacancies and apply for a job",
    "sub": "Live roles, with a proper way to apply.",
    "page": "Vacancies",
    "icon": "<rect x=\"3\" y=\"7.5\" width=\"18\" height=\"12\" rx=\"2\"/><path d=\"M9 7.5V5.5h6v2M3 12.6h18\"/>"
  },
  {
    "key": "spec",
    "need": "staff",
    "name": "Send a speculative application",
    "sub": "No role listed, but talk to us anyway.",
    "page": "",
    "icon": "<path d=\"m20.5 3.5-17 7 6.6 2.6L13 20.5Z\"/><path d=\"m10.1 13.1 3.6-3.6\"/>"
  },
  {
    "key": "portal",
    "need": "staff",
    "name": "Sign in to a staff area",
    "sub": "A place only your team can get to.",
    "page": "Staff sign-in",
    "icon": "<rect x=\"4.5\" y=\"10.5\" width=\"15\" height=\"10\" rx=\"2\"/><path d=\"M8 10.5V8a4 4 0 0 1 8 0v2.5\"/>"
  },
  {
    "key": "kit",
    "need": "press",
    "name": "Download the press kit",
    "sub": "Logos, photographs and the facts, written once.",
    "page": "Press kit",
    "icon": "<rect x=\"3\" y=\"4.5\" width=\"18\" height=\"15\" rx=\"2\"/><circle cx=\"8.4\" cy=\"9.4\" r=\"1.6\"/><path d=\"m4 17.2 5-5 4 4 3-2.4 4 3.4\"/>"
  },
  {
    "key": "media",
    "need": "press",
    "name": "Contact you about media",
    "sub": "A named route, with how quickly you answer.",
    "page": "Media enquiries",
    "icon": "<path d=\"M4 9.5h3l8-4.5v14l-8-4.5H4Z\"/><path d=\"M18 9a3.5 3.5 0 0 1 0 6\"/>"
  },
  {
    "key": "certs",
    "need": "regulator",
    "name": "View certifications, policies and documents",
    "sub": "Findable without having to ask for them.",
    "page": "Certifications and policies",
    "icon": "<path d=\"M12 3.2 19.5 6v6c0 4.2-3 7.2-7.5 8.8C7.5 19.2 4.5 16.2 4.5 12V6Z\"/><path d=\"m9 12 2.2 2.2L15.5 10\"/>"
  },
  {
    "key": "verify",
    "need": "regulator",
    "name": "Verify a credential",
    "sub": "Check that a certificate, registration or member is genuine.",
    "page": "Check a credential",
    "icon": "<circle cx=\"11\" cy=\"11\" r=\"6.5\"/><path d=\"m15.9 15.9 4.6 4.6\"/><path d=\"m8.4 11 1.9 1.9L13.9 9.3\"/>"
  },
  {
    "key": "chat",
    "need": "talk",
    "name": "Live chat with a person",
    "sub": "A window on every page, answered by somebody on your side.",
    "page": "",
    "icon": "<path d=\"M20.5 4.5h-17v12h5v3.6l4.2-3.6h7.8Z\"/><circle cx=\"12\" cy=\"8.9\" r=\"1.9\"/><path d=\"M8.7 13.7a3.5 3.5 0 0 1 6.6 0\"/>"
  },
  {
    "key": "bot",
    "need": "talk",
    "name": "A chat assistant",
    "sub": "Answers the questions you get asked most, and hands over to a person.",
    "page": "",
    "icon": "<path d=\"M20.5 4.5h-17v12h5v3.6l4.2-3.6h7.8Z\"/><path d=\"m12 7 .9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9Z\"/>"
  },
  {
    "key": "email",
    "need": "any",
    "name": "Leave their email address",
    "sub": "In exchange for something worth having, from any kind of visitor.",
    "page": "",
    "icon": "<path d=\"M3.5 10.5h17v9.5h-17Z\"/><path d=\"m3.5 10.5 8.5 6 8.5-6\"/><path d=\"M12 2.8v5.4M9.5 5.9 12 8.4l2.5-2.5\"/>"
  }
];

export const BANDS: Record<string, Band> = {
  "inc": {
    "name": "Always included",
    "sub": "In every site we build. Nothing to decide here."
  },
  "": {
    "name": "Standard inclusions",
    "sub": "In every site we build. Three are ticked to start with, so change them to suit you."
  },
  "any": {
    "name": "Everyone",
    "sub": "One thing for a visitor who is not ready to do anything else yet."
  },
  "talk": {
    "name": "Worth a conversation",
    "sub": "Not standard, and not priced here. Tick one and we will talk it through with you before anything is agreed."
  },
  "own": {
    "name": "Anything else you need",
    "sub": "What you added yourself. We will talk each one through with you."
  }
};

export const INCLUDED: readonly Omit<VisitorAction, 'need' | 'page'>[] = [
  {
    "key": "enq",
    "name": "Send an enquiry with details",
    "sub": "A form that asks the right questions, so your first reply is useful.",
    "icon": "<path d=\"M6 3.5h8l4 4v13H6Z\"/><path d=\"M14 3.5v4h4\"/><path d=\"M9 12.6h6M9 16h4\"/>"
  },
  {
    "key": "mail",
    "name": "Email you",
    "sub": "A real address, answered by a person, for anybody who would rather write.",
    "icon": "<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"14\" rx=\"2\"/><path d=\"m4 6.6 8 5.7 8-5.7\"/>"
  }
];

/** Ticked before anybody touches anything. */
/**
 * The six things every site can do, from the prototype's "What this does" tab.
 *
 * Nothing here is tickable, because nothing here is optional. It is the floor
 * under every answer the tool collects.
 *
 * The keys are here so the screen can put a picture to each one without
 * matching on the wording or, worse, on the position in the list. Reword a line
 * or reorder the six and the right icon still follows the right thing.
 */
export const EVERY_SITE: readonly { key: string; label: string }[] = [
  { key: "who", label: "Read who you are and what you do" },
  { key: "sell", label: "See what you sell, in simple terms" },
  { key: "call", label: "Call you" },
  { key: "mail", label: "Email you" },
  { key: "form", label: "Send an enquiry through a form" },
  { key: "place", label: "Get to your nearest location" },
];

export const PRE_TICKED: readonly string[] = ["mail", "enq", "call"];

/** The pages every site has, whatever the answers. */
export const ALWAYS_PAGES: readonly string[] = ["Home", "About", "What we do", "Contact"];

/** Things in every site we build, counted on the tally. */
export const STANDARD_COUNT = 6;

/** The plus glyph for a thing the client added themselves. */
export const OWN_ICON =
  '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M12 8.4v7.2M8.4 12h7.2"/>';
