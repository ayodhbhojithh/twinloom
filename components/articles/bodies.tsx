import { Lede, P, Sect } from "./kit";

/* ---------------------------------------------------------------------------
   The four articles, written out.

   Each one is arranged rather than converted: a comparison is set as cards, a
   run of named platforms as named rows, a set of figures as figures, and the
   questions at the end as questions. The sources ran to six thousand words with
   six pipe tables in them; what is here says the same things in the shape each
   thing wants, and stops.

   Held as components rather than as data because the arranging is the work. A
   list of blocks would only push the decision of how to set each one back into
   a renderer, which is the arrangement that produced the grey column.
--------------------------------------------------------------------------- */

/** Every article's sections, in order, for the contents rail beside it. */
export const CONTENTS: Record<string, readonly string[]> = {
  "how-your-website-is-made": [
    "The only thing a browser reads is HTML",
    "The names, at their moments",
    "Where the moving parts come from",
    "When a server does enter the picture",
    "Why we build this way",
    "Questions people ask us",
  ],
  "why-shopify": [
    "The honest answer first",
    "What a shop gets on day one",
    "The alternatives, in plain words",
    "When we would say something else",
    "If you already have a shop",
  ],
  "selling-online-options": [
    "The words, translated",
    "What are you selling?",
    "Ways of selling that change the picture",
    "The platforms, by the job they do",
    "Where we would start",
    "Questions people ask us",
  ],
  "systems-behind-selling": [
    "The three systems",
    "What each kind of sale needs",
    "What Omadeas is",
    "Questions people ask us",
  ],
};

/* ------------------------------------------------ how your website is made */

/**
 * The real difference is when your pages get made.
 *
 * Written out rather than built. Every other piece here is arranged - cards for
 * a comparison, named rows for a run of platforms, figures for a set of numbers
 * - because those arrangements do work the prose would otherwise do clumsily.
 * This one is an argument, and an argument is a thing you follow from one end
 * to the other. Cut into panels it stopped being one.
 *
 * So: headings and paragraphs, and nothing else. Nothing in here draws a box, a
 * rule, a tick or a column. It reads the way a page of a document reads, which
 * is the only shape that suits a piece whose whole point is that the simple
 * answer is usually the right one.
 */
function HowItIsMade() {
  return (
    <>
      <Lede>
        Every website a visitor sees is plain HTML. It has been since the web
        began, and it still is. What separates one website technology from
        another is a single question, and it is not the one people usually ask.
        It is this: when does that HTML get made, and by what?
      </Lede>

      <Sect title="The only thing a browser reads is HTML">
        <P>
          A browser receives a file and draws the page from it. That is the
          whole of it. Every website on earth arrives this way, so whatever the
          difference between one technology and another turns out to be, it is
          not what the visitor receives. What the visitor receives is always the
          same.
        </P>
        <P>
          The difference sits upstream, in the moment the file comes into
          existence. There are two such moments available, and everything else
          follows from which one you pick.
        </P>
        <P>
          A page can be made at the moment somebody asks for it. A visitor
          knocks, a program wakes up, works out what the page should say, builds
          it, and hands it over. WordPress is the best known way of doing this.
          It is flexible, because a page built on demand can differ for every
          visitor who asks for it. It is also software running on a server, and
          software running on a server has to be updated, secured and paid for
          whether or not anything on the site ever changes.
        </P>
        <P>
          Or a page can be made once, in advance. The file is built when the
          words change, sits there as an ordinary file, and the server has only
          to hand it over. Nothing runs when a visitor arrives. There is nothing
          to break into, nothing to keep patched, and the page comes back as
          fast as a file can be sent, because sending it is all that happens.
        </P>
        <P>
          The trade is honest in both directions. A page built in advance cannot
          change by itself, so changing it means building it again. That suits a
          page that changes weekly. It does not suit a page showing live stock.
          We build in advance unless a site has a reason to need otherwise, and
          when it does have one, we say which pages and why.
        </P>
      </Sect>

      <Sect title="The names, at their moments">
        <P>
          The names that fill these conversations are not competitors. They do
          different jobs at different moments, and most of the confusion comes
          from comparing two things that never meet. Put each one back at the
          moment it belongs to and the conversation gets much shorter.
        </P>
        <P>
          HTML, CSS and JavaScript are what a browser reads. They are the end of
          the process rather than a choice within it, and every site is made of
          them however it was built.
        </P>
        <P>
          React is a way of writing the parts a page is assembled from. Next.js
          and Astro decide when that assembly happens, which is the question
          this whole piece is about. Node is what runs the assembling. WordPress
          is a program that does the assembling at the moment of the visit, with
          a database behind it holding the words.
        </P>
        <P>
          Read that list again and notice its shape: one set of things that
          arrive at the browser, and one set of things that decide how they got
          there. Nothing in the first set competes with anything in the second.
        </P>
      </Sect>

      <Sect title="Where the moving parts come from">
        <P>
          A website with nothing moving in it is a website with very little to
          go wrong. Moving parts arrive for a reason, and the reason is always
          something the site has to do rather than something it has to look
          like.
        </P>
        <P>
          Taking money is a moving part. So is holding a booking, signing
          somebody in, or showing a number that was true a minute ago. Each of
          those needs something running somewhere, and each is worth having when
          the business actually needs it.
        </P>
        <P>
          What is not worth having is a moving part nobody asked for. A page of
          words does not need a database behind it. A photograph does not need a
          program to decide when to show it. Most of what makes a website slow,
          expensive or fragile is machinery installed for a job the site was
          never doing.
        </P>
      </Sect>

      <Sect title="When a server does enter the picture">
        <P>
          There is a middle answer, and it is the one we reach for most often
          when a site genuinely needs one. Build almost everything in advance,
          and let the few pages that cannot be built in advance be made on
          demand.
        </P>
        <P>
          A shop is the clearest case. The pages describing what you sell can be
          built once and left to sit. The basket cannot: it has to know what
          this particular person put in it. So the catalogue is files and the
          basket is a program, and the visitor never sees the join.
        </P>
        <P>
          This is not a compromise between two positions. It is the same
          question asked page by page rather than site by site, and page by page
          is usually where the honest answer is.
        </P>
      </Sect>

      <Sect title="Why we build this way">
        <P>
          Because the cost of a website is not what it costs to make. It is what
          it costs to keep. A site built in advance has almost nothing to keep:
          no program to update, no database to back up, and no monthly bill for
          machinery that sat idle all month.
        </P>
        <P>
          Because a page that is already made cannot be slow. Nothing is working
          out what to say. The file is there, and it goes.
        </P>
        <P>
          And because a site with less running in it has less that can be broken
          into. Most of what happens to small websites happens to the software
          behind them, and the surest way to keep that software safe is not to
          be running it.
        </P>
        <P>
          None of which makes it the right answer every time. It makes it the
          right place to start, and it puts the burden on the moving part to
          justify itself rather than on the plain page to defend itself.
        </P>
      </Sect>

      <Sect title="Questions people ask us">
        <P>
          <b>Is my site slow because of the technology?</b> Sometimes, and less
          often than people expect. More often it is the pictures - too many,
          too large, and sent at full size to a phone. That is worth checking
          before anything gets rebuilt.
        </P>
        <P>
          <b>Can I still edit it myself?</b> Yes. Building in advance decides
          when the page is made, not who writes the words. You edit, and the
          page rebuilds itself.
        </P>
        <P>
          <b>Do I need WordPress?</b> Only if you need what it does. It is a
          good answer for a site with many authors and a great deal of
          frequently changing content, and an expensive answer for a site of
          eight pages that changes twice a year.
        </P>
        <P>
          <b>Which will you use for mine?</b> We will tell you before we build
          anything, in writing, and we will say why. If the answer is that your
          site needs a program running behind it, we would rather say so than
          sell you something simpler that will not do the job.
        </P>
      </Sect>
    </>
  );
}

/* --------------------------------------------------------------- why shopify */

/**
 * Why we build shops on Shopify, and what else we work with.
 *
 * Prose, like the rest of them. The comparison that was a set of cards is a run
 * of paragraphs now: a platform is not a specification sheet, it is a position,
 * and a position is argued rather than tabulated.
 */
function WhyShopify() {
  return (
    <>
      <Lede>
        When we build you an online shop, our starting position is Shopify. Here
        is why, what the alternatives actually are, and the three situations
        where we would tell you to do something else.
      </Lede>

      <Sect title="The honest answer first">
        <P>
          There are two reasons, and the first one is about us rather than about
          you. We work with Shopify continuously. That means the hours you pay
          for go into your shop rather than into us learning a platform, and it
          means the awkward parts are ones we have already met.
        </P>
        <P>
          The second reason is about the platform. For shops of the size we
          build, it is the option where the most things work on the first day
          and the fewest need looking after afterwards. Payments, tax, delivery
          rates, receipts, refunds, the emails a customer expects at each step -
          all of it is there and stays there.
        </P>
        <P>
          Neither reason makes it the answer to every shop. If you already run
          one somewhere else, or a system in your business already owns your
          stock, your orders or your accounts, we would rather connect to what
          you have than replace it.
        </P>
      </Sect>

      <Sect title="What a shop gets on day one">
        <P>
          A product catalogue with variants and stock. A basket and a checkout
          that people already recognise, which matters more than it sounds:
          nobody abandons a checkout for being familiar. Card payments and the
          wallets a phone offers. Delivery rates, tax, and the receipts and
          notifications that go out without anyone remembering to send them.
        </P>
        <P>
          The costs are worth understanding before anybody builds anything. You
          pay a monthly platform fee and a small percentage of each card
          payment. Any apps you add carry their own monthly fees, and that is
          one of the things we watch on your behalf, because a shop can quietly
          accumulate app costs that outgrow the platform fee itself.
        </P>
      </Sect>

      <Sect title="The alternatives, in plain words">
        <P>
          WooCommerce is a shop built into WordPress. It is flexible and the
          software is free, and neither of those is the same as cheap: it is a
          program on a server, so it has to be updated, secured and paid for
          whether or not anything sells.
        </P>
        <P>
          A payment page is not a shop at all, and for a great many businesses
          it is the right answer. If you sell a service, take a deposit, or have
          a handful of products, you need a page that describes the thing and a
          way to pay for it - not a catalogue, a basket and a stock system.
        </P>
        <P>
          A marketplace is somebody else&rsquo;s shop with your products in it.
          It brings customers you would not otherwise reach, and it keeps them.
          It is worth having alongside your own shop and worth thinking hard
          about as a replacement for one.
        </P>
        <P>
          Building the shop from nothing is possible and almost never wise. Every
          part of it - tax, delivery, fraud, refunds, the emails - is a solved
          problem somebody maintains for you, and writing your own means
          maintaining all of it yourself, forever.
        </P>
      </Sect>

      <Sect title="When we would say something else">
        <P>
          Three situations, honestly held. If a system in your business already
          owns the record - your stock, your orders, your customers - then the
          shop should connect to it rather than become a second version of it.
          Two systems that both believe they know your stock is a problem you
          will be solving for years.
        </P>
        <P>
          If what you sell is a service, a booking or a single thing, a payment
          page in your own site does the job with none of the monthly cost and
          none of the machinery.
        </P>
        <P>
          And if you sell digital products to customers abroad, the tax rules
          are the whole difficulty. There are providers who take on being the
          seller of record so that problem is theirs rather than yours, and that
          is a better answer than any shop platform.
        </P>
        <P>
          What we will not do is recommend a platform because it is the one we
          know. If the honest answer is that you need less than we would usually
          build, that is the answer you will get.
        </P>
      </Sect>

      <Sect title="If you already have a shop">
        <P>
          Nothing about your current shop is a problem if it is the thing that
          proves the business works. A shop that takes money every day is
          evidence, and evidence is worth more than a tidier platform.
        </P>
        <P>
          Moving one is a job with its own care. Your customers, your order
          history, your reviews and the addresses search engines already know
          all have to come with you, or be deliberately retired. Done carelessly
          it costs you the rankings you spent years earning.
        </P>
        <P>
          So when you scope a shop with us, one of the early questions is simply
          whether you are selling already. Everything about a move follows from
          that answer rather than from an assumption.
        </P>
      </Sect>
    </>
  );
}

/* --------------------------------------------------- selling online options */

/**
 * The real question is what you are selling, not which software to pick.
 *
 * Prose. The five terms were a glossary table and the platforms were named
 * rows; both are now written out, because the piece is an argument about asking
 * a better first question, and a table answers the worse one faster.
 */
function SellingOnline() {
  return (
    <>
      <Lede>
        Selling online is not one thing. A shop, a paid download, a booking with
        a deposit, a subscription, a donation - each needs different machinery,
        and most need far less than a full shop. Name what you are selling and
        the right machinery follows.
      </Lede>

      <Sect title="The words, translated">
        <P>
          Five terms cover almost everything you will hear, and none of them
          needs to be mysterious.
        </P>
        <P>
          A payment provider is who takes the card and moves the money. A
          merchant of record is whoever is legally the seller, which decides who
          owes the tax - and for digital goods sold abroad that is the whole
          question rather than a detail.
        </P>
        <P>
          A shop platform is the catalogue, the basket and the checkout. A
          payment page is a single page that takes one payment for one thing,
          with none of that around it. And a subscription is any payment that
          repeats, which sounds simple until somebody wants to pause, change
          plan or be refunded halfway through a month.
        </P>
      </Sect>

      <Sect title="What are you selling?">
        <P>
          People arrive at this decision backwards. They have heard of a
          platform and they ask whether they need it. The better first question
          is what the sale actually is, because the answer sorts most of the
          decision on its own.
        </P>
        <P>
          Physical goods need a catalogue, stock, delivery and returns - that is
          a shop, and it is the case where a shop platform earns its fee.
          Digital downloads need entitlement rather than stock: who is allowed to
          download this, for how long, and how do they get it again when the
          link expires.
        </P>
        <P>
          A service at a fixed price needs a page that describes it and a way to
          pay. Time needs a diary that knows what is already taken. A membership
          needs a register of who is in and until when. A donation needs to take
          money and, in the UK, to capture a Gift Aid declaration properly.
        </P>
        <P>
          Read that list and notice how few of them are shops.
        </P>
      </Sect>

      <Sect title="Ways of selling that change the picture">
        <P>
          Some things cut across all of it. Selling to other businesses brings
          accounts, credit terms and prices that differ by customer. Selling
          abroad brings tax rules that depend on where the buyer is. Selling
          something made to order means the order carries instructions, and the
          instructions have to reach whoever makes it.
        </P>
        <P>
          Any one of these can matter more than the platform choice, because
          each adds rules that have to live somewhere. Naming them early is what
          stops a shop being rebuilt six months in.
        </P>
      </Sect>

      <Sect title="The platforms, by the job they do">
        <P>
          For a shop with stock, Shopify. For a service, a deposit or a handful
          of products, a payment page in your own site. For time or a place, a
          booking platform connected to the site rather than a diary written
          from nothing. For digital products sold abroad, a merchant of record,
          because the tax problem is worth handing to somebody whose business it
          is.
        </P>
        <P>
          Most businesses that think they need a shop need a payment page and a
          good page about what they do.
        </P>
      </Sect>

      <Sect title="Where we would start">
        <P>
          With the sale, not the software. What is being bought, who is buying
          it, and what has to happen after the money arrives. Those three
          answers pick the platform between them, and they pick it more reliably
          than a comparison of features nobody will use.
        </P>
        <P>
          None of it is a lock-in. A payment page can become a shop later, and
          the work done on the page describing what you sell is not wasted when
          it does - that page is the part customers actually read.
        </P>
      </Sect>

      <Sect title="Questions people ask us">
        <P>
          <b>Do I need a shop to sell one thing?</b> No. One thing needs one
          page and one way to pay for it.
        </P>
        <P>
          <b>Can I take payments without a platform fee?</b> Yes - a payment page
          costs you the card percentage and nothing monthly. What you give up is
          the catalogue and the stock, which you may not need.
        </P>
        <P>
          <b>What about selling abroad?</b> Ask about tax before you ask about
          anything else. For digital goods it is the decision; for physical
          goods it is usually simpler than people fear.
        </P>
        <P>
          <b>Can I change my mind later?</b> Yes, and it costs less than being
          on the wrong thing for two years. Moving is a real job, which is why
          the first question is worth getting right.
        </P>
      </Sect>
    </>
  );
}

/* ----------------------------------------------------- systems behind selling */

/**
 * Behind every sale there are three systems, and one should be yours.
 *
 * The shortest of the four and the one that suffered most from being arranged:
 * it is a single claim with a consequence, and a claim reads as a claim only
 * when it is allowed to run on.
 */
function SystemsBehind() {
  return (
    <>
      <Lede>
        Behind every sale online there are three systems: the one that shows the
        thing, the one that takes the money, and the one that keeps the record.
        One of them should be yours.
      </Lede>

      <Sect title="The three systems">
        <P>
          The first is the window. It is the pages a customer reads, the
          pictures, the descriptions, the way the thing is presented. It can be
          redesigned whenever you like, and redesigning it changes nothing
          underneath.
        </P>
        <P>
          The second is the till. It takes the card, handles the tax, and sends
          the money to your bank. Providers can be swapped, and swapping one is
          an afternoon of work rather than a rebuild.
        </P>
        <P>
          The third is the record: who bought what, when, for how much, what
          they are owed, what you still owe them. It is the one nobody names,
          and it is the one that has to be yours.
        </P>
        <P>
          Windows can be redesigned and payment providers can be changed. A
          record you cannot get out of is a business you cannot move.
        </P>
      </Sect>

      <Sect title="What each kind of sale needs">
        <P>
          A shop needs a catalogue, stock, orders, delivery and returns held
          together, and ready-made platforms hold all of it well.
        </P>
        <P>
          Downloads need entitlement - order to permission, expiring links, a
          log of what was taken and a way back in to take it again. Almost
          nothing ready-made keeps that record properly, which is why it is
          usually built.
        </P>
        <P>
          Memberships need a register: who, which plan, what status, which
          period, what it entitles them to. Donations need a supporter record,
          the state of recurring gifts, and a Gift Aid trail that will stand up
          when somebody checks it.
        </P>
        <P>
          Bookings need availability and cancellation rules, and that market is
          crowded and good - we would connect to a diary rather than write one.
          Quoted work needs enquiry, pipeline, proposal and invoice, which is
          either a CRM you already run or a thing built to fit how you actually
          work.
        </P>
      </Sect>

      <Sect title="What Omadeas is">
        <P>
          Omadeas is our own system, and it exists for the third of those three:
          the record. Where a business needs orders, customers, stock or jobs
          held somewhere that is genuinely its own - rather than inside a
          platform it rents - it is what we reach for.
        </P>
        <P>
          It is not a shop and it is not a payment provider, and we would not
          sell it to you in place of either. It matters here only because the
          third system is the one nobody names, and naming it is the point of
          this page.
        </P>
      </Sect>

      <Sect title="Questions people ask us">
        <P>
          <b>Is my data not already mine?</b> Legally, usually. Practically, it
          depends entirely on whether you can get it out in a form that is any
          use somewhere else.
        </P>
        <P>
          <b>Does this mean building everything?</b> No, and we would argue
          against it. Use the window and the till the market sells. It is the
          record that is worth owning.
        </P>
        <P>
          <b>What if I am small?</b> Then most of this does not apply yet, and
          the useful version of it is simply to know which of the three you are
          renting, so that the day it matters you are not finding out.
        </P>
      </Sect>
    </>
  );
}

const BODIES: Record<string, () => React.ReactElement> = {
  "how-your-website-is-made": HowItIsMade,
  "why-shopify": WhyShopify,
  "selling-online-options": SellingOnline,
  "systems-behind-selling": SystemsBehind,
};

export function ArticleBody({ slug }: { slug: string }) {
  const Body = BODIES[slug];
  return Body ? <Body /> : null;
}
