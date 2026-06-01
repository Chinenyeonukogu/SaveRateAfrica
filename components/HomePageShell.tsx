"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { X } from "lucide-react";

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
  const modalPanelRef = useRef<HTMLDivElement | null>(null);
  const rateChartRef = useRef<HTMLDivElement | null>(null);
  const [amount, setAmount] = useState(String(initialComparison.amount));
  const [senderCountry, setSenderCountry] = useState<SenderCountry>(
    initialComparison.senderCountry
  );
  const [comparison, setComparison] = useState(initialComparison);
  const [sortBy, setSortBy] = useState<ComparisonSort>(initialComparison.sortBy);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
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
    if (!isComparisonModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      modalPanelRef.current?.focus();
    });

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsComparisonModalOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isComparisonModalOpen]);

  function openComparisonModal(refresh = false) {
    setIsComparisonModalOpen(true);

    if (refresh) {
      void refreshComparison(sortByRef.current);
    }
  }

  useEffect(() => {
    function scrollToHashTarget() {
      const targetId = window.location.hash.replace("#", "");

      if (targetId === "compare-rates") {
        openComparisonModal();
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
      openComparisonModal();
    }

    window.addEventListener("saverate:show-comparison", showComparisonFromHeader);

    return () => {
      window.removeEventListener("saverate:show-comparison", showComparisonFromHeader);
    };
  }, []);

  function handleCompare() {
    openComparisonModal(true);
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

        {isComparisonModalOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-labelledby="comparison-modal-title"
            aria-modal="true"
            className="fixed inset-0 z-[10000] flex items-end justify-center px-0 py-0 min-[600px]:px-6 min-[600px]:py-6"
            initial={{ opacity: 0 }}
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setIsComparisonModalOpen(false);
              }
            }}
          >
            <motion.div
              id="compare-rates"
              ref={modalPanelRef}
              animate={{ y: 0 }}
              className="relative flex h-[95vh] max-h-[95vh] w-full max-w-[760px] flex-col overflow-hidden rounded-t-[18px] bg-white shadow-[0_28px_90px_rgba(0,0,0,0.35)] outline-none min-[600px]:h-auto min-[600px]:rounded-[18px]"
              initial={{ y: "100%" }}
              tabIndex={-1}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e0ede2] px-4 py-4 min-[600px]:px-6 min-[600px]:py-5">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-green">
                    Compare now
                  </p>
                  <h2
                    id="comparison-modal-title"
                    className="mt-1 text-[22px] font-heading text-brand-navy min-[600px]:text-[30px]"
                  >
                    Check your top payout
                  </h2>
                </div>
                <button
                  aria-label="Close comparison results"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d9eadb] bg-white text-[#1a2e1a] transition hover:bg-[#f4faf5]"
                  type="button"
                  onClick={() => setIsComparisonModalOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="min-h-0 overflow-y-auto px-4 py-5 min-[600px]:px-6 lg:px-8">
                <ComparisonTable
                  comparison={comparison}
                  errorMessage={errorMessage}
                  isLoading={isLoading}
                  nextRefreshAt={nextRefreshAt}
                  onSortChange={handleSortChange}
                />

                <div className="mt-6">
                  <RateDisclaimer />
                </div>
              </div>
            </motion.div>
          </motion.div>
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
