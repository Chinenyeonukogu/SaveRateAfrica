import { NextRequest, NextResponse } from "next/server";

import {
  buildAssistantPromptContext,
  buildSmartAssistantReply,
  detectAssistantIntent,
  SAVE_RATE_AI_SYSTEM_PROMPT,
  shouldReplyDeterministically
} from "@/lib/aiAssistant";
import {
  buildGeminiHistory,
  GEMINI_MODEL,
  getGeminiClient,
  hasGeminiApiKey,
  type ChatMessageInput
} from "@/lib/gemini";
import { getAIContext } from "@/lib/getAIContext";
import type { ComparisonResult } from "@/lib/fetchRates";
import { isSenderCountry, type SenderCountry } from "@/lib/providers";

export const runtime = "nodejs";

interface ChatRequestPayload {
  amount?: number;
  comparison?: ComparisonResult;
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

function hasComparisonSnapshot(value?: ComparisonResult): value is ComparisonResult {
  return Boolean(
    value &&
      Array.isArray(value.providers) &&
      value.providers.length > 0 &&
      value.liveBaseRates &&
      value.updatedAt &&
      value.sourceUpdatedAt &&
      value.cachedUntil
  );
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

    const amount = detectRequestedAmount(
      message,
      getRequestAmount(payload.amount ?? payload.comparison?.amount)
    );
    const context = await getAIContext({
      amount,
      baseUrl: new URL(request.url).origin
    });
    const liveComparison = hasComparisonSnapshot(payload.comparison)
      ? payload.comparison
      : context.comparisons[senderCountry];
    const corridor = context.snapshot.corridors[senderCountry];
    const intent = detectAssistantIntent(message, liveComparison);
    const manualReply = buildSmartAssistantReply(message, liveComparison);

    if (shouldReplyDeterministically(intent)) {
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
          systemInstruction: SAVE_RATE_AI_SYSTEM_PROMPT,
          temperature: 0.35,
          maxOutputTokens: 220
        },
        history: buildGeminiHistory(payload.history ?? [])
      });
      const response = await chat.sendMessage({
        message: buildAssistantPromptContext(liveComparison, message, intent)
      });

      return NextResponse.json(
        {
          message: response.text?.replace(/\s+\n/g, "\n").trim() || manualReply,
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
