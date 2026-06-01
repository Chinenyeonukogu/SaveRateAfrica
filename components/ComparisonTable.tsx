"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";

import type { ComparisonResult } from "@/lib/fetchRates";
import type { ComparisonSort } from "@/lib/providers";
import { buildNigeriaCorridor } from "@/lib/analytics";
import { formatCompact, formatNaira, formatRate } from "@/lib/format";

import { FilterBar } from "@/components/FilterBar";
import { TrackedProviderLink } from "@/components/TrackedProviderLink";

interface ComparisonTableProps {
  comparison: ComparisonResult;
  errorMessage?: string | null;
  isLoading: boolean;
  nextRefreshAt: string;
  onSortChange: (value: ComparisonSort) => void;
}

function LoadingSkeletonCards() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden rounded-[16px] bg-white/88 backdrop-blur-sm">
      <div className="flex h-full flex-col gap-[10px] overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[12px] border border-[#e0ede2] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-light" />
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded-full bg-brand-light" />
                  <div className="h-3 w-44 rounded-full bg-brand-light" />
                </div>
              </div>
              <div className="hidden h-9 w-32 rounded-[8px] bg-brand-light md:block" />
            </div>

            <div className="mt-[10px] flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((__, cardIndex) => (
                <div
                  key={cardIndex}
                  className="h-11 min-w-[120px] flex-1 rounded-[6px] bg-brand-light px-3 py-[5px]"
                >
                  <div className="h-2 w-12 rounded-full bg-white/70" />
                  <div className="mt-2 h-4 w-full rounded-full bg-white/80" />
                </div>
              ))}
            </div>

            <div className="mt-[10px] space-y-2">
              <div className="h-3 w-full rounded-full bg-brand-light" />
              <div className="flex gap-2">
                <div className="h-6 w-20 rounded-full bg-brand-light" />
                <div className="h-6 w-24 rounded-full bg-brand-light" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ComparisonTable({
  comparison,
  errorMessage,
  isLoading,
  nextRefreshAt: _nextRefreshAt,
  onSortChange
}: ComparisonTableProps) {
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const visibleProviders = showAll
    ? comparison.providers
    : comparison.providers.slice(0, 5);

  function handleShowLess() {
    setShowAll(false);

    window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <section ref={sectionRef}>
      <div className="mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
            Live comparison grid
          </p>
          <h2 className="mt-[6px] text-[28px] font-heading text-brand-navy min-[600px]:text-4xl">
            Compare fees, speed, and real payout value
          </h2>
          <p className="mt-4 max-w-2xl text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-base">
            Providers are shown for the selected sender country and current
            corridor details.
          </p>
        </div>
      </div>

      <div className="mb-3">
        <FilterBar
          amount={comparison.amount}
          senderCountry={comparison.senderCountry}
          sortBy={comparison.sortBy}
          sourceCurrency={comparison.sourceCurrency}
          onSortChange={onSortChange}
        />
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-[12px] border border-brand-coral/20 bg-brand-coral/10 px-5 py-4 text-sm font-medium text-brand-navy">
          Live rate refresh failed. Showing the most recent available comparison. {errorMessage}
        </div>
      ) : null}

      <div className="relative">
        {isLoading ? <LoadingSkeletonCards /> : null}

        <div className="providers-grid transition-opacity duration-200">
          <div className="grid gap-4 min-[720px]:grid-cols-2">
            {visibleProviders.map((provider, index) => {
              const isTopProvider = index === 0;

              return (
                <article
                  key={`${comparison.senderCountry}-${provider.slug}-${comparison.amount}-${comparison.sortBy}`}
                  className={`flex h-full flex-col rounded-[12px] border bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${
                    isTopProvider
                      ? "border-[#2e7d32] ring-1 ring-[#2e7d32]/20"
                      : "border-[#e8e8e8]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{
                          background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
                        }}
                      >
                        {provider.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[18px] font-black leading-tight text-[#1a2e1a]">
                            {provider.name}
                          </h3>
                          {isTopProvider ? (
                            <span className="rounded-full bg-[#2e7d32] px-2 py-1 text-[9px] font-black uppercase text-white">
                              Top
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#4a6a4a]">
                          <span className="inline-flex items-center gap-1 text-[#1a2e1a]">
                            <Star className="h-3.5 w-3.5 fill-[#e6a817] text-[#e6a817]" />
                            {provider.rating.toFixed(1)}
                          </span>
                          <span>{formatCompact(provider.reviewCount)} reviews</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      className="shrink-0 text-[12px] font-bold text-[#1a6b3c] hover:text-[#14542f]"
                      href={`/providers/${provider.slug}`}
                    >
                      View details
                    </Link>
                  </div>

                  <p className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-[#3a5a3a]">
                    {provider.summary}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-[8px] border border-[#e0ede2] bg-[#f4faf5] px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#5a8a5a]">
                        Rate
                      </p>
                      <p className="mt-1 text-[13px] font-black text-[#1a2e1a]">
                        {formatRate(provider.exchangeRate, comparison.sourceCurrency)}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#c8e6c9] bg-[#e8f5e9] px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#2e7d32]">
                        Receives
                      </p>
                      <p className="mt-1 text-[13px] font-black text-[#1b5e20]">
                        {formatNaira(provider.amountReceived, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#e0ede2] bg-white px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#5a8a5a]">
                        Fee
                      </p>
                      <p className="mt-1 text-[13px] font-black text-[#1a2e1a]">
                        {provider.fee > 0 ? provider.feeDisplayText : "No Fee"}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#e0ede2] bg-white px-3 py-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#5a8a5a]">
                        Speed
                      </p>
                      <p className="mt-1 text-[13px] font-black text-[#1a2e1a]">
                        {provider.deliveryLabel}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider.payoutChannels.slice(0, 2).map((channel) => (
                      <span
                        key={`${provider.slug}-${channel}`}
                        className="rounded-full bg-[#f4faf5] px-3 py-1 text-[11px] font-bold text-[#2e4a2e]"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#111111] px-3 text-[13px] font-bold text-white transition hover:bg-[#0a1628]"
                      href={`/providers/${provider.slug}`}
                    >
                      Provider review
                    </Link>
                    <TrackedProviderLink
                      affiliateLink={provider.sendUrl}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[10px] bg-[#1a6b3c] px-3 text-[13px] font-bold text-white transition hover:bg-[#14542f]"
                      corridor={buildNigeriaCorridor(comparison.senderCountry)}
                      providerName={provider.name}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Send now
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </TrackedProviderLink>
                  </div>
                </article>
              );
            })}
          </div>

          {comparison.providers.length > 5 ? (
            <button
              className="mt-4 w-full rounded-[10px] border-[1.5px] border-[#1a5c2a] bg-transparent px-4 py-[14px] text-[14px] font-bold text-[#1a5c2a] transition hover:bg-[#f0f7f2]"
              type="button"
              onClick={showAll ? handleShowLess : () => setShowAll(true)}
            >
              {showAll
                ? "Show less ↑"
                : `See all ${comparison.providers.length} providers ↓`}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
