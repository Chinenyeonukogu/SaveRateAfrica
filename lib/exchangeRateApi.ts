import type { SourceCurrency } from "@/lib/providers";

export interface SupabaseExchangeRateRow {
  provider: string;
  send_currency: SourceCurrency;
  receive_currency: "NGN";
  rate: number;
  fee: number | null;
  updated_at: string | null;
  is_automated: boolean | null;
}

export interface LiveBaseRatesResponse {
  provider: "Supabase";
  updatedAt: string;
  sourceUpdatedAt: string;
  cachedUntil: string;
  rates: Record<SourceCurrency, number>;
  providerRates: SupabaseExchangeRateRow[];
}

declare global {
  // eslint-disable-next-line no-var
  var __saveRateAfricaLiveBaseRatesCache:
    | { expiresAt: number; data: LiveBaseRatesResponse }
    | undefined;
}

export const LIVE_RATE_REVALIDATE_SECONDS = 1800;
const LIVE_RATE_CACHE_TTL_MS = LIVE_RATE_REVALIDATE_SECONDS * 1000;
const SUPPORTED_SOURCE_CURRENCIES: SourceCurrency[] = ["USD", "GBP", "CAD"];

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase URL or anon key is missing. Set SUPABASE_URL and SUPABASE_ANON_KEY."
    );
  }

  return {
    anonKey,
    url: url.replace(/\/$/, "")
  };
}

function isSourceCurrency(value: unknown): value is SourceCurrency {
  return (
    typeof value === "string" &&
    SUPPORTED_SOURCE_CURRENCIES.includes(value.toUpperCase() as SourceCurrency)
  );
}

function normalizeRateRow(row: Partial<SupabaseExchangeRateRow>) {
  const rate = Number(row.rate);
  const fee = row.fee === null || row.fee === undefined ? null : Number(row.fee);
  const sendCurrency = String(row.send_currency ?? "").toUpperCase();
  const receiveCurrency = String(row.receive_currency ?? "").toUpperCase();

  if (
    !row.provider ||
    !isSourceCurrency(sendCurrency) ||
    receiveCurrency !== "NGN" ||
    !Number.isFinite(rate) ||
    rate <= 0
  ) {
    return null;
  }

  return {
    provider: row.provider,
    send_currency: sendCurrency,
    receive_currency: "NGN",
    rate,
    fee: fee === null || Number.isFinite(fee) ? fee : null,
    updated_at: row.updated_at ?? null,
    is_automated: row.is_automated ?? null
  } satisfies SupabaseExchangeRateRow;
}

function isSupabaseExchangeRateRow(
  row: SupabaseExchangeRateRow | null
): row is SupabaseExchangeRateRow {
  return row !== null;
}

function buildBestRates(rows: SupabaseExchangeRateRow[]) {
  const bestRates = Object.fromEntries(
    SUPPORTED_SOURCE_CURRENCIES.map((currency) => [currency, 0])
  ) as Record<SourceCurrency, number>;

  rows.forEach((row) => {
    bestRates[row.send_currency] = Math.max(bestRates[row.send_currency], row.rate);
  });

  const missingCurrency = SUPPORTED_SOURCE_CURRENCIES.find(
    (currency) => bestRates[currency] <= 0
  );

  if (missingCurrency) {
    throw new Error(`Supabase exchange_rates is missing ${missingCurrency}-NGN rows.`);
  }

  return bestRates;
}

function getLatestUpdatedAt(rows: SupabaseExchangeRateRow[]) {
  const timestamps = rows
    .map((row) => (row.updated_at ? new Date(row.updated_at).getTime() : 0))
    .filter((timestamp) => Number.isFinite(timestamp) && timestamp > 0);

  return timestamps.length
    ? new Date(Math.max(...timestamps)).toISOString()
    : new Date().toISOString();
}

async function fetchSupabaseExchangeRates() {
  const { anonKey, url } = getSupabaseConfig();
  const searchParams = new URLSearchParams({
    select:
      "provider,send_currency,receive_currency,rate,fee,updated_at,is_automated",
    receive_currency: "eq.NGN",
    order: "provider.asc,send_currency.asc"
  });

  const response = await fetch(
    `${url}/rest/v1/exchange_rates?${searchParams.toString()}`,
    {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      },
      next: { revalidate: LIVE_RATE_REVALIDATE_SECONDS }
    }
  );

  if (!response.ok) {
    throw new Error("Supabase exchange_rates request failed.");
  }

  const payload = (await response.json()) as Partial<SupabaseExchangeRateRow>[];

  return payload.map(normalizeRateRow).filter(isSupabaseExchangeRateRow);
}

export async function getLiveBaseRates(): Promise<LiveBaseRatesResponse> {
  const cachedEntry = globalThis.__saveRateAfricaLiveBaseRatesCache;

  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return cachedEntry.data;
  }

  const providerRates = await fetchSupabaseExchangeRates();

  if (providerRates.length === 0) {
    throw new Error("Supabase exchange_rates returned no NGN rows.");
  }

  const now = Date.now();
  const sourceUpdatedAt = getLatestUpdatedAt(providerRates);
  const cachedUntil = new Date(now + LIVE_RATE_CACHE_TTL_MS).toISOString();
  const data: LiveBaseRatesResponse = {
    provider: "Supabase",
    updatedAt: new Date(now).toISOString(),
    sourceUpdatedAt,
    cachedUntil,
    rates: buildBestRates(providerRates),
    providerRates
  };

  globalThis.__saveRateAfricaLiveBaseRatesCache = {
    expiresAt: now + LIVE_RATE_CACHE_TTL_MS,
    data
  };

  return data;
}
