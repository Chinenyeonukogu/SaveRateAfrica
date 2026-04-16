import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    channel?: "email" | "sms";
    email?: string;
    phone?: string;
    targetRate?: number;
  };

  const targetRate = body.targetRate ?? 0;

  if (!Number.isFinite(targetRate) || targetRate <= 0) {
    return NextResponse.json(
      { error: "Please enter a valid target rate." },
      { status: 400 }
    );
  }

  if (body.channel === "sms" && !body.phone) {
    return NextResponse.json(
      { error: "Phone number is required for SMS alerts." },
      { status: 400 }
    );
  }

  if ((body.channel === "email" || !body.channel) && !body.email) {
    return NextResponse.json(
      { error: "Email is required for email alerts." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    alertId: randomUUID(),
    message: `We will alert you when the rate hits NGN ${targetRate.toLocaleString("en-US")} per unit.`
  });
}
