import { Bell, ShieldCheck, Target, Zap } from "lucide-react";

const alertFeatures = [
  {
    icon: Zap,
    title: "Instant Notifications",
    subtitle: "Get real-time alerts the moment rates change."
  },
  {
    icon: Target,
    title: "Set Your Target",
    subtitle: "Choose your ideal rate and let us watch for you."
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    subtitle: "Your data is safe with us. Always."
  }
] as const;

export function RateAlertsSection() {
  return (
    <section className="bg-gradient-to-br from-[#0a1f14] via-[#0f2d1a] to-[#061209] px-6 py-24 md:px-16 lg:px-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 rounded-3xl lg:grid-cols-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-800/60 bg-green-950/40 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-400">
            <Bell className="h-3.5 w-3.5" />
            RATE ALERTS
          </div>

          <h2 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
            Never miss your{" "}
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              ideal rate
            </span>
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-gray-400">
            We&apos;ll notify you instantly when rates hit your target. Stay
            ahead. Save more.
          </p>

          <div className="mt-10 space-y-6">
            {alertFeatures.map(({ icon: Icon, title, subtitle }) => (
              <div key={title} className="flex items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-900/50 text-green-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex min-h-[340px] items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute h-[200px] w-[200px] rounded-full border border-green-800/30" />
          <div className="absolute h-[300px] w-[300px] rounded-full border border-green-800/30" />
          <img
            alt="Gold notification bell"
            className="relative z-10 h-48 w-48 animate-[float_4s_ease-in-out_infinite] object-contain drop-shadow-2xl md:h-64 md:w-64"
            src="/images/alarm.png"
          />
          <div className="absolute right-8 top-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
            1
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_60px_rgba(34,197,94,0.12)] backdrop-blur-md transition-all duration-300 hover:border-green-700/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1f14] text-base font-bold text-white">
                S
              </div>
              <span className="text-base font-bold text-white">SaveRate</span>
            </div>
            <span className="text-sm text-green-400">now</span>
          </div>

          <div className="mt-6">
            <p className="text-lg font-bold text-white">Great news! 🎉</p>
            <p className="mt-3 text-base leading-7 text-gray-400">
              The USD to NGN rate has dropped to{" "}
              <span className="font-bold text-green-400">₦1,455.00</span> —
              below your target of ₦1,460.00.
            </p>
          </div>

          <div className="mt-4 cursor-pointer text-sm font-semibold text-green-400 transition-colors hover:text-green-300">
            View Rates →
          </div>
        </div>
      </div>
    </section>
  );
}
