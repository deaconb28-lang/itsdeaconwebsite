import type { Metadata, Viewport } from "next";
import { Archivo, Spline_Sans_Mono } from "next/font/google";
import { siteUrl } from "@/lib/env";
import "./globals.css";

/**
 * Two faces, and no more.
 *
 * Archivo carries both roles — 900 for display, 400/500 for reading — because
 * a monochrome page has no hue to separate them and mixing families as well as
 * weights would fight the one-material feeling the homepage set. The mono
 * carries measurements and labels only.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display-src",
  display: "swap",
});

const archivoBody = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  themeColor: "#000000",
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
      className={`${archivo.variable} ${archivoBody.variable} ${splineMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
