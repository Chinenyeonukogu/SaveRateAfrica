import { NextResponse } from "next/server";

const CACHE_TTL_SECONDS = 3600;

interface ExchangeRateApiPayload {
  result?: "success" | "error";
  "error-type"?: string;
  conversion_rates?: Record<string, number>;
}

export async function GET() {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { trend: [], error: true, message: "ExchangeRate-API key is missing." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const dates = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    dates.push({
      year: date.getFullYear(),
      month,
      day,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      })
    });
  }

  const results = await Promise.all(
    dates.map(async (d) => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/history/USD/${d.year}/${d.month}/${d.day}`,
          {
            next: { revalidate: CACHE_TTL_SECONDS }
          }
        );

        if (!response.ok) {
          throw new Error("ExchangeRate-API rate fetch failed.");
        }

        const payload = (await response.json()) as ExchangeRateApiPayload;
        const usdToNgn = payload.conversion_rates?.NGN;
        const usdToGbp = payload.conversion_rates?.GBP;
        const usdToCad = payload.conversion_rates?.CAD;

        if (
          typeof usdToNgn !== "number" ||
          typeof usdToGbp !== "number" ||
          typeof usdToCad !== "number"
        ) {
          throw new Error("ExchangeRate-API returned incomplete conversion rates.");
        }

        return {
          date: d.label,
          USD: usdToNgn,
          GBP: usdToNgn / usdToGbp,
          CAD: usdToNgn / usdToCad
        };
      } catch {
        return { date: d.label, USD: null, GBP: null, CAD: null };
      }
    })
  );

  const filtered = results.filter(
    (point) => point.USD !== null && point.GBP !== null && point.CAD !== null
  );

  if (!filtered.length) {
    return NextResponse.json(
      { trend: [], error: true },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { trend: filtered, source: "exchangerate-api" },
    {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=60`
      }
    }
  );
}
