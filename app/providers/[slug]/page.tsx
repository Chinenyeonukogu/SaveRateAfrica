import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Clock3, Star } from "lucide-react";
import { notFound } from "next/navigation";

import { fetchRates } from "@/lib/fetchRates";
import { formatCompact, formatNaira } from "@/lib/format";
import { getProviderAffiliateLink } from "@/lib/affiliateLinks";
import { getProviderBySlug, providers } from "@/lib/providers";

export const revalidate = 300;

interface ProviderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return providers.map((provider) => ({
    slug: provider.slug
  }));
}

export async function generateMetadata({
  params
}: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    return {};
  }

  return {
    title: `${provider.name} money transfer to Nigeria`,
    description: `${provider.name} review for sending money to Nigeria from USA, UK, and Canada. Compare speed, fees, and payout context.`,
    alternates: {
      canonical: `/providers/${provider.slug}`
    },
    openGraph: {
      title: `${provider.name} for Nigeria transfers`,
      description: provider.summary
    }
  };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const comparison = await fetchRates({
    amount: 500,
    senderCountry: "USA"
  });
  const providerSnapshot = comparison.providers.find(
    (item) => item.slug === provider.slug
  );
  const providerHasFee = (providerSnapshot?.fee ?? 0) > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: provider.name,
    description: provider.summary,
    url: `https://www.saverateafrica.com/providers/${provider.slug}`
  };

  return (
    <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
        }}
        type="application/ld+json"
      />

      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-brand-navy shadow-float"
          href="/providers"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to providers
        </Link>

        <section className="rounded-[32px] bg-white p-6 shadow-float sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div
                className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] text-xl font-heading text-white"
                style={{
                  background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
                }}
              >
                {provider.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
                Provider review
              </p>
              <h1 className="mt-3 font-heading text-4xl text-brand-navy sm:text-5xl">
                {provider.name} money transfer to Nigeria
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-brand-navy/70">
                {provider.headline} {provider.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-brand-navy/70">
                <div className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-light px-4">
                  <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                  {provider.rating.toFixed(1)} rating
                </div>
                <div className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-light px-4">
                  <Clock3 className="h-4 w-4 text-brand-coral" />
                  {provider.deliveryLabel}
                </div>
                <div className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-light px-4">
                  <BadgeCheck className="h-4 w-4 text-brand-green" />
                  {formatCompact(provider.reviewCount)} user reviews
                </div>
                {!providerHasFee ? (
                  <div className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-green px-4 font-semibold text-white">
                    No Fee ✅
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] bg-brand-navy p-6 text-white shadow-float">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                Snapshot from USA
              </p>
              <h2 className="mt-2 font-heading text-3xl">
                Typical payout on a {comparison.sourceCurrency} 500 transfer
              </h2>

              {providerSnapshot ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-3xl bg-white/5 p-5">
                    <p className="text-sm text-white/60">Amount received</p>
                    <p className="mt-2 text-3xl font-heading">
                      {formatNaira(providerSnapshot.amountReceived, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div className={`grid gap-4 ${providerHasFee ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
                    {providerHasFee ? (
                      <div className="rounded-3xl bg-white/5 p-4">
                        <p className="text-sm text-white/60">Transfer fee</p>
                        <p className="mt-2 text-lg font-semibold">
                          {providerSnapshot.feeDisplayText}
                        </p>
                      </div>
                    ) : null}
                    <div className="rounded-3xl bg-white/5 p-4">
                      <p className="text-sm text-white/60">Delivery</p>
                      <p className="mt-2 text-lg font-semibold">
                        {providerSnapshot.deliveryLabel}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <a
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-yellow px-5 text-sm font-bold text-brand-navy"
                href={getProviderAffiliateLink(provider.slug, {
                  amount: comparison.amount,
                  currency: comparison.sourceCurrency,
                  placement: "provider-page"
                })}
                rel="noreferrer"
                target="_blank"
              >
                Send with {provider.name}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              Why senders choose {provider.name}
            </p>
            <div className="mt-5 space-y-3">
              {provider.pros.map((pro) => (
                <div
                  key={pro}
                  className="flex items-start gap-3 rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-navy/70"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-green" />
                  {pro}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-coral">
              Things to watch
            </p>
            <div className="mt-5 space-y-3">
              {provider.cons.map((con) => (
                <div
                  key={con}
                  className="flex items-start gap-3 rounded-2xl bg-brand-light px-4 py-3 text-sm text-brand-navy/70"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-coral" />
                  {con}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              Supported sender markets
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {provider.supportedSenderCountries.map((country) => (
                <span
                  key={country}
                  className="rounded-full bg-brand-light px-4 py-2 text-sm font-semibold text-brand-navy"
                >
                  {country}
                </span>
              ))}
            </div>

            <p className="mt-6 text-sm leading-7 text-brand-navy/70">
              Best for: {provider.bestFor}. Payout channels available include{" "}
              {provider.payoutChannels.join(", ")}.
            </p>
          </div>

          <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              Compare against the market
            </p>
            <p className="mt-3 text-sm leading-7 text-brand-navy/70">
              SaveRateAfrica recommends checking this provider against the full
              live ranking before every transfer, especially if speed or cash
              pickup matters more than the best pure payout value.
            </p>
            <Link
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-navy px-5 text-sm font-semibold text-white"
              href="/#compare"
            >
              Compare all providers
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
