import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "What's the Cheapest Way to Send Money to Nigeria?",
  description:
    "A breakdown of the lowest-fee providers from USA, UK, and Canada ranked by the exact naira your recipient receives.",
  alternates: {
    canonical: "/blog/cheapest-way-to-send-money-to-nigeria"
  }
};

const countrySections = [
  {
    heading: "FROM THE USA 🇺🇸",
    providers: [
      ["Sendwave", "Zero fees, fast everyday transfers"],
      ["LemFi", "Zero fees, naira or domiciliary accounts"],
      ["Wise", "Low fees, mid-market rate, best for large amounts"],
      ["Remitly", "Low fees plus new user promos"],
      ["Afriex", "Zero fees, competitive NGN rate"]
    ]
  },
  {
    heading: "FROM THE UK 🇬🇧",
    providers: [
      ["LemFi", "Zero fees, built for African diaspora"],
      ["Wise", "Low fees, best for large or regular transfers"],
      ["Remitly", "Low fees plus new user promos"],
      ["WorldRemit", "Low fees, wide Nigerian bank coverage"]
    ]
  },
  {
    heading: "FROM CANADA 🇨🇦",
    providers: [
      ["LemFi", "Zero fees, direct bank deposit"],
      ["Wise", "Cheapest for large amounts"],
      ["Remitly", "Speed plus new user deals"],
      ["Pesa", "Zero fees, strong CAD-NGN rates"]
    ]
  }
] as const;

const keyTips = [
  "Pay by bank transfer not credit card",
  "Avoid weekends",
  "Send mid-week Tuesday to Thursday",
  "Never use your regular bank",
  "Always compare the exchange rate not just the fee"
] as const;

export default function CheapestWayToSendMoneyToNigeriaPage() {
  return (
    <>
      <SiteHeader />

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
              Comparisons
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
              What&apos;s the Cheapest Way to Send Money to Nigeria?
            </h1>
            <p className="mt-4 text-base leading-7 text-brand-navy/70">
              The cheapest way to send money to Nigeria is to skip your bank
              and use a digital transfer platform.
            </p>
          </section>

          {countrySections.map((section) => (
            <section
              key={section.heading}
              className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float"
            >
              <h2 className="font-heading text-3xl text-brand-navy">
                {section.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {section.providers.map(([provider, description]) => (
                  <li
                    key={provider}
                    className="rounded-2xl bg-brand-light px-4 py-3 text-sm leading-7 text-brand-navy/70"
                  >
                    <strong className="font-bold text-brand-navy">{provider}:</strong>{" "}
                    {description}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
            <h2 className="font-heading text-3xl text-brand-navy">KEY TIPS</h2>
            <ul className="mt-5 space-y-3">
              {keyTips.map((tip) => (
                <li
                  key={tip}
                  className="rounded-2xl bg-brand-light px-4 py-3 text-sm leading-7 text-brand-navy/70"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
