"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  LineChart,
  CheckCircle2,
  CircleDollarSign,
  ShieldCheck,
  Star
} from "lucide-react";

import { ComparisonTable } from "@/components/ComparisonTable";
import { HeroSection } from "@/components/HeroSection";
import { RateChart } from "@/components/RateChart";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { AlertsForm } from "@/components/AlertsForm";
import { formatNaira } from "@/lib/format";
import {
  buildComparisonFromLiveRates,
  fetchRates,
  type ComparisonResult
} from "@/lib/fetchRates";
import { RateDisclaimer } from "@/components/RateDisclaimer";
import {
  faqItems,
  howItWorksSteps,
  providerReviews
} from "@/lib/site-data";
import type { ComparisonSort, SenderCountry } from "@/lib/providers";

interface HomePageShellProps {
  initialComparison: ComparisonResult;
}

export function HomePageShell({ initialComparison }: HomePageShellProps) {
  const compareRef = useRef<HTMLDivElement | null>(null);
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
  const latestRequestIdRef = useRef(0);

  async function refreshComparison(
    nextSort = sortByRef.current,
    signal?: AbortSignal
  ) {
    const parsedAmount = Number.parseFloat(amountRef.current);
    const normalizedAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
      ? parsedAmount
      : 1;
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
      Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 1;

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

  function handleSortChange(nextSort: ComparisonSort) {
    setSortBy(nextSort);
  }

  const filteredReviews = providerReviews.filter(
    (review) => review.country === reviewCountry
  );
  const bestValueProvider =
    comparison.providers.find((provider) => provider.isBestValue) ??
    comparison.providers[0];

  return (
    <>
      <main className="pb-32 md:pb-16">
        <HeroSection
          amount={amount}
          isLoading={isLoading}
          senderCountry={senderCountry}
          onAmountChange={setAmount}
          onCompare={handleCompare}
          onSenderCountryChange={setSenderCountry}
        />

        <section className="px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-12">
            <div ref={compareRef}>
              <ComparisonTable
                comparison={comparison}
                errorMessage={errorMessage}
                isLoading={isLoading}
                nextRefreshAt={nextRefreshAt}
                onSortChange={handleSortChange}
              />
            </div>

            <RateDisclaimer />

            <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
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

              <SavingsCalculator comparison={comparison} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <RateChart />

              <div className="space-y-6">
                <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/30">
                    <CircleDollarSign className="h-6 w-6 text-brand-navy" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
                    Smart sending
                  </p>
                  <h3 className="mt-2 font-heading text-3xl text-brand-navy">
                    Move more value with less friction
                  </h3>
                  <div className="mt-5 space-y-4 text-sm leading-7 text-brand-navy/70">
                    <p>
                      Your best live route right now is{" "}
                      <span className="font-semibold text-brand-navy">
                        {bestValueProvider?.name}
                      </span>
                      , delivering up to{" "}
                      <span className="font-semibold text-brand-green">
                        {formatNaira(bestValueProvider?.amountReceived ?? 0)}
                      </span>{" "}
                      on this transfer.
                    </p>
                    <p>
                      SaveRateAfrica compares effective value, transfer fee, and
                      speed together so you can choose based on what matters
                      today: urgency, cost, or payout.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3">
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

                <div className="rounded-[28px] border border-brand-navy/10 bg-brand-navy p-6 text-white shadow-float">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
                    Need more ways to save?
                  </p>
                  <h3 className="mt-2 font-heading text-3xl">
                    Build credit while you send from the USA
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/80">
                    Explore immigrant-friendly card picks that help you earn
                    rewards, improve approval odds, and strengthen your U.S.
                    credit profile.
                  </p>
                  <Link
                    className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-brand-yellow px-5 text-sm font-bold text-brand-navy transition hover:shadow-float"
                    href="/credit-cards"
                  >
                    Explore credit cards
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

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

            <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[28px] border border-brand-navy/10 bg-white p-6 shadow-float sm:p-8">
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
              </div>

              <AlertsForm compact />
            </section>
          </div>
        </section>

        <div className="fixed inset-x-4 bottom-24 z-30 md:hidden">
          <button
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[22px] bg-brand-yellow px-5 text-base font-bold text-brand-navy shadow-float"
            type="button"
            onClick={() =>
              compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            Compare Now
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </>
  );
}
