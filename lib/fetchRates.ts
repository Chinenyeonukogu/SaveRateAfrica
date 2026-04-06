import { getProviderAffiliateLink } from "@/lib/affiliateLinks";
import {
  getCurrencyBySender,
  providers,
  type ComparisonSort,
  type SenderCountry,
  type SourceCurrency
} from "@/lib/providers";
import {
  getFallbackBaseRates,
  getLiveBaseRates,
  type LiveBaseRatesResponse
} from "@/lib/exchangeRateApi";

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
  sourceUpdatedAt: string;
  cachedUntil: string;
  rateProvider: LiveBaseRatesResponse["provider"];
  baseMidMarketRate: number;
  liveBaseRates: Record<SourceCurrency, number>;
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

interface FetchRatesOptions {
  apiBaseUrl?: string;
  allowFallback?: boolean;
  signal?: AbortSignal;
}

function clampAmount(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }

  return Math.max(Math.round(value), 1);
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function getRatesEndpointUrl(
  args: Required<FetchRatesArgs>,
  apiBaseUrl?: string
) {
  const searchParams = new URLSearchParams({
    amount: String(args.amount),
    senderCountry: args.senderCountry,
    sortBy: args.sortBy
  });

  if (typeof window !== "undefined") {
    return `/api/rates?${searchParams.toString()}`;
  }

  if (apiBaseUrl) {
    const url = new URL("/api/rates", apiBaseUrl);
    url.search = searchParams.toString();
    return url.toString();
  }

  throw new Error("A base URL is required to call /api/rates on the server.");
}

async function fetchLiveComparisonFromApi(
  args: Required<FetchRatesArgs>,
  { apiBaseUrl, signal }: Pick<FetchRatesOptions, "apiBaseUrl" | "signal">
): Promise<ComparisonResult> {
  const response = await fetch(getRatesEndpointUrl(args, apiBaseUrl), {
    cache: "no-store",
    signal
  });

  const payload = (await response.json()) as ComparisonResult & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to fetch live exchange rates.");
  }

  return payload;
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

export function buildComparisonFromLiveRates({
  amount,
  senderCountry,
  sortBy,
  liveBaseRates
}: Required<FetchRatesArgs> & { liveBaseRates: LiveBaseRatesResponse }): ComparisonResult {
  const sourceCurrency = getCurrencyBySender(senderCountry);
  const baseMidMarketRate = liveBaseRates.rates[sourceCurrency];
  const adjustedAmount = clampAmount(amount);

  const rows = providers
    .filter((provider) => provider.supportedSenderCountries.includes(senderCountry))
    .map((provider) => {
      const fee = roundToTwo(provider.fees[sourceCurrency]);
      const exchangeRate = roundToTwo(
        baseMidMarketRate * provider.rateMultiplier[sourceCurrency]
      );
      const amountReceived = roundToTwo(
        Math.max(adjustedAmount - fee, 0) * exchangeRate
      );

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
    recipientCurrency: "NGN",
    sortBy,
    updatedAt: liveBaseRates.updatedAt,
    sourceUpdatedAt: liveBaseRates.sourceUpdatedAt,
    cachedUntil: liveBaseRates.cachedUntil,
    rateProvider: liveBaseRates.provider,
    baseMidMarketRate,
    liveBaseRates: liveBaseRates.rates,
    providers: sortedProviders,
    savings: {
      bestProvider: bestProvider.name,
      bestAmount: bestProvider.amountReceived,
      worstProvider: worstProvider.name,
      worstAmount: worstProvider.amountReceived,
      maxSavings: roundToTwo(bestProvider.amountReceived - worstProvider.amountReceived)
    }
  };
}

export async function getLiveComparison(
  {
    amount,
    senderCountry,
    sortBy = "best-rate"
  }: FetchRatesArgs,
  options: Pick<FetchRatesOptions, "allowFallback"> = {}
): Promise<ComparisonResult> {
  const adjustedAmount = clampAmount(amount);
  let liveBaseRates: LiveBaseRatesResponse;

  try {
    liveBaseRates = await getLiveBaseRates();
  } catch (error) {
    if (!options.allowFallback) {
      throw error;
    }

    liveBaseRates = getFallbackBaseRates();
  }

  return buildComparisonFromLiveRates({
    amount: adjustedAmount,
    senderCountry,
    sortBy,
    liveBaseRates
  });
}

export async function fetchRates(
  {
    amount,
    senderCountry,
    sortBy = "best-rate"
  }: FetchRatesArgs,
  options: FetchRatesOptions = {}
): Promise<ComparisonResult> {
  const normalizedArgs = {
    amount: clampAmount(amount),
    senderCountry,
    sortBy
  };

  if (typeof window === "undefined" && !options.apiBaseUrl) {
    return getLiveComparison(normalizedArgs, {
      allowFallback: options.allowFallback ?? true
    });
  }

  return fetchLiveComparisonFromApi(normalizedArgs, {
    apiBaseUrl: options.apiBaseUrl,
    signal: options.signal
  });
}
