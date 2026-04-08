import type { Metadata } from "next";
import { ShieldCheck, Sparkles, Wallet } from "lucide-react";

import { CreditCardCard } from "@/components/CreditCardCard";
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

export default function CreditCardsPage() {
  return (
    <>
      <SiteHeader showBreadcrumb />

      <main className="pb-32 lg:pb-16">
        <div className="space-y-10">
          <section className="mx-auto max-w-[1200px] px-4 pt-12 min-[600px]:px-6 lg:px-10">
            <div className="rounded-[32px] bg-brand-navy px-6 py-8 text-white shadow-float sm:px-8 sm:py-10">
              <div className="max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
                  Credit cards for senders
                </p>
                <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">
                  Best credit cards for Nigerians in the USA, even with low or no credit score
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/80">
                  Earn rewards while you send. Apply with limited credit history and
                  focus on products that help you build long-term financial leverage.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <ShieldCheck className="h-6 w-6 text-brand-green" />
                  <p className="mt-3 font-semibold">Immigrant-friendly picks</p>
                  <p className="mt-2 text-sm text-white/70">
                    Prioritized for limited file, low score, or fresh U.S. history.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Wallet className="h-6 w-6 text-brand-yellow" />
                  <p className="mt-3 font-semibold">Reward-aware choices</p>
                  <p className="mt-2 text-sm text-white/70">
                    Balance approval odds, annual fee, and practical cash-back value.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <Sparkles className="h-6 w-6 text-brand-coral" />
                  <p className="mt-3 font-semibold">Mobile-first experience</p>
                  <p className="mt-2 text-sm text-white/70">
                    Designed for quick scanning and high-confidence decisions on mobile.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto grid max-w-[1200px] gap-5 px-4 min-[600px]:px-6 lg:px-10">
            {creditCardOffers.map((offer) => (
              <CreditCardCard key={offer.slug} offer={offer} />
            ))}
          </section>

          <section className="mx-auto max-w-[1200px] px-4 min-[600px]:px-6 lg:px-10">
            <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
              <p className="text-sm leading-7 text-brand-navy/70">
                We may earn a commission if you apply through our links, at no cost
                to you. Our recommendations prioritize fit, accessibility, and
                long-term value for diaspora senders.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
