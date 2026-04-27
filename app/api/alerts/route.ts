import { NextResponse } from "next/server";

const ALERTS_API_ENDPOINT =
  "https://kcjhk91q5b.execute-api.us-east-1.amazonaws.com/production/alerts";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      targetRate?: number;
    };

    const email = body.email?.trim();
    const targetRate = body.targetRate ?? 0;

    if (!email || !Number.isFinite(targetRate) || targetRate <= 0) {
      return NextResponse.json(
        { error: "Email and a valid target rate are required." },
        { status: 400 }
      );
    }

    const response = await fetch(ALERTS_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, targetRate })
    });

    const responseBody = await response.json().catch(() => ({}));

    return NextResponse.json(responseBody, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Unable to create alert right now. Please try again." },
      { status: 500 }
    );
  }
}
