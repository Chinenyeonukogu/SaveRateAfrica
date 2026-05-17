import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "How to Build Credit in the USA as a Nigerian Immigrant",
  description:
    "A straightforward starter plan for Nigerian immigrants establishing U.S. credit without getting trapped by poor-fit products.",
  alternates: {
    canonical: "/blog/how-to-build-credit-in-usa-as-a-nigerian-immigrant"
  }
};

const bankOptions = [
  ["Chase Bank", "Widely accessible, strong app, accepts passport and visa"],
  ["Bank of America", "Has a dedicated program for newcomers"],
  ["Chime", "Fully online, no minimum balance, no monthly fees"],
  ["Credit Unions", "Often more flexible with documentation requirements"]
] as const;

const securedCards = [
  ["Discover it Secured", "No annual fee, cash back rewards, graduates to unsecured after 7 months"],
  ["Capital One Platinum Secured", "Low deposit options starting at $49"],
  ["OpenSky Secured Visa", "No credit check required, no bank account needed to apply"]
] as const;

const timeline = [
  ["Open bank account", "Week 1"],
  ["Get secured credit card", "Week 2"],
  ["First credit score appears", "Month 3 - 6"],
  ["Score reaches 650+", "Month 6 - 12"],
  ["Qualify for unsecured cards", "Month 12"],
  ["Strong score for apartment or car loan", "Month 12 - 18"]
] as const;

function DetailList({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="mt-5 space-y-3">
      {items.map(([title, body]) => (
        <div
          key={title}
          className="flex gap-3 rounded-[18px] border border-[#dcefe1] bg-[#f8fcf8] px-4 py-3"
        >
          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#2e7d32]" />
          <p className="text-[15px] leading-7 text-[#334b38]">
            <strong className="font-extrabold text-[#102717]">{title}</strong>{" "}
            - {body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function BuildCreditUsaNigerianImmigrantPage() {
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
          <header className="bg-[#0d2416] text-white">
            <div className="px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9ee8c0]">
                3 minute read · Personal Finance · SaveRateAfrica
              </p>
              <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                How to Build Credit in the USA as a Nigerian Immigrant
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78">
                A straightforward starter plan for establishing U.S. credit
                without getting trapped by poor-fit products.
              </p>
            </div>

            <div className="relative h-[260px] overflow-hidden sm:h-[360px]">
              <Image
                alt="Credit card and savings tools for building financial stability"
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                src="/hero/build-credit.png"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d2416] to-transparent" />
            </div>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
            <div className="space-y-10 text-[17px] leading-8 text-[#243b2b]">
              <section className="space-y-5">
                <p>
                  You landed in America with ambition, work ethic, and a plan.
                </p>
                <p>
                  But the moment you tried to rent an apartment, finance a car,
                  or even apply for a basic credit card, you hit a wall nobody
                  warned you about.
                </p>
                <p className="rounded-[24px] border-l-4 border-[#f6c619] bg-[#fff9df] px-5 py-4 text-xl font-extrabold text-[#102717]">
                  "Sorry. You have no credit history."
                </p>
                <p>
                  This is one of the most frustrating realities for Nigerian
                  immigrants arriving in the United States. And it is not just
                  inconvenient; it is expensive. Without credit, you pay higher
                  deposits, higher interest rates, and miss out on financial
                  products that could genuinely change your life here.
                </p>
                <p>The good news? You can fix this. Faster than you think.</p>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-3xl text-[#102717]">
                  Why Your Nigerian Credit History Does Not Transfer
                </h2>
                <p>
                  The United States credit system, managed by three major
                  bureaus, Experian, Equifax, and TransUnion, operates
                  completely independently from any other country&apos;s
                  financial records. Your Nigerian bank history, your years of
                  consistent bill payments, your loans repaid on time, none of
                  it follows you here.
                </p>
                <p>
                  This is a systemic gap. And understanding that is the first
                  step to closing it.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  Step 1 - Open a U.S. Bank Account Immediately
                </h2>
                <p className="mt-4">
                  Before anything else, open a checking and savings account at
                  an American bank or credit union. This does not build credit
                  on its own, but it is the foundation everything else sits on.
                </p>
                <DetailList items={bankOptions} />
                <p className="mt-5">
                  You will need: your passport, visa or immigration documents,
                  and an ITIN or Social Security Number if you have one.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  Step 2 - Get a Secured Credit Card
                </h2>
                <p className="mt-4">
                  This is the single most powerful first move you can make. A
                  secured credit card works like this: you deposit a small
                  amount, typically $200 to $500, and that deposit becomes your
                  credit limit. You use the card for everyday purchases, pay it
                  off every month, and the bank reports your payments to the
                  credit bureaus.
                </p>
                <p className="mt-4">
                  That reporting is what builds your credit score.
                </p>
                <DetailList items={securedCards} />
                <p className="mt-5 rounded-[24px] bg-[#e8f5e9] px-5 py-4 font-bold text-[#12321d]">
                  The golden rule: never spend more than 30% of your credit
                  limit. Pay the full balance every single month. Never miss a
                  payment.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-3xl text-[#102717]">
                  Step 3 - Become an Authorized User
                </h2>
                <p>
                  If you have a trusted friend or family member already
                  established in the U.S. with good credit, ask them to add you
                  as an authorized user on one of their credit cards.
                </p>
                <p>
                  You do not even need to use the card. Simply being listed as
                  an authorized user means their positive payment history gets
                  added to your credit report. Choose someone with a long
                  history, low balances, and zero late payments.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-3xl text-[#102717]">
                  Step 4 - Pay Every Bill On Time
                </h2>
                <p>
                  Once your credit profile starts building, payment history
                  becomes the most important factor in your score, accounting
                  for 35% of your total FICO score.
                </p>
                <p>
                  Set up automatic payments for everything you can. Your secured
                  card. Your phone bill. Your utilities. Even Netflix.
                </p>
                <p>
                  Some services like Experian Boost allow you to add utility
                  and streaming payments directly to your credit report at no
                  cost. This can give you an immediate score bump.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-3xl text-[#102717]">
                  Step 5 - Apply for a Credit Builder Loan
                </h2>
                <p>
                  Credit builder loans are specifically designed for people in
                  your situation. You do not receive the money upfront. Instead
                  you make small monthly payments, typically $25 to $150, into a
                  savings account. When the loan term ends, the full amount is
                  released to you, and every on-time payment you made has been
                  reported to the credit bureaus.
                </p>
                <p>You build credit and savings at the same time.</p>
                <DetailList
                  items={[
                    ["Self Financial", "Fully online, low monthly payments"],
                    ["Credit Unions", "Most offer credit builder loans to new members"]
                  ]}
                />
              </section>

              <section className="rounded-[28px] bg-[#102717] px-5 py-6 text-white sm:px-7">
                <h2 className="font-heading text-3xl">What to Avoid</h2>
                <div className="mt-5 space-y-5 text-white/82">
                  <p>
                    Building credit takes patience. And that patience can make
                    you vulnerable to products designed to profit from your
                    urgency.
                  </p>
                  <p>
                    <strong className="text-white">High-fee credit cards:</strong>{" "}
                    any card charging more than $39 annually before you have
                    established credit is likely predatory.
                  </p>
                  <p>
                    <strong className="text-white">
                      Payday loans and Buy Now Pay Later:
                    </strong>{" "}
                    neither builds your credit and both can trap you in cycles
                    of debt.
                  </p>
                  <p>
                    Payday loans feel like a lifeline. But borrowing $500 today
                    can mean repaying $575 in two weeks. That small fee is
                    actually a 391% annual interest rate. Most people cannot
                    repay in time and end up rolling the loan over repeatedly.
                  </p>
                  <p>
                    Buy Now Pay Later apps like Affirm, Klarna, and Afterpay can
                    create the same trap. Splitting a purchase into four easy
                    payments feels harmless until you have four different
                    payment schedules across four different apps and miss one.
                    Late fees pile up and your credit score can take the hit.
                  </p>
                  <p className="font-extrabold text-[#f6c619]">
                    The simple rule: if you cannot pay for it in full today, you
                    cannot afford it today.
                  </p>
                  <p>
                    <strong className="text-white">
                      Anyone promising instant credit repair:
                    </strong>{" "}
                    credit cannot be built overnight through any legitimate
                    means.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  The Timeline You Can Realistically Expect
                </h2>
                <div className="mt-5 overflow-hidden rounded-[24px] border border-[#dcefe1]">
                  {timeline.map(([milestone, timeframe]) => (
                    <div
                      key={milestone}
                      className="flex flex-col gap-1 border-b border-[#dcefe1] px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="font-bold text-[#102717]">{milestone}</span>
                      <span className="text-[#2e7d32]">{timeframe}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="font-heading text-3xl text-[#102717]">
                  One Final Thing
                </h2>
                <p>
                  You came to this country to build something. Every on-time
                  payment is a brick. Every month you keep your balance low is
                  another brick. Slowly, steadily, you are building something
                  that will open doors: apartments, car loans, business
                  financing, mortgages.
                </p>
                <p className="text-xl font-extrabold text-[#102717]">
                  You did not come this far to be stopped by a number.
                </p>
                <p>Start today. The clock is already ticking in your favor.</p>
              </section>

              <footer className="rounded-[28px] bg-[#f4faf5] px-5 py-6 sm:px-7">
                <p>
                  At SaveRateAfrica, we are committed to giving Africans in the
                  diaspora the financial tools and knowledge they need to thrive,
                  not just survive. From comparing remittance rates to building
                  financial literacy, we are here for every step of your journey.
                </p>
                <Link
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-yellow px-5 text-sm font-extrabold text-brand-navy"
                  href="/"
                >
                  Compare live exchange rates
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </footer>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
