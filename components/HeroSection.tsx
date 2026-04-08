"use client";

import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
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
const trustPills = [
  "\ud83d\udd12 256-bit secure",
  "\u23f1 Real-time data",
  "\u2713 No sign-up needed",
  "\u2605 99% rate accuracy"
] as const;

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
      className="overflow-hidden px-4 pb-6 pt-6 min-[600px]:px-6 min-[600px]:pb-8 min-[600px]:pt-7 lg:px-10 lg:pb-11 lg:pt-12"
    >
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[28px] bg-[linear-gradient(140deg,#1b5e20_0%,#2e7d32_35%,#1a3a22_70%,#0d2010_100%)] px-4 py-6 text-white shadow-glow min-[600px]:px-8 min-[600px]:py-10 lg:px-8 lg:py-11">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 lg:items-start">
          <div className="pt-0">
            <div className="mb-[18px] inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-[14px] py-[5px] text-[10px] font-medium uppercase tracking-[0.8px] text-[#a5d6a7]">
              <span className="mr-[6px] inline-flex h-[6px] w-[6px] rounded-full bg-[#69f0ae] animate-hero-live-pulse" />
              Real-Time Rates · Compare &amp; Save Instantly
            </div>

            <h1
              className="mb-[14px] max-w-[620px] font-heading text-[24px] font-bold leading-[1.18] tracking-[-0.5px] text-white min-[600px]:text-[32px]"
              style={brandFontStyle}
            >
              Send Money to <span className="text-[#69f0ae]">Nigeria.</span> Compare and save instantly.
            </h1>

            <p className="mb-6 max-w-[440px] text-[14px] leading-[1.7] text-white/70">
              Real-time rates from 10+ trusted providers. No hidden fees. Ranked by
              the exact NGN your recipient receives after all charges.
            </p>

            <div className="flex flex-wrap gap-2">
              {trustPills.map((pill) => (
                <div
                  key={pill}
                  className="inline-flex min-h-10 w-[calc(50%-4px)] items-center justify-center gap-[6px] rounded-full border border-white/15 bg-white/10 px-[13px] py-[5px] text-[11px] text-white/80 min-[600px]:w-auto"
                >
                  {pill}
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-3 lg:w-[400px] lg:justify-self-end">
            <div className="w-full rounded-[14px] bg-white p-[22px] text-[#1a2e1a] shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[1.8px] text-[#2e7d32]">
                COMPARE NOW
              </p>
              <h2 className="mb-[18px] text-[17px] font-semibold text-[#1a2e1a]">
                Check your best NGN payout
              </h2>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-[6px] block text-[10px] font-medium uppercase tracking-[0.5px] text-[#8a9a8a]">
                    Send amount
                  </span>
                  <div className="overflow-hidden rounded-[8px] border-[1.5px] border-[#e0ede2]">
                    <div className="flex items-center">
                      <span className="border-r-[1.5px] border-[#e0ede2] bg-[#f4faf5] px-3 py-[9px] text-[11px] font-semibold text-[#2e4a2e]">
                        {currencyMeta.code}
                      </span>
                      <div className="flex min-w-0 flex-1 items-center px-[14px] py-[9px]">
                        <span className="mr-2 text-[18px] font-bold text-[#1a2e1a]">
                          {currencyMeta.symbol}
                        </span>
                        <input
                          className="w-full bg-transparent text-[18px] font-bold text-[#1a2e1a] outline-none placeholder:text-[#1a2e1a]/35"
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
                    </div>
                  </div>

                  <div className="mt-[6px] flex flex-wrap gap-[6px]">
                    {quickAmounts.map((quickAmount) => {
                      const isActive = amount === String(quickAmount);

                      return (
                        <button
                          key={quickAmount}
                          className={`rounded-full border px-3 py-[6px] text-[11px] font-medium transition ${
                            isActive
                              ? "border-[#2e7d32] bg-[#2e7d32] text-white"
                              : "border-[#d4e8d4] bg-white text-[#4a6a4a] hover:border-[#2e7d32] hover:text-[#2e7d32]"
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

                <div>
                  <p className="mb-[6px] text-[10px] font-medium uppercase tracking-[0.5px] text-[#8a9a8a]">
                    Sender country
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {senderCountries.map((country) => {
                      const active = country.code === senderCountry;

                      return (
                        <button
                          key={country.code}
                          className={`rounded-[8px] border-[1.5px] px-3 py-2 text-[11px] font-semibold transition ${
                            active
                              ? "border-[#2e7d32] bg-[#2e7d32] text-white"
                              : "border-[#e0ede2] text-[#2e4a2e] hover:border-[#2e7d32]/50"
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

                <div>
                  <p className="mb-[6px] text-[10px] font-medium uppercase tracking-[0.5px] text-[#8a9a8a]">
                    Recipient country
                  </p>
                  <div className="flex items-center justify-between rounded-[8px] border-[1.5px] border-[#e0ede2] px-[14px] py-[9px]">
                    <span className="text-[12px] font-semibold text-[#1a2e1a]">
                      🇳🇬 Nigeria
                    </span>
                    <span className="text-[12px] font-medium text-[#2e7d32]">
                      Locked corridor
                    </span>
                  </div>
                </div>

                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-brand-yellow px-4 py-[13px] text-[13px] font-bold text-[#1a1a1a] transition hover:translate-y-[-1px] hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  onClick={onCompare}
                >
                  {isLoading ? "Refreshing rates..." : "Compare Rates Now →"}
                </button>

                <div className="rounded-[10px] border border-[#c8e6c9] bg-[#f4faf5] p-[14px]">
                  <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#2e7d32]">
                    💰 SAVINGS CALCULATOR
                  </p>
                  <h3 className="mt-1 text-[15px] font-bold text-[#1a2e1a]">
                    You could save up to ₦{formatCalculatedNgn(savings)}
                  </h3>
                  <p className="mt-1 text-[10px] text-[#7a9a7a]">
                    Based on ${sendAmount.toLocaleString("en-US")} · Grey Finance vs
                    Western Union
                  </p>

                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] items-center gap-2">
                    <div className="rounded-[8px] border border-[#c8e6c9] bg-[#e8f5e9] px-3 py-[10px]">
                      <p className="text-[10px] text-[#5f7a61]">Best value</p>
                      <p className="mt-1 text-[13px] font-bold text-[#1a2e1a]">
                        Grey Finance
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#2e7d32]">
                        ₦{formatCalculatedNgn(bestPayout)}
                      </p>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2e7d32] text-white">
                      <ArrowUpDown className="h-3 w-3" />
                    </div>

                    <div className="rounded-[8px] border border-[#e8e8e8] bg-[#fafafa] px-3 py-[10px]">
                      <p className="text-[10px] text-[#8b8b8b]">Less efficient</p>
                      <p className="mt-1 text-[13px] font-bold text-[#1a2e1a]">
                        Western Union
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#888888]">
                        ₦{formatCalculatedNgn(worstPayout)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 rounded-[6px] bg-[#e0f2e1] px-3 py-2">
                    <span className="text-[11px] text-[#2e4a2e]">Your savings</span>
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
    </section>
  );
}
