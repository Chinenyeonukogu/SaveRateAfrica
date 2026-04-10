export function SiteFooter() {
  const importantItems = [
    "Rates shown are for comparison purposes only.",
    "Final rates and fees are determined by each provider at the time of transfer.",
    "We may earn a commission when you use our partner links. This never affects our independent rankings."
  ] as const;

  return (
    <section id="contact">
      <footer className="border-t-[3px] border-[#2e7d32] bg-[#f4faf5] px-5 pb-5 pt-8 min-[600px]:px-7 min-[600px]:pb-5 min-[600px]:pt-10 lg:px-10 lg:pb-6 lg:pt-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 border-b border-[#c8e6c9] pb-6 text-[13px] leading-[1.7] text-[#4a6a4a]">
            <strong className="font-bold text-[#1a2e1a]">
              SaveRateAfrica is an independent comparison platform.
            </strong>{" "}
            We are not a money transfer operator and do not process transfers. Our
            mission is to help Nigerians in the diaspora send more money home by
            comparing the best real rates and lowest fees.
          </div>

          <div className="mb-9">
            <div className="flex items-center gap-[10px]">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#43a047,#1b5e20)] text-[14px] font-extrabold text-white">
                S
              </span>
              <span className="text-[16px] font-bold text-[#1a2e1a]">
                Save<span className="text-[#2e7d32]">Rate</span>Africa
              </span>
            </div>

            <p className="mt-2 text-[13px] text-[#6a8a6a]">
              Helping the Nigerian diaspora send more money home.
            </p>
          </div>

          <div className="mb-9 grid grid-cols-1 gap-7 min-[600px]:grid-cols-2 min-[600px]:gap-7 lg:gap-12">
            <div>
              <h2 className="mb-[14px] text-[14px] font-bold text-[#1a2e1a]">About Us</h2>
              <p className="text-[13px] leading-[1.75] text-[#4a6a4a]">
                An independent comparison platform helping Nigerians in the
                diaspora find the best real-time exchange rates and lowest transfer
                fees across 10+ trusted providers.
              </p>
            </div>

            <div>
              <h2 className="mb-[14px] text-[14px] font-bold text-[#1a2e1a]">Important</h2>
              <ul>
                {importantItems.map((item) => (
                  <li key={item} className="mb-3 flex items-start gap-2.5 pl-0 text-[12px] leading-[1.7] text-[#4a6a4a] last:mb-0">
                    <span
                      aria-hidden="true"
                      className="mt-[1px] text-[16px] leading-[1.4] text-white"
                      style={{ WebkitTextStroke: "0.5px #2e7d32" }}
                    >
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center border-t border-[#c8e6c9] pt-5">
            <p className="text-center text-[12px] text-[#7a9a7a]">
              © 2026 SaveRateAfrica. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
