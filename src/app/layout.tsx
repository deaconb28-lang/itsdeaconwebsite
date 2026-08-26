import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  DM_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itsdeacon.com";
const TITLE = "Deacon — websites for local restaurants";
const DESCRIPTION =
  "I design and build websites for local restaurants — by hand, one at a time. Free homepage first, before you owe me a cent.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "restaurant website design",
    "restaurant web designer",
    "local restaurant website",
    "menu website",
    "Deacon",
  ],
  authors: [{ name: "Deacon" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Deacon",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
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

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Deacon",
  description: DESCRIPTION,
  url: SITE_URL,
  email: "hello@itsdeacon.com",
  areaServed: "United States",
  priceRange: "$1,200",
  serviceType: "Restaurant website design and development",
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
