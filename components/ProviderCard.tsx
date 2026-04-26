"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, Info, Star } from "lucide-react";

import { formatCompact, formatNaira, formatRate } from "@/lib/format";
import { getDeliverySortValue, type ComparisonProviderRow } from "@/lib/fetchRates";
import type { SourceCurrency } from "@/lib/providers";

interface ProviderCardProps {
  index: number;
  provider: ComparisonProviderRow;
  sourceCurrency: SourceCurrency;
}

function neutralizeRankingLanguage(value: string) {
  return value
    .replace(/\bbest-value\b/gi, "top pick value")
    .replace(/\bbest\b/gi, "top pick")
    .replace(/\bworst\b/gi, "popular");
}

export function ProviderCard({
  index,
  provider,
  sourceCurrency
}: ProviderCardProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const hasFee = provider.fee > 0;
  const providerCtaLabel = `Go to ${provider.name}`;
  const providerRedirectNote = `You will be redirected to ${provider.name}'s website`;
  const providerDescription = [
    provider.bestFor,
    provider.trustNote,
    provider.transferFeeNote
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => neutralizeRankingLanguage(value))
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(" · ");

  return (
    <motion.article
      animate={{ opacity: 1, x: 0 }}
      className="provider-card relative rounded-[12px] border border-[#e0ede2] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-[opacity,box-shadow] duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
      data-delivery={getDeliverySortValue(provider.deliveryLabel)}
      data-fee={provider.fee.toFixed(2)}
      data-rate={provider.exchangeRate.toFixed(2)}
      initial={{ opacity: 0, x: 24 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <div className="mb-[10px] flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex items-start gap-2">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{
              background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
            }}
          >
            {provider.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="min-w-0 flex flex-wrap items-center gap-2">
            <h3 className="text-[17px] font-bold leading-[1.3] text-[#1a2e1a]">
              {provider.name}
            </h3>

            <span className="inline-flex items-center gap-1 text-[13px] text-[#e6a817]">
              <Star className="h-3.5 w-3.5 fill-[#e6a817] text-[#e6a817]" />
              {provider.rating.toFixed(1)}
            </span>

            <span className="text-[12px] font-semibold text-[#4a6a4a]">
              {formatCompact(provider.reviewCount)} reviews
            </span>

            <span className="inline-flex items-center rounded-full border border-[#e0ede2] bg-[#f4faf5] px-[10px] py-[3px] text-[12px] font-semibold text-[#2e7d32]">
              Trusted route
            </span>

            {!hasFee ? (
              <span className="inline-flex items-center rounded-full border border-[#c8e6c9] bg-[#e8f5e9] px-[10px] py-[3px] text-[13px] font-bold text-[#1b5e20]">
                No Fee ✅
              </span>
            ) : null}
          </div>
        </div>

        <div className="hidden shrink-0 flex-col items-end md:flex">
          <a
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-[#2e7d32] px-[18px] py-[10px] text-[13px] font-bold text-white transition hover:bg-[#1b5e20]"
            href={provider.sendUrl}
            rel="noreferrer"
            target="_blank"
          >
            {providerCtaLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <span className="mt-1 max-w-[180px] text-right text-[12px] font-semibold leading-[1.4] text-[#2e4a2e]">
            {providerRedirectNote}
          </span>
        </div>
      </div>

      <div className="mb-[10px] flex flex-wrap gap-2 lg:flex-nowrap">
        <div className="min-w-[135px] flex-1 rounded-[6px] border border-[#c8e6c9] bg-[linear-gradient(135deg,#fffdf2_0%,#eef8ef_100%)] px-3 py-[5px] text-[14px] shadow-[0_1px_2px_rgba(46,125,50,0.08)]">
          <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#5a8a5a]">
            Rate
          </p>
          <div
            className="relative mt-[2px]"
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            <button
              aria-expanded={isTooltipOpen}
              className="inline-flex items-center gap-1.5 text-left text-[14px] font-bold text-[#1a2e1a]"
              type="button"
              onBlur={() => setIsTooltipOpen(false)}
              onClick={() => setIsTooltipOpen((current) => !current)}
              onFocus={() => setIsTooltipOpen(true)}
              onMouseEnter={() => setIsTooltipOpen(true)}
            >
              <span>{formatRate(provider.exchangeRate, sourceCurrency)}</span>
              <Info className="h-3.5 w-3.5 text-[#5a8a5a]" />
            </button>

            {isTooltipOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-[12px] bg-brand-navy px-3 py-2 text-[11px] font-medium leading-5 text-white shadow-float">
                This rate is estimated based on {provider.name}&apos;s published
                spread. Click {providerCtaLabel} to see exact rate.
              </div>
            ) : null}
          </div>
        </div>

        <div className="min-w-[135px] flex-1 rounded-[6px] border border-[#c8e6c9] bg-[#e8f5e9] px-3 py-[5px] text-[14px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2e7d32]">
            Receives
          </p>
          <p className="mt-[2px] text-[14px] font-bold text-[#1b5e20]">
            {formatNaira(provider.amountReceived, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>

        <div className="min-w-[120px] flex-1 rounded-[6px] border border-[#e0ede2] bg-[#f4faf5] px-3 py-[5px] text-[14px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#5a8a5a]">
            Delivery
          </p>
          <div className="mt-[2px] flex items-center gap-1.5 text-[14px] font-bold text-[#1a2e1a]">
            <Clock3 className="h-3.5 w-3.5 text-[#5a8a5a]" />
            {provider.deliveryLabel}
          </div>
        </div>

        <div
          className={`min-w-[120px] flex-1 rounded-[6px] border px-3 py-[5px] text-[14px] ${
            hasFee
              ? "border-[#e0ede2] bg-[#f4faf5]"
              : "border-[#c8e6c9] bg-[#e8f5e9]"
          }`}
        >
          <p
            className={`text-[11px] font-bold uppercase tracking-[0.8px] ${
              hasFee ? "text-[#5a8a5a]" : "text-[#5a8a5a]"
            }`}
          >
            Fee
          </p>
          <p
            className={`mt-[2px] text-[14px] font-bold ${
              hasFee ? "text-[#1a2e1a]" : "text-[#1b5e20]"
            }`}
          >
            {hasFee ? provider.feeDisplayText : "No Fee ✅"}
          </p>
        </div>
      </div>

      <div className="mb-[10px] md:hidden">
        <a
          className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-[#2e7d32] px-[18px] py-[10px] text-[13px] font-bold text-white transition hover:bg-[#1b5e20]"
          href={provider.sendUrl}
          rel="noreferrer"
          target="_blank"
        >
          {providerCtaLabel}
          <ArrowUpRight className="h-4 w-4" />
        </a>
        <span className="mt-1 block text-right text-[12px] font-semibold leading-[1.4] text-[#2e4a2e]">
          {providerRedirectNote}
        </span>
      </div>

      <div className="flex flex-col gap-[6px] lg:flex-row lg:items-center lg:justify-between">
        <p
          className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[#3a5a3a]"
          title={providerDescription}
        >
          {providerDescription}
        </p>

        <div className="flex flex-wrap gap-2">
          {provider.payoutChannels.map((channel) => (
            <span
              key={channel}
              className="rounded-full border border-[#c8e6c9] bg-[#f4faf5] px-[10px] py-[3px] text-[12px] font-semibold text-[#2e4a2e]"
            >
              {channel}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
