"use client";

import { useEffect, useMemo, useState, type MutableRefObject } from "react";
import Link from "next/link";

import {
  ArrowUpDown
} from "lucide-react";

import { senderCountries, type SenderCountry } from "@/lib/providers";

interface HomeHeroProps {
  alertsAnchorRef?: MutableRefObject<HTMLDivElement | null>;
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
const flagByCountry: Record<SenderCountry, { alt: string; src: string }> = {
  USA: { alt: "USA flag", src: "/flags/us.svg" },
  UK: { alt: "UK flag", src: "/flags/gb.svg" },
  Canada: { alt: "Canada flag", src: "/flags/ca.svg" }
};

function CountryFlag({ country }: { country: SenderCountry }) {
  const flag = flagByCountry[country];

  return (
    <img
      alt={flag.alt}
      className="mr-1 inline-block h-[12px] w-[16px] rounded-[2px] object-cover align-[-2px]"
      src={flag.src}
    />
  );
}

const brandFontStyle = {
  fontFamily: '"Sora", var(--font-heading), sans-serif'
} as const;
const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
const FALLBACK_BASE_RATE = 159;

const providers = [
  { name: "Afriex", fee: 0.0, offset: 0.997 },
  { name: "Wise", fee: 4.5, offset: 0.995 },
  { name: "Remitly", fee: 3.99, offset: 0.992 },
  { name: "WorldRemit", fee: 5.0, offset: 0.990 },
  { name: "SendWave", fee: 0.0, offset: 0.988 },
  { name: "Western Union", fee: 5.0, offset: 0.985 },
  { name: "MoneyGram", fee: 6.0, offset: 0.983 }
] as const;

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

export function HomeHero({
  alertsAnchorRef,
  amount,
  senderCountry,
  isLoading,
  onAmountChange,
  onSenderCountryChange,
  onCompare
}: HomeHeroProps) {
  const currencyMeta = currencySymbolByCountry[senderCountry];
  const sendAmount = Number.parseFloat(amount || "0") || 0;
  const [baseRate, setBaseRate] = useState<number>(FALLBACK_BASE_RATE);
  const [currentLowerIndex, setCurrentLowerIndex] = useState<number>(providers.length - 1);
  const [fade, setFade] = useState<boolean>(true);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [swapSpin, setSwapSpin] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);

  useEffect(() => {
    let cancelled = false;
    let flashTimeout: ReturnType<typeof setTimeout> | null = null;
    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;

    async function refreshBaseRate() {
      try {
        const response = await fetch(EXCHANGE_RATE_API_URL);
        if (!response.ok) {
          throw new Error("Rate fetch failed");
        }

        const payload = await response.json();
        const rate = Number(payload?.rates?.NGN);

        if (!Number.isFinite(rate)) {
          throw new Error("Invalid NGN rate");
        }

        if (!cancelled) {
          setFade(false);
          setSwapSpin((prev) => !prev);
          setFlashActive(true);
          setSecondsRemaining(30);
          setBaseRate(rate);
          fadeTimeout = setTimeout(() => setFade(true), 100);
          flashTimeout = setTimeout(() => setFlashActive(false), 800);
        }
      } catch {
        if (!cancelled) {
          setFade(false);
          setSwapSpin((prev) => !prev);
          setFlashActive(true);
          setSecondsRemaining(30);
          setBaseRate(FALLBACK_BASE_RATE);
          fadeTimeout = setTimeout(() => setFade(true), 100);
          flashTimeout = setTimeout(() => setFlashActive(false), 800);
        }
      }
    }

    refreshBaseRate();
    const interval = setInterval(() => {
      refreshBaseRate();
      setCurrentLowerIndex((prev) => {
        const next = prev - 1;
        return next < 1 ? providers.length - 1 : next;
      });
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      if (flashTimeout) clearTimeout(flashTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const providerResults = useMemo(() => {
    const amount = Math.max(0, sendAmount);

    return providers
      .map((provider) => {
        const providerRate = baseRate * provider.offset;
        const recipientReceives = Math.max(0, amount - provider.fee) * providerRate;

        return {
          ...provider,
          providerRate,
          recipientReceives
        };
      })
      .sort((first, second) => second.recipientReceives - first.recipientReceives);
  }, [sendAmount, baseRate]);

  const topProvider = providerResults[0] ?? providers[0];
  const lowerProvider = providerResults[currentLowerIndex] ?? providers[providers.length - 1];
  const savings = Math.max(0, topProvider.recipientReceives - lowerProvider.recipientReceives);

  return (
    <section
      id="home"
      className="relative w-full max-w-[100vw] overflow-hidden overflow-x-hidden bg-[linear-gradient(135deg,#1a3a1a_0%,#2e7d32_50%,#0d2416_100%)]"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1200px] overflow-x-hidden px-5 pb-8 pt-4 text-white min-[600px]:px-7 min-[600px]:pb-9 lg:px-6 lg:pb-10">

        <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start lg:gap-x-7">
          <div className="flex min-w-0 flex-col gap-4 overflow-hidden pt-0">
            <div className="inline-flex w-fit items-center rounded-full border border-green-800/60 bg-green-950/40 px-3 py-[5px] text-[9px] font-bold uppercase tracking-[0.6px] text-green-400">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-[#4ade80] animate-hero-live-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              REAL-TIME RATES · COMPARE &amp; SAVE INSTANTLY
            </div>

            <div className="flex flex-col gap-4">
              <h1
                className="max-w-[580px] font-heading text-[23px] font-bold leading-[1.08] tracking-[-0.5px] text-white min-[600px]:text-[31px] lg:text-[36px]"
                style={brandFontStyle}
              >
                Save on fees and send more money from USA, UK, and Canada.
              </h1>

            </div>

            <p className="max-w-[540px] text-[12px] font-bold leading-[1.55] text-white min-[600px]:text-[13px]">
              Real-time rates from 14 trusted providers. No hidden fees. Ranked by
              the exact NGN your recipient receives after all charges.
            </p>

            <div className="flex w-full max-w-full min-w-0 flex-col gap-2 box-border">
              <div className="flex w-full min-w-0 flex-wrap gap-2 box-border">
                {trustPills.map((pill) => (
                  <div
                    key={pill}
                    className="inline-flex min-h-8 w-[calc(50%-4px)] items-center justify-center gap-[6px] rounded-full border border-white/15 bg-white/10 px-[10px] py-[4px] text-[10px] text-white/80 min-[600px]:w-auto"
                  >
                    {pill}
                  </div>
                ))}
              </div>

              <div
                id="rate-alerts"
                ref={alertsAnchorRef}
                className="grid w-full max-w-full grid-cols-1 gap-2 overflow-hidden min-[520px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                  <Link
                    className="group relative min-h-[190px] min-w-0 max-w-full overflow-hidden rounded-[20px] border-2 border-[#4ade80] bg-[#e8f5e2] p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition hover:translate-y-[-4px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                    href="/alerts"
                  >
                    <svg
                      style={{
                        position: "absolute",
                        right: "10px",
                        bottom: "8px",
                        width: "90px",
                        height: "90px",
                        zIndex: 2
                      }}
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <radialGradient id="bellBody" cx="35%" cy="25%" r="70%">
                          <stop offset="0%" stopColor="#fef3c7" />
                          <stop offset="30%" stopColor="#fde68a" />
                          <stop offset="65%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#78350f" />
                        </radialGradient>
                        <radialGradient id="bellShine" cx="30%" cy="20%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#92400e" />
                        </linearGradient>
                        <filter id="bellShadow">
                          <feDropShadow
                            dx="0"
                            dy="4"
                            stdDeviation="4"
                            floodColor="#78350f"
                            floodOpacity="0.4"
                          />
                        </filter>
                      </defs>
                      <ellipse cx="50" cy="95" rx="22" ry="4" fill="rgba(0,0,0,0.2)" />
                      <rect x="46" y="4" width="8" height="14" rx="4" fill="url(#rimGrad)" />
                      <path
                        d="M50 14 C28 14 14 30 14 50 L14 74 Q14 82 22 82 L78 82 Q86 82 86 74 L86 50 C86 30 72 14 50 14Z"
                        fill="url(#bellBody)"
                        filter="url(#bellShadow)"
                      />
                      <path
                        d="M50 14 C28 14 14 30 14 50 L14 74 Q14 82 22 82 L78 82 Q86 82 86 74 L86 50 C86 30 72 14 50 14Z"
                        fill="url(#bellShine)"
                      />
                      <ellipse cx="50" cy="81" rx="36" ry="6" fill="#92400e" />
                      <ellipse cx="50" cy="79" rx="36" ry="6" fill="url(#bellBody)" />
                      <circle cx="50" cy="90" r="6" fill="url(#rimGrad)" />
                      <ellipse
                        cx="37"
                        cy="36"
                        rx="7"
                        ry="11"
                        fill="#fef9c3"
                        opacity="0.3"
                        transform="rotate(-15 37 36)"
                      />
                      <circle cx="72" cy="18" r="10" fill="#ef4444" />
                      <text x="72" y="22" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">
                        1
                      </text>
                    </svg>

                    <div className="relative z-10 max-w-[132px]">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#16a34a]">
                        RATE ALERTS
                      </p>
                      <p className="mt-2 text-[14px] font-extrabold leading-[1.25] text-[#1a2e1a]">
                        Never miss your ideal rate
                      </p>
                      <p className="mt-1 text-[10px] font-medium leading-[1.3] text-[#2d4a35]">
                        We&apos;ll email you when NGN hits your target.
                      </p>
                      <span className="mt-1 inline-flex text-[11px] font-extrabold text-[#2e7d32]">
                        Set Rate Alert &rarr;
                      </span>
                    </div>
                  </Link>

                  <Link
                    className="group relative min-h-[96px] min-w-0 max-w-full overflow-hidden rounded-[12px] border-2 border-[#4ade80] bg-[#e8f5e2] p-3 text-left transition hover:translate-y-[-2px] min-[520px]:min-h-[108px]"
                    href="/credit-cards"
                  >
                    <div className="relative z-10 max-w-[150px] min-w-0">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#166534]">
                        BUILD CREDIT
                      </p>
                      <p className="mt-1 text-[12px] font-extrabold leading-[1.2] text-[#111111]">
                        Build credit while you send money
                      </p>
                      <p className="mt-1 text-[10px] font-medium leading-[1.3] text-[#374151]">
                        Immigrant-friendly credit cards
                      </p>
                      <span className="mt-1 inline-flex text-[11px] font-extrabold text-[#166534]">
                        Explore Credit &rarr;
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 h-10 w-14 rotate-[-8deg] overflow-hidden rounded-[6px] bg-[linear-gradient(135deg,#fde68a,#d97706)]">
                      <div className="absolute inset-[7px] rounded-[4px] border border-[rgba(180,83,9,0.3)]" />
                      <div className="absolute left-0 top-1/2 h-px w-full bg-[rgba(180,83,9,0.3)]" />
                      <div className="absolute left-1/3 top-0 h-full w-px bg-[rgba(180,83,9,0.3)]" />
                      <div className="absolute left-2/3 top-0 h-full w-px bg-[rgba(180,83,9,0.3)]" />
                    </div>
                  </Link>
              </div>
            </div>
          </div>

          <div className="w-full min-w-0 max-w-full overflow-hidden lg:flex lg:flex-col">
            <div className="flex w-full max-w-full flex-col overflow-hidden rounded-[14px] bg-white p-3 text-[#1a2e1a] shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[1.8px] text-[#2e7d32]">
                  COMPARE NOW
                </p>
                <h2 className="mb-2 text-[15px] font-semibold text-[#1a2e1a]">
                  Check your top payout
                </h2>

                <div className="flex h-full flex-col gap-2">
                  <label className="block">
                    <span className="mb-[6px] block text-[10px] font-medium uppercase tracking-[0.5px] text-[#8a9a8a]">
                      Send amount
                    </span>
                    <div className="overflow-hidden rounded-[8px] border-[1.5px] border-[#e0ede2]">
                      <div className="flex items-center">
                        <span className="border-r-[1.5px] border-[#e0ede2] bg-[#f4faf5] px-3 py-2 text-[11px] font-semibold text-[#2e4a2e]">
                          {currencyMeta.code}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center px-3 py-2">
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

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {quickAmounts.map((quickAmount) => {
                        const isActive = amount === String(quickAmount);

                        return (
                          <button
                            key={quickAmount}
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
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
                    <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-2">
                      {senderCountries.map((country) => {
                        const active = country.code === senderCountry;

                        return (
                          <button
                            key={country.code}
                            className={`rounded-[8px] border-[1.5px] px-2 py-1.5 text-[10px] font-semibold transition ${
                              active
                                ? "border-[#2e7d32] bg-[#2e7d32] text-white"
                                : "border-[#e0ede2] text-[#2e4a2e] hover:border-[#2e7d32]/50"
                            }`}
                            type="button"
                            onClick={() => onSenderCountryChange(country.code)}
                          >
                            <CountryFlag country={country.code} />
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
                    <div className="flex items-center justify-between rounded-[8px] border-[1.5px] border-[#e0ede2] px-3 py-2">
                      <span className="text-[12px] font-semibold text-[#1a2e1a]">
                        <img
                          alt="Nigeria flag"
                          className="mr-2 inline-block h-[12px] w-[16px] rounded-[2px] object-cover align-[-2px]"
                          src="/flags/ng.svg"
                        />
                        Nigeria
                      </span>
                      <span className="text-[12px] font-medium text-[#2e7d32]">
                        Locked corridor
                      </span>
                    </div>
                  </div>

                  <button
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-brand-yellow px-4 py-2.5 text-[12px] font-bold text-[#1a1a1a] transition hover:translate-y-[-1px] hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    onClick={onCompare}
                  >
                    {isLoading ? "Refreshing rates..." : "Compare Rates Now →"}
                  </button>

                  <div className="flex flex-1 flex-col rounded-[10px] border border-[#c8e6c9] bg-[#f4faf5] p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#2e7d32]">
                      💰 SAVINGS CALCULATOR
                    </p>
                    <h3 className="mt-1 text-[13px] font-bold text-[#1a2e1a]">
                      Compare real payouts and save up to ₦{formatCalculatedNgn(savings)}
                    </h3>
                    <p className="mt-1 text-[10px] text-[#7a9a7a]">
                      Based on ${sendAmount.toLocaleString("en-US")} · {topProvider.name} vs {lowerProvider.name}
                    </p>

                    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] items-center gap-1.5 overflow-hidden">
                      <div className={`rounded-[8px] border border-[#c8e6c9] bg-[#e8f5e9] px-2 py-2 transition-all duration-300 ${flashActive ? "border-[#2e7d32] shadow-[0_0_10px_rgba(46,125,50,0.25)]" : ""}`}>
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.8px] text-[#5a8a5a]">
                          Top payout
                        </p>
                        <p className="sname text-[13px] font-bold leading-[1.3] text-[#1a2e1a] whitespace-normal break-words">
                          {topProvider.name}
                        </p>
                        <p className={`mt-1 text-[13px] font-semibold text-[#2e7d32] transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                          ₦{formatCalculatedNgn(topProvider.recipientReceives)}
                        </p>
                      </div>

                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2e7d32] text-white"
                        style={{
                          transform: swapSpin ? "rotate(360deg)" : "rotate(0deg)",
                          transition: "transform 0.6s ease"
                        }}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </div>

                      <div className={`rounded-[8px] border border-[#e8e8e8] bg-[#fafafa] px-2 py-2 transition-all duration-300 ${flashActive ? "border-[#2e7d32] shadow-[0_0_10px_rgba(46,125,50,0.25)]" : ""}`}>
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.8px] text-[#9a8a7a]">
                          Other provider
                        </p>
                        <p className="sname text-[13px] font-bold leading-[1.3] text-[#1a2e1a] whitespace-normal break-words">
                          {lowerProvider.name}
                        </p>
                        <p className={`mt-1 text-[13px] font-semibold text-[#888888] transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                          ₦{formatCalculatedNgn(lowerProvider.recipientReceives)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3 rounded-[6px] bg-[#e0f2e1] px-3 py-1.5">
                      <span className="text-[11px] text-[#2e4a2e]">Your savings</span>
                      <span className={`text-[13px] font-bold text-[#1b5e20] transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                        + ₦{formatCalculatedNgn(savings)}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f4faf5]">
                      <div
                        className="h-full rounded-full bg-[#2e7d32] transition-[width] duration-1000 ease-linear"
                        style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
