import type { Metadata, Viewport } from "next";
import {
  Big_Shoulders,
  Public_Sans,
  Spline_Sans_Mono,
} from "next/font/google";
import { siteUrl } from "@/lib/env";
import "./globals.css";

/**
 * A signwriter's three faces, and no more.
 *
 * Big Shoulders is drawn from Chicago's civic and commercial lettering — the
 * condensed gothic a signpainter reaches for when a fascia is wider than it is
 * tall. Public Sans is the US government's typeface, which is the right
 * register for a page whose argument is that it will tell you the truth. The
 * mono carries measurements only.
 */
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display-src",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body-src",
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-src",
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
  themeColor: "#0E3A2C",
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
      className={`${bigShoulders.variable} ${publicSans.variable} ${splineMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
