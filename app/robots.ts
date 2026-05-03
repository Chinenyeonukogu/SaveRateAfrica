import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: "https://saverateafrica.com/sitemap.xml",
    host: "https://saverateafrica.com"
  };
}
