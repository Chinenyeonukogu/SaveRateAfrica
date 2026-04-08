import type { CSSProperties } from "react";

export function SiteFooter() {
  const socialLinks: Array<{
    alt: string;
    bgClassName?: string;
    href: string;
    iconSrc: string;
    style?: CSSProperties;
  }> = [
    {
      alt: "Facebook",
      bgClassName: "bg-[#1877F2]",
      href: "https://www.facebook.com/saverateafrica",
      iconSrc:
        "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/facebook.svg"
    },
    {
      alt: "Instagram",
      href: "https://www.instagram.com/saverateafrica",
      iconSrc:
        "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/instagram.svg",
      style: {
        background:
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
      }
    },
    {
      alt: "TikTok",
      bgClassName: "bg-black",
      href: "https://www.tiktok.com/@saverateafrica",
      iconSrc:
        "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/tiktok.svg"
    }
  ] as const;

  return (
    <section id="contact" className="scroll-mt-24">
      <footer className="border-t border-brand-navy/10 bg-white px-4 py-8 text-sm text-brand-navy/72 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5 pb-24 md:pb-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-heading text-brand-navy">Contact Us</h2>

            <div>
              <p className="mb-3 text-[12px] uppercase tracking-[1px] text-[#5a7a5a]">
                Follow SaveRateAfrica
              </p>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.alt}
                    aria-label={link.alt}
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-white no-underline shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${link.bgClassName ?? ""}`}
                    href={link.href}
                    rel="noopener noreferrer"
                    style={link.style}
                    target="_blank"
                  >
                    <img
                      alt={link.alt}
                      className="h-5 w-5 invert"
                      height="20"
                      src={link.iconSrc}
                      width="20"
                    />
                  </a>
                ))}
              </div>

              <div>
                <a
                  className="inline-flex items-center gap-2 rounded-[8px] border border-[#c8e6c9] bg-[#f4faf5] px-5 py-2.5 text-[14px] font-medium text-[#2e7d32] no-underline transition-[background-color,border-color] duration-200 hover:border-[#2e7d32] hover:bg-[#e8f5e9]"
                  href="mailto:partners@saverateafrica.com"
                >
                  <span aria-hidden="true">✉</span>
                  <span>partners@saverateafrica.com</span>
                </a>
                <p className="mt-1.5 text-[11px] text-[#5a7a5a]">
                  We respond within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium leading-5 text-brand-navy/80">
            Rates are indicative. Updated every 5 minutes. Final rates confirmed at
            provider.
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-brand-navy">
              © 2026 SaveRateAfrica. All rights reserved.
            </p>

            <p className="max-w-5xl leading-7">
              SaveRateAfrica is an independent comparison platform. We are not a
              money transfer operator. Rates shown are for comparison purposes only
              and are updated every 5 minutes. Final rates and fees are determined
              by each provider at the time of transfer.
            </p>

            <p className="max-w-5xl leading-7">
              We may receive compensation when you use our partner links to send
              money. This does not affect our comparison results or rankings.
            </p>

            <p className="max-w-5xl leading-7">
              Rates sourced from ExchangeRate-API and provider published rates.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
