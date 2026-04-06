import type { Metadata } from "next";

import { HomePageShell } from "@/components/HomePageShell";
import { fetchRates } from "@/lib/fetchRates";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Send Money to Nigeria from USA, UK and Canada",
  description:
    "Compare real-time NGN remittance rates from 15+ providers, track currency trends, and save on every transfer to Nigeria.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Send Money to Nigeria - Compare and Save Instantly",
    description:
      "Real-time rates from 15+ providers. No hidden fees. Built for Nigerians in USA, UK and Canada."
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
