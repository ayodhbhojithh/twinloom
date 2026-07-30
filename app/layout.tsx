import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { SiteFooter, SiteHeader, SiteRail } from "@/components/layout";
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

export const metadata: Metadata = {
  title: {
    default: `${SITE.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
};

/**
 * The chrome every page sits in.
 *
 * Two columns, as the draft has them: the rail down the left at its own full
 * height, and everything else in the right column, header and page and footer
 * together. `items-start` is what lets the rail be sticky, since a stretched flex
 * child is already as tall as its parent and has nothing to stick within.
 *
 * The right column is at least the height of the viewport with the page taking the
 * slack, so a short page still puts its footer at the bottom of the screen rather
 * than halfway up it.
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
      <body className="flex min-h-full items-start">
        <SiteRail />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
