"use client";

import { useDeferredValue, useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Sparkles,
  TrendingDown,
  TrendingUp
} from "lucide-react";

import { formatCurrency, formatNaira } from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";
import {
  buildCorridorInsight,
  buildManualBestTimeRecommendation,
  type CorridorInsight,
  type InsightConfidence
} from "@/lib/marketSnapshot";

interface BestTimeResponse {
  confidence: InsightConfidence;
  mode: "gemini" | "manual";
  recommendation: string;
  snapshot: CorridorInsight;
  source: "gemini" | "manual-analyst-view";
}

interface BestTimeToSendProps {
  comparison: ComparisonResult;
}

function getConfidenceWidth(confidence: InsightConfidence) {
  if (confidence === "High") {
    return "w-full";
  }

  if (confidence === "Medium") {
    return "w-2/3";
  }

  return "w-1/3";
}

function Sparkline({ values }: { values: number[] }) {
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(maxValue - minValue, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      className="h-16 w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="best-time-line" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#00C853" />
          <stop offset="100%" stopColor="#FFD600" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        points={points}
        stroke="url(#best-time-line)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function BestTimeToSend({ comparison }: BestTimeToSendProps) {
  const deferredAmount = useDeferredValue(comparison.amount);
  const localInsight = buildCorridorInsight(comparison);
  const [insight, setInsight] = useState<BestTimeResponse>({
    confidence: localInsight.confidence,
    mode: "manual",
    recommendation: buildManualBestTimeRecommendation(localInsight),
    snapshot: localInsight,
    source: "manual-analyst-view"
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const fallbackInsight = buildCorridorInsight(comparison);

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/best-time?senderCountry=${comparison.senderCountry}&amount=${deferredAmount}`,
          {
            cache: "no-store",
            signal: abortController.signal
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch AI rate intelligence.");
        }

        const payload = (await response.json()) as BestTimeResponse;
        setInsight(payload);
      } catch {
        setInsight({
          confidence: fallbackInsight.confidence,
          mode: "manual",
          recommendation: buildManualBestTimeRecommendation(fallbackInsight),
          snapshot: fallbackInsight,
          source: "manual-analyst-view"
        });
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [comparison, deferredAmount]);

  const trendIcon =
    insight.snapshot.trend === "UP" ? (
      <TrendingUp className="h-5 w-5 text-brand-green" />
    ) : (
      <TrendingDown className="h-5 w-5 text-brand-coral" />
    );

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

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[14px] border border-[#c8e6c9] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                Analyst call
              </p>
              <p className="mt-2 text-[12px] text-brand-navy/60 min-[600px]:text-sm">
                {insight.mode === "manual"
                  ? "Manual Analyst View"
                  : "Live Gemini guidance"}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f4faf5] px-3 py-2 text-[12px] font-semibold min-[600px]:text-sm">
              {trendIcon}
              {insight.snapshot.trend}
            </div>
          </div>

          <div className="mt-5 rounded-[12px] bg-[#f4faf5] p-5">
            <p className="text-base leading-8 text-brand-navy min-[600px]:text-lg">
              {isLoading ? "Reading the market pulse for you..." : insight.recommendation}
            </p>
          </div>

          <div className="mt-5 grid gap-[14px] min-[600px]:grid-cols-3">
            <div className="rounded-[10px] border border-[#c8e6c9] bg-white p-[14px]">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-navy/45">
                Current rate
              </p>
              <p className="mt-2 text-base font-semibold text-brand-navy min-[600px]:text-lg">
                {insight.snapshot.currentRate.toFixed(2)} NGN/{insight.snapshot.sourceCurrency}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#c8e6c9] bg-white p-[14px]">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-navy/45">
                7-day average
              </p>
              <p className="mt-2 text-base font-semibold text-brand-navy min-[600px]:text-lg">
                {insight.snapshot.sevenDayAverage.toFixed(2)} NGN/{insight.snapshot.sourceCurrency}
              </p>
            </div>
            <div className="rounded-[10px] border border-[#c8e6c9] bg-white p-[14px]">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-navy/45">
                Weekly move
              </p>
              <p className="mt-2 text-base font-semibold text-brand-navy min-[600px]:text-lg">
                {formatNaira(insight.snapshot.weeklyTransferDeltaNaira, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[14px] border border-[#c8e6c9] bg-white p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-green" />
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-navy/60 min-[600px]:text-sm">
                Confidence meter
              </p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#f4faf5]">
              <div
                className={`${getConfidenceWidth(insight.confidence)} h-full rounded-full bg-brand-green transition-all duration-500`}
              />
            </div>
            <p className="mt-3 text-[12px] text-brand-navy/70 min-[600px]:text-sm">
              {insight.confidence} confidence based on current-vs-average spread
              and 7-day volatility.
            </p>
          </div>

          <div className="rounded-[14px] border border-[#c8e6c9] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-navy/60 min-[600px]:text-sm">
                  Trend sparkline
                </p>
                <p className="mt-2 text-[12px] text-brand-navy/60 min-[600px]:text-sm">
                  {formatCurrency(insight.snapshot.amount, insight.snapshot.sourceCurrency, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })} sender context
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-brand-green" />
            </div>
            <div className="mt-4 rounded-[12px] bg-[#f4faf5] p-3">
              <Sparkline values={insight.snapshot.sparkline} />
            </div>
          </div>

          <div className="rounded-[14px] border border-[#c8e6c9] bg-white p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-navy/60 min-[600px]:text-sm">
              Provider spread today
            </p>
            <p className="mt-3 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
              {insight.snapshot.bestProvider} is beating {insight.snapshot.worstProvider} by{" "}
              <span className="font-semibold text-brand-green">
                {formatNaira(insight.snapshot.maxSavings, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>{" "}
              on the current route.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
