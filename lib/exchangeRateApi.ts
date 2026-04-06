import { baseMidMarketRates, type SourceCurrency } from "@/lib/providers";

export interface LiveBaseRatesResponse {
  provider: "ExchangeRate-API" | "Fallback";
  updatedAt: string;
  sourceUpdatedAt: string;
  cachedUntil: string;
  rates: Record<SourceCurrency, number>;
}

interface ExchangeRateApiPayload {
  result?: "success" | "error";
  "error-type"?: string;
  time_last_update_utc?: string;
  time_next_update_utc?: string;
  conversion_rates?: Record<string, number>;
}

declare global {
  // eslint-disable-next-line no-var
  var __saveRateAfricaLiveBaseRatesCache:
    | { expiresAt: number; data: LiveBaseRatesResponse }
    | undefined;
}

export const LIVE_RATE_REVALIDATE_SECONDS = 300;
const LIVE_RATE_CACHE_TTL_MS = LIVE_RATE_REVALIDATE_SECONDS * 1000;

function parseUtcDate(value?: string) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function fetchUsdBaseRates(apiKey: string) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
    {
      next: { revalidate: LIVE_RATE_REVALIDATE_SECONDS }
    }
  );

  if (!response.ok) {
    throw new Error("ExchangeRate-API request failed for USD.");
  }

  const payload = (await response.json()) as ExchangeRateApiPayload;

  if (payload.result !== "success") {
    throw new Error(
      payload["error-type"]
        ? `ExchangeRate-API error: ${payload["error-type"]}.`
        : "ExchangeRate-API returned an invalid response for USD."
    );
  }

  const usdToNgn = payload.conversion_rates?.NGN;
  const usdToGbp = payload.conversion_rates?.GBP;
  const usdToCad = payload.conversion_rates?.CAD;

  if (
    typeof usdToNgn !== "number" ||
    typeof usdToGbp !== "number" ||
    typeof usdToCad !== "number"
  ) {
    throw new Error("USD, GBP, CAD, or NGN rates are missing from ExchangeRate-API.");
  }

  return {
    updatedAt: parseUtcDate(payload.time_last_update_utc),
    nextUpdateAt: payload.time_next_update_utc
      ? parseUtcDate(payload.time_next_update_utc)
      : new Date(Date.now() + LIVE_RATE_CACHE_TTL_MS).toISOString(),
    rates: {
      USD: usdToNgn,
      GBP: usdToNgn / usdToGbp,
      CAD: usdToNgn / usdToCad
    }
  };
}

export function getFallbackBaseRates(): LiveBaseRatesResponse {
  return {
    provider: "Fallback",
    updatedAt: new Date().toISOString(),
    sourceUpdatedAt: new Date().toISOString(),
    cachedUntil: new Date(Date.now() + LIVE_RATE_CACHE_TTL_MS).toISOString(),
    rates: baseMidMarketRates
  };
}

export async function getLiveBaseRates(): Promise<LiveBaseRatesResponse> {
  const cachedEntry = globalThis.__saveRateAfricaLiveBaseRatesCache;

  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return cachedEntry.data;
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    throw new Error(
      "ExchangeRate-API key is missing. Set EXCHANGE_RATE_API_KEY in .env.local."
    );
  }

  const fetchedRates = await fetchUsdBaseRates(apiKey);
  const now = Date.now();
  const nextCacheExpiry = Math.min(
    now + LIVE_RATE_CACHE_TTL_MS,
    new Date(fetchedRates.nextUpdateAt).getTime()
  );

  const data: LiveBaseRatesResponse = {
    provider: "ExchangeRate-API",
    updatedAt: new Date(now).toISOString(),
    sourceUpdatedAt: fetchedRates.updatedAt,
    cachedUntil: new Date(nextCacheExpiry).toISOString(),
    rates: fetchedRates.rates
  };

  globalThis.__saveRateAfricaLiveBaseRatesCache = {
    expiresAt: nextCacheExpiry,
    data
  };

  return data;
}
