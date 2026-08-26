import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";

const SITE_URL = siteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
