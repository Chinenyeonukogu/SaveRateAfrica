import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiGatewayUrl = process.env.AWS_API_GATEWAY_URL;
    const apiKey = process.env.AWS_API_KEY;
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

    if (!apiGatewayUrl) {
      return NextResponse.json(
        { error: "AWS_API_GATEWAY_URL is not configured." },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "AWS_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const awsRequestBody = { email, targetRate };

    console.log("[api/alerts] Calling AWS API Gateway URL:", apiGatewayUrl);
    console.log("[api/alerts] Sending AWS request body:", awsRequestBody);

    const response = await fetch(apiGatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: JSON.stringify(awsRequestBody)
    });

    const responseText = await response.text();
    let responseBody: unknown = responseText;

    try {
      responseBody = responseText ? JSON.parse(responseText) : {};
    } catch {}

    if (!response.ok) {
      console.error("[api/alerts] AWS API Gateway error:", {
        url: apiGatewayUrl,
        status: response.status,
        statusText: response.statusText,
        body: responseBody
      });

      return NextResponse.json(
        {
          error: "The alert service rejected the request.",
          calledUrl: apiGatewayUrl,
          upstreamStatus: response.status,
          upstreamStatusText: response.statusText,
          upstreamBody: responseBody
        },
        { status: 502 }
      );
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create alert right now. Please try again." },
      { status: 500 }
    );
  }
}
