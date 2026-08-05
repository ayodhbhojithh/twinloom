/* ---------------------------------------------------------------------------
   What the website has to keep a record of.

   One row for each kind of thing a business sells. The four columns are the
   whole argument of the step: what a record of it actually has to hold, what
   the market already sells for that, and what we would therefore do - connect
   to something, or build it.

   The third and fourth columns are the honest ones. Two of these rows say we
   would not build the thing, because you can buy it and buying it is better;
   the rest say we would, because nothing ready-made keeps the record properly.
   A scoping tool that answered "yes, we can build that" to all eight would be
   worth nothing to the person reading it.
--------------------------------------------------------------------------- */

/** One kind of record, and what it takes to keep it. */
export interface SystemRow {
  /** The key answers are stored under. */
  k: string;
  /** The selling type it belongs to, from `TYPE_NAMES`. */
  ty: string;
  /** What a record of it has to hold. */
  rec: string;
  /** What people generally use for it today. */
  market: string;
  /** What we would do about it. */
  ours: string;
}

export const SYSTEM_ROWS: readonly SystemRow[] = [
 {
  k: "goods",
  ty: "GOODS",
  rec: "Catalogue, stock, orders, delivery, returns, tax.",
  market: "Ready-made shop platforms hold all of it.",
  ours: "We connect the site to a shop platform rather than rebuild one.",
 },
 {
  k: "digital",
  ty: "DIGITAL",
  rec: "Order to entitlement, expiring links, a download log, and a way back in to download it again.",
  market: "Scattered across add-ons. Nothing owns the record.",
  ours: "TwinCoreTech builds this one, because nothing ready-made keeps the entitlement properly.",
 },
 {
  k: "member",
  ty: "MEMBERSHIP",
  rec: "A member registry: who, which plan, what status, which period, what it entitles them to, and the check-ins.",
  market: "Vertical products, one per trade.",
  ours: "TwinCoreTech builds the registry and keeps billing in step with it.",
 },
 {
  k: "support",
  ty: "SUPPORT",
  rec: "A supporter registry, the state of recurring gifts, Gift Aid declarations and claims, and acknowledgements.",
  market: "Generic donation tools cover the taking of money.",
  ours: "TwinCoreTech builds the supporter side, including the Gift Aid trail.",
 },
 {
  k: "service",
  ty: "SERVICE",
  rec: "A payment, a receipt, and what happens next - held somewhere that is not the website.",
  market: "Card platforms cover the payment itself.",
  ours: "We keep the record thin and put it where your work already lives.",
 },
 {
  k: "project",
  ty: "PROJECT",
  rec: "Enquiry, pipeline, proposal, invoice.",
  market: "Whatever CRM you already run.",
  ours: "TwinCoreTech builds this as its own thing, or connects to the CRM you have.",
 },
 {
  k: "time",
  ty: "TIME",
  rec: "An availability engine and cancellation rules.",
  market: "A crowded, capable, ready-made market.",
  ours: "We connect to one. We would not build a diary you can buy.",
 },
 {
  k: "software",
  ty: "SOFTWARE",
  rec: "The product's own billing, or a merchant of record.",
  market: "Already solved inside the product.",
  ours: "Nothing for us to hold. The website points at it.",
 },
] as const;

/** A row by its key, for the read-back and the panel. */
export const SYSTEM_BY: Record<string, SystemRow> = Object.fromEntries(
  SYSTEM_ROWS.map((row) => [row.k, row]),
);

/* ---------------------------------------------------------------------------
   The systems already running that a website has to agree with.

   Grouped the way somebody would go looking for them - by what the thing is
   for, not by what it is called. Eighteen names in one column is a list to be
   read; five short groups is a list to be scanned, and scanning is what
   somebody does with a page of things they mostly do not have.

   Every row carries a line saying what it means in plain terms, because
   "EPOS" and "CRM" are trade words and the person answering this is not
   necessarily in the trade.
--------------------------------------------------------------------------- */

/** One thing a website might have to join to. */
export interface SystemLink {
  k: string;
  n: string;
  /** What it is, for somebody who does not use the word. */
  note: string;
}

export const SYSTEM_LINKS: readonly {
  title: string;
  rows: readonly SystemLink[];
}[] = [
 {
  title: "Selling and money",
  rows: [
   { k: "epos", n: "Till, or point of sale", note: "What the counter rings up." },
   { k: "paycard", n: "Card payments", note: "Who takes the money, and where it lands." },
   { k: "accts", n: "Accounting or bookkeeping", note: "Invoices, receipts, the year end." },
   { k: "stock", n: "Stock or inventory", note: "What is on the shelf, and where." },
  ],
 },
 {
  title: "People",
  rows: [
   { k: "crm", n: "Customer list, or CRM", note: "Who they are and what was said." },
   { k: "mailer", n: "Email marketing", note: "Lists, sign-ups, campaigns." },
   { k: "memsys", n: "Memberships or subscriptions", note: "Who is in, and until when." },
   { k: "giving", n: "Donations and Gift Aid", note: "Supporters, gifts, declarations." },
  ],
 },
 {
  title: "Time and place",
  rows: [
   { k: "diary", n: "Booking diary or calendar", note: "Slots, staff, cancellations." },
   { k: "rota", n: "Rotas, staff or payroll", note: "Who is working, and when." },
   { k: "deliv", n: "Delivery, couriers or collection", note: "Getting it to them." },
   { k: "venue", n: "Tables, rooms or venue", note: "The thing being held for someone." },
  ],
 },
 {
  title: "The work itself",
  rows: [
   { k: "jobs", n: "Jobs, tickets or cases", note: "The queue the work sits in." },
   { k: "quotes", n: "Quotes and proposals", note: "What was offered, and for how much." },
   { k: "files", n: "Document or file store", note: "Where the paperwork lives." },
   { k: "learn", n: "Courses or learning platform", note: "Lessons, progress, certificates." },
  ],
 },
 {
  title: "Anything else",
  rows: [
   { k: "feeds", n: "Listing or portal feeds", note: "Property, travel, jobs, marketplaces." },
   { k: "bespoke", n: "Something built for you already", note: "In-house, and still running." },
  ],
 },
] as const;
