"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BellRing,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  LineChart,
  PiggyBank,
  ShieldCheck,
  Star,
  Waves
} from "lucide-react";

import { AIAssistant } from "@/components/AIAssistant";
import { AlertsForm } from "@/components/AlertsForm";
import { BestTimeToSend } from "@/components/BestTimeToSend";
import { ComparisonTable } from "@/components/ComparisonTable";
import { HeroSection } from "@/components/HeroSection";
import { RateChart } from "@/components/RateChart";
import { RateDisclaimer } from "@/components/RateDisclaimer";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { formatCurrency, formatNaira } from "@/lib/format";
import {
  buildComparisonFromLiveRates,
  fetchRates,
  type ComparisonResult
} from "@/lib/fetchRates";
import { faqItems, howItWorksSteps, providerReviews } from "@/lib/site-data";
import type { ComparisonSort, SenderCountry } from "@/lib/providers";

interface HomePageShellProps {
  initialComparison: ComparisonResult;
}

type FeatureFilter = "all" | "alerts" | "credit" | "smart";
type SectionTargetKey =
  | "alerts"
  | "bestTime"
  | "buildCredit"
  | "compare"
  | "howItWorks"
  | "rateChart"
  | "smartSending";

interface FeatureStripItem {
  description: string;
  icon: LucideIcon;
  title: string;
}

interface FeatureCardDefinition {
  category: Exclude<FeatureFilter, "all">;
  cta: string;
  description: string;
  icon: LucideIcon;
  eyebrow: string;
  targetKey: SectionTargetKey;
  title: string;
}

const utilityLinks = [
  { href: "#contact-us", label: "Contact Us" },
  { href: "#rate-alerts", label: "Rate Alerts" }
] as const;

const primaryNavLinks = [
  { href: "#compare-rates", label: "Compare Rates" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#smart-sending", label: "Smart Sending" },
  { href: "#build-credit", label: "Build Credit" },
  { href: "#rate-alerts", label: "Rate Alerts" }
] as const;

const appDownloadButtons = [
  { href: "/manifest.webmanifest", label: "iOS App", variant: "light" },
  { href: "/manifest.webmanifest", label: "Android App", variant: "bold" }
] as const;

const featureStripItems: FeatureStripItem[] = [
  {
    icon: Waves,
    title: "Live Rate Comparison",
    description: "Compare live NGN payout, fees, and speed side by side."
  },
  {
    icon: BellRing,
    title: "Rate Alerts",
    description: "Track your target rate and get nudged when the market moves."
  },
  {
    icon: CreditCard,
    title: "Build U.S. Credit",
    description: "Explore starter card paths designed for diaspora senders."
  },
  {
    icon: LineChart,
    title: "Smart Sending Tips",
    description: "Use timing signals and route guidance before you transfer."
  },
  {
    icon: PiggyBank,
    title: "Fee Calculator",
    description: "See how much value different provider spreads can cost you."
  },
  {
    icon: BadgeCheck,
    title: "Diaspora Community",
    description: "Built around what Nigerians abroad need from each transfer."
  }
];

const statsStrip = [
  {
    label: "Providers",
    value: "10+",
    description: "Live providers compared"
  },
  {
    label: "Refresh",
    value: "5 min",
    description: "Automatic data refresh"
  },
  {
    label: "Accuracy",
    value: "98%",
    description: "Rate accuracy benchmark"
  },
  {
    label: "Hidden Fees",
    value: "$0",
    description: "Transparent pricing focus"
  }
] as const;

const featureFilters = [
  { id: "all", label: "All Features" },
  { id: "alerts", label: "Rate Alerts" },
  { id: "credit", label: "Build Credit" },
  { id: "smart", label: "Smart Sending" }
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
  const [comparison, setComparison] = useState(initialComparison);
  const [sortBy, setSortBy] = useState<ComparisonSort>(initialComparison.sortBy);
  const [activeFeatureFilter, setActiveFeatureFilter] =
    useState<FeatureFilter>("all");
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

  const filteredReviews = providerReviews.filter(
    (review) => review.country === reviewCountry
  );
  const bestValueProvider =
    comparison.providers.find((provider) => provider.isBestValue) ??
    comparison.providers[0];
  const visibleFeatureCards = featureCardDefinitions.filter(
    (card) => activeFeatureFilter === "all" || card.category === activeFeatureFilter
  );
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
      <main className="pb-32 md:pb-16">
        <header className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-3">
            <div className="rounded-[20px] border border-brand-navy/10 bg-white/80 px-4 py-2 shadow-float backdrop-blur">
              <div className="flex items-center justify-end gap-5 text-xs font-semibold text-brand-navy/70">
                {utilityLinks.map((item) => (
                  <Link
                    key={item.label}
                    className="hover:text-brand-green"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-brand-navy/10 bg-white/95 px-4 py-4 shadow-float backdrop-blur sm:px-5">
              <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[auto_1fr_auto] xl:items-center">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    className="font-heading text-2xl text-brand-navy sm:text-3xl"
                    href="/"
                  >
                    SaveRateAfrica
                  </Link>

                  <div className="flex items-center gap-2 xl:hidden">
                    {appDownloadButtons.map((button) => (
                      <a
                        key={button.label}
                        className={`inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-semibold ${
                          button.variant === "bold"
                            ? "bg-brand-yellow text-brand-navy"
                            : "bg-brand-light text-brand-navy"
                        }`}
                        download
                        href={button.href}
                      >
                        {button.label}
                      </a>
                    ))}
                  </div>
                </div>

                <nav
                  aria-label="Primary"
                  className="flex gap-2 overflow-x-auto xl:justify-center"
                >
                  {primaryNavLinks.map((item) => (
                    <Link
                      key={item.label}
                      className="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold text-brand-navy hover:bg-brand-light hover:text-brand-green"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="hidden items-center gap-2 xl:flex xl:justify-end">
                  {appDownloadButtons.map((button) => (
                    <a
                      key={button.label}
                      className={`inline-flex min-h-12 items-center rounded-2xl px-5 text-sm font-semibold ${
                        button.variant === "bold"
                          ? "bg-brand-yellow text-brand-navy"
                          : "bg-brand-light text-brand-navy"
                      }`}
                      download
                      href={button.href}
                    >
                      {button.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-brand-navy/10 bg-white shadow-float">
            <div className="flex gap-2 overflow-x-auto px-4 py-4 lg:grid lg:grid-cols-6 lg:gap-0 lg:px-0 lg:py-0">
              {featureStripItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="min-w-[220px] shrink-0 rounded-[24px] bg-brand-light/65 p-4 lg:min-w-0 lg:rounded-none lg:bg-transparent lg:px-5 lg:py-5 lg:first:border-l-0 lg:border-l lg:border-brand-navy/10"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-green shadow-float">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-base font-heading text-brand-navy">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-brand-navy/70">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <HeroSection
          amount={amount}
          isLoading={isLoading}
          senderCountry={senderCountry}
          onAmountChange={setAmount}
          onCompare={handleCompare}
          onSenderCountryChange={setSenderCountry}
        />

        <section className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statsStrip.map((stat) => (
              <article
                key={stat.label}
                className="rounded-[24px] border border-brand-navy/10 bg-white px-5 py-4 shadow-float"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                  {stat.label}
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <p className="font-heading text-3xl text-brand-navy">{stat.value}</p>
                  <p className="text-right text-sm leading-5 text-brand-navy/60">
                    {stat.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                  Feature hub
                </p>
                <h2 className="mt-2 font-heading text-3xl text-brand-navy">
                  Browse every core tool from one organized layer
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-navy/70">
                  Use the filters to jump between rate monitoring, credit-building
                  support, and the smart sending tools already inside the
                  homepage.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {featureFilters.map((filter) => (
                  <button
                    key={filter.id}
                    className={`min-h-12 rounded-full px-4 text-sm font-semibold transition ${
                      activeFeatureFilter === filter.id
                        ? "bg-brand-navy text-white"
                        : "bg-brand-light text-brand-navy hover:bg-brand-green/10"
                    }`}
                    type="button"
                    onClick={() => setActiveFeatureFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {visibleFeatureCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="flex h-full flex-col rounded-[24px] bg-brand-light p-5"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-green shadow-float">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                      {card.eyebrow}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl text-brand-navy">
                      {card.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-brand-navy/70">
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
        </section>

        <section className="px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8 lg:space-y-10">
            <div id="compare-rates" ref={compareRef} className="scroll-mt-24">
              <ComparisonTable
                comparison={comparison}
                errorMessage={errorMessage}
                isLoading={isLoading}
                nextRefreshAt={nextRefreshAt}
                onSortChange={handleSortChange}
              />
            </div>

            <RateDisclaimer />

            <section
              id="how-it-works"
              ref={howItWorksRef}
              className="scroll-mt-24 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-start"
            >
              <SavingsCalculator comparison={comparison} />

              <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                  How it works
                </p>
                <h2 className="mt-2 font-heading text-3xl text-brand-navy">
                  A clearer route from diaspora wallet to Nigerian bank account
                </h2>
                <div className="mt-6 space-y-4">
                  {howItWorksSteps.map((step) => (
                    <div
                      key={step.step}
                      className="rounded-[24px] bg-brand-light p-5"
                    >
                      <div className="inline-flex rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white">
                        Step {step.step}
                      </div>
                      <h3 className="mt-3 text-xl font-heading text-brand-navy">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-brand-navy/70">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              id="smart-sending"
              ref={smartSendingRef}
              className="scroll-mt-24 rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                <div className="lg:max-w-sm">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/30">
                    <CircleDollarSign className="h-6 w-6 text-brand-navy" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                    Smart sending
                  </p>
                  <h2 className="mt-2 font-heading text-3xl text-brand-navy">
                    Move more value with less friction
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-brand-navy/70">
                    See the strongest route recommendation right after the send
                    form so first-time visitors get immediate clarity on where
                    their money goes furthest.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm leading-7 text-brand-navy/70">
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
                  <p className="text-sm leading-7 text-brand-navy/70">
                    SaveRateAfrica compares effective value, transfer fee, and
                    speed together so you can choose based on what matters
                    today: urgency, cost, or payout.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-brand-light px-4 py-3">
                      <CheckCircle2 className="h-5 w-5 text-brand-green" />
                      <span className="text-sm text-brand-navy/75">
                        Best provider right now: {comparison.savings.bestProvider}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-brand-light px-4 py-3">
                      <ShieldCheck className="h-5 w-5 text-brand-green" />
                      <span className="text-sm text-brand-navy/75">
                        Every provider is shown with rating, speed, and payout
                        channel context
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-brand-light px-4 py-3">
                      <LineChart className="h-5 w-5 text-brand-green" />
                      <span className="text-sm text-brand-navy/75">
                        Trend signals help you avoid poor timing and guesswork
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
              <div id="market-timing" ref={bestTimeRef} className="scroll-mt-24">
                <BestTimeToSend comparison={comparison} />
              </div>

              <div id="rate-alerts" ref={alertsRef} className="scroll-mt-24">
                <AlertsForm />
              </div>
            </section>

            <section
              id="build-credit"
              ref={buildCreditRef}
              className="scroll-mt-24 rounded-[28px] border border-brand-navy/10 bg-brand-navy p-6 text-white shadow-float sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                    Need more ways to save?
                  </p>
                  <h2 className="mt-2 font-heading text-3xl">
                    Build credit while you send from the USA
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
                    Explore immigrant-friendly card picks that help you earn
                    rewards, improve approval odds, and strengthen your U.S.
                    credit profile.
                  </p>
                </div>

                <div className="flex justify-start lg:justify-end">
                  <Link
                    className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-yellow px-5 text-sm font-bold text-brand-navy transition hover:shadow-float"
                    href="/credit-cards"
                  >
                    Explore credit cards
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            <div id="rate-chart" ref={rateChartRef} className="scroll-mt-24">
              <RateChart />
            </div>

            <section className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                    Provider reviews
                  </p>
                  <h2 className="mt-2 font-heading text-3xl text-brand-navy">
                    Built for Nigerians sending from North America and the UK
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["USA", "UK", "Canada"] as const).map((country) => (
                    <button
                      key={country}
                      className={`min-h-12 rounded-2xl px-4 text-sm font-semibold transition ${
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

              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {filteredReviews.map((review) => (
                  <article
                    key={`${review.country}-${review.name}`}
                    className="rounded-[24px] bg-brand-light p-5"
                  >
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${review.name}-${index}`}
                          className={`h-4 w-4 ${
                            index < review.rating
                              ? "fill-brand-yellow text-brand-yellow"
                              : "text-brand-navy/20"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-base leading-7 text-brand-navy/75">
                      "{review.quote}"
                    </p>
                    <div className="mt-5 border-t border-brand-navy/10 pt-4">
                      <p className="font-semibold text-brand-navy">{review.name}</p>
                      <p className="text-sm text-brand-navy/60">
                        {review.role} · uses {review.provider}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                FAQ
              </p>
              <h2 className="mt-2 font-heading text-3xl text-brand-navy">
                Questions Nigerian diaspora senders ask most
              </h2>

              <div className="mt-6 space-y-4">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-[24px] bg-brand-light p-5"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-brand-navy">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-brand-navy/70">
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
