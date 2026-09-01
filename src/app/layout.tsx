import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  DM_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import { siteUrl } from "@/lib/env";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const SITE_URL = siteUrl();

/**
 * Only what is true of every route.
 *
 * Titles, descriptions, keywords, Open Graph and — critically — the canonical
 * URL are declared per page via `metadataFor()` in src/lib/page-meta.tsx. A
 * canonical hardcoded here would tell Google that every page is a duplicate of
 * whichever one it named.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Deacon — websites for local businesses",
    template: "%s",
  },
  authors: [{ name: "Deacon" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F8F1E3",
  width: "device-width",
  initialScale: 1,
};

/**
 * Marks the document as JS-capable before first paint, so the scroll-reveal
 * rules can hide their targets. Without JS the class never lands and the page
 * renders fully visible.
 */
const JS_FLAG = `document.documentElement.classList.add("dc-js")`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${instrumentSans.variable} ${dmMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
