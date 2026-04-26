export type SenderCountry = "USA" | "UK" | "Canada";
export type SourceCurrency = "USD" | "GBP" | "CAD";
export type ComparisonSort = "best-rate" | "lowest-fee" | "fastest";
export type SpeedBand = "instant" | "same-day" | "standard";
export type FeeBand = "low" | "medium" | "premium";
export type FeeType = "flat" | "percentage";

export interface SenderCountryOption {
  code: SenderCountry;
  label: string;
  currency: SourceCurrency;
  region: string;
  dialCode: string;
}

export interface Provider {
  slug: string;
  name: string;
  logoFrom: string;
  logoTo: string;
  rating: number;
  reviewCount: number;
  speedHours: number;
  speedBand: SpeedBand;
  deliveryLabel: string;
  feeBand: FeeBand;
  feeType?: FeeType;
  fees: Record<SourceCurrency, number>;
  fixedFees?: Partial<Record<SourceCurrency, number>>;
  variableFeePercents?: Partial<Record<SourceCurrency, number>>;
  feeDisplayPrefix?: string;
  transferFeeNote?: string;
  rateMultiplier: Record<SourceCurrency, number>;
  summary: string;
  headline: string;
  bestFor: string;
  trustNote: string;
  supportedSenderCountries: SenderCountry[];
  payoutChannels: string[];
  pros: string[];
  cons: string[];
}

export const senderCountries: SenderCountryOption[] = [
  {
    code: "USA",
    label: "USA",
    currency: "USD",
    region: "United States",
    dialCode: "+1"
  },
  {
    code: "UK",
    label: "UK",
    currency: "GBP",
    region: "United Kingdom",
    dialCode: "+44"
  },
  {
    code: "Canada",
    label: "Canada",
    currency: "CAD",
    region: "Canada",
    dialCode: "+1"
  }
];

export const baseMidMarketRates: Record<SourceCurrency, number> = {
  USD: 1564.2,
  GBP: 1983.7,
  CAD: 1149.6
};

export const providers: Provider[] = [
  {
    slug: "wise",
    name: "Wise",
    logoFrom: "#00C853",
    logoTo: "#17B6B2",
    rating: 4.8,
    reviewCount: 14820,
    speedHours: 6,
    speedBand: "same-day",
    deliveryLabel: "Same day",
    feeBand: "medium",
    feeType: "percentage",
    fees: { USD: 0.55, GBP: 0.45, CAD: 0.65 },
    fixedFees: { USD: 0.55, GBP: 0.45, CAD: 0.65 },
    variableFeePercents: { USD: 1.27, GBP: 1.22, CAD: 1.24 },
    feeDisplayPrefix: "From",
    rateMultiplier: { USD: 0.9965, GBP: 0.9965, CAD: 0.9965 },
    summary: "Massive trust + low fees",
    headline: "Massive trust + low fees",
    bestFor: "Massive trust + low fees",
    trustNote: "Massive trust + low fees",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Clear fee split", "Strong app", "Great for repeat transfers"],
    cons: ["Delivery timing varies by route", "Funding method details vary"]
  },
  {
    slug: "remitly",
    name: "Remitly",
    logoFrom: "#FFD600",
    logoTo: "#FF8F00",
    rating: 4.7,
    reviewCount: 20411,
    speedHours: 0.2,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "low",
    fees: { USD: 3.99, GBP: 3.99, CAD: 3.99 },
    rateMultiplier: { USD: 0.9955, GBP: 0.9955, CAD: 0.9955 },
    summary: "Big brand + urgent send",
    headline: "Big brand + urgent send",
    bestFor: "Big brand + urgent send",
    trustNote: "Big brand + urgent send",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Cash pickup", "Mobile money"],
    pros: ["Fast", "Easy onboarding", "Broad payout network"],
    cons: ["Promo timing varies", "Payout method details vary"]
  },
  {
    slug: "worldremit",
    name: "WorldRemit",
    logoFrom: "#00BCD4",
    logoTo: "#006064",
    rating: 4.5,
    reviewCount: 11890,
    speedHours: 1,
    speedBand: "instant",
    deliveryLabel: "Within 1 hour",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 0.996, GBP: 0.996, CAD: 0.996 },
    summary: "Pickup + airtime use cases",
    headline: "Pickup + airtime use cases",
    bestFor: "Pickup + airtime use cases",
    trustNote: "Pickup + airtime use cases",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Cash pickup", "Airtime top-up"],
    pros: ["Wide reach", "Fast payout", "Trusted brand"],
    cons: ["Route pricing varies", "Fee details vary by route"]
  },
  {
    slug: "sendwave",
    name: "Sendwave",
    logoFrom: "#00C853",
    logoTo: "#76FF03",
    rating: 4.8,
    reviewCount: 16754,
    speedHours: 0.02,
    speedBand: "instant",
    deliveryLabel: "Instant",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 0.9982, GBP: 0.9982, CAD: 0.9982 },
    summary: "Zero-fee positioning with very quick delivery for mobile-first customers.",
    headline: "Fee-free speed.",
    bestFor: "Quick sends with simple mobile UX",
    trustNote: "Strong reputation among diaspora mobile users.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["No transfer fee", "Very fast", "Simple interface"],
    cons: ["Rate spread varies", "App controls vary by route"]
  },
  {
    slug: "western-union",
    name: "Western Union",
    logoFrom: "#111111",
    logoTo: "#FFD600",
    rating: 4.2,
    reviewCount: 28911,
    speedHours: 0.5,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "premium",
    fees: { USD: 8.99, GBP: 8.99, CAD: 8.99 },
    transferFeeNote:
      "Rate includes exchange rate margin. Final rate confirmed at checkout.",
    rateMultiplier: { USD: 0.993, GBP: 0.993, CAD: 0.993 },
    summary: "Legacy trust",
    headline: "Legacy trust",
    bestFor: "Legacy trust",
    trustNote: "Legacy trust",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Cash pickup", "Bank deposit"],
    pros: ["Pickup network", "Fast", "Recognizable brand"],
    cons: ["Fee level varies by route", "Payout details vary by route"]
  },
  {
    slug: "moneygram",
    name: "MoneyGram",
    logoFrom: "#E53935",
    logoTo: "#8E0000",
    rating: 4.1,
    reviewCount: 18224,
    speedHours: 0.6,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "premium",
    fees: { USD: 7, GBP: 7, CAD: 7 },
    rateMultiplier: { USD: 0.994, GBP: 0.994, CAD: 0.994 },
    summary: "Emergency cash needs",
    headline: "Emergency cash needs",
    bestFor: "Emergency cash needs",
    trustNote: "Emergency cash needs",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Cash pickup", "Bank deposit"],
    pros: ["Fast pickup", "Large brand", "Easy walk-in options"],
    cons: ["Fee level varies by route", "Rate details vary by route"]
  },
  {
    slug: "pangea",
    name: "Pangea",
    logoFrom: "#6A1B9A",
    logoTo: "#EC407A",
    rating: 4.3,
    reviewCount: 5114,
    speedHours: 0.4,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "low",
    fees: { USD: 4.49, GBP: 4.49, CAD: 4.49 },
    rateMultiplier: { USD: 0.9968, GBP: 0.9968, CAD: 0.9968 },
    summary: "Good app-first option with simple onboarding for North American senders.",
    headline: "Simple North America onboarding.",
    bestFor: "Diaspora users who want a quick setup",
    trustNote: "Solid mobile-led experience for repeat transfers.",
    supportedSenderCountries: ["Canada"],
    payoutChannels: ["Bank deposit", "Cash pickup"],
    pros: ["Smooth UX", "Fast setup", "Reliable delivery"],
    cons: ["Geographic coverage varies", "Rate details vary by route"]
  },
  {
    slug: "chipper-cash",
    name: "Chipper Cash",
    logoFrom: "#1DE9B6",
    logoTo: "#00B8D4",
    rating: 4.4,
    reviewCount: 9010,
    speedHours: 0.3,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 0.9975, GBP: 0.9975, CAD: 0.9975 },
    summary: "Younger app users",
    headline: "Younger app users",
    bestFor: "Younger app users",
    trustNote: "Younger app users",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Wallet transfer"],
    pros: ["Low fee", "Fast", "Modern app feel"],
    cons: ["Support options vary by market", "Brand familiarity varies by sender"]
  },
  {
    slug: "lemfi",
    name: "LemFi",
    logoFrom: "#00C853",
    logoTo: "#0A1628",
    rating: 4.9,
    reviewCount: 13106,
    speedHours: 0.08,
    speedBand: "instant",
    deliveryLabel: "3-5 min",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 0.9985, GBP: 0.9985, CAD: 0.9985 },
    summary: "Strong Nigeria trust + deposits",
    headline: "Strong Nigeria trust + deposits",
    bestFor: "Strong Nigeria trust + deposits",
    trustNote: "Strong Nigeria trust + deposits",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Wallet transfer"],
    pros: ["Excellent payout value", "Zero fee", "Very fast"],
    cons: ["Digital-first experience", "Cash pickup options vary"]
  },
  {
    slug: "grey-finance",
    name: "Grey Finance",
    logoFrom: "#3949AB",
    logoTo: "#0A1628",
    rating: 4.6,
    reviewCount: 7721,
    speedHours: 8,
    speedBand: "same-day",
    deliveryLabel: "Same day",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 1.0, GBP: 0.999, CAD: 0.999 },
    summary: "High modern appeal + diaspora relevance",
    headline: "High modern appeal + diaspora relevance",
    bestFor: "High modern appeal + diaspora relevance",
    trustNote: "High modern appeal + diaspora relevance",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["No Fee ✅", "Great for freelancers", "Strong multicurrency positioning"],
    cons: ["Brand familiarity varies by sender", "Delivery timing varies"]
  },
  {
    slug: "afriex",
    name: "Afriex",
    logoFrom: "#FF5722",
    logoTo: "#FF9800",
    rating: 4.5,
    reviewCount: 6433,
    speedHours: 0.01,
    speedBand: "instant",
    deliveryLabel: "Instant",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 0.9972, GBP: 0.9972, CAD: 0.9972 },
    summary: "Corridor-specific appeal",
    headline: "Corridor-specific appeal",
    bestFor: "Corridor-specific appeal",
    trustNote: "Corridor-specific appeal",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Wallet transfer"],
    pros: ["Competitive rates", "Low fee", "Fast app flow"],
    cons: ["Brand familiarity varies by sender", "Support options vary"]
  },
  {
    slug: "flutterwave-send",
    name: "Flutterwave Send",
    logoFrom: "#FB8C00",
    logoTo: "#5D4037",
    rating: 4.4,
    reviewCount: 5860,
    speedHours: 6,
    speedBand: "same-day",
    deliveryLabel: "Same day",
    feeBand: "low",
    fees: { USD: 1, GBP: 1, CAD: 1 },
    rateMultiplier: { USD: 0.989, GBP: 0.989, CAD: 0.988 },
    summary: "African fintech familiarity",
    headline: "African fintech familiarity",
    bestFor: "African fintech familiarity",
    trustNote: "African fintech familiarity",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Recognizable brand", "Good app flows", "Same-day delivery"],
    cons: ["Payout details vary by route", "Payout options vary"]
  },
  {
    slug: "nala",
    name: "Nala",
    logoFrom: "#6D4C41",
    logoTo: "#FF7043",
    rating: 4.8,
    reviewCount: 8344,
    speedHours: 0.12,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "low",
    fees: { USD: 0.99, GBP: 0.99, CAD: 0.99 },
    rateMultiplier: { USD: 0.9978, GBP: 0.9978, CAD: 0.9978 },
    summary: "Mobile-first users",
    headline: "Mobile-first users",
    bestFor: "Mobile-first users",
    trustNote: "Mobile-first users",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Great rate", "Fast", "Polished mobile experience"],
    cons: ["Bank-first payout model", "Brand familiarity varies by sender"]
  },
  {
    slug: "taptap-send",
    name: "TapTap Send",
    logoFrom: "#111827",
    logoTo: "#00C853",
    rating: 4.7,
    reviewCount: 11542,
    speedHours: 0.17,
    speedBand: "instant",
    deliveryLabel: "Minutes",
    feeBand: "low",
    fees: { USD: 0, GBP: 0, CAD: 0 },
    rateMultiplier: { USD: 0.995, GBP: 0.995, CAD: 0.995 },
    summary: "Fast simple sending",
    headline: "Fast simple sending",
    bestFor: "Fast simple sending",
    trustNote: "Fast simple sending",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["No transfer fee for Nigeria corridor", "Fast delivery", "Strong Nigeria corridor support"],
    cons: ["FX spread details vary", "Nigeria route is bank-deposit focused"]
  },
  {
    slug: "paysend",
    name: "Paysend",
    logoFrom: "#2962FF",
    logoTo: "#00B0FF",
    rating: 4.3,
    reviewCount: 12498,
    speedHours: 36,
    speedBand: "standard",
    deliveryLabel: "1-2 business days",
    feeBand: "medium",
    fees: { USD: 1.99, GBP: 1.99, CAD: 1.99 },
    rateMultiplier: { USD: 0.987, GBP: 0.986, CAD: 0.986 },
    summary: "Predictable pricing",
    headline: "Predictable pricing",
    bestFor: "Predictable pricing",
    trustNote: "Predictable pricing",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Card transfer"],
    pros: ["Simple flat fee", "Good app", "Widely available"],
    cons: ["Rate spread varies", "Value details vary by route"]
  }
];

export const providerRankingsBySenderCountry: Record<SenderCountry, string[]> = {
  USA: [
    "Grey Finance",
    "LemFi",
    "Wise",
    "TapTap Send",
    "Remitly",
    "WorldRemit",
    "Western Union",
    "MoneyGram",
    "Paysend",
    "Flutterwave Send",
    "Afriex",
    "Chipper Cash",
    "NALA"
  ],
  UK: [
    "Wise",
    "LemFi",
    "TapTap Send",
    "NALA",
    "Remitly",
    "WorldRemit",
    "Western Union",
    "MoneyGram",
    "Paysend",
    "Grey Finance",
    "Afriex",
    "Chipper Cash",
    "Flutterwave Send"
  ],
  Canada: [
    "Wise",
    "Remitly",
    "LemFi",
    "TapTap Send",
    "Grey Finance",
    "WorldRemit",
    "Western Union",
    "MoneyGram",
    "NALA",
    "Paysend",
    "Afriex",
    "Chipper Cash",
    "Flutterwave Send"
  ]
};

export const speedBandLabel: Record<SpeedBand, string> = {
  instant: "Instant",
  "same-day": "Same day",
  standard: "1-3 days"
};

export const feeBandLabel: Record<FeeBand, string> = {
  low: "Low fees",
  medium: "Balanced fees",
  premium: "Higher fees"
};

export function getCurrencyBySender(country: SenderCountry): SourceCurrency {
  return senderCountries.find((option) => option.code === country)?.currency ?? "USD";
}

export function isSenderCountry(value: string): value is SenderCountry {
  return senderCountries.some((country) => country.code === value);
}

export function isComparisonSort(value: string): value is ComparisonSort {
  return ["best-rate", "lowest-fee", "fastest"].includes(value);
}

export function getProviderBySlug(slug: string) {
  return providers.find((provider) => provider.slug === slug);
}
