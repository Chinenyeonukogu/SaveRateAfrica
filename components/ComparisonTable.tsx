"use client";

import { useEffect, useState } from "react";
import { Activity, BadgePercent, Waves } from "lucide-react";

import {
  formatDateTime,
  formatRate,
  formatRefreshCountdown,
  formatRelativeTime
} from "@/lib/format";
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

function getFreshnessState(updatedAt: string, now: number) {
  const ageMs = Math.max(now - new Date(updatedAt).getTime(), 0);

  if (ageMs < 5 * 60_000) {
    return {
      label: "Live",
      dotClassName: "bg-brand-green",
      textClassName: "text-brand-green"
    };
  }

  if (ageMs < 10 * 60_000) {
    return {
      label: "Recent",
      dotClassName: "bg-brand-yellow",
      textClassName: "text-[#A46D00]"
    };
  }

  return {
    label: "Delayed",
    dotClassName: "bg-brand-coral",
    textClassName: "text-brand-coral"
  };
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
  nextRefreshAt,
  onSortChange
}: ComparisonTableProps) {
  const snapshotNow = new Date(comparison.updatedAt).getTime();
  const initialNow = Number.isFinite(snapshotNow) ? snapshotNow : 0;
  const [now, setNow] = useState(initialNow);
  const bestValueProvider =
    comparison.providers.find((provider) => provider.isBestValue) ??
    comparison.providers[0];
  const freshness = getFreshnessState(comparison.updatedAt, now);

  useEffect(() => {
    setNow(Date.now());

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-green">
            Live comparison table
          </p>
          <h2 className="mt-[6px] text-[28px] font-heading text-brand-navy min-[600px]:text-4xl">
            Compare fees, speed, and real payout value
          </h2>
          <p className="mt-4 max-w-2xl text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-base">
            We rank providers by the NGN your recipient actually gets after fees,
            so you are not fooled by headline rates.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-4 shadow-float">
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
          <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-4 shadow-float">
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
          <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-4 shadow-float">
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

      <div className="mt-6 flex flex-col gap-2 text-xs text-brand-navy/55 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold ${freshness.textClassName}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${freshness.dotClassName}`} />
            {freshness.label}
          </span>
          <span>Rates updated {formatRelativeTime(comparison.updatedAt, now)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span>Refreshing in {formatRefreshCountdown(nextRefreshAt, now)}</span>
          <span>
            Source updated {formatRelativeTime(comparison.sourceUpdatedAt, now)}
          </span>
        </div>
      </div>
    </section>
  );
}
