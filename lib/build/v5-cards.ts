/* ---------------------------------------------------------------------------
   The cards behind the rows.

   A row with "Detail" beside it opens a short set of questions, and there are
   nineteen of those cards holding sixty-two questions between them. They are
   data rather than markup for the reason the prototype gives them one shape:
   every card is a title, a note, some questions, a way to say something the
   card did not ask, and two ways on. Written out as components that would have
   been three thousand lines of the same six elements.

   Lifted from the v5.2 prototype, so every question, note and chip is its own.
   Em dashes are the one change: this site does not set them, so they are
   normal dashes here.

   Some cards are pointers. A question asked in two places is asked once, and
   the second place says where its home is rather than asking again.
--------------------------------------------------------------------------- */

/** One answer inside a question. */
export interface CardChip {
  v: string;
  label: string;
}

/** A colour, offered as a swatch rather than a word. */
export interface CardSwatch {
  q: string;
  v: string;
  hex: string;
  label: string;
}

/** A run of answers. `one` means choosing clears the rest. */
export interface CardGroup {
  one: boolean;
  /** Set on a group that promises to send something rather than answering. */
  label?: string;
  chips?: CardChip[];
  attach?: { key: string; label: string }[];
  swatches?: CardSwatch[];
  /** A pointer to the card where this question actually lives. */
  goto?: { to: string; label: string };
}

export interface CardQuestion {
  q: string;
  title: string;
  note: string;
  groups?: CardGroup[];
  textarea?: { rows: number; t: string; placeholder: string };
}

/** Somewhere to say the thing the card did not ask for. */
export interface CardMiss {
  id: string;
  label: string;
  placeholder: string;
}

/** Both ways out of a card, and both of them finished states. */
export interface CardFork {
  title: string;
  use: string;
  more: string;
  note: string;
}

export interface Card {
  id: string;
  key: string;
  title: string;
  note: string;
  /** "Layer two", or "One home" on a card that only points somewhere. */
  level: string;
  questions: CardQuestion[];
  miss?: CardMiss;
  fork?: CardFork;
}

export const CARDS: readonly Card[] = [
  {
    "id": "dw-book",
    "key": "book",
    "title": "Bookings",
    "note": "One home. Whether you reached this from what your visitors can do or from what you sell, it is the same card and we ask it once.",
    "level": "Layer two",
    "questions": [
      {
        "q": "book.what",
        "title": "What gets booked",
        "note": "A table, a person and a van are three different diaries.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "person",
                "label": "A person's time"
              },
              {
                "v": "place",
                "label": "A place or a table"
              },
              {
                "v": "class",
                "label": "A class or event with places"
              },
              {
                "v": "kit",
                "label": "Equipment or a vehicle"
              }
            ]
          }
        ]
      },
      {
        "q": "book.pay",
        "title": "Is anything paid at the time",
        "note": "Taking money at booking pulls the whole payment layer in.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "dep",
                "label": "A deposit"
              },
              {
                "v": "full",
                "label": "In full"
              }
            ]
          }
        ]
      },
      {
        "q": "book.many",
        "title": "One diary, or several",
        "note": "Several is the line between a form and a system.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One"
              },
              {
                "v": "few",
                "label": "A few people or resources"
              },
              {
                "v": "lots",
                "label": "A lot"
              }
            ]
          }
        ]
      },
      {
        "q": "book.cal",
        "title": "Does it talk to a calendar you already use",
        "note": "Double bookings are the failure everybody remembers.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "g",
                "label": "Google"
              },
              {
                "v": "ms",
                "label": "Microsoft"
              },
              {
                "v": "other",
                "label": "Something else"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "book.cal",
                "label": "Name the system"
              }
            ],
            "label": "Attach"
          }
        ]
      },
      {
        "q": "book.after",
        "title": "What is allowed after booking",
        "note": "Cancellation rules are a policy decision, not a setting.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "none",
                "label": "Nothing"
              },
              {
                "v": "cancel",
                "label": "Cancel"
              },
              {
                "v": "re",
                "label": "Reschedule"
              },
              {
                "v": "both",
                "label": "Both, with a cutoff"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "book-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-loc",
    "key": "loc",
    "title": "Where people come to you",
    "note": "This asks the fact. What we do with your Google profile, your reviews and what gets counted is a later question, and it stops asking whether there is a place at all.",
    "level": "Layer two",
    "questions": [
      {
        "q": "loc.how",
        "title": "How many places",
        "note": "One place is an address. A handful is a list. Many is a search, and a search is a different build.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One"
              },
              {
                "v": "few",
                "label": "A handful, and people pick the nearest"
              },
              {
                "v": "many",
                "label": "Many, and people need to search by where they are"
              }
            ]
          }
        ]
      },
      {
        "q": "loc.same",
        "title": "Do they all hold the same details",
        "note": "Different opening times per place is the thing that quietly doubles the work.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "same",
                "label": "The same everywhere"
              },
              {
                "v": "vary",
                "label": "Times and details vary by place"
              }
            ]
          }
        ]
      },
      {
        "q": "loc.keep",
        "title": "Who keeps them current",
        "note": "A list nobody owns is wrong within a season.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "you",
                "label": "Somebody on your side"
              },
              {
                "v": "us",
                "label": "We would like help"
              },
              {
                "v": "rare",
                "label": "They almost never change"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "loc.keep",
                "label": "Attach the list, if one exists"
              }
            ],
            "label": "Attach"
          }
        ]
      }
    ],
    "miss": {
      "id": "loc-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-signin",
    "key": "signin",
    "title": "Behind the sign-in",
    "note": "The same card whether it is your customers or your team. Whichever you picked first owns these questions; the other one only adds who it is for.",
    "level": "Layer two",
    "questions": [
      {
        "q": "signin.see",
        "title": "What do they see once they are in",
        "note": "This is the whole question. Everything behind a sign-in is built from the answer.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "docs",
                "label": "Their documents"
              },
              {
                "v": "orders",
                "label": "Their orders or history"
              },
              {
                "v": "data",
                "label": "Their own details, to keep current"
              },
              {
                "v": "content",
                "label": "Content only they can read"
              },
              {
                "v": "tools",
                "label": "Something they can do rather than read"
              }
            ]
          }
        ]
      },
      {
        "q": "signin.diff",
        "title": "Do different people see different things",
        "note": "One shared view is a page. Different views are a permission model, which is a different build.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "same",
                "label": "Everybody sees the same"
              },
              {
                "v": "roles",
                "label": "A few kinds of person, each with their own view"
              },
              {
                "v": "each",
                "label": "Everybody sees only their own"
              }
            ]
          }
        ]
      },
      {
        "q": "signin.off",
        "title": "How does access get removed",
        "note": "Getting somebody in is the easy half. Nobody specifies the other half until it matters.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "us",
                "label": "You tell us and we do it"
              },
              {
                "v": "you",
                "label": "Somebody on your side does it"
              },
              {
                "v": "auto",
                "label": "It expires on its own"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "signin-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-book-book-a-demo-or-a-meeting",
    "key": "book-book-a-demo-or-a-meeting",
    "title": "Bookings",
    "note": "Asked once, and it was asked under Book an appointment. Nothing here is missing; it is somewhere else.",
    "level": "One home",
    "questions": [
      {
        "q": "",
        "title": "It lives under Book an appointment",
        "note": "Open it there and the answer carries back to here, so the same question is never put to you twice.",
        "groups": [
          {
            "one": false,
            "goto": {
              "to": "dw-book",
              "label": "Take me to it"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "dw-signin-sign-in-to-a-staff-area",
    "key": "signin-sign-in-to-a-staff-area",
    "title": "Behind the sign-in",
    "note": "Asked once, and it was asked under Sign in and see their own things. Nothing here is missing; it is somewhere else.",
    "level": "One home",
    "questions": [
      {
        "q": "",
        "title": "It lives under Sign in and see their own things",
        "note": "Open it there and the answer carries back to here, so the same question is never put to you twice.",
        "groups": [
          {
            "one": false,
            "goto": {
              "to": "dw-signin",
              "label": "Take me to it"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "dw-verify",
    "key": "verify",
    "title": "Checking a credential",
    "note": "Usually a connection to a system you already run, rather than something built from nothing.",
    "level": "Layer two",
    "questions": [
      {
        "q": "verify.what",
        "title": "What is being checked",
        "note": "A certificate, a registration and a person behave differently.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "cert",
                "label": "A certificate or qualification"
              },
              {
                "v": "reg",
                "label": "A registration or licence"
              },
              {
                "v": "member",
                "label": "That somebody is a member or approved"
              }
            ]
          }
        ]
      },
      {
        "q": "verify.src",
        "title": "Where does the list of valid ones come from",
        "note": "If the answer is a spreadsheet, that is fine, and it is better said now.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "sheet",
                "label": "A spreadsheet we keep"
              },
              {
                "v": "system",
                "label": "A system we already run"
              },
              {
                "v": "body",
                "label": "A national or trade body"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "verify.src",
                "label": "Attach or link the source"
              }
            ],
            "label": "Attach"
          }
        ]
      }
    ],
    "miss": {
      "id": "verify-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-order",
    "key": "order",
    "title": "The order they are met in",
    "note": "Everything ticked above, first to last. Move a row with the arrows, or leave it and we choose.",
    "level": "Layer two",
    "questions": [],
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-goods",
    "key": "goods",
    "title": "Physical goods, posted or delivered",
    "note": "The worked example every other card follows.",
    "level": "Layer two",
    "questions": [
      {
        "q": "goods.count",
        "title": "Roughly how many products",
        "note": "It decides whether you need a shop or a page with a price on it. A rough answer is fine.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "few",
                "label": "Under 20"
              },
              {
                "v": "some",
                "label": "20 to 200"
              },
              {
                "v": "lots",
                "label": "More than 200"
              }
            ]
          }
        ]
      },
      {
        "q": "goods.opts",
        "title": "Do they come in options",
        "note": "Sizes and colours are the difference between one product and forty.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "few",
                "label": "A few"
              },
              {
                "v": "lots",
                "label": "A lot"
              }
            ]
          }
        ]
      },
      {
        "q": "goods.made",
        "title": "Is anything made to order",
        "note": "Made to order is a different promise and a different lead time.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "some",
                "label": "Some of it"
              },
              {
                "v": "all",
                "label": "All of it"
              }
            ]
          }
        ]
      },
      {
        "q": "goods.reg",
        "title": "Is anything regulated",
        "note": "Age, licensing and safety rules change what the checkout has to do.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "check",
                "label": "We should check"
              }
            ]
          }
        ]
      },
      {
        "q": "goods.del",
        "title": "Delivery",
        "note": "Where to, and how it is charged.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "uk",
                "label": "UK"
              },
              {
                "v": "eu",
                "label": "UK and Europe"
              },
              {
                "v": "ww",
                "label": "Worldwide"
              },
              {
                "v": "coll",
                "label": "Collection too"
              }
            ]
          }
        ]
      },
      {
        "q": "goods.ret",
        "title": "Returns",
        "note": "The policy is the page, and the page is the policy.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "std",
                "label": "The standard right to cancel"
              },
              {
                "v": "own",
                "label": "Something of our own"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "goods.ret",
                "label": "The policy, if one exists"
              }
            ],
            "label": "Attach"
          }
        ]
      },
      {
        "q": "goods.extra",
        "title": "Anything extra",
        "note": "Discount codes, gift cards and reviews are each a small build.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "disc",
                "label": "Discount codes"
              },
              {
                "v": "gift",
                "label": "Gift cards"
              },
              {
                "v": "rev",
                "label": "Reviews"
              },
              {
                "v": "none",
                "label": "None"
              }
            ]
          }
        ]
      },
      {
        "q": "goods.list",
        "title": "Is the product list ready",
        "note": "The list is the shop. Nothing else in this card matters as much.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "ready",
                "label": "Ready"
              },
              {
                "v": "work",
                "label": "Needs work"
              },
              {
                "v": "none",
                "label": "Does not exist"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "goods.list",
                "label": "Attach it. We say what is missing."
              }
            ],
            "label": "Attach"
          }
        ]
      }
    ],
    "miss": {
      "id": "goods-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-digital",
    "key": "digital",
    "title": "Digital downloads",
    "note": "Follows the goods card.",
    "level": "Layer two",
    "questions": [
      {
        "q": "digital.what",
        "title": "What are you selling",
        "note": "A document and a video course are the same transaction and a different build.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "doc",
                "label": "Documents or templates"
              },
              {
                "v": "audio",
                "label": "Audio"
              },
              {
                "v": "video",
                "label": "Video or a course"
              },
              {
                "v": "soft",
                "label": "Software or plugins"
              },
              {
                "v": "art",
                "label": "Photographs or artwork"
              }
            ]
          }
        ]
      },
      {
        "q": "digital.many",
        "title": "How many",
        "note": "The same question as goods, for the same reason.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "few",
                "label": "A handful"
              },
              {
                "v": "some",
                "label": "Dozens"
              },
              {
                "v": "lots",
                "label": "Hundreds"
              }
            ]
          }
        ]
      },
      {
        "q": "digital.size",
        "title": "How big is the largest file",
        "note": "Size decides where the files live and what the download costs to serve.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "s",
                "label": "Under 100MB"
              },
              {
                "v": "m",
                "label": "Up to 2GB"
              },
              {
                "v": "l",
                "label": "Larger"
              }
            ]
          }
        ]
      },
      {
        "q": "digital.expire",
        "title": "Does access expire",
        "note": "Forever is simple. Anything else needs an account, which opens the sign-in.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "ever",
                "label": "Theirs forever"
              },
              {
                "v": "period",
                "label": "For a period"
              },
              {
                "v": "sub",
                "label": "While they subscribe"
              }
            ]
          }
        ]
      },
      {
        "q": "digital.protect",
        "title": "Does it need protecting",
        "note": "Most people need less than they think, and the honest answer is usually a personal link.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "none",
                "label": "Nothing"
              },
              {
                "v": "link",
                "label": "A personal link"
              },
              {
                "v": "mark",
                "label": "Watermarked"
              },
              {
                "v": "key",
                "label": "Licence keys"
              }
            ]
          }
        ]
      },
      {
        "q": "digital.live",
        "title": "Where do the files live now",
        "note": "Moving them is work, and it is better named than discovered.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "none",
                "label": "Nowhere yet"
              },
              {
                "v": "drive",
                "label": "A drive"
              },
              {
                "v": "plat",
                "label": "A platform we already pay for"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "digital.live",
                "label": "A sample, or the list"
              }
            ],
            "label": "Attach"
          }
        ]
      }
    ],
    "miss": {
      "id": "digital-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-software",
    "key": "software",
    "title": "Software, or a product people subscribe to",
    "note": "This routes away from the shop. The website is the shop window and the hand-over; the product itself is scoped as its own piece of work.",
    "level": "Layer two",
    "questions": [
      {
        "q": "software.bill",
        "title": "How does it bill",
        "note": "Billing shape decides what the pricing page has to show.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "m",
                "label": "Monthly"
              },
              {
                "v": "y",
                "label": "Yearly"
              },
              {
                "v": "use",
                "label": "By usage"
              },
              {
                "v": "once",
                "label": "A one-off licence"
              }
            ]
          }
        ]
      },
      {
        "q": "software.trial",
        "title": "Is there a free trial or a free tier",
        "note": "A trial is a second sign-up route, not a line of copy.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "trial",
                "label": "A free trial"
              },
              {
                "v": "free",
                "label": "A free tier"
              }
            ]
          }
        ]
      },
      {
        "q": "software.hand",
        "title": "Where does sign-up hand over",
        "note": "This is the whole question. It decides how much of the product the website is.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "site",
                "label": "The site takes the sign-up"
              },
              {
                "v": "app",
                "label": "The site hands over to your app"
              },
              {
                "v": "all",
                "label": "Your app does all of it"
              }
            ]
          }
        ]
      },
      {
        "q": "software.plans",
        "title": "Do plans need comparing",
        "note": "A comparison table is a design job, not a paragraph.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One plan"
              },
              {
                "v": "few",
                "label": "A few"
              },
              {
                "v": "table",
                "label": "A table with a recommended one"
              }
            ]
          }
        ]
      },
      {
        "q": "software.price",
        "title": "Is the price public",
        "note": "Hidden prices turn the pricing page into a form.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "yes",
                "label": "Yes"
              },
              {
                "v": "from",
                "label": "From a figure"
              },
              {
                "v": "app",
                "label": "On application"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "software-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-service",
    "key": "service",
    "title": "Services at a fixed price, paid online",
    "note": "Often a payment page rather than a shop.",
    "level": "Layer two",
    "questions": [
      {
        "q": "service.what",
        "title": "What is being paid for",
        "note": "A deposit and a class behave differently after the money arrives.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "named",
                "label": "A named service"
              },
              {
                "v": "pack",
                "label": "A package"
              },
              {
                "v": "dep",
                "label": "A deposit"
              },
              {
                "v": "class",
                "label": "A class, course or ticket"
              }
            ]
          }
        ]
      },
      {
        "q": "service.many",
        "title": "How many different ones",
        "note": "Past a handful this is a shop, whatever it is called.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One"
              },
              {
                "v": "few",
                "label": "A handful"
              },
              {
                "v": "lots",
                "label": "More than a handful"
              }
            ]
          }
        ]
      },
      {
        "q": "service.after",
        "title": "Does anything need arranging afterwards",
        "note": "This decides whether payment is the end or the beginning.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "none",
                "label": "Nothing"
              },
              {
                "v": "us",
                "label": "We contact them"
              },
              {
                "v": "time",
                "label": "They pick a time"
              },
              {
                "v": "info",
                "label": "They send us information"
              }
            ]
          }
        ]
      },
      {
        "q": "service.parts",
        "title": "Is it ever paid in parts",
        "note": "A deposit and a balance is two transactions and two emails.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "full",
                "label": "Paid in full"
              },
              {
                "v": "dep",
                "label": "A deposit then a balance"
              }
            ]
          }
        ]
      },
      {
        "q": "service.details",
        "title": "Do you need details at the time of payment",
        "note": "Asking later means chasing. Asking then means a longer checkout.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "few",
                "label": "A few questions"
              },
              {
                "v": "form",
                "label": "A proper form"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "service.details",
                "label": "The questions, if they already exist"
              }
            ],
            "label": "Attach"
          }
        ]
      }
    ],
    "miss": {
      "id": "service-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-book-bookings",
    "key": "book-bookings",
    "title": "Bookings",
    "note": "Asked once, and it was asked under Book an appointment. Nothing here is missing; it is somewhere else.",
    "level": "One home",
    "questions": [
      {
        "q": "",
        "title": "It lives under Book an appointment",
        "note": "Open it there and the answer carries back to here, so the same question is never put to you twice.",
        "groups": [
          {
            "one": false,
            "goto": {
              "to": "dw-book",
              "label": "Take me to it"
            }
          }
        ]
      }
    ]
  },
  {
    "id": "dw-project",
    "key": "project",
    "title": "Projects and bespoke work, quoted first",
    "note": "One home with asking for a quote. If you picked that already, this is the same thing and it stays where it was.",
    "level": "Layer two",
    "questions": [
      {
        "q": "project.need",
        "title": "What do you need to know before you can price it",
        "note": "The most valuable box in the whole of this. Your questions become the form.",
        "groups": [
          {
            "one": false,
            "attach": [
              {
                "key": "project.need",
                "label": "An example proposal, if there is one"
              }
            ],
            "label": "Attach"
          }
        ],
        "textarea": {
          "rows": 3,
          "t": "project.need",
          "placeholder": "In your own words. Nothing is rewritten into ours."
        }
      },
      {
        "q": "project.branch",
        "title": "Should the form branch by type of project",
        "note": "Branching keeps a form short without asking less.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One form"
              },
              {
                "v": "type",
                "label": "A form per type"
              }
            ]
          }
        ]
      },
      {
        "q": "project.budget",
        "title": "Do you want budget asked",
        "note": "Asking badly loses enquiries. Not asking loses time.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "never",
                "label": "Never"
              },
              {
                "v": "band",
                "label": "A band"
              },
              {
                "v": "free",
                "label": "A free figure"
              }
            ]
          }
        ]
      },
      {
        "q": "project.who",
        "title": "Who receives it, and how fast do you answer",
        "note": "A stated answer time is a promise, so it is yours to set.",
        "textarea": {
          "rows": 3,
          "t": "project.who",
          "placeholder": "In your own words. Nothing is rewritten into ours."
        }
      }
    ],
    "miss": {
      "id": "project-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-member",
    "key": "member",
    "title": "Memberships",
    "note": "A payment page plus the signed-in area, which this switches on.",
    "level": "Layer two",
    "questions": [
      {
        "q": "member.gets",
        "title": "What does a member get",
        "note": "This is the product. Everything else is mechanism.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "content",
                "label": "Content"
              },
              {
                "v": "disc",
                "label": "A discount"
              },
              {
                "v": "place",
                "label": "Access to a place"
              },
              {
                "v": "comm",
                "label": "A community"
              },
              {
                "v": "serv",
                "label": "A service"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "member.gets",
                "label": "Anything that describes it now"
              }
            ],
            "label": "Attach"
          }
        ]
      },
      {
        "q": "member.renew",
        "title": "Does it renew",
        "note": "Renewal is a repeat payment, which is a decision in the payments list.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "once",
                "label": "One-off"
              },
              {
                "v": "m",
                "label": "Monthly"
              },
              {
                "v": "y",
                "label": "Yearly"
              }
            ]
          }
        ]
      },
      {
        "q": "member.levels",
        "title": "Is there more than one level",
        "note": "Levels multiply everything behind the sign-in.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One"
              },
              {
                "v": "few",
                "label": "Two or three"
              },
              {
                "v": "more",
                "label": "More"
              }
            ]
          }
        ]
      },
      {
        "q": "member.join",
        "title": "Can people join at any time",
        "note": "Windows and waiting lists are their own small build.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "any",
                "label": "Any time"
              },
              {
                "v": "win",
                "label": "In windows"
              },
              {
                "v": "inv",
                "label": "By invitation"
              }
            ]
          }
        ]
      },
      {
        "q": "member.approve",
        "title": "Does joining need approving",
        "note": "Approval means a queue, and a queue means somebody owns it.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "yes",
                "label": "Yes"
              }
            ]
          }
        ]
      },
      {
        "q": "member.stop",
        "title": "What happens when they stop",
        "note": "The end of a membership is the part nobody specifies and everybody needs.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "end",
                "label": "Access ends"
              },
              {
                "v": "grace",
                "label": "Access stays for a period"
              },
              {
                "v": "case",
                "label": "We decide case by case"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "member-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-support",
    "key": "support",
    "title": "Donations, and support",
    "note": "A payment page, not a shop.",
    "level": "Layer two",
    "questions": [
      {
        "q": "support.when",
        "title": "One-off, regular, or both",
        "note": "Regular giving is a repeat payment and a different relationship.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "once",
                "label": "One-off"
              },
              {
                "v": "reg",
                "label": "Regular"
              },
              {
                "v": "both",
                "label": "Both"
              }
            ]
          }
        ]
      },
      {
        "q": "support.amounts",
        "title": "Suggested amounts, or free choice",
        "note": "Suggested amounts raise more and need writing carefully.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "free",
                "label": "Free choice"
              },
              {
                "v": "sugg",
                "label": "Suggested amounts"
              },
              {
                "v": "does",
                "label": "Amounts with what each one does"
              }
            ]
          }
        ]
      },
      {
        "q": "support.gift",
        "title": "Does Gift Aid apply",
        "note": "Gift Aid is a declaration, a record and a claim, not a checkbox.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "yes",
                "label": "Yes"
              }
            ]
          }
        ]
      },
      {
        "q": "support.target",
        "title": "Is there an appeal or a target",
        "note": "A target needs a number that updates, which is a small build with a long tail.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "appeal",
                "label": "An appeal"
              },
              {
                "v": "target",
                "label": "A target that shows progress"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "support.target",
                "label": "Anything written about it"
              }
            ],
            "label": "Attach"
          }
        ]
      },
      {
        "q": "support.memory",
        "title": "In memory, or in celebration",
        "note": "These change the form and the email that follows it.",
        "groups": [
          {
            "one": false,
            "chips": [
              {
                "v": "mem",
                "label": "In memory"
              },
              {
                "v": "cel",
                "label": "In celebration"
              }
            ]
          }
        ]
      },
      {
        "q": "support.who",
        "title": "Who receives the money",
        "note": "The registered name and number have to be right before anything goes live.",
        "textarea": {
          "rows": 3,
          "t": "support.who",
          "placeholder": "In your own words. Nothing is rewritten into ours."
        }
      }
    ],
    "miss": {
      "id": "support-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-brandfiles",
    "key": "brandfiles",
    "title": "Your colours",
    "note": "Attach the brand files, or just name the colours. Either is a real answer.",
    "level": "Layer two",
    "questions": [
      {
        "q": "brandfiles.have",
        "title": "What exists",
        "note": "A written guide and a memory of a hex code are different starting points.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "guide",
                "label": "A written guide"
              },
              {
                "v": "files",
                "label": "Logo files"
              },
              {
                "v": "know",
                "label": "We know them, they are not written down"
              }
            ]
          },
          {
            "one": false,
            "attach": [
              {
                "key": "brandfiles.have",
                "label": "Brand guidelines, a logo file, or a colour reference"
              }
            ],
            "label": "Attach"
          }
        ]
      }
    ],
    "miss": {
      "id": "brandfiles-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-picker",
    "key": "picker",
    "title": "Start from these",
    "note": "Pick two or three you like. We do the rest, and we check every pairing for contrast before it is used, so the site can be read by everybody. That part is ours to get right.",
    "level": "Layer two",
    "questions": [
      {
        "q": "picker.pick",
        "title": "Pick two or three",
        "note": "",
        "groups": [
          {
            "one": false,
            "swatches": [
              {
                "q": "picker.pick",
                "v": "ink",
                "hex": "#111827",
                "label": "Near black"
              },
              {
                "q": "picker.pick",
                "v": "slate",
                "hex": "#475569",
                "label": "Slate"
              },
              {
                "q": "picker.pick",
                "v": "navy",
                "hex": "#1E3A5F",
                "label": "Navy"
              },
              {
                "q": "picker.pick",
                "v": "teal",
                "hex": "#0F766E",
                "label": "Teal"
              },
              {
                "q": "picker.pick",
                "v": "green",
                "hex": "#166534",
                "label": "Green"
              },
              {
                "q": "picker.pick",
                "v": "olive",
                "hex": "#4D5B32",
                "label": "Olive"
              },
              {
                "q": "picker.pick",
                "v": "rust",
                "hex": "#9A3412",
                "label": "Rust"
              },
              {
                "q": "picker.pick",
                "v": "claret",
                "hex": "#7F1D3A",
                "label": "Claret"
              },
              {
                "q": "picker.pick",
                "v": "plum",
                "hex": "#5B2A6E",
                "label": "Plum"
              },
              {
                "q": "picker.pick",
                "v": "sand",
                "hex": "#C8B18B",
                "label": "Sand"
              },
              {
                "q": "picker.pick",
                "v": "sky",
                "hex": "#3B7EA1",
                "label": "Sky"
              },
              {
                "q": "picker.pick",
                "v": "stone",
                "hex": "#8A8578",
                "label": "Stone"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "picker-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-typeface",
    "key": "typeface",
    "title": "Your typeface",
    "note": "Licensing is the part people forget.",
    "level": "Layer two",
    "questions": [
      {
        "q": "typeface.which",
        "title": "Which one",
        "note": "",
        "groups": [
          {
            "one": false,
            "attach": [
              {
                "key": "typeface.which",
                "label": "Attach the files, or just name it"
              }
            ],
            "label": "Attach"
          }
        ],
        "textarea": {
          "rows": 3,
          "t": "typeface.which",
          "placeholder": "In your own words. Nothing is rewritten into ours."
        }
      },
      {
        "q": "typeface.lic",
        "title": "Do you hold a licence for it on a website",
        "note": "A desktop licence and a web licence are different things, and only one of them lets us use it.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "yes",
                "label": "Yes"
              },
              {
                "v": "no",
                "label": "No"
              },
              {
                "v": "unsure",
                "label": "Not sure"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "typeface-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  },
  {
    "id": "dw-have",
    "key": "have",
    "title": "Tell us about it",
    "note": "Only asked because you said it needs tidying or you would like help.",
    "level": "Layer two",
    "questions": [
      {
        "q": "have.what",
        "title": "What exists now",
        "note": "",
        "textarea": {
          "rows": 3,
          "t": "have.what",
          "placeholder": "In your own words. Nothing is rewritten into ours."
        }
      },
      {
        "q": "have.help",
        "title": "Would you like us to handle it",
        "note": "Where we do not do the work ourselves we bring in a specialist partner, named rather than assumed.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "yes",
                "label": "Yes please"
              },
              {
                "v": "quote",
                "label": "Tell us what it involves"
              },
              {
                "v": "no",
                "label": "No, we will sort it"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "have-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything this card did not ask"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Use this as it stands",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  }
] as const;

export const CARD_BY: Record<string, Card> = Object.fromEntries(
  CARDS.map((card) => [card.id, card]),
);

/**
 * The back of the shop.
 *
 * Layer three, and only reached once somebody is selling something. Every one
 * of these takes "not sure yet" as a real answer, which is why they sit below
 * the shop rather than inside it: they are the questions that turn up late and
 * cost money when they do, and none of them holds anything up today.
 */
export const LAYER_THREE: readonly {
  id: string;
  kicker: string;
  title: string;
  note: string;
  questions: CardQuestion[];
  miss?: CardMiss;
  fork?: CardFork;
}[] = [
  {
    "id": "backofshop",
    "kicker": "Layer three",
    "title": "The back of the shop",
    "note": "The back of the shop. None of it has to be settled today, and \"not sure yet\" is a real answer to every one of them - it holds nothing up. We put them here because they are the questions that turn up late and cost money when they do. Most people work through this part with us on a call.",
    "questions": [
      {
        "q": "l3.tax",
        "title": "Tax beyond UK VAT",
        "note": "Selling into other countries changes the checkout, not the shop.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "UK only"
              },
              {
                "v": "eu",
                "label": "Europe too"
              },
              {
                "v": "ww",
                "label": "Worldwide"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.stock",
        "title": "Stock in more than one place",
        "note": "One shelf is a number. Two shelves is a system.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "one",
                "label": "One place"
              },
              {
                "v": "few",
                "label": "More than one"
              },
              {
                "v": "drop",
                "label": "Somebody else holds it"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.channels",
        "title": "Selling in other channels",
        "note": "A marketplace or a social shop wants the same product list, kept in step.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "Only the website"
              },
              {
                "v": "market",
                "label": "A marketplace too"
              },
              {
                "v": "social",
                "label": "A social shop too"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.till",
        "title": "The till",
        "note": "If you sell in a room as well as online, the two have to agree about stock.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "no",
                "label": "No till"
              },
              {
                "v": "yes",
                "label": "Yes, and it should agree with the site"
              },
              {
                "v": "sep",
                "label": "Yes, and they can stay separate"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.pack",
        "title": "Who packs and sends",
        "note": "It changes what the site has to tell somebody after they have paid.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "you",
                "label": "You do"
              },
              {
                "v": "third",
                "label": "Somebody else does"
              },
              {
                "v": "both",
                "label": "Both, depending"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.systems",
        "title": "The systems you already run",
        "note": "Accounts, stock, email, a customer list. Naming them now saves the discovery later.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "none",
                "label": "Nothing yet"
              },
              {
                "v": "some",
                "label": "One or two"
              },
              {
                "v": "lots",
                "label": "Several, and they matter"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.migrate",
        "title": "What comes across from a shop you already have",
        "note": "Products, customers, orders and web addresses each migrate differently.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "nothing",
                "label": "Nothing, this is new"
              },
              {
                "v": "prod",
                "label": "Products"
              },
              {
                "v": "all",
                "label": "Products, customers and orders"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      },
      {
        "q": "l3.trade",
        "title": "Trade terms",
        "note": "Only if some customers pay on account. Invoices stay in the accounting system that already runs them.",
        "groups": [
          {
            "one": true,
            "chips": [
              {
                "v": "na",
                "label": "Does not apply"
              },
              {
                "v": "simple",
                "label": "One set of terms"
              },
              {
                "v": "per",
                "label": "Terms per customer"
              },
              {
                "v": "unsure",
                "label": "Not sure yet"
              }
            ]
          }
        ]
      }
    ],
    "miss": {
      "id": "l3-own",
      "label": "Something else - tell us in your own words.",
      "placeholder": "Anything about the back of the shop"
    },
    "fork": {
      "title": "Two ways on from here",
      "use": "Leave the rest for the call",
      "more": "Attach something to this",
      "note": "Both are finished states. Anything you leave, we write down as an assumption in your own document rather than as a gap."
    }
  }
] as const;
