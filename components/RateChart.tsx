"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";

interface TrendPoint {
  date: string;
  USD: number;
  GBP: number;
  CAD: number;
}

function formatNgRate(value: number) {
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatNgRateCompact(value: number) {
  return `\u20a6${Math.round(value).toLocaleString("en-NG")}`;
}

function formatTrendDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  const activePoint = payload[0];
  const value = Number(activePoint.value);

  if (!Number.isFinite(value)) {
    return null;
  }

  return (
    <div className="rounded-[8px] bg-[#2e7d32] px-3 py-1.5 text-[12px] text-white">
      <p>{formatTrendDate(String(label))}</p>
      <p className="font-bold">{"\u20a6"}{formatNgRate(value)}</p>
    </div>
  );
}

export function RateChart() {
  const [trendData, setTrendData] = useState<TrendPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTrend() {
      try {
        const response = await fetch("/api/trend");
        const json = await response.json();

        if (!response.ok || !json?.trend?.length) {
          throw new Error("Rate history unavailable.");
        }

        if (!mounted) {
          return;
        }

        setTrendData(json.trend);
      } catch {
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

    loadTrend();

    return () => {
      mounted = false;
    };
  }, []);

  const chartData = useMemo(() => {
    return trendData ?? [];
  }, [trendData]);

  const numericRates = useMemo(() => {
    if (!chartData.length) {
      return [] as number[];
    }

    return chartData.flatMap((point) => [point.USD, point.GBP, point.CAD]);
  }, [chartData]);

  const bestRate = useMemo(() => {
    if (!numericRates.length) {
      return 0;
    }
    return Math.max(...numericRates);
  }, [numericRates]);

  const lowRate = useMemo(() => {
    if (!numericRates.length) {
      return 0;
    }
    return Math.min(...numericRates);
  }, [numericRates]);

  const latestPoint = chartData[chartData.length - 1];

  const renderDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (typeof cx !== "number" || typeof cy !== "number" || !payload) {
      return <g />;
    }

    const value = Number(payload[dataKey]);
    if (!Number.isFinite(value)) {
      return <g />;
    }

    const isBest = value === bestRate;
    const isLow = value === lowRate;
    const isRecent = payload === latestPoint && dataKey === "USD";
    const shouldShowRateLabel = isBest || isLow || isRecent;
    const fill = isLow ? "#888888" : "#2e7d32";
    const radius = isBest || isLow ? 5 : 3;
    const labelColor = isLow ? "#888888" : "#2e7d32";
    const labelWeight = isLow ? 400 : 700;

    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={fill} />
        {isBest ? (
          <text
            fill="#2e7d32"
            fontFamily="DM Sans, sans-serif"
            fontSize={10}
            fontWeight={700}
            textAnchor="middle"
            x={cx}
            y={cy - 24}
          >
            ▲ Best
          </text>
        ) : null}
        {shouldShowRateLabel ? (
          <text
            fill={labelColor}
            fontFamily="DM Sans, sans-serif"
            fontSize={10}
            fontWeight={labelWeight}
            textAnchor="middle"
            x={cx}
            y={cy - 12}
          >
            {formatNgRateCompact(value)}
          </text>
        ) : null}
        {isLow ? (
          <text
            fill="#5a7a5a"
            fontFamily="DM Sans, sans-serif"
            fontSize={10}
            textAnchor="middle"
            x={cx}
            y={cy + 16}
          >
            ▼ Low
          </text>
        ) : null}
      </g>
    );
  };

  return (
    <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-4 shadow-float min-[600px]:p-5 lg:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Currency trends
          </p>
          <h3 className="mb-4 mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
            USD, GBP, and CAD to NGN pulse
          </h3>
          <p className="max-w-2xl text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm">
            Track the last 7 days of NGN rate movement before you send. Spot
            the best time to transfer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-[999px] bg-[#2e7d32] px-[14px] py-[5px] text-[12px] font-semibold text-white"
            type="button"
          >
            7D
          </button>
          <Link
            className="inline-flex min-h-11 items-center rounded-full bg-brand-yellow px-4 text-[12px] font-bold text-brand-navy transition hover:shadow-float min-[600px]:min-h-12 min-[600px]:text-sm"
            href="/alerts"
          >
            Set Rate Alert
          </Link>
        </div>
      </div>

      <div className="mt-6 h-[320px] w-full sm:h-[360px]">
        {loading ? (
          <div className="flex h-full flex-col justify-center gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-5 w-full rounded-full bg-[#e6e6e6] opacity-80 animate-pulse"
                style={{ width: `${100 - index * 10}%` }}
              />
            ))}
          </div>
        ) : error || !chartData.length ? (
          <div className="flex h-full items-center justify-center text-center text-[#5a7a5a]">
            Rate history unavailable.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: 8, right: 12, top: 30, bottom: 0 }}>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="date"
                tick={{ fill: "#5a7a5a", fontSize: 10 }}
                tickFormatter={formatTrendDate}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(46,125,50,0.18)" }} />
              <Legend />
              <Area
                dataKey="USD"
                type="monotone"
                stroke="#2e7d32"
                fill="rgba(46,125,50,0.08)"
                strokeWidth={2}
                name="USD/NGN"
                activeDot={{ r: 6 }}
              />
              <Line
                dataKey="USD"
                name="USD/NGN"
                stroke="#2e7d32"
                strokeWidth={3}
                type="monotone"
                dot={renderDot}
                activeDot={{ r: 6 }}
              />
              <Line
                dataKey="GBP"
                name="GBP/NGN"
                stroke="#FFD600"
                strokeWidth={3}
                type="monotone"
                dot={renderDot}
                activeDot={{ r: 6 }}
              />
              <Line
                dataKey="CAD"
                name="CAD/NGN"
                stroke="#FF5722"
                strokeWidth={3}
                type="monotone"
                dot={renderDot}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
