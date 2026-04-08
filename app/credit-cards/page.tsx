import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  Trophy
} from "lucide-react";

import { CreditEligibilityCounterBadge } from "@/components/CreditEligibilityCounterBadge";
import { SiteHeader } from "@/components/SiteHeader";
import { creditCardOffers } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Best Credit Cards for Nigerians in USA | SaveRateAfrica",
  description:
    "Mobile-friendly credit card recommendations for Nigerians in the USA with low or limited credit history.",
  alternates: {
    canonical: "/credit-cards"
  },
  openGraph: {
    title: "Best Credit Cards for Nigerians in the USA",
    description:
      "Earn rewards while you send and build a stronger U.S. credit profile."
  }
};

const offerMap = Object.fromEntries(
  creditCardOffers.map((offer) => [offer.slug, offer])
) as Record<string, (typeof creditCardOffers)[number]>;

const featuredCreditCards = [
  {
    cardToneFrom: offerMap.chime.cardToneFrom,
    cardToneTo: offerMap.chime.cardToneTo,
    benefits: [
      "Get approved with no credit check",
      "Build your credit score fast",
      "No annual fee"
    ],
    bestFor: "Beginners",
    creditNeeded: "None",
    flag: "🇺🇸",
    logoLabel: "chime",
    name: "Chime Credit Builder",
    ratingScore: "4.8/5",
    slug: "chime",
    stars: "★★★★★",
    subtitle: "Secured Visa",
    topPick: true,
    url: "https://www.chime.com/",
    wordmark: "CHIME"
  },
  {
    cardToneFrom: offerMap.discover.cardToneFrom,
    cardToneTo: offerMap.discover.cardToneTo,
    benefits: [
      "Automatic upgrade review after 7 months",
      "Earn cashback on daily spending",
      "Build credit safely"
    ],
    bestFor: "Building history",
    creditNeeded: "None",
    flag: "🇺🇸",
    logoLabel: "discover",
    name: "Discover it",
    ratingScore: "4.7/5",
    slug: "discover",
    stars: "★★★★½",
    subtitle: "Secured Card",
    topPick: false,
    url: "https://www.discover.com/credit-cards/secured/",
    wordmark: "DISCOVER"
  },
  {
    cardToneFrom: offerMap["capital-one"].cardToneFrom,
    cardToneTo: offerMap["capital-one"].cardToneTo,
    benefits: [
      "Low deposit options",
      "Increase limit after 6 months",
      "Trusted US issuer"
    ],
    bestFor: "Beginners + poor",
    creditNeeded: "None",
    flag: "🇺🇸",
    logoLabel: "capital one",
    name: "Capital One Platinum",
    ratingScore: "4.5/5",
    slug: "capital-one",
    stars: "★★★★½",
    subtitle: "Secured",
    topPick: false,
    url: "https://www.capitalone.com/credit-cards/secured-mastercard/",
    wordmark: "CAPITAL ONE"
  },
  {
    cardToneFrom: offerMap.petal.cardToneFrom,
    cardToneTo: offerMap.petal.cardToneTo,
    benefits: [
      "Approval based on income, not score",
      "No fees of any kind",
      "Cashback rewards on purchases"
    ],
    bestFor: "Income earners",
    creditNeeded: "None",
    flag: "🇺🇸",
    logoLabel: "petal",
    name: "Petal 2",
    ratingScore: "4.6/5",
    slug: "petal",
    stars: "★★★★½",
    subtitle: "Visa",
    topPick: false,
    url: "https://www.petalcard.com/products/petal-2",
    wordmark: "PETAL 2"
  }
] as const;

const socialProofItems = [
  "⭐ 4.8/5 average card rating",
  "⚡ Approval in as fast as 2 mins",
  "🔒 Soft check only"
] as const;

const trustSeals = [
  "🔒 256-bit Secure",
  "🏦 FDIC-Insured Partners",
  "📋 No Hard Inquiry"
] as const;

const faqItems = [
  {
    answer:
      "Most cards accept an ITIN. Chime and Petal 2 are ITIN-friendly options.",
    question: "Do I need a Social Security Number?"
  },
  {
    answer:
      "No. All checks on this page are soft inquiries and will not affect your score.",
    question: "Will checking my eligibility hurt my credit?"
  },
  {
    answer:
      "Most users see score movement within 3-6 months of consistent on-time payments.",
    question: "How long does it take to build credit?"
  },
  {
    answer:
      "Chime Credit Builder is the most accessible — no credit check, no minimum score required.",
    question: "Which card is best if I just arrived in the US?"
  }
] as const;

function TableLogo({ label }: { label: string }) {
  return (
    <span className="inline-flex min-w-[88px] items-center justify-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
      {label}
    </span>
  );
}

export default function CreditCardsPage() {
  const topPick = featuredCreditCards[0];

  return (
    <>
      <SiteHeader showBreadcrumb />

      <main className="overflow-x-hidden pb-28 min-[600px]:pb-16">
        <section className="bg-[linear-gradient(135deg,#1a3a1a_0%,#2e7d32_50%,#0d2416_100%)]">
          <div className="mx-auto max-w-[1200px] px-5 pb-10 pt-8 min-[600px]:px-6 min-[600px]:py-14 lg:px-10 lg:py-16">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 px-5 py-6 text-white shadow-[0_20px_60px_rgba(15,36,20,0.35)] backdrop-blur-sm min-[600px]:px-8 min-[600px]:py-10 lg:px-12 lg:py-12">
              <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <CreditEligibilityCounterBadge />

              <div className="relative max-w-3xl">
                <h1 className="max-w-3xl font-heading text-[clamp(28px,7vw,48px)] leading-[1.02] text-white min-[600px]:text-5xl lg:text-[56px]">
                  Get Approved for a Credit Card in the US — Even with No Credit
                  History
                </h1>

                <p className="mt-4 max-w-2xl text-[15px] font-light leading-7 text-white/82 min-[600px]:text-lg">
                  Build your credit and earn rewards while sending money to Nigeria
                </p>

                <div className="mt-8">
                  <button
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#256a2a]"
                    disabled
                    style={{ cursor: "default", pointerEvents: "none", opacity: 1 }}
                    type="button"
                  >
                    <Lock className="h-4 w-4" />
                    Check if you qualify (no impact)
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-2 text-[11px] text-white/74">
                    Soft check only — will not affect your credit score
                  </p>
                </div>

                <div className="mt-6 grid gap-3 text-sm text-white min-[600px]:grid-cols-3">
                  {[
                    "No credit history required",
                    "Fast approval decisions",
                    "Trusted by Nigerians in 🇺🇸"
                  ].map((item) => (
                    <div key={item} className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#66bb6a]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#e8f5e9]">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-3 px-4 py-4 text-center text-[13px] text-[#2e4a2e] min-[600px]:px-6 lg:px-10">
            {socialProofItems.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span className="font-medium">{item}</span>
                {index < socialProofItems.length - 1 ? (
                  <span className="hidden h-4 w-px bg-[#c8e6c9] min-[600px]:block" />
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-10 min-[600px]:px-6 min-[600px]:py-12 lg:px-10 lg:py-14">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-[#5d7f5f] min-[600px]:text-[11px]">
            {trustSeals.map((seal) => (
              <span
                key={seal}
                className="inline-flex items-center rounded-full bg-[#f4faf5] px-3 py-1.5"
              >
                {seal}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-center uppercase tracking-[0.12em]">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-[13px] font-bold text-[#1a2e1a]">
              Most Recommended
            </span>
            <span className="text-[13px] font-medium text-[#6b7b6d]">
              for Beginners &amp; No Credit History
            </span>
          </div>

          <div className="mt-8 grid gap-5 min-[600px]:grid-cols-2">
            {featuredCreditCards.map((card) => (
              <article
                key={card.slug}
                className="overflow-hidden rounded-[14px] border border-[#e8f5e9] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[2px] hover:shadow-[0_18px_34px_rgba(0,0,0,0.12)]"
              >
                <div
                  className="relative h-40 overflow-hidden min-[600px]:h-[220px]"
                  style={{
                    background: `linear-gradient(140deg, ${card.cardToneFrom} 0%, ${card.cardToneTo} 100%)`
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,16,12,0.08)_0%,rgba(8,16,12,0.62)_100%)]" />
                  <div className="absolute -bottom-12 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

                  <div className="absolute left-4 top-4 rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    SaveRateAfrica Pick
                  </div>

                  {card.topPick ? (
                    <div className="absolute right-4 top-4 rounded-full bg-[#2e7d32] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                      ⭐ Top Pick
                    </div>
                  ) : null}

                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.26em] text-white/72">
                      U.S. credit builder
                    </p>
                    <p className="mt-2 font-heading text-[28px] leading-none min-[600px]:text-[34px]">
                      {card.wordmark}
                    </p>
                  </div>
                </div>

                <div className="p-5 min-[600px]:p-6">
                  <div>
                    <h2 className="font-heading text-[24px] leading-tight text-[#1a2e1a]">
                      {card.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#5d6b5f]">{card.subtitle}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="font-semibold tracking-[0.04em] text-[#f6c619]">
                      {card.stars}
                    </span>
                    <span className="font-semibold text-[#1a2e1a]">
                      {card.ratingScore}
                    </span>
                    <span>{card.flag}</span>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {card.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm text-[#2e4a2e]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2e7d32]" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <a
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[#2e7d32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#256a2a]"
                      href={card.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Check if you qualify
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <p className="mt-2 text-center text-[11px] text-[#6b7b6d]">
                      No impact to your credit score
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-10 overflow-hidden rounded-[18px] border border-[#e8f5e9] bg-white">
            <div className="border-b border-[#eef5ef] px-5 py-4 min-[600px]:px-6">
              <h2 className="text-center font-heading text-[24px] text-[#1a2e1a]">
                FAQs
              </h2>
            </div>

            <div>
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group border-b border-[#eef5ef] px-5 py-4 last:border-b-0 min-[600px]:px-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-[#1a2e1a]">
                    <span>{item.question}</span>
                    <span className="shrink-0 text-[#2e7d32]">
                      <Plus className="h-4 w-4 group-open:hidden" />
                      <Minus className="hidden h-4 w-4 group-open:block" />
                    </span>
                  </summary>
                  <p className="pt-3 text-sm leading-7 text-[#5d6b5f]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 pb-10 min-[600px]:px-6 lg:px-10 lg:pb-14">
          <div className="overflow-hidden rounded-[24px] bg-[#1a2e1a] text-white shadow-[0_14px_34px_rgba(26,46,26,0.18)]">
            <div className="px-5 py-6 text-center min-[600px]:px-8 min-[600px]:py-8">
              <h2 className="font-heading text-[28px] text-white">
                Compare Approval Chances ★★★★★
              </h2>
            </div>

            <div className="overflow-x-auto px-4 pb-6 min-[600px]:px-8">
              <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-[16px]">
                <thead>
                  <tr className="bg-white/6 text-left text-xs uppercase tracking-[0.18em] text-white/70">
                    <th className="px-4 py-4 font-semibold">Card name</th>
                    <th className="px-4 py-4 font-semibold">Logo</th>
                    <th className="px-4 py-4 font-semibold">Stars</th>
                    <th className="px-4 py-4 font-semibold">Best for</th>
                    <th className="px-4 py-4 font-semibold">Credit needed</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      bestFor: "Beginners",
                      creditNeeded: "None",
                      logoLabel: "chime",
                      name: "Chime",
                      stars: "★★★★★"
                    },
                    {
                      bestFor: "Building history",
                      creditNeeded: "None",
                      logoLabel: "discover",
                      name: "Discover",
                      stars: "★★★★½"
                    },
                    {
                      bestFor: "Beginners + poor",
                      creditNeeded: "None",
                      logoLabel: "capital one",
                      name: "Capital One",
                      stars: "★★★★"
                    },
                    {
                      bestFor: "Income earners",
                      creditNeeded: "None",
                      logoLabel: "petal",
                      name: "Petal 2",
                      stars: "★★★★½"
                    }
                  ].map((row) => (
                    <tr key={row.name} className="border-t border-white/10 text-sm text-white/88">
                      <td className="border-t border-white/10 px-4 py-4 font-semibold">
                        {row.name}
                      </td>
                      <td className="border-t border-white/10 px-4 py-4">
                        <TableLogo label={row.logoLabel} />
                      </td>
                      <td className="border-t border-white/10 px-4 py-4 text-[#f6c619]">
                        {row.stars}
                      </td>
                      <td className="border-t border-white/10 px-4 py-4">
                        {row.bestFor}
                      </td>
                      <td className="border-t border-white/10 px-4 py-4">
                        {row.creditNeeded}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 pb-8 text-center min-[600px]:px-8">
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2e7d32] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#256a2a]"
                href={topPick.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                Check my eligibility
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="mt-6 rounded-[16px] border border-[#e8f5e9] bg-white px-5 py-4 text-center text-sm leading-7 text-[#5d6b5f] min-[600px]:px-6">
            We may earn a commission if you apply through our links, at no cost
            to you. Our recommendations prioritize fit, accessibility, and
            long-term value for diaspora senders.
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-[999] min-[600px]:hidden">
        <div className="flex h-14 items-center justify-between gap-3 bg-[#2e7d32] px-4 text-white shadow-[0_-10px_30px_rgba(15,36,20,0.2)]">
          <p className="text-[11px] font-semibold leading-tight">
            Ready to build your U.S. credit?
          </p>
          <a
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-white px-4 text-[11px] font-bold text-[#2e7d32]"
            href={topPick.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Check if you qualify →
          </a>
        </div>
      </div>
    </>
  );
}
