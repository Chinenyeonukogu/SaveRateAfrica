"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";

interface AlertsFormProps {
  compact?: boolean;
}

export function AlertsForm({ compact = false }: AlertsFormProps) {
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
    <form
      className={`mx-auto max-w-[560px] rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 shadow-float min-[600px]:px-6 min-[600px]:py-8 ${
        compact ? "" : ""
      }`}
      onSubmit={handleSubmit}
    >
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

      {!compact && (
        <div className="mx-auto mt-6 grid max-w-[320px] grid-cols-2 gap-2 rounded-[12px] bg-brand-light p-2">
          {(["email", "sms"] as const).map((value) => (
            <button
              key={value}
              className={`min-h-11 rounded-[8px] text-[12px] font-semibold capitalize transition min-[600px]:min-h-12 min-[600px]:text-sm ${
                value === channel
                  ? "bg-brand-navy text-white"
                  : "text-brand-navy/70 hover:bg-white"
              }`}
              type="button"
              onClick={() => setChannel(value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-3 lg:grid-cols-[140px_minmax(0,1fr)_auto] lg:items-end">
        <label className="space-y-2 text-[12px] font-medium text-brand-navy/70 min-[600px]:text-sm">
          Target rate
          <input
            className="min-h-12 w-full rounded-[8px] border border-[#c8e6c9] bg-white px-[14px] py-[11px] font-mono outline-none"
            inputMode="decimal"
            placeholder="1600"
            type="number"
            value={targetRate}
            onChange={(event) => setTargetRate(event.target.value)}
          />
        </label>

        {compact || channel === "email" ? (
          <label className="space-y-2 text-[12px] font-medium text-brand-navy/70 min-[600px]:text-sm">
            Email
            <input
              className="min-h-12 w-full rounded-[8px] border border-[#c8e6c9] bg-white px-[14px] py-[11px] outline-none"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        ) : (
          <label className="space-y-2 text-[12px] font-medium text-brand-navy/70 min-[600px]:text-sm">
            SMS number
            <input
              className="min-h-12 w-full rounded-[8px] border border-[#c8e6c9] bg-white px-[14px] py-[11px] outline-none"
              placeholder="+1 555 555 5555"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
        )}

        <button
          className="inline-flex min-h-12 items-center justify-center rounded-[8px] bg-[#2e7d32] px-5 text-sm font-bold text-white transition hover:shadow-float disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Saving alert..." : "Notify Me"}
        </button>
      </div>

      <label className="mt-[10px] flex items-start gap-3 text-[10px] leading-4 text-brand-navy/70">
        <input
          checked={consent}
          className="mt-1 h-4 w-4 rounded border-brand-navy/20 text-brand-green"
          type="checkbox"
          onChange={(event) => setConsent(event.target.checked)}
        />
        <span>
          I agree to receive rate alerts and product updates. You can unsubscribe
          at any time. Messaging follows GDPR and CAN-SPAM expectations.
        </span>
      </label>

      {message ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-[12px] bg-brand-green/10 px-4 py-3 text-[12px] font-medium text-brand-green min-[600px]:text-sm">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      ) : null}
    </form>
  );
}
