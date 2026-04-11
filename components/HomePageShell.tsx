"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Star
} from "lucide-react";

import { AIAssistant } from "@/components/AIAssistant";
import { AlertsForm } from "@/components/AlertsForm";
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

const reviewCountries = ["USA", "UK", "Canada"] as const;
const pageShellClassName = "mx-auto w-full max-w-[1200px] px-6";
const topLevelSectionInnerClassName = `${pageShellClassName} py-9 min-[600px]:py-[52px] lg:py-[72px]`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";
const smartSendingChecklistItems = [
  "Compare multiple trusted providers in one place to find the best overall value",
  "See exactly how much your recipient will receive after all fees",
  "Understand trade-offs between speed, cost, and payout methods",
  "Avoid hidden charges and poor exchange rates before they cost you",
  "Use our AI assistant to instantly find the best rates and get personalized recommendations"
] as const;

function SmartSendingIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full max-w-[320px]"
      viewBox="0 0 360 280"
    >
      <defs>
        <linearGradient id="smart-sending-bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#fffdf2" />
          <stop offset="100%" stopColor="#f8faf8" />
        </linearGradient>
        <linearGradient id="coin-top" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ffe58a" />
          <stop offset="100%" stopColor="#f6c028" />
        </linearGradient>
        <linearGradient id="coin-side" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#f7c83d" />
          <stop offset="100%" stopColor="#d99d00" />
        </linearGradient>
        <linearGradient id="shield-front" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#6fcd46" />
          <stop offset="100%" stopColor="#12691d" />
        </linearGradient>
        <linearGradient id="shield-inner" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#3da833" />
          <stop offset="100%" stopColor="#0d5d18" />
        </linearGradient>
        <filter id="smart-sending-shadow" colorInterpolationFilters="sRGB" height="160%" width="160%" x="-30%" y="-30%">
          <feDropShadow dx="0" dy="16" floodColor="#0d1f12" floodOpacity="0.16" stdDeviation="12" />
        </filter>
      </defs>

      <rect fill="url(#smart-sending-bg)" height="280" rx="24" width="360" />

      <g fill="#eef4ef" opacity="0.9">
        <path d="M36 14h94l-122 122V42c0-15.46 12.54-28 28-28Z" />
        <path d="M271 0h89v89L196 253h-74L271 0Z" opacity="0.55" />
        <path d="M360 189v91H269l91-91Z" opacity="0.7" />
      </g>

      <g filter="url(#smart-sending-shadow)">
        <ellipse cx="158" cy="228" fill="#0d1f12" opacity="0.12" rx="112" ry="18" />

        <g transform="translate(64 82)">
          <ellipse cx="34" cy="0" fill="url(#coin-top)" rx="34" ry="10" />
          <rect fill="url(#coin-side)" height="78" rx="6" width="68" y="0" />
          <ellipse cx="34" cy="78" fill="#dca313" rx="34" ry="10" />
          {[16, 32, 48, 64].map((offset) => (
            <ellipse key={`stack-left-${offset}`} cx="34" cy={offset} fill="none" rx="34" ry="10" stroke="#9c6b00" strokeWidth="2" />
          ))}
        </g>

        <g transform="translate(112 34)">
          <ellipse cx="42" cy="0" fill="url(#coin-top)" rx="42" ry="12" />
          <rect fill="url(#coin-side)" height="116" rx="7" width="84" y="0" />
          <ellipse cx="42" cy="116" fill="#dca313" rx="42" ry="12" />
          {[20, 40, 60, 80, 100].map((offset) => (
            <ellipse key={`stack-tall-${offset}`} cx="42" cy={offset} fill="none" rx="42" ry="12" stroke="#9c6b00" strokeWidth="2" />
          ))}
        </g>

        <g transform="translate(188 78)">
          <ellipse cx="38" cy="0" fill="url(#coin-top)" rx="38" ry="11" />
          <rect fill="url(#coin-side)" height="92" rx="6" width="76" y="0" />
          <ellipse cx="38" cy="92" fill="#dca313" rx="38" ry="11" />
          {[18, 36, 54, 72].map((offset) => (
            <ellipse key={`stack-right-${offset}`} cx="38" cy={offset} fill="none" rx="38" ry="11" stroke="#9c6b00" strokeWidth="2" />
          ))}
        </g>

        <g transform="translate(98 128)">
          <ellipse cx="40" cy="0" fill="url(#coin-top)" rx="40" ry="11" />
          <rect fill="url(#coin-side)" height="68" rx="6" width="80" y="0" />
          <ellipse cx="40" cy="68" fill="#dca313" rx="40" ry="11" />
          {[17, 34, 51].map((offset) => (
            <ellipse key={`stack-front-${offset}`} cx="40" cy={offset} fill="none" rx="40" ry="11" stroke="#9c6b00" strokeWidth="2" />
          ))}
        </g>

        <g transform="translate(228 104)">
          <path
            d="M54 0c19 13 37 18 54 20v43c0 35-23 67-54 83C23 130 0 98 0 63V20C18 18 35 13 54 0Z"
            fill="url(#shield-front)"
          />
          <path
            d="M54 14c13 8 26 11 40 13v34c0 24-15 47-40 60-25-13-40-36-40-60V27c14-2 27-5 40-13Z"
            fill="url(#shield-inner)"
            opacity="0.9"
          />
          <path
            d="M44 44h16v26h25v15H60v30H45V85H20V70h25V44Z"
            fill="#ffffff"
          />
        </g>
      </g>
    </svg>
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
      <SiteHeader showAnnouncementBar />

      <main className="overflow-x-hidden pb-32 md:pb-20">
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

        <AIAssistant comparison={comparison} />

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
              <div className="flex flex-col gap-8 rounded-[14px] bg-[#f4faf5] p-6 min-[600px]:p-8 lg:flex-row lg:items-center lg:gap-12 lg:p-12">
                <div className="flex shrink-0 flex-col items-center">
                  <SmartSendingIllustration />
                  <p className="mt-4 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a7a4a]">
                    Smart Sending
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-4">
                  <div>
                    <h2 className="mb-[10px] text-[26px] font-extrabold leading-[1.25] text-[#0d1f12]">
                      Send smarter. Keep more of your money.
                    </h2>
                    <p className="text-[14px] font-medium leading-[1.75] text-[#2d4a35]">
                      Get clear, real-time insights before you send so you can choose
                      the option that gives you the most value — whether that&apos;s
                      better rates, lower fees, or faster delivery.
                    </p>
                  </div>

                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1a7a4a]">
                    SaveRateAfrica helps you:
                  </p>

                  <div>
                    {smartSendingChecklistItems.map((item) => (
                      <div key={item} className="mb-[10px] flex items-start gap-[11px]">
                        <span className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#1a5c2a]">
                          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                        </span>
                        <p className="text-[13px] font-semibold leading-[1.55] text-[#0d1f12]">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="border-l-[3px] border-[#1a5c2a] pl-3 text-[14px] font-semibold leading-[1.7] text-[#2d4a35]">
                    Make confident decisions and send money knowing you&apos;re
                    getting the best deal available.
                  </p>
                </div>
              </div>
            </section>
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
