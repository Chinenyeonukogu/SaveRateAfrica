"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellRing } from "lucide-react";

interface AlertsFormProps {
  variant?: "default" | "hero";
}

const subtitleText =
  "Set your ideal rate and we'll send you a free email alert instantly the moment your target rate is available.";

export function AlertsForm({ variant = "default" }: AlertsFormProps) {
  const router = useRouter();
  const isHero = variant === "hero";
  const [targetRate, setTargetRate] = useState("1600");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  return (
    <div
      className={
        isHero
          ? "alert-hero-card mt-6 flex h-full w-full max-w-full min-w-0 flex-col rounded-[14px] bg-white px-[22px] pb-[16px] pt-[20px] box-border shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
          : undefined
      }
    >
      {isHero ? (
        <div className="mb-[12px] flex flex-col gap-[10px]">
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
          <p className="border-l-[3px] border-[#1a5c2a] pl-3 text-[11px] font-medium leading-[1.6] text-[#2d4a35]">
            {subtitleText}
          </p>
        </div>
      ) : null}

      <div
        className={`${
          isHero
            ? "flex h-full min-w-0 flex-col"
            : "mx-auto max-w-[560px] rounded-[16px] border border-[#c8e6c9] bg-white px-4 py-5 shadow-float min-[600px]:px-6 min-[600px]:py-8"
        }`}
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
            <p className="mt-2 text-[12px] font-medium leading-6 text-[#2d4a35] min-[600px]:text-sm">
              {subtitleText}
            </p>
          </div>
        ) : null}

        {isHero ? (
          <>
            <div className="mt-[2px] h-px w-full bg-[#e0ede2]" />

            <div className="my-[14px] flex items-center gap-[14px] rounded-[16px] bg-[#1e4028] px-[14px] py-[15px]">
              <div className="relative flex h-[80px] w-[80px] shrink-0 items-center justify-center">
                <span
                  className="absolute inset-0 rounded-full border border-[#69f0ae]/45"
                  style={{ animation: "ringpulse 1.8s ease-out infinite" }}
                />
                <span
                  className="absolute inset-0 rounded-full border border-[#69f0ae]/35"
                  style={{
                    animation: "ringpulse 1.8s ease-out infinite",
                    animationDelay: "0.6s"
                  }}
                />
                <span className="relative flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[rgba(46,125,50,0.25)]">
                  <Bell className="h-[26px] w-[26px] text-[#69f0ae]" strokeWidth={2.1} />
                </span>
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white">
                  Never miss the right rate
                </p>
                <p className="mt-[4px] text-[11px] leading-[1.6] text-[rgba(255,255,255,0.45)]">
                  We&apos;ll notify you instantly the moment NGN reaches your
                  target — straight to your inbox.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 grid w-full min-w-0 gap-3 min-[600px]:grid-cols-2">
              <label className="min-w-0 space-y-2 min-[600px]:text-sm">
                <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#0d1f12]">
                  Target rate
                </span>
                <input
                  className="alert-input min-h-12 w-full min-w-0 rounded-[8px] border border-[#c8e6c9] bg-white px-[14px] py-[11px] font-mono outline-none"
                  inputMode="decimal"
                  placeholder="1600"
                  type="number"
                  value={targetRate}
                  onChange={(event) => setTargetRate(event.target.value)}
                />
              </label>

              <label className="min-w-0 space-y-2 min-[600px]:text-sm">
                <span className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#0d1f12]">
                  Email
                </span>
                <input
                  className="alert-input min-h-12 w-full min-w-0 rounded-[8px] border border-[#c8e6c9] bg-white px-[14px] py-[11px] outline-none"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            </div>

            <label className="mt-[10px] flex items-start gap-3">
              <input
                checked={consent}
                className="mt-1 h-4 w-4 rounded border-brand-navy/20 text-brand-green accent-[#1a5c2a]"
                type="checkbox"
                onChange={(event) => setConsent(event.target.checked)}
              />
              <div className="rounded-[10px] bg-[#f0f7f2] px-[14px] py-3">
                <p className="text-[13px] font-medium leading-[1.7] text-[#1e3d28]">
                  I agree to receive rate alerts and product updates. You can
                  unsubscribe at any time. Messaging follows{" "}
                  <strong className="font-bold">GDPR</strong> and{" "}
                  <strong className="font-bold">CAN-SPAM</strong> expectations.
                </p>
              </div>
            </label>
          </>
        )}

        <div className={isHero ? "" : "mt-4"}>
          <button
            onClick={() => router.push(isHero ? "/alerts" : "/")}
            style={{
              width: "100%",
              background: "#f5c800",
              color: "#0d1f12",
              border: "none",
              padding: isHero ? "12px" : "15px",
              borderRadius: "50px",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: "0.01em"
            }}
          >
            Set Rate Alert →
          </button>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#888",
              marginTop: isHero ? "6px" : "10px",
              fontWeight: 500
            }}
          >
            Free · No account needed · Email only
          </p>
        </div>
      </div>
    </div>
  );
}
