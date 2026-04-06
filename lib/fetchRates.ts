import { getProviderAffiliateLink } from "@/lib/affiliateLinks";
import {
  baseMidMarketRates,
  getCurrencyBySender,
  providers,
  type ComparisonSort,
  type SenderCountry,
  type SourceCurrency
} from "@/lib/providers";

export interface ComparisonProviderRow {
  slug: string;
  name: string;
  logoFrom: string;
  logoTo: string;
  rating: number;
  reviewCount: number;
  exchangeRate: number;
  fee: number;
  amountReceived: number;
  speedHours: number;
  deliveryLabel: string;
  bestFor: string;
  trustNote: string;
  payoutChannels: string[];
  sendUrl: string;
  isBestValue: boolean;
}

export interface ComparisonResult {
  amount: number;
  senderCountry: SenderCountry;
  sourceCurrency: SourceCurrency;
  recipientCurrency: "NGN";
  sortBy: ComparisonSort;
  updatedAt: string;
  baseMidMarketRate: number;
  providers: ComparisonProviderRow[];
  savings: {
    bestProvider: string;
    bestAmount: number;
    worstProvider: string;
    worstAmount: number;
    maxSavings: number;
  };
}

interface FetchRatesArgs {
  amount: number;
  senderCountry: SenderCountry;
  sortBy?: ComparisonSort;
}

declare global {
  // eslint-disable-next-line no-var
  var __saveRateAfricaRatesCache:
    | Map<string, { expiresAt: number; data: ComparisonResult }>
    | undefined;
}

const RATE_CACHE_TTL_MS = 60_000;
const rateCache = globalThis.__saveRateAfricaRatesCache ?? new Map();

if (!globalThis.__saveRateAfricaRatesCache) {
  globalThis.__saveRateAfricaRatesCache = rateCache;
}

function clampAmount(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 500;
  }

  return Math.min(Math.max(Math.round(value), 50), 25000);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function sortRows(rows: ComparisonProviderRow[], sortBy: ComparisonSort) {
  if (sortBy === "lowest-fee") {
    return [...rows].sort(
      (first, second) =>
        first.fee - second.fee || second.amountReceived - first.amountReceived
    );
  }

  if (sortBy === "fastest") {
    return [...rows].sort(
      (first, second) =>
        first.speedHours - second.speedHours ||
        second.amountReceived - first.amountReceived
    );
  }

  return [...rows].sort(
    (first, second) =>
      second.amountReceived - first.amountReceived || first.fee - second.fee
  );
}

function buildComparison({
  amount,
  senderCountry,
  sortBy
}: Required<FetchRatesArgs>) {
  const sourceCurrency = getCurrencyBySender(senderCountry);
  const baseMidMarketRate = baseMidMarketRates[sourceCurrency];
  const adjustedAmount = clampAmount(amount);

  const rows = providers
    .filter((provider) => provider.supportedSenderCountries.includes(senderCountry))
    .map((provider) => {
      const fee = provider.fees[sourceCurrency];
      const exchangeRate = round(baseMidMarketRate * provider.rateMultiplier[sourceCurrency]);
      const amountReceived = Math.round(Math.max(adjustedAmount - fee, 0) * exchangeRate);

      return {
        slug: provider.slug,
        name: provider.name,
        logoFrom: provider.logoFrom,
        logoTo: provider.logoTo,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        exchangeRate,
        fee,
        amountReceived,
        speedHours: provider.speedHours,
        deliveryLabel: provider.deliveryLabel,
        bestFor: provider.bestFor,
        trustNote: provider.trustNote,
        payoutChannels: provider.payoutChannels,
        sendUrl: getProviderAffiliateLink(provider.slug, {
          origin: senderCountry,
          amount: adjustedAmount,
          currency: sourceCurrency
        }),
        isBestValue: false
      };
    });

  const bestValueAmount = Math.max(...rows.map((row) => row.amountReceived));
  const sortedProviders = sortRows(
    rows.map((row) => ({
      ...row,
      isBestValue: row.amountReceived === bestValueAmount
    })),
    sortBy
  );

  const bestProvider = [...rows].sort(
    (first, second) => second.amountReceived - first.amountReceived
  )[0];
  const worstProvider = [...rows].sort(
    (first, second) => first.amountReceived - second.amountReceived
  )[0];

  return {
    amount: adjustedAmount,
    senderCountry,
    sourceCurrency,
    recipientCurrency: "NGN" as const,
    sortBy,
    updatedAt: new Date().toISOString(),
    baseMidMarketRate,
    providers: sortedProviders,
    savings: {
      bestProvider: bestProvider.name,
      bestAmount: bestProvider.amountReceived,
      worstProvider: worstProvider.name,
      worstAmount: worstProvider.amountReceived,
      maxSavings: bestProvider.amountReceived - worstProvider.amountReceived
    }
  };
}

export async function fetchRates({
  amount,
  senderCountry,
  sortBy = "best-rate"
}: FetchRatesArgs): Promise<ComparisonResult> {
  const adjustedAmount = clampAmount(amount);
  const cacheKey = `${senderCountry}:${sortBy}:${adjustedAmount}`;
  const cachedEntry = rateCache.get(cacheKey);

  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return cachedEntry.data;
  }

  const data = buildComparison({
    amount: adjustedAmount,
    senderCountry,
    sortBy
  });

  rateCache.set(cacheKey, {
    expiresAt: Date.now() + RATE_CACHE_TTL_MS,
    data
  });

  return data;
}
