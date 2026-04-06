import { NextRequest, NextResponse } from "next/server";

import { fetchRates } from "@/lib/fetchRates";
import { isComparisonSort, isSenderCountry } from "@/lib/providers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const amount = Number.parseFloat(request.nextUrl.searchParams.get("amount") ?? "500");
  const senderCountryParam =
    request.nextUrl.searchParams.get("senderCountry") ?? "USA";
  const sortByParam = request.nextUrl.searchParams.get("sortBy") ?? "best-rate";

  const senderCountry = isSenderCountry(senderCountryParam)
    ? senderCountryParam
    : "USA";
  const sortBy = isComparisonSort(sortByParam) ? sortByParam : "best-rate";

  const data = await fetchRates({
    amount,
    senderCountry,
    sortBy
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=60"
    }
  });
}
