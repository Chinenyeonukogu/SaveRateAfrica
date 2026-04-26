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
  XAxis,
  YAxis
} from "recharts";

interface TrendPoint {
  date: string;
  USD: number;
  GBP: number;
  CAD: number;
}

const periods = ["7D"] as const;

function formatNgRate(value: number) {
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[16px] border border-[rgba(10,22,40,0.08)] bg-white p-3 text-[12px] text-[#1a2e3a] shadow-[0_20px_60px_rgba(10,22,40,0.08)]">
      <p className="mb-2 font-semibold">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-[#526173]">{entry.name}</span>
          <span className="font-semibold">₦{formatNgRate(Number(entry.value))}</span>
        </div>
      ))}
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

  const minRate = useMemo(() => {
    if (!numericRates.length) {
      return 0;
    }
    return Math.min(...numericRates);
  }, [numericRates]);

  const maxRate = useMemo(() => {
    if (!numericRates.length) {
      return 0;
    }
    return Math.max(...numericRates);
  }, [numericRates]);

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
    const fill = isBest ? "#2e7d32" : isLow ? "#888888" : "#2e7d32";
    const radius = isBest || isLow ? 5 : 3;

    return (
      <g>
        <circle cx={cx} cy={cy} r={radius} fill={fill} />
        {isBest ? (
          <text x={cx} y={cy - 12} fill="#2e7d32" fontSize={10} textAnchor="middle">
            ▲ Top
          </text>
        ) : null}
        {isLow ? (
          <text x={cx} y={cy + 16} fill="#5a7a5a" fontSize={10} textAnchor="middle">
            ▼ Low
          </text>
        ) : null}
      </g>
    );
  };

  const yDomain = useMemo<[number, number]>(() => {
    if (!numericRates.length) {
      return [0, 100];
    }

    return [Math.max(0, minRate - 50), maxRate + 50];
  }, [minRate, maxRate, numericRates.length]);

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
            Track short-term movement before you send. Toggle between 7, 30,
            and 90-day views to spot better entry points.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {periods.map((value) => (
            <button
              key={value}
              className={`min-h-11 rounded-full px-4 text-[12px] font-semibold transition min-[600px]:min-h-12 min-[600px]:text-sm ${
                value === "7D"
                  ? "bg-[#2e7d32] text-white"
                  : "border border-[#c8e6c9] bg-white text-brand-navy opacity-50 cursor-not-allowed"
              }`}
              type="button"
              disabled={value !== "7D"}
            >
              {value}
            </button>
          ))}
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
            <LineChart data={chartData} margin={{ left: 0, right: 12, top: 6, bottom: 0 }}>
              <CartesianGrid stroke="rgba(10,22,40,0.08)" strokeDasharray="4 4" />
              <XAxis
                axisLine={false}
                dataKey="date"
                tick={{ fill: "#526173", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                domain={yDomain}
                tick={{ fill: "#526173", fontSize: 12 }}
                tickLine={false}
                width={52}
              />
              <Tooltip content={<ChartTooltip />} />
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
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
