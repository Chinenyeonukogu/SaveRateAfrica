import type { SourceCurrency } from "@/lib/providers";

const remittanceProviderLinks: Record<string, string> = {
  wise: "https://wise.com/",
  remitly: "https://www.remitly.com/",
  worldremit: "https://www.worldremit.com/",
  ofx: "https://www.ofx.com/",
  sendwave: "https://www.sendwave.com/",
  "western-union": "https://www.westernunion.com/",
  moneygram: "https://www.moneygram.com/",
  pangea: "https://www.pangeamoneytransfer.com/",
  "chipper-cash": "https://chippercash.com/",
  lemfi: "https://www.lemfi.com/",
  "grey-finance": "https://grey.co/",
  afriex: "https://www.afriex.com/",
  "flutterwave-send": "https://send.flutterwave.com/",
  nala: "https://www.nala.com/",
  "taptap-send": "https://www.taptapsend.com/send-money-to/nigeria",
  paysend: "https://paysend.com/"
};

const creditCardLinks: Record<string, string> = {
  chime: "https://www.chime.com/credit-builder/",
  discover: "https://www.discover.com/credit-cards/secured/",
  "capital-one": "https://www.capitalone.com/credit-cards/platinum-secured/",
  petal: "https://www.petalcard.com/"
};

type TrackingParams = Record<string, string | number | undefined>;

interface ProviderTrackingParams extends TrackingParams {
  amount?: number;
  currency?: SourceCurrency;
  recipientCurrency?: "NGN";
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

function buildWiseLink(amount: number, currency: SourceCurrency) {
  const url = new URL("https://wise.com/send");
  url.hash = `source-currency=${currency}&target-currency=NGN&amount=${amount}`;
  return url.toString();
}

function buildProviderBaseUrl(
  slug: string,
  { amount = 500, currency = "USD", recipientCurrency = "NGN" }: ProviderTrackingParams
) {
  switch (slug) {
    case "lemfi":
      return `https://lemfi.com/send-money?amount=${amount}&from=${currency}&to=${recipientCurrency}`;
    case "wise":
      return buildWiseLink(amount, currency);
    case "remitly":
      return `https://www.remitly.com/?sourceAmount=${amount}&sourceCurrency=${currency}&destinationCurrency=${recipientCurrency}`;
    case "worldremit":
      return `https://www.worldremit.com/en/send-money?amount=${amount}&currency=${currency}&destinationCurrency=${recipientCurrency}`;
    case "sendwave":
      return `https://www.sendwave.com/?amount=${amount}&currency=${currency}`;
    case "moneygram":
      return `https://www.moneygram.com/mgo/us/en/send/?amount=${amount}&currency=${currency}`;
    case "western-union":
      return `https://www.westernunion.com/us/en/send-money/?amount=${amount}&currency=${currency}&destinationCurrency=${recipientCurrency}`;
    default:
      return remittanceProviderLinks[slug] ?? "https://www.saverateafrica.com/providers";
  }
}

export function getProviderAffiliateLink(
  slug: string,
  params: ProviderTrackingParams = {}
) {
  const baseUrl = buildProviderBaseUrl(slug, params);

  return withTracking(baseUrl, params, "remittance-comparison");
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
