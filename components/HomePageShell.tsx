"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BellRing,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  LineChart,
  Menu,
  ShieldCheck,
  Star,
  Waves,
  X
} from "lucide-react";

import { AIAssistant } from "@/components/AIAssistant";
import { AlertsForm } from "@/components/AlertsForm";
import { BestTimeToSend } from "@/components/BestTimeToSend";
import { ComparisonTable } from "@/components/ComparisonTable";
import { HeroSection } from "@/components/HeroSection";
import { RateChart } from "@/components/RateChart";
import { RateDisclaimer } from "@/components/RateDisclaimer";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import {
  formatCompact,
  formatCurrency,
  formatDateTime,
  formatNaira
} from "@/lib/format";
import {
  buildComparisonFromLiveRates,
  fetchRates,
  type ComparisonResult
} from "@/lib/fetchRates";
import { faqItems, howItWorksSteps } from "@/lib/site-data";
import type { ComparisonSort, SenderCountry } from "@/lib/providers";

interface HomePageShellProps {
  initialComparison: ComparisonResult;
}

type FeatureCategory = "alerts" | "credit" | "smart";
type SectionTargetKey =
  | "alerts"
  | "bestTime"
  | "buildCredit"
  | "compare"
  | "howItWorks"
  | "rateChart"
  | "smartSending";

interface FeatureCardDefinition {
  category: FeatureCategory;
  cta: string;
  description: string;
  icon: LucideIcon;
  eyebrow: string;
  targetKey: SectionTargetKey;
  title: string;
}

const primaryNavLinks = [
  { href: "#compare-rates", label: "Compare Rates" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#smart-sending", label: "Smart Sending" },
  { href: "#build-credit", label: "Build Credit" },
  { href: "#rate-alerts", label: "Rate Alerts" },
  { href: "#contact-us", label: "Contact Us" }
] as const;

const appDownloadButtons = [
  {
    href: "/manifest.webmanifest",
    label: "App Store",
    platform: "iOS",
    prefix: "Download on the"
  },
  {
    href: "/manifest.webmanifest",
    label: "Google Play",
    platform: "Android",
    prefix: "Get it on"
  }
] as const;

const featureCardDefinitions: FeatureCardDefinition[] = [
  {
    category: "smart",
    cta: "Open comparison",
    description:
      "Scan the full provider table and sort the route that delivers the strongest NGN value.",
    eyebrow: "Core comparison",
    icon: Waves,
    targetKey: "compare",
    title: "Compare live providers"
  },
  {
    category: "smart",
    cta: "View the flow",
    description:
      "See the simple path from entering your amount to choosing the provider that fits your speed and budget.",
    eyebrow: "How it works",
    icon: ShieldCheck,
    targetKey: "howItWorks",
    title: "Understand the send journey"
  },
  {
    category: "smart",
    cta: "See insights",
    description:
      "Use best-value guidance, savings context, and timing signals before you send money home.",
    eyebrow: "Smart sending",
    icon: LineChart,
    targetKey: "smartSending",
    title: "Get smarter route guidance"
  },
  {
    category: "alerts",
    cta: "Set an alert",
    description:
      "Choose your target NGN level and let SaveRateAfrica notify you when the corridor is favorable.",
    eyebrow: "Rate alerts",
    icon: BellRing,
    targetKey: "alerts",
    title: "Track your target rate"
  },
  {
    category: "alerts",
    cta: "Read the market",
    description:
      "Check the AI-assisted market pulse and see whether current movement favors waiting or sending now.",
    eyebrow: "Market timing",
    icon: Activity,
    targetKey: "bestTime",
    title: "Watch timing signals"
  },
  {
    category: "alerts",
    cta: "View the chart",
    description:
      "Spot short-term and longer-term rate patterns before you lock in a transfer route.",
    eyebrow: "Trend tracking",
    icon: CircleDollarSign,
    targetKey: "rateChart",
    title: "Follow rate momentum"
  },
  {
    category: "credit",
    cta: "Explore credit",
    description:
      "Browse the credit-building section built for Nigerians settling into the U.S. financial system.",
    eyebrow: "Build credit",
    icon: CreditCard,
    targetKey: "buildCredit",
    title: "Build your U.S. profile"
  }
];

const featureCardIconThemes = [
  {
    background: "linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)",
    boxShadow: "0 5px 0 #0277bd, 0 7px 12px rgba(2,136,209,0.35)"
  },
  {
    background: "linear-gradient(135deg, #81c784 0%, #2e7d32 100%)",
    boxShadow: "0 5px 0 #1b5e20, 0 7px 12px rgba(46,125,50,0.35)"
  },
  {
    background: "linear-gradient(135deg, #ce93d8 0%, #7b1fa2 100%)",
    boxShadow: "0 5px 0 #6a1b9a, 0 7px 12px rgba(123,31,162,0.35)"
  },
  {
    background: "linear-gradient(135deg, #ffb74d 0%, #e65100 100%)",
    boxShadow: "0 5px 0 #bf360c, 0 7px 12px rgba(230,81,0,0.35)"
  },
  {
    background: "linear-gradient(135deg, #4db6ac 0%, #00695c 100%)",
    boxShadow: "0 5px 0 #004d40, 0 7px 12px rgba(0,105,92,0.35)"
  },
  {
    background: "linear-gradient(135deg, #7986cb 0%, #283593 100%)",
    boxShadow: "0 5px 0 #1a237e, 0 7px 12px rgba(40,53,147,0.35)"
  },
  {
    background: "linear-gradient(135deg, #aed581 0%, #558b2f 100%)",
    boxShadow: "0 5px 0 #33691e, 0 7px 12px rgba(85,139,47,0.35)"
  }
] as const;

const reviewCountries = ["USA", "UK", "Canada"] as const;
const brandFontStyle = {
  fontFamily: '"Sora", var(--font-heading), sans-serif'
} as const;
const pageShellClassName =
  "mx-auto w-full max-w-[1200px] px-4 min-[600px]:px-6 lg:px-10";
const topLevelSectionInnerClassName = `${pageShellClassName} py-9 min-[600px]:py-[52px] lg:py-[72px]`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";

function SaveRateAfricaLogo() {
  return (
    <Link
      aria-label="SaveRateAfrica home"
      className="inline-flex items-center gap-0 text-[#1a2e1a]"
      href="/"
      style={brandFontStyle}
    >
      <svg
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
        viewBox="0 0 32 32"
      >
        <defs>
          <linearGradient id="saverate-logo-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#66bb6a" />
            <stop offset="100%" stopColor="#2e7d32" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" fill="url(#saverate-logo-gradient)" r="16" />
        <text
          fill="#ffffff"
          fontFamily="Sora, Arial, sans-serif"
          fontSize="18"
          fontWeight="700"
          textAnchor="middle"
          x="16"
          y="22"
        >
          S
        </text>
      </svg>
      <span className="ml-0 text-[20px] font-bold leading-none tracking-[-0.03em]">
        Save<span className="text-[#2e7d32]">Rate</span>Africa
      </span>
    </Link>
  );
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

function AppStoreBadge({
  href,
  label,
  platform,
  prefix
}: (typeof appDownloadButtons)[number]) {
  const Icon = platform === "iOS" ? AppleBadgeIcon : GooglePlayBadgeIcon;

  return (
    <a
      className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-black px-[14px] py-[6px] text-white"
      download
      href={href}
    >
      <Icon />
      <span className="flex flex-col leading-none" style={brandFontStyle}>
        <span className="text-[7px] font-medium tracking-[0.02em] text-white/85">
          {prefix}
        </span>
        <span className="mt-[2px] text-[11px] font-bold">{label}</span>
      </span>
    </a>
  );
}

function buildLiveReviewComparisons(
  comparison: ComparisonResult
): Record<SenderCountry, ComparisonResult> {
  return Object.fromEntries(
    reviewCountries.map((country) => [
      country,
      buildComparisonFromLiveRates({
        amount: comparison.amount,
        senderCountry: country,
        sortBy: "best-rate",
        liveBaseRates: {
          provider: comparison.rateProvider,
          updatedAt: comparison.updatedAt,
          sourceUpdatedAt: comparison.sourceUpdatedAt,
          cachedUntil: comparison.cachedUntil,
          rates: comparison.liveBaseRates
        }
      })
    ])
  ) as Record<SenderCountry, ComparisonResult>;
}

export function HomePageShell({ initialComparison }: HomePageShellProps) {
  const compareRef = useRef<HTMLDivElement | null>(null);
  const smartSendingRef = useRef<HTMLElement | null>(null);
  const buildCreditRef = useRef<HTMLElement | null>(null);
  const alertsRef = useRef<HTMLDivElement | null>(null);
  const bestTimeRef = useRef<HTMLDivElement | null>(null);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const rateChartRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState(String(initialComparison.amount));
  const [senderCountry, setSenderCountry] = useState<SenderCountry>(
    initialComparison.senderCountry
  );
  const [reviewCountry, setReviewCountry] = useState<SenderCountry>(
    initialComparison.senderCountry
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [comparison, setComparison] = useState(initialComparison);
  const [sortBy, setSortBy] = useState<ComparisonSort>(initialComparison.sortBy);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nextRefreshAt, setNextRefreshAt] = useState(initialComparison.cachedUntil);
  const amountRef = useRef(amount);
  const senderCountryRef = useRef(senderCountry);
  const sortByRef = useRef(sortBy);
  const lastValidAmountRef = useRef(initialComparison.amount);
  const latestRequestIdRef = useRef(0);

  async function refreshComparison(
    nextSort = sortByRef.current,
    signal?: AbortSignal
  ) {
    const parsedAmount = Number.parseFloat(amountRef.current);
    const normalizedAmount =
      Number.isFinite(parsedAmount) && parsedAmount > 0
        ? parsedAmount
        : lastValidAmountRef.current;
    const requestId = ++latestRequestIdRef.current;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextComparison = await fetchRates(
        {
          amount: normalizedAmount,
          senderCountry: senderCountryRef.current,
          sortBy: nextSort
        },
        {
          signal
        }
      );

      if (signal?.aborted || requestId !== latestRequestIdRef.current) {
        return null;
      }

      setComparison(nextComparison);
      setNextRefreshAt(nextComparison.cachedUntil);
      return nextComparison;
    } catch (error) {
      if (signal?.aborted || requestId !== latestRequestIdRef.current) {
        return null;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Unable to refresh rates right now."
      );
      setNextRefreshAt(new Date(Date.now() + 60_000).toISOString());
      return null;
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    amountRef.current = amount;

    const parsedAmount = Number.parseFloat(amount);

    if (Number.isFinite(parsedAmount) && parsedAmount > 0) {
      lastValidAmountRef.current = parsedAmount;
    }
  }, [amount]);

  useEffect(() => {
    senderCountryRef.current = senderCountry;
  }, [senderCountry]);

  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  useEffect(() => {
    setReviewCountry(senderCountry);
  }, [senderCountry]);

  useEffect(() => {
    const parsedAmount = Number.parseFloat(amount);
    const normalizedAmount =
      Number.isFinite(parsedAmount) && parsedAmount > 0
        ? parsedAmount
        : lastValidAmountRef.current;

    setComparison((currentComparison) =>
      buildComparisonFromLiveRates({
        amount: normalizedAmount,
        senderCountry,
        sortBy,
        liveBaseRates: {
          provider: currentComparison.rateProvider,
          updatedAt: currentComparison.updatedAt,
          sourceUpdatedAt: currentComparison.sourceUpdatedAt,
          cachedUntil: currentComparison.cachedUntil,
          rates: currentComparison.liveBaseRates
        }
      })
    );
  }, [amount, senderCountry, sortBy]);

  useEffect(() => {
    const msUntilRefresh = Math.max(
      new Date(nextRefreshAt).getTime() - Date.now(),
      30_000
    );
    const timeoutId = window.setTimeout(() => {
      void refreshComparison(sortByRef.current);
    }, msUntilRefresh);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [nextRefreshAt]);

  function handleCompare() {
    compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToSection(target: { current: Element | null }) {
    target.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSortChange(nextSort: ComparisonSort) {
    setSortBy(nextSort);
  }

  const bestValueProvider =
    comparison.providers.find((provider) => provider.isBestValue) ??
    comparison.providers[0];
  const liveReviewComparisons = buildLiveReviewComparisons(comparison);
  const selectedReviewComparison = liveReviewComparisons[reviewCountry];
  const liveReviewProviders = selectedReviewComparison.providers.slice(0, 3);
  const sectionTargets: Record<SectionTargetKey, { current: Element | null }> = {
    alerts: alertsRef,
    bestTime: bestTimeRef,
    buildCredit: buildCreditRef,
    compare: compareRef,
    howItWorks: howItWorksRef,
    rateChart: rateChartRef,
    smartSending: smartSendingRef
  };

  return (
    <>
      <main className="overflow-x-hidden pb-32 md:pb-20">
        <div className="bg-[#2e7d32]">
          <div className="mx-auto max-w-[1200px] px-5 py-[10px] text-center text-[13px] text-white">
            <span>
              ✦ Real-time NGN rates · No hidden fees · Compare 10+ providers and
              save on every transfer.{" "}
            </span>
            <Link
              className="font-bold underline underline-offset-2"
              href="#compare-rates"
            >
              Compare now →
            </Link>
          </div>
        </div>

        <header className="border-b border-[#dcedc8] bg-white">
          <div className={pageShellClassName}>
            <div className="flex h-[60px] items-center justify-between gap-4">
              <div className="shrink-0">
                <SaveRateAfricaLogo />
              </div>

              <nav
                aria-label="Primary"
                className="hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto min-[600px]:flex"
              >
                {primaryNavLinks.map((item) => (
                  <Link
                    key={item.label}
                    className="shrink-0 whitespace-nowrap text-[13px] font-medium text-[#2e4a2e] underline-offset-[6px] decoration-[#2e7d32] hover:underline"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden shrink-0 items-center gap-2 min-[600px]:flex">
                {appDownloadButtons.map((button) => (
                  <AppStoreBadge key={button.platform} {...button} />
                ))}
              </div>

              <button
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[#dcedc8] text-brand-navy min-[600px]:hidden"
                type="button"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {isMobileMenuOpen ? (
              <div className="border-t border-[#e8f5e9] pb-4 pt-4 min-[600px]:hidden">
                <nav aria-label="Mobile primary" className="grid gap-2">
                  {primaryNavLinks.map((item) => (
                    <Link
                      key={item.label}
                      className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-[#2e4a2e] hover:bg-brand-light"
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-4 flex flex-col gap-2">
                  {appDownloadButtons.map((button) => (
                    <AppStoreBadge key={button.platform} {...button} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <HeroSection
          amount={amount}
          isLoading={isLoading}
          senderCountry={senderCountry}
          onAmountChange={setAmount}
          onCompare={handleCompare}
          onSenderCountryChange={setSenderCountry}
        />

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <div className="rounded-[16px] bg-[#f4faf5] px-4 py-5 min-[600px]:px-5 min-[600px]:py-7 lg:px-8 lg:py-9">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                  Feature hub
                </p>
                <h2 className="mt-2 text-[20px] font-heading text-brand-navy min-[600px]:text-3xl">
                  Browse every core tool from one organized layer
                </h2>
                <p className="mt-3 text-[13px] leading-6 text-brand-navy/70">
                  Browse rate monitoring, credit-building support, and the smart
                  sending tools already inside the homepage.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 items-stretch gap-3 min-[600px]:grid-cols-2 min-[600px]:gap-[14px] lg:grid-cols-3 lg:gap-4">
                {featureCardDefinitions.map((card, index) => {
                  const Icon = card.icon;
                  const iconTheme =
                    featureCardIconThemes[index] ??
                    featureCardIconThemes[featureCardIconThemes.length - 1];

                  return (
                    <article
                      key={card.title}
                      className="flex h-full flex-col rounded-[12px] border border-[#c8e6c9] bg-white px-4 py-[18px] transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(46,125,50,0.13)] min-[600px]:px-5 min-[600px]:py-6"
                    >
                      <div
                        className="inline-flex h-[50px] w-[50px] items-center justify-center rounded-[13px] text-white"
                        style={iconTheme}
                      >
                        <Icon className="h-5 w-5 text-white [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.2))]" />
                      </div>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                        {card.eyebrow}
                      </p>
                      <h3 className="mt-2 text-base font-heading text-brand-navy min-[600px]:text-2xl">
                        {card.title}
                      </h3>
                      <p className="mt-3 flex-1 text-[12px] leading-5 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
                        {card.description}
                      </p>
                      <button
                        className="mt-5 inline-flex min-h-12 items-center gap-2 self-start rounded-2xl bg-white px-4 text-sm font-semibold text-brand-navy shadow-float hover:bg-brand-navy hover:text-white"
                        type="button"
                        onClick={() => scrollToSection(sectionTargets[card.targetKey])}
                      >
                        {card.cta}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <div id="compare-rates" ref={compareRef} className="scroll-mt-24">
              <ComparisonTable
                comparison={comparison}
                errorMessage={errorMessage}
                isLoading={isLoading}
                nextRefreshAt={nextRefreshAt}
                onSortChange={handleSortChange}
              />
            </div>

            <div className="mt-8">
              <RateDisclaimer />
            </div>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <SavingsCalculator comparison={comparison} />
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <section
              id="how-it-works"
              ref={howItWorksRef}
              className="scroll-mt-24 rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                How it works
              </p>
              <h2 className="mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                A clearer route from diaspora wallet to Nigerian bank account
              </h2>

              <div className="mt-8 grid min-[600px]:grid-cols-3">
                {howItWorksSteps.map((step, index) => (
                  <article
                    key={step.step}
                    className={`relative min-[600px]:px-6 ${
                      index < howItWorksSteps.length - 1
                        ? "border-b border-[#e8f5e9] pb-6 min-[600px]:border-b-0"
                        : ""
                    } ${index > 0 ? "pt-6 min-[600px]:pt-0" : ""}`}
                  >
                    {index < howItWorksSteps.length - 1 ? (
                      <span className="absolute right-0 top-4 hidden h-[60px] border-r border-[#c8e6c9] min-[600px]:block" />
                    ) : null}
                    <p className="mb-[10px] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2e7d32]">
                      Step {step.step}
                    </p>
                    <h3 className="mb-[6px] text-base font-heading text-brand-navy min-[600px]:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <section
              id="smart-sending"
              ref={smartSendingRef}
              className="scroll-mt-24 rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-10"
            >
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
                <div className="lg:max-w-md">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/30">
                    <CircleDollarSign className="h-6 w-6 text-brand-navy" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                    Smart sending
                  </p>
                  <h2 className="mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                    Move more value with less friction
                  </h2>
                  <p className="mt-3 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
                    See the strongest route recommendation right after the send
                    form so first-time visitors get immediate clarity on where
                    their money goes furthest.
                  </p>
                </div>

                <div className="rounded-[14px] bg-[#f4faf5] p-5 min-[600px]:p-7">
                  <div className="space-y-4">
                    <p className="text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
                      Your best live route right now is{" "}
                      <span className="font-semibold text-brand-navy">
                        {bestValueProvider?.name}
                      </span>
                      , delivering up to{" "}
                      <span className="font-semibold text-brand-green">
                        {formatNaira(bestValueProvider?.amountReceived ?? 1, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>{" "}
                      on this{" "}
                      <span className="font-semibold text-brand-navy">
                        {formatCurrency(comparison.amount, comparison.sourceCurrency, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </span>{" "}
                      transfer.
                    </p>
                    <p className="text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
                      SaveRateAfrica compares effective value, transfer fee, and
                      speed together so you can choose based on what matters
                      today: urgency, cost, or payout.
                    </p>

                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3">
                        <CheckCircle2 className="h-5 w-5 text-brand-green" />
                        <span className="text-[12px] text-brand-navy/75 min-[600px]:text-sm">
                          Best provider right now: {comparison.savings.bestProvider}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3">
                        <ShieldCheck className="h-5 w-5 text-brand-green" />
                        <span className="text-[12px] text-brand-navy/75 min-[600px]:text-sm">
                          Every provider is shown with rating, speed, and payout
                          channel context
                        </span>
                      </div>
                      <div className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3">
                        <LineChart className="h-5 w-5 text-brand-green" />
                        <span className="text-[12px] text-brand-navy/75 min-[600px]:text-sm">
                          Trend signals help you avoid poor timing and guesswork
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <div id="market-timing" ref={bestTimeRef} className="scroll-mt-24">
              <BestTimeToSend comparison={comparison} />
            </div>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <div id="rate-alerts" ref={alertsRef} className="scroll-mt-24">
              <AlertsForm />
            </div>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <section
              id="build-credit"
              ref={buildCreditRef}
              className="scroll-mt-24 rounded-[16px] border border-brand-navy/10 bg-brand-navy px-4 py-8 text-white shadow-float min-[600px]:px-8 min-[600px]:py-10 lg:px-10 lg:py-12"
            >
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                    Need more ways to save?
                  </p>
                  <h2 className="mt-2 text-[28px] font-heading min-[600px]:text-3xl">
                    Build credit while you send from the USA
                  </h2>
                  <p className="mt-3 max-w-2xl text-[12px] leading-6 text-white/80 min-[600px]:text-sm min-[600px]:leading-7">
                    Explore immigrant-friendly card picks that help you earn
                    rewards, improve approval odds, and strengthen your U.S.
                    credit profile.
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-yellow px-5 text-sm font-bold text-brand-navy transition hover:shadow-float min-[600px]:w-auto"
                    href="/credit-cards"
                  >
                    Explore credit cards
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <div id="rate-chart" ref={rateChartRef} className="scroll-mt-24">
              <RateChart />
            </div>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <section className="rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-10">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                    Live provider reviews
                  </p>
                  <h2 className="mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                    Real-time provider pulse for Nigerians sending abroad
                  </h2>
                  <p className="mt-2 text-[12px] text-brand-navy/60 min-[600px]:text-sm">
                    Updated {formatDateTime(selectedReviewComparison.updatedAt)} for the{" "}
                    {reviewCountry} corridor.
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 min-[600px]:grid min-[600px]:grid-cols-3">
                  {reviewCountries.map((country) => (
                    <button
                      key={country}
                      className={`min-h-11 shrink-0 rounded-2xl px-4 text-sm font-semibold transition ${
                        country === reviewCountry
                          ? "bg-brand-green text-white"
                          : "bg-brand-light text-brand-navy hover:bg-brand-navy hover:text-white"
                      }`}
                      type="button"
                      onClick={() => setReviewCountry(country)}
                    >
                      {country} senders
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-[14px] lg:grid-cols-3">
                {liveReviewProviders.map((provider) => (
                  <article
                    key={`${reviewCountry}-${provider.slug}`}
                    className="rounded-[12px] border border-[#c8e6c9] bg-white p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={`${provider.slug}-${index}`}
                            className={`h-4 w-4 ${
                              index < provider.rating
                                ? "fill-brand-yellow text-brand-yellow"
                                : "text-brand-navy/20"
                            }`}
                          />
                        ))}
                      </div>

                      {provider.isBestValue ? (
                        <span className="rounded-full bg-brand-green/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-green">
                          Best value now
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-brand-navy/60 min-[600px]:text-sm">
                      <span className="font-semibold text-brand-green">
                        {provider.name}
                      </span>
                      <span>{provider.rating.toFixed(1)} rating</span>
                      <span>{formatCompact(provider.reviewCount)} reviews</span>
                    </div>

                    <p className="mt-4 text-[14px] leading-7 text-brand-navy/75 min-[600px]:text-base">
                      {provider.name} is currently delivering{" "}
                      <span className="font-semibold text-brand-green">
                        {formatNaira(provider.amountReceived, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>{" "}
                      on a{" "}
                      <span className="font-semibold text-brand-navy">
                        {formatCurrency(
                          selectedReviewComparison.amount,
                          selectedReviewComparison.sourceCurrency,
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }
                        )}
                      </span>{" "}
                      send from {reviewCountry}. {provider.trustNote}
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[12px] bg-brand-light px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
                          Best for
                        </p>
                        <p className="mt-2 text-[12px] font-semibold text-brand-navy min-[600px]:text-sm">
                          {provider.bestFor}
                        </p>
                      </div>

                      <div className="rounded-[12px] bg-brand-light px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
                          Delivery
                        </p>
                        <p className="mt-2 text-[12px] font-semibold text-brand-navy min-[600px]:text-sm">
                          {provider.deliveryLabel}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-brand-navy/10 pt-4">
                      <p className="text-[12px] text-brand-navy/60 min-[600px]:text-sm">
                        Supported by live provider ratings and current payout data
                        for the {reviewCountry} to Nigeria route.
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <section className="rounded-[16px] border border-brand-navy/10 bg-white px-4 py-5 shadow-float min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                FAQ
              </p>
              <h2 className="mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                Questions Nigerian diaspora senders ask most
              </h2>

              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-[16px] bg-brand-light p-4 min-[600px]:p-5"
                  >
                    <summary className="cursor-pointer list-none text-[14px] font-semibold text-brand-navy min-[600px]:text-base">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm min-[600px]:leading-7">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </section>

        <div className="fixed inset-x-4 bottom-24 z-30 md:hidden">
          <button
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-brand-yellow px-5 text-base font-bold text-brand-navy shadow-float"
            type="button"
            onClick={handleCompare}
          >
            Compare Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
      <AIAssistant comparison={comparison} />
    </>
  );
}
