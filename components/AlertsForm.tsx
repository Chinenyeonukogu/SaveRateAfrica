"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";

interface AlertsFormProps {
  compact?: boolean;
  variant?: "default" | "hero";
}

const heroAlertBadges = [
  { icon: "🔔", title: "Free", subtitle: "1 alert per month" },
  { icon: "⚡", title: "Fast", subtitle: "Email or SMS" },
  { icon: "👑", title: "Premium", subtitle: "Unlimited · $2.99/mo" }
] as const;

export function AlertsForm({
  compact = false,
  variant = "default"
}: AlertsFormProps) {
  const isHero = variant === "hero";
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [targetRate, setTargetRate] = useState("1600");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!consent) {
      setMessage("Please confirm marketing consent to continue.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          channel,
          email,
          phone,
          targetRate: Number.parseFloat(targetRate)
        })
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Something went wrong");
      }

      setMessage(payload.message ?? "Alert created successfully.");
      setEmail("");
      setPhone("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "We could not create your alert."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={
        isHero
          ? "alert-hero-card mt-6 max-w-full rounded-[14px] bg-white p-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.18)] lg:max-w-[460px]"
          : undefined
      }
    >
      {isHero ? (
        <div className="mb-4">
          <div className="flex items-start">
            <div className="mr-[10px] flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#c8e6c9] bg-[#e8f5e9] text-[15px] text-[#2e7d32]">
              <BellRing className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#2e7d32]">
                RATE ALERTS
              </p>
              <h3 className="mt-1 text-[15px] font-bold leading-[1.3] text-[#1a2e1a]">
                Get notified when NGN hits your target
              </h3>
            </div>
          </div>
          <p className="mt-[6px] text-[11px] leading-[1.6] text-[#5a7a5a]">
            Set your ideal rate and we alert you instantly — free for 1 alert per
            month, unlimited on Premium.
          </p>
        </div>
      ) : null}

      <form
        className={`${
          isHero
            ? ""
            : "mx-auto max-w-[560px] rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 shadow-float min-[600px]:px-6 min-[600px]:py-8"
        }`}
        onSubmit={handleSubmit}
      >
        {!isHero ? (
          <div className="mx-auto max-w-[440px] text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10">
              <BellRing className="h-6 w-6 text-brand-green" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
              Rate alerts
            </p>
            <h3 className="mt-2 text-[28px] font-heading text-brand-navy min-[600px]:text-3xl">
              Get notified when NGN hits your target
            </h3>
            <p className="mt-2 text-[12px] leading-6 text-brand-navy/70 min-[600px]:text-sm">
              Free users get one alert per month. Premium users can track unlimited
              targets across USD, GBP, and CAD routes.
            </p>
          </div>
        ) : null}

        {!compact && (
          <div
            className={
              isHero
                ? "mb-4 flex flex-wrap gap-2"
                : "mx-auto mt-6 grid max-w-[320px] grid-cols-2 gap-2 rounded-[12px] bg-brand-light p-2"
            }
          >
            {(["email", "sms"] as const).map((value) => (
              <button
                key={value}
                className={`toggle-btn min-h-11 capitalize transition ${
                  isHero
                    ? "rounded-full px-4 py-[6px] text-[11px] font-semibold"
                    : `text-[12px] font-semibold min-[600px]:min-h-12 min-[600px]:text-sm ${
                        value === channel
                          ? "bg-brand-navy text-white"
                          : "text-brand-navy/70 hover:bg-white"
                      }`
                }`}
                data-state={value === channel ? "active" : "inactive"}
                data-type={value}
                type="button"
                onClick={() => setChannel(value)}
              >
                {value}
              </button>
            ))}
          </div>
        )}

        <div
          className={`grid gap-3 ${
            isHero
              ? "min-[600px]:grid-cols-2 lg:grid-cols-[130px_minmax(0,1fr)_auto] lg:items-end"
              : "mt-6 lg:grid-cols-[140px_minmax(0,1fr)_auto] lg:items-end"
          }`}
        >
          <label
            className={`${
                isHero
                  ? "space-y-1"
                  : "space-y-2 text-[12px] font-medium text-brand-navy/70 min-[600px]:text-sm"
            }`}
          >
            <span
              className={
                isHero
                  ? "block text-[10px] font-semibold uppercase tracking-[0.8px] text-[#8a9a8a]"
                  : undefined
              }
              >
                Target rate
              </span>
            <input
              className={`alert-input min-h-12 w-full rounded-[8px] px-[14px] py-[11px] outline-none ${
                isHero ? "" : "border border-[#c8e6c9] bg-white font-mono"
              }`}
              inputMode="decimal"
              placeholder="1600"
              type="number"
              value={targetRate}
              onChange={(event) => setTargetRate(event.target.value)}
            />
          </label>

          {compact || channel === "email" ? (
            <label
              className={`${
                isHero
                  ? "space-y-1"
                  : "space-y-2 text-[12px] font-medium text-brand-navy/70 min-[600px]:text-sm"
              }`}
            >
              <span
                className={
                  isHero
                    ? "block text-[10px] font-semibold uppercase tracking-[0.8px] text-[#8a9a8a]"
                    : undefined
                }
              >
                Email
              </span>
              <input
                className={`alert-input min-h-12 w-full rounded-[8px] px-[14px] py-[11px] outline-none ${
                  isHero ? "" : "border border-[#c8e6c9] bg-white"
                }`}
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          ) : (
            <label
              className={`${
                isHero
                  ? "space-y-1"
                  : "space-y-2 text-[12px] font-medium text-brand-navy/70 min-[600px]:text-sm"
              }`}
            >
              <span
                className={
                  isHero
                    ? "block text-[10px] font-semibold uppercase tracking-[0.8px] text-[#8a9a8a]"
                    : undefined
                }
              >
                SMS number
              </span>
              <input
                className={`alert-input min-h-12 w-full rounded-[8px] px-[14px] py-[11px] outline-none ${
                  isHero ? "" : "border border-[#c8e6c9] bg-white"
                }`}
                placeholder="+1 555 555 5555"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
          )}

          <button
            className={`inline-flex min-h-12 items-center justify-center rounded-[7px] px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isHero
                ? "w-full bg-[#2e7d32] text-white min-[600px]:col-span-2 lg:col-span-1 lg:w-auto hover:bg-[#1b5e20]"
                : "bg-[#2e7d32] text-white hover:shadow-float"
            }`}
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Saving alert..." : "Notify Me"}
          </button>
        </div>

        <label
          className={`mt-[10px] flex items-start gap-3 text-[10px] leading-4 ${
            isHero ? "text-[#8a9a8a]" : "text-brand-navy/70"
          }`}
        >
          <input
            checked={consent}
            className={`mt-1 h-4 w-4 rounded ${
              isHero ? "border-[#c8e6c9] bg-white text-[#2e7d32]" : "border-brand-navy/20 text-brand-green"
            }`}
            type="checkbox"
            onChange={(event) => setConsent(event.target.checked)}
          />
          <span className={isHero ? "gdpr-text" : undefined}>
            I agree to receive rate alerts and product updates. You can unsubscribe
            at any time. Messaging follows GDPR and CAN-SPAM expectations.
          </span>
        </label>

        {isHero ? (
          <div className="mt-[14px] border-t border-[#e0ede2] pt-[14px]">
            <div className="grid gap-2 min-[600px]:grid-cols-3">
              {heroAlertBadges.map((badge) => (
                <div
                  key={badge.title}
                  className="flex items-center gap-[6px] rounded-[8px] border border-[#e0ede2] bg-[#f4faf5] px-[10px] py-[6px]"
                >
                  <span className="text-sm">{badge.icon}</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#1a2e1a]">{badge.title}</p>
                    <p className="text-[9px] text-[#6a8a6a]">{badge.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {message ? (
          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-[12px] px-4 py-3 text-[12px] font-medium min-[600px]:text-sm ${
              isHero
                ? "bg-[rgba(105,240,174,0.12)] text-[#a8e6b8]"
                : "bg-brand-green/10 text-brand-green"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
