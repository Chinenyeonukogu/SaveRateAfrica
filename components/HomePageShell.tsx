"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Star
} from "lucide-react";
import Link from "next/link";

import { ComparisonTable } from "@/components/ComparisonTable";
import { HomeHero } from "@/components/HomeHero";
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

const reviewCountries = ["USA", "UK", "Canada"] as const;
const pageShellClassName = "mx-auto w-full max-w-[1200px] px-6";
const comparisonSectionInnerClassName = `${pageShellClassName} py-9 min-[600px]:py-[52px] lg:py-[72px]`;
const postComparisonSectionInnerClassName = `${pageShellClassName} py-6 min-[600px]:py-8 lg:py-10`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";

function NotebookPenIllustration() {
  return (
    <svg aria-hidden="true" className="h-[92px] w-[112px]" viewBox="0 0 112 92">
      <rect fill="#ffffff" height="62" rx="10" stroke="#d9eadb" strokeWidth="2" width="72" x="16" y="20" />
      <path d="M31 20v62" stroke="#c8e6c9" strokeWidth="2" />
      <path d="M43 36h28M43 49h22M43 62h31" stroke="#8aa58f" strokeLinecap="round" strokeWidth="3" />
      <path d="m70 68 22-40 10 6-22 40-14 8 4-14Z" fill="#f6c619" />
      <path d="m92 28 5-9 10 6-5 9Z" fill="#1a3a2a" />
      <path d="m70 68-4 14 14-8Z" fill="#2e7d32" />
      <circle cx="21" cy="32" fill="#2e7d32" r="3" />
      <circle cx="21" cy="46" fill="#2e7d32" r="3" />
      <circle cx="21" cy="60" fill="#2e7d32" r="3" />
    </svg>
  );
}

function TabletPersonIllustration() {
  return (
    <svg aria-hidden="true" className="h-[96px] w-[118px]" viewBox="0 0 118 96">
      <rect fill="#ffffff" height="58" rx="12" stroke="#d9eadb" strokeWidth="2" width="76" x="34" y="24" />
      <rect fill="#e8f5e9" height="34" rx="7" width="52" x="46" y="35" />
      <path d="M55 47h34M55 57h25" stroke="#2e7d32" strokeLinecap="round" strokeWidth="4" />
      <circle cx="30" cy="30" fill="#1a3a2a" r="13" />
      <path d="M12 85c2-22 12-35 28-35s26 13 28 35Z" fill="#2e7d32" />
      <path d="M24 53c5 6 16 6 22 0" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
      <path d="M58 75h39" stroke="#1a3a2a" strokeLinecap="round" strokeWidth="4" />
      <circle cx="101" cy="53" fill="#f6c619" r="4" />
    </svg>
  );
}

function PhoneReviewIllustration() {
  return (
    <svg aria-hidden="true" className="h-[98px] w-[116px]" viewBox="0 0 116 98">
      <rect fill="#1a3a2a" height="82" rx="14" width="52" x="44" y="8" />
      <rect fill="#ffffff" height="64" rx="9" width="42" x="49" y="18" />
      <circle cx="70" cy="75" fill="#2e7d32" r="3" />
      <rect fill="#e8f5e9" height="11" rx="5.5" width="30" x="55" y="28" />
      <rect fill="#f6c619" height="11" rx="5.5" width="22" x="55" y="45" />
      <path d="M59 63h22" stroke="#8aa58f" strokeLinecap="round" strokeWidth="3" />
      <path d="m22 35 5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2 5-10Z" fill="#2e7d32" />
      <path d="M23 78c11-3 23-3 34 0" stroke="#f6c619" strokeLinecap="round" strokeWidth="5" />
      <circle cx="100" cy="26" fill="#f6c619" r="7" />
    </svg>
  );
}

function LearnIcon({ type }: { type: "blog" | "video" | "review" }) {
  if (type === "video") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
        <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
      </svg>
    );
  }

  if (type === "review") {
    return (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path d="M5 4.8C5 3.8 5.8 3 6.8 3H19v16H7.8A2.8 2.8 0 0 0 5 21.8v-17Z" fill="currentColor" opacity="0.35" />
      <path d="M5 4.8A2.8 2.8 0 0 1 7.8 2H19v16H7.8A2.8 2.8 0 0 0 5 20.8v-16Zm4.5 3.7h6M9.5 12h4.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

const learnCards = [
  {
    type: "blog" as const,
    title: "Money transfer guides",
    description: "Read practical tips on rates, fees, timing, and smarter ways to send to Nigeria.",
    cta: "Read articles",
    href: "/blog",
    imageSrc: "/learn/money-transfer-guides.jpg",
    imageAlt: "Notebook, laptop, coffee, and desk setup for money transfer guides",
    mediaClassName: "bg-[#e8f5e9]",
    labelClassName: "text-[#2e7d32]",
    illustration: <NotebookPenIllustration />
  },
  {
    type: "video" as const,
    title: "Quick video explainers",
    description: "Watch simple breakdowns for comparing providers and avoiding transfer mistakes.",
    cta: "Watch now",
    href: "/learn/stop-losing-money.mp4",
    imageSrc: "/learn/quick-video.png",
    imageAlt: "Person watching a SaveRateAfrica money transfer video on a phone",
    mediaClassName: "bg-[#fff8e1]",
    labelClassName: "text-[#d88a00]",
    illustration: <TabletPersonIllustration />
  },
  {
    type: "review" as const,
    title: "Provider reviews",
    description: "Explore provider guides before choosing where to send your next transfer.",
    cta: "Explore guides",
    href: "/providers",
    imageSrc: "/learn/provider-review.png",
    imageAlt: "Provider reviews screen showing transfer providers and ratings",
    mediaClassName: "bg-[#f4faf5]",
    labelClassName: "text-[#2e7d32]",
    illustration: <PhoneReviewIllustration />
  }
] as const;

function LearnAndSaveMoreSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-6 min-[600px]:py-7 lg:py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-[18px] font-extrabold leading-tight text-[#1a3a2a] min-[600px]:text-[22px]">
            Learn &amp; save more
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {learnCards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white"
            >
              <div className={`relative h-[110px] overflow-hidden ${card.mediaClassName}`}>
                <Image
                  alt={card.imageAlt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={card.imageSrc}
                />
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#2e7d32] text-white shadow-[0_8px_18px_rgba(46,125,50,0.24)]">
                  <LearnIcon type={card.type} />
                </div>
              </div>

              <div className="flex min-h-[128px] flex-col px-4 py-3">
                <h3 className="text-[13px] font-extrabold leading-[1.35] text-[#1a3a2a]">
                  {card.title}
                </h3>
                <p className="mt-2 text-[11px] font-medium leading-[1.6] text-[#666666]">
                  {card.description}
                </p>
                <Link
                  className={`mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-extrabold ${card.labelClassName}`}
                  href={card.href}
                >
                  {card.cta} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
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
  const alertsRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    function scrollToHashTarget() {
      const targetId = window.location.hash.replace("#", "");

      if (targetId !== "how-it-works") {
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

  function handleCompare() {
    document
      .querySelector("#compare-rates")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSortChange(nextSort: ComparisonSort) {
    setSortBy(nextSort);
  }

  const liveReviewComparisons = buildLiveReviewComparisons(comparison);
  const selectedReviewComparison = liveReviewComparisons[reviewCountry];
  const liveReviewProviders = selectedReviewComparison.providers.slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main className="overflow-x-hidden pb-32 md:pb-20">
        <HomeHero
          alertsAnchorRef={alertsRef}
          amount={amount}
          isLoading={isLoading}
          senderCountry={senderCountry}
          onAmountChange={setAmount}
          onCompare={handleCompare}
          onSenderCountryChange={setSenderCountry}
        />

        <LearnAndSaveMoreSection />

        <section id="compare-rates" className={sectionDividerClassName}>
          <div className={comparisonSectionInnerClassName}>
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

        <section className={sectionDividerClassName}>
          <div className={postComparisonSectionInnerClassName}>
            <div id="rate-chart" ref={rateChartRef}>
              <RateChart />
            </div>
          </div>
        </section>

        <section id="faq" className={sectionDividerClassName}>
          <div className={postComparisonSectionInnerClassName}>
            <section
              id="how-it-works"
              ref={howItWorksRef}
              className="rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-6 lg:px-8 lg:py-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                How it works
              </p>
              <h2 className="mb-4 mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                A clearer route from diaspora wallet to Nigerian bank account
              </h2>

              <div className="grid gap-4 lg:grid-cols-3 lg:gap-0">
                {howItWorksSteps.map((step, index) => (
                  <article
                    key={step.step}
                    className={`relative lg:px-6 ${
                      index < howItWorksSteps.length - 1
                        ? "border-b border-[#e8f5e9] pb-4 lg:border-b-0"
                        : ""
                    } ${index > 0 ? "pt-4 lg:pt-0" : ""}`}
                  >
                    {index < howItWorksSteps.length - 1 ? (
                      <span className="absolute right-0 top-3 hidden h-[52px] border-r border-[#c8e6c9] lg:block" />
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
          <div className={postComparisonSectionInnerClassName}>
            <section className="rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-6 lg:px-8 lg:py-8">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                    Live provider reviews
                  </p>
                  <h2 className="mb-4 mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                    Real-time provider pulse for Nigerians sending abroad
                  </h2>
                  <p className="text-[12px] text-brand-navy/60 min-[600px]:text-sm">
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

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {liveReviewProviders.map((provider) => (
                  <article
                    key={`${reviewCountry}-${provider.slug}`}
                    className="rounded-[12px] border border-[#c8e6c9] bg-white p-5"
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
                          Top pick now
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-brand-navy/60 min-[600px]:text-sm">
                      <span className="font-semibold text-brand-green">
                        {provider.name}
                      </span>
                      <span>{provider.rating.toFixed(1)} rating</span>
                      <span>{formatCompact(provider.reviewCount)} reviews</span>
                    </div>

                    <p className="mt-3 text-[14px] leading-7 text-brand-navy/75 min-[600px]:text-base">
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

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[12px] bg-brand-light px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
                          Popular for
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

                    <div className="mt-4 border-t border-brand-navy/10 pt-4">
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
          <div className={postComparisonSectionInnerClassName}>
            <section className="rounded-[16px] border border-brand-navy/10 bg-white px-4 py-5 shadow-float min-[600px]:px-6 min-[600px]:py-6 lg:px-8 lg:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                FAQ
              </p>
              <h2 className="mb-4 mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
                Questions Nigerian diaspora senders ask most
              </h2>

              <div className="space-y-4">
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
