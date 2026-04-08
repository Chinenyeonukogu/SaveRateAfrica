"use client";

import {
  ArrowRight,
  ArrowUpDown,
  BadgePercent,
  ChevronDown,
  ShieldCheck,
  TimerReset,
  WalletCards
} from "lucide-react";

import { senderCountries, type SenderCountry } from "@/lib/providers";

interface HeroSectionProps {
  amount: string;
  senderCountry: SenderCountry;
  isLoading: boolean;
  onAmountChange: (value: string) => void;
  onSenderCountryChange: (value: SenderCountry) => void;
  onCompare: () => void;
}

const quickAmounts = [50, 100, 200, 500, 1000] as const;

const currencySymbolByCountry: Record<
  SenderCountry,
  { code: string; symbol: string }
> = {
  USA: { code: "USD", symbol: "$" },
  UK: { code: "GBP", symbol: "\u00a3" },
  Canada: { code: "CAD", symbol: "CA$" }
};

const brandFontStyle = {
  fontFamily: '"Sora", var(--font-heading), sans-serif'
} as const;
const BEST_RATE = 1380.65;
const WORST_RATE = 1370.98;
const WORST_FEE = 8.99;

function formatCalculatedNgn(value: number) {
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function HeroSection({
  amount,
  senderCountry,
  isLoading,
  onAmountChange,
  onSenderCountryChange,
  onCompare
}: HeroSectionProps) {
  const currencyMeta = currencySymbolByCountry[senderCountry];
  const sendAmount = Number.parseFloat(amount || "0") || 0;
  const bestPayout = sendAmount * BEST_RATE;
  const worstPayout = (sendAmount - WORST_FEE) * WORST_RATE;
  const savings = bestPayout - worstPayout;

  return (
    <section
      id="home"
      className="overflow-hidden px-4 pb-5 pt-5 min-[600px]:px-6 min-[600px]:pb-7 min-[600px]:pt-7 lg:px-10 lg:pb-10 lg:pt-10"
    >
      <div className="mx-auto max-w-[1200px] rounded-[32px] bg-hero-mesh px-5 py-8 text-white shadow-glow min-[600px]:px-8 min-[600px]:py-10 lg:px-12 lg:py-14">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-12 top-14 h-32 w-32 rounded-full bg-brand-yellow/30 blur-3xl" />
            <div className="absolute right-6 top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-brand-green/20 blur-3xl" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)] bg-[length:18px_18px]" />
          </div>

          <div className="relative grid items-center gap-8 min-[600px]:gap-[36px] lg:grid-cols-[1.02fr_0.98fr]">
            <div className="pt-0">
              <div className="mb-[14px] inline-flex items-center rounded-full border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.12)] px-4 py-[6px] text-[11px] font-medium uppercase tracking-[1.2px] text-white">
                <span className="mr-[6px] text-[9px] leading-none text-[#4cdf6e] animate-hero-live-pulse">
                  ●
                </span>
                Real-Time Rates · Compare &amp; Save Instantly
              </div>

              <div className="space-y-4">
                <h1
                  className="mt-0 max-w-3xl font-heading text-[34px] leading-[0.95] min-[600px]:text-5xl lg:text-6xl"
                  style={brandFontStyle}
                >
                  Send Money to Nigeria. Compare and save instantly.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-white/80 min-[600px]:text-lg min-[600px]:leading-7">
                  Real-time rates from 10+ providers. No hidden fees. Trusted by
                  Nigerians in USA, UK and Canada.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[12px] text-white/90 min-[600px]:text-sm">
                <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 min-[600px]:min-h-12">
                  <ShieldCheck className="h-4 w-4" />
                  256-bit secure
                </div>
                <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 min-[600px]:min-h-12">
                  <TimerReset className="h-4 w-4" />
                  Real-time data
                </div>
                <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 min-[600px]:min-h-12">
                  <WalletCards className="h-4 w-4" />
                  No sign-up needed
                </div>
                <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 min-[600px]:min-h-12">
                  <BadgePercent className="h-4 w-4" />
                  <span>
                    99% Currency Rate Accuracy
                    <span className="ml-1 text-white/70">
                      Verified against provider rates daily
                    </span>
                  </span>
                </div>
              </div>
            </div>

              <div className="flex w-full self-center flex-col items-center gap-3 lg:max-w-[440px] lg:justify-self-end">
              <div className="w-full rounded-[28px] border border-white/10 bg-white px-[18px] py-4 text-brand-navy shadow-float">
                <div className="mb-[10px] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                      Compare now
                    </p>
                    <p className="mt-[10px] font-heading text-base">
                      Check your best NGN payout
                    </p>
                  </div>
                  <div className="rounded-2xl bg-brand-light px-3 py-1.5 font-mono text-xs font-semibold text-brand-navy">
                    Live pulse
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block">
                    <span className="text-sm font-medium text-brand-navy/70">
                      Send amount
                    </span>
                    <div className="mt-1 flex items-center rounded-[18px] border border-brand-navy/10 bg-brand-light px-[10px] py-[7px]">
                      <span className="pr-2 font-mono text-[12px] font-semibold text-brand-navy/70 min-[600px]:text-base">
                        {currencyMeta.code} {currencyMeta.symbol}
                      </span>
                      <input
                        className="w-full bg-transparent text-[18px] font-heading text-brand-navy outline-none placeholder:text-brand-navy/40"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="Enter amount"
                        type="text"
                        value={amount}
                        onBlur={() => {
                          const normalizedAmount = Math.max(
                            Number.parseInt(amount || "500", 10) || 500,
                            1
                          );
                          onAmountChange(String(normalizedAmount));
                        }}
                        onChange={(event) =>
                          onAmountChange(event.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>

                    <div className="mb-[10px] mt-[6px] flex flex-wrap gap-[5px]">
                      {quickAmounts.map((quickAmount) => {
                        const isActive = amount === String(quickAmount);

                        return (
                          <button
                            key={quickAmount}
                            className={`rounded-full px-[10px] py-[5px] text-[11px] font-semibold transition ${
                              isActive
                                ? "bg-brand-green text-white shadow-glow"
                                : "bg-brand-light text-brand-navy hover:bg-brand-navy hover:text-white"
                            }`}
                            type="button"
                            onClick={() => onAmountChange(String(quickAmount))}
                          >
                            {currencyMeta.symbol}
                            {quickAmount.toLocaleString("en-US")}
                          </button>
                        );
                      })}
                    </div>
                  </label>

                  <div className="mb-2">
                    <p className="text-sm font-medium text-brand-navy/70">
                      Sender country
                    </p>
                    <div className="mt-1 grid grid-cols-3 gap-[6px]">
                      {senderCountries.map((country) => {
                        const active = country.code === senderCountry;

                        return (
                          <button
                            key={country.code}
                            className={`rounded-[18px] border px-[8px] py-[7px] text-[11px] font-semibold transition ${
                              active
                                ? "border-brand-green bg-brand-green text-white shadow-glow"
                                : "border-brand-navy/10 bg-brand-light text-brand-navy hover:border-brand-green/30"
                            }`}
                            type="button"
                            onClick={() => onSenderCountryChange(country.code)}
                          >
                            {country.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-[10px] rounded-[18px] border border-brand-navy/10 bg-brand-light px-3 py-2">
                    <p className="text-[12px] font-medium text-brand-navy/70">
                      Recipient country
                    </p>
                    <div className="mt-1 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[12px]">
                      <span className="font-semibold text-brand-navy">Nigeria</span>
                      <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                        Locked corridor
                      </span>
                    </div>
                  </div>

                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[18px] bg-brand-yellow px-3 py-3 text-[13px] font-bold text-[#1a1a1a] transition hover:translate-y-[-1px] hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    onClick={onCompare}
                  >
                    {isLoading ? "Refreshing rates..." : "Compare Rates Now"}
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="mt-[10px] border-t-[1.5px] border-[#e8f5e9] pt-[10px]">
                    <div className="mb-[3px] flex items-center gap-2 text-[9px] font-bold uppercase tracking-[1.5px] text-[#2e7d32]">
                      <span aria-hidden="true">💰</span>
                      <span>Savings Calculator</span>
                    </div>

                    <h3 className="mb-[3px] text-[16px] font-bold text-[#1a2e1a]">
                      You could save up to ₦{formatCalculatedNgn(savings)}
                    </h3>

                    <p className="mb-2 text-[10px] leading-[1.4] text-[#666]">
                      Based on a USD {sendAmount.toLocaleString("en-US")} transfer,
                      Grey Finance currently delivers more than Western Union after
                      fees and spread.
                    </p>

                    <div className="mb-[7px] grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] items-center gap-2">
                      <div className="min-w-0 rounded-[8px] border-[1.5px] border-[#2e7d32] bg-[#f0fbf2] px-[10px] py-[9px]">
                        <p className="mb-[2px] text-[8px] text-[#888]">Best value</p>
                        <p className="mb-[2px] text-[13px] font-bold text-[#1a2e1a]">
                          Grey Finance
                        </p>
                        <p className="text-[11px] font-semibold text-[#2e7d32]">
                          Recipient gets ₦{formatCalculatedNgn(bestPayout)}
                        </p>
                      </div>

                      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#2e7d32] text-white">
                        <ArrowUpDown className="h-3 w-3" />
                      </div>

                      <div className="min-w-0 rounded-[8px] border-[1.5px] border-[#c8e6c9] bg-[#f4faf5] px-[10px] py-[9px]">
                        <p className="mb-[2px] text-[8px] text-[#888]">Less efficient route</p>
                        <p className="mb-[2px] text-[13px] font-bold text-[#1a2e1a]">
                          Western Union
                        </p>
                        <p className="text-[11px] font-semibold text-[#2e7d32]">
                          Recipient gets ₦{formatCalculatedNgn(worstPayout)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-[7px] flex items-center justify-between gap-3 rounded-[8px] bg-[#e8f5e9] px-3 py-2">
                      <span className="text-[11px] font-semibold text-[#2e7d32]">
                        Your savings using SaveRateAfrica
                      </span>
                      <span className="text-[13px] font-bold text-[#1b5e20]">
                        + ₦{formatCalculatedNgn(savings)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                aria-label="Scroll to live comparison table"
                className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-white/30 bg-white/15 text-white animate-hero-scroll-bounce"
                type="button"
                onClick={onCompare}
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
