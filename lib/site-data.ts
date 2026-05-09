import { getCreditCardAffiliateLink } from "@/lib/affiliateLinks";
import { getProviderAffiliateLink } from "@/lib/affiliateLinks";
import type { SenderCountry } from "@/lib/providers";

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface Review {
  name: string;
  country: SenderCountry;
  provider: string;
  rating: number;
  quote: string;
  role: string;
}

export interface CreditCardOffer {
  slug: string;
  name: string;
  badge: string;
  bestFor: string;
  rating: number;
  annualFee: string;
  intro: string;
  pros: string[];
  cardToneFrom: string;
  cardToneTo: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  href?: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    title: "Enter amount and origin",
    description:
      "Pick your sending country, enter how much you want to send, and Select Compare Rates Now."
  },
  {
    step: "02",
    title: "Compare live-value offers",
    description:
      "We line up rate, fee, speed, and payout value side by side so you see the real winner instantly."
  },
  {
    step: "03",
    title: "Click out and send",
    description:
      "Choose the provider that fits your budget and speed. We never hold funds or process transfers ourselves."
  }
];

export const providerReviews: Review[] = [
  {
    name: "Ada O.",
    country: "USA",
    provider: "LemFi",
    rating: 5,
    role: "Nurse in Houston",
    quote:
      "I used to lose too much value on hidden spreads. SaveRateAfrica showed me LemFi was delivering over N6,000 more on my monthly send."
  },
  {
    name: "Tunde A.",
    country: "USA",
    provider: "Remitly",
    rating: 5,
    role: "Graduate student in Chicago",
    quote:
      "I needed speed for emergency bills. The comparison made it obvious which provider could land instantly without guessing."
  },
  {
    name: "Amaka U.",
    country: "UK",
    provider: "Wise",
    rating: 5,
    role: "Product manager in London",
    quote:
      "The clean side-by-side layout saved me from juggling five tabs. I now check SaveRateAfrica before every transfer."
  },
  {
    name: "Chidi E.",
    country: "UK",
    provider: "Nala",
    rating: 4,
    role: "Engineer in Manchester",
    quote:
      "I care about payout value more than marketing claims. Seeing the amount received ranked properly changed how I send home."
  },
  {
    name: "Kelechi N.",
    country: "Canada",
    provider: "Sendwave",
    rating: 4,
    role: "Truck dispatcher in Calgary",
    quote:
      "I like that it feels built for Nigerians abroad. The app is fast, mobile-friendly, and the instant-send options are easy to trust."
  }
];

function generateTrendSeries(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));

    const wave = Math.sin(index / 2.7) * 9;
    const drift = index * 0.8;
    const correction = Math.cos(index / 4.1) * 4;

    return {
      label: date.toLocaleDateString("en-US", {
        month: days > 30 ? "short" : "numeric",
        day: "numeric"
      }),
      USD: Math.round((1550 + wave + drift) * 10) / 10,
      GBP: Math.round((1972 + wave * 1.1 + drift + correction) * 10) / 10,
      CAD: Math.round((1138 + wave * 0.8 + drift * 0.55 - correction) * 10) / 10
    };
  });
}

export const trendSeries = {
  "7D": generateTrendSeries(7),
  "30D": generateTrendSeries(30),
  "90D": generateTrendSeries(90)
};

export const faqItems = [
  {
    question: "Which service sends the most NGN per dollar?",
    answer:
      "It changes by day, funding method, and corridor. SaveRateAfrica ranks providers by actual NGN delivered after fees so you see the top-pick option for your exact send amount."
  },
  {
    question: "Which provider is better for Nigeria?",
    answer:
      "Check the comparison dashboard to see which provider gives you strong value for your amount, speed needs, and payout preference."
  },
  {
    question: "What's a strong time to send money to Nigeria?",
    answer:
      "Most diaspora senders benefit from watching rate momentum rather than reacting to headlines. Use the trend chart and rate alerts to catch favorable moves instead of sending blind."
  },
  {
    question: "Are there transfer limits?",
    answer:
      "Yes. Limits vary by provider, sender verification level, funding source, and receiving channel. Large transfers usually require extra ID checks and may unlock better pricing."
  }
];

export const creditCardOffers: CreditCardOffer[] = [
  {
    slug: "chime",
    name: "Chime Credit Builder Secured Visa",
    badge: "No credit check",
    bestFor: "No credit or rebuilding",
    rating: 4.8,
    annualFee: "$0 annual fee",
    intro: "Reports to all 3 bureaus and keeps the application path approachable for newcomers.",
    pros: ["No credit check required", "No annual fee", "Reports to all 3 bureaus"],
    cardToneFrom: "#00C853",
    cardToneTo: "#0A1628",
    url: getCreditCardAffiliateLink("chime", { placement: "credit-cards-page" })
  },
  {
    slug: "discover",
    name: "Discover it Secured Credit Card",
    badge: "Cash back rewards",
    bestFor: "Low credit, building upward",
    rating: 4.7,
    annualFee: "$0 annual fee",
    intro: "Useful for immigrants who want security deposit structure plus tangible everyday rewards.",
    pros: [
      "Automatic review for upgrade",
      "2% cash back at gas and restaurants",
      "Strong educational tools"
    ],
    cardToneFrom: "#FF9800",
    cardToneTo: "#FF5722",
    url: getCreditCardAffiliateLink("discover", { placement: "credit-cards-page" })
  },
  {
    slug: "capital-one",
    name: "Capital One Platinum Secured",
    badge: "Low deposit",
    bestFor: "Limited credit history immigrants",
    rating: 4.5,
    annualFee: "$0 annual fee",
    intro: "A strong option when you want a mainstream issuer and a lower security deposit path.",
    pros: [
      "Low security deposit options",
      "Chance to access a higher limit after 6 months",
      "Recognized issuer"
    ],
    cardToneFrom: "#0A1628",
    cardToneTo: "#1E88E5",
    url: getCreditCardAffiliateLink("capital-one", { placement: "credit-cards-page" })
  },
  {
    slug: "petal",
    name: "Petal 2 Cash Back, No Fees Visa",
    badge: "No annual fee",
    bestFor: "New to the USA with limited bureau history",
    rating: 4.6,
    annualFee: "$0 annual fee",
    intro: "Uses cash-flow style underwriting, which can help if your file is thin but your banking habits are healthy.",
    pros: [
      "No score required in some cases",
      "Up to 1.5% cash back",
      "No annual or foreign transaction fees"
    ],
    cardToneFrom: "#FFD600",
    cardToneTo: "#00C853",
    url: getCreditCardAffiliateLink("petal", { placement: "credit-cards-page" })
  }
];

export const blogPosts: BlogPost[] = [
  {
    slug: "cheapest-way-to-send-money-to-nigeria",
    title: "What's the Cheapest Way to Send Money to Nigeria?",
    category: "Comparisons",
    readTime: "4 min read",
    href: "/blog/cheapest-way-to-send-money-to-nigeria",
    excerpt:
      "A breakdown of the lowest-fee providers from USA, UK, and Canada - ranked by the exact naira your recipient receives."
  },
  {
    slug: "best-time-to-transfer-money",
    title: "The Best Time to Transfer Money Internationally",
    category: "Guides",
    readTime: "3 min read",
    href: "/blog/best-time-to-transfer-money",
    excerpt:
      "Timing your transfer by day, week, and month can mean thousands more naira reaching your family."
  },
  {
    slug: "how-to-build-credit-in-usa-as-a-nigerian-immigrant",
    title: "How to Build Credit in USA as a Nigerian Immigrant",
    category: "Credit",
    readTime: "7 min read",
    excerpt:
      "A straightforward starter plan for establishing U.S. credit without getting trapped by poor-fit products."
  }
];

export const featuredProviderLinks = [
  getProviderAffiliateLink("lemfi", { slot: "hero" }),
  getProviderAffiliateLink("wise", { slot: "comparison" }),
  getProviderAffiliateLink("remitly", { slot: "comparison" })
];
