"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  BellRing,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  CreditCard,
  LineChart,
  ShieldCheck,
  Star
} from "lucide-react";

import { AIAssistant } from "@/components/AIAssistant";
import { AlertsForm } from "@/components/AlertsForm";
import { BestTimeToSend } from "@/components/BestTimeToSend";
import { ComparisonTable } from "@/components/ComparisonTable";
import { HeroSection } from "@/components/HeroSection";
import { RateChart } from "@/components/RateChart";
import { RateDisclaimer } from "@/components/RateDisclaimer";
import { SiteHeader } from "@/components/SiteHeader";
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
import {
  type ComparisonSort,
  type SenderCountry
} from "@/lib/providers";

interface HomePageShellProps {
  initialComparison: ComparisonResult;
}

type SectionTargetKey =
  | "alerts"
  | "bestTime"
  | "buildCredit"
  | "compare"
  | "howItWorks"
  | "rateChart"
  | "smartSending";

interface FeatureCardDefinition {
  ctaClassName: string;
  cta: string;
  description: string;
  icon: LucideIcon;
  iconBoxClassName: string;
  iconColorClassName: string;
  eyebrow: string;
  labelClassName: string;
  stripeClassName: string;
  targetKey: SectionTargetKey;
  title: string;
}

const featureCardDefinitions: FeatureCardDefinition[] = [
  {
    cta: "Explore credit cards",
    ctaClassName:
      "border-[#a5d6a7] bg-[#f1faf2] text-[#2e7d32] group-hover:border-[#2e7d32] group-hover:bg-[#2e7d32] group-hover:text-white hover:border-[#2e7d32] hover:bg-[#2e7d32] hover:text-white",
    description:
      "Explore immigrant-friendly card picks that help you earn rewards and strengthen your U.S. credit profile.",
    eyebrow: "BUILD CREDIT",
    icon: CreditCard,
    iconBoxClassName: "bg-[#e8f5e9]",
    iconColorClassName: "text-[#2e7d32]",
    labelClassName: "text-[#2e7d32]",
    stripeClassName: "bg-[#2e7d32]",
    targetKey: "buildCredit",
    title: "Build credit while you send from the USA"
  },
  {
    cta: "View the flow",
    ctaClassName:
      "border-[#ce93d8] bg-[#f3e5f5] text-[#5e35b1] group-hover:border-[#5e35b1] group-hover:bg-[#5e35b1] group-hover:text-white hover:border-[#5e35b1] hover:bg-[#5e35b1] hover:text-white",
    description:
      "See the simple path from entering your amount to choosing the provider that fits your speed and budget.",
    eyebrow: "HOW IT WORKS",
    icon: Clock3,
    iconBoxClassName: "bg-[#ede7f6]",
    iconColorClassName: "text-[#5e35b1]",
    labelClassName: "text-[#5e35b1]",
    stripeClassName: "bg-[#5e35b1]",
    targetKey: "howItWorks",
    title: "Understand the send journey"
  },
  {
    cta: "Set an alert",
    ctaClassName:
      "border-[#81d4fa] bg-[#e1f5fe] text-[#0288d1] group-hover:border-[#0288d1] group-hover:bg-[#0288d1] group-hover:text-white hover:border-[#0288d1] hover:bg-[#0288d1] hover:text-white",
    description:
      "Choose your target NGN level and let SaveRateAfrica notify you when the corridor is favorable.",
    eyebrow: "RATE ALERTS",
    icon: BellRing,
    iconBoxClassName: "bg-[#e1f5fe]",
    iconColorClassName: "text-[#0288d1]",
    labelClassName: "text-[#0288d1]",
    stripeClassName: "bg-[#0288d1]",
    targetKey: "alerts",
    title: "Track your target rate"
  },
  {
    cta: "See insights",
    ctaClassName:
      "border-[#ef9a9a] bg-[#fce4ec] text-[#c62828] group-hover:border-[#c62828] group-hover:bg-[#c62828] group-hover:text-white hover:border-[#c62828] hover:bg-[#c62828] hover:text-white",
    description:
      "Use best-value guidance, savings context, and timing signals before you send money home.",
    eyebrow: "SMART SENDING",
    icon: Activity,
    iconBoxClassName: "bg-[#fce4ec]",
    iconColorClassName: "text-[#c62828]",
    labelClassName: "text-[#c62828]",
    stripeClassName: "bg-[#c62828]",
    targetKey: "smartSending",
    title: "Get smarter route guidance"
  }
];

const reviewCountries = ["USA", "UK", "Canada"] as const;
const pageShellClassName =
  "mx-auto w-full max-w-[1200px] px-4 min-[600px]:px-6 lg:px-10";
const topLevelSectionInnerClassName = `${pageShellClassName} py-9 min-[600px]:py-[52px] lg:py-[72px]`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";

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
    document
      .querySelector("#compare-rates")
      ?.scrollIntoView({ behavior: "smooth" });
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
        <SiteHeader showAnnouncementBar />

        <HeroSection
          alertsAnchorRef={alertsRef}
          alertsContent={<AlertsForm variant="hero" />}
          amount={amount}
          isLoading={isLoading}
          senderCountry={senderCountry}
          onAmountChange={setAmount}
          onCompare={handleCompare}
          onSenderCountryChange={setSenderCountry}
        />

        <section id="feature-hub" className={`${sectionDividerClassName} scroll-mt-24`}>
          <div className={topLevelSectionInnerClassName}>
            <div className="mx-auto max-w-[1200px] border-t-[3px] border-[#2e7d32] bg-white px-4 py-7 min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-9">
              <div className="max-w-[480px]">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#2e7d32]">
                  FEATURE HUB
                </p>
                <h2 className="text-[20px] font-bold tracking-[-0.3px] text-[#1a2e1a]">
                  Browse every core tool from one organized layer
                </h2>
                <p className="mt-2 text-[12px] leading-[1.6] text-[#6a8a6a]">
                  Rate monitoring, credit-building support, and smart sending
                  tools — all in one place.
                </p>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-[14px] min-[600px]:grid-cols-2 lg:grid-cols-4">
                {featureCardDefinitions.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article
                      key={card.title}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[14px] border-[1.5px] border-[#e0ede2] bg-[#fafcfa] px-[18px] py-[22px] transition-all duration-200 ease-in-out hover:-translate-y-[3px] hover:border-[#b0d0b8] hover:shadow-[0_6px_20px_rgba(46,125,50,0.10)]"
                    >
                      <span
                        className={`absolute left-0 top-0 h-[3px] w-full rounded-t-[14px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${card.stripeClassName}`}
                      />
                      <div
                        className={`mb-4 inline-flex h-[44px] w-[44px] items-center justify-center rounded-[12px] ${card.iconBoxClassName}`}
                      >
                        <Icon className={`h-5 w-5 ${card.iconColorClassName}`} />
                      </div>
                      <p
                        className={`mb-[6px] text-[9px] font-semibold uppercase tracking-[1.5px] ${card.labelClassName}`}
                      >
                        {card.eyebrow}
                      </p>
                      <h3 className="mb-2 text-[14px] font-bold leading-[1.3] text-[#1a2e1a]">
                        {card.title}
                      </h3>
                      <p className="mb-4 flex-1 text-[11px] leading-[1.65] text-[#6a8a6a]">
                        {card.description}
                      </p>
                      <button
                        className={`mt-auto inline-flex w-fit items-center gap-[5px] self-start rounded-full border-[1.5px] px-[14px] py-[6px] text-[11px] font-semibold transition-all duration-200 ${card.ctaClassName}`}
                        type="button"
                        onClick={() => scrollToSection(sectionTargets[card.targetKey])}
                      >
                        {card.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="compare-rates" className={`${sectionDividerClassName} scroll-mt-24`}>
          <div className={topLevelSectionInnerClassName}>
            <div ref={compareRef}>
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

        <section id="faq" className={sectionDividerClassName}>
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
      </main>
      <AIAssistant comparison={comparison} />
    </>
  );
}
