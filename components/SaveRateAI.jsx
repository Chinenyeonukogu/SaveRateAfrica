"use client";

import { useEffect, useRef, useState } from "react";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const quickReplies = [
  "🇺🇸 Best USD rate now?",
  "🇬🇧 Best GBP rate now?",
  "🇨🇦 Best CAD rate now?",
  "❓ How do I use this site?",
  "🔔 Set a rate alert",
  "🆘 Get help"
];

const openingGreeting = `Hi, I'm Eva! 👋
Your SaveRate AI assistant — here to help you find the best rates, save money on transfers, and support you every step of the way.
What can I help you with today?`;

const baseSystemPrompt = `You are Eva, SaveRateAfrica's warm and friendly AI assistant. Your personality is encouraging, helpful, and supportive. You help Nigerian diaspora users find the best remittance rates for sending USD, GBP, and CAD to NGN.

About SaveRateAfrica:
- Free remittance comparison platform for Nigerian diaspora
- Compares 14 providers including LemFi, Wise, WorldRemit, Remitly, Western Union, MoneyGram
- Users compare USD, GBP, and CAD to NGN rates
- We show live rates, fees, speed, and payout value
- We NEVER hold funds or process transfers ourselves
- Rate alerts can be set from the Currency Trends chart on the homepage

How to use the site:
1. Go to Compare Rates section
2. Select sending country (USA, UK, or Canada)
3. Enter the amount to send
4. Click Compare Rates Now
5. View providers ranked by best payout
6. Click preferred provider to send

How to set a rate alert:
1. Scroll to Currency Trends chart on homepage
2. Click the gold Set Rate Alert button
3. Enter target NGN rate and email address
4. We notify you when any provider hits that rate

Getting help:
- Use Eva chat for instant answers
- Visit Contact Us page for email support
- Check How It Works section on homepage

Always end responses with an encouraging line like:
You are making a smart move sending with SaveRateAfrica!`;

function getTimeLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function createMessage(role, text) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    timestamp: getTimeLabel()
  };
}

function normalizeRateRow(row) {
  const currency =
    row?.currency ||
    row?.source_currency ||
    row?.from_currency ||
    row?.base_currency ||
    row?.corridor;
  const provider = row?.provider || row?.provider_name || row?.name || "Unknown provider";
  const rate = Number(row?.rate ?? row?.exchange_rate ?? row?.ngn_rate ?? row?.value);

  if (!currency || !Number.isFinite(rate)) {
    return null;
  }

  const normalizedCurrency = String(currency).toUpperCase().includes("GBP")
    ? "GBP"
    : String(currency).toUpperCase().includes("CAD")
      ? "CAD"
      : String(currency).toUpperCase().includes("USD")
        ? "USD"
        : null;

  if (!normalizedCurrency) {
    return null;
  }

  return {
    currency: normalizedCurrency,
    provider,
    rate
  };
}

function buildRatesSummary(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return "Live Supabase rates are unavailable right now.";
  }

  const bestByCurrency = rows
    .map(normalizeRateRow)
    .filter(Boolean)
    .reduce((bestRates, row) => {
      const current = bestRates[row.currency];
      if (!current || row.rate > current.rate) {
        bestRates[row.currency] = row;
      }
      return bestRates;
    }, {});

  const summaryLines = ["Current best rates from Supabase exchange_rates:"];
  ["USD", "GBP", "CAD"].forEach((currency) => {
    const best = bestByCurrency[currency];
    if (best) {
      summaryLines.push(`- ${currency}: ${best.provider} at ${best.rate} NGN/${currency}`);
    }
  });

  return summaryLines.length > 1
    ? summaryLines.join("\n")
    : "Live Supabase rates are unavailable right now.";
}

async function fetchSupabaseRates() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return "Live Supabase rates are unavailable right now.";
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/exchange_rates?select=*&limit=100`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Supabase rates fetch failed.");
    }

    return buildRatesSummary(await response.json());
  } catch {
    return "Live Supabase rates are unavailable right now.";
  }
}

async function askGemini(message, history) {
  const liveRates = await fetchSupabaseRates();
  const systemPrompt = `${baseSystemPrompt}

${liveRates}

If live Supabase rates are unavailable, answer with general SaveRateAfrica guidance and avoid pretending to know live winners.`;

  if (!GEMINI_API_KEY) {
    return "I can help with rate comparisons, alerts, and how to use SaveRateAfrica. The Gemini API key is not available in the browser right now, so I cannot generate a live AI response. You are making a smart move sending with SaveRateAfrica!";
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}

Conversation so far:
${history.map((item) => `${item.role === "user" ? "User" : "Eva"}: ${item.text}`).join("\n")}

User: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: 360
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error("Gemini request failed.");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function fallbackReply(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("alert")) {
    return "To set a rate alert, go to the Currency Trends chart on the homepage, click the gold Set Rate Alert button, then enter your target NGN rate and email address. We will notify you when your target is reached. You are making a smart move sending with SaveRateAfrica!";
  }

  if (normalized.includes("help") || normalized.includes("use this site")) {
    return "Start at Compare Rates, choose USA, UK, or Canada, enter the amount you want to send, then click Compare Rates Now. SaveRateAfrica ranks providers by payout value so you can choose confidently. You are making a smart move sending with SaveRateAfrica!";
  }

  return "SaveRateAfrica helps you compare USD, GBP, and CAD to NGN providers by live rates, fees, speed, and payout value. I can help you understand the best option for your transfer. You are making a smart move sending with SaveRateAfrica!";
}

export function SaveRateAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function openChat() {
    setIsOpen(true);
    setMessages((current) =>
      current.length ? current : [createMessage("bot", openingGreeting)]
    );
  }

  function closeChat() {
    setIsOpen(false);
  }

  async function sendMessage(text) {
    const trimmedText = text.trim();
    if (!trimmedText || isTyping) {
      return;
    }

    const userMessage = createMessage("user", trimmedText);
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const reply = await askGemini(trimmedText, nextMessages);
      setMessages((current) => [...current, createMessage("bot", reply)]);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage("bot", fallbackReply(trimmedText))
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    void sendMessage(inputValue);
  }

  return (
    <div className="save-rate-ai" aria-live="polite">
      {isOpen ? (
        <section className="save-rate-ai-window" aria-label="SaveRate AI chat window">
          <header className="save-rate-ai-header">
            <div className="save-rate-ai-avatar" aria-hidden="true">
              E
            </div>
            <div className="save-rate-ai-title-wrap">
              <h2>SaveRate AI</h2>
              <p>Eva is Online — Here to help!</p>
            </div>
            <button
              aria-label="Close SaveRate AI"
              className="save-rate-ai-close"
              type="button"
              onClick={closeChat}
            >
              ×
            </button>
          </header>

          <div className="save-rate-ai-messages">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`save-rate-ai-message save-rate-ai-message-${message.role}`}
              >
                {message.text.split("\n").map((line, index) => (
                  <p key={`${message.id}-${index}`}>{line}</p>
                ))}
                <span>{message.timestamp}</span>
              </article>
            ))}

            {isTyping ? (
              <div className="save-rate-ai-typing" aria-label="Eva is typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 ? (
            <div className="save-rate-ai-quick-replies">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => void sendMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}

          <form className="save-rate-ai-form" onSubmit={handleSubmit}>
            <input
              aria-label="Message Eva"
              placeholder="Ask Eva about rates..."
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button aria-label="Send message" type="submit">
              <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </form>
        </section>
      ) : (
        <button
          aria-label="Open SaveRate AI chat"
          className="save-rate-ai-bubble"
          type="button"
          onClick={openChat}
        >
          <svg aria-hidden="true" fill="none" height="26" viewBox="0 0 24 24" width="26">
            <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H7l-4 2v-5.2A8.5 8.5 0 1 1 21 12Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            <path d="M8 11h8M8 14h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      )}

      <style jsx>{`
        .save-rate-ai {
          bottom: 24px;
          font-family: "DM Sans", sans-serif;
          position: fixed;
          right: 24px;
          z-index: 9999;
        }

        .save-rate-ai-bubble {
          align-items: center;
          background: #1a6b3c;
          border: 0;
          border-radius: 999px;
          box-shadow: 0 14px 32px rgba(26, 107, 60, 0.32);
          color: #ffffff;
          cursor: pointer;
          display: flex;
          height: 62px;
          justify-content: center;
          transition: transform 180ms ease, box-shadow 180ms ease;
          width: 62px;
        }

        .save-rate-ai-bubble:hover {
          box-shadow: 0 18px 40px rgba(26, 107, 60, 0.42);
          transform: translateY(-2px) scale(1.03);
        }

        .save-rate-ai-window {
          animation: save-rate-ai-slide-up 240ms ease-out;
          background: #f6fbf7;
          border: 1px solid #c8e6c9;
          border-radius: 18px;
          box-shadow: 0 22px 60px rgba(13, 31, 18, 0.22);
          display: flex;
          flex-direction: column;
          height: min(640px, calc(100vh - 48px));
          max-height: 640px;
          overflow: hidden;
          width: 390px;
        }

        .save-rate-ai-header {
          align-items: center;
          background: linear-gradient(135deg, #1a6b3c, #2d9e5f);
          color: #ffffff;
          display: flex;
          gap: 12px;
          padding: 16px;
        }

        .save-rate-ai-avatar {
          align-items: center;
          background: #0f512b;
          border: 2px solid rgba(255, 255, 255, 0.34);
          border-radius: 999px;
          display: flex;
          font-family: "Sora", sans-serif;
          font-size: 18px;
          font-weight: 800;
          height: 42px;
          justify-content: center;
          width: 42px;
        }

        .save-rate-ai-title-wrap {
          min-width: 0;
        }

        .save-rate-ai-title-wrap h2 {
          font-family: "Sora", sans-serif;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0;
        }

        .save-rate-ai-title-wrap p {
          color: rgba(255, 255, 255, 0.82);
          font-size: 11px;
          font-weight: 600;
          margin: 3px 0 0;
        }

        .save-rate-ai-close {
          align-items: center;
          background: rgba(255, 255, 255, 0.16);
          border: 0;
          border-radius: 999px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          font-size: 22px;
          height: 32px;
          justify-content: center;
          margin-left: auto;
          width: 32px;
        }

        .save-rate-ai-messages {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          padding: 16px;
        }

        .save-rate-ai-message {
          border-radius: 16px;
          max-width: 86%;
          padding: 12px 14px 9px;
        }

        .save-rate-ai-message p {
          font-size: 13px;
          font-weight: 600;
          line-height: 1.55;
          margin: 0 0 7px;
          white-space: pre-wrap;
        }

        .save-rate-ai-message span {
          display: block;
          font-size: 10px;
          font-weight: 700;
          opacity: 0.65;
        }

        .save-rate-ai-message-bot {
          align-self: flex-start;
          background: #ffffff;
          box-shadow: 0 6px 18px rgba(26, 107, 60, 0.1);
          color: #14351f;
        }

        .save-rate-ai-message-user {
          align-self: flex-end;
          background: linear-gradient(135deg, #1a6b3c, #2d9e5f);
          color: #ffffff;
        }

        .save-rate-ai-quick-replies {
          border-top: 1px solid #dbeedd;
          display: grid;
          gap: 8px;
          grid-template-columns: 1fr 1fr;
          padding: 12px 14px;
        }

        .save-rate-ai-quick-replies button {
          background: #ffffff;
          border: 1.5px solid #1a6b3c;
          border-radius: 999px;
          color: #1a6b3c;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          min-height: 36px;
          padding: 7px 10px;
          transition: background 160ms ease, color 160ms ease, transform 160ms ease;
        }

        .save-rate-ai-quick-replies button:hover {
          background: #1a6b3c;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .save-rate-ai-typing {
          align-items: center;
          align-self: flex-start;
          background: #ffffff;
          border-radius: 999px;
          box-shadow: 0 6px 18px rgba(26, 107, 60, 0.1);
          display: flex;
          gap: 5px;
          padding: 12px 14px;
        }

        .save-rate-ai-typing span {
          animation: save-rate-ai-bounce 900ms infinite ease-in-out;
          background: #1a6b3c;
          border-radius: 999px;
          height: 7px;
          width: 7px;
        }

        .save-rate-ai-typing span:nth-child(2) {
          animation-delay: 140ms;
        }

        .save-rate-ai-typing span:nth-child(3) {
          animation-delay: 280ms;
        }

        .save-rate-ai-form {
          align-items: center;
          background: #ffffff;
          border-top: 1px solid #dbeedd;
          display: flex;
          gap: 10px;
          padding: 12px;
        }

        .save-rate-ai-form input {
          background: #f4faf5;
          border: 1px solid #c8e6c9;
          border-radius: 999px;
          color: #14351f;
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          min-width: 0;
          outline: none;
          padding: 11px 14px;
        }

        .save-rate-ai-form input:focus {
          border-color: #1a6b3c;
          box-shadow: 0 0 0 3px rgba(26, 107, 60, 0.12);
        }

        .save-rate-ai-form button {
          align-items: center;
          background: #1a6b3c;
          border: 0;
          border-radius: 999px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          height: 42px;
          justify-content: center;
          width: 42px;
        }

        @keyframes save-rate-ai-slide-up {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes save-rate-ai-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
        }

        @media (max-width: 640px) {
          .save-rate-ai {
            bottom: 82px;
            left: 14px;
            right: 14px;
          }

          .save-rate-ai-bubble {
            height: 56px;
            margin-left: auto;
            width: 56px;
          }

          .save-rate-ai-window {
            height: min(620px, calc(100vh - 104px));
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default SaveRateAI;
