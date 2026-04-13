import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Our Story – SaveRateAfrica",
  description:
    "Learn why SaveRateAfrica was built and how we help Nigerians abroad compare remittance providers and keep more money in every transfer.",
  alternates: {
    canonical: "/about"
  },
  openGraph: {
    title: "Our Story – SaveRateAfrica",
    description:
      "Built to help Nigerians in the diaspora compare remittance rates with more clarity, transparency, and confidence.",
    url: "https://www.saverateafrica.com/about"
  }
};

const storyParagraphs = [
  <>
    SaveRateAfrica was born from a simple belief: your hard work deserves the
    best exchange rate possible. With over{" "}
    <strong className="font-bold text-[#102717]">$21 billion</strong> sent home
    annually by Nigerians in the US, UK, and Canada, too much is still lost to
    hidden fees and outdated rates.
  </>,
  <>
    We built a real-time comparison engine that tracks{" "}
    <strong className="font-bold text-[#102717]">14+ providers</strong>{" "}every 5
    minutes, giving you the transparency to ensure every extra Naira reaches
    your loved ones. We don&apos;t move your money; we just make sure your money
    moves further.
  </>,
  "What started as a tool to solve my own frustration with inconsistent rates has grown into a platform built for all Nigerians in the diaspora."
] as const;

const trustItems = [
  "Rankings are based purely on how much the recipient actually receives after all fees not headline rates.",
  "Rates are updated every 5 minutes across 14+ trusted providers.",
  "SaveRateAfrica is focused on transparency and real value for the diaspora community."
] as const;

const commitmentItems = [
  <>
    We respond to enquiries within 24 hours via{" "}
    <a
      className="font-semibold text-[#2e7d32] underline decoration-[#2e7d32]/30 underline-offset-2 hover:text-[#1b5e20]"
      href="mailto:partners@saverateafrica.com"
    >
      partners@saverateafrica.com
    </a>
  </>,
  "We're constantly improving the platform based on feedback from the diaspora community."
] as const;

const largeSectionClassName =
  "rounded-[16px] px-5 py-6 min-[600px]:p-8 lg:px-10 lg:py-12";
const standardSectionClassName =
  "rounded-[16px] px-5 py-6 min-[600px]:p-8 lg:p-10";
const bodyTextClassName = "text-[16px] leading-[1.95] text-[#1f3523]";

export default function AboutPage() {
  return (
    <>
      <SiteHeader showAnnouncementBar />

      <main className="px-4 pb-32 pt-6 min-[600px]:px-6 lg:px-8 lg:pb-16">
        <div className="mx-auto max-w-[1100px] space-y-6 pb-10">
          <section
            className={`${largeSectionClassName} bg-[linear-gradient(140deg,#1b5e20_0%,#2e7d32_35%,#1a3a22_70%,#0d2010_100%)] text-white`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[2px] text-[#a8e6b8]">
              OUR STORY
            </p>
            <h1 className="mt-4 max-w-[640px] font-heading text-[28px] font-extrabold leading-[1.15] text-white min-[600px]:text-[32px] lg:text-[36px]">
              Helping Nigerians Abroad Send More Money Home
            </h1>
            <p className="mt-4 max-w-[520px] text-[16px] leading-[1.7] text-[rgba(255,255,255,0.88)]">
              Built by a Nigerian in the diaspora who believes your hard work
              deserves a better rate.
            </p>
          </section>

          <section className={`${largeSectionClassName} bg-white`}>
            <h2 className="mb-5 font-heading text-[26px] font-bold text-[#1a2e1a]">
              Our Story
            </h2>
            <div className="max-w-[720px] space-y-5">
              {storyParagraphs.map((paragraph, index) => (
                <p key={index} className={bodyTextClassName}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <section className={`${largeSectionClassName} bg-[#f4faf5]`}>
            <div className="grid items-center gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
              <div className="mx-auto w-full max-w-[240px] text-center lg:mx-0 lg:max-w-none lg:text-left">
                <div className="overflow-hidden rounded-[14px] shadow-[0_8px_28px_rgba(0,0,0,0.12)]">
                  <Image
                    alt="Founder portrait placeholder for Chinenye onukogu"
                    className="h-auto w-full object-cover"
                    height={720}
                    sizes="(max-width: 1023px) 240px, 280px"
                    src="/founder-chinenye-onukogu.png"
                    width={560}
                  />
                </div>
                <p className="mt-3 text-[16px] font-bold text-[#1a2e1a]">
                  Chinenye Onukogu
                </p>
                <p className="text-[13px] text-[#5a7a5a]">Founder, SaveRateAfrica</p>
                <p className="mt-1 text-[12px] text-[#7a9a7a]">
                  United States
                </p>
              </div>

              <div>
                <h2 className="mb-4 font-heading text-[24px] font-bold text-[#1a2e1a]">
                  Meet the Founder
                </h2>
                <p className={`${bodyTextClassName} max-w-[720px]`}>
                  I built <strong className="font-bold">SaveRateAfrica</strong>{" "}
                  to empower fellow Nigerians in the diaspora with clear,
                  real-time information on the best remittance options. With a
                  background in Information Technology and current
                  specialization in IT Product Management, my goal is to make
                  sending money home as cost-effective as possible.
                </p>
              </div>
            </div>
          </section>

          <section className={`${standardSectionClassName} bg-white`}>
            <h2 className="mb-[14px] font-heading text-[24px] font-bold text-[#1a2e1a]">
              Our Mission
            </h2>
            <p className={`${bodyTextClassName} max-w-[720px]`}>
              To help the Nigerian diaspora maximize every dollar, pound, and
              Canadian dollar sent home by providing honest, independent
              comparisons and useful tools like rate alerts and savings
              calculators.
            </p>
          </section>

          <section className={`${standardSectionClassName} bg-[#1a2e1a] text-white`}>
            <h2 className="mb-6 font-heading text-[24px] font-bold text-white">
              Why You Can Trust Us
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2e7d32] text-white">
                    <Check className="h-[13px] w-[13px]" strokeWidth={3} />
                  </span>
                  <p className="text-[14px] leading-[1.6] text-white/85">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`${standardSectionClassName} bg-[#f4faf5]`}>
            <h2 className="mb-[14px] font-heading text-[24px] font-bold text-[#1a2e1a]">
              Our Commitment
            </h2>
            <ul className="space-y-3">
              {commitmentItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[14px] leading-[1.7] text-[#3a5a3a]"
                >
                  <span aria-hidden="true" className="pt-[1px] text-[18px] leading-none">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${standardSectionClassName} bg-[#2e7d32] text-center`}>
            <h2 className="mx-auto mb-5 max-w-[520px] font-heading text-[24px] font-bold text-white">
              Ready to start saving on your next transfer?
            </h2>
            <Link
              className="inline-block rounded-[8px] bg-[#f6c619] px-8 py-[14px] text-[15px] font-bold text-[#1a1a1a] no-underline hover:translate-y-[-1px] hover:opacity-95"
              href="/#compare-rates"
            >
              Compare Rates Now →
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
