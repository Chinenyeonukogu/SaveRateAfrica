import type { Metadata } from "next";

import { HomePageShell } from "@/components/HomePageShell";
import { fetchRates } from "@/lib/fetchRates";

export const revalidate = 300;

const seoKeywords = [
  "best way to send money to Nigeria",
  "best app to send money to Nigeria from US",
  "which platform gives best naira rate",
  "how to avoid transfer fees Nigeria",
  "cheapest way to send money to Nigeria",
  "Nigeria exchange rate today",
  "USD to NGN rate today",
  "compare remittance Nigeria",
  "GBP to NGN rate",
  "CAD to NGN rate"
];

export const metadata: Metadata = {
  title: "SaveRateAfrica | Best Way to Send Money to Nigeria",
  description:
    "Compare USD, GBP and CAD to NGN rates today. Find the cheapest way to send money to Nigeria from USA, UK and Canada. Compare LemFi, Wise, Grey, Remitly and 10+ providers instantly.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "SaveRateAfrica | Best Way to Send Money to Nigeria",
    description:
      "Compare USD, GBP and CAD to NGN rates today. Find the cheapest way to send money to Nigeria.",
    url: "https://saverateafrica.com",
    siteName: "SaveRateAfrica",
    images: [{ url: "https://saverateafrica.com/logo.svg", width: 200, height: 200 }],
    type: "website"
  }
};

export default async function HomePage() {
  const initialComparison = await fetchRates({
    amount: 500,
    senderCountry: "USA"
  });

  const comparisonJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top remittance providers to Nigeria",
    itemListElement: initialComparison.providers.slice(0, 5).map((provider, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: provider.name,
      url: `https://www.saverateafrica.com/providers/${provider.slug}`
    }))
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SaveRateAfrica",
    applicationCategory: "FinanceApplication",
    description:
      "Compare remittance providers sending money to Nigeria from the USA, UK, and Canada."
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([comparisonJsonLd, appJsonLd])
        }}
        type="application/ld+json"
      />
      <HomePageShell initialComparison={initialComparison} />
    </>
  );
}
