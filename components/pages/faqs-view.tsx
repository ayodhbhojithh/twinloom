import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";

import { PageShell, type PageSection } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { STOPS } from "@/lib/journey";
import { CONTACT_INFO, ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   FAQs.

   The sitemap asks for grouped questions across process, ownership, hosting and
   domains, data protection, timelines, payment, and care - and the v5 draft
   left the answers unwritten. They are written here, and every one of them is
   answered from something the site already says: the thirteen steps, the eleven
   inclusions, the terms of business, the privacy notice.

   That constraint is the point. An FAQ is where a company quietly invents
   commitments nobody else has agreed to, because it reads as chat rather than
   as a document. Every answer below either restates a clause and links to it,
   or says plainly that the thing is not settled yet.

   Where the honest answer is "it depends", the answer says what it depends on.
   That was the draft's own instruction for this screen and it is the only thing
   that separates a useful FAQ from a page of reassurance.
--------------------------------------------------------------------------- */

interface Ask {
  q: string;
  a: React.ReactNode;
}

const S = {
  before: { id: "before", title: "Before you ask for anything" },
  running: { id: "running", title: "How a project runs" },
  getting: { id: "getting", title: "What you actually get" },
  money: { id: "money", title: "Money" },
  after: { id: "after", title: "Hosting, care and after launch" },
  data: { id: "data", title: "Your data, and the law" },
  rules: { id: "rules", title: "The rules the run-through follows" },
} satisfies Record<string, PageSection>;

export const FAQ_SECTIONS: readonly PageSection[] = Object.values(S);

/** A link that reads as one, inside an answer. */
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-ink underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
    >
      {children}
    </Link>
  );
}

const BEFORE: readonly Ask[] = [
  {
    q: "What does it cost to ask?",
    a: (
      <>
        Nothing, and it commits you to nothing. You answer what you like, and a
        written scope comes back within two working days. It is a description of
        a website, not a quote - nothing in it is priced.
      </>
    ),
  },
  {
    q: "Do I have to answer all the questions?",
    a: (
      <>
        No. Every question is optional and you can send at any point. A question
        you leave is recorded as an assumption we have made, shown to you as an
        assumption, rather than filled in on your behalf. There is no score and
        no progress bar telling you that you have not done enough.
      </>
    ),
  },
  {
    q: "What comes back, and when?",
    a: (
      <>
        A written scope in your own words, within two working days. It says what
        the site would be, who it is for, and what we assumed where you did not
        say. The price comes later, at step seven, against that document and in
        writing.
      </>
    ),
  },
  {
    q: "Can I just talk to somebody instead?",
    a: (
      <>
        Yes. <A href={ROUTES.book}>Book a meeting</A> and come with the
        run-through done or with nothing at all. Or ring{" "}
        {CONTACT_INFO.phone}, {CONTACT_INFO.hours.toLowerCase()}.
      </>
    ),
  },
  {
    q: "Can I add to a request after I have sent it?",
    a: (
      <>
        Yes, and it amends the same request rather than starting a second one.
        The reference you are given identifies the request as a whole, and
        everything you attach lands in the same place.
      </>
    ),
  },
];

const RUNNING: readonly Ask[] = [
  {
    q: "How does a project actually run?",
    a: (
      <>
        In {STOPS.length} steps, in three zones: talking, building, and what
        continues afterwards. The same run for every project - what changes
        between them is what happens inside a step, never which steps there are.{" "}
        <A href={ROUTES.how}>See all {STOPS.length}</A>.
      </>
    ),
  },
  {
    q: "How long does a website take?",
    a: (
      <>
        It depends on two things, and both are knowable early: how many pages
        there are, and how much of the content already exists. A small site with
        content ready is about four weeks; a larger one with a shop or a booking
        system is six to nine. The dates are in the proposal before anything
        starts.
      </>
    ),
  },
  {
    q: "What happens if we are slow getting you things?",
    a: (
      <>
        Planned dates move by at least the delay, and booked capacity may be
        reassigned. More than four weeks late and the project moves to the next
        available slot; eight weeks with no meaningful response and we invoice
        completed work and close the active project after written notice. That
        is clause 4 of the{" "}
        <A href={ROUTES.termsOfBusiness}>Terms of Business</A>.
      </>
    ),
  },
  {
    q: "What if we want to change something halfway through?",
    a: (
      <>
        Either side can ask. We assess the effect on the deliverables, the
        timing and the fee, and nothing changes until both of us agree it in
        writing. Corrections needed to make something match the agreed scope are
        not chargeable changes - that distinction is clause 7.
      </>
    ),
  },
  {
    q: "Who do we deal with?",
    a: (
      <>
        The people doing the work. Where a specialist is needed - brand,
        photography, copy, accessibility testing, campaigns - they are named in
        the proposal before the work starts, on one contract and one invoice.{" "}
        <A href={ROUTES.services}>What we offer</A>.
      </>
    ),
  },
];

const GETTING: readonly Ask[] = [
  {
    q: "What is included in every site?",
    a: (
      <>
        The same eleven things whatever the site costs: it works on every
        device, your identity applied, search set-up, security, hosting and
        backups, speed, an accessibility review, an enquiry form, analytics in
        accounts you own, two weeks of attention after launch, and a handover
        pack with a session. <A href={ROUTES.about}>The full list</A>.
      </>
    ),
  },
  {
    q: "Do we own the website?",
    a: (
      <>
        Yes, subject to payment in full: the bespoke design, the copy written
        for you, the bespoke code, and the commissioned assets named in the
        proposal. We keep our own pre-existing tools and libraries and licence
        what the site needs to use them. Clause 10 of the{" "}
        <A href={ROUTES.termsOfBusiness}>Terms of Business</A>.
      </>
    ),
  },
  {
    q: "Whose name are the accounts in?",
    a: (
      <>
        Yours, from the day they are made. Domain, analytics, Search Console,
        and any platform you pay for directly. Nothing is held in our name to
        keep you.
      </>
    ),
  },
  {
    q: "Will you use our project in your portfolio?",
    a: (
      <>
        After public launch, unless the proposal says otherwise, we may name
        you, link to the site, show screenshots and describe the work. Never
        confidential information or unpublished commercial data. You can opt out
        in writing at any point, and the proposal can record an opt-out agreed
        in advance.
      </>
    ),
  },
  {
    q: "Can you build a booking system or a shop?",
    a: (
      <>
        Yes, and usually by connecting to one rather than writing a new one.
        Bookings, shops and calendars are solved problems, and a bespoke one is
        something you then pay us to maintain forever. Where what sits behind
        the site genuinely has to be built, that is TwinCoreTech, in the same
        group.
      </>
    ),
  },
];

const MONEY: readonly Ask[] = [
  {
    q: "How much does a website cost?",
    a: (
      <>
        It depends on the number of pages, whether anything is sold or booked on
        the site, how much content has to be created rather than supplied, and
        what it has to connect to. Those four are what the run-through is
        establishing. No number is given before there is a written scope to
        price, because a number given earlier is a guess with a decimal point in
        it.
      </>
    ),
  },
  {
    q: "When do we pay?",
    a: (
      <>
        Unless the proposal says otherwise: 40 per cent on acceptance, 40 per
        cent on approval of the main design and working build, and 20 per cent
        before or on launch. Care plans are monthly in advance. Invoices are due
        within 14 days. Clause 5 of the{" "}
        <A href={ROUTES.termsOfBusiness}>Terms of Business</A>.
      </>
    ),
  },
  {
    q: "Is VAT included?",
    a: (
      <>
        No. All fees are exclusive of VAT, charged at the prevailing rate where
        applicable. TwinCoreTech Ltd&apos;s VAT number is 489 0108 74.
      </>
    ),
  },
  {
    q: "What about third-party costs?",
    a: (
      <>
        The proposal identifies the foreseeable ones. Platforms you own - domain,
        email, e-commerce, booking, CRM, advertising - are normally paid by you
        directly, so you keep control of them and can leave with them.
      </>
    ),
  },
];

const AFTER: readonly Ask[] = [
  {
    q: "What happens if something breaks after launch?",
    a: (
      <>
        Report a defect in the agreed build within 30 days of launch and we
        correct it without an additional development fee. Urgent security or
        data issues, report immediately, whenever they happen. A new
        requirement, a third-party outage or a change made after acceptance is
        not a defect - clause 9 says which is which.
      </>
    ),
  },
  {
    q: "Do you host it?",
    a: (
      <>
        Normally yes, unless it is agreed otherwise, and either way the
        arrangement is written down. Where we host, the service schedule states
        the environment, monitoring, backups, maintenance, the support channel
        and the response targets.
      </>
    ),
  },
  {
    q: "What if we want to move to another supplier?",
    a: (
      <>
        After amounts due are paid, you get the standard handover: code, agreed
        assets, a content export, an account record, a current backup and
        reasonable transfer information. Additional migration work is
        chargeable, but we will not deliberately obstruct a move. Clause 22.
      </>
    ),
  },
  {
    q: "Do you guarantee we will rank first on Google?",
    a: (
      <>
        No, and nobody honest does. Search rankings, traffic, sales and
        inclusion in AI-generated answers all depend on third parties and on
        markets. What is guaranteed is the technical work: every page findable
        and readable by a search engine, and analytics in accounts you own so
        you can see what actually happens.
      </>
    ),
  },
];

const DATA: readonly Ask[] = [
  {
    q: "What do you do with what I send you?",
    a: (
      <>
        Read it, and use it to prepare a scope and talk to you about it. It is
        not sold and not used to train anything.{" "}
        <A href={ROUTES.privacy}>The privacy notice</A> sets out every purpose,
        the lawful basis for each, and how long each record is kept.
      </>
    ),
  },
  {
    q: "How long do you keep it if we never become a client?",
    a: (
      <>
        Twelve months after the last meaningful contact for an enquiry, and
        twenty-four months for a proposal that is not accepted. A request saved
        but never sent goes after 30 days.
      </>
    ),
  },
  {
    q: "Does anything on the site make an automated decision about us?",
    a: (
      <>
        No. Your answers generate an outline and a written scope, and that is a
        planning aid. It does not accept or reject anybody, create a contract or
        set a price. A person reviews every submitted request.
      </>
    ),
  },
  {
    q: "Are you GDPR compliant?",
    a: (
      <>
        We work to UK GDPR and the Data Protection Act 2018, and the detail is
        published rather than claimed: what we collect and why, who receives it,
        international transfers, retention and your rights are all in{" "}
        <A href={ROUTES.privacy}>the privacy notice</A>. Where we process data
        on a client&apos;s instructions, that is governed by data-processing
        terms in the agreement.
      </>
    ),
  },
  {
    q: "Is the site accessible?",
    a: (
      <>
        We build to WCAG 2.2 Level AA and an accessibility review is one of the
        eleven inclusions. This website has not yet been independently audited
        against that standard, and{" "}
        <A href={ROUTES.accessibility}>the accessibility statement</A> says so
        rather than claiming a conformance level nobody has tested.
      </>
    ),
  },
  {
    q: "Something is wrong. How do I complain?",
    a: (
      <>
        Write to us, in whatever words you like. Acknowledged by a person within
        two working days and answered in full within ten.{" "}
        <A href={ROUTES.complaints}>How complaints work</A>.
      </>
    ),
  },
];

/**
 * The thirteen rules the run-through itself follows.
 *
 * Not questions, so they are not set as questions. They are the constitution of
 * the scoping tool, and they are on this page for the reason the draft gives:
 * a rule you can read is a rule you can hold us to.
 */
const RULES: readonly { n: string; sub: string }[] = [
  {
    n: "Three layers, and no more",
    sub: "A list of options. Detail behind one of them. And, only in the shop, the back of the shop.",
  },
  {
    n: "An area can be left alone",
    sub: "Picking nothing is an answer. We say what we assumed instead, rather than blocking your way forward.",
  },
  {
    n: "Every open list ends the same way",
    sub: "Something else, told in your own words, captured word for word and never rewritten into ours.",
  },
  {
    n: "Open lists and closed lists",
    sub: "A list is open when the answer is about your business, and you may add to it. It is closed when the answer is about our build.",
  },
  {
    n: "What you add carries no weight",
    sub: "A row you write yourself never puts a page on the sitemap by itself. It goes on the list of things to talk about, in your words.",
  },
  {
    n: "An option opens detail only when it has to",
    sub: "Only when a further answer changes the build, the sitemap, or what we have to ask you for. Symmetry is not a reason.",
  },
  {
    n: "One box per layer, not one per option",
    sub: "The exception is an answer that is honestly a file or a link. Those carry their own attach.",
  },
  {
    n: "Everything attached lands in the side panel",
    sub: "Tied to the answer it came from. Anything with nothing to tie it to sits under General.",
  },
  {
    n: "Unanswered means assumed, and it says so",
    sub: "Line by line, in the document. Touching a question makes it answered.",
  },
  {
    n: "One home",
    sub: "Where two answers imply the same screen, the first keeps it and the second says where it went.",
  },
  {
    n: "Nothing on screen is a number we price with",
    sub: "No days, no scores, no levels, no tiers. Questions, and a growing description of your own site.",
  },
  {
    n: "Every layer ends in the same fork",
    sub: "Use this scope, or give more detail. Both are finished states.",
  },
  {
    n: "The question asks the fact",
    sub: "The detail asks the consequences. Where the same fact would reach us twice, it is asked once, and the second place says where it went.",
  },
];

/**
 * One question.
 *
 * A native `details` rather than a state hook: it opens before the JavaScript
 * arrives, it is what a browser's own find-in-page knows how to open, and it
 * needs no code to be reachable from the keyboard.
 */
function Q({ ask }: { ask: Ask }) {
  return (
    <details className="group/q border-b border-hair last:border-b-0">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 text-[15.5px] leading-[1.4] font-semibold text-ink transition-colors group-hover/q:text-mark">
          {ask.q}
        </span>
        <span
          aria-hidden
          className="mt-0.5 flex size-6 flex-none items-center justify-center rounded-pill bg-canvas text-quiet transition-transform group-open/q:rotate-180"
        >
          <ChevronDown className="size-3.5" strokeWidth={2.4} />
        </span>
      </summary>

      <p className="max-w-[74ch] pb-5 text-[14.5px] leading-[1.7] text-body">
        {ask.a}
      </p>
    </details>
  );
}

/** One group of questions, on a surface of its own. */
function Group({ s, asks }: { s: PageSection; asks: readonly Ask[] }) {
  return (
    <section
      id={s.id}
      aria-labelledby={`${s.id}-h`}
      className="mt-10 scroll-mt-[calc(var(--nav-height)+24px)]"
    >
      <h2
        id={`${s.id}-h`}
        className="text-[clamp(20px,1.8vw,26px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink"
      >
        {s.title}
      </h2>

      <div className="mt-4 rounded-[20px] bg-field px-5 sm:px-6">
        {asks.map((ask) => (
          <Q key={ask.q} ask={ask} />
        ))}
      </div>
    </section>
  );
}

export function FaqsView() {
  return (
    <PageShell sections={FAQ_SECTIONS}>
      <header className="mb-4 max-w-measure">
        <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
          FAQs
        </p>

        <h1 className="mt-3 max-w-[18ch] text-[clamp(30px,3.4vw,46px)] leading-[1.04] font-extrabold tracking-[-0.042em] text-ink">
          The questions people
          <span className="text-quiet"> actually ask.</span>
        </h1>

        <p className="mt-5 max-w-[70ch] text-[clamp(15px,1.2vw,17px)] leading-[1.65] text-body">
          Answered from what the rest of the site already commits to, with a
          link to the clause or the page that says it. Where the honest answer
          is that it depends, the answer says what it depends on.
        </p>
      </header>

      <Group s={S.before} asks={BEFORE} />
      <Group s={S.running} asks={RUNNING} />
      <Group s={S.getting} asks={GETTING} />
      <Group s={S.money} asks={MONEY} />
      <Group s={S.after} asks={AFTER} />
      <Group s={S.data} asks={DATA} />

      {/* The thirteen. Not questions, so not set as questions. */}
      <section
        id={S.rules.id}
        aria-labelledby={`${S.rules.id}-h`}
        className="mt-14 scroll-mt-[calc(var(--nav-height)+24px)]"
      >
        <CutPanel
          tone="field"
          className="w-full"
          aside={
            <div className="flex size-full flex-col items-center justify-center">
              <b className="font-mono text-[22px] leading-none font-bold text-ink tabular-nums">
                13
              </b>
              <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
                Rules
              </span>
            </div>
          }
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Written down on purpose
            </span>
          }
          corner={
            <Link
              href={ROUTES.build}
              aria-label="Build your website"
              title="Build your website"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          <h2
            id={`${S.rules.id}-h`}
            className="mx-auto mt-8 max-w-[26ch] text-center text-[clamp(20px,1.8vw,26px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink"
          >
            {S.rules.title}
          </h2>

          <p className="mx-auto mt-3 max-w-[64ch] text-center text-[15px] leading-[1.65] text-quiet">
            The scoping run has thirteen rules of its own. They are published
            for one reason: a rule you can read is a rule you can hold us to.
          </p>

          <ol className="mx-auto mt-10 grid w-full max-w-[1440px] gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
            {RULES.map((rule, n) => (
              <li key={rule.n} className="flex min-w-0 gap-3.5">
                <span
                  aria-hidden
                  className="mt-px flex size-6 flex-none items-center justify-center rounded-pill bg-canvas font-mono text-[9.5px] font-bold text-idx tabular-nums"
                >
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <b className="block text-[14px] leading-[1.3] font-extrabold tracking-[-0.02em] text-ink">
                    {rule.n}
                  </b>
                  <span className="mt-1 block text-[13px] leading-[1.55] text-quiet">
                    {rule.sub}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </CutPanel>
      </section>

      {/* What to do when the answer is not here. */}
      <section className="mt-10">
        <CutPanel tone="field" className="w-full">
          <h2 className="max-w-[min(22ch,var(--notch-free,62ch))] text-[clamp(20px,1.8vw,26px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Not here? Ask it directly.
          </h2>

          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.65] text-quiet">
            A person answers, and if the honest answer is that we do not know
            yet, that is what you will get.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              href={ROUTES.contact}
              className="group/one inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              Contact us
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover/one:translate-x-0.5 group-hover/one:-translate-y-0.5"
              />
            </Link>

            <Link
              href={ROUTES.book}
              className="inline-flex items-center gap-2 rounded-pill bg-canvas px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
            >
              Book a meeting
            </Link>
          </div>
        </CutPanel>
      </section>
    </PageShell>
  );
}
