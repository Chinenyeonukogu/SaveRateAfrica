import { NextRequest, NextResponse } from "next/server";

import { getLiveBaseRates } from "@/lib/exchangeRateApi";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const data = await getLiveBaseRates();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=60"
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
