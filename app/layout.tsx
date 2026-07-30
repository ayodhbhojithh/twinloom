import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";

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
  title: "TwinCoreTech",
  description: "Websites for growing UK businesses.",
};

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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
