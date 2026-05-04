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
const appDownloadButtons = [
  {
    href: "/manifest.webmanifest",
    label: "App Store",
    platform: "iOS" as const,
    prefix: "Download on the"
  },
  {
    href: "/manifest.webmanifest",
    label: "Google Play",
    platform: "Android" as const,
    prefix: "Get it on"
  }
] as const;
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

function AppleBadgeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
      <path d="M16.52 12.55c.03 2.3 2.01 3.07 2.03 3.08-.02.06-.31 1.09-1.03 2.15-.62.91-1.27 1.82-2.3 1.84-1 .02-1.33-.6-2.49-.6-1.16 0-1.53.58-2.46.62-1 .04-1.76-1-2.39-1.91-1.29-1.88-2.28-5.29-.95-7.65.66-1.17 1.87-1.91 3.16-1.93.99-.02 1.93.67 2.56.67.62 0 1.78-.83 3-.71.51.02 1.97.21 2.9 1.59-.08.05-1.73 1.01-1.76 2.85Zm-2.06-6.15c.54-.65.89-1.57.79-2.48-.77.03-1.69.52-2.24 1.16-.5.58-.92 1.5-.81 2.38.85.07 1.71-.44 2.26-1.06Z" />
    </svg>
  );
}

function GooglePlayBadgeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path d="M3.5 3.2 13.7 12 3.5 20.8Z" fill="#00d2ff" />
      <path d="M13.7 12 17.2 8.9 21 11.1c1 .56 1 1.24 0 1.8l-3.8 2.2Z" fill="#ffd54f" />
      <path d="M3.5 3.2 17.2 8.9 13.7 12Z" fill="#66bb6a" />
      <path d="M3.5 20.8 13.7 12 17.2 15.1Z" fill="#ef5350" />
    </svg>
  );
}

function HeroStoreBadge({
  href,
  label,
  platform,
  prefix
}: (typeof appDownloadButtons)[number]) {
  const Icon = platform === "iOS" ? AppleBadgeIcon : GooglePlayBadgeIcon;
  const isIOS = platform === "iOS";

  return (
    <a
      className={`inline-flex h-9 items-center gap-2 rounded-[7px] border px-3 py-[5px] text-white ${
        isIOS ? "border-black bg-black" : "border-[#016b4b] bg-[#01875f]"
      }`}
      download
      href={href}
    >
      <Icon />
      <span className="flex flex-col leading-none" style={brandFontStyle}>
        <span className="text-[8px] font-medium tracking-[0.02em] text-white/85">
          {prefix}
        </span>
        <span className="mt-[2px] text-[11px] font-bold">{label}</span>
      </span>
    </a>
  );
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
      className="relative w-full max-w-[100vw] overflow-hidden overflow-x-hidden bg-[linear-gradient(160deg,#2d6a4f_0%,#1b5e3b_40%,#145a32_100%)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(200,255,220,0.25)_0%,transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(134,239,172,0.18)_0%,transparent_50%)]"
      />
      <div className="relative z-10 mx-auto w-full max-w-[1200px] overflow-x-hidden px-5 pb-8 pt-4 text-white min-[600px]:px-7 min-[600px]:pb-9 lg:px-6 lg:pb-10">
        <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-2 min-[760px]:flex-row min-[760px]:items-center min-[760px]:justify-between">
          <div className="text-[11px] font-medium leading-5 text-white/78 min-[600px]:text-[12px]">
            <span>
              ✦ Real-time NGN rates · No hidden fees · Compare 14 providers and
              save on every transfer.{" "}
            </span>
            <button
              className="font-bold text-[#4ade80] underline underline-offset-2 transition hover:text-white"
              type="button"
              onClick={onCompare}
            >
              Compare now →
            </button>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 min-[760px]:justify-end">
            {appDownloadButtons.map((button) => (
              <HeroStoreBadge key={button.platform} {...button} />
            ))}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start lg:gap-x-7">
          <div className="flex min-w-0 flex-col gap-4 overflow-hidden pt-0">
            <div className="inline-flex w-fit items-center rounded-full border border-green-800/60 bg-green-950/40 px-3 py-[5px] text-[9px] font-bold uppercase tracking-[0.6px] text-green-400">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-[#4ade80] animate-hero-live-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              REAL-TIME RATES · COMPARE &amp; SAVE INSTANTLY
            </div>

            <div className="flex flex-col gap-4">
              <h1
                className="max-w-[580px] font-heading text-[25px] font-bold leading-[1.08] tracking-[-0.5px] text-white min-[600px]:text-[34px] lg:text-[40px]"
                style={brandFontStyle}
              >
                Real-time rates to <span className="text-[#4ade80]">Nigeria</span> compare remittance providers, save on fees and send more money from USA, UK, and Canada.
              </h1>

            </div>

            <p className="max-w-[540px] text-[12px] leading-[1.55] text-gray-400 min-[600px]:text-[13px]">
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
                    className="group relative min-h-[190px] min-w-0 max-w-full overflow-hidden rounded-[20px] border-2 border-[rgba(74,222,128,0.4)] bg-[linear-gradient(145deg,#ffffff_0%,#f0fff4_100%)] p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition hover:translate-y-[-4px] hover:shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
                    href="/alerts"
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "-20px",
                        bottom: "-20px",
                        width: "180px",
                        height: "180px",
                        background:
                          "radial-gradient(circle, rgba(74,222,128,0.2) 0%, transparent 70%)",
                        borderRadius: "50%",
                        pointerEvents: "none"
                      }}
                    />
                    <img
                      alt="rate alert bell"
                      src="/images/alarm.png"
                      style={{
                        position: "absolute",
                        right: "-14px",
                        bottom: "-14px",
                        width: "155px",
                        height: "155px",
                        objectFit: "contain",
                        filter:
                          "drop-shadow(0 8px 20px rgba(180,83,9,0.35)) drop-shadow(0 0 30px rgba(245,158,11,0.25))",
                        animation: "float 3.5s ease-in-out infinite",
                        zIndex: 2
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        right: "14px",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "900",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 14px rgba(239,68,68,0.6)",
                        zIndex: 5,
                        animation: "pulse 1.8s ease-in-out infinite"
                      }}
                    >
                      1
                    </div>

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
