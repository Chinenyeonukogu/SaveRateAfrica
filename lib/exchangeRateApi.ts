import { baseMidMarketRates, type SourceCurrency } from "@/lib/providers";

export interface LiveBaseRatesResponse {
  provider: "ExchangeRate-API" | "Fallback";
  updatedAt: string;
  cachedUntil: string;
  rates: Record<SourceCurrency, number>;
}

interface ExchangeRateApiPayload {
  result?: "success" | "error";
  "error-type"?: string;
  time_last_update_utc?: string;
  conversion_rates?: Record<string, number>;
}

declare global {
  // eslint-disable-next-line no-var
  var __saveRateAfricaLiveBaseRatesCache:
    | { expiresAt: number; data: LiveBaseRatesResponse }
    | undefined;
}

const LIVE_RATE_CACHE_TTL_MS = 60_000;
const supportedBaseCurrencies: SourceCurrency[] = ["USD", "GBP", "CAD"];

function parseUtcDate(value?: string) {
  if (!value) {
    return new Date().toISOString();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

async function fetchBaseCurrencyRate(
  apiKey: string,
  baseCurrency: SourceCurrency
) {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`,
    {
      next: { revalidate: 60 }
    }
  );

  if (!response.ok) {
    throw new Error(`ExchangeRate-API request failed for ${baseCurrency}.`);
  }

  const payload = (await response.json()) as ExchangeRateApiPayload;

  if (payload.result !== "success") {
    throw new Error(
      payload["error-type"]
        ? `ExchangeRate-API error: ${payload["error-type"]}.`
        : `ExchangeRate-API returned an invalid response for ${baseCurrency}.`
    );
  }

  const rate = payload.conversion_rates?.NGN;

  if (typeof rate !== "number") {
    throw new Error(`NGN rate missing from ExchangeRate-API payload for ${baseCurrency}.`);
  }

  return {
    baseCurrency,
    rate,
    updatedAt: parseUtcDate(payload.time_last_update_utc)
  };
}

export function getFallbackBaseRates(): LiveBaseRatesResponse {
  return {
    provider: "Fallback",
    updatedAt: new Date().toISOString(),
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

  const results = await Promise.all(
    supportedBaseCurrencies.map((baseCurrency) =>
      fetchBaseCurrencyRate(apiKey, baseCurrency)
    )
  );

  const updatedAt = results
    .map((result) => new Date(result.updatedAt).getTime())
    .reduce((latest, current) => Math.max(latest, current), 0);

  const data: LiveBaseRatesResponse = {
    provider: "ExchangeRate-API",
    updatedAt: new Date(updatedAt).toISOString(),
    cachedUntil: new Date(Date.now() + LIVE_RATE_CACHE_TTL_MS).toISOString(),
    rates: {
      USD: results.find((result) => result.baseCurrency === "USD")?.rate ?? baseMidMarketRates.USD,
      GBP: results.find((result) => result.baseCurrency === "GBP")?.rate ?? baseMidMarketRates.GBP,
      CAD: results.find((result) => result.baseCurrency === "CAD")?.rate ?? baseMidMarketRates.CAD
    }
  };

  globalThis.__saveRateAfricaLiveBaseRatesCache = {
    expiresAt: Date.now() + LIVE_RATE_CACHE_TTL_MS,
    data
  };

  return data;
}
