import { NextRequest, NextResponse } from "next/server";

import { finalizeAIReply, GEMINI_MODEL, getGeminiClient, hasGeminiApiKey } from "@/lib/gemini";
import { getAIContext } from "@/lib/getAIContext";
import {
  buildManualBestTimeRecommendation,
  type CorridorInsight
} from "@/lib/marketSnapshot";
import { isSenderCountry, type SenderCountry } from "@/lib/providers";

export const runtime = "nodejs";

function getRequestAmount(value: string | null) {
  const parsedValue = Number.parseFloat(value ?? "500");
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 500;
}

function getRequestSenderCountry(value: string | null): SenderCountry {
  return value && isSenderCountry(value) ? value : "USA";
}

function buildPrompt(corridor: CorridorInsight) {
  const deltaLabel = corridor.weeklyTransferDeltaNaira >= 0 ? "gain" : "loss";

  return [
    "You are a professional Currency Analyst for Nigerian diaspora senders.",
    `Current ${corridor.sourceCurrency}/NGN rate: ${corridor.currentRate.toFixed(2)}.`,
    `7-day average: ${corridor.sevenDayAverage.toFixed(2)}.`,
    `Weekly difference on this ${corridor.sourceCurrency} ${corridor.amount.toFixed(0)} transfer: ${Math.abs(corridor.weeklyTransferDeltaNaira).toFixed(2)} NGN ${deltaLabel}.`,
    `Best provider today: ${corridor.bestProvider}. Worst provider today: ${corridor.worstProvider}. Max savings: ${corridor.maxSavings.toFixed(2)} NGN.`,
    "Rules:",
    "1. Max 2 sentences.",
    "2. Start with a clear action like 'Wait 48 hours' or 'Send immediately'.",
    "3. Use a friendly Nigerian diaspora tone.",
    "4. Mention the exact naira difference versus last week.",
    "5. Include a confidence label in plain English.",
    "6. End with 'SaveRate AI 🤖 🇳🇬'."
  ].join("\n");
}

async function getGeminiRecommendation(corridor: CorridorInsight) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: buildPrompt(corridor),
    config: {
      temperature: 0.4,
      maxOutputTokens: 120
    }
  });

  return finalizeAIReply(response.text, {
    enforceTwoSentences: true
  });
}

export async function GET(request: NextRequest) {
  const amount = getRequestAmount(request.nextUrl.searchParams.get("amount"));
  const senderCountry = getRequestSenderCountry(
    request.nextUrl.searchParams.get("senderCountry")
  );
  const baseUrl = new URL(request.url).origin;

  try {
    const context = await getAIContext({
      amount,
      baseUrl
    });
    const corridor = context.snapshot.corridors[senderCountry];
    const manualRecommendation = buildManualBestTimeRecommendation(corridor);

    if (!hasGeminiApiKey()) {
      return NextResponse.json(
        {
          confidence: corridor.confidence,
          marketSnapshot: context.marketSnapshot,
          mode: "manual",
          recommendation: manualRecommendation,
          senderCountry,
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
      const recommendation = await getGeminiRecommendation(corridor);

      return NextResponse.json(
        {
          confidence: corridor.confidence,
          marketSnapshot: context.marketSnapshot,
          mode: context.source === "api" ? "gemini" : "manual",
          recommendation,
          senderCountry,
          snapshot: corridor,
          source:
            context.source === "api" ? "gemini" : "manual-analyst-view"
        },
        {
          headers: {
            "Cache-Control": "s-maxage=60, stale-while-revalidate=300"
          }
        }
      );
    } catch {
      return NextResponse.json(
        {
          confidence: corridor.confidence,
          marketSnapshot: context.marketSnapshot,
          mode: "manual",
          recommendation: manualRecommendation,
          senderCountry,
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
            : "Unable to prepare the analyst view right now."
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

