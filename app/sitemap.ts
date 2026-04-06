import type { MetadataRoute } from "next";

import { providers } from "@/lib/providers";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.saverateafrica.com";

  const staticPages = ["", "/credit-cards", "/providers", "/blog", "/alerts"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8
    })
  );

  const providerPages = providers.map((provider) => ({
    url: `${baseUrl}/providers/${provider.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75
  }));

  return [...staticPages, ...providerPages];
}
