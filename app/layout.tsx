import type { Metadata } from "next";
import { Caveat, Manrope } from "next/font/google";

import "./globals.css";

import { ThoughtsProvider } from "@/components/thoughts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE } from "@/lib/content/site";

/* Manrope carries the whole site. Variable, so no weight list is needed: the
   type scale runs from 400 body copy up to 800 headings and the wordmark. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

/* Caveat, for the one handwritten aside. Variable, so no weight list. */
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${manrope.variable} ${caveat.variable} h-full`}>
      <body className="min-h-full">
        <TooltipProvider delayDuration={200}>
          {/* The panel lives above the page so it is present on every route, and
              it owns the column layout because the page shifts when it opens. */}
          <ThoughtsProvider>{children}</ThoughtsProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
