import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "MoneyGram vs Flutterwave Send for Sending Money to Nigeria",
  description:
    "Compare MoneyGram and Flutterwave Send for sending money to Nigeria, including bank deposits, cash pickup, digital wallets, fees, speed, and exchange rates.",
  alternates: {
    canonical:
      "https://www.saverateafrica.com/blog/moneygram-vs-flutterwave-send-nigeria"
  }
};

const moneyGramMethods = [
  {
    title: "Bank deposits",
    body:
      "Money can be sent directly to many Nigerian bank accounts, including major banks such as Access Bank, GTBank, Zenith Bank, UBA, and others."
  },
  {
    title: "Cash pickup",
    body:
      "Recipients can visit supported partner locations or bank branches to collect physical cash."
  }
] as const;

const moneyGramNotes = [
  {
    title: "Best when cash is needed",
    body:
      "MoneyGram is a strong choice when your recipient needs cash in hand, especially if they prefer using a recognized global transfer brand."
  },
  {
    title: "Pickup requirements",
    body:
      "Cash pickup usually comes with strict requirements. The recipient may need the correct reference number, the sender's legal name, and a valid government-issued ID."
  },
  {
    title: "Fees and exchange rate markup",
    body:
      "MoneyGram's fees may look low at first, but the exchange rate can include a markup. That can reduce the final amount your recipient receives."
  },
  {
    title: "Speed",
    body:
      "In many cases, transfers are available within minutes, making MoneyGram useful for urgent situations."
  }
] as const;

const flutterwaveMethods = [
  {
    title: "Instant bank transfers",
    body:
      "Money can be sent directly to Nigerian bank accounts with a fast, digital-first experience."
  },
  {
    title: "Digital wallet options",
    body:
      "In some cases, recipients may receive funds through supported fintech wallets or mobile money platforms."
  }
] as const;

const flutterwaveNotes = [
  {
    title: "No cash pickup",
    body:
      "Flutterwave Send does not offer physical cash pickup through agent locations. If your recipient wants cash, they would need to withdraw it after receiving the transfer."
  },
  {
    title: "Built around African payment networks",
    body:
      "Because Flutterwave is deeply connected to African payment networks, it may offer competitive exchange rates and lower hidden costs than some traditional providers."
  },
  {
    title: "Fast digital delivery",
    body:
      "Transfers are usually fast and convenient, especially for recipients who already use Nigerian bank accounts or digital wallets."
  }
] as const;

function DetailCards({
  items
}: {
  items: readonly { title: string; body: string }[];
}) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-[22px] border border-[#dcefe1] bg-[#f8fcf8] px-5 py-4"
        >
          <h3 className="font-heading text-xl text-[#102717]">{item.title}</h3>
          <p className="mt-2 text-[15px] leading-7 text-[#334b38]">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function MoneyGramVsFlutterwaveSendNigeriaPage() {
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
                Comparisons &middot; 5 min read &middot; SaveRateAfrica
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Sending Money to Nigeria: MoneyGram vs. Flutterwave Send
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">
                The honest breakdown of cash pickup, digital transfers, fees,
                speed, and exchange-rate value.
              </p>
              <Link
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f5c84b] px-5 text-sm font-extrabold text-[#102717]"
                href="/"
              >
                Compare rates now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <figure className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-2xl">
              <Image
                src="/blog/moneygram-flutterwave-send.png"
                alt="Split comparison graphic showing MoneyGram and Flutterwave Send for Nigeria transfers"
                width={1536}
                height={1024}
                fetchPriority="high"
                priority
                quality={85}
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 45vw, 100vw"
                className="h-[250px] w-full object-contain object-center p-4 sm:h-[320px] md:h-[360px] lg:h-[420px] xl:h-[52vh] xl:max-h-[540px]"
              />
            </figure>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
            <div className="space-y-10 text-[17px] leading-8 text-[#243b2b]">
              <section className="space-y-5">
                <p>
                  When sending money to Nigeria, choosing the right platform can
                  make a big difference in how much your recipient actually
                  receives.
                </p>
                <p>
                  Two popular options are MoneyGram and Flutterwave Send. Both
                  are reliable, but they serve different needs. MoneyGram is a
                  long-established global money transfer company with cash
                  pickup options, while Flutterwave Send is a modern digital
                  platform built with Africa in mind.
                </p>
                <p className="text-xl font-extrabold text-[#102717]">
                  Here&apos;s the honest breakdown.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  MoneyGram: Best for Cash Pickup and Global Trust
                </h2>
                <p className="mt-4">
                  MoneyGram has been around for years and is widely recognized
                  across the world. Its biggest advantage is flexibility. You
                  can send money digitally, and your recipient in Nigeria may be
                  able to receive it through a bank deposit or cash pickup at a
                  partner location.
                </p>
                <h3 className="mt-7 font-heading text-2xl text-[#0d7a3b]">
                  How recipients can receive money in Nigeria
                </h3>
                <DetailCards items={moneyGramMethods} />
                <h3 className="mt-7 font-heading text-2xl text-[#0d7a3b]">
                  What to keep in mind
                </h3>
                <DetailCards items={moneyGramNotes} />
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  Flutterwave Send: Best for Fast Digital Transfers
                </h2>
                <p className="mt-4">
                  Flutterwave Send is designed for people who want a simple,
                  fast, and fully digital way to send money to Africa. It is
                  built by Flutterwave, one of Africa&apos;s leading fintech
                  companies, and focuses heavily on smooth online transfers.
                </p>
                <h3 className="mt-7 font-heading text-2xl text-[#0d7a3b]">
                  How recipients can receive money in Nigeria
                </h3>
                <DetailCards items={flutterwaveMethods} />
                <h3 className="mt-7 font-heading text-2xl text-[#0d7a3b]">
                  What to keep in mind
                </h3>
                <DetailCards items={flutterwaveNotes} />
              </section>

              <section className="rounded-[28px] bg-[#f4faf5] px-5 py-6 sm:px-7">
                <h2 className="font-heading text-3xl text-[#102717]">
                  So, Which One Should You Choose?
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-[#dcefe1] bg-white px-5 py-5">
                    <h3 className="font-heading text-2xl text-[#102717]">
                      Choose MoneyGram if
                    </h3>
                    <p className="mt-3 text-[#334b38]">
                      Your recipient needs cash pickup, prefers a well-known
                      global brand, or does not rely heavily on digital banking.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#dcefe1] bg-white px-5 py-5">
                    <h3 className="font-heading text-2xl text-[#102717]">
                      Choose Flutterwave Send if
                    </h3>
                    <p className="mt-3 text-[#334b38]">
                      You want a fast online experience, direct deposit to a
                      Nigerian bank account or wallet, and a competitive
                      exchange rate.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] bg-[#0d2416] px-6 py-7 text-white sm:px-8">
                <h2 className="font-heading text-3xl">
                  The Smartest Move: Compare Before You Send
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/78">
                  Exchange rates change all the time. The provider that gives
                  the best value today may not be the best tomorrow. SaveRateAfrica
                  helps you compare money transfer rates in real time before you
                  send. No guessing. No hidden surprises. No sign-up required.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f5c84b] px-5 text-sm font-extrabold text-[#102717]"
                    href="/"
                  >
                    Compare rates now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
