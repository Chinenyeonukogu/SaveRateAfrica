import type { SourceCurrency } from "@/lib/providers";

export function formatCurrency(
  amount: number,
  currency: SourceCurrency,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2
  }).format(amount);
}

export function formatNaira(
  amount: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 0
  }).format(amount);
}

export function formatRate(rate: number, currency: SourceCurrency) {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate)} NGN/${currency}`;
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatRelativeTime(value: string, now = Date.now()) {
  const deltaMs = Math.max(now - new Date(value).getTime(), 0);
  const deltaMinutes = Math.floor(deltaMs / 60_000);
  const deltaHours = Math.floor(deltaMinutes / 60);

  if (deltaMinutes < 1) {
    return "just now";
  }

  if (deltaMinutes < 60) {
    return `${deltaMinutes} minute${deltaMinutes === 1 ? "" : "s"} ago`;
  }

  return `${deltaHours} hour${deltaHours === 1 ? "" : "s"} ago`;
}

export function formatRefreshCountdown(value: string, now = Date.now()) {
  const remainingMs = Math.max(new Date(value).getTime() - now, 0);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
