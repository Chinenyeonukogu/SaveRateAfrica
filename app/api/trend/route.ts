import { NextResponse } from "next/server";

import {
  getLiveBaseRates,
  LIVE_RATE_REVALIDATE_SECONDS
} from "@/lib/exchangeRateApi";
import { trendSeries } from "@/lib/site-data";

export async function GET() {
  try {
    const liveRates = await getLiveBaseRates();
    const recentTrend = trendSeries["7D"].slice(-6);
    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    return NextResponse.json(
      {
        trend: [
          ...recentTrend,
          {
            date: today,
            USD: liveRates.rates.USD,
            GBP: liveRates.rates.GBP,
            CAD: liveRates.rates.CAD
          }
        ],
        source: "supabase"
      },
      {
        headers: {
          "Cache-Control": `s-maxage=${LIVE_RATE_REVALIDATE_SECONDS}, stale-while-revalidate=60`
        }
      }
    );
  } catch {
    return NextResponse.json(
      { trend: [], error: true },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
