import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/"
      }
    ],
    sitemap: "https://saverateafrica.com/sitemap.xml"
  };
}
