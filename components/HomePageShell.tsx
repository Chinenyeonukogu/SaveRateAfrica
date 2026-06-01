"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { HomeHero } from "@/components/HomeHero";
import { SiteHeader } from "@/components/SiteHeader";
import {
  buildComparisonFromLiveRates,
  fetchRates,
  type ComparisonResult
} from "@/lib/fetchRates";
import {
  type ComparisonSort,
  type SenderCountry
} from "@/lib/providers";

interface HomePageShellProps {
  initialComparison: ComparisonResult;
}

const pageShellClassName = "mx-auto w-full max-w-[1200px] px-6";
const comparisonSectionInnerClassName = `${pageShellClassName} py-9 min-[600px]:py-[52px] lg:py-[72px]`;
const postComparisonSectionInnerClassName = `${pageShellClassName} py-6 min-[600px]:py-8 lg:py-10`;
const sectionDividerClassName = "border-t border-[#e8f5e9]";
const HomeLearnSection = dynamic(
  () => import("@/components/HomeLearnSection").then((mod) => mod.HomeLearnSection),
  {
    loading: () => (
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-6 min-[600px]:py-7 lg:py-8">
          <div className="mb-4 h-7 w-44 rounded-full bg-[#e8f5e9]" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[258px] animate-pulse rounded-[12px] border border-[#e8e8e8] bg-white"
              >
                <div className="h-[110px] bg-[#f0f7f1]" />
                <div className="space-y-3 px-4 py-4">
                  <div className="h-4 w-28 rounded-full bg-[#e8f5e9]" />
                  <div className="h-3 w-full rounded-full bg-[#e8f5e9]" />
                  <div className="h-3 w-2/3 rounded-full bg-[#e8f5e9]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
);
const HomeInfoSections = dynamic(
  () => import("@/components/HomeInfoSections").then((mod) => mod.HomeInfoSections),
  {
    loading: () => (
      <section className={sectionDividerClassName}>
        <div className={postComparisonSectionInnerClassName}>
          <div className="min-h-[260px] animate-pulse rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 min-[600px]:px-6 min-[600px]:py-6 lg:px-8 lg:py-8">
            <div className="h-3 w-28 rounded-full bg-[#e8f5e9]" />
            <div className="mt-4 h-8 w-full max-w-xl rounded-full bg-[#e8f5e9]" />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-3 w-16 rounded-full bg-[#e8f5e9]" />
                  <div className="h-5 w-36 rounded-full bg-[#e8f5e9]" />
                  <div className="h-3 w-full rounded-full bg-[#e8f5e9]" />
                  <div className="h-3 w-4/5 rounded-full bg-[#e8f5e9]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
);
const ComparisonTable = dynamic(
  () => import("@/components/ComparisonTable").then((mod) => mod.ComparisonTable),
  {
    loading: () => (
      <div className="min-h-[460px] rounded-[16px] border border-[#e0ede2] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]" />
    ),
    ssr: false
  }
);
const RateDisclaimer = dynamic(
  () => import("@/components/RateDisclaimer").then((mod) => mod.RateDisclaimer),
  {
    loading: () => (
      <div className="min-h-[96px] rounded-[16px] border border-[#e0ede2] bg-white" />
    )
  }
);
const RateChart = dynamic(
  () => import("@/components/RateChart").then((mod) => mod.RateChart),
  {
    loading: () => (
      <div className="min-h-[420px] rounded-[16px] border border-[#e0ede2] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.05)]" />
    ),
    ssr: false
  }
);

export function HomePageShell({ initialComparison }: HomePageShellProps) {
  const compareRef = useRef<HTMLDivElement | null>(null);
  const rateChartRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState(String(initialComparison.amount));
  const [senderCountry, setSenderCountry] = useState<SenderCountry>(
    initialComparison.senderCountry
  );
  const [comparison, setComparison] = useState(initialComparison);
  const [sortBy, setSortBy] = useState<ComparisonSort>(initialComparison.sortBy);
  const [isLoading, setIsLoading] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
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
          providerRates: currentComparison.providerRates,
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
    if (!showComparisonTable) {
      return;
    }

    window.requestAnimationFrame(() => {
      compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [showComparisonTable]);

  useEffect(() => {
    function scrollToHashTarget() {
      const targetId = window.location.hash.replace("#", "");

      if (targetId === "compare-rates") {
        setShowComparisonTable(true);

        window.requestAnimationFrame(() => {
          document
            .getElementById(targetId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }

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

  useEffect(() => {
    function showComparisonFromHeader() {
      setShowComparisonTable(true);
    }

    window.addEventListener("saverate:show-comparison", showComparisonFromHeader);

    return () => {
      window.removeEventListener("saverate:show-comparison", showComparisonFromHeader);
    };
  }, []);

  function handleCompare() {
    setShowComparisonTable(true);
    void refreshComparison(sortByRef.current);
  }

  function handleSortChange(nextSort: ComparisonSort) {
    setSortBy(nextSort);
  }

  return (
    <>
      <SiteHeader />

      <main className="overflow-x-hidden pb-32 md:pb-20">
        <HomeHero
          amount={amount}
          comparisonProviders={comparison.providers}
          isLoading={isLoading}
          senderCountry={senderCountry}
          onAmountChange={setAmount}
          onCompare={handleCompare}
          onSenderCountryChange={setSenderCountry}
        />

        <HomeLearnSection />

        {showComparisonTable ? (
          <section id="compare-rates" className={sectionDividerClassName}>
            <div className={comparisonSectionInnerClassName}>
              <motion.div
                ref={compareRef}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.42, ease: "easeOut" }}
              >
                <ComparisonTable
                  comparison={comparison}
                  errorMessage={errorMessage}
                  isLoading={isLoading}
                  nextRefreshAt={nextRefreshAt}
                  onSortChange={handleSortChange}
                />
              </motion.div>

              <div className="mt-8">
                <RateDisclaimer />
              </div>
            </div>
          </section>
        ) : null}

        <section className={sectionDividerClassName}>
          <div className={postComparisonSectionInnerClassName}>
            <div id="rate-chart" ref={rateChartRef}>
              <RateChart />
            </div>
          </div>
        </section>

        <HomeInfoSections />
      </main>
    </>
  );
}
