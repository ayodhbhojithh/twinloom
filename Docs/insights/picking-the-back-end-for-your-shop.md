# Picking the back end for selling online

**URL:** /insights/picking-the-back-end-for-your-shop
**Last updated:** [[NEEDS: publication date]]

Selling online means choosing what runs behind the checkout. That choice ranges from a payment link on an ordinary page through to a system built for you, and most businesses land somewhere in the middle.

This sets out the options, what each is good for, and the questions that decide between them. Where you already run something that works, we would rather connect to it than replace it.

## What selling online can cover

Different things being sold need different things held. This is not the full list, but it covers most of what we are asked for.

| What you sell | What has to be held |
|---|---|
| **Physical goods**, a full shop | Catalogue, stock, orders, delivery, returns, tax |
| **Bookings and appointments** | An availability engine and cancellation rules |
| **Software products** | The product's own billing, or a merchant of record |
| **Fixed-price services** | A payment, a receipt, and what happens next |
| **Tracked downloads** | Order to entitlement, expiring links, a download log, and a way back in to download it again |
| **Memberships**, gyms, clubs | A member registry: who, which plan, what status, which period, what it entitles them to, and the check-ins |
| **Donations** and friends-of schemes | A supporter registry, the state of recurring gifts, Gift Aid declarations and claims, and acknowledgements |
| **Quoted projects** | Enquiry, pipeline, proposal, invoice |

Plenty of businesses need more than one of these at once, and plenty need something not on this list. It is a starting point for the conversation rather than a menu.

## The options

**Payment links.** A payment provider gives you a link or a button per product, dropped onto an ordinary website. Stripe, PayPal and Square all offer this.

**A hosted commerce platform.** You rent a complete system - products, checkout, payments, tax, orders, shipping. Shopify is the most widely used; BigCommerce, Squarespace Commerce, Wix Commerce and Ecwid cover similar ground with different strengths.

**Commerce added to a content system.** Most often WooCommerce on WordPress.

**Headless.** A commerce platform runs the back end and a separately built storefront talks to it.

**Marketplaces.** Etsy, Amazon and eBay, either instead of your own shop or alongside it.

**Something built for you.** Where nothing ready-made holds what you need, TwinCoreTech builds it. That is covered separately in [what TwinCoreTech can build](/insights/what-twincoretech-can-build).

## If you are selling physical goods

This is the most common case and the one with a clear answer, so it is worth setting out the alternatives properly.

**Payment links.** Fine for a handful of products and a few orders a week. No real stock control, no order management, no growth path.

**A hosted commerce platform.** This is what we normally use. A monthly fee and a cost per sale, and you work within its model.

**Commerce added to a content system.** Sensible when publishing is the main event and the shop is secondary. You take on the maintenance, the security patching and the plugin conflicts.

**Headless.** Worth it when the design or content demands something the platform will not accommodate. More to build, more to maintain, more that can break.

Our default is the hosted platform, and in practice that usually means Shopify. Card details never touch your website, which sharply reduces what you are responsible for under the card industry's security rules, and the account is in your name with your products, orders and customers exportable.

It stops being the right answer when the product does not behave like a product - complex configuration, quoting, made-to-order with dependencies - or when you find yourself paying for a dozen add-ons to make it do something it was never shaped for. That is usually the signal that something custom belongs behind it.

### Pay attention to the cost per sale, not just the monthly fee

A hosted platform has two costs, and the smaller one is the one people compare.

The **monthly fee** is visible, fixed, and easy to weigh up. The **cost per sale** is the one that scales with you, and on any decent trading volume it becomes much the larger number.

Cost per sale has two parts. The first is card processing, which you pay whatever you build on - every payment provider charges a percentage plus a few pence. The second is specific to Shopify and worth understanding before you choose: **if you take payments through a provider other than Shopify Payments, Shopify adds its own fee on top of what your provider already charges.** That fee is waived when you use Shopify Payments, Shop Pay or PayPal Express.

Both the processing rate and that additional fee fall as you move up the plans, which produces a crossover point: above a certain monthly turnover, a more expensive plan is genuinely cheaper. The arithmetic is worth doing against your own expected volume rather than assuming the entry plan is the economical one. It also means the plan you start on is rarely the plan you should stay on.

Published rates change, so treat any figure you read as indicative and check the current position before committing. What does not change is the shape: a monthly fee, a processing percentage, and a further percentage if you pay through anyone other than the platform's own provider.

The same discipline applies to the alternatives. Commerce on a content system has no platform fee per sale, but you carry hosting, maintenance and security patching instead - the cost moves rather than disappears. Payment links avoid a monthly fee entirely and give you nothing to run a real shop with. There is no option here without a cost per sale; there are only options where you can see it and options where you cannot.

## Bookings, memberships and everything else

For bookings there is a crowded and capable ready-made market, and we would normally connect to one rather than build a diary you can buy.

For memberships, tracked downloads, donations with Gift Aid, and quoted project pipelines, the ready-made market is thinner. Payment is well covered; what is often missing is the record underneath - who is entitled to what, until when, and what happened. Where that gap matters to how you actually run, it is worth looking at something built rather than assembled from add-ons.

## Payments

Cards, Apple Pay and Google Pay come as standard, handled by an established payment provider. Your customers' card details never touch your website.

Beyond that, all optional: PayPal for people who would rather not type a card in; instalments through Klarna or Clearpay at the checkout; repeat payments for subscriptions and memberships, taken on the same day each time and always run by the provider rather than built; direct debit for money that comes in every month; and paying on account for customers who need it, where invoices stay in the accounting system that already runs them.

## Working with what you already run

Most businesses coming to us are already running something - a till, an accounting package, a booking diary, a customer list, a stock system. Replacing those is rarely the right answer and never the first suggestion.

Where a system publishes a way to connect to it, we connect to it. Where it does not, we look at what is realistic before promising anything, because some systems genuinely cannot be reached from outside. And where you are running something built for you already, we work alongside it.

## The eight questions that turn up late

None of these has to be settled before you start, and "not sure yet" is a real answer to every one. They are here because they are the ones that surface halfway through a build and cost money when they do.

1. **Tax beyond UK VAT.** Selling into other countries changes the checkout, not the shop.
2. **Stock in more than one place.** One shelf is a number. Two shelves is a system.
3. **Selling in other channels.** A marketplace or a social shop wants the same product list, kept in step.
4. **The till.** If you sell in a room as well as online, the two have to agree about stock.
5. **Who packs and sends.** It changes what the site has to tell somebody after they have paid.
6. **The systems you already run.** Accounts, stock, email, a customer list. Naming them now saves the discovery later.
7. **What comes across from a shop you already have.** Products, customers, orders and web addresses each migrate differently.
8. **Trade terms.** Only if some customers pay on account.

## What moving later actually costs

Products and customers usually move. Orders usually move in a reduced form. What tends not to move cleanly: **reviews**, unless the review provider is separate from the platform and portable, which is worth choosing for on day one because reviews are years of accumulated work; **subscriptions**, which often have to be recreated and re-authorised by the customer; **URLs**, which need careful redirecting or you lose the search visibility the old shop earned; and **discount and loyalty history**, which is frequently platform-specific.

None of that makes moving impossible. It makes it a project, which is why the back end is the decision to take slowly and the storefront is the one you can revisit.

## When you should not build a shop at all

When you have very few products and payment links on an ordinary page would do. When your customers genuinely buy through a marketplace and your own shop would take orders you are already getting more cheaply elsewhere. When what you sell is a service that needs a conversation, and a checkout would only remove the conversation.

A shop is an operational commitment, not a page.

## How we work this out with you

We look at what you sell, what you already run, and where the volume is. Then we say which of the options above fits, and why the others do not. If what you have works, we connect to it. If a ready-made platform covers it, we use one. If nothing does, TwinCoreTech builds it.

That conversation happens before anything is priced.

## Questions worth asking before you commit

- Does anything ready-made cover what I sell, or only take the payment?
- Where will the truth about my stock live, and what has to agree with it?
- What happens to an order between the customer paying and the parcel leaving?
- What will this cost per month, and what will it cost per sale?
- If I want to leave in three years, what comes with me and what does not?
- What am I being asked to do manually, every day, for as long as I run this?

---

If you are weighing this up, [send us your requirements](#) - tell us what you sell and where you sell it, in as little or as much detail as you like.

---

## Not for publication

**Rewritten to remove an invented doctrine.** An earlier draft opened with "there is one rule behind every back end decision we make" and framed the whole article around it. Nobody had said that. The underlying data was real; the doctrine around it was manufactured. This version states the same facts without claiming a philosophy.

**Sources.** The table is `A9_TYPES` in `v5_data.py`, using the first two columns only and presented as a starting point rather than a complete list. The eight late questions are the `L3` layer-three topics in order. Payments is `A3_PAY` and `A3_PAY_STATED` verbatim.

**Platform names added.** Stripe, PayPal, Square, Shopify, BigCommerce, Squarespace Commerce, Wix Commerce, Ecwid, WooCommerce, Etsy, Amazon, eBay. These are stated as what exists in the market, not as an evaluated shortlist, because I do not know which you have assessed. If you have a considered view on any of them, saying so would strengthen the section.

**The cost-per-sale section was checked before publishing, August 2026.** Shopify's own help centre confirms the structure: third-party transaction fees are waived for orders processed through Shopify Payments, Shop Pay, Shop Pay Installments, PayPal Express Checkout and manual payment methods, and the rate for third-party charges varies by plan. Third-party sources current at June 2026 put the additional fee at roughly 2 per cent on Basic, 1 per cent on Shopify and 0.5 per cent on Advanced, with online card processing around 2.2, 1.9 and 1.6 per cent plus a fixed fee respectively.

**No figures are printed in the article, deliberately.** Published rates move, and a number in an insight piece becomes a claim you have to maintain and a client can quote back. The section states the structure - which is stable - and tells the reader to check current rates. If you would rather show the numbers, they can go in with a "correct as at" date, but they will need reviewing every few months.

**The custom build story is not here.** It has moved to a companion article on what TwinCoreTech can build. This one links to it once.

Delete this section before publishing.
