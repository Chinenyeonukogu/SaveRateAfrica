import type { Metadata } from "next";
import Image from "next/image";

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

      <main className="bg-[#f4faf5] px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <article className="mx-auto max-w-5xl overflow-hidden rounded-[34px] bg-white shadow-float">
          <header className="bg-[#0d2416] px-6 py-8 text-white sm:px-10 sm:py-12 lg:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9ee8c0]">
              Comparisons · 4 min read · SaveRateAfrica
            </p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
              What&apos;s the Cheapest Way to Send Money to Nigeria?
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">
              The cheapest way to send money to Nigeria is to skip your bank
              and use a digital transfer platform.
            </p>
          </header>

          <figure className="relative border-b border-[#dcefe1] bg-[#102717]">
            <Image
              src="/blog/cheap-way-to-send-money.png"
              alt="A professional reviewing SaveRateAfrica money transfer guidance for sending money to Nigeria"
              width={1456}
              height={1040}
              priority
              className="h-auto w-full object-cover"
            />
          </figure>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
            <div className="space-y-10 text-[17px] leading-8 text-[#243b2b]">
              {countrySections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-heading text-3xl text-[#102717]">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-3">
                    {section.providers.map(([provider, description]) => (
                      <p key={provider} className="border-b border-[#dcefe1] pb-3">
                        <strong className="font-extrabold text-[#102717]">
                          {provider}
                        </strong>{" "}
                        - {description}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <section className="rounded-[28px] bg-[#f4faf5] px-5 py-6 sm:px-7">
                <h2 className="font-heading text-3xl text-[#102717]">KEY TIPS</h2>
                <ul className="mt-5 space-y-3">
                  {keyTips.map((tip) => (
                    <li key={tip} className="flex gap-3 text-[#334b38]">
                      <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#2e7d32]" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
