"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import type { ComparisonResult } from "@/lib/fetchRates";
import type { ComparisonSort } from "@/lib/providers";
import { buildNigeriaCorridor } from "@/lib/analytics";
import { formatNaira, formatRate } from "@/lib/format";

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
            Live comparison table
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

        <div className="providers-list overflow-hidden rounded-[16px] border border-[#e0ede2] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-opacity duration-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-[#f4faf5]">
                <tr className="text-[11px] font-black uppercase tracking-[0.12em] text-[#5a8a5a]">
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Rate (NGN/{comparison.sourceCurrency})</th>
                  <th className="px-4 py-3">Amount Received</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleProviders.map((provider, index) => {
                  const isTopProvider = index === 0;

                  return (
                    <tr
                      key={`${comparison.senderCountry}-${provider.slug}-${comparison.amount}-${comparison.sortBy}`}
                      className={`border-t border-[#e0ede2] ${
                        isTopProvider ? "bg-[#e8f5e9]" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{
                              background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
                            }}
                          >
                            {provider.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-[15px] font-black text-[#1a2e1a]">
                                {provider.name}
                              </span>
                              {isTopProvider ? (
                                <span className="rounded-full bg-[#2e7d32] px-2 py-1 text-[9px] font-black uppercase text-white">
                                  Top
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 truncate text-[11px] font-semibold text-[#5a8a5a]">
                              {provider.deliveryLabel}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-bold text-[#1a2e1a]">
                        {formatRate(provider.exchangeRate, comparison.sourceCurrency)}
                      </td>
                      <td className="px-4 py-4 text-[15px] font-black text-[#1b5e20]">
                        {formatNaira(provider.amountReceived, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-bold text-[#1a2e1a]">
                        {provider.fee > 0 ? provider.feeDisplayText : "No Fee"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <TrackedProviderLink
                          affiliateLink={provider.sendUrl}
                          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-[#2e7d32] px-[16px] py-[10px] text-[13px] font-bold text-white transition hover:bg-[#1b5e20]"
                          corridor={buildNigeriaCorridor(comparison.senderCountry)}
                          providerName={provider.name}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Go to {provider.name}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </TrackedProviderLink>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {comparison.providers.length > 5 ? (
            <button
              className="w-full rounded-[10px] border-[1.5px] border-[#1a5c2a] bg-transparent px-4 py-[14px] text-[14px] font-bold text-[#1a5c2a] transition hover:bg-[#f0f7f2]"
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
