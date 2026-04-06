import { NextRequest, NextResponse } from "next/server";

import { LIVE_RATE_REVALIDATE_SECONDS } from "@/lib/exchangeRateApi";
import { getLiveComparison } from "@/lib/fetchRates";
import {
  isComparisonSort,
  isSenderCountry,
  type ComparisonSort,
  type SenderCountry
} from "@/lib/providers";

export const revalidate = 300;

function getRequestAmount(value: string | null) {
  const parsedValue = Number.parseFloat(value ?? "500");
  return Number.isFinite(parsedValue) ? parsedValue : 500;
}

function getRequestSenderCountry(value: string | null): SenderCountry {
  return value && isSenderCountry(value) ? value : "USA";
}

function getRequestSort(value: string | null): ComparisonSort {
  return value && isComparisonSort(value) ? value : "best-rate";
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const comparison = await getLiveComparison(
      {
        amount: getRequestAmount(searchParams.get("amount")),
        senderCountry: getRequestSenderCountry(searchParams.get("senderCountry")),
        sortBy: getRequestSort(searchParams.get("sortBy"))
      },
      {
        allowFallback: false
      }
    );

    return NextResponse.json(comparison, {
      headers: {
        "Cache-Control": `s-maxage=${LIVE_RATE_REVALIDATE_SECONDS}, stale-while-revalidate=60`
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to fetch live exchange rates right now."
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  }
}
