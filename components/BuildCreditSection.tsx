import { TrendingUp } from "lucide-react";

function WavePattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      <svg
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-[58%]"
        preserveAspectRatio="none"
        viewBox="0 0 520 420"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <path
            d={`M ${110 + index * 30} -20 C ${260 + index * 30} 90, ${360 + index * 6} 180, ${520 + index * 18} 430`}
            fill="none"
            key={index}
            stroke="rgba(34,197,94,0.06)"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

function GoldChip() {
  return (
    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-gradient-to-br from-yellow-400 to-yellow-600">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 64 48"
      >
        <path d="M0 16h64M0 32h64M16 0v48M32 0v48M48 0v48" stroke="rgba(161,98,7,0.4)" />
        <rect
          fill="none"
          height="28"
          rx="7"
          stroke="rgba(161,98,7,0.55)"
          width="28"
          x="18"
          y="10"
        />
      </svg>
    </div>
  );
}

function ContactlessIcon() {
  return (
    <svg aria-hidden="true" className="h-12 w-12" viewBox="0 0 48 48">
      <path d="M10 17c5 4 5 10 0 14" fill="none" stroke="rgba(255,255,255,0.5)" strokeLinecap="round" strokeWidth="4" />
      <path d="M20 12c8 7 8 17 0 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeLinecap="round" strokeWidth="4" />
      <path d="M31 7c12 11 12 23 0 34" fill="none" stroke="rgba(255,255,255,0.5)" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

export function BuildCreditSection() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <section className="relative w-full max-w-full overflow-hidden bg-gradient-to-br from-[#0a1f14] via-[#0f2d1a] to-[#061209] py-16 md:py-24">
        <div className="mx-auto w-full max-w-[1200px] px-6">
          <div className="relative w-full max-w-full overflow-hidden rounded-3xl border border-green-900/40 bg-gradient-to-br from-[#0d2b1a] via-[#0f3320] to-[#071a0f] p-6 shadow-[0_0_80px_rgba(34,197,94,0.08)] transition-shadow duration-500 hover:shadow-[0_0_100px_rgba(34,197,94,0.15)] sm:p-8 md:p-12 lg:p-16">
            <WavePattern />

            <div className="relative z-10 grid min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-[auto_auto_1fr] lg:gap-12">
              <div className="flex items-center gap-4">
                <GoldChip />
                <ContactlessIcon />
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-800/50 bg-[#0a2015] text-green-400">
                <TrendingUp className="h-7 w-7" />
              </div>

              <div className="min-w-0 md:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                  BUILD YOUR
                </h2>
                <p className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
                  CREDIT
                </p>
                <div className="my-3 h-px w-16 bg-green-500/50" />
                <p className="text-lg text-gray-400">
                  Immigrant-friendly credit cards
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
