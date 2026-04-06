import { NextRequest, NextResponse } from "next/server";

import {
  buildGeminiHistory,
  finalizeAIReply,
  GEMINI_MODEL,
  getGeminiClient,
  hasGeminiApiKey,
  type ChatMessageInput
} from "@/lib/gemini";
import { getAIContext } from "@/lib/getAIContext";
import { buildManualChatReply } from "@/lib/marketSnapshot";
import { isSenderCountry, type SenderCountry } from "@/lib/providers";

export const runtime = "nodejs";

interface ChatRequestPayload {
  amount?: number;
  history?: ChatMessageInput[];
  message?: string;
  senderCountry?: SenderCountry;
}

function getRequestAmount(value?: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 500;
}

function getRequestSenderCountry(value?: string): SenderCountry {
  return value && isSenderCountry(value) ? value : "USA";
}

function detectUnsupportedRateRequest(message: string) {
  return /\b(eur|€|aud|nzd|jpy|yen|inr|rupee|kes|ghs|zar|xof|xaf|btc|usdt)\b/i.test(
    message
  ) || /₦\s*\d|ngn\s*\d/i.test(message);
}

function detectRequestedAmount(message: string, fallbackAmount: number) {
  const match = message.match(
    /(?:\$|usd|£|gbp|cad\s*|ca\$)\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i
  ) ?? message.match(/([0-9][0-9,]*(?:\.[0-9]+)?)\s*(usd|gbp|cad)/i);

  if (!match) {
    return fallbackAmount;
  }

  const parsedValue = Number.parseFloat(match[1].replace(/,/g, ""));
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackAmount;
}

function buildSystemInstruction(marketSnapshot: string, senderCountry: SenderCountry) {
  return [
    "You are SaveRateAfrica's AI remittance analyst for Nigerians in the diaspora.",
    "Use only the verified market snapshot below. Do not invent rates, providers, or corridors.",
    `The user's current sender market is ${senderCountry}.`,
    "If the user asks for any rate, currency, or corridor not covered in the snapshot, reply with: 'I only provide verified live data. Based on my current records, [Provider] is your best bet.' Then sign off with 'SaveRate AI 🤖 🇳🇬'.",
    "Keep answers concise, practical, and culturally warm.",
    "Always use ₦ and $ symbols correctly when relevant, and always end with 'SaveRate AI 🤖 🇳🇬'.",
    marketSnapshot
  ].join("\n\n");
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ChatRequestPayload;
    const senderCountry = getRequestSenderCountry(payload.senderCountry);
    const message = payload.message?.trim();

    if (!message) {
      return NextResponse.json(
        {
          error: "A message is required."
        },
        {
          status: 400
        }
      );
    }

    const amount = detectRequestedAmount(message, getRequestAmount(payload.amount));
    const context = await getAIContext({
      amount,
      baseUrl: new URL(request.url).origin
    });
    const corridor = context.snapshot.corridors[senderCountry];

    if (detectUnsupportedRateRequest(message)) {
      return NextResponse.json(
        {
          message: `I only provide verified live data. Based on my current records, ${corridor.bestProvider} is your best bet. SaveRate AI 🤖 🇳🇬`,
          mode: "guardrail",
          snapshot: corridor,
          source: "manual-analyst-view"
        },
        {
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    }

    const manualReply = buildManualChatReply(message, corridor);

    if (!hasGeminiApiKey()) {
      return NextResponse.json(
        {
          message: manualReply,
          mode: "manual",
          snapshot: corridor,
          source: "manual-analyst-view"
        },
        {
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    }

    try {
      const ai = getGeminiClient();
      const chat = ai.chats.create({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: buildSystemInstruction(
            context.marketSnapshot,
            senderCountry
          ),
          temperature: 0.35,
          maxOutputTokens: 220
        },
        history: buildGeminiHistory(payload.history ?? [])
      });
      const response = await chat.sendMessage({
        message
      });

      return NextResponse.json(
        {
          message: finalizeAIReply(response.text),
          mode: context.source === "api" ? "gemini" : "manual",
          snapshot: corridor,
          source:
            context.source === "api" ? "gemini" : "manual-analyst-view"
        },
        {
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    } catch {
      return NextResponse.json(
        {
          message: manualReply,
          mode: "manual",
          snapshot: corridor,
          source: "manual-analyst-view"
        },
        {
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to reach SaveRate AI right now."
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

