import type { Metadata } from "next";

import { siteUrl } from "./env";
import {
  BUILD_OPTIONS,
  money,
  PLAN_OPTIONS,
  type PriceOption,
} from "./offerings";

/**
 * Per-route metadata and structured data.
 *
 * These used to live in the root layout, hardcoded to the restaurant pitch —
 * including `alternates: { canonical: "/" }`, which every route inherited. A
 * second page would have told Google it was a duplicate of the first. Each
 * page now declares its own.
 */
export type PageMeta = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  /** What Deacon sells on this page, for schema.org. */
  serviceType: string;
  /**
   * Whether this page lists prices. The two pitch pages do and get a full
   * offer catalog; the front page does not, and a catalog there would claim a
   * price list a visitor cannot actually find on the page.
   */
  offers?: boolean;
};

export function metadataFor(meta: PageMeta): Metadata {
  const url = new URL(meta.path, siteUrl()).toString();

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: meta.path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Deacon",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

/** JSON-LD for one page's service. Rendered inside the page, not the layout. */
export function structuredData(meta: PageMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Deacon",
    description: meta.description,
    url: new URL(meta.path, siteUrl()).toString(),
    email: "hello@itsdeacon.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Salem",
      addressRegion: "OR",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: "Salem, Oregon",
    },
    // A range, now that there are three builds. It used to name the middle
    // one as if it were the only one.
    priceRange: priceRange(),
    serviceType: meta.serviceType,
    ...(meta.offers ? { hasOfferCatalog: offerCatalog(meta) } : {}),
  };
}

/** "$300–$2,000": the cheapest and dearest builds, from the menu itself. */
function priceRange(): string {
  const amounts = BUILD_OPTIONS.map((option) => option.amount);
  return `${money(Math.min(...amounts))}–${money(Math.max(...amounts))}`;
}

/**
 * The five things on sale, as schema.org sees them.
 *
 * The builds are plain Offers with a single price. The monthlies cannot be:
 * a bare `price: 75` on a subscription reads as "seventy-five dollars, done",
 * so each carries a UnitPriceSpecification saying the price is per one month
 * and recurs monthly.
 */
function offerCatalog(meta: PageMeta) {
  return {
    "@type": "OfferCatalog",
    name: meta.serviceType,
    itemListElement: [
      ...BUILD_OPTIONS.map((option) => oneTimeOffer(option, meta)),
      ...PLAN_OPTIONS.filter((option) => option.amount > 0).map((option) =>
        monthlyOffer(option, meta),
      ),
    ],
  };
}

function itemOffered(option: PriceOption, meta: PageMeta) {
  return {
    "@type": "Service",
    name: option.label,
    serviceType: meta.serviceType,
    provider: { "@type": "ProfessionalService", name: "Deacon" },
  };
}

function oneTimeOffer(option: PriceOption, meta: PageMeta) {
  return {
    "@type": "Offer",
    name: option.label,
    price: String(option.amount),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: new URL(`${meta.path}#pricing`, siteUrl()).toString(),
    itemOffered: itemOffered(option, meta),
  };
}

function monthlyOffer(option: PriceOption, meta: PageMeta) {
  return {
    "@type": "Offer",
    name: option.label,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: new URL(`${meta.path}#pricing`, siteUrl()).toString(),
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(option.amount),
      priceCurrency: "USD",
      // One month billed at a time, recurring every month. MON is UN/CEFACT
      // for a month, which is what schema.org's unitCode expects.
      billingDuration: 1,
      billingIncrement: 1,
      unitCode: "MON",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: "MON",
      },
    },
    itemOffered: itemOffered(option, meta),
  };
}

/** Renders the JSON-LD block. Every page mounts exactly one. */
export function StructuredData({ meta }: { meta: PageMeta }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(meta)) }}
    />
  );
}
