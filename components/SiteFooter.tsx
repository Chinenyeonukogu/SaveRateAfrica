export function SiteFooter() {
  return (
    <footer className="border-t border-brand-navy/10 bg-white px-4 py-8 text-sm text-brand-navy/72 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5 pb-24 md:pb-4">
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
  );
}
