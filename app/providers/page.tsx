import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { SiteHeader } from "@/components/SiteHeader";
import { providers } from "@/lib/providers";

const seoKeywords = [
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
  title: "All Money Transfer Providers to Africa | SaveRateAfrica",
  description:
<<<<<<< HEAD
    "Compare Live Nigeria Exchange Rates & See Which Provider Pays the Most.",
=======
    "Compare Live Africa Exchange Rates & See Which Providers Pays the Most.",
>>>>>>> a11c1ae (feat: generalize Nigeria copy for Africa)
  keywords: seoKeywords,
  alternates: {
    canonical: "https://www.saverateafrica.com/providers"
  },
  openGraph: {
    title: "All Money Transfer Providers to Africa | SaveRateAfrica",
    description:
      "Browse 14 money transfer providers sending to Africa and filter by country, speed, fee range, and rating.",
    url: "https://saverateafrica.com/providers"
  }
};

const ProvidersDirectoryClient = dynamic(
  () =>
    import("@/components/ProvidersDirectoryClient").then(
      (mod) => mod.ProvidersDirectoryClient
    ),
  {
    loading: () => (
      <div className="min-h-[520px] animate-pulse rounded-[28px] border border-brand-navy/10 bg-white shadow-float" />
    )
  }
);

export default function ProvidersPage() {
  return (
    <>
      <SiteHeader />

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
              Every provider is Independently reviewed.
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
              Provider Reviews
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
              We compare speed, fees, and real user ratings so you can send money
              to Africa with confidence. No provider pays to be featured or
              ranked higher.
            </p>
          </section>

          <ProvidersDirectoryClient providers={providers} />
        </div>
      </main>
    </>
  );
}
