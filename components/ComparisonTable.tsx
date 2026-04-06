"use client";

import { Activity, BadgePercent, Waves } from "lucide-react";

import { formatDateTime, formatRate } from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";
import type { ComparisonSort } from "@/lib/providers";

import { FilterBar } from "@/components/FilterBar";
import { ProviderCard } from "@/components/ProviderCard";

interface ComparisonTableProps {
  comparison: ComparisonResult;
  isLoading: boolean;
  onSortChange: (value: ComparisonSort) => void;
}

export function ComparisonTable({
  comparison,
  isLoading,
  onSortChange
}: ComparisonTableProps) {
  const bestValueProvider =
    comparison.providers.find((provider) => provider.isBestValue) ??
    comparison.providers[0];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
            Live comparison table
          </p>
          <h2 className="mt-2 font-heading text-3xl text-brand-navy sm:text-4xl">
            Compare fees, speed, and real payout value
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-brand-navy/70 sm:text-base">
            We rank providers by the NGN your recipient actually gets after fees,
            so you are not fooled by headline rates.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <div className="rounded-3xl bg-white p-4 shadow-float">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-green/10">
              <Waves className="h-5 w-5 text-brand-green" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Mid-market
            </p>
            <p className="mt-2 font-mono text-lg text-brand-navy">
              {formatRate(comparison.baseMidMarketRate, comparison.sourceCurrency)}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-float">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-yellow/30">
              <BadgePercent className="h-5 w-5 text-brand-navy" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Top performer
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-navy">
              {bestValueProvider?.name}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-float">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-coral/10">
              <Activity className="h-5 w-5 text-brand-coral" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Refreshed
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-navy">
              {formatDateTime(comparison.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      <FilterBar
        amount={comparison.amount}
        senderCountry={comparison.senderCountry}
        sortBy={comparison.sortBy}
        sourceCurrency={comparison.sourceCurrency}
        onSortChange={onSortChange}
      />

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 rounded-[28px] bg-white/75 backdrop-blur-sm">
            <div className="flex h-full items-center justify-center">
              <div className="rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white">
                Refreshing provider payouts...
              </div>
            </div>
          </div>
        )}

        <div className="flex snap-x gap-4 overflow-x-auto pb-3 md:flex-col md:overflow-visible">
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
