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
    summary: "Transparent pricing and strong bank transfer rates for recurring senders.",
    headline: "Best for predictable, transparent pricing.",
    bestFor: "Bank transfers with mid-market pricing",
    trustNote: "Public fee breakdown and strong app experience.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Clear fee split", "Strong app", "Great for repeat transfers"],
    cons: ["Not always the fastest", "Card funding can cost more"]
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
    summary: "Fast delivery options and frequent promotional pricing for new users.",
    headline: "Best for fast cash pickup and first-transfer promos.",
    bestFor: "Urgent transfers and mixed payout options",
    trustNote: "Well known for speed and onboarding simplicity.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Cash pickup", "Mobile money"],
    pros: ["Fast", "Easy onboarding", "Broad payout network"],
    cons: ["Promo rates can expire", "Rates vary by payout method"]
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
    summary: "Reliable payout choices with strong coverage across Nigerian banks.",
    headline: "Best for flexible payout options.",
    bestFor: "Cash pickup and airtime add-ons",
    trustNote: "Known brand with broad payout coverage.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Cash pickup", "Airtime top-up"],
    pros: ["Wide reach", "Fast payout", "Trusted brand"],
    cons: ["Rates can trail the leaders", "Fees vary by route"]
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
    headline: "Best for fee-free speed.",
    bestFor: "Quick sends with simple mobile UX",
    trustNote: "Strong reputation among diaspora mobile users.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["No transfer fee", "Very fast", "Simple interface"],
    cons: ["Rate spread can be wider", "Limited advanced controls"]
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
    summary: "Excellent brand recognition and one of the strongest cash pickup footprints.",
    headline: "Best for cash pickup reach.",
    bestFor: "Recipients who prefer physical pickup points",
    trustNote: "Massive global network and brand familiarity.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Cash pickup", "Bank deposit"],
    pros: ["Pickup network", "Fast", "Recognizable brand"],
    cons: ["Higher fees", "Lower effective payout on some routes"]
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
    summary: "Fast cash transfer option when reach matters more than headline value.",
    headline: "Best for fast pickup convenience.",
    bestFor: "Emergency pickup transfers",
    trustNote: "Strong offline pickup distribution in key markets.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Cash pickup", "Bank deposit"],
    pros: ["Fast pickup", "Large brand", "Easy walk-in options"],
    cons: ["Higher fees", "Rates usually below digital leaders"]
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
    headline: "Best for simple North America onboarding.",
    bestFor: "Diaspora users who want a quick setup",
    trustNote: "Solid mobile-led experience for repeat transfers.",
    supportedSenderCountries: ["Canada"],
    payoutChannels: ["Bank deposit", "Cash pickup"],
    pros: ["Smooth UX", "Fast setup", "Reliable delivery"],
    cons: ["Smaller geographic footprint", "Not always best rate"]
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
    summary: "Strong fintech feel with quick wallet-style transfers and modern UX.",
    headline: "Best for fintech-native senders.",
    bestFor: "Users comfortable with app-based money movement",
    trustNote: "Fast-moving African fintech with diaspora traction.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Wallet transfer"],
    pros: ["Low fee", "Fast", "Modern app feel"],
    cons: ["Support expectations differ by market", "Not as established as legacy brands"]
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
    summary: "One of the strongest overall value plays for sending NGN home from key diaspora markets.",
    headline: "Best overall value for Nigeria-focused senders.",
    bestFor: "Best-value bank deposits to Nigeria",
    trustNote: "Nigeria-focused product design with strong diaspora awareness.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Wallet transfer"],
    pros: ["Excellent payout value", "Zero fee", "Very fast"],
    cons: ["Primarily digital", "Fewer cash pickup options"]
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
    fees: { USD: 0.02, GBP: 0.02, CAD: 0.03 },
    rateMultiplier: { USD: 1.0, GBP: 0.999, CAD: 0.999 },
    summary: "Good option for diaspora professionals already using multicurrency accounts.",
    headline: "Best for freelancers and digital earners.",
    bestFor: "Users already moving money across multiple balances",
    trustNote: "Appeals to remote workers and multi-currency account holders.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Low fee", "Great for freelancers", "Strong multicurrency positioning"],
    cons: ["Less mainstream brand recognition", "Not always instant"]
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
    summary: "Competitive African corridor pricing with a simple in-app transfer flow.",
    headline: "Best for corridor-specific value.",
    bestFor: "Users focused on African transfer routes",
    trustNote: "Built with African cross-border corridors in mind.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Wallet transfer"],
    pros: ["Competitive rates", "Low fee", "Fast app flow"],
    cons: ["Smaller brand", "Support depth varies"]
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
    summary: "Useful if your household already trusts Flutterwave's broader fintech ecosystem.",
    headline: "Best for senders already using Flutterwave.",
    bestFor: "Brand familiarity inside African fintech",
    trustNote: "Backed by a recognizable African payments brand.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Recognizable brand", "Good app flows", "Same-day delivery"],
    cons: ["Not the top payout value", "Fewer payout options"]
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
    summary: "Very strong payout value with a diaspora-first user experience and clean app design.",
    headline: "Best for high-value mobile transfers.",
    bestFor: "Value-conscious app-first senders",
    trustNote: "Diaspora-focused product messaging and polished UX.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["Great rate", "Fast", "Polished mobile experience"],
    cons: ["Bank-first payout model", "Less legacy brand familiarity"]
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
    summary: "App-first remittance provider with fast bank delivery to Nigeria and no additional transfer fee on this corridor.",
    headline: "Best for fast, no-transfer-fee sends to Nigeria.",
    bestFor: "Diaspora users who want quick bank deposits without an added fee line",
    trustNote: "Supports sending to Nigeria from the USA, UK, and Canada with bank-focused delivery.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit"],
    pros: ["No transfer fee for Nigeria corridor", "Fast delivery", "Strong Nigeria corridor support"],
    cons: ["Total value still depends on FX spread", "Nigeria route is bank-deposit focused"]
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
    summary: "Predictable flat-fee option that can work well for small and mid-sized transfers.",
    headline: "Best for flat-fee simplicity.",
    bestFor: "Users who prefer predictable pricing",
    trustNote: "Simple fee structure and broad market recognition.",
    supportedSenderCountries: ["USA", "UK", "Canada"],
    payoutChannels: ["Bank deposit", "Card transfer"],
    pros: ["Simple flat fee", "Good app", "Widely available"],
    cons: ["Rate spread can be wider", "Value trails top performers"]
  }
];

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
