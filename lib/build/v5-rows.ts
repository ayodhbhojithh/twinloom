/* ---------------------------------------------------------------------------
   The rows, drawn.

   What the tables in "what your visitors can do" and "what you are selling"
   show beside each answer: the picture, the name, and the line under it saying
   what ticking it actually gets you. The keys are the same as in `v5.ts`, so
   this file adds to that one rather than repeating it.

   The pictures are the prototype's own, kept as the shapes they are drawn from
   rather than as files. Every one is a 24 by 24 outline in `currentColor`, so a
   row that goes dark takes its picture with it.
--------------------------------------------------------------------------- */

/** One shape of an outline picture. */
export interface IconPart {
  t: "path" | "rect" | "circle";
  d?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  rx?: string;
  cx?: string;
  cy?: string;
  r?: string;
}

export interface Row {
  /** Which question ticks it: `do`, `sell` or `pay`. */
  scope: string;
  /** Its name, the same as in `v5.ts`. */
  n: string;
  /** What ticking it gets you. */
  sub: string;
  icon: IconPart[];
}

export const ROWS: Record<string, Row> = {
 "enq": {
  "scope": "do",
  "n": "Send an enquiry with details",
  "sub": "A form that asks the right questions, so your first reply is useful.",
  "icon": [
   {
    "t": "path",
    "d": "M6 3.5h8l4 4v13H6Z"
   },
   {
    "t": "path",
    "d": "M14 3.5v4h4"
   },
   {
    "t": "path",
    "d": "M9 12.6h6M9 16h4"
   }
  ]
 },
 "mail": {
  "scope": "do",
  "n": "Email you",
  "sub": "A real address, answered by a person, for anybody who would rather write.",
  "icon": [
   {
    "t": "rect",
    "x": "3.5",
    "y": "5",
    "width": "17",
    "height": "14",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "m4 6.6 8 5.7 8-5.7"
   }
  ]
 },
 "call": {
  "scope": "do",
  "n": "Call you",
  "sub": "The number impossible to miss, with a reason to dial it.",
  "icon": [
   {
    "t": "path",
    "d": "M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
   }
  ]
 },
 "msg": {
  "scope": "do",
  "n": "Message you",
  "sub": "WhatsApp, Messenger or similar, for people who would rather not call. Which one is a conversation, not a question here.",
  "icon": [
   {
    "t": "path",
    "d": "M20.5 4.5h-17v12h5v3.6l4.2-3.6h7.8Z"
   },
   {
    "t": "path",
    "d": "M8 9h8M8 12.4h5"
   }
  ]
 },
 "book": {
  "scope": "do",
  "n": "Book an appointment",
  "sub": "Pick a time with you, straight from the site.",
  "icon": [
   {
    "t": "rect",
    "x": "3.5",
    "y": "5",
    "width": "17",
    "height": "15.5",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M3.5 10h17M8 3v4M16 3v4"
   }
  ]
 },
 "loc": {
  "scope": "do",
  "n": "Get to your nearest location",
  "sub": "Whether people come to you at a place, and how many places.",
  "icon": [
   {
    "t": "path",
    "d": "M12 21.2c4.4-4.4 6.6-7.8 6.6-10.6a6.6 6.6 0 1 0-13.2 0c0 2.8 2.2 6.2 6.6 10.6Z"
   },
   {
    "t": "circle",
    "cx": "12",
    "cy": "10.4",
    "r": "2.5"
   }
  ]
 },
 "mine": {
  "scope": "do",
  "n": "Sign in and see their own things",
  "sub": "Their orders, their documents, their details.",
  "icon": [
   {
    "t": "rect",
    "x": "3.2",
    "y": "4.6",
    "width": "17.6",
    "height": "14.8",
    "rx": "2"
   },
   {
    "t": "circle",
    "cx": "9.3",
    "cy": "10.9",
    "r": "2.1"
   },
   {
    "t": "path",
    "d": "M5.9 16.4a3.6 3.6 0 0 1 6.8 0"
   },
   {
    "t": "path",
    "d": "M15.2 10.2h3.1M15.2 13.6h3.1"
   }
  ]
 },
 "buy": {
  "scope": "do",
  "n": "Buy something online",
  "sub": "Pay for products or services on the site.",
  "icon": [
   {
    "t": "path",
    "d": "M5 8h14l-1.2 12.5H6.2Z"
   },
   {
    "t": "path",
    "d": "M9 10.5V7a3 3 0 0 1 6 0v3.5"
   }
  ]
 },
 "quote": {
  "scope": "do",
  "n": "Request a quote or proposal",
  "sub": "They say what they need, you come back with a price.",
  "icon": [
   {
    "t": "path",
    "d": "M6 3.5h8l4 4v13H6Z"
   },
   {
    "t": "path",
    "d": "M14 3.5v4h4"
   },
   {
    "t": "circle",
    "cx": "12",
    "cy": "14.2",
    "r": "2.6"
   },
   {
    "t": "path",
    "d": "M12 11.6v-1.2M12 16.8v1.2"
   }
  ]
 },
 "demo": {
  "scope": "do",
  "n": "Book a demo or a meeting",
  "sub": "The business version of an appointment.",
  "icon": [
   {
    "t": "rect",
    "x": "3",
    "y": "4.5",
    "width": "18",
    "height": "12",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M8 20.5h8M12 16.5v4"
   },
   {
    "t": "path",
    "d": "m10.6 8.2 4 2.3-4 2.3Z"
   }
  ]
 },
 "broch": {
  "scope": "do",
  "n": "Download your brochure",
  "sub": "The thing they forward to whoever decides.",
  "icon": [
   {
    "t": "path",
    "d": "M6 3.5h8l4 4v13H6Z"
   },
   {
    "t": "path",
    "d": "M14 3.5v4h4"
   },
   {
    "t": "path",
    "d": "M12 11v6M9.5 14.5 12 17l2.5-2.5"
   }
  ]
 },
 "trade": {
  "scope": "do",
  "n": "Open a trade account",
  "sub": "For buying from you again and again.",
  "icon": [
   {
    "t": "rect",
    "x": "2.5",
    "y": "5.5",
    "width": "19",
    "height": "13",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M2.5 10h19M6 14.6h4"
   }
  ]
 },
 "reports": {
  "scope": "do",
  "n": "View or download reports and results",
  "sub": "Accounts, impact reports, annual reviews.",
  "icon": [
   {
    "t": "rect",
    "x": "3.5",
    "y": "3.5",
    "width": "17",
    "height": "17",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M8 16.5v-4M12 16.5v-7M16 16.5v-2.5"
   }
  ]
 },
 "updates": {
  "scope": "do",
  "n": "Register for investor updates",
  "sub": "A quieter list, kept apart from the rest.",
  "icon": [
   {
    "t": "path",
    "d": "M18 16.5H6l1.5-2.5V11a4.5 4.5 0 0 1 9 0v3Z"
   },
   {
    "t": "path",
    "d": "M10.2 19.4a2 2 0 0 0 3.6 0"
   }
  ]
 },
 "named": {
  "scope": "do",
  "n": "Contact the right person directly",
  "sub": "A named route, rather than the general enquiry form.",
  "icon": [
   {
    "t": "circle",
    "cx": "12",
    "cy": "8.5",
    "r": "3.5"
   },
   {
    "t": "path",
    "d": "M5.5 20.5a6.5 6.5 0 0 1 13 0"
   }
  ]
 },
 "apply": {
  "scope": "do",
  "n": "Apply to become a franchisee or reseller",
  "sub": "A structured application, not just get in touch.",
  "icon": [
   {
    "t": "path",
    "d": "M6 3.5h8l4 4v13H6Z"
   },
   {
    "t": "path",
    "d": "M14 3.5v4h4"
   },
   {
    "t": "path",
    "d": "m9 14 2.2 2.2L15.5 12"
   }
  ]
 },
 "pack": {
  "scope": "do",
  "n": "Download the prospectus or partner pack",
  "sub": "What somebody reads before they apply.",
  "icon": [
   {
    "t": "path",
    "d": "M12 7.5S10 5.5 3.5 5.5v12C10 17.5 12 19.5 12 19.5s2-2 8.5-2v-12C14 5.5 12 7.5 12 7.5Z"
   },
   {
    "t": "path",
    "d": "M12 7.5v12"
   }
  ]
 },
 "interest": {
  "scope": "do",
  "n": "Register interest",
  "sub": "For a model that is not open yet, or a waiting list.",
  "icon": [
   {
    "t": "path",
    "d": "M6.5 3.5h11v17l-5.5-4-5.5 4Z"
   }
  ]
 },
 "jobs": {
  "scope": "do",
  "n": "See vacancies and apply for a job",
  "sub": "Live roles, with a proper way to apply.",
  "icon": [
   {
    "t": "rect",
    "x": "3",
    "y": "7.5",
    "width": "18",
    "height": "12",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M9 7.5V5.5h6v2M3 12.6h18"
   }
  ]
 },
 "spec": {
  "scope": "do",
  "n": "Send a speculative application",
  "sub": "No role listed, but talk to us anyway.",
  "icon": [
   {
    "t": "path",
    "d": "m20.5 3.5-17 7 6.6 2.6L13 20.5Z"
   },
   {
    "t": "path",
    "d": "m10.1 13.1 3.6-3.6"
   }
  ]
 },
 "portal": {
  "scope": "do",
  "n": "Sign in to a staff area",
  "sub": "A place only your team can get to.",
  "icon": [
   {
    "t": "rect",
    "x": "4.5",
    "y": "10.5",
    "width": "15",
    "height": "10",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M8 10.5V8a4 4 0 0 1 8 0v2.5"
   }
  ]
 },
 "kit": {
  "scope": "do",
  "n": "Download the press kit",
  "sub": "Logos, photographs and the facts, written once.",
  "icon": [
   {
    "t": "rect",
    "x": "3",
    "y": "4.5",
    "width": "18",
    "height": "15",
    "rx": "2"
   },
   {
    "t": "circle",
    "cx": "8.4",
    "cy": "9.4",
    "r": "1.6"
   },
   {
    "t": "path",
    "d": "m4 17.2 5-5 4 4 3-2.4 4 3.4"
   }
  ]
 },
 "media": {
  "scope": "do",
  "n": "Contact you about media",
  "sub": "A named route, with how quickly you answer.",
  "icon": [
   {
    "t": "path",
    "d": "M4 9.5h3l8-4.5v14l-8-4.5H4Z"
   },
   {
    "t": "path",
    "d": "M18 9a3.5 3.5 0 0 1 0 6"
   }
  ]
 },
 "certs": {
  "scope": "do",
  "n": "View certifications, policies and documents",
  "sub": "Findable without having to ask for them.",
  "icon": [
   {
    "t": "path",
    "d": "M12 3.2 19.5 6v6c0 4.2-3 7.2-7.5 8.8C7.5 19.2 4.5 16.2 4.5 12V6Z"
   },
   {
    "t": "path",
    "d": "m9 12 2.2 2.2L15.5 10"
   }
  ]
 },
 "verify": {
  "scope": "do",
  "n": "Verify a credential",
  "sub": "Check that a certificate, registration or member is genuine.",
  "icon": [
   {
    "t": "circle",
    "cx": "11",
    "cy": "11",
    "r": "6.5"
   },
   {
    "t": "path",
    "d": "m15.9 15.9 4.6 4.6"
   },
   {
    "t": "path",
    "d": "m8.4 11 1.9 1.9L13.9 9.3"
   }
  ]
 },
 "email": {
  "scope": "do",
  "n": "Leave their email address",
  "sub": "In exchange for something worth having, from any kind of visitor.",
  "icon": [
   {
    "t": "path",
    "d": "M3.5 10.5h17v9.5h-17Z"
   },
   {
    "t": "path",
    "d": "m3.5 10.5 8.5 6 8.5-6"
   },
   {
    "t": "path",
    "d": "M12 2.8v5.4M9.5 5.9 12 8.4l2.5-2.5"
   }
  ]
 },
 "chat": {
  "scope": "do",
  "n": "Live chat with a person",
  "sub": "A window on every page, answered by somebody on your side. We connect and configure it; we do not staff it.",
  "icon": [
   {
    "t": "path",
    "d": "M20.5 4.5h-17v12h5v3.6l4.2-3.6h7.8Z"
   },
   {
    "t": "circle",
    "cx": "12",
    "cy": "8.9",
    "r": "1.9"
   },
   {
    "t": "path",
    "d": "M8.7 13.7a3.5 3.5 0 0 1 6.6 0"
   }
  ]
 },
 "bot": {
  "scope": "do",
  "n": "A chat assistant",
  "sub": "Answers the questions you get asked most, and hands over to a person. Connected and configured, never promised as a product.",
  "icon": [
   {
    "t": "path",
    "d": "M20.5 4.5h-17v12h5v3.6l4.2-3.6h7.8Z"
   },
   {
    "t": "path",
    "d": "m12 7 .9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9Z"
   }
  ]
 },
 "goods": {
  "scope": "sell",
  "n": "Physical goods, posted or delivered",
  "sub": "Things you pack and send, or hand over.",
  "icon": [
   {
    "t": "path",
    "d": "M12 3.5 20.5 8v8L12 20.5 3.5 16V8Z"
   },
   {
    "t": "path",
    "d": "M3.5 8 12 12.5 20.5 8"
   },
   {
    "t": "path",
    "d": "M12 12.5v8"
   }
  ]
 },
 "digital": {
  "scope": "sell",
  "n": "Digital downloads",
  "sub": "Files, courses, patterns, music.",
  "icon": [
   {
    "t": "path",
    "d": "M12 3.5v10"
   },
   {
    "t": "path",
    "d": "m8 10 4 4 4-4"
   },
   {
    "t": "path",
    "d": "M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"
   }
  ]
 },
 "software": {
  "scope": "sell",
  "n": "Software, or a product people subscribe to",
  "sub": "The site is the shop window and the sign-up.",
  "icon": [
   {
    "t": "rect",
    "x": "3",
    "y": "4.5",
    "width": "18",
    "height": "15",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M3 9h18"
   },
   {
    "t": "path",
    "d": "M5.6 6.8h1M8.2 6.8h1"
   }
  ]
 },
 "service": {
  "scope": "sell",
  "n": "Services at a fixed price, paid online",
  "sub": "A price on the page, and a way to pay it.",
  "icon": [
   {
    "t": "path",
    "d": "M11.2 3.5H20.5v9.3l-8.6 8.6a1.5 1.5 0 0 1-2.1 0l-7.2-7.2a1.5 1.5 0 0 1 0-2.1Z"
   },
   {
    "t": "circle",
    "cx": "16.4",
    "cy": "7.6",
    "r": "1.2"
   }
  ]
 },
 "time": {
  "scope": "sell",
  "n": "Bookings",
  "sub": "Meetings, classes, tables, appointments.",
  "icon": [
   {
    "t": "circle",
    "cx": "12",
    "cy": "12",
    "r": "8.5"
   },
   {
    "t": "path",
    "d": "M12 6.9v5.4l3.4 2"
   }
  ]
 },
 "project": {
  "scope": "sell",
  "n": "Projects and bespoke work, quoted first",
  "sub": "Nothing has a price until you have looked at it.",
  "icon": [
   {
    "t": "path",
    "d": "M4.2 19.8h4.2L19.6 8.6a2.5 2.5 0 0 0-3.6-3.6L4.8 16.2Z"
   },
   {
    "t": "path",
    "d": "M14.6 6.4 18.2 10"
   },
   {
    "t": "path",
    "d": "M4.8 16.2 8.4 19.8"
   }
  ]
 },
 "member": {
  "scope": "sell",
  "n": "Memberships",
  "sub": "Gyms, clubs, paid content.",
  "icon": [
   {
    "t": "rect",
    "x": "2.5",
    "y": "5",
    "width": "19",
    "height": "14",
    "rx": "2"
   },
   {
    "t": "circle",
    "cx": "8.4",
    "cy": "10.8",
    "r": "2.1"
   },
   {
    "t": "path",
    "d": "M5.1 16.3a3.6 3.6 0 0 1 6.6 0"
   },
   {
    "t": "path",
    "d": "M14.6 10.3h4.2M14.6 13.5h4.2"
   }
  ]
 },
 "support": {
  "scope": "sell",
  "n": "Donations, and support",
  "sub": "People giving because they want you to keep going.",
  "icon": [
   {
    "t": "path",
    "d": "M12 20.4S4.4 15.7 4.4 10.5A3.9 3.9 0 0 1 12 8.5a3.9 3.9 0 0 1 7.6 2c0 5.2-7.6 9.9-7.6 9.9Z"
   }
  ]
 },
 "paypal": {
  "scope": "pay",
  "n": "PayPal as well",
  "sub": "For people who would rather not type a card in.",
  "icon": [
   {
    "t": "path",
    "d": "M3.5 8.2a2 2 0 0 1 2-2h11.2a1.6 1.6 0 0 1 1.6 1.6v0.6"
   },
   {
    "t": "rect",
    "x": "3.5",
    "y": "8.2",
    "width": "17",
    "height": "10.3",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M20.5 11.6h-3.3a1.7 1.7 0 0 0 0 3.5h3.3"
   }
  ]
 },
 "instal": {
  "scope": "pay",
  "n": "Instalments",
  "sub": "Klarna or Clearpay, offered at the checkout.",
  "icon": [
   {
    "t": "rect",
    "x": "3.4",
    "y": "5.6",
    "width": "17.2",
    "height": "15",
    "rx": "2"
   },
   {
    "t": "path",
    "d": "M3.4 10.2h17.2"
   },
   {
    "t": "path",
    "d": "M8.2 3.4v4M15.8 3.4v4"
   },
   {
    "t": "path",
    "d": "M8 14.4h.01M12 14.4h.01M16 14.4h.01"
   }
  ]
 },
 "repeat": {
  "scope": "pay",
  "n": "Repeat payments",
  "sub": "Subscriptions and memberships, taken on the same day each time. Run by the provider, never built.",
  "icon": [
   {
    "t": "path",
    "d": "M4.6 12a7.4 7.4 0 0 1 12.6-5.2l2.3 2.3"
   },
   {
    "t": "path",
    "d": "M19.5 4.6v4.5H15"
   },
   {
    "t": "path",
    "d": "M19.4 12a7.4 7.4 0 0 1-12.6 5.2l-2.3-2.3"
   },
   {
    "t": "path",
    "d": "M4.5 19.4v-4.5H9"
   }
  ]
 },
 "dd": {
  "scope": "pay",
  "n": "Direct debit for recurring",
  "sub": "For money that comes in every month.",
  "icon": [
   {
    "t": "path",
    "d": "M3.5 9.6 12 4.6l8.5 5"
   },
   {
    "t": "path",
    "d": "M6 9.6v8M18 9.6v8M10 9.6v8M14 9.6v8"
   },
   {
    "t": "path",
    "d": "M3.5 20.4h17"
   }
  ]
 },
 "acct": {
  "scope": "pay",
  "n": "Some customers pay on account",
  "sub": "A conversation rather than a build. Invoices stay in your accounting system, where they already work.",
  "icon": [
   {
    "t": "path",
    "d": "M5.5 3.5h13v17l-2.2-1.6-2.2 1.6-2.2-1.6-2.2 1.6-2.2-1.6Z"
   },
   {
    "t": "path",
    "d": "M9 8.6h6M9 12.2h6"
   }
  ]
 }
};

/**
 * The bands the rows are grouped into.
 *
 * `need` names the visitor group that puts a band on the page. A band with no
 * `need` is there whatever anybody answered, which is what makes the first two
 * of them not a choice at all.
 */
export interface Band {
  step: string;
  band: string;
  need: string;
  title: string;
  count: number;
  note: string;
}

export const BANDS: readonly Band[] = [
 {
  "step": "do",
  "band": "inc",
  "need": "",
  "title": "Always included",
  "count": 2,
  "note": "On every site we build. Nothing to decide, and never charged for."
 },
 {
  "step": "do",
  "band": "std",
  "need": "",
  "title": "Standard inclusions",
  "count": 4,
  "note": "On every site we build. Two start ticked, so change them to suit you."
 },
 {
  "step": "do",
  "band": "consumer",
  "need": "consumer",
  "title": "For your customers",
  "count": 2,
  "note": "Put here by a group you named on the step before."
 },
 {
  "step": "do",
  "band": "investor",
  "need": "investor",
  "title": "For investors and funders",
  "count": 3,
  "note": "Put here by a group you named on the step before."
 },
 {
  "step": "do",
  "band": "partner",
  "need": "partner",
  "title": "For franchisees and agents",
  "count": 3,
  "note": "Put here by a group you named on the step before."
 },
 {
  "step": "do",
  "band": "staff",
  "need": "staff",
  "title": "For staff, and people who want to join",
  "count": 3,
  "note": "Put here by a group you named on the step before."
 },
 {
  "step": "do",
  "band": "press",
  "need": "press",
  "title": "For press and media",
  "count": 2,
  "note": "Put here by a group you named on the step before."
 },
 {
  "step": "do",
  "band": "regulator",
  "need": "regulator",
  "title": "For regulators and auditors",
  "count": 2,
  "note": "Put here by a group you named on the step before."
 },
 {
  "step": "do",
  "band": "any",
  "need": "",
  "title": "Everyone",
  "count": 1,
  "note": "One thing for a visitor who is not ready to do anything else yet."
 },
 {
  "step": "do",
  "band": "talk",
  "need": "",
  "title": "Worth a conversation",
  "count": 2,
  "note": "Not standard, and not priced here. Tick one and we will talk it through with you before anything is agreed."
 }
];
