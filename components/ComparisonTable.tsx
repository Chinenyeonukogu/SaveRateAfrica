"use client";

import { useRef, useState } from "react";

import type { ComparisonResult } from "@/lib/fetchRates";
import type { ComparisonSort } from "@/lib/providers";

import { FilterBar } from "@/components/FilterBar";
import { ProviderCard } from "@/components/ProviderCard";

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
            Every provider is ranked by the exact amount your recipient receives in
            Nigeria
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

        <div className="providers-list flex flex-col gap-[10px] transition-opacity duration-200">
          {visibleProviders.map((provider, index) => (
            <ProviderCard
              key={`${comparison.senderCountry}-${provider.slug}-${comparison.amount}-${comparison.sortBy}`}
              index={index}
              provider={provider}
              sourceCurrency={comparison.sourceCurrency}
            />
          ))}

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
