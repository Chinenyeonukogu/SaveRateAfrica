"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Clock3, Info, Star } from "lucide-react";

import { formatCompact, formatCurrency, formatNaira, formatRate } from "@/lib/format";
import type { ComparisonProviderRow } from "@/lib/fetchRates";
import type { SourceCurrency } from "@/lib/providers";

interface ProviderCardProps {
  index: number;
  provider: ComparisonProviderRow;
  sourceCurrency: SourceCurrency;
}

export function ProviderCard({
  index,
  provider,
  sourceCurrency
}: ProviderCardProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const hasFee = provider.fee > 0;

  return (
    <motion.article
      animate={{ opacity: 1, x: 0 }}
      className="relative min-w-[84%] snap-center rounded-[28px] border border-brand-navy/10 bg-white p-5 shadow-float md:min-w-0"
      initial={{ opacity: 0, x: 24 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      {provider.isBestValue && (
        <div className="absolute left-5 top-0 -translate-y-1/2 rounded-full bg-brand-coral px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
          Best value
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-heading text-white"
            style={{
              background: `linear-gradient(145deg, ${provider.logoFrom}, ${provider.logoTo})`
            }}
          >
            {provider.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h3 className="font-heading text-2xl text-brand-navy">{provider.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-brand-navy/70">
              <div className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                {provider.rating.toFixed(1)}
              </div>
              <div>{formatCompact(provider.reviewCount)} reviews</div>
              <div className="inline-flex items-center gap-1 rounded-full bg-brand-green/10 px-3 py-1 text-brand-green">
                <BadgeCheck className="h-4 w-4" />
                Trusted route
              </div>
              {!hasFee ? (
                <div className="inline-flex items-center gap-1 rounded-full bg-brand-green px-3 py-1 font-semibold text-white">
                  No Fee ✅
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <a
          className="hidden min-h-12 items-center gap-2 rounded-2xl bg-brand-green px-4 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:shadow-glow md:inline-flex"
          href={provider.sendUrl}
          rel="noreferrer"
          target="_blank"
        >
          Send Now
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      <div
        className={`mt-6 grid gap-3 sm:grid-cols-2 ${
          hasFee ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        <div className="rounded-2xl bg-brand-light p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/50">
            Exchange rate
          </p>
          <div
            className="relative mt-2"
            onMouseLeave={() => setIsTooltipOpen(false)}
          >
            <button
              aria-expanded={isTooltipOpen}
              className="inline-flex items-center gap-2 text-left font-mono text-lg text-brand-navy"
              type="button"
              onBlur={() => setIsTooltipOpen(false)}
              onClick={() => setIsTooltipOpen((current) => !current)}
              onFocus={() => setIsTooltipOpen(true)}
              onMouseEnter={() => setIsTooltipOpen(true)}
            >
              <span>{formatRate(provider.exchangeRate, sourceCurrency)}</span>
              <Info className="h-4 w-4 text-brand-navy/45" />
            </button>

            {isTooltipOpen ? (
              <div className="absolute left-0 top-full z-20 mt-2 w-64 rounded-2xl bg-brand-navy px-4 py-3 text-xs font-medium leading-5 text-white shadow-float">
                This rate is estimated based on {provider.name}&apos;s published
                spread. Click Send Now to see exact rate.
              </div>
            ) : null}
          </div>
        </div>

        {hasFee ? (
          <div className="rounded-2xl bg-brand-light p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/50">
              Transfer fee
            </p>
            <p className="mt-2 text-lg font-semibold text-brand-coral">
              {formatCurrency(provider.fee, sourceCurrency)}
            </p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-brand-green/20 bg-brand-green/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
            Amount received
          </p>
          <p className="mt-2 text-2xl font-heading text-brand-navy">
            {formatNaira(provider.amountReceived, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </p>
        </div>

        <div className="rounded-2xl bg-brand-light p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/50">
            Delivery
          </p>
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-brand-navy">
            <Clock3 className="h-4 w-4 text-brand-coral" />
            {provider.deliveryLabel}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-brand-navy/10 pt-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-navy">{provider.bestFor}</p>
          <p className="mt-1 text-sm leading-6 text-brand-navy/70">{provider.trustNote}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {provider.payoutChannels.map((channel) => (
              <span
                key={channel}
                className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-medium text-brand-navy/70"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>

        <a
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-green px-4 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:shadow-glow md:hidden"
          href={provider.sendUrl}
          rel="noreferrer"
          target="_blank"
        >
          Send Now
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}
