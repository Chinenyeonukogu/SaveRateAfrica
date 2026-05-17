import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    icon: "📅",
    heading: "BEST DAY TO SEND: Tuesday to Thursday",
    body: [
      "Mid-week is your sweet spot. Monday markets are volatile still recovering from weekend uncertainty. By Friday, you risk locking into poor rates that sit over the weekend. Send Tuesday through Thursday and you're moving when the market is most predictable."
    ]
  },
  {
    icon: "🗓️",
    heading: "BEST TIME OF THE MONTH: 10th to 20th",
    body: [
      "Everyone sends at month-end. That surge in demand drives rates down and fees up. Be smarter send mid-month when volume is low, and your family gets more Naira for the same amount you sent."
    ]
  },
  {
    icon: "⏰",
    heading: "BEST TIME OF DAY: Morning",
    body: [
      "Sending from the USA? Aim for 8AM to 12PM EST. That's when London and New York markets overlap. Afternoon transfers cost you more.",
      "Sending from the UK? Aim for 8AM to 11AM GMT. This is when the London market opens, the most liquid trading window in Europe.",
      "Sending from Canada? Aim for 8AM to 11AM EST/PST depending on your province. Eastern Canada benefits from the New York overlap window. Western Canada (Vancouver, Calgary) should target 5AM to 9AM PST to catch the same overlap before markets shift.",
      "The universal rule: Send in the morning your local time. Avoid evenings and weekends.",
      "Don't get caught off guard. Set a rate alert and receive your target rate when it hits."
    ]
  },
  {
    icon: "💡",
    heading: "THE REAL SECRET NOBODY TELLS YOU:",
    body: [
      "A 1-2% difference in exchange rate on a $500 transfer means over ₦11,000 more or less reaching your family. The provider you choose matters more than the day or time you send."
    ]
  }
] as const;

export default function BestTimeToTransferMoneyPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-[#f4faf5] px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto mb-4 max-w-5xl">
          <Link
            className="inline-flex items-center text-sm font-bold text-[#0d7a3b] hover:text-[#075c2b]"
            href="/blog"
          >
            &larr; Back to all articles
          </Link>
        </div>

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
                <section
                  key={section.heading}
                  className="rounded-[26px] border border-[#9bd8ad] bg-[#f0fbf4] p-5 shadow-[0_14px_34px_rgba(16,39,23,0.08)] sm:p-7"
                >
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl leading-tight text-[#0d7a3b] sm:text-3xl">
                        {section.heading}
                      </h2>
                      <div className="mt-4 space-y-4 text-[#334b38]">
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              ))}

              <Link
                className="inline-flex items-center text-sm font-bold text-[#0d7a3b] hover:text-[#075c2b]"
                href="/blog"
              >
                &larr; Read more articles
              </Link>

              <section className="rounded-[28px] bg-[#0d2416] px-6 py-7 text-white sm:px-8">
                <h2 className="font-heading text-3xl">
                  Before You Send Anything &mdash; Compare First.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/78">
                  SaveRateAfrica shows you live rates from 14 providers side by
                  side no sponsored rankings, no hidden fees, just the truth
                  about who gives your family the most Naira today.
                </p>
                <a
                  className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-[#f5c84b] px-5 text-sm font-extrabold text-[#102717]"
                  href="https://saverateafrica.com"
                >
                  Compare rates now &rarr;
                </a>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
