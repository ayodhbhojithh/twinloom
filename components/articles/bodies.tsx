import { Ask, Cards, Figures, Lede, P, Points, Pull, Sect, Terms } from "./kit";

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

function HowItIsMade() {
  return (
    <>
      <Lede>
        Every website a visitor sees is plain HTML, and has been since the web
        began. What separates one website technology from another is a single
        question: when does that HTML get made, and by what?
      </Lede>

      <Sect n={1} title="The only thing a browser reads is HTML">
        <P>
          A browser receives an HTML file and draws the page from it. Every
          website on earth works this way, so the real difference between
          technologies is not what the visitor receives. It is when the HTML gets
          made. There are two answers.
        </P>

        <Cards
          cards={[
            {
              mark: "At the moment of the visit",
              name: "A program builds the page there and then",
              note: "WordPress is the best known. Flexible, because the page can differ for every visitor - but it is software running on a server that has to be updated, secured and paid for whether or not anything changed.",
            },
            {
              mark: "Once, in advance",
              name: "The pages are built ahead as ordinary files",
              note: "The server's only job is to hand them over. Nothing runs when a visitor arrives, so there is nothing to break into or keep patched, and the page arrives as fast as a file can be sent.",
            },
          ]}
        />

        <P>
          The trade is honest in both directions. A page built in advance cannot
          change by itself, so updating it means rebuilding - which suits pages
          that change weekly, and does not suit a page showing live stock. We
          build in advance unless a site has a reason to need otherwise.
        </P>
      </Sect>

      <Sect n={2} title="The names, at their moments">
        <P>
          The names that fill up website conversations do different jobs at
          different moments. Put each at its own moment and the conversation gets
          much shorter.
        </P>

        <Terms
          rows={[
            {
              term: "WordPress",
              text: "Builds the page when the visitor asks for it, and gives your team somewhere to write.",
              when: "Right when people publish often and want to do it themselves.",
            },
            {
              term: "Astro",
              text: "Builds the pages in advance, then gets out of the way. The result is files.",
              when: "Right for a site that is read far more often than it is edited.",
            },
            {
              term: "React",
              text: "Runs in the browser after the page has arrived, for the parts that have to respond.",
              when: "Right for the piece that moves, not for the page around it.",
            },
            {
              term: "Node",
              text: "Runs on a server, for work that cannot happen in a browser: taking a payment, checking a password, talking to a system that holds your data.",
              when: "Right when something has to be done somewhere the visitor cannot reach.",
            },
          ]}
        />
      </Sect>

      <Sect n={3} title="Where the moving parts come from">
        <P>
          A menu that opens, a gallery that slides, a form that checks itself
          before it is sent: none of that is the page arriving, it is code
          running in the browser afterwards. It is worth knowing because it is
          the part that costs a visitor time on a slow connection.
        </P>

        <Pull>
          The page should be readable before anything runs. What runs after
          should be the parts that genuinely have to move.
        </Pull>

        <P>
          That is a decision made per feature rather than per site. A carousel
          that could be three pictures in a row usually should be.
        </P>
      </Sect>

      <Sect n={4} title="When a server does enter the picture">
        <P>
          Some work cannot happen in a browser, because a browser belongs to the
          visitor. Anything that has to be trusted has to happen somewhere else.
        </P>

        <Points
          items={[
            "Taking a payment",
            "Checking who somebody is",
            "Reading or writing your business records",
            "Sending an email you did not want faked",
            "Anything with a secret in it",
          ]}
        />

        <P>
          A site built in advance can still do all of this. The pages stay
          files, and the few things that need a server call one when they are
          used, rather than the whole site depending on one being up.
        </P>
      </Sect>

      <Sect n={5} title="Why we build this way">
        <P>
          Our default is pages made in advance, a browser given as little to run
          as the design allows, and a server involved only where something has to
          be trusted. That is not a preference about tools. It follows from what
          each part costs to keep running once we have gone.
        </P>

        <Figures
          items={[
            {
              n: "0",
              label: "To patch",
              note: "Nothing is running between visits, so there is nothing to keep updated against attack.",
            },
            {
              n: "1",
              label: "Job at request time",
              note: "Hand over a file. That is the whole of what happens when somebody arrives.",
            },
            {
              n: "∞",
              label: "Ways out",
              note: "The output is ordinary files and ordinary content, which any other supplier can host.",
            },
          ]}
        />
      </Sect>

      <Sect n={6} title="Questions people ask us">
        <Ask
          rows={[
            {
              q: "Is a static site limited?",
              a: "Not in what a visitor can do. Forms, payments, bookings and search all work; the difference is that the parts needing a server call one when used rather than the whole site running on one.",
            },
            {
              q: "Can my team still edit it?",
              a: "Yes. The writing happens in a content system your team logs into, and the site rebuilds from what they publish. What they do not get is the ability to dismantle the layout by accident.",
            },
            {
              q: "Is WordPress wrong, then?",
              a: "No. It is the right answer when a business publishes constantly and wants the whole thing in one place. It is the wrong answer when nobody wants to think about updates again.",
            },
            {
              q: "What happens if you disappear?",
              a: "The pages are files and the content is yours, in a system in your name. Any competent supplier can pick it up. That is a property of the arrangement rather than a promise from us.",
            },
          ]}
        />
      </Sect>
    </>
  );
}

/* --------------------------------------------------------------- why shopify */

function WhyShopify() {
  return (
    <>
      <Lede>
        When we build you an online shop, our starting position is Shopify. Here
        is why, what the alternatives actually are, and the three situations
        where we would tell you to do something else.
      </Lede>

      <Sect n={1} title="The honest answer first">
        <P>
          There are two reasons, and the first is about us: we work with Shopify
          continuously, so the time you pay for goes into your shop rather than
          into us learning a platform. The second is about the platform. For
          shops of the size we build, it is the option where the most things work
          on day one and the fewest need looking after afterwards.
        </P>

        <P>
          Neither reason makes it the answer to every shop. Where you already run
          one elsewhere, or a system in your business already owns your stock,
          your orders or your accounts, we would rather connect to what you have
          than replace it.
        </P>
      </Sect>

      <Sect n={2} title="What a shop gets on day one">
        <Points
          items={[
            "Checkout, card and wallet payments",
            "VAT handling and delivery settings",
            "Order emails and stock counts",
            "Hosting, patching and uptime",
            "Established apps for the rest",
            "Security around all of it",
          ]}
        />

        <P>
          The costs are worth understanding before anyone builds anything. You
          pay a monthly platform fee and a small percentage of each card payment,
          and any apps you add carry their own monthly fees - which is one of the
          things we watch on your behalf, because a shop can quietly accumulate
          app costs that outgrow the platform fee.
        </P>

        <Figures
          items={[
            {
              n: "£25-65",
              label: "A month, plus VAT",
              note: "The plans most of our clients use. Indicative; Shopify's own pricing page is the current word.",
            },
            {
              n: "1.7-2%",
              label: "Plus 25p a card payment",
              note: "On the plans at that level, at the time of writing.",
            },
            {
              n: "0",
              label: "Servers of yours",
              note: "The platform is hosted, patched and kept up by Shopify rather than by you.",
            },
          ]}
        />
      </Sect>

      <Sect n={3} title="The alternatives, in plain words">
        <Terms
          rows={[
            {
              term: "WooCommerce",
              text: "Turns a WordPress website into a shop. The software is free, which is the headline, but you then own the hosting, the security, the updates and the way the pieces fit - yourself or by paying someone.",
              when: "Right where a business already lives in WordPress and somebody looks after the site anyway.",
            },
            {
              term: "BigCommerce",
              text: "The closest thing to Shopify in shape: hosted, capable, with strong business-to-business features built in rather than added on. Plans move up with your sales volume.",
              when: "Worth talking about seriously for a shop that is heavily business-to-business from the start.",
            },
            {
              term: "Wix and Squarespace",
              text: "Website builders with shops attached. For a small catalogue where the website matters more than the shop, entirely adequate.",
              when: "The ceiling arrives quickly: delivery rules, tax beyond the basics and getting your data out are all harder than they should be.",
            },
            {
              term: "EKM, ShopWired and Bluepark",
              text: "The British platforms, and they deserve to be better known. Hosted, priced in pounds plus VAT, and they answer the phone in the UK.",
              when: "Reasonable where a support relationship matters more than an ecosystem. Their app and theme ranges are far smaller.",
            },
            {
              term: "Square Online and Ecwid",
              text: "For the smallest shops: a till that also sells online, or a shop bolted onto an existing website.",
              when: "Genuinely useful at that size. Not where you want to be once delivery rules and multiple channels arrive.",
            },
            {
              term: "Adobe Commerce, and built from parts",
              text: "At the other end. Large retailers with development teams, or a shop assembled from a separate checkout, product system and front end.",
              when: "Powerful, and priced accordingly in both money and attention. If you are asking whether you need it, you almost certainly do not.",
            },
          ]}
        />
      </Sect>

      <Sect n={4} title="When we would say something else">
        <P>Three situations, honestly held.</P>

        <Cards
          cards={[
            {
              mark: "01",
              name: "A system already owns the numbers",
              note: "If your stock, orders or accounts live in a system that runs the rest of the business, the shop should read from it rather than argue with it. Keeping your platform and connecting to it usually beats moving anything.",
            },
            {
              mark: "02",
              name: "You are deeply invested in WordPress",
              note: "If your team publishes constantly, your processes live in WordPress and somebody maintains it, WooCommerce keeps everything in one place - and we will build that.",
            },
            {
              mark: "03",
              name: "The shop is a small part of the website",
              note: "Where the site is the point and the shop is a corner of it, a builder with a shop attached, or a small shop embedded in the site we build, can be the proportionate answer.",
            },
          ]}
        />

        <Pull>
          What we will not do is recommend a platform because it is the one we
          know.
        </Pull>
      </Sect>

      <Sect n={5} title="If you already have a shop">
        <P>
          Moving a shop is a job with its own care: your customers, orders,
          reviews and the addresses search engines already know all have to come
          with you, or be deliberately retired. Nothing about your current shop is
          a problem if it is the thing that proves the business works.
        </P>

        <P>
          When you scope a shop with us, one early question is simply whether you
          are selling already, and everything about a move flows from that answer
          rather than from an assumption.
        </P>
      </Sect>
    </>
  );
}

/* ------------------------------------------------------- selling online options */

function SellingOnline() {
  return (
    <>
      <Lede>
        Selling online is not one thing. A shop, a paid download, a booking with
        a deposit, a subscription, a donation: each needs different machinery,
        and most need far less than a full shop. Name what you are selling and
        the right machinery follows.
      </Lede>

      <Sect n={1} title="The words, translated">
        <P>
          Five terms cover almost everything you will hear, and none of them
          needs to be mysterious.
        </P>

        <Terms
          rows={[
            {
              term: "Hosted shop platform",
              text: "The supplier runs the software, the security and the checkout; you rent it monthly. Shopify is the best known.",
              when: "You want a shop that is somebody's job to keep running, and that somebody is not you.",
            },
            {
              term: "Self-hosted, or open source",
              text: "The shop software is free; the hosting, updates and security are yours to own or to pay for. WooCommerce is the big one.",
              when: "Your business already lives in WordPress and somebody already looks after it.",
            },
            {
              term: "Payment page, or hosted checkout",
              text: "A page in your own website's design that takes a card payment for one thing. No catalogue, no basket, no stock.",
              when: "You sell a handful of things, a service, or take donations. Far smaller to build, and a shop can still be added later.",
            },
            {
              term: "Merchant of record",
              text: "A service that sells on your behalf. It is legally the seller, and it handles card fees, global VAT and invoicing for a cut.",
              when: "You sell software or digital products internationally and would rather not become a VAT expert in nine countries.",
            },
            {
              term: "Composable, or headless",
              text: "The shop assembled from separate parts - checkout, product system, front end - each chosen and connected.",
              when: "Large retailers with development teams. If you are asking whether you need it, you almost certainly do not.",
            },
          ]}
        />
      </Sect>

      <Sect n={2} title="What are you selling?">
        <P>
          People arrive at this decision backwards. They have heard of a platform
          and ask whether they need it. The better first question is what the sale
          actually is, because the answer sorts most of the decision on its own.
        </P>

        <Terms
          rows={[
            {
              term: "Physical things",
              text: "Stock, delivery, returns and tax by destination. This is the case a shop platform is built for, and the one where building it yourself is least worth it.",
            },
            {
              term: "Digital things",
              text: "No delivery, but licences, file delivery and VAT wherever the buyer is. A merchant of record earns its cut here.",
            },
            {
              term: "A service",
              text: "Often a deposit or a fixed fee rather than a basket. A payment page in your own site usually does it.",
            },
            {
              term: "Time, or a place",
              text: "Availability is the hard part, not the money. The booking system holds the rules; the website presents them.",
            },
            {
              term: "Something recurring",
              text: "Subscriptions bring failed payments, card expiry, pauses and cancellations. The machinery for that is a real decision, not an afterthought.",
            },
            {
              term: "Donations",
              text: "Gift Aid, one-off and regular giving, and the reporting that goes with them. Not a shop by any reading.",
            },
          ]}
        />
      </Sect>

      <Sect n={3} title="Ways of selling that change the picture">
        <Points
          items={[
            "Selling to businesses: accounts, price lists, quotes, purchase orders",
            "Selling in several countries: tax, currency, delivery, returns",
            "Selling on marketplaces as well as your own site",
            "Selling in person and online from one stock count",
            "Selling with a deposit now and the balance later",
          ]}
        />

        <P>
          Any one of these can matter more than the platform choice, because each
          adds rules that live somewhere. Naming them early is what stops a shop
          being rebuilt six months in.
        </P>
      </Sect>

      <Sect n={4} title="The platforms, by the job they do">
        <Cards
          cards={[
            {
              mark: "Shops",
              name: "Shopify, BigCommerce, WooCommerce",
              note: "Catalogue, basket, checkout, stock and delivery in one place. Right when the selling is the business.",
            },
            {
              mark: "Payments only",
              name: "Stripe, Square, GoCardless",
              note: "Take money for one thing without a catalogue. Right for services, deposits and a short list of products.",
            },
            {
              mark: "Digital goods",
              name: "Merchant of record services",
              note: "They become the seller and carry the tax. Right for software and downloads sold internationally.",
            },
            {
              mark: "Bookings",
              name: "Booking and scheduling platforms",
              note: "Availability, capacity, reminders and cancellation rules. The website shows the journey; the platform holds the rules.",
            },
          ]}
        />
      </Sect>

      <Sect n={5} title="Where we would start">
        <P>
          For a shop with stock, Shopify. For a service, a deposit or a handful of
          products, a payment page in your own site. For time or a place, a
          booking platform connected to the site. For digital products sold
          abroad, a merchant of record.
        </P>

        <Pull>
          Most businesses that think they need a shop need a payment page and a
          good page about what they do.
        </Pull>

        <P>
          None of those is a lock-in. A payment page can become a shop later, and
          the work done on the page describing what you sell is not wasted when
          it does.
        </P>
      </Sect>

      <Sect n={6} title="Questions people ask us">
        <Ask
          rows={[
            {
              q: "Can I start small and grow into a shop?",
              a: "Yes, and it is usually the right order. A payment page proves people will buy before you take on a catalogue, stock counts and delivery rules.",
            },
            {
              q: "Do I need a shop to take a deposit?",
              a: "No. A deposit is one payment for one thing, which a payment page handles without a basket anywhere near it.",
            },
            {
              q: "What about VAT in other countries?",
              a: "It depends what you sell and where the buyer is. For digital products sold internationally, a merchant of record exists precisely so that this is not your problem.",
            },
            {
              q: "Is my current platform a problem?",
              a: "Not by itself. If it is working, the useful question is what specifically it stops you doing - and quite often the answer is nothing that matters yet.",
            },
          ]}
        />
      </Sect>
    </>
  );
}

/* --------------------------------------------------- systems behind selling */

function SystemsBehind() {
  return (
    <>
      <Lede>
        Behind every sale online there are three systems: the one that shows the
        thing, the one that takes the money, and the one that keeps the record.
        One of them should be yours.
      </Lede>

      <Sect n={1} title="The three systems">
        <Cards
          cards={[
            {
              mark: "01",
              name: "The shop window",
              note: "What a customer sees: the pages, the pictures, the words and the way to the checkout. Usually your website.",
            },
            {
              mark: "02",
              name: "The money",
              note: "What takes the card, handles the fees and the refunds, and settles into your bank. Usually a payment provider.",
            },
            {
              mark: "03",
              name: "The record",
              note: "What knows the order happened: the customer, the stock, the invoice, the delivery. This is the one people forget to decide about.",
            },
          ]}
        />

        <Pull>
          The record is the one that has to be yours. Windows can be redesigned
          and payment providers changed; a record you cannot get out of is a
          business you cannot move.
        </Pull>
      </Sect>

      <Sect n={2} title="What each kind of sale needs">
        <Terms
          rows={[
            {
              term: "A shop with stock",
              text: "All three, and the platform usually provides two of them. What it does not provide is the connection to whatever runs the rest of your business.",
            },
            {
              term: "A service or a deposit",
              text: "A window and a payment provider. The record can be your ordinary systems, as long as somebody decided that rather than assumed it.",
            },
            {
              term: "A booking",
              text: "The booking platform is the record, and it is the one that must hold availability. The website presents it; it does not duplicate it.",
            },
            {
              term: "A subscription",
              text: "The record has to survive failed payments, card expiry and pauses, which is why this is the case where an afterthought hurts most.",
            },
          ]}
        />
      </Sect>

      <Sect n={3} title="What Omadeas is">
        <P>
          Omadeas is our own system, and it exists for the third of those three:
          the record. Where a business needs orders, customers, stock or jobs held
          somewhere that is genuinely its own - rather than inside a platform it
          rents - it is what we reach for.
        </P>

        <P>
          It is not a shop and it is not a payment provider, and we would not sell
          it to you in place of either. It matters here only because the third
          system is the one nobody names, and naming it is the point of this
          page.
        </P>
      </Sect>

      <Sect n={4} title="Questions people ask us">
        <Ask
          rows={[
            {
              q: "Can the three be one system?",
              a: "Often, and for a straightforward shop that is the sensible answer. The question is not how many systems there are, it is whether you can get your record out of whichever one holds it.",
            },
            {
              q: "How do I know if my record is trapped?",
              a: "Ask what an export contains and try one. A platform that exports customers, orders and products in full is one you can leave; a platform where the export is a summary is not.",
            },
            {
              q: "Do I need this before I start selling?",
              a: "No. You need to have decided it, which takes a conversation rather than a project. The cost of not deciding arrives later, when moving is expensive.",
            },
          ]}
        />
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
