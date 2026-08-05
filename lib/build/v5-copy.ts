/* ---------------------------------------------------------------------------
   What each step says.

   The prototype's own words, lifted rather than rewritten: the standfirst, the
   layer mark, the body, the headings and their notes, the notes set underneath,
   the "something else in your own words" box, what the finished site shows back
   because of this step, and what the step needs before somebody can stop at it.

   Held as data because twelve step components each carrying their own paragraph
   soup is twelve places for the wording to drift from the source. The controls
   are written in the step files; the prose is here.
--------------------------------------------------------------------------- */

export interface StepCopy {
  /** The standfirst under the title. */
  lead: string;
  /** Which layer of the question this is. */
  lay: string[];
  /** Body copy, in order. */
  says: string[];
  /** Headings that carry a note, as [title, note]. */
  sh4: [string, string][];
  /** Every heading in the step, in order, including the ones with no note. */
  heads: string[];
  /** Notes set underneath an answer. */
  und: string[];
  /** What the finished site shows back because of this step. */
  stback: string;
  /** What this step needs before you can stop at it. */
  stop: string;
  /** Somewhere to say the thing the step did not ask. */
  miss: { id: string; label: string; ph: string }[];
  /** Filled asides, as [label, body]. */
  build: [string, string][];
}

export const STEP_COPY: Record<string, StepCopy> = {
 "arrive": {
  "lead": "Read what this is, how long it takes, and that you can stop whenever you like.",
  "lay": [],
  "says": [
   "Twelve steps, two of which you will be through in a minute, and only two of them compulsory. Nothing here is priced, nothing here is scored, and no answer you give locks anything in. At the end you read the whole thing back and decide whether to send it.",
   "Every question here asks about your business. What we do with the answer is ours to work out, and you never have to think about it.",
   "Leave anything you like. An unanswered question is written down as an assumption, in its own section, so you can see exactly what we filled in and correct it.",
   "The eleven things every website includes, on a page of their own."
  ],
  "sh4": [
   [
    "What every website includes",
    "Eleven things, on every website we build. None of it is optional, none of it is an extra, and none of it is on a list for you to choose from. It is the floor."
   ],
   [
    "What you get back",
    "A written scope, in your words, inside two working days. It is a description of a website, not a quote, and nothing in it carries a figure."
   ]
  ],
  "heads": [
   "What every website includes",
   "What you get back"
  ],
  "und": [
   "Everything you answer from here adds to that floor. It never replaces any of it, and it never takes any of it away. Your answers stay where they are while you read it."
  ],
  "stback": "The eleven things every website includes, on a page of their own.",
  "stop": "Nothing.",
  "miss": [],
  "build": [
   [
    "Written out on its own page",
    "It is set out in full under What every website includes, so it is a thing you can read on its own and send to somebody else rather than something you have to scroll past to get started.Read what every website includes"
   ]
  ]
 },
 "layout": {
  "lead": "Click through six wireframes and pick one, or skip it.",
  "lay": [
   "Layer one"
  ],
  "says": [
   "Six shapes. Click the one that looks closest to the site in your head. It is a starting point for the first drawing, not a decision, and it can be changed at any point without anything else moving.",
   "The layout named in the running panel."
  ],
  "sh4": [],
  "heads": [],
  "und": [
   "None of these is better than the others, and none of them costs more than the others. If two look right, pick either and say so in the box below."
  ],
  "stback": "The layout named in the running panel.",
  "stop": "Nothing. A preference is not a price.",
  "miss": [
   {
    "id": "layout-own",
    "label": "Something else - tell us in your own words.",
    "ph": "The shape you have in mind"
   }
  ],
  "build": []
 },
 "who": {
  "lead": "Pick the groups the site is for, and add any we have not listed.",
  "lay": [
   "Layer one"
  ],
  "says": [
   "This is the question the rest of the site is built from. Everything on the next step is put there by what you tick here, so nothing is ever on offer that nobody asked for.",
   "A way in for each group, once more than one is named."
  ],
  "sh4": [],
  "heads": [],
  "und": [
   "A group you name adds one way in, and only once you have named more than one. Name a single group and the whole site is for them, so it needs no signposting.",
   "What you add carries no weight. A group you write yourself never puts a page on the site by itself. It goes on the list of things to talk about, in your words, and we come back to it."
  ],
  "stback": "A way in for each group, once more than one is named.",
  "stop": "At least one group, unless you sent it as a quick submission.",
  "miss": [
   {
    "id": "who-own",
    "label": "Somebody else - tell us in your own words.",
    "ph": "Who else comes to your website"
   }
  ],
  "build": []
 },
 "do": {
  "lead": "Three are already ticked. Add the rest, band by band, with a band for each group you named, then put them in the order you want them met.",
  "lay": [
   "Layer one, with layer two behind six of the rows"
  ],
  "says": [
   "The first two bands are already settled and are not yours to decide. Two more start ticked because most sites want them, so change them if yours does not. Everything under that was put there by the groups you named, and a row with Detail beside it has a short set of questions behind it, opened only when the answer would change what gets built.",
   "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap.",
   "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap.",
   "Each action that needs a screen puts one on the sitemap, and the home page leads on whatever you put first."
  ],
  "sh4": [],
  "heads": [],
  "und": [
   "The middle column is the whole point of this screen. A tick does not move a price; it puts a screen on your site, and the column says which one.",
   "Leaving this alone is a real answer. If you leave it we choose the order, and your document says plainly that we chose it and what we chose."
  ],
  "stback": "Each action that needs a screen puts one on the sitemap, and the home page leads on whatever you put first.",
  "stop": "Nothing beyond the step before.",
  "miss": [
   {
    "id": "do-own",
    "label": "Something else - tell us in your own words.",
    "ph": "Anything else a visitor should be able to do"
   }
  ],
  "build": []
 },
 "sell": {
  "lead": "Only appears if buying was picked. Layer one is what you sell and roughly how much of it.",
  "lay": [
   "Layer one, layer two behind each kind, and layer three underneath"
  ],
  "says": [
   "This step only appears because you said people can buy something. The first list is what you sell. The second is how the money arrives. The well at the bottom is the part that turns up late on every shop we have ever built, which is exactly why it is here early.",
   "Cards, Apple Pay and Google Pay come as standard, handled by an established payment provider. Your customers' card details never touch your website."
  ],
  "sh4": [
   [
    "How are you selling today",
    "It changes what has to move across, and what can simply start."
   ]
  ],
  "heads": [
   "How are you selling today",
   "How people pay"
  ],
  "und": [],
  "stback": "",
  "stop": "Nothing.",
  "miss": [
   {
    "id": "sell-own",
    "label": "Something else - tell us in your own words.",
    "ph": "What else you sell"
   },
   {
    "id": "pay-own",
    "label": "Something else - tell us in your own words.",
    "ph": "How else people pay you"
   }
  ],
  "build": []
 },
 "style": {
  "lead": "Say how it should feel, give a colour direction, and point at sites you like.",
  "lay": [
   "Layer one, with layer two behind three of the answers"
  ],
  "says": [
   "Nothing on this step puts a page on your site. It changes how the pages you have already described look, and it is the one part of the whole run-through where you are allowed to answer with a feeling rather than a fact."
  ],
  "sh4": [
   [
    "Colour",
    "Four honest starting points. The last one is a good answer and a common one."
   ]
  ],
  "heads": [
   "Colour"
  ],
  "und": [],
  "stback": "",
  "stop": "Nothing.",
  "miss": [
   {
    "id": "feel-own",
    "label": "Something else - tell us in your own words.",
    "ph": "How else it should feel"
   }
  ],
  "build": []
 },
 "have": {
  "lead": "A logo, photographs, words, a domain, a business email, a site that exists now.",
  "lay": [
   "Layer one, with one shared detail behind it"
  ],
  "says": [
   "Three answers per row, and the middle one is the honest one most of the time. Every row you mark as needing help either removes a question from later on or names something we would bring a specialist partner in for, said out loud rather than assumed."
  ],
  "sh4": [
   [
    "When a row needs tidying, or needs us",
    "One short card, shared by every row above, so the same two questions are never asked thirteen times."
   ]
  ],
  "heads": [
   "Before anything can go live",
   "The look",
   "The words",
   "What is running now",
   "When a row needs tidying, or needs us"
  ],
  "und": [],
  "stback": "",
  "stop": "Nothing.",
  "miss": [],
  "build": []
 },
 "refs": {
  "lead": "Open the side panel at any point and add notes, files, screenshots and websites you like.",
  "lay": [
   "Not a layer at all - it runs alongside every step"
  ],
  "says": [
   "The side panel is open the whole way through. Anything you put in it is tied to the question you were standing on when you added it, so it turns up in the document under that answer rather than in a pile at the end. Anything with nothing to tie it to sits under General, which is a real place rather than a bin.",
   "A count on the panel tab, and each item shown against the answer it belongs to."
  ],
  "sh4": [
   [
    "Everything you have put down, wherever you put it",
    "The panel and this step are the same list seen twice, in the same way the sitemap is. Anything typed into an \"in your own words\" box anywhere in the journey, and anything you said you would send us, is already here."
   ]
  ],
  "heads": [
   "Everything you have put down, wherever you put it"
  ],
  "und": [
   "The panel tab carries a count and nothing else. It is not a score, there is no number you are aiming at, and an empty panel is a complete answer."
  ],
  "stback": "A count on the panel tab, and each item shown against the answer it belongs to.",
  "stop": "Nothing.",
  "miss": [
   {
    "id": "ref-add",
    "label": "Write it, paste it, or name the file.",
    "ph": "A sentence, a link, or the name of a file"
   }
  ],
  "build": []
 },
 "read": {
  "lead": "Read the whole thing back: what is complete, what is still outstanding, and everything you sent us folded in where it belongs.",
  "lay": [
   "Layer one, layer two and layer three, all in one place"
  ],
  "says": [
   "The whole thing, written out. Every area says whether it is complete or still outstanding, what you told us, what we would assume if you left it there, and everything you sent us against it.",
   "Zones appear as you answer. A screen that two answers would have asked for keeps its first home and does not turn up twice.",
   "Area by area, with your notes, files, images and websites under the answers they were written against."
  ],
  "sh4": [
   [
    "And what the document itself contains",
    "Eight sections, in this order, every time."
   ]
  ],
  "heads": [
   "And what the document itself contains"
  ],
  "und": [
   "Unanswered means assumed, and it says so. Line by line, in your own document, kept apart from the things you actually told us."
  ],
  "stback": "Area by area, with your notes, files, images and websites under the answers they were written against.",
  "stop": "Nothing.",
  "miss": [],
  "build": []
 },
 "asking": {
  "lead": "Your name, your company, the part you play in the decision, and an email address.",
  "lay": [
   "Four compulsory fields, and two that are not"
  ],
  "says": [
   "Everything before this was about the website. This is the only part about you, and it is the only part you cannot skip.",
   "Nothing shown back yet."
  ],
  "sh4": [],
  "heads": [],
  "und": [
   "The part you play is never shown back to you as a grade. It decides who here picks the request up and how long the first call should be, and that is all it does."
  ],
  "stback": "Nothing shown back yet.",
  "stop": "Nothing.",
  "miss": [],
  "build": []
 },
 "keep": {
  "lead": "Register in one press, using the address you have just given, or do not.",
  "lay": [
   "One press, and nothing behind it"
  ],
  "says": [
   "Registering saves what you have written and gives you a way back in to change it. It uses the address you gave on the step before, it sets no password, and it changes nothing about the request itself.",
   "A reference, and a way back in."
  ],
  "sh4": [],
  "heads": [],
  "und": [
   "We never ask for a password on this screen. The way back in is a link sent to the address you have already given us, and either answer sends exactly the same request."
  ],
  "stback": "A reference, and a way back in.",
  "stop": "The email address you have already given.",
  "miss": [],
  "build": []
 },
 "submit": {
  "lead": "Press send. Everything before this is already written down.",
  "lay": [
   "The only compulsory part, and it starts here"
  ],
  "says": [
   "You can send this at any point. What changes is not whether the button works - it is what we can do with what arrives.",
   "Everything in your notes panel is sent with this, filed under the question it was written against. Nothing there is required, and nothing there is checked against anything.",
   "Where your request has reached, where it sits in how we work, and what happens next.",
   "What you have made is a scope, not a quote. Nothing in it is priced, and no number in it is a number we bill from. The price comes at step seven, against this document, in writing."
  ],
  "sh4": [
   [
    "Where you are in how we work",
    "Thirteen steps, from the run-through you have just done to the end of early life support. You are on the second one."
   ],
   [
    "When shall we talk it through",
    "Half an hour, at step four. Three answers, and the third one is not a failure."
   ],
   [
    "What you have, and what it is not",
    "A scope. It describes a website well enough for anybody to build it, and it carries no figure at all."
   ]
  ],
  "heads": [
   "Where you are in how we work",
   "When shall we talk it through",
   "What you have, and what it is not"
  ],
  "und": [
   "Nothing on this screen is a score. Three named states, and the things still missing said in words with a link straight to the question. No bar, no percentage, no grade.",
   "This is a list of thirteen things and a mark against one of them. It is not a bar, it does not fill up, and nothing here moves on its own - it moves when a person here does something and tells you.",
   "We come back within two working days whichever you pick. If you booked a slot, the document is with you before it.",
   "Your document stays yours. If you take it somewhere else and have the work built there, it still describes the site properly, and that is a fine outcome."
  ],
  "stback": "Where your request has reached, where it sits in how we work, and what happens next.",
  "stop": "Nothing.",
  "miss": [],
  "build": []
 }
,
 "org": {
   "lead": "What the organisation is, and the field it works in.",
   "lay": [],
   "says": [
     "Everything else on the build follows this. One site with one identity, one site with a section each, and separate sites are three different builds, and the argument about who updates what arrives either way.",
     "The industry is not a category for a form. It is what tells us the stock is perishable, or that the goods are oversized, or that somebody is checking - before anybody has to explain it."
   ],
   "sh4": [
     [
       "What kind of organisation",
       "Seven of them, and the one you pick opens a second layer of its own."
     ],
     [
       "The field you work in",
       "Fifty-five to choose from, grouped. What it implies is shown back to you rather than kept."
     ]
   ],
   "heads": [
     "What kind of organisation",
     "The field you work in"
   ],
   "und": [],
   "stback": "The organisation named at the top of the document, and the field it works in with what that field brings with it.",
   "stop": "Nothing. Leave it and we take it from the rest of your answers, and ask on the call.",
   "miss": [
     {
       "id": "org-own",
       "label": "Something else",
       "ph": "Tell us in your own words."
     }
   ],
   "build": []
 },
 "widgets": {
   "lead": "The working parts that sit inside a page.",
   "lay": [],
   "says": [
     "A calculator, a map, a chat window, a feed, a search, a form that does something more than send an email. If you already know what you want here, name it. If you do not, leave it: none of it changes the shape of the site.",
     "The list you pick from is being put together with the people who build these. Until it is here, anything you write below is read exactly as though you had ticked it."
   ],
   "sh4": [
     [
       "The working parts inside a page",
       "Named here, or described in your own words. Both arrive the same way."
     ]
   ],
   "heads": [
     "The working parts inside a page"
   ],
   "und": [],
   "stback": "Each one named in the panel and listed in the document.",
   "stop": "Nothing. Leave it and we assume nothing beyond the standard inclusions sits inside a page.",
   "miss": [
     {
       "id": "widgets-own",
       "label": "Tell us what it has to do",
       "ph": "A calculator that works out what a job costs, a map of where you deliver, a search that reads your stock."
     }
   ],
   "build": []
 },
 "systems": {
   "lead": "The systems the website has to talk to, and who holds the record.",
   "lay": [],
   "says": [
     "One row for each kind of thing you sell. Tick the ones that are true. A ticked row asks one more question underneath it, and nothing here is priced.",
     "Two of these we would not build. You can buy a booking diary and a shop platform, and buying one is better than paying us to write another. The rest we would, because nothing ready-made keeps the record properly."
   ],
   "sh4": [
     [
       "What the website has to keep a record of",
       "What a record has to hold, what the market sells for it, and what we would therefore do."
     ],
     [
       "What it has to join to",
       "The things already running that the website has to agree with."
     ]
   ],
   "heads": [
     "What the website has to keep a record of",
     "What it has to join to"
   ],
   "und": [],
   "stback": "Each record named, with who holds it today, and everything the site has to join to.",
   "stop": "Nothing. Leave it and we assume the website stands on its own and joins to nothing.",
   "miss": [
     {
       "id": "systems-own",
       "label": "Something else it has to talk to",
       "ph": "Name it, and what it is called."
     }
   ],
   "build": []
 },
};
