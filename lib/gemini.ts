import "server-only";

import { GoogleGenAI, type Content } from "@google/genai";

export const GEMINI_MODEL = "gemini-1.5-flash-001";

let geminiClient: GoogleGenAI | null = null;

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export function hasGeminiApiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }

  return geminiClient;
}

export function buildGeminiHistory(messages: ChatMessageInput[]) {
  const limitedMessages = messages
    .filter((message) => message.content.trim().length > 0)
    .slice(-10);
  const normalizedMessages =
    limitedMessages[0]?.role === "assistant"
      ? limitedMessages.slice(1)
      : limitedMessages;
  const history: Content[] = [];
  let expectedRole: "user" | "assistant" = "user";

  for (const message of normalizedMessages) {
    if (message.role !== expectedRole) {
      continue;
    }

    history.push({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }]
    });

    expectedRole = message.role === "user" ? "assistant" : "user";
  }

  if (history.at(-1)?.role === "user") {
    history.pop();
  }

  return history;
}

function trimToTwoSentences(text: string) {
  const sentences = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  return sentences.slice(0, 2).join(" ");
}

export function finalizeAIReply(
  text: string | undefined,
  {
    enforceTwoSentences = false
  }: {
    enforceTwoSentences?: boolean;
  } = {}
) {
  const fallbackText = text?.trim() || "Monitor closely and use the live comparison table for the latest verified payout data.";
  const normalizedText = enforceTwoSentences
    ? trimToTwoSentences(fallbackText)
    : fallbackText.replace(/\s+/g, " ").trim();

  if (normalizedText.includes("SaveRate AI 🤖")) {
    return normalizedText;
  }

  return `${normalizedText} SaveRate AI 🤖 🇳🇬`;
}

