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
      <div className="flex h-full flex-col gap-3 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[12px] border border-[#c8e6c9] bg-white px-6 py-5 shadow-float"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-light" />
                <div className="space-y-3">
                  <div className="h-6 w-32 rounded-full bg-brand-light" />
                  <div className="h-4 w-40 rounded-full bg-brand-light" />
                </div>
              </div>
              <div className="hidden h-12 w-28 rounded-2xl bg-brand-light md:block" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((__, cardIndex) => (
                <div
                  key={cardIndex}
                  className="rounded-2xl bg-brand-light p-4"
                >
                  <div className="h-3 w-20 rounded-full bg-white/70" />
                  <div className="mt-3 h-6 w-full rounded-full bg-white/80" />
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-brand-navy/10 pt-5">
              <div className="h-4 w-44 rounded-full bg-brand-light" />
              <div className="h-4 w-full rounded-full bg-brand-light" />
              <div className="flex gap-2">
                <div className="h-7 w-20 rounded-full bg-brand-light" />
                <div className="h-7 w-24 rounded-full bg-brand-light" />
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
  return (
    <section>
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

      <div className="mb-6">
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

        <div className="flex flex-col gap-3">
          {comparison.providers.map((provider, index) => (
            <ProviderCard
              key={`${comparison.senderCountry}-${provider.slug}-${comparison.amount}`}
              index={index}
              provider={provider}
              sourceCurrency={comparison.sourceCurrency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
