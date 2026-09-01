// DEPLOYMENT MARKER: 2026-06-01 02:37:45
// Force redeploy - June 2026

import type { Metadata } from "next";

import { HomePageShell } from "@/components/HomePageShell";
import { fetchRates } from "@/lib/fetchRates";

export const revalidate = 1800;

const seoKeywords = [
  "best way to send money to Africa",
  "best app to send money to Africa from US",
  "which platform gives best naira rate",
  "how to avoid transfer fees Africa",
  "cheapest way to send money to Africa",
  "Africa exchange rate today",
  "USD to NGN rate today",
  "compare remittance Africa",
  "GBP to NGN rate",
  "CAD to NGN rate"
];

export const metadata: Metadata = {
  title: "SaveRateAfrica | Best Way to Send Money to Africa",
  description:
    "Compare Live Africa Exchange Rates & See Which Provider Pays the Most.",
  keywords: seoKeywords,
  alternates: {
    canonical: "https://www.saverateafrica.com/"
  },
  openGraph: {
    title: "SaveRateAfrica | Best Way to Send Money to Africa",
    description:
      "Compare USD, GBP and CAD to NGN rates today. Find the cheapest way to send money to Africa.",
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
    name: "Top remittance providers to Africa",
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
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    operatingSystem: "Web",
    description:
      "Compare remittance providers sending money to Africa from the USA, UK, and Canada."
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

