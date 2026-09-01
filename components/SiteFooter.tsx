import Link from "next/link";

export function SiteFooter() {
  const aboutText =
    "SaveRateAfrica is an independent comparison platform. We are not a money transfer operator and do not process transfers. Our mission is to help Africans in the diaspora send more money home by comparing top real rates and lowest fees.";
  const importantItems = [
    "Rates shown are for comparison purposes only.",
    "Final rates and fees are determined by each provider at the time of transfer.",
    "We may earn a commission when you use our partner links. This never affects our independent rankings."
  ] as const;

  return (
    <section id="contact">
      <footer className="border-t-[3px] border-[#2e7d32] bg-[#f4faf5] px-5 pb-5 pt-8 min-[600px]:px-7 min-[600px]:pb-5 min-[600px]:pt-10 lg:px-10 lg:pb-6 lg:pt-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-9">
            <div className="flex items-center gap-[10px]">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#43a047,#1b5e20)] text-[14px] font-extrabold text-white">
                S
              </span>
              <span className="text-[16px] font-bold text-[#1a2e1a]">
                Save<span className="text-[#2e7d32]">Rate</span>Africa
              </span>
            </div>

            <p className="mt-2 text-[13px] font-semibold text-[#6a8a6a]">
              Helping the African diaspora send more money home.
            </p>
            <p className="mt-2 text-[12px] font-semibold text-[#7a9a7a]">
              Proudly built in USA
            </p>
          </div>

          <div className="mb-9 grid grid-cols-1 gap-7 min-[600px]:grid-cols-2 min-[600px]:gap-7 lg:grid-cols-3 lg:gap-12">
            <div>
              <h2 className="mb-[14px] text-[14px] font-bold text-[#1a2e1a]">About Us</h2>
              <p className="mt-[10px] text-[12px] font-semibold leading-[1.7] text-[#6a8a6a]">
                {aboutText}
              </p>

              <div className="mt-5">
                <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[1.5px] text-[#5a7a5a]">
                  Quick Links
                </p>
                <Link
                  className="inline-flex text-[13px] font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] hover:underline"
                  href="/about"
                >
                  About Us
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#5a7a5a]">
                For Enquiries
              </p>
              <a
                className="mb-1 block text-[13px] font-semibold text-[#2e7d32] transition hover:text-[#1b5e20] hover:underline"
                href="mailto:patterns@saverateafrica.com"
              >
                patterns@saverateafrica.com
              </a>
              <p className="text-[11px] font-semibold text-[#7a9a7a]">We respond within 24 hours</p>

              <div className="mt-6">
                <p className="mb-[10px] text-[10px] font-semibold uppercase tracking-[1.5px] text-[#5a7a5a]">
                  Follow SaveRateAfrica
                </p>

                <div className="flex items-center gap-[10px]">
                  <a
                    aria-label="Follow SaveRateAfrica on Facebook"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(24,119,242,0.4)]"
                    href="https://www.facebook.com/profile.php?id=61572031944138&sk=directory_links"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  <a
                    aria-label="Follow SaveRateAfrica on Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] text-white transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(214,36,159,0.35)]"
                    href="https://www.instagram.com/s.saverateafrica/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                      <path
                        d="M7.75 2C4.578 2 2 4.578 2 7.75v8.5C2 19.422 4.578 22 7.75 22h8.5c3.172 0 5.75-2.578 5.75-5.75v-8.5C22 4.578 19.422 2 16.25 2h-8.5zm0 1.5h8.5c2.344 0 4.25 1.906 4.25 4.25v8.5c0 2.344-1.906 4.25-4.25 4.25h-8.5A4.255 4.255 0 0 1 3.5 16.25v-8.5C3.5 5.406 5.406 3.5 7.75 3.5zm8.75 1a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 6.5A5.5 5.5 0 1 0 12 17.5 5.5 5.5 0 0 0 12 6.5zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>

                  <a
                    aria-label="Follow SaveRateAfrica on TikTok"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black text-white transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                    href="https://www.tiktok.com/@_saverateafrica"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg aria-hidden="true" className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                      <path
                        d="M16.821 5.134a4.195 4.195 0 0 0 2.679 1.37v2.877a6.953 6.953 0 0 1-2.678-.682l-.017 5.67a5.069 5.069 0 1 1-4.39-5.026v2.983a2.094 2.094 0 1 0 1.425 2.043V1.5h2.98a4.202 4.202 0 0 0 .001 3.634z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </div>
              </div>
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
