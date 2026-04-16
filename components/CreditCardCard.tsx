import { ArrowUpRight, Star } from "lucide-react";

import type { CreditCardOffer } from "@/lib/site-data";

interface CreditCardCardProps {
  offer: CreditCardOffer;
}

export function CreditCardCard({ offer }: CreditCardCardProps) {
  return (
    <article className="overflow-hidden rounded-[14px] border border-brand-navy/10 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:items-center">
        <div
          className="rounded-[28px] p-6 text-white shadow-float"
          style={{
            background: `linear-gradient(145deg, ${offer.cardToneFrom}, ${offer.cardToneTo})`
          }}
        >
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            SaveRateAfrica pick
          </div>
          <div className="mt-10">
            <p className="text-sm text-white/75">Starter credit card</p>
            <h3 className="mt-2 font-heading text-3xl leading-tight">
              {offer.name}
            </h3>
          </div>
          <div className="mt-10 flex items-center justify-between text-sm text-white/80">
            <span>{offer.annualFee}</span>
            <span>Visa / Secured</span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-navy">
              {offer.badge}
            </span>
            <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
              Best for {offer.bestFor}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-brand-navy/70">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${offer.slug}-${index}`}
                  className={`h-4 w-4 ${
                    index < Math.round(offer.rating)
                      ? "fill-brand-yellow text-brand-yellow"
                      : "text-brand-navy/20"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold text-brand-navy">
              {offer.rating.toFixed(1)} / 5
            </span>
            <span>Our rating</span>
          </div>

          <p className="mt-4 text-base leading-7 text-brand-navy/70">
            {offer.intro}
          </p>

          <ul className="mt-5 space-y-3 text-sm text-brand-navy/70">
            {offer.pros.map((pro) => (
              <li
                key={pro}
                className="flex items-start gap-3 rounded-2xl bg-brand-light px-4 py-3"
              >
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-green" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-brand-yellow px-5 py-3 text-sm font-bold text-[#1a1a1a] transition hover:opacity-[0.88]"
              href={offer.url}
              rel="noreferrer"
              target="_blank"
            >
              Apply Now
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="text-sm text-brand-navy/60">
              Commission eligible affiliate placement
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
