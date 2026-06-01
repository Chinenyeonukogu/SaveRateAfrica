"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import {
  ArrowUpDown,
  ChevronDown
} from "lucide-react";

import type { ComparisonProviderRow } from "@/lib/fetchRates";
import { senderCountries, type SenderCountry } from "@/lib/providers";

interface HomeHeroProps {
  amount: string;
  comparisonProviders: ComparisonProviderRow[];
  senderCountry: SenderCountry;
  isLoading: boolean;
  onAmountChange: (value: string) => void;
  onSenderCountryChange: (value: SenderCountry) => void;
  onCompare: () => void;
}

const quickAmounts = [200, 500, 1000] as const;

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

const recipientCountries = [
  {
    code: "Nigeria",
    name: "Nigeria",
    flag: { alt: "Nigeria flag", src: "/flags/ng.svg" },
    helper: "NGN · Nigeria",
    disabled: false
  },
  {
    code: "Ghana",
    name: "Ghana",
    flag: { alt: "Ghana flag", src: "/flags/gh.svg" },
    helper: "We're working to bring Ghana soon!",
    disabled: true
  }
] as const;

function CountryFlag({
  country,
  className = "mr-1 inline-block h-[12px] w-[16px] rounded-[2px] object-cover align-[-2px]"
}: {
  country: SenderCountry;
  className?: string;
}) {
  const flag = flagByCountry[country];

  return (
    <Image
      alt={flag.alt}
      className={className}
      height={12}
      src={flag.src}
      width={16}
    />
  );
}

function RecipientFlag({
  country,
  className = "h-[18px] w-[24px] rounded-[3px] object-cover"
}: {
  country: (typeof recipientCountries)[number];
  className?: string;
}) {
  return (
    <Image
      alt={country.flag.alt}
      className={className}
      height={18}
      src={country.flag.src}
      width={24}
    />
  );
}

function TrustBadgeIcon({ icon }: { icon: (typeof trustPills)[number]["icon"] }) {
  const iconClassName = "h-[18px] w-[18px] shrink-0";

  if (icon === "lock") {
    return (
      <svg aria-hidden="true" className={iconClassName} viewBox="0 0 32 32">
        <defs>
          <radialGradient id="trust-lock-body" cx="32%" cy="20%" r="82%">
            <stop offset="0%" stopColor="#fff7ad" />
            <stop offset="38%" stopColor="#facc15" />
            <stop offset="72%" stopColor="#b77905" />
            <stop offset="100%" stopColor="#6b3a03" />
          </radialGradient>
          <linearGradient id="trust-lock-shackle" x1="4" x2="28" y1="4" y2="19">
            <stop offset="0%" stopColor="#fff7c2" />
            <stop offset="48%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#7c3f05" />
          </linearGradient>
          <filter id="trust-lock-shadow" x="-30%" y="-25%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>
        <path
          d="M9 14V11.3C9 7.2 12.1 4 16 4s7 3.2 7 7.3V14h-3.5v-2.7c0-2.1-1.5-3.8-3.5-3.8s-3.5 1.7-3.5 3.8V14H9Z"
          fill="none"
          filter="url(#trust-lock-shadow)"
          stroke="url(#trust-lock-shackle)"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <rect x="7" y="13" width="18" height="15" rx="4" fill="url(#trust-lock-body)" filter="url(#trust-lock-shadow)" />
        <path d="M16 18.5a2.2 2.2 0 0 0-1.1 4.1l-.6 2.8h3.4l-.6-2.8a2.2 2.2 0 0 0-1.1-4.1Z" fill="#4a2600" opacity="0.85" />
        <ellipse cx="12.5" cy="16.5" rx="4.4" ry="2" fill="#fff8d0" opacity="0.42" transform="rotate(-22 12.5 16.5)" />
      </svg>
    );
  }

  if (icon === "signal") {
    return (
      <svg aria-hidden="true" className={iconClassName} viewBox="0 0 32 32">
        <defs>
          <radialGradient id="trust-signal-dot" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e0ffff" />
            <stop offset="42%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0e7490" />
          </radialGradient>
          <filter id="trust-signal-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M8.5 14.2a10 10 0 0 1 15 0" fill="none" stroke="#67e8f9" strokeLinecap="round" strokeWidth="2.4" filter="url(#trust-signal-glow)" />
        <path d="M5 10.4a14.8 14.8 0 0 1 22 0" fill="none" stroke="#22d3ee" strokeLinecap="round" strokeWidth="2.2" opacity="0.85" />
        <path d="M12 18a5.6 5.6 0 0 1 8 0" fill="none" stroke="#cffafe" strokeLinecap="round" strokeWidth="2.4" />
        <circle cx="16" cy="22.4" r="4" fill="url(#trust-signal-dot)" filter="url(#trust-signal-glow)" />
        <circle cx="14.7" cy="21.2" r="1.2" fill="#ffffff" opacity="0.72" />
      </svg>
    );
  }

  if (icon === "check") {
    return (
      <svg aria-hidden="true" className={iconClassName} viewBox="0 0 32 32">
        <defs>
          <radialGradient id="trust-check-sphere" cx="34%" cy="22%" r="78%">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="42%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#14532d" />
          </radialGradient>
          <filter id="trust-check-shadow" x="-35%" y="-30%" width="170%" height="170%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>
        <circle cx="16" cy="16" r="12" fill="url(#trust-check-sphere)" filter="url(#trust-check-shadow)" />
        <path d="M10.4 16.4 14 20l8-8.6" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.2" />
        <path d="M9.5 9.3c3.7-3 8.5-3.1 12.3-.5" fill="none" stroke="#dcfce7" strokeLinecap="round" strokeWidth="2" opacity="0.42" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={iconClassName} viewBox="0 0 32 32">
      <defs>
        <linearGradient id="trust-star-fill" x1="8" x2="25" y1="4" y2="28">
          <stop offset="0%" stopColor="#fff7ad" />
          <stop offset="42%" stopColor="#facc15" />
          <stop offset="76%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <filter id="trust-star-shadow" x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.38" />
        </filter>
      </defs>
      <path
        d="m16 3.8 3.5 7.1 7.8 1.1-5.6 5.5 1.3 7.8-7-3.7-7 3.7 1.3-7.8L4.7 12l7.8-1.1L16 3.8Z"
        fill="url(#trust-star-fill)"
        filter="url(#trust-star-shadow)"
      />
      <path d="M11.6 11.2 15 6.4l1.1 4.3-3.8 1.2Z" fill="#fff8c5" opacity="0.72" />
      <circle cx="11.6" cy="10.5" r="1.4" fill="#ffffff" opacity="0.72" />
    </svg>
  );
}

const brandFontStyle = {
  fontFamily: '"Sora", var(--font-heading), sans-serif'
} as const;

const trustPills = [
  { label: "256-bit secure", icon: "lock" },
  { label: "Real-time data", icon: "signal" },
  { label: "No sign-up needed", icon: "check" },
  { label: "99% rate accuracy", icon: "star" }
] as const;

const socialProofFaces = [
  "https://images.pexels.com/photos/26745561/pexels-photo-26745561.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
  "https://randomuser.me/api/portraits/men/54.jpg",
  "https://images.pexels.com/photos/18028052/pexels-photo-18028052.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
  "https://images.pexels.com/photos/33844621/pexels-photo-33844621.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop",
  "https://randomuser.me/api/portraits/men/75.jpg"
] as const;

function formatCalculatedNgn(value: number) {
  return value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function HomeHero({
  amount,
  comparisonProviders,
  senderCountry,
  isLoading,
  onAmountChange,
  onSenderCountryChange,
  onCompare
}: HomeHeroProps) {
  const currencyMeta = currencySymbolByCountry[senderCountry];
  const sendAmount = Number.parseFloat(amount || "0") || 0;
  const [fade, setFade] = useState<boolean>(true);
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [swapSpin, setSwapSpin] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [calculatorCycleIndex, setCalculatorCycleIndex] = useState<number>(0);
  const [senderDropdownOpen, setSenderDropdownOpen] = useState<boolean>(false);
  const [recipientDropdownOpen, setRecipientDropdownOpen] = useState<boolean>(false);
  const selectedSenderCountry =
    senderCountries.find((country) => country.code === senderCountry) ??
    senderCountries[0];
  const selectedRecipientCountry = recipientCountries[0];

  useEffect(() => {
    let flashTimeout: ReturnType<typeof setTimeout> | null = null;
    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;

    function refreshCalculatorDisplay() {
      setFade(false);
      setSwapSpin((prev) => !prev);
      setFlashActive(true);
      setSecondsRemaining(30);
      setCalculatorCycleIndex((prev) => prev + 1);
      fadeTimeout = setTimeout(() => setFade(true), 100);
      flashTimeout = setTimeout(() => setFlashActive(false), 800);
    }

    refreshCalculatorDisplay();
    const interval = setInterval(() => {
      refreshCalculatorDisplay();
    }, 30000);

    return () => {
      clearInterval(interval);
      if (flashTimeout) clearTimeout(flashTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []);

  useEffect(() => {
    setCalculatorCycleIndex(0);
  }, [amount, comparisonProviders, senderCountry]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setSecondsRemaining((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const calculatorResults = useMemo(() => {
    return comparisonProviders
      .map((provider) => ({
        name: provider.name,
        recipientReceives: provider.amountReceived
      }))
      .sort((first, second) => second.recipientReceives - first.recipientReceives);
  }, [comparisonProviders]);

  const topProvider = calculatorResults[0] ?? { name: "Top provider", recipientReceives: 0 };
  const lowerProviderOptions = calculatorResults.filter(
    (provider) =>
      provider.name !== topProvider.name &&
      provider.recipientReceives < topProvider.recipientReceives
  );
  const lowerProvider =
    lowerProviderOptions.length > 0
      ? lowerProviderOptions[calculatorCycleIndex % lowerProviderOptions.length]
      : calculatorResults.find((provider) => provider.name !== topProvider.name) ?? {
          name: "Other provider",
          recipientReceives: topProvider.recipientReceives
        };
  const savings = Math.max(
    0,
    Math.round((topProvider.recipientReceives - lowerProvider.recipientReceives) * 100) / 100
  );

  return (
    <section
      id="home"
      className="relative w-full max-w-[100vw] overflow-hidden overflow-x-hidden bg-white"
    >
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(135deg,#1a3a1a_0%,#2e7d32_50%,#0d2416_100%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1200px] overflow-visible px-5 pb-10 pt-5 text-white min-[600px]:px-7 min-[600px]:pb-12 lg:px-6 lg:pb-16">

        <div className="mx-auto flex min-w-0 max-w-[980px] flex-col items-center gap-5 text-center">
          <div className="flex min-w-0 flex-col items-center gap-4 overflow-hidden pt-0">
            <div className="inline-flex w-fit items-center rounded-full border border-green-800/60 bg-green-950/40 px-3 py-[5px] text-[9px] font-bold uppercase tracking-[0.6px] text-green-400">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-[#4ade80] animate-hero-live-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              REAL-TIME RATES · COMPARE &amp; SAVE INSTANTLY
            </div>

            <div className="flex flex-col gap-4">
              <h1
                className="mx-auto max-w-[760px] font-heading text-[25px] font-bold leading-[1.08] tracking-[-0.5px] text-white min-[600px]:text-[36px] lg:text-[44px]"
                style={brandFontStyle}
              >
                Compare Live Nigeria Exchange Rates & See Which Providers Pays the Most.
              </h1>

            </div>

            <p className="mx-auto max-w-[620px] text-[13px] font-bold leading-[1.65] text-white min-[600px]:text-[15px]">
              Real-time rates from 14 trusted providers. No hidden fees. Ranked by
              the exact NGN your recipient receives after all charges.
            </p>

            <div className="flex w-full max-w-full min-w-0 flex-col items-center box-border">
              <div className="mb-4 flex w-full min-w-0 flex-wrap justify-center gap-2 box-border">
                {trustPills.map((pill) => (
                  <div
                    key={pill.label}
                    className="inline-flex min-h-8 w-[calc(50%-4px)] items-center justify-center gap-[6px] rounded-full border border-white/15 bg-white/10 px-[10px] py-[4px] text-[10px] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-1px_0_rgba(0,0,0,0.25)] min-[600px]:w-auto"
                  >
                    <TrustBadgeIcon icon={pill.icon} />
                    {pill.label}
                  </div>
                ))}
              </div>

              <div className="flex w-fit max-w-full items-center text-left">
                <div className="flex shrink-0 items-center">
                  {socialProofFaces.map((face, index) => (
                    <Image
                      key={face}
                      alt=""
                      className={`h-10 w-10 rounded-full border-[2.5px] border-[#0d2416] object-cover shadow-[0_4px_12px_rgba(0,0,0,0.28)] ${index === 0 ? "" : "-ml-3"}`}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      height={40}
                      priority={index === 0}
                      quality={85}
                      sizes="40px"
                      src={face}
                      width={40}
                    />
                  ))}
                </div>
                <div className="ml-3 min-w-0">
                  <div className="text-[12px] leading-none text-brand-yellow">★★★★★</div>
                  <p className="mt-1 text-[10px] font-semibold leading-[1.25] text-white min-[600px]:text-[11px]">
                    Join the thousands finding better rates for transfers to Nigeria.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-3 w-full min-w-0 max-w-[820px] overflow-visible min-[900px]:mt-5">
            <div className="mx-auto flex w-full max-w-full flex-col overflow-visible rounded-t-[14px] rounded-b-[34px] bg-white p-0 text-left text-[#1a2e1a] shadow-[0_22px_54px_rgba(0,0,0,0.16)] ring-1 ring-[#e8e8e8]">
                <p className="mb-1 px-4 pt-5 text-center text-[13px] font-black uppercase tracking-[2px] text-[#2e7d32] min-[760px]:pt-6">
                  COMPARE NOW
                </p>
                <h2 className="mb-4 px-4 text-center text-[21px] font-black leading-tight text-[#1a2e1a] min-[600px]:text-[26px]">
                  Check your top payout
                </h2>

                <div className="grid h-full grid-cols-1 gap-3 overflow-visible px-4 pb-4 min-[760px]:grid-cols-2 min-[760px]:px-6 min-[760px]:pb-6">
                  <label className="order-3 block min-[760px]:col-span-1">
                    <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.08em] text-black">
                      Send amount
                    </span>
                    <div className="overflow-hidden rounded-[8px] border-[2px] border-[#2e7d32] bg-white">
                      <div className="flex items-center">
                        <span className="border-r-[1.5px] border-[#e0ede2] bg-[#f4faf5] px-3 py-3 text-[12px] font-black text-black">
                          {currencyMeta.code}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center px-3 py-3">
                          <span className="mr-2 text-[22px] font-black text-black">
                            {currencyMeta.symbol}
                          </span>
                          <input
                            className="w-full bg-transparent text-[22px] font-black text-black outline-none placeholder:text-black/35"
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

                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickAmounts.map((quickAmount) => {
                        const isActive = amount === String(quickAmount);

                        return (
                          <button
                            key={quickAmount}
                            className={`rounded-full border px-3 py-1 text-[11px] transition ${
                              isActive
                                ? "border-[#2e7d32] bg-[#2e7d32] font-black text-white"
                                : "border-[#d4e8d4] bg-white font-bold text-[#1a2e1a] hover:border-[#2e7d32] hover:text-[#2e7d32]"
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

                  <div className="order-1">
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-black">
                      SELECT COUNTRY OF YOUR CHOICE
                    </p>
                    <div className="relative">
                      <button
                        aria-expanded={senderDropdownOpen}
                        className="flex w-full items-center justify-between rounded-[10px] border-[1.5px] border-[#e0ede2] bg-white px-3 py-3 text-left transition hover:border-[#2e7d32]/50"
                        type="button"
                        onClick={() => {
                          setSenderDropdownOpen((current) => !current);
                          setRecipientDropdownOpen(false);
                        }}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <CountryFlag
                            country={selectedSenderCountry.code}
                            className="h-[18px] w-[24px] rounded-[3px] object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block text-[15px] font-black text-black">
                              {selectedSenderCountry.region}
                            </span>
                            <span className="block text-[11px] font-semibold text-[#7a9a7a]">
                              {selectedSenderCountry.currency} · {selectedSenderCountry.label}
                            </span>
                          </span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#2e7d32] transition ${
                            senderDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {senderDropdownOpen ? (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[10px] border border-[#e0ede2] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.16)]">
                          {senderCountries.map((country) => {
                            const active = country.code === senderCountry;

                            return (
                              <button
                                key={country.code}
                                className={`flex w-full items-center gap-3 px-3 py-3 text-left transition ${
                                  active ? "bg-[#e8f5e9]" : "bg-white hover:bg-[#f4faf5]"
                                }`}
                                type="button"
                                onClick={() => {
                                  onSenderCountryChange(country.code);
                                  setSenderDropdownOpen(false);
                                }}
                              >
                                <CountryFlag
                                  country={country.code}
                                  className="h-[18px] w-[24px] rounded-[3px] object-cover"
                                />
                                <span>
                                  <span className="block text-[13px] font-bold text-[#1a2e1a]">
                                    {country.region}
                                  </span>
                                  <span className="block text-[11px] font-semibold text-[#7a9a7a]">
                                    {country.currency} · {country.label}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="order-2">
                    <p className="mb-2 text-[11px] font-black uppercase tracking-[0.08em] text-black">
                      RECIPIENT COUNTRY
                    </p>
                    <div className="relative">
                      <button
                        aria-expanded={recipientDropdownOpen}
                        className="flex w-full items-center justify-between rounded-[10px] border-[1.5px] border-[#e0ede2] bg-white px-3 py-3 text-left transition hover:border-[#2e7d32]/50"
                        type="button"
                        onClick={() => {
                          setRecipientDropdownOpen((current) => !current);
                          setSenderDropdownOpen(false);
                        }}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <RecipientFlag country={selectedRecipientCountry} />
                          <span className="min-w-0">
                            <span className="block text-[15px] font-black text-black">
                              {selectedRecipientCountry.name}
                            </span>
                            <span className="block text-[11px] font-semibold text-[#7a9a7a]">
                              {selectedRecipientCountry.helper}
                            </span>
                          </span>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-[#2e7d32] transition ${
                            recipientDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {recipientDropdownOpen ? (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-[10px] border border-[#e0ede2] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.16)]">
                          {recipientCountries.map((country) => (
                            <button
                              key={country.code}
                              className={`flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition ${
                                country.disabled
                                  ? "cursor-not-allowed bg-[#fafafa]"
                                  : "bg-[#e8f5e9] hover:bg-[#f4faf5]"
                              }`}
                              disabled={country.disabled}
                              type="button"
                              onClick={() => {
                                if (!country.disabled) {
                                  setRecipientDropdownOpen(false);
                                }
                              }}
                            >
                              <span className="flex min-w-0 items-center gap-3">
                                <RecipientFlag
                                  country={country}
                                  className={`h-[18px] w-[24px] rounded-[3px] object-cover ${
                                    country.disabled ? "grayscale" : ""
                                  }`}
                                />
                                <span>
                                  <span
                                    className={`block text-[13px] font-bold ${
                                      country.disabled ? "text-[#9a9a9a]" : "text-[#1a2e1a]"
                                    }`}
                                  >
                                    {country.name}
                                  </span>
                                  <span className="block text-[11px] font-semibold text-[#7a9a7a]">
                                    {country.helper}
                                  </span>
                                </span>
                              </span>

                              {country.disabled ? (
                                <span className="shrink-0 rounded-full bg-brand-yellow px-2 py-1 text-[9px] font-black uppercase text-[#1a1a1a]">
                                  Coming Soon
                                </span>
                              ) : null}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <button
                    className="order-4 inline-flex h-[58px] w-full items-center justify-center gap-2 self-end rounded-[10px] bg-brand-yellow px-5 text-[15px] font-black text-[#1a1a1a] shadow-[0_10px_28px_rgba(246,198,25,0.38)] ring-2 ring-[#f6c619]/35 transition hover:translate-y-[-1px] hover:shadow-float disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    onClick={onCompare}
                  >
                    {isLoading ? "Refreshing rates..." : "Compare Rates Now →"}
                  </button>

                  <div className="order-5 flex flex-1 flex-col rounded-[10px] border border-[#c8e6c9] bg-[#f4faf5] p-3 min-[760px]:col-span-2">
                    <p className="text-[11px] font-black uppercase tracking-[1px] text-[#2e7d32]">
                      💰 SAVINGS CALCULATOR
                    </p>
                    <h3 className="mt-1 text-[15px] font-black leading-snug text-[#1a2e1a] min-[600px]:text-[17px]">
                      Compare real payouts and save up to ₦{formatCalculatedNgn(savings)}
                    </h3>
                    <p className="mt-1 text-[11px] font-bold text-[#5a8a5a]">
                      Based on {currencyMeta.symbol}{sendAmount.toLocaleString("en-US")} · {topProvider.name} vs {lowerProvider.name}
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
