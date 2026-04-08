"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { trendSeries } from "@/lib/site-data";

const periods = ["7D", "30D", "90D"] as const;

export function RateChart() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("7D");

  return (
    <div className="rounded-[12px] border border-[#c8e6c9] bg-white p-5 shadow-float min-[600px]:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Currency trends
          </p>
          <h3 className="mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
            USD, GBP, and CAD to NGN pulse
          </h3>
          <p className="mt-2 max-w-2xl text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm">
            Track short-term movement before you send. Toggle between 7, 30,
            and 90-day views to spot better entry points.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {periods.map((value) => (
            <button
              key={value}
              className={`min-h-11 rounded-full px-4 text-[12px] font-semibold transition min-[600px]:min-h-12 min-[600px]:text-sm ${
                value === period
                  ? "bg-[#2e7d32] text-white"
                  : "border border-[#c8e6c9] bg-white text-brand-navy hover:bg-brand-green/10"
              }`}
              type="button"
              onClick={() => setPeriod(value)}
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

      <div className="mt-5 h-[320px] w-full sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendSeries[period]} margin={{ left: 0, right: 12, top: 6, bottom: 0 }}>
            <CartesianGrid stroke="rgba(10,22,40,0.08)" strokeDasharray="4 4" />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#526173", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#526173", fontSize: 12 }}
              tickLine={false}
              width={52}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "20px",
                border: "1px solid rgba(10,22,40,0.08)",
                boxShadow: "0 20px 60px rgba(10,22,40,0.08)"
              }}
            />
            <Legend />
            <Line
              dataKey="USD"
              dot={false}
              name="USD/NGN"
              stroke="#00C853"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="GBP"
              dot={false}
              name="GBP/NGN"
              stroke="#FFD600"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="CAD"
              dot={false}
              name="CAD/NGN"
              stroke="#FF5722"
              strokeWidth={3}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
