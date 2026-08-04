/* ---------------------------------------------------------------------------
   The option lists.

   A different control from the tables: a row is a name, a line saying what
   picking it means, and a Pick beside it. The prototype uses them where the
   answers need explaining rather than counting, which is why "Bold and
   confident" gets a sentence and "Call you" does not.

   `one` is set on a list where choosing clears the rest. Light or dark is one
   answer; how it should feel is as many as are true, because they pull against
   each other and that is useful to see.
--------------------------------------------------------------------------- */

export interface OptionRow {
  k: string;
  /** The question this list answers, as its scope in the store. */
  scope: string;
  /** One answer only. */
  one: boolean;
  n: string;
  /** What picking it means. */
  sub: string;
}

export interface OptionList {
  scope: string;
  title: string;
  note: string;
  rows: OptionRow[];
}

export const OPTION_LISTS: Record<string, OptionList[]> = {
 "style": [
  {
   "scope": "feel",
   "title": "How should it feel",
   "note": "Pick as many as are true. They pull against each other, and that is useful to see.",
   "rows": [
    {
     "k": "min",
     "scope": "feel",
     "one": false,
     "n": "Minimal and plain",
     "sub": "Space, few colours, nothing shouting. The words and the pictures do the work."
    },
    {
     "k": "warm",
     "scope": "feel",
     "one": false,
     "n": "Warm and friendly",
     "sub": "Softer edges, warmer colours, photographs of people rather than things."
    },
    {
     "k": "bold",
     "scope": "feel",
     "one": false,
     "n": "Bold and confident",
     "sub": "Large type, strong colour, statements rather than paragraphs."
    },
    {
     "k": "classic",
     "scope": "feel",
     "one": false,
     "n": "Classic and formal",
     "sub": "Restrained, symmetrical, the sort of site people expect to be able to trust with something."
    },
    {
     "k": "edit",
     "scope": "feel",
     "one": false,
     "n": "Editorial, words first",
     "sub": "It reads like something published. Long-form is welcome rather than squeezed."
    },
    {
     "k": "play",
     "scope": "feel",
     "one": false,
     "n": "Bright and playful",
     "sub": "Colour used freely, illustration rather than photography."
    },
    {
     "k": "tech",
     "scope": "feel",
     "one": false,
     "n": "Quiet and technical",
     "sub": "Dense, precise, comfortable with detail. Diagrams and tables belong."
    }
   ]
  },
  {
   "scope": "colour",
   "title": "Colour",
   "note": "Four honest starting points. The last one is a good answer and a common one.",
   "rows": [
    {
     "k": "have",
     "scope": "colour",
     "one": true,
     "n": "Use the colours we already have",
     "sub": "Attach the brand files, or just tell us the colours."
    },
    {
     "k": "tidy",
     "scope": "colour",
     "one": true,
     "n": "We have colours, but they need tidying",
     "sub": "Send whatever exists, however rough."
    },
    {
     "k": "start",
     "scope": "colour",
     "one": true,
     "n": "Start from these",
     "sub": "Pick two or three you like and we do the rest."
    },
    {
     "k": "you",
     "scope": "colour",
     "one": true,
     "n": "No strong view - choose for us",
     "sub": "A good answer, and a common one."
    }
   ]
  },
  {
   "scope": "mode",
   "title": "Light or dark",
   "note": "",
   "rows": [
    {
     "k": "light",
     "scope": "mode",
     "one": true,
     "n": "Light",
     "sub": "The usual, and usually right."
    },
    {
     "k": "dark",
     "scope": "mode",
     "one": true,
     "n": "Dark",
     "sub": "Works best where the pictures carry the page."
    },
    {
     "k": "either",
     "scope": "mode",
     "one": true,
     "n": "Either",
     "sub": "Often the right answer."
    }
   ]
  },
  {
   "scope": "type",
   "title": "Type",
   "note": "",
   "rows": [
    {
     "k": "suits",
     "scope": "type",
     "one": true,
     "n": "Whatever suits the layout",
     "sub": "We choose something that reads well and loads quickly."
    },
    {
     "k": "have",
     "scope": "type",
     "one": true,
     "n": "We have a typeface",
     "sub": "Tell us which one."
    },
    {
     "k": "mind",
     "scope": "type",
     "one": true,
     "n": "Something particular in mind",
     "sub": "Describe it, or point at a site that uses it."
    }
   ]
  }
 ],
 "sell": [
  {
   "scope": "now",
   "title": "How are you selling today",
   "note": "It changes what has to move across, and what can simply start.",
   "rows": [
    {
     "k": "not",
     "scope": "now",
     "one": true,
     "n": "Not yet, this would be the first time",
     "sub": ""
    },
    {
     "k": "person",
     "scope": "now",
     "one": true,
     "n": "In person, or over the phone",
     "sub": ""
    },
    {
     "k": "market",
     "scope": "now",
     "one": true,
     "n": "Through a marketplace or a social shop",
     "sub": ""
    },
    {
     "k": "shop",
     "scope": "now",
     "one": true,
     "n": "We already have an online shop",
     "sub": ""
    }
   ]
  }
 ],
 "submit": [
  {
   "scope": "talk",
   "title": "When shall we talk it through",
   "note": "Half an hour, at step four. Three answers, and the third one is not a failure.",
   "rows": [
    {
     "k": "book",
     "scope": "talk",
     "one": true,
     "n": "Book a time now",
     "sub": "A slot from a real diary, confirmed on the spot."
    },
    {
     "k": "times",
     "scope": "talk",
     "one": true,
     "n": "Send us your preferred times instead",
     "sub": "Days and time bands rather than a specific slot. We come back with a slot inside two working days."
    },
    {
     "k": "neither",
     "scope": "talk",
     "one": true,
     "n": "Neither, for now",
     "sub": "We send the document and come back by email within two working days."
    }
   ]
  }
 ]
};
