import type { Metadata } from "next";

import { ProvidersDirectoryClient } from "@/components/ProvidersDirectoryClient";
import { SiteHeader } from "@/components/SiteHeader";
import { providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "All Money Transfer Providers to Nigeria | SaveRateAfrica",
  description:
    "Browse 10+ money transfer providers sending to Nigeria and filter by country, speed, fee range, and rating.",
  alternates: {
    canonical: "/providers"
  }
};

export default function ProvidersPage() {
  return (
    <>
      <SiteHeader />

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
              Provider directory
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
              Explore every provider route sending money to Nigeria
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
              Compare speed, fees, corridor support, and user ratings before you
              click out to send. Provider detail pages are structured for SEO and
              deeper decision-making.
            </p>
          </section>

          <ProvidersDirectoryClient providers={providers} />
        </div>
      </main>
    </>
  );
}
