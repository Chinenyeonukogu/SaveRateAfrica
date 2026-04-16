"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Search, Star } from "lucide-react";

import { feeBandLabel, speedBandLabel, type Provider, type SenderCountry } from "@/lib/providers";
import { formatCompact } from "@/lib/format";
import { getProviderAffiliateLink } from "@/lib/affiliateLinks";

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
              Find the best route for your send pattern
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

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredProviders.map((provider) => (
          <article
            key={provider.slug}
            className="rounded-[28px] border border-brand-navy/10 bg-white p-5 shadow-float"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl font-heading text-lg text-white"
                  style={{
                    background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
                  }}
                >
                  {provider.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-heading text-2xl text-brand-navy">
                    {provider.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-sm text-brand-navy/70">
                    <div className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                      {provider.rating.toFixed(1)}
                    </div>
                    <span>{formatCompact(provider.reviewCount)} reviews</span>
                  </div>
                </div>
              </div>

              <Link
                className="hidden min-h-12 items-center rounded-2xl bg-brand-light px-4 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white md:inline-flex"
                href={`/providers/${provider.slug}`}
              >
                View details
              </Link>
            </div>

            <p className="mt-5 text-sm leading-7 text-brand-navy/70">
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

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-navy px-5 text-sm font-semibold text-white hover:shadow-float"
                href={`/providers/${provider.slug}`}
              >
                Provider review
              </Link>
              <a
                className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-green px-5 text-sm font-semibold text-white hover:shadow-glow"
                href={getProviderAffiliateLink(provider.slug, {
                  placement: "providers-directory"
                })}
                rel="noreferrer"
                target="_blank"
              >
                Send now
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
