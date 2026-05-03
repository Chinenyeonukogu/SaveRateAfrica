import type { MetadataRoute } from "next";

import { providers } from "@/lib/providers";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://saverateafrica.com";

  const staticPages = [
    {
      path: "",
      changeFrequency: "daily" as const,
      priority: 1
    },
    {
      path: "/alerts",
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      path: "/about",
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      path: "/credit-cards",
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      path: "/providers",
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      path: "/blog",
      changeFrequency: "weekly" as const,
      priority: 0.8
    }
  ].map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));

  const providerPages = providers.map((provider) => ({
    url: `${baseUrl}/providers/${provider.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75
  }));

  return [...staticPages, ...providerPages];
}
