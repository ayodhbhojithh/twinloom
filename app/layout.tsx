import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SITE } from "@/lib/content/site";

/* Manrope carries the whole site. Variable, so no weight list is needed: the
   type scale runs from 400 body copy up to 800 headings and the wordmark. */
const manrope = Manrope({
  variable: "--font-manrope",
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
    <html lang="en-GB" className={`${manrope.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );
}
