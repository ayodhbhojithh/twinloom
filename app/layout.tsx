import type { Metadata } from "next";
import { Caveat, IBM_Plex_Mono, Manrope } from "next/font/google";

import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE } from "@/lib/content/site";
import { cn } from "@/lib/utils";

/* The type stack, taken from option 2a of the prototype. Three families, and
   only three: Manrope carries every bit of UI, IBM Plex Mono every bit of
   microcopy, Caveat the handwritten asides.
   The prototype's font request also pulls Newsreader, Bricolage Grotesque,
   Space Grotesk and Instrument Sans. Those belong to the design directions we
   are not building, so they stay out. */

/* Variable. 2a uses 400 body, 600 nav, 700 buttons, 800 headings. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

/* Static family, so the weights have to be listed. 2a uses 400 and 600. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

/* Variable. 2a never sets a weight on Caveat, so keep the whole range rather
   than pinning it to instances the markup does not ask for. */
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
    <html
      lang="en-GB"
      className={cn(
        "h-full",
        manrope.variable,
        plexMono.variable,
        caveat.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
