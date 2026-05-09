import type { Metadata } from "next";

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

      <main className="px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-[32px] bg-white px-6 py-8 shadow-float sm:px-8 sm:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-green">
              Guides
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-tight text-brand-navy sm:text-5xl">
              The Best Time to Transfer Money Internationally
            </h1>
            <p className="mt-4 text-base leading-7 text-brand-navy/70">
              Timing your transfer by day, week, and month can mean thousands
              more naira reaching your family.
            </p>
          </section>

          {timingSections.map((section) => (
            <section
              key={section.heading}
              className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float"
            >
              <h2 className="font-heading text-3xl text-brand-navy">
                {section.heading}
              </h2>
              <p className="mt-4 text-sm leading-7 text-brand-navy/70">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
