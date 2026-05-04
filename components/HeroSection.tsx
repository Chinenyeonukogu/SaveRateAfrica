"use client";

import { useEffect, useMemo, useState, type MutableRefObject } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowUpDown,
} from "lucide-react";

import { senderCountries, type SenderCountry } from "@/lib/providers";

interface HeroSectionProps {
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

function RateAlertsBellIllustration() {
  return (
    <svg aria-hidden="true" className="h-16 w-16" viewBox="0 0 96 96">
      <path
        d="M32 72h32c-4-5-5-12-5-24 0-13-8-21-19-21S21 35 21 48c0 12-1 19-5 24h16Z"
        fill="#f5c800"
      />
      <path d="M35 75c2 5 6 8 13 8s11-3 13-8H35Z" fill="#d89f00" />
      <path
        d="M42 25c0-4 2-7 6-7s6 3 6 7"
        fill="none"
        stroke="#d89f00"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <circle cx="71" cy="28" fill="#2e7d32" r="12" />
      <text
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="700"
        textAnchor="middle"
        x="71"
        y="33"
      >
        1
      </text>
    </svg>
  );
}

function SaveRateCreditCardIllustration() {
  return (
    <svg aria-hidden="true" className="h-auto w-20" viewBox="0 0 132 82">
      <rect fill="#1a3a2a" height="72" rx="10" width="120" x="6" y="5" />
      <rect fill="#2e7d32" height="20" rx="4" width="34" x="18" y="35" />
      <circle cx="95" cy="57" fill="#e53935" r="12" />
      <circle cx="110" cy="57" fill="#f5a623" r="12" />
      <rect fill="#69f0ae" height="11" rx="4" width="52" x="18" y="17" />
      <text
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        fontSize="9"
        fontWeight="700"
        x="32"
        y="25"
      >
        SaveRate
      </text>
      <circle cx="25" cy="22" fill="#69f0ae" r="6" />
      <path d="M97 17h20M101 22h16M105 27h12" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function HeroSection({
  alertsAnchorRef,
  amount,
  senderCountry,
  isLoading,
  onAmountChange,
  onSenderCountryChange,
  onCompare
}: HeroSectionProps) {
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
      className="mx-3 my-3 overflow-hidden rounded-[10px] bg-[linear-gradient(140deg,#1b5e20_0%,#2e7d32_35%,#1a3a22_70%,#0d2010_100%)] min-[600px]:mx-4 min-[600px]:my-4 min-[600px]:rounded-[12px] lg:mx-auto lg:my-6 lg:max-w-[1200px] lg:rounded-[16px]"
    >
      <div className="px-5 pb-10 pt-10 text-white min-[600px]:px-7 min-[600px]:pb-10 min-[600px]:pt-10 lg:px-[60px] lg:pb-10 lg:pt-12">
        <div className="flex flex-col items-stretch gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-x-10">
          <div className="flex min-w-0 flex-col gap-8 overflow-hidden pt-0">
            <div className="mb-[18px] inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-[14px] py-[5px] text-[10px] font-medium uppercase tracking-[0.8px] text-[#a5d6a7]">
              <span className="mr-[6px] inline-flex h-[6px] w-[6px] rounded-full bg-[#69f0ae] animate-hero-live-pulse" />
              Real-Time Rates · Compare &amp; Save Instantly
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:grid lg:grid-cols-1">
              <h1
                className="max-w-[620px] font-heading text-[24px] font-bold leading-[1.18] tracking-[-0.5px] text-white min-[600px]:text-[32px]"
                style={brandFontStyle}
              >
                Send Money to <span className="text-[#69f0ae]">Nigeria.</span> Compare and save instantly.
              </h1>

              <div className="flex shrink-0 flex-col gap-[10px] md:items-end lg:hidden">
                {appDownloadButtons.map((button) => (
                  <HeroStoreBadge key={button.platform} {...button} />
                ))}
              </div>
            </div>

            <p className="mb-6 mt-[14px] max-w-[440px] text-[14px] leading-[1.7] text-white/70">
              Real-time rates from 14 trusted providers. No hidden fees. Ranked by
              the exact NGN your recipient receives after all charges.
            </p>

            <div className="flex w-full max-w-full min-w-0 flex-col gap-3 box-border">
              <div className="flex w-full min-w-0 flex-wrap gap-2 box-border">
                {trustPills.map((pill) => (
                  <div
                    key={pill}
                    className="inline-flex min-h-10 w-[calc(50%-4px)] items-center justify-center gap-[6px] rounded-full border border-white/15 bg-white/10 px-[13px] py-[5px] text-[11px] text-white/80 min-[600px]:w-auto"
                  >
                    {pill}
                  </div>
                ))}
              </div>

              <div
                id="rate-alerts"
                ref={alertsAnchorRef}
                className="grid w-full grid-cols-2 gap-3"
              >
                  <Link
                    className="group relative h-[140px] overflow-hidden rounded-[14px] bg-[#e8f5e9] p-4 text-left transition hover:translate-y-[-2px]"
                    href="/alerts"
                  >
                    <div className="absolute bottom-[-4px] right-[-4px] h-16 w-16 overflow-hidden">
                      <Image
                        alt=""
                        className="object-cover object-center"
                        fill
                        sizes="64px"
                        src="/hero/rate-alerts.png"
                      />
                    </div>

                    <div className="relative z-10 max-w-[100px]">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2e7d32]">
                        RATE ALERTS
                      </p>
                      <p className="mt-2 text-[14px] font-extrabold leading-[1.25] text-[#1a2e1a]">
                        Never miss your ideal rate
                      </p>
                      <p className="mt-2 text-[11px] font-medium leading-[1.35] text-[#2d4a35]">
                        We&apos;ll email you when NGN hits your target.
                      </p>
                      <span className="mt-2 inline-flex text-[12px] font-extrabold text-[#2e7d32]">
                        Set Rate Alert &rarr;
                      </span>
                    </div>
                  </Link>

                  <Link
                    className="group relative h-[140px] overflow-hidden rounded-[14px] bg-[#fff8e1] p-4 text-left transition hover:translate-y-[-2px]"
                    href="/credit-cards"
                  >
                    <div className="relative z-10 max-w-[100px]">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#d66b1f]">
                        BUILD CREDIT
                      </p>
                      <p className="mt-2 text-[14px] font-extrabold leading-[1.25] text-[#1a2e1a]">
                        Build credit while you send money
                      </p>
                      <p className="mt-2 text-[11px] font-medium leading-[1.35] text-[#5d4a2d]">
                        Immigrant-friendly credit cards.
                      </p>
                      <span className="mt-2 inline-flex text-[12px] font-extrabold text-[#d66b1f]">
                        Explore Cards &rarr;
                      </span>
                    </div>
                    <div className="absolute bottom-[-4px] right-[-10px] h-[58px] w-20 rotate-[-8deg] overflow-hidden">
                      <Image
                        alt=""
                        className="object-cover object-center"
                        fill
                        sizes="80px"
                        src="/hero/build-credit.png"
                      />
                    </div>
                  </Link>
              </div>
            </div>
          </div>

          <div className="w-full lg:flex lg:flex-col">
            <div className="mb-3 hidden flex-col items-end gap-[10px] lg:flex">
              {appDownloadButtons.map((button) => (
                <HeroStoreBadge key={button.platform} {...button} />
              ))}
            </div>

            <div className="flex w-full flex-col rounded-[14px] bg-white p-5 text-[#1a2e1a] shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
                <p className="mb-1 text-[9px] font-semibold uppercase tracking-[1.8px] text-[#2e7d32]">
                  COMPARE NOW
                </p>
                <h2 className="mb-[14px] text-[17px] font-semibold text-[#1a2e1a]">
                  Check your top payout
                </h2>

                <div className="flex h-full flex-col gap-3">
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

                    <div className="mt-[5px] flex flex-wrap gap-[6px]">
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
                    <div className="flex items-center justify-between rounded-[8px] border-[1.5px] border-[#e0ede2] px-[14px] py-[9px]">
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
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-brand-yellow px-4 py-[13px] text-[13px] font-bold text-[#1a1a1a] transition hover:translate-y-[-1px] hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    onClick={onCompare}
                  >
                    {isLoading ? "Refreshing rates..." : "Compare Rates Now →"}
                  </button>

                  <div className="flex flex-1 flex-col rounded-[10px] border border-[#c8e6c9] bg-[#f4faf5] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[#2e7d32]">
                      💰 SAVINGS CALCULATOR
                    </p>
                    <h3 className="mt-1 text-[15px] font-bold text-[#1a2e1a]">
                      Compare real payouts and save up to ₦{formatCalculatedNgn(savings)}
                    </h3>
                    <p className="mt-1 text-[10px] text-[#7a9a7a]">
                      Based on ${sendAmount.toLocaleString("en-US")} · {topProvider.name} vs {lowerProvider.name}
                    </p>

                    <div className="mt-3 grid grid-cols-[minmax(0,1fr)_28px_minmax(0,1fr)] items-center gap-2">
                      <div className={`rounded-[8px] border border-[#c8e6c9] bg-[#e8f5e9] px-3 py-[10px] transition-all duration-300 ${flashActive ? "border-[#2e7d32] shadow-[0_0_10px_rgba(46,125,50,0.25)]" : ""}`}>
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

                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2e7d32] text-white"
                        style={{
                          transform: swapSpin ? "rotate(360deg)" : "rotate(0deg)",
                          transition: "transform 0.6s ease"
                        }}
                      >
                        <ArrowUpDown className="h-3 w-3" />
                      </div>

                      <div className={`rounded-[8px] border border-[#e8e8e8] bg-[#fafafa] px-3 py-[10px] transition-all duration-300 ${flashActive ? "border-[#2e7d32] shadow-[0_0_10px_rgba(46,125,50,0.25)]" : ""}`}>
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

                    <div className="mt-3 flex items-center justify-between gap-3 rounded-[6px] bg-[#e0f2e1] px-3 py-2">
                      <span className="text-[11px] text-[#2e4a2e]">Your savings</span>
                      <span className={`text-[13px] font-bold text-[#1b5e20] transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                        + ₦{formatCalculatedNgn(savings)}
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f4faf5]">
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
