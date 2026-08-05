import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

/**
 * The web app manifest.
 *
 * Not because this is an app. It is what a phone reads when somebody adds the
 * site to a home screen, and what Chrome's install and share sheets take the
 * name and colours from - without one they take the document title and a
 * screenshot of whatever was on screen.
 *
 * `display: browser`, honestly. This is a website with an address bar worth
 * seeing; `standalone` would dress it as an application and take away the back
 * button on the one screen that is a form.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.short,
    description: SITE.description,
    start_url: "/",
    display: "browser",
    lang: "en-GB",
    /* The page's own ground and its ink, so the browser chrome that borrows
       these matches the site rather than guessing at white. */
    background_color: "#ffffff",
    theme_color: "#111827",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
