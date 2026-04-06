import {
  formatCurrency,
  formatDateTime,
  formatNaira,
  formatRate
} from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";
import type { SenderCountry, SourceCurrency } from "@/lib/providers";
import { trendSeries } from "@/lib/site-data";

export type InsightTrend = "UP" | "DOWN";
export type InsightConfidence = "High" | "Medium" | "Low";

export const AI_CONTEXT_COUNTRIES: SenderCountry[] = ["USA", "UK", "Canada"];

export interface CurrencyInsight {
  currency: SourceCurrency;
  currentRate: number;
  sevenDayAverage: number;
  weeklyDifferenceRate: number;
  weeklyDifferencePercent: number;
  weeklyTransferDeltaNaira: number;
  volatilityPercent: number;
  trend: InsightTrend;
  sparkline: number[];
}

export interface CorridorInsight {
  senderCountry: SenderCountry;
  sourceCurrency: SourceCurrency;
  amount: number;
  bestProvider: string;
  bestAmount: number;
  worstProvider: string;
  worstAmount: number;
  maxSavings: number;
  currentRate: number;
  sevenDayAverage: number;
  weeklyDifferenceRate: number;
  weeklyDifferencePercent: number;
  weeklyTransferDeltaNaira: number;
  volatilityPercent: number;
  trend: InsightTrend;
  confidence: InsightConfidence;
  updatedAt: string;
  sparkline: number[];
}

export interface MarketSnapshot {
  amount: number;
  updatedAt: string;
  lastUpdatedLabel: string;
  baseRates: Record<SourceCurrency, CurrencyInsight>;
  corridors: Record<SenderCountry, CorridorInsight>;
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function getSevenDaySeries(currency: SourceCurrency, currentRate: number) {
  const historicalSeries = trendSeries["7D"]
    .slice(0, 6)
    .map((entry) => entry[currency]);

  return [...historicalSeries, roundToTwo(currentRate)];
}

function getAverage(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getAverageAbsoluteMove(values: number[]) {
  if (values.length < 2) {
    return 0;
  }

  const totalMove = values
    .slice(1)
    .reduce((sum, value, index) => sum + Math.abs(value - values[index]), 0);

  return totalMove / (values.length - 1);
}

function getTrend(currentRate: number, sevenDayAverage: number): InsightTrend {
  return currentRate >= sevenDayAverage ? "UP" : "DOWN";
}

function getConfidence(
  weeklyDifferencePercent: number,
  volatilityPercent: number
): InsightConfidence {
  const signalStrength = Math.abs(weeklyDifferencePercent);

  if (signalStrength >= Math.max(volatilityPercent * 0.75, 0.35)) {
    return "High";
  }

  if (signalStrength >= Math.max(volatilityPercent * 0.35, 0.15)) {
    return "Medium";
  }

  return "Low";
}

export function buildCurrencyInsight(
  currency: SourceCurrency,
  currentRate: number,
  amount = 500
): CurrencyInsight {
  const sparkline = getSevenDaySeries(currency, currentRate);
  const sevenDayAverage = roundToTwo(getAverage(sparkline));
  const averageAbsoluteMove = getAverageAbsoluteMove(sparkline);
  const weeklyDifferenceRate = roundToTwo(currentRate - sevenDayAverage);
  const weeklyDifferencePercent = roundToTwo(
    (weeklyDifferenceRate / sevenDayAverage) * 100
  );
  const volatilityPercent = roundToTwo(
    (averageAbsoluteMove / sevenDayAverage) * 100
  );

  return {
    currency,
    currentRate: roundToTwo(currentRate),
    sevenDayAverage,
    weeklyDifferenceRate,
    weeklyDifferencePercent,
    weeklyTransferDeltaNaira: roundToTwo(amount * weeklyDifferenceRate),
    volatilityPercent,
    trend: getTrend(currentRate, sevenDayAverage),
    sparkline
  };
}

export function buildCorridorInsight(comparison: ComparisonResult): CorridorInsight {
  const sourceCurrency = comparison.sourceCurrency;
  const rateInsight = buildCurrencyInsight(
    sourceCurrency,
    comparison.liveBaseRates[sourceCurrency],
    comparison.amount
  );

  return {
    senderCountry: comparison.senderCountry,
    sourceCurrency,
    amount: comparison.amount,
    bestProvider: comparison.savings.bestProvider,
    bestAmount: comparison.savings.bestAmount,
    worstProvider: comparison.savings.worstProvider,
    worstAmount: comparison.savings.worstAmount,
    maxSavings: comparison.savings.maxSavings,
    currentRate: rateInsight.currentRate,
    sevenDayAverage: rateInsight.sevenDayAverage,
    weeklyDifferenceRate: rateInsight.weeklyDifferenceRate,
    weeklyDifferencePercent: rateInsight.weeklyDifferencePercent,
    weeklyTransferDeltaNaira: rateInsight.weeklyTransferDeltaNaira,
    volatilityPercent: rateInsight.volatilityPercent,
    trend: rateInsight.trend,
    confidence: getConfidence(
      rateInsight.weeklyDifferencePercent,
      rateInsight.volatilityPercent
    ),
    updatedAt: comparison.updatedAt,
    sparkline: rateInsight.sparkline
  };
}

export function buildMarketSnapshot(
  comparisons: ComparisonResult[],
  amount = comparisons[0]?.amount ?? 500
): MarketSnapshot {
  const primaryComparison = comparisons[0];

  if (!primaryComparison) {
    throw new Error("At least one comparison result is required to build market context.");
  }

  const liveBaseRates = primaryComparison.liveBaseRates;
  const corridors = Object.fromEntries(
    comparisons.map((comparison) => [
      comparison.senderCountry,
      buildCorridorInsight(comparison)
    ])
  ) as Record<SenderCountry, CorridorInsight>;

  return {
    amount,
    updatedAt: primaryComparison.updatedAt,
    lastUpdatedLabel: formatDateTime(primaryComparison.updatedAt),
    baseRates: {
      USD: buildCurrencyInsight("USD", liveBaseRates.USD, amount),
      GBP: buildCurrencyInsight("GBP", liveBaseRates.GBP, amount),
      CAD: buildCurrencyInsight("CAD", liveBaseRates.CAD, amount)
    },
    corridors
  };
}

export function formatMarketSnapshot(snapshot: MarketSnapshot) {
  const baseRateLines = (["USD", "GBP", "CAD"] as const)
    .map((currency) => {
      const insight = snapshot.baseRates[currency];

      return [
        `${currency}/NGN current: ${formatRate(insight.currentRate, currency)}`,
        `7-day average: ${formatRate(insight.sevenDayAverage, currency)}`,
        `Trend: ${insight.trend}`,
        `Volatility: ${insight.volatilityPercent.toFixed(2)}%`,
        `Delta on ${formatCurrency(snapshot.amount, currency, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}: ${formatNaira(insight.weeklyTransferDeltaNaira, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`
      ].join(" | ");
    })
    .join("\n");

  const corridorLines = AI_CONTEXT_COUNTRIES.map((country) => {
    const corridor = snapshot.corridors[country];

    return [
      `${country} corridor (${corridor.sourceCurrency})`,
      `Best provider: ${corridor.bestProvider} at ${formatNaira(corridor.bestAmount, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      `Worst provider: ${corridor.worstProvider} at ${formatNaira(corridor.worstAmount, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      `Max savings: ${formatNaira(corridor.maxSavings, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      `Confidence: ${corridor.confidence}`
    ].join(" | ");
  }).join("\n");

  return [
    `Market Snapshot`,
    `Last updated: ${snapshot.lastUpdatedLabel}`,
    `Base rates`,
    baseRateLines,
    `Provider spreads`,
    corridorLines
  ].join("\n");
}

function getActionLabel(corridor: CorridorInsight) {
  if (corridor.weeklyDifferencePercent >= 0.35) {
    return "Send immediately";
  }

  if (corridor.weeklyDifferencePercent <= -0.35) {
    return "Wait 48 hours";
  }

  return "Monitor closely";
}

export function buildManualBestTimeRecommendation(corridor: CorridorInsight) {
  const formattedAmount = formatCurrency(corridor.amount, corridor.sourceCurrency, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  const formattedDelta = formatNaira(Math.abs(corridor.weeklyTransferDeltaNaira), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const action = getActionLabel(corridor);

  if (corridor.weeklyTransferDeltaNaira >= 0) {
    return `${action}: compared with the 7-day average, ${formattedAmount} is currently yielding about ${formattedDelta} more, so today’s rate backdrop looks supportive for ${corridor.senderCountry} senders. SaveRate AI 🤖 🇳🇬`;
  }

  return `${action}: compared with the 7-day average, ${formattedAmount} is currently yielding about ${formattedDelta} less, so holding briefly could protect value if your transfer is not urgent. SaveRate AI 🤖 🇳🇬`;
}

export function buildManualChatReply(
  message: string,
  corridor: CorridorInsight
) {
  const normalizedMessage = message.toLowerCase();
  const formattedAmount = formatCurrency(corridor.amount, corridor.sourceCurrency, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  if (
    normalizedMessage.includes("best") ||
    normalizedMessage.includes("who should i use") ||
    normalizedMessage.includes("who is winning")
  ) {
    return `Based on my verified live data, ${corridor.bestProvider} is your best bet for ${corridor.senderCountry} today, delivering about ${formatNaira(corridor.bestAmount, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} on a ${formattedAmount} transfer. SaveRate AI 🤖 🇳🇬`;
  }

  if (
    normalizedMessage.includes("save") ||
    normalizedMessage.includes("difference") ||
    normalizedMessage.includes("delta")
  ) {
    return `${corridor.bestProvider} is beating ${corridor.worstProvider} by about ${formatNaira(corridor.maxSavings, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} on a ${formattedAmount} send right now, so provider choice still matters more than headlines alone. SaveRate AI 🤖 🇳🇬`;
  }

  if (
    normalizedMessage.includes("how much") ||
    normalizedMessage.includes("what will") ||
    normalizedMessage.includes("receive")
  ) {
    return `On current verified records, ${corridor.bestProvider} would deliver about ${formatNaira(corridor.bestAmount, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} for a ${formattedAmount} transfer from ${corridor.senderCountry}. SaveRate AI 🤖 🇳🇬`;
  }

  return buildManualBestTimeRecommendation(corridor);
}

