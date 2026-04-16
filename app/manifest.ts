import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaveRateAfrica",
    short_name: "SaveRate",
    description: "Real-time remittance comparison and rate alerts for Nigeria.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#00C853",
    categories: ["finance"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
