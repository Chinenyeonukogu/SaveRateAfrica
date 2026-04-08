"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  MessageSquareText,
  SendHorizonal,
  X
} from "lucide-react";

import { buildSmartAssistantReply } from "@/lib/aiAssistant";
import { formatCurrency, formatNaira } from "@/lib/format";
import type { ComparisonResult } from "@/lib/fetchRates";
import { buildCorridorInsight } from "@/lib/marketSnapshot";

interface AssistantMessage {
  content: string;
  id: string;
  role: "assistant" | "user";
  source?: "gemini" | "manual-analyst-view";
}

interface ChatResponse {
  message: string;
  source: "gemini" | "manual-analyst-view";
}

interface AIAssistantProps {
  comparison: ComparisonResult;
}

const suggestionChips = [
  {
    label: "Fastest provider now",
    prompt: "Fastest provider now"
  },
  {
    label: "Best rate for $500",
    prompt: "Best rate for $500"
  },
  {
    label: "Cheapest to send today",
    prompt: "Cheapest to send today"
  },
  {
    label: "LemFi vs Wise",
    prompt: "Compare LemFi vs Wise for $500"
  }
] as const;

export function AIAssistant({ comparison }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      content:
        "Ask about rates, fees, fastest providers, or your exact NGN payout and I’ll use the live comparison data on this page.",
      id: "intro",
      role: "assistant",
      source: "manual-analyst-view"
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  async function submitMessage(rawMessage: string) {
    const trimmedInput = rawMessage.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    const nextUserMessage: AssistantMessage = {
      content: trimmedInput,
      id: `${Date.now()}-user`,
      role: "user"
    };

    setMessages((currentMessages) => [...currentMessages, nextUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: comparison.amount,
          comparison,
          history: messages
            .filter((message) => message.id !== "intro")
            .map((message) => ({
              content: message.content,
              role: message.role
            })),
          message: trimmedInput,
          senderCountry: comparison.senderCountry
        })
      });

      if (!response.ok) {
        throw new Error("Unable to reach SaveRate AI.");
      }

      const payload = (await response.json()) as ChatResponse;
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          content: payload.message,
          id: `${Date.now()}-assistant`,
          role: "assistant",
          source: payload.source
        }
      ]);
    } catch {
      const fallbackReply = buildSmartAssistantReply(trimmedInput, comparison);

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          content: fallbackReply,
          id: `${Date.now()}-manual`,
          role: "assistant",
          source: "manual-analyst-view"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitMessage(input);
  }

  async function handleChipClick(prompt: string) {
    setInput(prompt);
    await submitMessage(prompt);
  }

  const corridorInsight = buildCorridorInsight(comparison);

  return (
    <>
      <button
        aria-controls="ask-ai-panel"
        aria-label="Ask AI"
        aria-expanded={isOpen}
        className="group fixed bottom-5 right-5 z-[999] flex h-11 w-11 items-center justify-center rounded-full bg-[#2e7d32] text-[18px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-[transform,box-shadow] duration-200 hover:scale-[1.08] hover:shadow-[0_4px_16px_rgba(46,125,50,0.3)] max-[599px]:bottom-4 max-[599px]:right-4 max-[599px]:h-10 max-[599px]:w-10 max-[599px]:text-[16px]"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[52px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[4px] bg-[#1a2e1a] px-[10px] py-1 text-[11px] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          Ask AI
        </span>
        <span aria-hidden="true">✦</span>
      </button>

      <div
        className={`fixed inset-0 z-50 transition ${isOpen ? "pointer-events-auto bg-brand-navy/50 backdrop-blur-sm" : "pointer-events-none bg-transparent"}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed inset-0 flex flex-col bg-brand-navy text-white transition duration-300 md:inset-auto md:bottom-6 md:right-6 md:h-[680px] md:w-[380px] md:rounded-[30px] md:border md:border-brand-green/20 md:shadow-float ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 md:translate-y-8"
          }`}
          id="ask-ai-panel"
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="border-b border-white/10 bg-hero-mesh px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                  <Bot className="h-4 w-4" />
                  SaveRateAI
                </div>
                <h2 className="mt-3 text-2xl font-heading">SaveRateAI</h2>
                <p className="mt-2 text-[10px] text-[#888]">
                  Powered by live provider data · Updated 5 min ago
                </p>
              </div>

              <button
                aria-label="Close AI assistant"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="border-b border-white/10 px-5 py-4 text-sm text-white/75">
            Best verified route right now:{" "}
            <span className="font-semibold text-brand-green">
              {corridorInsight.bestProvider}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-white">
              {formatNaira(corridorInsight.bestAmount, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>{" "}
            for a{" "}
            <span className="font-semibold text-white">
              {formatCurrency(comparison.amount, comparison.sourceCurrency, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </span>{" "}
            send.
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-[24px] px-4 py-3 text-sm leading-7 ${
                  message.role === "user"
                    ? "ml-auto bg-brand-green text-white"
                    : "bg-white/5 text-white/90"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-green">
                    <MessageSquareText className="h-3.5 w-3.5" />
                    {message.source === "manual-analyst-view"
                      ? "Manual Analyst View"
                      : "Gemini Live"}
                  </div>
                ) : null}
                <p>{message.content}</p>
              </div>
            ))}

            {isLoading ? (
              <div className="max-w-[85%] rounded-[24px] bg-white/5 px-4 py-3">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-green">
                  SaveRate AI is thinking
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-green" />
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-green [animation-delay:120ms]" />
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-green [animation-delay:240ms]" />
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <form className="border-t border-white/10 p-4" onSubmit={handleSubmit}>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-2">
              <div className="flex flex-wrap gap-[6px] px-3 pb-2 pt-1">
                {suggestionChips.map((chip) => (
                  <button
                    key={chip.label}
                    className="rounded-full bg-[#e8f5e9] px-3 py-[5px] text-[11px] text-[#2e7d32]"
                    type="button"
                    onClick={() => void handleChipClick(chip.prompt)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <textarea
                aria-label="Ask SaveRate AI about your current transfer"
                className="min-h-24 w-full resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/40"
                placeholder="Ask about rates, fees, or fastest provider..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <div className="flex items-center justify-between gap-3 border-t border-white/10 px-3 pt-3">
                <p className="text-xs text-white/45">
                  Uses live verified rates only.
                </p>
                <button
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-green px-4 text-sm font-semibold text-white transition hover:bg-[#06d45a] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!input.trim() || isLoading}
                  type="submit"
                >
                  Send
                  <SendHorizonal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
