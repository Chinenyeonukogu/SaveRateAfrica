"use client";

import { BadgeCheck, Sparkles } from "lucide-react";

import { formatNaira } from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";
import { buildCorridorInsight } from "@/lib/marketSnapshot";

interface BestTimeToSendProps {
  comparison: ComparisonResult;
}

export function BestTimeToSend({ comparison }: BestTimeToSendProps) {
  const insight = buildCorridorInsight(comparison);

  return (
    <section className="rounded-[16px] border border-[#c8e6c9] bg-[#f4faf5] p-4 text-brand-navy shadow-float min-[600px]:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8e6c9] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
            <Sparkles className="h-4 w-4" />
            AI Rate Intelligence
          </div>
          <h2 className="mt-4 text-[28px] font-heading min-[600px]:text-3xl">
            Best time to send to Nigeria
          </h2>
          <p className="mt-3 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
            Live market context meets Gemini reasoning, with a manual analyst
            fallback if AI is unavailable.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#c8e6c9] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/60">
          <BadgeCheck className="h-4 w-4 text-brand-green" />
          Powered by Gemini AI
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div className="rounded-[14px] border border-[#c8e6c9] bg-white p-5">
          <div className="grid gap-[14px] min-[600px]:grid-cols-3">
            <div className="rounded-[10px] border border-[#c8e6c9] bg-white p-[14px]">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-navy/45">
                Current rate
              </p>
              <p className="mt-2 text-base font-semibold text-brand-navy min-[600px]:text-lg">
                {insight.currentRate.toFixed(2)} NGN/{insight.sourceCurrency}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#c8e6c9] bg-white p-[14px]">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-navy/45">
                7-day average
              </p>
              <p className="mt-2 text-base font-semibold text-brand-navy min-[600px]:text-lg">
                {insight.sevenDayAverage.toFixed(2)} NGN/{insight.sourceCurrency}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#c8e6c9] bg-white p-[14px]">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-navy/45">
                Weekly move
              </p>
              <p className="mt-2 text-base font-semibold text-brand-navy min-[600px]:text-lg">
                {formatNaira(insight.weeklyTransferDeltaNaira, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] border border-[#c8e6c9] bg-white p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-navy/60 min-[600px]:text-sm">
            Provider spread today
          </p>
          <p className="mt-3 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
            {insight.bestProvider} is beating {insight.worstProvider} by{" "}
            <span className="font-semibold text-brand-green">
              {formatNaira(insight.maxSavings, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>{" "}
            on the current route.
          </p>
        </div>
      </div>
    </section>
  );
}
