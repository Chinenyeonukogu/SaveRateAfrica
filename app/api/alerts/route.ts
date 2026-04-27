import { NextResponse } from "next/server";

const ALERTS_API_ENDPOINT =
  "https://kcjhk91q5b.execute-api.us-east-1.amazonaws.com/production/alerts";
const currencyByCountry = {
  USA: "USD",
  Canada: "CAD",
  UK: "GBP"
} as const;

type AlertCountry = keyof typeof currencyByCountry;

function isAlertCountry(value: unknown): value is AlertCountry {
  return value === "USA" || value === "Canada" || value === "UK";
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    targetRate?: number;
    currency?: string;
    country?: string;
  };

  const targetRate = body.targetRate ?? 0;
  const email = body.email?.trim();
  const country = isAlertCountry(body.country) ? body.country : null;
  const currency = country ? currencyByCountry[country] : null;

  if (!Number.isFinite(targetRate) || targetRate <= 0) {
    return NextResponse.json(
      { error: "Please enter a valid target rate." },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Email is required for email alerts." },
      { status: 400 }
    );
  }

  if (!country || body.currency !== currency) {
    return NextResponse.json(
      { error: "Please choose a valid country." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(ALERTS_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, targetRate, currency, country })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to create alert right now. Please try again." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: `We will alert you when the rate hits NGN ${targetRate.toLocaleString("en-US")} per unit.`
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create alert right now. Please try again." },
      { status: 502 }
    );
  }
}
