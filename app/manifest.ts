import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaveRateAfrica",
    short_name: "SaveRateAfrica",
    description: "Real-time remittance comparison and rate alerts for Nigeria.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#00C853",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
