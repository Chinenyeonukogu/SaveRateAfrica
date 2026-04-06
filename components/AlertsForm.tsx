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
      className={`rounded-[28px] border border-brand-navy/10 bg-white p-5 shadow-float sm:p-6 ${
        compact ? "" : "lg:p-8"
      }`}
      onSubmit={handleSubmit}
    >
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10">
          <BellRing className="h-6 w-6 text-brand-green" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-green">
            Rate alerts
          </p>
          <h3 className="mt-2 font-heading text-3xl text-brand-navy">
            Get notified when NGN hits your target
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-navy/70">
            Free users get one alert per month. Premium users can track unlimited
            targets across USD, GBP, and CAD routes.
          </p>
        </div>
      </div>

      {!compact && (
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-[24px] bg-brand-light p-2">
          {(["email", "sms"] as const).map((value) => (
            <button
              key={value}
              className={`min-h-12 rounded-2xl text-sm font-semibold capitalize transition ${
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-brand-navy/70">
          Target rate
          <input
            className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 font-mono outline-none"
            inputMode="decimal"
            placeholder="1600"
            type="number"
            value={targetRate}
            onChange={(event) => setTargetRate(event.target.value)}
          />
        </label>

        {compact || channel === "email" ? (
          <label className="space-y-2 text-sm font-medium text-brand-navy/70">
            Email
            <input
              className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 outline-none"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        ) : (
          <label className="space-y-2 text-sm font-medium text-brand-navy/70">
            SMS number
            <input
              className="min-h-12 w-full rounded-2xl border border-brand-navy/10 bg-brand-light px-4 outline-none"
              placeholder="+1 555 555 5555"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
        )}
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-light px-4 py-4 text-sm text-brand-navy/70">
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

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-yellow px-5 text-sm font-bold text-brand-navy transition hover:shadow-float disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Saving alert..." : "Notify Me"}
        </button>

        {message && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
