"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search, Star } from "lucide-react";

import { feeBandLabel, speedBandLabel, type Provider, type SenderCountry } from "@/lib/providers";
import { formatCompact } from "@/lib/format";
import { getProviderAffiliateLink } from "@/lib/affiliateLinks";
import { buildNigeriaCorridor } from "@/lib/analytics";
import { TrackedProviderLink } from "@/components/TrackedProviderLink";

interface ProvidersDirectoryClientProps {
  providers: Provider[];
}

export function ProvidersDirectoryClient({
  providers
}: ProvidersDirectoryClientProps) {
  const [country, setCountry] = useState<SenderCountry | "All">("All");
  const [speed, setSpeed] = useState<"All" | "instant" | "same-day" | "standard">("All");
  const [feeRange, setFeeRange] = useState<"All" | "low" | "medium" | "premium">("All");
  const [rating, setRating] = useState<"All" | "4.0" | "4.5">("All");

  const filteredProviders = providers.filter((provider) => {
    const matchesCountry =
      country === "All" || provider.supportedSenderCountries.includes(country);
    const matchesSpeed = speed === "All" || provider.speedBand === speed;
    const matchesFee = feeRange === "All" || provider.feeBand === feeRange;
    const matchesRating =
      rating === "All" || provider.rating >= Number.parseFloat(rating);

    return matchesCountry && matchesSpeed && matchesFee && matchesRating;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-brand-navy/10 bg-white p-5 shadow-float">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              Filter providers
            </p>
            <h2 className="mt-2 font-heading text-3xl text-brand-navy">
              Compare and Save more.
            </h2>
          </div>
          <div className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-light px-4 text-sm font-semibold text-brand-navy/70">
            <Search className="h-4 w-4" />
            {filteredProviders.length} providers match
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm font-medium text-brand-navy/70">
            Country
            <select
              className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 outline-none"
              value={country}
              onChange={(event) => setCountry(event.target.value as SenderCountry | "All")}
            >
              <option value="All">All countries</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-brand-navy/70">
            Speed
            <select
              className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 outline-none"
              value={speed}
              onChange={(event) =>
                setSpeed(
                  event.target.value as "All" | "instant" | "same-day" | "standard"
                )
              }
            >
              <option value="All">All speeds</option>
              <option value="instant">Instant</option>
              <option value="same-day">Same day</option>
              <option value="standard">1-3 days</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-brand-navy/70">
            Fee range
            <select
              className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 outline-none"
              value={feeRange}
              onChange={(event) =>
                setFeeRange(event.target.value as "All" | "low" | "medium" | "premium")
              }
            >
              <option value="All">All fee bands</option>
              <option value="low">Low fees</option>
              <option value="medium">Balanced fees</option>
              <option value="premium">Higher fees</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-brand-navy/70">
            Minimum rating
            <select
              className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 outline-none"
              value={rating}
              onChange={(event) => setRating(event.target.value as "All" | "4.0" | "4.5")}
            >
              <option value="All">All ratings</option>
              <option value="4.5">4.5 and up</option>
              <option value="4.0">4.0 and up</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredProviders.map((provider) => (
          <ProviderDirectoryCard
            key={provider.slug}
            country={country}
            provider={provider}
          />
        ))}
      </div>
    </div>
  );
}

function ProviderDirectoryCard({
  country,
  provider
}: {
  country: SenderCountry | "All";
  provider: Provider;
}) {
  const origin = country === "All" ? undefined : country;
  const affiliateLink = getProviderAffiliateLink(provider.slug, {
    origin,
    placement: "providers-directory"
  });
  const corridor = buildNigeriaCorridor(origin ?? "All");

  return (
    <article className="flex h-full flex-col rounded-[12px] border border-[#e8e8e8] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading text-base text-white"
            style={{
              background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
            }}
          >
            {provider.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-[22px] font-bold leading-tight text-brand-navy">
              {provider.name}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-brand-navy/70">
              <span className="inline-flex items-center gap-1 text-brand-navy">
                <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                {provider.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{formatCompact(provider.reviewCount)} reviews</span>
            </div>
          </div>
        </div>

        <Link
          className="shrink-0 text-sm font-bold text-brand-green hover:text-[#1a6b3c]"
          href={`/providers/${provider.slug}`}
        >
          View details
        </Link>
      </div>

      <p
        className="mt-5 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-6 text-brand-navy/70"
        title={provider.summary}
      >
        {provider.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
          {speedBandLabel[provider.speedBand]}
        </span>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-navy/70">
          {feeBandLabel[provider.feeBand]}
        </span>
        {provider.supportedSenderCountries.map((countryCode) => (
          <span
            key={`${provider.slug}-${countryCode}`}
            className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-semibold text-brand-navy/70"
          >
            {countryCode}
          </span>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
        <Link
          className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-[#111111] px-4 text-sm font-bold text-white transition hover:bg-brand-navy"
          href={`/providers/${provider.slug}`}
        >
          Provider review
        </Link>
        <TrackedProviderLink
          affiliateLink={affiliateLink}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] bg-[#1a6b3c] px-4 text-sm font-bold text-white transition hover:bg-[#14542f]"
          corridor={corridor}
          providerName={provider.name}
          rel="noopener noreferrer"
          target="_blank"
        >
          Send now
          <ArrowUpRight className="h-4 w-4" />
        </TrackedProviderLink>
      </div>
    </article>
  );
}
