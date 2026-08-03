/* ---------------------------------------------------------------------------
   What you already have.

   Thirteen rows in four groups, and three answers to each. The middle answer is
   the honest one most of the time, which is why it is offered rather than left
   as the gap between yes and no.

   Grouped the way the prototype groups them, because the grouping is an
   argument: what has to exist before anything can go live, then the look, then
   the words, then what is running now.
--------------------------------------------------------------------------- */

export interface HaveRow {
  /** The question this row answers, as its key in the store. */
  q: string;
  key: string;
  title: string;
  /** Why it is being asked. */
  note: string;
  /** Somewhere to promise the file rather than describe it. */
  attach?: { key: string; label: string };
}

export interface HaveGroup {
  title: string;
  rows: HaveRow[];
}

export const HAVE_GROUPS: readonly HaveGroup[] = [
 {
  "title": "Before anything can go live",
  "rows": [
   {
    "q": "have.domain",
    "key": "domain",
    "title": "A domain name",
    "note": "The address people type. Nothing goes live without one.",
    "attach": {
     "key": "have.domain",
     "label": "Attach or name it"
    }
   },
   {
    "q": "have.email",
    "key": "email",
    "title": "A business email address",
    "note": "Your website has to send enquiries somewhere that is yours.",
    "attach": {
     "key": "have.email",
     "label": "Name it"
    }
   }
  ]
 },
 {
  "title": "The look",
  "rows": [
   {
    "q": "have.logo",
    "key": "logo",
    "title": "A logo",
    "note": "The original file is the difference between sharp and blurry.",
    "attach": {
     "key": "have.logo",
     "label": "Attach the original files, if you have them"
    }
   },
   {
    "q": "have.vi",
    "key": "vi",
    "title": "A written visual identity",
    "note": "Colours, type, and how they go together.",
    "attach": {
     "key": "have.vi",
     "label": "Attach it"
    }
   },
   {
    "q": "have.photos",
    "key": "photos",
    "title": "Photographs of your own",
    "note": "Pictures are usually what holds a design up.",
    "attach": {
     "key": "have.photos",
     "label": "Attach a few"
    }
   },
   {
    "q": "have.prodpics",
    "key": "prodpics",
    "title": "Pictures of the things you sell",
    "note": "Their own job, with their own consistency to keep.",
    "attach": {
     "key": "have.prodpics",
     "label": "Attach a few"
    }
   },
   {
    "q": "have.video",
    "key": "video",
    "title": "Video",
    "note": "Rarely sitting ready. Worth settling early either way.",
    "attach": {
     "key": "have.video",
     "label": "Link or attach"
    }
   }
  ]
 },
 {
  "title": "The words",
  "rows": [
   {
    "q": "have.copy",
    "key": "copy",
    "title": "Words already written",
    "note": "Brochures, emails you send often, anything you have said well once.",
    "attach": {
     "key": "have.copy",
     "label": "Attach them"
    }
   },
   {
    "q": "have.writer",
    "key": "writer",
    "title": "Somebody who will keep writing after launch",
    "note": "Blogs and articles are a commitment, not a page."
   }
  ]
 },
 {
  "title": "What is running now",
  "rows": [
   {
    "q": "have.site",
    "key": "site",
    "title": "A website that exists today",
    "note": "What is on it, and what is worth keeping.",
    "attach": {
     "key": "have.site",
     "label": "Link it"
    }
   },
   {
    "q": "have.landing",
    "key": "landing",
    "title": "A landing page you have already paid for",
    "note": "So it is not built twice.",
    "attach": {
     "key": "have.landing",
     "label": "Link it"
    }
   },
   {
    "q": "have.social",
    "key": "social",
    "title": "Social accounts",
    "note": "Set up, kept current, or neither.",
    "attach": {
     "key": "have.social",
     "label": "Name them"
    }
   },
   {
    "q": "have.ads",
    "key": "ads",
    "title": "Advertising or campaign measurement",
    "note": "Anything running now, on or off the internet."
   }
  ]
 }
];
