import { formatCurrency } from "@/lib/format";
import {
  buildComparisonFromLiveRates,
  type ComparisonProviderRow,
  type ComparisonResult
} from "@/lib/fetchRates";

export const SAVE_RATE_AI_SYSTEM_PROMPT = `You are SaveRateAI, the intelligent assistant for 
SaveRateAfrica.com — a real-time comparison platform 
helping Nigerians in the USA, UK, and Canada send 
money to Nigeria at the best rates.

You have access to the following live data from the 
page the user is currently viewing:

LIVE PROVIDER DATA (USD to NGN, updated every 5 min):
- Grey Finance:   rate 1,380.65 NGN/USD · No fee · Same day · 4.6★
- LemFi:          rate 1,378.58 NGN/USD · No fee · 3–5 min · 4.9★
- Sendwave:       rate 1,378.16 NGN/USD · No fee · Instant · 4.8★
- Chipper Cash:   rate 1,377.20 NGN/USD · No fee · Minutes · 4.4★
- Afriex:         rate 1,376.78 NGN/USD · No fee · Instant · 4.5★
- Nala:           rate 1,377.61 NGN/USD · $0.99 fee · Minutes · 4.8★
- TapTap Send:    rate 1,373.75 NGN/USD · No fee · Minutes · 4.7★
- WorldRemit:     rate 1,375.13 NGN/USD · No fee · Within 1hr · 4.5★
- Remitly:        rate 1,374.44 NGN/USD · $3.99 fee · Minutes · 4.7★
- Flutterwave:    rate 1,365.46 NGN/USD · $1.00 fee · Same day · 4.4★
- Paysend:        rate 1,362.70 NGN/USD · $1.99 fee · 1–2 days · 4.3★
- Wise:           rate 1,375.82 NGN/USD · from $6.90 fee · Same day · 4.8★
- MoneyGram:      rate 1,372.36 NGN/USD · $7.00 fee · Minutes · 4.1★
- Western Union:  rate 1,370.98 NGN/USD · $8.99 fee · Minutes · 4.2★

PLATFORM FACTS:
- Rates refresh every 5 minutes
- SaveRateAfrica compares but never processes transfers
- All providers are vetted and trusted
- Corridor: USA, UK, Canada → Nigeria only
- 99% currency rate accuracy verified daily
- 256-bit secure, no sign-up needed to compare

YOUR BEHAVIOUR RULES:

1. ALWAYS answer using the live provider data above.
   Calculate exact NGN payout when user gives 
   a send amount:
   payout = (sendAmount - fee) × rate

2. For speed questions: 
   Instant = Sendwave, Afriex
   Minutes = LemFi, Chipper Cash, Nala, 
             TapTap Send, Remitly, MoneyGram, 
             Western Union
   Within 1 hour = WorldRemit
   Same day = Grey Finance, Wise, Flutterwave

3. For emergency/urgent questions:
   Recommend Sendwave or Afriex (instant, no fee)
   Show exact payout calculation

4. For cheapest questions:
   Rank by: payout = (amount - fee) × rate
   Show top 3 with exact NGN amounts

5. For best rate questions:
   Recommend Grey Finance first, explain why

6. Always be specific. Show numbers. 
   Never give vague answers.

7. Keep responses under 120 words.
   Use short paragraphs, not bullet walls.

8. If the question is completely outside 
   SaveRateAfrica's scope (travel advice, medical, 
   legal, personal finance beyond remittance, etc.):
   
   Respond exactly like this:
   "That's outside what I can help with on 
   SaveRateAfrica. For that question, I'd recommend 
   asking Google Gemini directly: 
   https://gemini.google.com
   
   I'm best at helping you compare NGN rates, 
   find the fastest provider, or calculate your 
   exact payout. Want me to help with that instead?"

9. Never make up providers or rates.
   Never claim to process or send money.
   Never give financial or legal advice.`;

export const SAVE_RATE_AI_OUT_OF_SCOPE_RESPONSE = `That's outside what I can help with on 
SaveRateAfrica. For that question, I'd recommend 
asking Google Gemini directly: 
https://gemini.google.com

I'm best at helping you compare NGN rates, 
find the fastest provider, or calculate your 
exact payout. Want me to help with that instead?`;

interface AssistantIntent {
  amount: number;
  detectedAmount: boolean;
  isBestRate: boolean;
  isCheapest: boolean;
  isComparisonQuestion: boolean;
  isOutOfScope: boolean;
  isProviderQuestion: boolean;
  isRankingQuestion: boolean;
  isSpeedQuestion: boolean;
  isUnsupportedCurrency: boolean;
  isUrgent: boolean;
  mentionedProviderName?: string;
  mentionedProviderNames: string[];
}

const PROVIDER_ORDER = [
  "Grey Finance",
  "LemFi",
  "Sendwave",
  "Chipper Cash",
  "Afriex",
  "Nala",
  "TapTap Send",
  "WorldRemit",
  "Remitly",
  "Flutterwave",
  "Paysend",
  "Wise",
  "MoneyGram",
  "Western Union"
] as const;

const PROVIDER_ALIASES: Record<string, string[]> = {
  Afriex: ["afriex"],
  "Chipper Cash": ["chipper cash", "chipper"],
  Flutterwave: ["flutterwave send", "flutterwave"],
  "Grey Finance": ["grey finance"],
  LemFi: ["lemfi"],
  MoneyGram: ["moneygram"],
  Nala: ["nala"],
  Paysend: ["paysend"],
  Remitly: ["remitly"],
  Sendwave: ["sendwave"],
  "TapTap Send": ["taptap send", "tap tap send"],
  "Western Union": ["western union"],
  Wise: ["wise"],
  WorldRemit: ["worldremit", "world remit"]
};

const IN_SCOPE_PATTERN =
  /\b(send|sending|transfer|provider|rate|fee|fees|cost|fastest|quickest|speed|urgent|emergency|immediately|right now|asap|cheapest|best deal|save money|most ngn|best rate|payout|receive|recipient|delivery|deliver|land|compare|naira|ngn|usd|dollars?)\b/i;
const URGENT_PATTERN =
  /\b(urgent|emergency|immediately|right now|asap|fastest|quickest)\b/i;
const CHEAPEST_PATTERN =
  /\b(cheapest|lowest fee|best deal|save money|most ngn)\b/i;
const BEST_RATE_PATTERN = /\b(best rate|highest rate|top rate)\b/i;
const COMPARISON_PATTERN =
  /\b(vs|versus|or|between|compare|better|difference between|which is better|should i use)\b/i;
const RANKING_PATTERN =
  /\b(rank these providers|rank|which of these is best|which is best)\b/i;
const SPEED_PATTERN =
  /\b(fastest|quickest|speed|instant|minutes|same day|within 1 hour|urgent|emergency)\b/i;
const UNSUPPORTED_CURRENCY_PATTERN =
  /\b(eur|€|aud|nzd|jpy|yen|inr|rupee|kes|ghs|zar|xof|xaf|btc|usdt)\b/i;

function formatExactNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency"
  }).format(amount);
}

function formatRateValue(rate: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(rate);
}

function getTransferFeeLabel(
  provider: ComparisonProviderRow,
  comparison: ComparisonResult
) {
  if (provider.fee === 0) {
    return "No fee";
  }

  if (provider.feeDisplayText.toLowerCase().startsWith("from ")) {
    return `${provider.feeDisplayText} fee`;
  }

  return `${formatCurrency(provider.fee, comparison.sourceCurrency)} fee`;
}

function getFormattedAmount(comparison: ComparisonResult, amount: number) {
  return formatCurrency(amount, comparison.sourceCurrency, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });
}

function getNormalizedProviderName(name: string) {
  return name === "Flutterwave Send" ? "Flutterwave" : name;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getMentionedProviderName(message: string) {
  return getMentionedProviderNames(message)[0];
}

function getMentionedProviderNames(message: string) {
  const normalizedMessage = message.toLowerCase();
  const matches = PROVIDER_ORDER.map((providerName) => {
    const aliases = PROVIDER_ALIASES[providerName] ?? [];
    const aliasIndexes = aliases
      .map((alias) => {
        const match = new RegExp(`\\b${escapeRegex(alias)}\\b`, "i").exec(
          normalizedMessage
        );

        return match?.index ?? -1;
      })
      .filter((index) => index >= 0);

    if (aliasIndexes.length === 0) {
      return null;
    }

    return {
      index: Math.min(...aliasIndexes),
      providerName
    };
  }).filter(Boolean) as Array<{ index: number; providerName: string }>;

  return matches
    .sort((first, second) => first.index - second.index)
    .map((match) => match.providerName);
}

function getComparisonFeeValue(
  provider: ComparisonProviderRow,
  comparison: ComparisonResult
) {
  return provider.fee === 0
    ? formatCurrency(0, comparison.sourceCurrency, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : provider.feeDisplayText.toLowerCase().startsWith("from ")
      ? provider.feeDisplayText.toLowerCase()
      : formatCurrency(provider.fee, comparison.sourceCurrency, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
}

function getComparisonSpeedLabel(deliveryLabel: string) {
  if (deliveryLabel === "3-5 min") {
    return "3–5 minutes";
  }

  if (deliveryLabel === "Minutes") {
    return "Minutes";
  }

  if (deliveryLabel === "1-2 business days") {
    return "1–2 days";
  }

  return deliveryLabel;
}

function getWinnerCategories(
  winner: ComparisonProviderRow,
  loser: ComparisonProviderRow
) {
  const categories: string[] = [];

  if (winner.exchangeRate > loser.exchangeRate) {
    categories.push("rate");
  }

  if (winner.fee < loser.fee) {
    categories.push("fees");
  }

  if (winner.speedHours < loser.speedHours) {
    categories.push("speed");
  }

  if (winner.amountReceived > loser.amountReceived) {
    categories.push("payout");
  }

  return categories;
}

function formatCategoryList(categories: string[]) {
  if (categories.length <= 1) {
    return categories[0] ?? "payout";
  }

  if (categories.length === 2) {
    return `${categories[0]} and ${categories[1]}`;
  }

  return `${categories.slice(0, -1).join(", ")}, and ${categories.at(-1)}`;
}

function getRequestedAmount(message: string, fallbackAmount: number) {
  const matches = [
    message.match(/\$\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i),
    message.match(/\b([0-9][0-9,]*(?:\.[0-9]+)?)\s*dollars?\b/i),
    message.match(/\b([0-9][0-9,]*(?:\.[0-9]+)?)\s*usd\b/i),
    message.match(/\busd\s*([0-9][0-9,]*(?:\.[0-9]+)?)/i)
  ];

  const match = matches.find(Boolean);

  if (!match) {
    return {
      amount: fallbackAmount,
      detectedAmount: false
    };
  }

  const parsedValue = Number.parseFloat(match[1].replace(/,/g, ""));

  return {
    amount:
      Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallbackAmount,
    detectedAmount: Number.isFinite(parsedValue) && parsedValue > 0
  };
}

function buildComparisonForAmount(
  comparison: ComparisonResult,
  amount: number
): ComparisonResult {
  if (comparison.amount === amount) {
    return comparison;
  }

  return buildComparisonFromLiveRates({
    amount,
    liveBaseRates: {
      cachedUntil: comparison.cachedUntil,
      provider: comparison.rateProvider,
      rates: comparison.liveBaseRates,
      sourceUpdatedAt: comparison.sourceUpdatedAt,
      updatedAt: comparison.updatedAt
    },
    senderCountry: comparison.senderCountry,
    sortBy: "best-rate"
  });
}

function findProvider(
  comparison: ComparisonResult,
  providerName?: string
) {
  if (!providerName) {
    return undefined;
  }

  return comparison.providers.find(
    (provider) => getNormalizedProviderName(provider.name) === providerName
  );
}

function buildLiveProviderDataBlock(comparison: ComparisonResult) {
  const providersByName = new Map(
    comparison.providers.map((provider) => [
      getNormalizedProviderName(provider.name),
      provider
    ])
  );

  return PROVIDER_ORDER.map((providerName) => {
    const provider = providersByName.get(providerName);

    if (!provider) {
      return null;
    }

    return `- ${providerName}: rate ${formatRateValue(provider.exchangeRate)} NGN/${comparison.sourceCurrency} · ${getTransferFeeLabel(provider, comparison)} · ${provider.deliveryLabel} · ${provider.rating.toFixed(1)}★`;
  })
    .filter(Boolean)
    .join("\n");
}

export function detectAssistantIntent(
  message: string,
  comparison: ComparisonResult
): AssistantIntent {
  const { amount, detectedAmount } = getRequestedAmount(
    message,
    comparison.amount
  );
  const mentionedProviderNames = getMentionedProviderNames(message);
  const mentionedProviderName =
    mentionedProviderNames.length === 1 ? mentionedProviderNames[0] : undefined;
  const hasInScopeKeyword =
    IN_SCOPE_PATTERN.test(message) || mentionedProviderNames.length > 0;
  const isComparisonQuestion =
    mentionedProviderNames.length === 2 && COMPARISON_PATTERN.test(message);
  const isRankingQuestion =
    mentionedProviderNames.length >= 3 ||
    (RANKING_PATTERN.test(message) && mentionedProviderNames.length > 2);

  return {
    amount,
    detectedAmount,
    isBestRate: BEST_RATE_PATTERN.test(message),
    isCheapest: CHEAPEST_PATTERN.test(message),
    isComparisonQuestion,
    isOutOfScope: !hasInScopeKeyword,
    isProviderQuestion: Boolean(mentionedProviderName) && !isComparisonQuestion,
    isRankingQuestion,
    isSpeedQuestion: SPEED_PATTERN.test(message),
    isUnsupportedCurrency: UNSUPPORTED_CURRENCY_PATTERN.test(message),
    isUrgent: URGENT_PATTERN.test(message),
    mentionedProviderName,
    mentionedProviderNames
  };
}

function buildComparisonReply(
  comparison: ComparisonResult,
  amount: number,
  providerNames: string[]
) {
  const activeComparison = buildComparisonForAmount(comparison, amount);
  const [providerAName, providerBName] = providerNames;
  const providerA = findProvider(activeComparison, providerAName);
  const providerB = findProvider(activeComparison, providerBName);

  if (!providerA || !providerB) {
    return buildGeneralAssistantReply(
      comparison,
      detectAssistantIntent(`${providerAName} vs ${providerBName}`, comparison)
    );
  }

  const winner =
    providerA.amountReceived >= providerB.amountReceived ? providerA : providerB;
  const loser = winner === providerA ? providerB : providerA;
  const difference = Math.abs(providerA.amountReceived - providerB.amountReceived);
  const winnerCategories = getWinnerCategories(winner, loser);
  const formattedAmount = getFormattedAmount(activeComparison, amount);
  let reason = `${getNormalizedProviderName(winner.name)} wins on ${formatCategoryList(winnerCategories)}.`;

  if (getNormalizedProviderName(loser.name) === "Wise") {
    reason = `${getNormalizedProviderName(winner.name)} wins on ${formatCategoryList(winnerCategories)}. Wise is better if you prefer a detailed fee breakdown and mid-market rate transparency.`;
  } else if (
    winner.speedHours < loser.speedHours &&
    winner.fee <= loser.fee &&
    winner.amountReceived > loser.amountReceived
  ) {
    reason = `For ${formattedAmount}, ${getNormalizedProviderName(winner.name)} is the clear choice: ${winner.fee === 0 ? "no fee" : "lower fee"}, ${getComparisonSpeedLabel(winner.deliveryLabel).toLowerCase()} delivery, better payout.`;
  } else if (loser.payoutChannels.includes("Cash pickup")) {
    reason = `${getNormalizedProviderName(loser.name)} only wins if your recipient needs cash pickup — for bank deposit, ${getNormalizedProviderName(winner.name)} is significantly better.`;
  }

  return `Comparing ${providerAName} vs ${providerBName} on a ${formattedAmount} send to Nigeria:

${providerAName}
  Rate:    ${formatRateValue(providerA.exchangeRate)} NGN/${activeComparison.sourceCurrency}
  Fee:     ${getComparisonFeeValue(providerA, activeComparison)}
  Speed:   ${getComparisonSpeedLabel(providerA.deliveryLabel)}
  You get: ${formatExactNaira(providerA.amountReceived)}

${providerBName}
  Rate:    ${formatRateValue(providerB.exchangeRate)} NGN/${activeComparison.sourceCurrency}
  Fee:     ${getComparisonFeeValue(providerB, activeComparison)}
  Speed:   ${getComparisonSpeedLabel(providerB.deliveryLabel)}
  You get: ${formatExactNaira(providerB.amountReceived)}

Winner: ${getNormalizedProviderName(winner.name)} gives your recipient ${formatExactNaira(difference)} more after fees.

${reason}`;
}

function buildRankingReply(
  comparison: ComparisonResult,
  amount: number,
  providerNames: string[]
) {
  const activeComparison = buildComparisonForAmount(comparison, amount);
  const rankedProviders = providerNames
    .map((providerName) => findProvider(activeComparison, providerName))
    .filter(
      (provider): provider is ComparisonProviderRow => provider !== undefined
    )
    .sort((first, second) => second.amountReceived - first.amountReceived);

  if (rankedProviders.length < 2) {
    return buildGeneralAssistantReply(
      comparison,
      detectAssistantIntent(providerNames.join(", "), comparison)
    );
  }

  const formattedAmount = getFormattedAmount(activeComparison, amount);
  const rankingLines = rankedProviders
    .map(
      (provider, index) =>
        `${index + 1}. ${getNormalizedProviderName(provider.name)} — ${formatExactNaira(
          provider.amountReceived
        )} · ${getComparisonSpeedLabel(provider.deliveryLabel)} · ${
          provider.fee === 0
            ? "No fee"
            : getComparisonFeeValue(provider, activeComparison)
        }`
    )
    .join("\n");
  const topDifference =
    rankedProviders[0].amountReceived - rankedProviders[1].amountReceived;

  return `Ranking for a ${formattedAmount} send:

${rankingLines}

${getNormalizedProviderName(rankedProviders[0].name)} wins by ${formatExactNaira(topDifference)} over ${getNormalizedProviderName(rankedProviders[1].name)}.`;
}

function buildBestRateReply(comparison: ComparisonResult, amount: number) {
  const activeComparison = buildComparisonForAmount(comparison, amount);
  const bestRateProvider =
    findProvider(activeComparison, "Grey Finance") ?? activeComparison.providers[0];
  const westernUnion = findProvider(activeComparison, "Western Union");
  const formattedAmount = getFormattedAmount(activeComparison, amount);

  if (!westernUnion) {
    return `Best rate today is ${getNormalizedProviderName(bestRateProvider.name)} at ${formatRateValue(bestRateProvider.exchangeRate)} NGN/${activeComparison.sourceCurrency} with ${getTransferFeeLabel(bestRateProvider, activeComparison).toLowerCase()} and ${bestRateProvider.deliveryLabel.toLowerCase()} delivery. On a ${formattedAmount} send your recipient gets ${formatExactNaira(bestRateProvider.amountReceived)}.`;
  }

  return `Best rate today is ${getNormalizedProviderName(bestRateProvider.name)} at ${formatRateValue(bestRateProvider.exchangeRate)} NGN/${activeComparison.sourceCurrency} with ${getTransferFeeLabel(bestRateProvider, activeComparison).toLowerCase()} and ${bestRateProvider.deliveryLabel.toLowerCase()} delivery. On a ${formattedAmount} send your recipient gets ${formatExactNaira(bestRateProvider.amountReceived)}.\n\nThat's ${formatExactNaira(bestRateProvider.amountReceived - westernUnion.amountReceived)} more than Western Union on the same transfer.`;
}

function buildCheapestReply(comparison: ComparisonResult, amount: number) {
  const activeComparison = buildComparisonForAmount(comparison, amount);
  const [first, second, third] = [...activeComparison.providers].sort(
    (a, b) => b.amountReceived - a.amountReceived
  );
  const formattedAmount = getFormattedAmount(activeComparison, amount);

  return `Top payout on a ${formattedAmount} send today is ${getNormalizedProviderName(first.name)} at ${formatExactNaira(first.amountReceived)} with ${getTransferFeeLabel(first, activeComparison).toLowerCase()}.\n\nNext is ${getNormalizedProviderName(second.name)} at ${formatExactNaira(second.amountReceived)}, then ${getNormalizedProviderName(third.name)} at ${formatExactNaira(third.amountReceived)}. Those are the top 3 routes after fees right now.`;
}

function buildUrgentReply(comparison: ComparisonResult, amount: number) {
  const activeComparison = buildComparisonForAmount(comparison, amount);
  const sendwave = findProvider(activeComparison, "Sendwave");
  const afriex = findProvider(activeComparison, "Afriex");
  const fastestMinutes = [...activeComparison.providers]
    .filter((provider) => provider.speedHours > 0.02)
    .sort((a, b) => a.speedHours - b.speedHours || b.amountReceived - a.amountReceived)[0];
  const formattedAmount = getFormattedAmount(activeComparison, amount);

  if (!sendwave || !afriex) {
    const fallbackProvider = [...activeComparison.providers].sort(
      (a, b) => a.speedHours - b.speedHours || b.amountReceived - a.amountReceived
    )[0];

    return `For an urgent ${formattedAmount} send, ${getNormalizedProviderName(fallbackProvider.name)} is the fastest live option at ${fallbackProvider.deliveryLabel.toLowerCase()} with ${getTransferFeeLabel(fallbackProvider, activeComparison).toLowerCase()}. Your recipient gets ${formatExactNaira(fallbackProvider.amountReceived)}.`;
  }

  const fastestMinutesText = fastestMinutes
    ? ` If minutes are okay, ${getNormalizedProviderName(fastestMinutes.name)} gives ${formatExactNaira(fastestMinutes.amountReceived)} in ${fastestMinutes.deliveryLabel.toLowerCase()}.`
    : "";

  return `For an urgent ${formattedAmount} send, start with Sendwave: Instant, no fee, ${formatExactNaira(sendwave.amountReceived)}.\n\nAfriex is also instant with no fee at ${formatExactNaira(afriex.amountReceived)}.${fastestMinutesText}\n\nFastest total cost today is Sendwave because the transfer fee is $0.`;
}

function buildProviderReply(
  comparison: ComparisonResult,
  amount: number,
  providerName: string
) {
  const activeComparison = buildComparisonForAmount(comparison, amount);
  const provider = findProvider(activeComparison, providerName);

  if (!provider) {
    return buildGeneralAssistantReply(
      comparison,
      detectAssistantIntent(providerName, comparison)
    );
  }

  const formattedAmount = getFormattedAmount(activeComparison, amount);

  return `${providerName} is at ${formatRateValue(provider.exchangeRate)} NGN/${activeComparison.sourceCurrency}, ${getTransferFeeLabel(provider, activeComparison).toLowerCase()}, ${provider.deliveryLabel}, and ${provider.rating.toFixed(1)}★. On a ${formattedAmount} send, your recipient gets ${formatExactNaira(provider.amountReceived)}.`;
}

function buildUnsupportedCurrencyReply() {
  return "SaveRateAfrica only compares live routes from the USA, UK, and Canada into NGN right now, so I can’t verify EUR or other non-supported corridors here. Ask me about NGN rates, fees, payout, or the fastest provider instead.";
}

function buildGeneralAssistantReply(
  comparison: ComparisonResult,
  intent: AssistantIntent
) {
  const activeComparison = buildComparisonForAmount(comparison, intent.amount);
  const bestProvider = [...activeComparison.providers].sort(
    (a, b) => b.amountReceived - a.amountReceived
  )[0];
  const fastestProvider = [...activeComparison.providers].sort(
    (a, b) => a.speedHours - b.speedHours || b.amountReceived - a.amountReceived
  )[0];
  const formattedAmount = getFormattedAmount(activeComparison, intent.amount);

  return `Right now ${getNormalizedProviderName(bestProvider.name)} gives the strongest payout at ${formatExactNaira(bestProvider.amountReceived)} on a ${formattedAmount} send. If speed matters more, ${getNormalizedProviderName(fastestProvider.name)} is the fastest option at ${fastestProvider.deliveryLabel.toLowerCase()} and delivers ${formatExactNaira(fastestProvider.amountReceived)}.`;
}

export function shouldReplyDeterministically(intent: AssistantIntent) {
  return (
    intent.detectedAmount ||
    intent.isBestRate ||
    intent.isCheapest ||
    intent.isComparisonQuestion ||
    intent.isOutOfScope ||
    intent.isProviderQuestion ||
    intent.isRankingQuestion ||
    intent.isSpeedQuestion ||
    intent.isUnsupportedCurrency ||
    intent.isUrgent
  );
}

export function buildAssistantPromptContext(
  comparison: ComparisonResult,
  message: string,
  intent = detectAssistantIntent(message, comparison)
) {
  const activeComparison = buildComparisonForAmount(comparison, intent.amount);
  const contextBlocks = [
    `Current page provider data (${activeComparison.sourceCurrency} to NGN, updated from the live comparison table):`,
    buildLiveProviderDataBlock(activeComparison)
  ];

  if (intent.detectedAmount) {
    contextBlocks.push(
      `User wants to send $${intent.amount.toLocaleString("en-US")}.\nCalculate exact payouts for all providers using: payout = (amount - fee) × rate.\nShow top 3 results with exact ₦ amounts.`
    );
  }

  if (intent.isUrgent) {
    contextBlocks.push(
      "User needs URGENT transfer.\nPrioritize instant and minutes providers only.\nLead with Sendwave and Afriex."
    );
  }

  if (intent.isCheapest) {
    contextBlocks.push(
      "User wants maximum NGN payout.\nRank all providers by net payout after fees.\nShow top 3."
    );
  }

  if (intent.isComparisonQuestion) {
    contextBlocks.push(
      `User wants a head-to-head comparison between ${intent.mentionedProviderNames.join(" and ")}.\nCompare rate, fee, speed, and payout for ${getFormattedAmount(activeComparison, intent.amount)} and clearly name the winner.`
    );
  }

  if (intent.isRankingQuestion) {
    contextBlocks.push(
      `User wants these providers ranked: ${intent.mentionedProviderNames.join(", ")}.\nSort them by net payout after fees for ${getFormattedAmount(activeComparison, intent.amount)}.`
    );
  }

  if (intent.mentionedProviderName) {
    contextBlocks.push(
      intent.detectedAmount
        ? `User is asking about ${intent.mentionedProviderName}.\nGive specific rate, fee, speed, and payout for $${intent.amount.toLocaleString("en-US")} with that provider.`
        : `User is asking about ${intent.mentionedProviderName}.\nGive specific rate, fee, speed, and payout with that provider.`
    );
  }

  contextBlocks.push(`User question: ${message}`);

  return contextBlocks.join("\n\n");
}

export function buildSmartAssistantReply(
  message: string,
  comparison: ComparisonResult
) {
  const intent = detectAssistantIntent(message, comparison);

  if (intent.isOutOfScope) {
    return SAVE_RATE_AI_OUT_OF_SCOPE_RESPONSE;
  }

  if (intent.isUnsupportedCurrency) {
    return buildUnsupportedCurrencyReply();
  }

  if (intent.isRankingQuestion) {
    return buildRankingReply(comparison, intent.amount, intent.mentionedProviderNames);
  }

  if (intent.isComparisonQuestion) {
    return buildComparisonReply(
      comparison,
      intent.amount,
      intent.mentionedProviderNames
    );
  }

  if (intent.isProviderQuestion && intent.mentionedProviderName) {
    return buildProviderReply(comparison, intent.amount, intent.mentionedProviderName);
  }

  if (intent.isUrgent || intent.isSpeedQuestion) {
    return buildUrgentReply(comparison, intent.amount);
  }

  if (intent.isCheapest) {
    return buildCheapestReply(comparison, intent.amount);
  }

  if (intent.isBestRate) {
    return buildBestRateReply(comparison, intent.amount);
  }

  if (intent.detectedAmount) {
    return buildCheapestReply(comparison, intent.amount);
  }

  return buildGeneralAssistantReply(comparison, intent);
}
