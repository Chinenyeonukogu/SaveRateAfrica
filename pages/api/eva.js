import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const GEMINI_MODEL = "gemini-1.5-flash-001";
const SUPPORT_MESSAGE =
  "For additional support please contact us at partnerships@saverateafrica.com, we respond within 24 hours.";
const SUPPORTED_CURRENCIES = ["USD", "GBP", "CAD"];

let supabaseClient = null;

const systemPrompt = `You are Eva, SaveRateAfrica's helpful AI assistant for Nigerian diaspora money transfers.
Use only the live SaveRateAfrica exchange-rate context provided in the prompt.
Keep answers concise, practical, and friendly.
For best-rate button requests, explain which provider is best and why in exactly 2 sentences.
For free-text questions, answer only if the question is about SaveRateAfrica, remittance providers, USD/GBP/CAD to NGN exchange rates, fees, transfer value, rate alerts, or using the website.
If the user asks anything outside that scope, respond exactly with: ${SUPPORT_MESSAGE}`;

function normalizeCurrency(value) {
  const currency = String(value || "").toUpperCase();
  return SUPPORTED_CURRENCIES.includes(currency) ? currency : null;
}

function detectCurrencyRequest(message) {
  const normalized = message.toUpperCase();

  return SUPPORTED_CURRENCIES.find(
    (currency) =>
      normalized.includes(`BEST ${currency}`) ||
      normalized.includes(`${currency} RATE`) ||
      normalized.includes(`${currency}/NGN`)
  );
}

function isHelpRequest(message) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("get help") ||
    normalized.includes("support") ||
    normalized.includes("contact")
  );
}

function isSiteGuidanceRequest(message) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("how do i use") ||
    normalized.includes("use this site") ||
    normalized.includes("how it works")
  );
}

function isRateAlertRequest(message) {
  return message.toLowerCase().includes("alert");
}

function hasOutOfScopeTopic(message) {
  const normalized = message.toLowerCase();
  const outOfScopeKeywords = [
    "bitcoin",
    "crypto",
    "stock",
    "stocks",
    "weather",
    "sports",
    "football",
    "politics",
    "medical",
    "doctor",
    "lawyer",
    "recipe",
    "homework"
  ];

  return outOfScopeKeywords.some((keyword) => normalized.includes(keyword));
}

function isLikelyInScope(message) {
  const normalized = message.toLowerCase();
  const keywords = [
    "rate",
    "rates",
    "send",
    "money",
    "naira",
    "ngn",
    "usd",
    "gbp",
    "cad",
    "provider",
    "fee",
    "fees",
    "transfer",
    "remit",
    "remittance",
    "wise",
    "remitly",
    "sendwave",
    "pesa",
    "nala",
    "flutterwave",
    "paysend",
    "alert",
    "saverateafrica",
    "compare"
  ];

  return keywords.some((keyword) => normalized.includes(keyword));
}

function formatRate(rate) {
  const numericRate = Number(rate);

  return Number.isFinite(numericRate)
    ? numericRate.toLocaleString("en-NG", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })
    : "N/A";
}

function formatFee(fee) {
  if (fee === null || fee === undefined || fee === "") {
    return "fee unavailable";
  }

  const numericFee = Number(fee);
  return Number.isFinite(numericFee) ? `${numericFee.toFixed(2)} fee` : "fee unavailable";
}

function buildRatesContext(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return "No live exchange_rates rows were returned.";
  }

  return rows
    .map(
      (row, index) =>
        `${index + 1}. ${row.provider}: ${formatRate(row.rate)} NGN/${row.send_currency}; ${formatFee(row.fee)}; updated_at ${row.updated_at || "unknown"}`
    )
    .join("\n");
}

function buildTopRatesReply(currency, rows, explanation) {
  const topRates = rows
    .map(
      (row, index) =>
        `${index + 1}. ${row.provider}: ${formatRate(row.rate)} NGN/${currency} (${formatFee(row.fee)})`
    )
    .join("\n");

  return `Top 3 ${currency}/NGN rates now:\n${topRates}\n\nEva's take:\n${explanation}`;
}

function buildTopRatesFallbackExplanation(currency, rows) {
  const topProvider = rows[0];

  if (!topProvider) {
    return `I could not find live ${currency}/NGN rows right now. Please use the Compare Rates table and try Eva again shortly.`;
  }

  return `${topProvider.provider} is currently best because it has the highest live ${currency}/NGN rate at ${formatRate(topProvider.rate)}. Compare the fee before sending, because a lower fee can improve the final payout your recipient receives.`;
}

function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const error = new Error("Supabase public env vars are missing.");
    console.error("[Eva] Supabase config error", {
      hasAnonKey: Boolean(SUPABASE_ANON_KEY),
      hasUrl: Boolean(SUPABASE_URL)
    });
    throw error;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL.replace(/\/$/, ""), SUPABASE_ANON_KEY);
  }

  return supabaseClient;
}

async function fetchExchangeRates({ currency, limit = 3 } = {}) {
  const supabase = getSupabaseClient();
  console.log("[Eva] Fetching exchange_rates", {
    currency: currency || "all",
    query:
      ".from('exchange_rates').select('provider, rate, fee, send_currency').eq('send_currency', currency).eq('receive_currency', 'NGN').order('rate', { ascending: false }).limit(3)"
  });

  let query = supabase
    .from("exchange_rates")
    .select("provider, rate, fee, send_currency");

  if (currency) {
    query = query.eq("send_currency", currency);
  }

  query = query
    .eq("receive_currency", "NGN")
    .order("rate", { ascending: false })
    .limit(limit);

  const { data, error, status } = await query;

  console.log("[Eva] Supabase exchange_rates result", {
    currency: currency || "all",
    error,
    rows: data,
    status
  });

  if (error) {
    if (status === 401 || status === 403) {
      console.error(
        "[Eva] Supabase read was blocked. Check RLS policy on exchange_rates allows anon/public SELECT."
      );
    }

    console.error("[Eva] Exact Supabase error", {
      code: error.code,
      details: error.details,
      hint: error.hint,
      message: error.message,
      status
    });
    throw new Error(`Supabase exchange_rates fetch failed: ${error.message}`);
  }

  if (!data?.length) {
    console.warn(
      "[Eva] Supabase exchange_rates returned zero rows. Check that exchange_rates has matching data and that RLS allows anon/public SELECT."
    );
  }

  return Array.isArray(data) ? data : [];
}

async function fetchTopRatesForAllCurrencies() {
  const results = await Promise.all(
    SUPPORTED_CURRENCIES.map(async (currency) => ({
      currency,
      rows: await fetchExchangeRates({ currency, limit: 3 })
    }))
  );

  return results
    .map(
      ({ currency, rows }) =>
        `${currency}/NGN top providers:\n${buildRatesContext(rows)}`
    )
    .join("\n\n");
}

async function askGemini(prompt, { maxOutputTokens = 220 } = {}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${prompt}` }]
          }
        ],
        generationConfig: {
          maxOutputTokens,
          temperature: 0.35
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function supportResponse(res) {
  return res.status(200).json({
    cta: {
      href: "/contact",
      label: "Contact Us"
    },
    message: SUPPORT_MESSAGE,
    mode: "support"
  });
}

function responsePayload(message, extra = {}) {
  const payload = {
    message,
    ...extra
  };

  if (message.trim() === SUPPORT_MESSAGE) {
    payload.cta = {
      href: "/contact",
      label: "Contact Us"
    };
    payload.mode = "support";
  }

  return payload;
}

function fallbackReply(message) {
  if (isRateAlertRequest(message)) {
    return "To set a rate alert, open the Currency Trends section and choose Set Rate Alert, then enter your target NGN rate and email address.";
  }

  if (isSiteGuidanceRequest(message)) {
    return "Start at Compare Rates, choose USA, UK, or Canada, enter the amount you want to send, then select Compare Rates Now to see providers ranked by payout value.";
  }

  return SUPPORT_MESSAGE;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const userMessage = String(req.body?.message || "").trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!userMessage) {
    return res.status(400).json({ error: "A message is required." });
  }

  if (isHelpRequest(userMessage)) {
    return supportResponse(res);
  }

  if (hasOutOfScopeTopic(userMessage)) {
    return supportResponse(res);
  }

  try {
    if (isSiteGuidanceRequest(userMessage) || isRateAlertRequest(userMessage)) {
      return res.status(200).json({
        message: fallbackReply(userMessage),
        mode: "guide"
      });
    }

    const requestedCurrency = normalizeCurrency(detectCurrencyRequest(userMessage));

    if (requestedCurrency) {
      const topRows = await fetchExchangeRates({
        currency: requestedCurrency,
        limit: 3
      });
      let message = buildTopRatesFallbackExplanation(requestedCurrency, topRows);

      try {
        message = await askGemini(
          `The user clicked "Best ${requestedCurrency} rate now".
Here are the top 3 live rows from Supabase exchange_rates ordered by rate descending:
${buildRatesContext(topRows)}

Explain which provider is best and why in exactly 2 sentences. Mention the top provider, rate, and any useful fee context if available.`,
          { maxOutputTokens: 140 }
        );
      } catch (geminiError) {
        console.error("[Eva] Gemini explanation failed", geminiError);
      }

      return res.status(200).json({
        ...responsePayload(buildTopRatesReply(requestedCurrency, topRows, message), {
          mode: "gemini",
          rates: topRows
        })
      });
    }

    if (!isLikelyInScope(userMessage)) {
      return supportResponse(res);
    }

    const ratesContext = await fetchTopRatesForAllCurrencies();
    const conversationContext = history
      .slice(-6)
      .map((item) => `${item.role === "user" ? "User" : "Eva"}: ${item.text}`)
      .join("\n");
    const message = await askGemini(
      `Current top live rates from Supabase exchange_rates:
${ratesContext}

Recent conversation:
${conversationContext || "No previous conversation."}

User question:
${userMessage}

Answer using the live rate context where relevant. If the question is outside SaveRateAfrica, remittance, rates, fees, providers, or site support, respond exactly with the support message.`,
      { maxOutputTokens: 260 }
    );

    return res.status(200).json({
      ...responsePayload(message, {
        mode: "gemini"
      })
    });
  } catch (error) {
    console.error("[Eva] Request failed", error);

    if (!isLikelyInScope(userMessage)) {
      return supportResponse(res);
    }

    return res.status(200).json({
      message:
        "Eva is having trouble checking live rates right now. Please try again in a moment, or use the Compare Rates table for the latest provider rankings.",
      mode: "fallback"
    });
  }
}
