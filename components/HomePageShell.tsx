"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BellRing,
  Bot,
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

interface SlimFeatureItemDefinition {
  icon: LucideIcon;
  iconBoxClassName: string;
  iconColorClassName: string;
  kind: "ai" | "link";
  subtitle: string;
  title: string;
  href?: string;
  sectionId?: string;
}

const slimFeatureItems: SlimFeatureItemDefinition[] = [
  {
    kind: "link",
    href: "/credit-cards",
    icon: CreditCard,
    iconBoxClassName: "bg-[#e8f5e9]",
    iconColorClassName: "text-[#2e7d32]",
    subtitle: "Cards for the Nigerian diaspora",
    title: "Build Credit"
  },
  {
    kind: "link",
    href: "/#how-it-works",
    sectionId: "how-it-works",
    icon: Clock3,
    iconBoxClassName: "bg-[#ede7f6]",
    iconColorClassName: "text-[#5e35b1]",
    subtitle: "Your 3-step send journey",
    title: "How It Works"
  },
  {
    kind: "link",
    href: "/alerts",
    sectionId: "rate-alerts",
    icon: BellRing,
    iconBoxClassName: "bg-[#e1f5fe]",
    iconColorClassName: "text-[#0288d1]",
    subtitle: "Get notified at your target",
    title: "Rate Alerts"
  },
  {
    kind: "link",
    href: "/#smart-sending",
    sectionId: "smart-sending",
    icon: Activity,
    iconBoxClassName: "bg-[#fce4ec]",
    iconColorClassName: "text-[#c62828]",
    subtitle: "Best time and route guidance",
    title: "Smart Sending"
  },
  {
    kind: "ai",
    icon: Bot,
    iconBoxClassName: "bg-[#f4faf5]",
    iconColorClassName: "text-[#2e7d32]",
    subtitle: "Open the live assistant",
    title: "Ask AI"
  }
];

const reviewCountries = ["USA", "UK", "Canada"] as const;
const pageShellClassName = "mx-auto w-full max-w-[1200px] px-6";
const topLevelSectionInnerClassName = `${pageShellClassName} py-9 min-[600px]:py-[52px] lg:py-[72px]`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";
const featureHrefBySectionId = slimFeatureItems.reduce<Record<string, string>>(
  (sectionHrefMap, item) => {
    if (item.sectionId && item.href) {
      sectionHrefMap[item.sectionId] = item.href;
    }

    return sectionHrefMap;
  },
  {}
);
const observedHomepageSectionIds = [
  "compare-rates",
  "rate-alerts",
  "how-it-works",
  "smart-sending",
  "market-timing",
  "rate-chart",
  "contact"
] as const;

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
  const [activeFeatureHref, setActiveFeatureHref] = useState<string | null>(null);
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

  useEffect(() => {
    function scrollToHashTarget() {
      const targetId = window.location.hash.replace("#", "");

      if (targetId !== "how-it-works" && targetId !== "smart-sending") {
        return;
      }

      window.requestAnimationFrame(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    scrollToHashTarget();
    window.addEventListener("hashchange", scrollToHashTarget);

    return () => {
      window.removeEventListener("hashchange", scrollToHashTarget);
    };
  }, []);

  useEffect(() => {
    const sections = observedHomepageSectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const stickyOffset = 125;
    const visibleSections = new Map<string, number>();

    const updateActiveFeature = () => {
      const nextSectionId =
        [...visibleSections.entries()]
          .filter(([sectionId]) => Boolean(featureHrefBySectionId[sectionId]))
          .sort((entryA, entryB) => entryB[1] - entryA[1])[0]?.[0] ?? null;
      const nextActiveHref = nextSectionId
        ? featureHrefBySectionId[nextSectionId] ?? null
        : null;

      setActiveFeatureHref((currentHref) =>
        currentHref === nextActiveHref ? currentHref : nextActiveHref
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            visibleSections.delete(entry.target.id);
            return;
          }

          visibleSections.set(
            entry.target.id,
            entry.intersectionRatio +
              (entry.boundingClientRect.top <= stickyOffset ? 0.1 : 0)
          );
        });

        updateActiveFeature();
      },
      {
        rootMargin: `-${stickyOffset}px 0px -45% 0px`,
        threshold: [0, 0.15, 0.35, 0.55]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  function handleCompare() {
    document
      .querySelector("#compare-rates")
      ?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <>
      <SiteHeader showAnnouncementBar />

      <main className="overflow-x-hidden pb-32 md:pb-20">

        <section
          id="feature-hub"
          className="sticky top-[60px] z-[999] hidden border-b border-[#e0ede2] bg-white shadow-[0_2px_8px_rgba(46,125,50,0.07)] min-[600px]:block"
        >
          <div className="mx-auto grid max-w-[1100px] min-[600px]:grid-cols-3 min-[600px]:px-4 lg:grid-cols-5 lg:px-7">
              {slimFeatureItems.map((item, index) => {
                const Icon = item.icon;
                const isActiveFeature = item.href === activeFeatureHref;
                const tabletRightBorderClassName =
                  index === 0 || index === 1 || index === 3
                    ? "min-[600px]:max-[1023px]:border-r"
                    : "";
                const tabletBottomBorderClassName =
                  index < 3 ? "min-[600px]:max-[1023px]:border-b" : "";
                const desktopRightBorderClassName =
                  index < slimFeatureItems.length - 1 ? "lg:border-r" : "";
                const itemClassName = `group flex cursor-pointer items-center gap-3 border-[#e8f0e8] px-5 py-[14px] no-underline transition-colors duration-200 hover:bg-[#f4faf5] ${tabletRightBorderClassName} ${tabletBottomBorderClassName} ${desktopRightBorderClassName}`;
                const iconBoxClassName = `flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] transition-[transform,box-shadow] duration-[180ms] group-hover:scale-[1.06] ${item.iconBoxClassName} ${
                  isActiveFeature ? "shadow-[0_0_0_2px_#2e7d32]" : ""
                }`;
                const titleClassName = isActiveFeature
                  ? "whitespace-nowrap text-[12px] font-bold leading-[1.3] text-[#1b5e20] transition-colors duration-[180ms]"
                  : "whitespace-nowrap text-[12px] font-semibold leading-[1.3] text-[#1a2e1a] transition-colors duration-[180ms] group-hover:text-[#1b5e20]";

                if (item.kind === "ai") {
                  return (
                    <AIAssistant
                      key={item.title}
                      comparison={comparison}
                      floatingButtonClassName="min-[600px]:hidden"
                      renderTrigger={(openPanel) => (
                        <button
                          className={itemClassName}
                          type="button"
                          onClick={openPanel}
                        >
                          <div className={iconBoxClassName}>
                            <Icon className={`h-5 w-5 ${item.iconColorClassName}`} />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-[2px] text-left">
                            <span className={titleClassName}>
                              {item.title}
                            </span>
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] leading-[1.4] text-[#7a9a7a]">
                              {item.subtitle}
                            </span>
                          </div>
                        </button>
                      )}
                      showFloatingButton
                    />
                  );
                }

                return (
                  <Link
                    key={item.title}
                    aria-current={isActiveFeature ? "location" : undefined}
                    className={itemClassName}
                    href={item.href ?? "/"}
                  >
                    <div className={iconBoxClassName}>
                      <Icon className={`h-5 w-5 ${item.iconColorClassName}`} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                      <span className={titleClassName}>
                        {item.title}
                      </span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] leading-[1.4] text-[#7a9a7a]">
                        {item.subtitle}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>

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

        <section id="compare-rates" className={sectionDividerClassName}>
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
              className="rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-10"
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
              className="rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-8 lg:px-8 lg:py-10"
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
            <div id="market-timing" ref={bestTimeRef}>
              <BestTimeToSend comparison={comparison} />
            </div>
          </div>
        </section>

        <section className={sectionDividerClassName}>
          <div className={topLevelSectionInnerClassName}>
            <div id="rate-chart" ref={rateChartRef}>
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
    </>
  );
}
