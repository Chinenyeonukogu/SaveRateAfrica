"use client";

import {
  ArrowRight,
  BadgePercent,
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

export function HeroSection({
  amount,
  senderCountry,
  isLoading,
  onAmountChange,
  onSenderCountryChange,
  onCompare
}: HeroSectionProps) {
  const currencyMeta = currencySymbolByCountry[senderCountry];

  return (
    <section className="overflow-hidden px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] bg-hero-mesh px-5 py-7 text-white shadow-glow sm:px-8 sm:py-10 lg:px-12 lg:py-14">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-12 top-14 h-32 w-32 rounded-full bg-brand-yellow/30 blur-3xl" />
            <div className="absolute right-6 top-8 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-brand-green/20 blur-3xl" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)] bg-[length:18px_18px]" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/90">
                Real-time rates to Nigeria
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl font-heading text-4xl leading-[0.95] sm:text-5xl lg:text-6xl">
                  Send Money to Nigeria. Compare and save instantly.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  Real-time rates from 10+ providers. No hidden fees. Trusted by
                  Nigerians in USA, UK and Canada.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:max-w-xl">
                <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Providers
                  </p>
                  <p className="mt-2 text-2xl font-heading">10+</p>
                </div>
                <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Refresh
                  </p>
                  <p className="mt-2 text-2xl font-heading">5 min</p>
                </div>
                <div className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Trust
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white sm:text-base">
                    Trusted by Nigerians in USA, UK &amp; Canada
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-white/90">
                <div className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4">
                  <ShieldCheck className="h-4 w-4" />
                  256-bit secure
                </div>
                <div className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4">
                  <TimerReset className="h-4 w-4" />
                  Real-time data
                </div>
                <div className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4">
                  <WalletCards className="h-4 w-4" />
                  No sign-up needed
                </div>
                <div className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4">
                  <BadgePercent className="h-4 w-4" />
                  <span>
                    98% Rate Accuracy
                    <span className="ml-1 text-white/70">
                      Verified against provider rates daily
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white p-5 text-brand-navy shadow-float sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                    Compare now
                  </p>
                  <p className="mt-2 font-heading text-2xl">
                    Check your best NGN payout
                  </p>
                </div>
                <div className="rounded-2xl bg-brand-light px-3 py-2 font-mono text-xs font-semibold text-brand-navy">
                  Live pulse
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-brand-navy/70">
                    Send amount
                  </span>
                  <div className="mt-2 flex min-h-14 items-center rounded-2xl border border-brand-navy/10 bg-brand-light px-4">
                    <span className="pr-3 font-mono text-sm font-semibold text-brand-navy/70 sm:text-base">
                      {currencyMeta.code} {currencyMeta.symbol}
                    </span>
                    <input
                      className="w-full bg-transparent text-2xl font-heading text-brand-navy outline-none placeholder:text-brand-navy/40"
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

                  <div className="mt-3 flex flex-wrap gap-2">
                    {quickAmounts.map((quickAmount) => {
                      const isActive = amount === String(quickAmount);

                      return (
                        <button
                          key={quickAmount}
                          className={`min-h-11 rounded-full px-4 text-sm font-semibold transition ${
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

                <div>
                  <p className="text-sm font-medium text-brand-navy/70">
                    Sender country
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {senderCountries.map((country) => {
                      const active = country.code === senderCountry;

                      return (
                        <button
                          key={country.code}
                          className={`min-h-12 rounded-2xl border px-3 text-sm font-semibold transition ${
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

                <div className="rounded-2xl border border-brand-navy/10 bg-brand-light px-4 py-3">
                  <p className="text-sm font-medium text-brand-navy/70">
                    Recipient country
                  </p>
                  <div className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-white px-4">
                    <span className="font-semibold text-brand-navy">Nigeria</span>
                    <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                      Locked corridor
                    </span>
                  </div>
                </div>

                <button
                  className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-yellow px-5 text-base font-bold text-brand-navy transition hover:translate-y-[-1px] hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
                  type="button"
                  onClick={onCompare}
                >
                  {isLoading ? "Refreshing rates..." : "Compare Rates Now"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
