import type { SenderCountry, SourceCurrency } from "@/lib/providers";

const remittanceProviderLinks: Record<string, string> = {
  remitly: "https://www.remitly.com/",
  worldremit: "https://www.worldremit.com/en",
  sendwave: "https://www.sendwave.com/",
  payangel: "https://payangel.com",
  "western-union": "https://www.westernunion.com/",
  moneygram: "https://www.moneygram.com/",
  "ace-money-transfer": "https://acemoneytransfer.com/Nigeria/Send-Money-to-Nigeria",
  pesa: "https://www.pesa.co/",
  lemfi: "https://lemfi.com/en-us",
  afriex: "https://www.afriex.com/",
  flutterwave: "https://send.flutterwave.com",
  "flutterwave-send": "https://send.flutterwave.com",
  nala: "https://www.nala.com/",
  "taptap-send": "https://www.taptapsend.com/en/send-money-to/nigeria",
  paysend: "https://paysend.com/"
};

const creditCardLinks: Record<string, string> = {
  chime: "https://www.chime.com/credit-builder/",
  discover: "https://www.discover.com/credit-cards/secured/",
  "capital-one": "https://www.capitalone.com/credit-cards/platinum-secured/",
  petal: "https://www.petalcard.com/"
};

const wiseAffiliateLinks = {
  UK: "https://wise.prf.hn/click/camref:1101l5Iv4U",
  USA: "https://wise.prf.hn/click/camref:1011l5FuWv"
} as const;

type TrackingParams = Record<string, string | number | undefined>;

interface ProviderTrackingParams extends TrackingParams {
  amount?: number;
  currency?: SourceCurrency;
  origin?: SenderCountry;
  recipientCurrency?: "NGN";
}

function getWiseAffiliateLink(params: ProviderTrackingParams) {
  if (params.currency === "GBP" || params.origin === "UK") {
    return wiseAffiliateLinks.UK;
  }

  return wiseAffiliateLinks.USA;
}

function withTracking(baseUrl: string, params: TrackingParams, campaign: string) {
  const url = new URL(baseUrl);

  url.searchParams.set("utm_source", "saverateafrica");
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", campaign);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function getProviderAffiliateLink(
  slug: string,
  params: ProviderTrackingParams = {}
) {
  if (slug === "wise") {
    return getWiseAffiliateLink(params);
  }

  const {
    amount,
    currency,
    recipientCurrency,
    ...trackingParams
  } = params;
  void amount;
  void currency;
  void recipientCurrency;
  const baseUrl =
    remittanceProviderLinks[slug] ?? "https://www.saverateafrica.com/providers";

  return withTracking(baseUrl, trackingParams, "remittance-comparison");
}

export function getCreditCardAffiliateLink(
  slug: string,
  params: TrackingParams = {}
) {
  return withTracking(
    creditCardLinks[slug] ?? "https://www.saverateafrica.com/credit-cards",
    params,
    "credit-card-affiliates"
  );
}
