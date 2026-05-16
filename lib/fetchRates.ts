import { getProviderAffiliateLink } from "@/lib/affiliateLinks";
import { formatCurrency } from "@/lib/format";
import {
  getCurrencyBySender,
  providerRankingsBySenderCountry,
  providers,
  type ComparisonSort,
  type Provider,
  type SenderCountry,
  type SourceCurrency
} from "@/lib/providers";
import { getLiveBaseRates, type LiveBaseRatesResponse } from "@/lib/exchangeRateApi";

export interface ComparisonProviderRow {
  slug: string;
  name: string;
  logoFrom: string;
  logoTo: string;
  rating: number;
  reviewCount: number;
  exchangeRate: number;
  fee: number;
  feeDisplayText: string;
  amountReceived: number;
  speedHours: number;
  deliveryLabel: string;
  summary: string;
  bestFor: string;
  trustNote: string;
  transferFeeNote?: string;
  payoutChannels: string[];
  sendUrl: string;
  isBestValue: boolean;
  countryRank: number;
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
  providerRates: LiveBaseRatesResponse["providerRates"];
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

export function getDeliverySortValue(deliveryLabel: string) {
  const normalizedLabel = deliveryLabel.trim().toLowerCase();

  if (normalizedLabel.includes("instant")) {
    return 0;
  }

  if (
    normalizedLabel.includes("3-5 min") ||
    normalizedLabel.includes("minutes") ||
    normalizedLabel.includes("minute")
  ) {
    return 1;
  }

  if (normalizedLabel.includes("within 1 hour") || normalizedLabel.includes("1 hour")) {
    return 2;
  }

  if (normalizedLabel.includes("same day")) {
    return 3;
  }

  if (normalizedLabel.includes("1-2 business day")) {
    return 4;
  }

  return 5;
}

function clampAmount(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 500;
  }

  return Math.max(Math.round(value), 1);
}

function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

function getProviderFee(
  provider: (typeof providers)[number],
  sourceCurrency: SourceCurrency,
  amount: number
) {
  if (provider.feeType === "percentage") {
    const fixedFee = provider.fixedFees?.[sourceCurrency] ?? provider.fees[sourceCurrency];
    const variableFeePercent = provider.variableFeePercents?.[sourceCurrency] ?? 0;

    return roundToTwo(fixedFee + amount * (variableFeePercent / 100));
  }

  return roundToTwo(provider.fees[sourceCurrency]);
}

function getProviderFeeDisplayText(
  provider: (typeof providers)[number],
  sourceCurrency: SourceCurrency,
  fee: number
) {
  const formattedFee = formatCurrency(fee, sourceCurrency);

  if (provider.feeDisplayPrefix) {
    return `${provider.feeDisplayPrefix} ${formattedFee}`;
  }

  return formattedFee;
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
  const byCountryRank = (first: ComparisonProviderRow, second: ComparisonProviderRow) =>
    first.countryRank - second.countryRank;

  if (sortBy === "lowest-fee") {
    return [...rows].sort(
      (first, second) =>
        byCountryRank(first, second) ||
        first.fee - second.fee ||
        second.amountReceived - first.amountReceived
    );
  }

  if (sortBy === "fastest") {
    return [...rows].sort(
      (first, second) =>
        byCountryRank(first, second) ||
        getDeliverySortValue(first.deliveryLabel) -
          getDeliverySortValue(second.deliveryLabel) ||
        first.speedHours - second.speedHours ||
        second.amountReceived - first.amountReceived
    );
  }

  return [...rows].sort(
    (first, second) =>
      byCountryRank(first, second) ||
      second.exchangeRate - first.exchangeRate ||
      second.amountReceived - first.amountReceived ||
      first.fee - second.fee
  );
}

function normalizeProviderName(value: string) {
  return value.trim().toLowerCase();
}

function getProviderSlug(providerName: string) {
  return providerName
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProviderMetadata(providerName: string): Provider | undefined {
  const normalizedName = normalizeProviderName(providerName);
  const normalizedSlug = getProviderSlug(providerName);

  return providers.find(
    (provider) =>
      normalizeProviderName(provider.name) === normalizedName ||
      provider.slug === normalizedSlug
  );
}

function getGenericProviderMetadata(providerName: string): Provider {
  return {
    slug: getProviderSlug(providerName),
    name: providerName,
    logoFrom: "#0F766E",
    logoTo: "#FACC15",
    rating: 4.5,
    reviewCount: 0,
    speedHours: 1,
    speedBand: "standard",
    deliveryLabel: "See provider",
    feeBand: "medium",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 1, GBP: 1, CAD: 1 },
    summary: "Live rate from Supabase",
    headline: "Live provider rate",
    bestFor: "Live provider rate",
    trustNote: "Live provider rate",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["See provider"],
    pros: ["Live Supabase rate"],
    cons: ["Confirm final details at checkout"]
  };
}

function getCountryRank(providerName: string, senderCountry: SenderCountry) {
  const ranking = providerRankingsBySenderCountry[senderCountry] ?? providerRankingsBySenderCountry.USA;
  const normalizedName = normalizeProviderName(providerName);
  const rankIndex = ranking.findIndex(
    (rankedProvider) => normalizeProviderName(rankedProvider) === normalizedName
  );

  return rankIndex === -1 ? ranking.length + 1 : rankIndex + 1;
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

  const rows = liveBaseRates.providerRates
    .filter((rateRow) => rateRow.send_currency === sourceCurrency)
    .map((rateRow) => {
      const provider =
        getProviderMetadata(rateRow.provider) ?? getGenericProviderMetadata(rateRow.provider);
      const fee =
        rateRow.fee === null ? getProviderFee(provider, sourceCurrency, adjustedAmount) : rateRow.fee;
      const exchangeRate = roundToTwo(rateRow.rate);
      const grossRecipientAmount = adjustedAmount * exchangeRate;
      const feeInNaira = fee * exchangeRate;
      const amountReceived = roundToTwo(
        Math.max(grossRecipientAmount - feeInNaira, 1)
      );

      return {
        slug: provider.slug,
        name: rateRow.provider,
        logoFrom: provider.logoFrom,
        logoTo: provider.logoTo,
        rating: provider.rating,
        reviewCount: provider.reviewCount,
        exchangeRate,
        fee: roundToTwo(fee),
        feeDisplayText: getProviderFeeDisplayText(provider, sourceCurrency, fee),
        amountReceived,
        speedHours: provider.speedHours,
        deliveryLabel: provider.deliveryLabel,
        summary: provider.summary,
        bestFor: provider.bestFor,
        trustNote: provider.trustNote,
        transferFeeNote: provider.transferFeeNote,
        payoutChannels: provider.payoutChannels,
        sendUrl: getProviderAffiliateLink(provider.slug, {
          origin: senderCountry,
          amount: adjustedAmount,
          currency: sourceCurrency
        }),
        isBestValue: false,
        countryRank: getCountryRank(provider.name, senderCountry)
      };
    });

  if (rows.length === 0) {
    throw new Error(`Supabase exchange_rates is missing ${sourceCurrency}-NGN rows.`);
  }

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
    providerRates: liveBaseRates.providerRates,
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

  liveBaseRates = await getLiveBaseRates();

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
