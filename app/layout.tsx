import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { SiteShell } from "@/components/layout";
import { RevealWatcher } from "@/components/layout/reveal-watcher";
import { JsonLd } from "@/components/seo/json-ld";
import { LOCALE, SITE_URL, organisationLd, websiteLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

/* Archivo carries the whole site. Variable, so no weight list is needed: the
   draft runs from 400 body copy to 800 display. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

/* JetBrains Mono, for labels, counts and codes. A role of its own in the draft,
   not a fallback for the sans. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

/**
 * What every page inherits, and what nothing below has to repeat.
 *
 * `metadataBase` is the one that has to be here. Without it a relative image
 * path in any page's Open Graph block is a build error, and every absolute URL
 * on the site would have to be written out by hand at each use.
 *
 * What is deliberately *not* here is a canonical and a `robots` block. Both are
 * inherited by anything that does not set its own, and the two things that do
 * not set their own are Next's not-found and error boundaries. A default
 * canonical of `/` had every 404 on the site declaring itself a copy of the
 * home page, and a default `index, follow` was being emitted straight after the
 * `noindex` Next injects for a 404 - one page, two contradictory instructions,
 * with the wrong one last. Both belong per route, and `pageMeta` puts them
 * there for every route there is.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  /* The words the site is actually about, for the machines that still read a
     publisher line. Not keywords: those have been ignored for twenty years and
     stuffing them is a signal of its own. */
  authors: [{ name: SITE.name, url: SITE_URL }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: LOCALE.og,
    url: SITE_URL,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  /* A phone number written as prose is a phone number a browser turns into a
     link, in a font it picked, on a page that did not ask. */
  formatDetection: { telephone: false, address: false, email: false },
};

/**
 * The chrome every page sits in.
 *
 * The header spans the full width and the two columns sit underneath it, rather
 * than the header living inside the right column. That is what lets the rail stop
 * below the header instead of running up behind it, and it is the arrangement every
 * documentation layout uses for the same reason.
 *
 * `items-start` on the row is what lets the rail be sticky: a stretched flex child
 * is already as tall as its parent and has nothing left to stick within.
 *
 * The content column is at least the height of the viewport with the page taking
 * the slack, so a short page still puts its footer at the bottom of the screen
 * rather than halfway up it.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${archivo.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {/* Who this is and what this site is, said once for the whole site.
            Both carry an `@id`, so every other block on every other page points
            at these two rather than restating them - one organisation described
            in twenty places is twenty organisations as far as a crawler that
            has to reconcile them is concerned. */}
        <JsonLd data={[organisationLd(), websiteLd()]} />

        <SiteShell>{children}</SiteShell>

        {/* Arms the scroll reveals, and is the only thing on the page that has
            to run for them to exist. Nothing is hidden until it says so, so a
            page it never reaches is a page with no reveals rather than a page
            with no content. */}
        <RevealWatcher />
      </body>
    </html>
  );
}
