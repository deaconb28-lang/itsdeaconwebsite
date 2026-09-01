import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

const SITE_URL = siteUrl();

/** Every indexable route. Add a page here when you add one. */
const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/restaurants", priority: 0.9 },
  { path: "/small-business", priority: 0.9 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
