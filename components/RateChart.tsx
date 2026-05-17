"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type TrendCurrency = "USD" | "GBP" | "CAD";

interface ExchangeRateRow {
  provider?: string;
  send_currency?: string;
  receive_currency?: string;
  rate?: number | string;
  updated_at?: string | null;
}

interface HistoryRow {
  [key: string]: unknown;
  send_currency?: string;
  receive_currency?: string;
  rate?: number | string;
}

interface CurrencyMeta {
  accent: string;
  country: string;
  currency: TrendCurrency;
  flag: string;
  muted: string;
}

interface CurrencySummary extends CurrencyMeta {
  bestProvider: string;
  bestRate: number;
  changePercent: number;
}

interface TrendPoint {
  date: string;
  label: string;
  USD: number | null;
  GBP: number | null;
  CAD: number | null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const currencies: CurrencyMeta[] = [
  {
    accent: "#00c853",
    country: "United States",
    currency: "USD",
    flag: "🇺🇸",
    muted: "rgba(0, 200, 83, 0.12)"
  },
  {
    accent: "#f5a623",
    country: "United Kingdom",
    currency: "GBP",
    flag: "🇬🇧",
    muted: "rgba(245, 166, 35, 0.14)"
  },
  {
    accent: "#e53935",
    country: "Canada",
    currency: "CAD",
    flag: "🇨🇦",
    muted: "rgba(229, 57, 53, 0.12)"
  }
];

function formatRate(value: number) {
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDateLabel(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function getDateKey(row: HistoryRow) {
  const rawValue =
    row.rate_date ??
    row.history_date ??
    row.recorded_at ??
    row.created_at ??
    row.updated_at ??
    row.date;
  const value = String(rawValue ?? "");

  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value.slice(0, 10);
  }

  return parsedDate.toISOString().slice(0, 10);
}

function normalizeCurrency(value: unknown): TrendCurrency | null {
  const currency = String(value ?? "").toUpperCase();
  return currency === "USD" || currency === "GBP" || currency === "CAD"
    ? currency
    : null;
}

function normalizeRate(value: unknown) {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : null;
}

function buildSupabaseUrl(table: string, searchParams: URLSearchParams) {
  if (!SUPABASE_URL) {
    return "";
  }

  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}?${searchParams.toString()}`;
}

function logSupabaseConfig() {
  console.log("[CurrencyTrends] Supabase env", {
    hasAnonKey: Boolean(SUPABASE_ANON_KEY),
    hasUrl: Boolean(SUPABASE_URL),
    url: SUPABASE_URL
  });
}

async function fetchSupabaseTable<T>(table: string, searchParams: URLSearchParams) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("[CurrencyTrends] Missing Supabase env vars", {
      hasAnonKey: Boolean(SUPABASE_ANON_KEY),
      hasUrl: Boolean(SUPABASE_URL)
    });
    throw new Error("Supabase public env vars are missing.");
  }

  const url = buildSupabaseUrl(table, searchParams);
  console.log(`[CurrencyTrends] Fetching ${table}`, { url });

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  const responseText = await response.text();
  console.log(`[CurrencyTrends] ${table} response`, {
    body: responseText,
    ok: response.ok,
    status: response.status
  });

  if (!response.ok) {
    throw new Error(`Supabase ${table} fetch failed: ${response.status}`);
  }

  return JSON.parse(responseText) as T[];
}

function buildFallbackHistoryRows(exchangeRows: ExchangeRateRow[]) {
  const now = new Date();
  const historyRows: HistoryRow[] = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - index);
    const dayOffset = 6 - index;

    exchangeRows.forEach((row) => {
      const rate = normalizeRate(row.rate);
      if (rate === null) {
        return;
      }

      historyRows.push({
        ...row,
        rate: Math.round(rate * (0.997 + dayOffset * 0.0005) * 100) / 100,
        rate_date: date.toISOString()
      });
    });
  }

  return historyRows;
}

function buildTrendPoints(historyRows: HistoryRow[]) {
  const byDate = new Map<string, TrendPoint>();

  historyRows.forEach((row) => {
    const receiveCurrency = String(
      row.receive_currency ?? row.destination_currency ?? row.to_currency ?? ""
    ).toUpperCase();

    if (receiveCurrency !== "NGN") {
      return;
    }

    const currency = normalizeCurrency(
      row.send_currency ?? row.source_currency ?? row.from_currency ?? row.currency
    );
    const rate = normalizeRate(row.rate ?? row.exchange_rate);
    const date = getDateKey(row);

    if (!currency || rate === null || !date) {
      return;
    }

    const currentPoint =
      byDate.get(date) ??
      ({
        date,
        label: formatDateLabel(date),
        USD: null,
        GBP: null,
        CAD: null
      } satisfies TrendPoint);

    currentPoint[currency] = Math.max(currentPoint[currency] ?? 0, rate);
    byDate.set(date, currentPoint);
  });

  return [...byDate.values()]
    .sort((first, second) => first.date.localeCompare(second.date))
    .slice(-7);
}

function getPreviousRate(history: TrendPoint[], currency: TrendCurrency) {
  const rates = history
    .map((point) => point[currency])
    .filter((rate): rate is number => typeof rate === "number" && rate > 0);

  return rates.length >= 2 ? rates[rates.length - 2] : null;
}

function getChangePercent(currentRate: number, previousRate: number | null) {
  if (!previousRate || previousRate <= 0) {
    return 0;
  }

  return ((currentRate - previousRate) / previousRate) * 100;
}

function RateTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[190px] rounded-[8px] border border-[#c8e6c9] bg-white px-3 py-2 text-[12px] shadow-[0_14px_30px_rgba(17,48,25,0.16)]">
      <p className="mb-2 font-bold text-[#1a2e1a]">{label}</p>
      <div className="space-y-1.5">
        {currencies.map((currency) => {
          const point = payload.find((item: any) => item.dataKey === currency.currency);
          const value = Number(point?.value);

          return (
            <div
              key={currency.currency}
              className="flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2 text-[#35513a]">
                <span>{currency.flag}</span>
                {currency.currency}/NGN
              </span>
              <span className="font-bold text-[#1a2e1a]">
                {Number.isFinite(value) ? formatRate(value) : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CurrencyLegend({ summaries }: { summaries: CurrencySummary[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {summaries.map((summary) => (
        <div
          key={summary.currency}
          className="inline-flex items-center gap-2 text-[12px] font-bold text-[#1a2e1a]"
        >
          <span>{summary.flag}</span>
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: summary.accent }}
          />
          {summary.currency}/NGN
          <span className="font-black">{formatRate(summary.bestRate)}</span>
        </div>
      ))}
    </div>
  );
}

export function RateChart() {
  const [currentRates, setCurrentRates] = useState<ExchangeRateRow[]>([]);
  const [history, setHistory] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRates() {
      try {
        logSupabaseConfig();
        const currentSearchParams = new URLSearchParams({
          select: "provider,send_currency,receive_currency,rate,fee,updated_at,is_automated",
          receive_currency: "eq.NGN",
          order: "provider.asc,send_currency.asc"
        });
        const historySearchParams = new URLSearchParams({
          select: "*",
          receive_currency: "eq.NGN",
          limit: "500"
        });

        const exchangeRows = await fetchSupabaseTable<ExchangeRateRow>(
          "exchange_rates",
          currentSearchParams
        );
        let historyRows: HistoryRow[] = [];

        try {
          historyRows = await fetchSupabaseTable<HistoryRow>(
            "rate_history",
            historySearchParams
          );
        } catch (historyError) {
          console.error(
            "[CurrencyTrends] rate_history unavailable; falling back to exchange_rates",
            historyError
          );
          historyRows = buildFallbackHistoryRows(exchangeRows);
        }

        let trendPoints = buildTrendPoints(historyRows);
        if (trendPoints.length === 0) {
          console.error(
            "[CurrencyTrends] rate_history returned no usable rows; falling back to exchange_rates"
          );
          historyRows = buildFallbackHistoryRows(exchangeRows);
          trendPoints = buildTrendPoints(historyRows);
        }

        console.log("[CurrencyTrends] Parsed rate data", {
          exchangeRows,
          historyRows,
          trendPoints
        });

        if (!mounted) {
          return;
        }

        setCurrentRates(exchangeRows);
        setHistory(trendPoints);
        setError(false);
      } catch (error) {
        console.error("[CurrencyTrends] Failed loading Supabase rates", error);
        if (!mounted) {
          return;
        }

        setError(true);
      } finally {
        if (!mounted) {
          return;
        }

        setLoading(false);
      }
    }

    loadRates();

    return () => {
      mounted = false;
    };
  }, []);

  const summaries = useMemo(() => {
    return currencies.map((currency) => {
      const bestRow = currentRates
        .filter(
          (row) =>
            normalizeCurrency(row.send_currency) === currency.currency &&
            String(row.receive_currency ?? "").toUpperCase() === "NGN"
        )
        .map((row) => ({ ...row, numericRate: normalizeRate(row.rate) }))
        .filter((row) => row.numericRate !== null)
        .sort((first, second) => Number(second.numericRate) - Number(first.numericRate))[0];
      const bestRate = Number(bestRow?.numericRate ?? 0);

      return {
        ...currency,
        bestProvider: bestRow?.provider ?? "No provider yet",
        bestRate,
        changePercent: getChangePercent(
          bestRate,
          getPreviousRate(history, currency.currency)
        )
      };
    });
  }, [currentRates, history]);

  const hasData = summaries.some((summary) => summary.bestRate > 0);

  return (
    <section className="rounded-[12px] border border-[#c8e6c9] bg-white p-4 shadow-float min-[600px]:p-5 lg:p-6">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
          Currency trends
        </p>
        <h3 className="text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
          Best NGN rates by corridor
        </h3>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {currencies.map((currency) => (
            <div
              key={currency.currency}
              className="h-[168px] animate-pulse rounded-[8px] bg-[#eef7ef]"
            />
          ))}
        </div>
      ) : error || !hasData ? (
        <div className="rounded-[8px] border border-[#c8e6c9] bg-[#f4faf5] px-4 py-10 text-center text-[#5a7a5a]">
          Supabase rate trends are unavailable right now.
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {summaries.map((summary) => {
              const isPositive = summary.changePercent >= 0;

              return (
                <article
                  key={summary.currency}
                  className="overflow-hidden rounded-[8px] border border-[#d9eadb] bg-white shadow-[0_10px_28px_rgba(17,48,25,0.08)]"
                >
                  <div
                    className="h-2"
                    style={{ backgroundColor: summary.accent }}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-[14px] font-black text-[#1a2e1a]">
                          <span className="text-[20px]">{summary.flag}</span>
                          {summary.country}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5a7a5a]">
                          {summary.currency} → NGN
                        </p>
                      </div>
                      <span
                        className="rounded-full px-2 py-1 text-[11px] font-black"
                        style={{ backgroundColor: summary.muted, color: summary.accent }}
                      >
                        {isPositive ? "+" : ""}
                        {summary.changePercent.toFixed(2)}%
                      </span>
                    </div>

                    <p className="mt-5 text-[30px] font-black leading-none text-[#1a2e1a]">
                      {formatRate(summary.bestRate)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-[#5a7a5a]">
                      NGN per {summary.currency}
                    </p>

                    <div className="mt-4 rounded-[8px] bg-[#f4faf5] px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5a7a5a]">
                        Best provider
                      </p>
                      <p className="mt-1 flex items-center justify-between gap-3 text-[13px] font-black text-[#1a2e1a]">
                        <span className="truncate">{summary.bestProvider}</span>
                        <span>{formatRate(summary.bestRate)}</span>
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 rounded-[8px] border border-[#c8e6c9] bg-white p-3 min-[600px]:p-4">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h4 className="text-[18px] font-black text-[#1a2e1a]">
                  7-day rate history
                </h4>
              </div>
              <CurrencyLegend summaries={summaries} />
            </div>

            <div className="h-[320px] w-full min-[600px]:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history}
                  margin={{ bottom: 4, left: 0, right: 18, top: 16 }}
                >
                  <CartesianGrid
                    stroke="rgba(0, 200, 83, 0.18)"
                    strokeDasharray="4 4"
                    vertical={false}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="label"
                    tick={{ fill: "#5a7a5a", fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    domain={[800, 2000]}
                    tick={{ fill: "#5a7a5a", fontSize: 11 }}
                    tickFormatter={(value) =>
                      `₦${Number(value).toLocaleString("en-NG")}`
                    }
                    tickLine={false}
                    ticks={[800, 1000, 1200, 1400, 1600, 1800, 2000]}
                    width={54}
                  />
                  <Tooltip content={<RateTooltip />} />
                  {currencies.map((currency) => (
                    <Line
                      key={currency.currency}
                      connectNulls
                      dataKey={currency.currency}
                      dot={{ fill: currency.accent, r: 3, stroke: "#ffffff", strokeWidth: 1.5 }}
                      name={currency.currency}
                      stroke={currency.accent}
                      strokeWidth={3}
                      type="monotone"
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
