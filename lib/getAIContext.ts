import "server-only";

import { getLiveComparison, type ComparisonResult } from "@/lib/fetchRates";
import {
  AI_CONTEXT_COUNTRIES,
  buildMarketSnapshot,
  formatMarketSnapshot,
  type MarketSnapshot
} from "@/lib/marketSnapshot";
import type { SenderCountry } from "@/lib/providers";

interface GetAIContextOptions {
  amount?: number;
  baseUrl?: string;
  signal?: AbortSignal;
}

export interface AIContext {
  comparisons: Record<SenderCountry, ComparisonResult>;
  marketSnapshot: string;
  snapshot: MarketSnapshot;
  source: "api" | "fallback";
}

function normalizeBaseUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`;
}

function resolveBaseUrl(baseUrl?: string) {
  if (baseUrl) {
    return normalizeBaseUrl(baseUrl);
  }

  const explicitSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

  if (explicitSiteUrl) {
    return normalizeBaseUrl(explicitSiteUrl);
  }

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

  if (vercelUrl) {
    return normalizeBaseUrl(vercelUrl);
  }

  return "http://localhost:3000";
}

async function fetchComparisonFromApi(
  baseUrl: string,
  senderCountry: SenderCountry,
  amount: number,
  signal?: AbortSignal
) {
  const url = new URL("/api/rates", baseUrl);
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("senderCountry", senderCountry);
  url.searchParams.set("sortBy", "best-rate");

  const response = await fetch(url, {
    cache: "no-store",
    signal
  });

  const payload = (await response.json()) as ComparisonResult & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error ?? `Unable to fetch market context for ${senderCountry}.`);
  }

  return payload;
}

async function fetchComparisonFallback(
  senderCountry: SenderCountry,
  amount: number
) {
  return getLiveComparison(
    {
      amount,
      senderCountry,
      sortBy: "best-rate"
    },
    {
      allowFallback: true
    }
  );
}

export async function getAIContext(
  options: GetAIContextOptions = {}
): Promise<AIContext> {
  const amount = options.amount ?? 500;
  const baseUrl = resolveBaseUrl(options.baseUrl);

  try {
    const comparisonResults = await Promise.all(
      AI_CONTEXT_COUNTRIES.map((senderCountry) =>
        fetchComparisonFromApi(baseUrl, senderCountry, amount, options.signal)
      )
    );
    const comparisons = Object.fromEntries(
      comparisonResults.map((comparison) => [
        comparison.senderCountry,
        comparison
      ])
    ) as Record<SenderCountry, ComparisonResult>;
    const snapshot = buildMarketSnapshot(comparisonResults, amount);

    return {
      comparisons,
      marketSnapshot: formatMarketSnapshot(snapshot),
      snapshot,
      source: "api"
    };
  } catch {
    const comparisonResults = await Promise.all(
      AI_CONTEXT_COUNTRIES.map((senderCountry) =>
        fetchComparisonFallback(senderCountry, amount)
      )
    );
    const comparisons = Object.fromEntries(
      comparisonResults.map((comparison) => [
        comparison.senderCountry,
        comparison
      ])
    ) as Record<SenderCountry, ComparisonResult>;
    const snapshot = buildMarketSnapshot(comparisonResults, amount);

    return {
      comparisons,
      marketSnapshot: formatMarketSnapshot(snapshot),
      snapshot,
      source: "fallback"
    };
  }
}

