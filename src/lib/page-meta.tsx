import type { Metadata } from "next";

import { siteUrl } from "./env";

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
    areaServed: "United States",
    priceRange: "$1,200",
    serviceType: meta.serviceType,
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
