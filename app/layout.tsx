import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { SiteShell } from "@/components/layout";
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
