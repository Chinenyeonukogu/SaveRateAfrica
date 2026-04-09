export function SiteFooter() {
  const importantItems = [
    "Rates shown are for comparison purposes only.",
    "Final rates and fees are determined by each provider at the time of transfer.",
    "We may earn a commission when you use our partner links. This never affects our independent rankings."
  ] as const;

  return (
    <section id="contact" className="scroll-mt-24">
      <footer className="bg-[#1a2e1a] px-5 pb-5 pt-8 text-[rgba(255,255,255,0.7)] min-[600px]:px-7 min-[600px]:pb-5 min-[600px]:pt-10 lg:px-10 lg:pb-6 lg:pt-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 border-b border-[rgba(255,255,255,0.08)] pb-6 text-[12px] font-medium leading-[1.6] text-[rgba(255,255,255,0.45)]">
            <strong className="font-semibold text-[rgba(255,255,255,0.62)]">
              SaveRateAfrica is an independent comparison platform.
            </strong>{" "}
            We are not a money transfer operator and do not process transfers. Our
            mission is to help Nigerians in the diaspora send more money home by
            comparing the best real rates and lowest fees.
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-[10px]">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,#43a047,#1b5e20)] text-[13px] font-bold text-white">
                S
              </span>
              <span className="text-[15px] font-bold text-white">
                Save<span className="text-[#a8e6b8]">Rate</span>Africa
              </span>
            </div>

            <p className="mt-2 text-[12px] text-[rgba(255,255,255,0.40)]">
              Helping the Nigerian diaspora send more money home.
            </p>
          </div>

          <div className="mb-9 grid grid-cols-1 gap-7 min-[600px]:grid-cols-2 min-[600px]:gap-7 lg:gap-12">
            <div>
              <h2 className="mb-[14px] text-[13px] font-semibold text-white">About Us</h2>
              <p className="text-[12px] leading-[1.7] text-[rgba(255,255,255,0.55)]">
                An independent comparison platform helping Nigerians in the
                diaspora find the best real-time exchange rates and lowest transfer
                fees across 14+ trusted providers.
              </p>
            </div>

            <div>
              <h2 className="mb-[14px] text-[13px] font-semibold text-white">Important</h2>
              <ul className="space-y-2">
                {importantItems.map((item) => (
                  <li
                    key={item}
                    className="relative pl-[14px] text-[11px] leading-[1.7] text-[rgba(255,255,255,0.40)] before:absolute before:left-0 before:top-0 before:text-[rgba(255,255,255,0.25)] before:content-['•']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center border-t border-[rgba(255,255,255,0.1)] pt-5">
            <p className="text-center text-[11px] text-[rgba(255,255,255,0.40)]">
              © 2026 SaveRateAfrica. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
