const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

function normalizeRateRow(row) {
  const currency =
    row?.currency ||
    row?.source_currency ||
    row?.from_currency ||
    row?.base_currency ||
    row?.corridor;
  const provider = row?.provider || row?.provider_name || row?.name || "Unknown provider";
  const rate = Number(row?.rate ?? row?.exchange_rate ?? row?.ngn_rate ?? row?.value);

  if (!currency || !Number.isFinite(rate) || rate <= 0 || rate > 3000) {
    return null;
  }

  const currencyText = String(currency).toUpperCase();
  const normalizedCurrency = currencyText.includes("GBP")
    ? "GBP"
    : currencyText.includes("CAD")
      ? "CAD"
      : currencyText.includes("USD")
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

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json({ message: fallbackReply(userMessage), mode: "fallback" });
  }

  try {
    const liveRates = await fetchSupabaseRates();
    const prompt = `${baseSystemPrompt}

${liveRates}

If live Supabase rates are unavailable, answer with general SaveRateAfrica guidance and avoid pretending to know live winners.

Conversation so far:
${history.map((item) => `${item.role === "user" ? "User" : "Eva"}: ${item.text}`).join("\n")}

User: ${userMessage}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.45,
            maxOutputTokens: 360
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      throw new Error("Gemini request failed.");
    }

    const data = await geminiResponse.json();
    const message = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return res.status(200).json({
      message: message || fallbackReply(userMessage),
      mode: message ? "gemini" : "fallback"
    });
  } catch {
    return res.status(200).json({ message: fallbackReply(userMessage), mode: "fallback" });
  }
}
