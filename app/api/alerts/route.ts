import { NextResponse } from "next/server";

const ALERTS_API_ENDPOINT =
  "https://kcjhk91q5b.execute-api.us-east-1.amazonaws.com/production/alerts";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    targetRate?: number;
  };

  const targetRate = body.targetRate ?? 0;
  const email = body.email?.trim();

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

  try {
    const response = await fetch(ALERTS_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, targetRate })
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
