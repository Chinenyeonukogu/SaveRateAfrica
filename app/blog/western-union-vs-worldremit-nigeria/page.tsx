import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Western Union vs WorldRemit for Sending Money to Nigeria",
  description:
    "Compare Western Union and WorldRemit for sending money to Nigeria, including payout methods, speed, pickup requirements, and wallet limits.",
  alternates: {
    canonical:
      "https://www.saverateafrica.com/blog/western-union-vs-worldremit-nigeria"
  }
};

const westernUnionDetails = [
  {
    title: "Direct Bank Deposits",
    body:
      "You can route funds straight to major commercial banks across Nigeria, including GTBank, Access Bank, Zenith, and FirstBank. You will need the recipient's full legal name and 10-digit NUBAN account number."
  },
  {
    title: "Physical Cash Pickup",
    body:
      "Your recipient can walk into thousands of retail agent locations or local bank branches to claim physical cash."
  }
] as const;

const westernUnionFinePrint = [
  {
    title: "The Naira vs FX dance",
    body:
      "Due to shifting Central Bank of Nigeria guidelines, international payouts can fluctuate between local currency and foreign currency channels. Always check the guaranteed payout currency before you send."
  },
  {
    title: "Strict security at pickup",
    body:
      "For physical cash pickup, the recipient usually needs the 10-digit MTCN, sender name, expected amount, and a valid government-issued ID connected to their BVN."
  },
  {
    title: "Speed",
    body:
      "Cash pickups are usually ready in minutes. Bank transfers often land the same business day, but local bank processing can occasionally push delivery into the next day."
  }
] as const;

const worldRemitDetails = [
  {
    title: "Fintech and Mobile Money Wallets",
    body:
      "WorldRemit can send instant deposits directly into popular digital wallets like OPay and Paga."
  },
  {
    title: "Bank Transfer and Cash Pickup",
    body:
      "WorldRemit also supports direct NGN or domiciliary bank routing and selected physical pickup partnerships, including FirstBank branches."
  },
  {
    title: "Airtime Top-up",
    body:
      "You can instantly send prepaid mobile phone credit straight to a Nigerian mobile number with zero added transfer fees."
  }
] as const;

const worldRemitFinePrint = [
  {
    title: "Watch the wallet tiers",
    body:
      "If you send to OPay or Paga, your recipient's account limits matter. Tier 1 fintech accounts can have low daily limits, while upgraded verified accounts can receive more."
  },
  {
    title: "Name matching",
    body:
      "Because the flow is digital, the recipient's registered wallet name should match their official identity documentation to avoid transfer delays."
  },
  {
    title: "Speed",
    body:
      "Mobile wallet drops and airtime top-ups are usually instant. Bank deposits often complete within minutes to a couple of hours."
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

export default function WesternUnionVsWorldRemitNigeriaPage() {
  return (
    <>
      <SiteHeader />

      <main className="bg-[#f4faf5] px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto mb-4 flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <Link
            className="inline-flex items-center text-sm font-bold text-[#0d7a3b] hover:text-[#075c2b]"
            href="/blog"
          >
            &larr; Back to all articles
          </Link>
          <Link
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#0d7a3b]/20 bg-white px-4 text-sm font-extrabold text-[#102717] shadow-sm hover:border-[#0d7a3b]/45"
            href="/blog"
          >
            <X className="h-4 w-4" />
            Exit
          </Link>
        </div>

        <article className="mx-auto max-w-5xl overflow-hidden rounded-[34px] bg-white shadow-float">
          <header className="grid gap-6 bg-[#0d2416] px-6 py-7 text-white sm:px-10 sm:py-9 md:gap-8 lg:min-h-[60vh] lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9ee8c0]">
                Comparisons &middot; 6 min read &middot; SaveRateAfrica
              </p>
              <h1 className="mt-4 max-w-4xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Sending Money to Nigeria: Western Union vs. WorldRemit
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">
                What you actually need to know about payout methods, pickup
                rules, digital wallets, and recipient convenience.
              </p>
              <Link
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f5c84b] px-5 text-sm font-extrabold text-[#102717]"
                href="/"
              >
                Compare rates now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <figure className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#102717] shadow-2xl">
              <Image
                src="/blog/western-union-vs-worldremit-nigeria.svg"
                alt="Split comparison graphic showing Western Union and WorldRemit for Nigeria transfers"
                width={1456}
                height={1040}
                fetchPriority="high"
                priority
                quality={85}
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 45vw, 100vw"
                className="h-[250px] w-full object-cover object-center md:h-[300px] lg:h-[300px] xl:h-[52vh] xl:max-h-[520px]"
              />
            </figure>
          </header>

          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
            <div className="space-y-10 text-[17px] leading-8 text-[#243b2b]">
              <section className="space-y-5">
                <p>
                  If you have family, friends, or business partners in Nigeria,
                  you already know that navigating the remittance landscape can
                  feel like a moving target. Regulations shift, payout methods
                  evolve, and choosing the wrong platform can mean your
                  recipient faces unnecessary headaches.
                </p>
                <p>
                  Two of the biggest heavyweights dominating the global corridor
                  are Western Union and WorldRemit. They both move money from
                  point A to point B, but how they do it and how your recipient
                  actually gets the cash can be completely different.
                </p>
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  1. Western Union: The Cash King and Traditional Heavyweight
                </h2>
                <p className="mt-4">
                  Western Union is the household name of global money transfers.
                  Its biggest superpower in Nigeria is its massive network of
                  physical agent banking locations.
                </p>
                <DetailCards items={westernUnionDetails} />
                <h3 className="mt-7 font-heading text-2xl text-[#0d7a3b]">
                  The fine print you need to know
                </h3>
                <DetailCards items={westernUnionFinePrint} />
              </section>

              <section>
                <h2 className="font-heading text-3xl text-[#102717]">
                  2. WorldRemit: The Agile, Digital-First Contender
                </h2>
                <p className="mt-4">
                  If Western Union is the traditional giant, WorldRemit is the
                  digital challenger built for the smartphone era. It trades a
                  massive physical footprint for deeper integration into
                  Nigeria's growing fintech ecosystem.
                </p>
                <DetailCards items={worldRemitDetails} />
                <h3 className="mt-7 font-heading text-2xl text-[#0d7a3b]">
                  The fine print you need to know
                </h3>
                <DetailCards items={worldRemitFinePrint} />
              </section>

              <section className="rounded-[28px] bg-[#f4faf5] px-5 py-6 sm:px-7">
                <h2 className="font-heading text-3xl text-[#102717]">
                  The Quick Verdict
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[22px] border border-[#dcefe1] bg-white px-5 py-5">
                    <h3 className="font-heading text-2xl text-[#102717]">
                      Choose Western Union if
                    </h3>
                    <p className="mt-3 text-[#334b38]">
                      Your recipient prefers picking up physical currency at a
                      traditional bank branch, or you value an established
                      global network for larger transfers.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-[#dcefe1] bg-white px-5 py-5">
                    <h3 className="font-heading text-2xl text-[#102717]">
                      Choose WorldRemit if
                    </h3>
                    <p className="mt-3 text-[#334b38]">
                      You want to skip bank lines, use instant mobile wallets
                      like OPay or Paga, or send a quick airtime top-up.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] bg-[#0d2416] px-6 py-7 text-white sm:px-8">
                <h2 className="font-heading text-3xl">
                  Compare Before Your Next Transfer
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/78">
                  That is exactly why we built SaveRateAfrica. Real-time rates.
                  Clear fees. No sign-up required. See who pays the most before
                  your next transfer.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f5c84b] px-5 text-sm font-extrabold text-[#102717]"
                    href="/"
                  >
                    Compare rates now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    className="inline-flex min-h-12 items-center rounded-2xl border border-white/20 px-5 text-sm font-extrabold text-white hover:bg-white/10"
                    href="/blog"
                  >
                    Exit article
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
