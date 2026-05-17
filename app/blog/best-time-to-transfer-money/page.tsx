import type { Metadata } from "next";
import Image from "next/image";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "The Best Time to Transfer Money Internationally",
  description:
    "Learn the best day, time of month, and time of day to transfer money internationally and send more naira home.",
  alternates: {
    canonical: "/blog/best-time-to-transfer-money"
  }
};

const timingSections = [
  {
    heading: "BEST DAY: Tuesday to Thursday 📅",
    body:
      "Mid-week is most stable. Monday markets are unsettled after the weekend. Friday risks locking into poor rates over the weekend."
  },
  {
    heading: "BEST TIME OF MONTH: 10th to 20th 🗓",
    body:
      "Most people send at month end creating high demand and worse rates. Mid-month means lower fees and faster delivery."
  },
  {
    heading: "BEST TIME OF DAY: Morning ⏰",
    body:
      "For USA senders aim for 8AM to 12PM EST when London and New York markets overlap and spreads are tightest."
  },
  {
    heading: "WATCH ECONOMIC EVENTS: 📊",
    body:
      "US Federal Reserve decisions, monthly jobs reports, and CBN policy updates can swing the naira fast. Set a rate alert and act when your target rate is hit."
  },
  {
    heading: "THE REAL SECRET:",
    body:
      "Always compare providers before you send. A difference of even 1-2% in the rate on a $500 transfer can mean over 11,000 naira more or less reaching your family."
  }
] as const;

export default function BestTimeToTransferMoneyPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-[#f4faf5] px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <article className="mx-auto max-w-5xl overflow-hidden rounded-[34px] bg-white shadow-float">
          <header className="grid gap-6 bg-[#0d2416] px-6 py-7 text-white sm:px-10 sm:py-9 md:gap-8 lg:min-h-[60vh] lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9ee8c0]">
                Guides · 3 min read · SaveRateAfrica
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                The Best Time to Transfer Money Internationally
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">
                Timing your transfer by day, week, and month can mean thousands
                more naira reaching your family.
              </p>
            </div>

            <figure className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#102717] shadow-2xl">
              <Image
                src="/blog/best-time-to-transfer-money.png"
                alt="A professional comparing remittance services and timing an international money transfer to Nigeria"
                width={1456}
                height={1040}
                priority
                className="h-[250px] w-full object-cover object-center md:h-[300px] lg:h-[300px] xl:h-[52vh] xl:max-h-[520px]"
              />
            </figure>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
            <div className="space-y-10 text-[17px] leading-8 text-[#243b2b]">
              {timingSections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-heading text-3xl text-[#102717]">
                    {section.heading}
                  </h2>
                  <p className="mt-4 border-b border-[#dcefe1] pb-6 text-[#334b38]">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
