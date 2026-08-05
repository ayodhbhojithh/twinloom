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
 * The whole of the draft, prose throughout. The one thing that was a table -
 * seven names, what each is, when it runs and what it means for you - is seven
 * paragraphs instead. Nothing is dropped: each row's four cells are all here,
 * in the order the table had them. A table earns its place when a reader scans
 * across it comparing values, and nobody compares "when it runs" across seven
 * rows; they look up the one name they were sold this week.
 */
function HowItIsMade() {
  return (
    <>
      <Lede>
        Every website a visitor sees is plain HTML - that has been true
        since the web began. What separates one website technology from another
        is a single question: when does that HTML get made, and by what?
      </Lede>

      <Sect title="The only thing a browser reads is HTML">
        <P>
          Website conversations fill up with names - WordPress, Astro,
          React, Node - and it is rarely explained that these things do
          different jobs at different moments. This page puts each one at its
          moment, so the next time a name comes up you know which part of your
          website it actually touches.
        </P>
        <P>
          When someone visits your site, their browser receives an HTML file and
          draws the page from it. Every website on earth works this way. So the
          real difference between website technologies is not what the visitor
          receives - it is when and how that HTML gets made. There are two
          broad answers.
        </P>
        <P>
          <b>Made at the moment of the visit.</b> A program runs on the server,
          and when a visitor asks for a page, the program builds it there and
          then. WordPress is the best-known example. It is flexible - the
          page can be different for every visitor - but it means software
          running on a server that must be updated, secured, maintained and paid
          for, whether or not anything on the site has changed.
        </P>
        <P>
          <b>Made once, in advance.</b> The pages are built ahead of time, as
          ordinary files, and the server&rsquo;s only job is to hand them over.
          Nothing runs when a visitor arrives; there is nothing on the server to
          break into or keep patched; and the page arrives as fast as a file can
          be sent. This is called a static website, and it is how we build
          unless a site has a reason to need otherwise.
        </P>
        <P>
          The trade is honest in both directions. A static page cannot change by
          itself - updating it means rebuilding and re-uploading, which
          suits pages that change weekly, not secondly. And anything genuinely
          dynamic - an account someone signs into, an order, a saved
          answer - needs a separate service behind the site. The point is
          not that one approach wins; it is that most pages on most business
          websites are the same for every visitor, and paying for
          made-at-the-moment machinery to serve unchanging pages is buying
          flexibility nobody uses.
        </P>
      </Sect>

      <Sect title="The names, at their moments">
        <P>
          <b>HTML</b> is the finished page, as every browser reads it. It runs
          at the visit, because it is what arrives. It is the only thing your
          visitors ever receive.
        </P>
        <P>
          <b>A static site generator</b> - ours is Astro - is a
          program that reads page templates and writes the finished HTML. It
          runs at build time, before anything is published. Your pages exist as
          files; nothing generates them per visit.
        </P>
        <P>
          <b>An .astro file</b> is a template: a recipe for one page, in the
          site&rsquo;s shared design. It is read at build time and never sent to
          a browser. Editing a page means editing its template and rebuilding.
        </P>
        <P>
          <b>Node.js</b> is the program that lets build tools run on an ordinary
          computer. It runs at build time only, on the building machine. It
          never runs on your live site, so there is nothing of it to maintain
          there.
        </P>
        <P>
          <b>JavaScript in the page</b> is code that runs in the visitor&rsquo;s
          browser after the page arrives - after load, on their device.
          This is how a static page can still be interactive.
        </P>
        <P>
          <b>React</b> is a library for building complex interactive interfaces
          in the browser. It runs after load, where it is used, and only where
          it is used. It is worth it when interactivity gets complex; it is not
          a requirement for interactivity.
        </P>
        <P>
          <b>A backend, or server</b> is a separate service that receives and
          stores data. It runs at the visit, but only for the pages that need
          it. Accounts, orders and saved answers live here - added when
          needed, not before.
        </P>
      </Sect>

      <Sect title="Where interactivity comes from">
        <P>
          A static page is not a frozen page. JavaScript written into the page
          runs in the visitor&rsquo;s browser and can do a great deal:
          calculators, pickers, panels that respond as you answer. None of that
          needs a server, and none of it needs React - plain JavaScript
          inside the page covers more than most business sites ever ask of it.
        </P>
        <P>
          React earns its place when the interactive parts of a site grow
          complex enough that plain JavaScript becomes hard to keep correct
 - many moving parts that must stay in step with each other. That
          is a judgement about maintainability, not a requirement for
          interactivity, and &ldquo;built in React&rdquo; is not by itself a
          mark of quality. A site can be excellent with none of it.
        </P>
      </Sect>

      <Sect title="When a server does enter the picture">
        <P>
          Three things a folder of files cannot do: remember, receive, and
          restrict. The moment a website needs to remember a visitor (accounts,
          saved progress), receive something from them beyond an email (orders,
          uploads, payments), or restrict who sees what (a members&rsquo; area),
          a service running somewhere becomes part of the picture - a
          small backend, a booking system, a shop platform or a payment
          provider, depending on the job.
        </P>
        <P>
          The craft is keeping that machinery proportionate: the public pages
          stay static and fast, and the running service exists only for the part
          that needs it. A brochure site with a booking page does not need to
          become a WordPress install; it needs a folder of pages and one
          connected booking journey.
        </P>
      </Sect>

      <Sect title="Why we build this way">
        <P>
          Speed, because a ready-made file beats a page assembled on demand, and
          speed is measured in visitors who stay. Security, because a server
          running no software offers nothing to attack - the commonest way
          small-business sites are compromised is unpatched plugins on
          made-at-the-moment platforms. Cost, because hosting files is close to
          free, and there is no stack of software licences or update work to pay
          for monthly. And ownership, because a folder of HTML is the most
          portable thing on the web - any host will serve it, and no
          supplier can hold it hostage.
        </P>
        <P>
          The honest limits, stated as plainly: content edits go through a
          rebuild, so if your team needs to publish daily without us, we connect
          a publishing system - that decision has its own page. And
          anything transactional needs its services connected deliberately,
          which is exactly what our scoping journey maps.
        </P>
      </Sect>

      <Sect title="Questions people ask us">
        <P>
          <b>Is a static website worse than WordPress?</b> It is different, not
          lesser. WordPress builds pages at the moment of the visit, which suits
          sites where many people publish constantly. A static site serves
          ready-made pages, which suits sites where speed, security and low
          running cost matter more. Most small-business websites are the second
          kind.
        </P>
        <P>
          <b>Can a static website have interactive features?</b> Yes. JavaScript
          runs in the visitor&rsquo;s browser after the page loads, so
          calculators, configurators and responsive panels all work on a static
          site. What needs more than that - accounts, orders, saved
          progress - is handled by a connected service, not by abandoning
          the static site.
        </P>
        <P>
          <b>Do I need React for a modern website?</b> No. React is one way of
          managing complex interactivity, useful when there is complex
          interactivity to manage. A site is not more modern for including it,
          and page speed usually favours less of it.
        </P>
        <P>
          <b>What happens when I want to change a page?</b> The page&rsquo;s
          template is edited, the site is rebuilt - a step that takes
          moments - and the fresh pages are published. Under a care plan
          that is our job; if your team publishes frequently themselves, we
          connect a publishing system so they never wait on us.
        </P>
        <P>
          <b>Who owns the website you build?</b> You do - and a static
          site makes that unusually clean: the finished site is a folder of
          ordinary files that any host can serve and any competent developer can
          pick up. The written handover names everything and where it lives.
        </P>
      </Sect>
    </>
  );
}

/**
 * Why we build shops on Shopify, and what else we work with.
 *
 * The draft in full, prose throughout. The bolded platform names are the
 * draft's own emphasis and they carry the structure on their own - each one
 * opens its paragraph, which is what a reader scanning for the platform they
 * have been sold is looking for.
 *
 * The back-of-house section is not here and should not be: it is a note to us
 * about sources and house rules, and the draft says it comes off before
 * publication. The indicative figures inside the piece are kept, with their
 * "at the time of writing" wording intact, because a price without that
 * wording is a promise.
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
          There are two reasons, and the first one is simply about us: we work
          with Shopify continuously across our projects, which means the time
          you pay for goes into your shop rather than into us learning a
          platform. The second is about the platform: for most shops of the size
          we build, it is the option where the most things work on day one and
          the fewest things need looking after afterwards.
        </P>
        <P>
          Neither reason makes Shopify the answer to every shop. Where you
          already run a shop somewhere else, or a system in your business
          already owns your stock, your orders or your accounts, we would rather
          connect to what you have than replace it. The rest of this page
          explains the choices in plain words, so you can see the same picture
          we see.
        </P>
      </Sect>

      <Sect title="What Shopify gives a shop from day one">
        <P>
          The checkout, card and wallet payments, VAT handling, delivery
          settings, order emails, stock counts and the security around all of it
          come as part of the platform rather than as things to assemble.
          Shopify hosts the shop, keeps it patched and takes responsibility for
          it staying up. When you need something beyond the standard - 
          subscriptions, product reviews, a connection to your accounting
          package - there is usually an established app for it rather than
          custom work.
        </P>
        <P>
          The costs are worth understanding before anyone builds anything. You
          pay Shopify a monthly fee for the platform, and a small percentage of
          each card payment. At the time of writing the plans most of our
          clients use are roughly &pound;25 to &pound;65 a month plus VAT, with
          card fees around 1.7 to 2 per cent plus 25p on the plans at that
          level. Those figures are indicative and Shopify&rsquo;s own pricing
          page is the current word. Apps you add carry their own monthly fees,
          which is one of the things we watch on your behalf - a shop can
          quietly accumulate app costs that outgrow the platform fee.
        </P>
      </Sect>

      <Sect title="The alternatives, in plain words">
        <P>
          <b>WooCommerce</b> turns a WordPress website into a shop. The software
          itself is free, which is the headline, but you then own the hosting,
          the security, the updates and the way the pieces fit together - 
          either yourself or by paying someone to. It is the right answer when a
          business already lives in WordPress, publishes a great deal, and has
          someone looking after the site anyway. It is the wrong answer when
          nobody wants to think about updates again.
        </P>
        <P>
          <b>BigCommerce</b> is the closest thing to Shopify in shape: hosted,
          capable, with strong features for selling to other businesses built in
          rather than added on. Its plans move up with your sales volume. We
          would talk about it seriously for a shop that is heavily
          business-to-business from the start.
        </P>
        <P>
          <b>Wix and Squarespace</b> are website builders with shops attached.
          For a small catalogue where the website matters more than the shop
 - a studio selling a dozen pieces, a venue selling vouchers
 - they can be entirely adequate. The ceiling arrives quickly:
          delivery rules, tax beyond the basics, connections to other systems
          and moving your data out are all harder than they should be.
        </P>
        <P>
          <b>EKM, ShopWired and Bluepark</b> are the British platforms, and they
          deserve to be better known. All three are hosted, priced in pounds
          plus VAT, and answer the phone in the UK - EKM in particular
          builds its offer around support, and ShopWired and Bluepark hold
          strong customer ratings. Their app and theme ecosystems are far
          smaller than Shopify&rsquo;s, which is the trade: better hand-holding,
          fewer ready-made pieces. For a shop that values a UK support
          relationship above an ecosystem, they are a reasonable home, and we
          are able to work with them.
        </P>
        <P>
          <b>Square Online and Ecwid</b> suit the smallest shops - a till
          that also sells online, or a shop bolted onto an existing website.
          Genuinely useful at that size; not where you want to be by the time
          delivery rules and multiple channels arrive.
        </P>
        <P>
          <b>Adobe Commerce, and shops built from parts</b> sit at the other
          end: platforms for large retailers with development teams, or shops
          assembled from a separate checkout, product system and front end.
          Powerful, and priced accordingly in both money and attention. If your
          requirements genuinely point there, we will say so - and we will
          also say what it costs to keep, because that is the part that
          surprises people.
        </P>
      </Sect>

      <Sect title="When we would suggest something other than Shopify">
        <P>
          Three situations, honestly held.
        </P>
        <P>
          <b>A system in your business already owns the numbers.</b> If your
          stock, orders or accounts live in a system that runs the rest of the
          business, the website should read from it rather than argue with it.
          That can mean keeping your current platform and connecting to it,
          rather than moving anything.
        </P>
        <P>
          <b>You are deeply invested in WordPress.</b> If your team publishes
          constantly, your processes live in WordPress and someone already
          maintains it, WooCommerce keeps everything in one place - and we
          will build there.
        </P>
        <P>
          <b>The shop is a small part of a bigger website.</b> Where the site is
          the point and the shop is a corner of it, a builder with a shop
          attached, or a small shop embedded in the site we build you, can be
          the proportionate answer.
        </P>
        <P>
          What we will not do is recommend a platform because it is the one we
          know. Shopify is our default because familiarity makes us efficient on
          your behalf - the moment your requirements point elsewhere, the
          requirements win.
        </P>
      </Sect>

      <Sect title="If you already have a shop">
        <P>
          Moving a shop is a job with its own care: your customers, orders,
          reviews and the addresses search engines already know all have to come
          with you or be deliberately retired. Nothing about your current shop
          is a problem - it is the thing that proves the business works.
          When you scope a shop with us, one early question is simply whether
          you are selling already, and everything about a move flows from that
          conversation rather than from an assumption.
        </P>
      </Sect>
    </>
  );
}

/* --------------------------------------------------- selling online options */

/**
 * The real question is what you are selling, not which software to pick.
 *
 * The longest of the four, and the one that was most nearly a spreadsheet: four
 * tables, thirty-one rows between them. All of it is here as prose, each row
 * keeping every cell it had.
 *
 * The draft's own conversion note says the tables would need a horizontal
 * scroll region on a phone, which is the tell. A four-column table nobody can
 * see all of at once is a table doing no work; the same content read as
 * sentences needs no scroll region, no header row to remember, and no decision
 * about which column to sacrifice at 390px.
 *
 * Not included: the back-of-house note and the SEO pack. Both say plainly that
 * they come off before publication, and the second is a set of Astro snippets
 * for a different site.
 */
function SellingOnline() {
  return (
    <>
      <Lede>
        Selling online is not one thing. A shop, a paid download, a booking with
        a deposit, a subscription, a donation - each needs different
        machinery, and most need far less than a full shop. Name what you are
        selling, and the right machinery follows.
      </Lede>

      <Sect title="The words, translated">
        <P>
          People arrive at this decision backwards. They have heard of a
          platform - usually Shopify - and ask whether they need it.
          The better first question is what the sale actually is, because the
          answer sorts most of the decision on its own. This page gives you the
          words, the options and where we would start for each, so you can come
          to any conversation - with us or anyone else - knowing
          what you are looking at.
        </P>
        <P>
          Five terms cover almost everything you will hear. None of them needs
          to be mysterious.
        </P>
        <P>
          <b>A hosted shop platform.</b> The supplier runs the software, the
          security and the checkout; you rent it monthly. Shopify is the
          best-known example. It matters when you want a shop that is
          somebody&rsquo;s job to keep running - and that somebody is not
          you.
        </P>
        <P>
          <b>Self-hosted, or open source.</b> The shop software is free; the
          hosting, updates and security are yours to own or pay someone to own.
          WooCommerce, which runs on WordPress, is the big one. It matters when
          your business already lives in WordPress and somebody already looks
          after it.
        </P>
        <P>
          <b>A payment page, or hosted checkout.</b> A page in your own
          website&rsquo;s design that takes a card payment for one thing - 
          no catalogue, no basket, no stock. It matters when you are selling a
          handful of things, a service, or taking donations. Far smaller to
          build than a shop, and a shop can still be added later.
        </P>
        <P>
          <b>A merchant of record.</b> A service that sells on your behalf
 - it is legally the seller, and it handles card fees, global VAT
          and invoicing for you, for a cut. Common for software. It matters when
          you sell software or digital products internationally and would rather
          not become a VAT expert in nine countries.
        </P>
        <P>
          <b>Composable, or headless commerce.</b> The shop assembled from
          separate parts - checkout, product system, front end - 
          each chosen and connected. It matters to large retailers with
          development teams. If you are asking whether you need it, you almost
          certainly do not.
        </P>
      </Sect>

      <Sect title="What are you selling?">
        <P>
          Eight kinds of sale cover nearly every business we meet. Each one says
          what the sale actually needs, and where we would start.
        </P>
        <P>
          <b>Physical goods, posted or delivered.</b> The sale needs a
          catalogue, a basket, stock counts, delivery rules and VAT at the
          checkout. We would start with a hosted shop platform - Shopify,
          unless your answers point elsewhere.
        </P>
        <P>
          <b>Digital downloads - files, courses, patterns.</b> The sale
          needs payment, then a secure download link. Nothing runs out, so there
          is no stock. We would start with a payment page for a handful of them,
          and a shop with digital delivery once there is a catalogue.
        </P>
        <P>
          <b>Software, or a product people subscribe to.</b> The sale needs a
          pricing page and a sign-up. The product bills itself - the
          website is the shop window. The website hands over to the
          product&rsquo;s own billing, or to a merchant of record. Never a shop.
        </P>
        <P>
          <b>Services at a fixed price.</b> The sale needs payment, and a clear
          what-happens-next. We would start with a payment page in the
          site&rsquo;s own design.
        </P>
        <P>
          <b>Time - appointments, classes, tables.</b> The sale needs a
          diary people book against, with payment or a deposit at booking. We
          would start with a booking system, with the rules for cancelling
          settled before launch.
        </P>
        <P>
          <b>Projects, quoted first.</b> The sale needs a quote form that asks
          only what prices the work, then a proposal, then an invoice. We would
          start with no online sale at all - a well-built enquiry journey,
          with a payment link for deposits.
        </P>
        <P>
          <b>Memberships, and paid content.</b> The sale needs recurring
          payment, and a signed-in area holding what members get. We would start
          with a payment page with recurring billing, plus a members&rsquo;
          sign-in.
        </P>
        <P>
          <b>Donations, and support.</b> The sale needs one-off and monthly
          giving, a receipt, and Gift Aid where it applies. A payment page.
          Never a shop.
        </P>
        <P>
          Two things run through all eight. First, only one of them needs a shop
          from day one. Second, none of them names a platform the visitor has to
          choose - what you sell decides, and the platform follows.
        </P>
      </Sect>

      <Sect title="Ways of selling that change the picture">
        <P>
          These are not things you sell - they are ways of selling that
          attach to the kinds above and change what the build needs. Worth
          knowing by name, because each one is a real piece of work.
        </P>
        <P>
          <b>Trade customers, buying on account</b> brings trade prices behind a
          sign-in, minimum quantities and invoicing terms. It is the largest
          single addition to a shop.
        </P>
        <P>
          <b>Subscriptions and repeat orders</b> bring stored cards, retries
          when a payment fails, and a portal to pause or cancel. Bigger than it
          looks.
        </P>
        <P>
          <b>Selling on marketplaces and social as well</b> means either linking
          out, which is cheap, or stock that agrees everywhere, which is not.
        </P>
        <P>
          <b>Selling in person as well</b> means a till and a website sharing
          one stock list, so neither sells what the other just sold.
        </P>
        <P>
          <b>Made to order, or personalised</b> brings options and custom text
          at the product; customers uploading artwork is the expensive version.
        </P>
        <P>
          <b>Age-restricted or regulated goods</b> raises which payment services
          will take you at all - settled before building, not after.
        </P>
        <P>
          <b>Selling abroad</b> brings currency and regions for goods; for
          digital things, foreign VAT arrives at the first sale, not at scale.
        </P>
      </Sect>

      <Sect title="The platform landscape, by role">
        <P>
          You do not need to study this. It exists so that when a name comes up
 - from us or anyone else - you can place it in thirty
          seconds.
        </P>
        <P>
          <b>Shopify</b> is the mainstream hosted platform, and it is best for
          most shops of most sizes: the most things working on day one, the
          fewest to look after. Worth knowing: a monthly fee plus a card
          percentage, and app costs that can quietly accumulate.
        </P>
        <P>
          <b>BigCommerce</b> is the like-for-like rival, best for heavily
          business-to-business shops. It has built-in trade features, and its
          plans step up with sales volume.
        </P>
        <P>
          <b>EKM, ShopWired and Bluepark</b> are the British platforms, best
          when you value UK phone support above a large app ecosystem. Priced in
          pounds plus VAT, with strong service reputations and smaller
          ecosystems.
        </P>
        <P>
          <b>WooCommerce</b> is the WordPress route, best when the business
          already lives in WordPress and somebody maintains it. The software is
          free; the ownership is not.
        </P>
        <P>
          <b>Wix and Squarespace</b> are the site builders with shops, best for
          a dozen products where the website matters more than the shop. The
          ceiling arrives quickly: delivery rules, integrations, and moving your
          data out.
        </P>
        <P>
          <b>Square Online and Ecwid</b> are the smallest tier, best for a till
          that also sells online or a small shop bolted onto an existing site.
          Genuinely useful at that size; outgrown once channels multiply.
        </P>
        <P>
          <b>Adobe Commerce and composable builds</b> are the enterprise end,
          best for large catalogues, development teams and unusual requirements.
          Priced accordingly in money and attention - we will say so if
          your requirements point here.
        </P>
        <P>
          <b>Stripe-class checkouts</b> are payment pages, best for downloads,
          services, deposits and donations. They are the whole
          payments-without-a-shop tier.
        </P>
        <P>
          <b>GoCardless-class services</b> handle recurring by direct debit,
          best for memberships and invoicing on repeat. Direct debit costs less
          than cards for recurring.
        </P>
        <P>
          <b>Paddle and Lemon Squeezy</b> are merchants of record, best for
          selling software internationally. They become the seller and carry the
          global VAT burden.
        </P>
        <P>
          <b>Donorbox-class tools</b> handle donations, best for charities and
          supporter giving. Gift Aid capture and charity card rates are the
          details that matter.
        </P>
      </Sect>

      <Sect title="Our baseline, and why">
        <P>
          Our default position is Shopify, and the first reason is honestly
          about us: we work in it continuously across our projects, so the time
          you pay for goes into your shop rather than into us learning a
          platform. The second reason is about the platform: for most shops of
          the size we build, it is the option where the most things work on day
          one and the fewest things need looking after afterwards.
        </P>
        <P>
          A default is not a rule. Three situations move us off it, and we will
          say so in the proposal rather than bend your requirements to our
          habit: where a system in your business already owns the stock, the
          orders or the accounts, the website should read from it rather than
          argue with it - which can mean keeping what you have and
          connecting to it. Where your business already lives in WordPress with
          someone maintaining it, WooCommerce keeps everything in one place. And
          where the sale does not need a shop at all - most of the kinds
          above - a payment page, a booking system or a well-built enquiry
          journey is the proportionate answer, and costs a fraction of a shop.
        </P>
        <P>
          That is why our scoping journey never asks you to pick a platform. It
          asks what you would be selling, roughly how many, whether you sell
          already and whether your product list is ready - and the right
          route follows from your answers. The platform decision is our work to
          justify, in writing, in the proposal: the system, who owns the
          account, what it costs monthly with VAT treatment stated, and how you
          would leave it if you ever wanted to.
        </P>
      </Sect>

      <Sect title="Questions people ask us">
        <P>
          <b>Do I need Shopify to sell online?</b> Only if you need a shop
 - a catalogue people browse, a basket and stock. A handful of
          downloads, a donation, a service paid for online or a booking with a
          deposit can each be done with a payment page or a booking system in
          your own website&rsquo;s design, at a fraction of the cost, and a full
          shop can still be added later.
        </P>
        <P>
          <b>What is the difference between a shop and a payment page?</b> A
          shop holds a catalogue, a basket and stock counts, and needs delivery
          rules and VAT at the checkout. A payment page takes a card payment for
          one thing, in your own site&rsquo;s design, with a receipt - no
          catalogue, no basket, nothing to keep in stock.
        </P>
        <P>
          <b>Can I sell online without rebuilding my website?</b> Usually, yes.
          A payment page or booking journey can be added to an existing site,
          and where a system in your business already holds your stock or
          orders, the website can read from it rather than replace it.
        </P>
        <P>
          <b>We sell software - does any of this apply to us?</b> The shop
          part does not. Your product takes its own payments through its
          billing, or through a merchant of record that handles international
          VAT for you. Your website&rsquo;s job is the pricing page and the
          sign-up, and that is what we build.
        </P>
        <P>
          <b>Which platform will you recommend for us?</b> The one your answers
          point at, named in writing in the proposal along with who owns the
          account, what it costs monthly with VAT treatment stated, and how you
          would leave it if you ever wanted to. Our default for a full shop is
          Shopify; the article on why explains the honest reason.
        </P>
      </Sect>
    </>
  );
}

/* ----------------------------------------------------- systems behind selling */

/**
 * Behind every sale online there are three systems.
 *
 * The full draft. The eight-row table - what you sell, the records behind it,
 * the common answer today, where we would start - is eight paragraphs, each
 * carrying all four of its cells. The paragraph after it, about reading down
 * the last column, is rewritten to point at the pattern in the prose instead,
 * since there is no column to read down any more.
 *
 * The draft's cross-links are left as plain words. Two of them point at
 * `/advice/why-our-baseline-is-shopify/`, which its own back-of-house note
 * flags as a page that does not exist - and the equivalent here is a different
 * address again. A named link to nothing is worse than a sentence naming the
 * piece, and the piece is one row down in "Read next".
 */
function SystemsBehind() {
  return (
    <>
      <Lede>
        Take any sale on any website - a parcel, a download, a gym
        membership, a donation - and behind it you will find the same
        three systems: one that moves the money, one that keeps the records, and
        the website itself. Most selling advice talks only about the website.
        The records are where businesses get quietly locked in.
      </Lede>

      <Sect title="The three systems, in plain words">
        <P>
          <b>The money system</b> is a payment provider: it serves the card
          fields, holds the card details, runs recurring billing and retries.
          This is never your website&rsquo;s job and never ours - card
          details should not touch a small business&rsquo;s own systems, and in
          our builds they never do.
        </P>
        <P>
          <b>The records system</b> is the one nobody mentions. Somebody has to
          own the authoritative list: who bought which download and how many
          times they have fetched it; who is a member, on which plan, paid up or
          lapsed; who donated, how often, and whether a Gift Aid declaration was
          captured. The money system knows payments happened; it does not know
          what they <i>mean</i> for your business. That meaning lives in the
          records system - and whoever runs it holds your business&rsquo;s
          memory.
        </P>
        <P>
          <b>The website</b> is the part people see: the pages, the join
          journey, the member&rsquo;s sign-in area. It should read from the
          records system rather than try to be one.
        </P>
      </Sect>

      <Sect title="What each kind of sale needs behind it">
        <P>
          <b>Physical goods, a full shop.</b> The records behind it are the
          catalogue, stock, orders, deliveries and returns. The common answer
          today is Shopify, which handles all of it well, and that is where we
          would start - it is our baseline, and the piece explaining why
          is the honest version of that answer.
        </P>
        <P>
          <b>Digital downloads, tracked.</b> The records are who owns which
          file, download limits and secure re-download. The common answer today
          is scattered apps and plugins, and the records rarely belong to you.
          This is one to speak to us about Omadeas for.
        </P>
        <P>
          <b>Memberships - gyms, clubs, paid content.</b> The records are
          the member register: plan, status, what each tier gets, joins and
          lapses. The common answer is a patchwork of membership tools, each
          holding your register its own way. Again, speak to us about Omadeas.
        </P>
        <P>
          <b>Donations, and friends-of schemes.</b> The records are the
          supporter register, recurring gifts, and Gift Aid declarations and
          claims. The common answer is generic donation widgets, with Gift Aid
          often handled on spreadsheets. Speak to us about Omadeas.
        </P>
        <P>
          <b>Services paid online.</b> The record is what was paid for, in your
          books or your CRM. The common answer is a payment page plus your
          accounting package, and that is where we would start too - a
          payment page, with the record landing where you already work.
        </P>
        <P>
          <b>Bookings that take payment.</b> The record is the diary itself;
          availability is the record. The market of established booking systems
          is crowded and capable, so we would connect a booking system to your
          site rather than build one.
        </P>
        <P>
          <b>Quoted projects.</b> The records run from enquiry to proposal to
          invoice, and the common answer is your CRM and accounting package. We
          would start with a well-built enquiry journey that writes into them.
        </P>
        <P>
          <b>Software you make.</b> Your product&rsquo;s own billing holds
          everything, which is exactly as it should be. Your website does the
          shop window; we leave your billing alone.
        </P>
        <P>
          Read those eight again and the pattern shows itself: where a strong
          ready-made system exists, we say so and connect to it. The ones where
          we say speak to us about Omadeas are the ones where the ready-made
          market is weakest - and where the records matter most.
        </P>
      </Sect>

      <Sect title="What Omadeas is">
        <P>
          Omadeas is the business platform we build and run ourselves. It is a
          set of connected systems for the records a business has to own - 
          members and what their membership entitles them to, buyers and what
          they can download, supporters and their Gift Aid position, and the
          accounts behind all of it.
        </P>
        <P>
          Where your website needs one of those record systems, we can connect
          the site to Omadeas rather than adding another subscription that holds
          your records its own way. The website stays fast and simple; the
          records live in a system built around them; and the division of labour
          stays clean - the payment provider still moves the money and
          holds the card details, Omadeas holds the records, and your website
          reads from both.
        </P>
        <P>
          Two things we will always say plainly. Where a ready-made platform is
          the better answer - a full shop on Shopify being the clearest
          case - we will recommend it, because our reasons for that
          baseline are honest ones. And whatever holds your records, the
          proposal names it in writing: the system, who owns the account, what
          it costs monthly with VAT treatment stated, and how you would leave
          with your records if you ever wanted to. Records you cannot take with
          you were never really yours.
        </P>
      </Sect>

      <Sect title="Questions people ask us">
        <P>
          <b>Who holds the card details?</b> The payment provider, always
 - never your website, never us, never Omadeas. The card fields
          your customers type into are served by the provider, so you sit in the
          lightest compliance category there is.
        </P>
        <P>
          <b>What happens to our records if we stop working with you?</b> You
          take them. Exit is written into the proposal from day one: what you
          would export, in what form, and what any replacement provider would
          need. This applies to Omadeas exactly as it applies to Shopify or
          anything else.
        </P>
        <P>
          <b>Can the website track how many times someone downloads what they
          bought?</b> Yes - that is a records question. Each purchase
          creates an entitlement, each download is delivered by a secure
          expiring link and logged against it, and buyers get a sign-in area to
          fetch their files again without emailing you.
        </P>
        <P>
          <b>We run a gym - can members sign in and see their
          membership?</b> Yes. The payment provider runs the billing; the member
          register holds who is on which plan and what it entitles them to; and
          the sign-in area on your site reads from that register. When a payment
          fails, the register updates and access follows - automatically,
          with a named person told.
        </P>
        <P>
          <b>Is this instead of Shopify?</b> No - different jobs. A shop
          full of physical products belongs on a shop platform, and ours is
          Shopify by default. Omadeas enters where the sale is really a record
 - memberships, tracked downloads, supporters - and the
          guide to which kind of sale is which is the place to start.
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
