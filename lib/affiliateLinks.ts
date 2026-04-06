import type { SourceCurrency } from "@/lib/providers";

const remittanceProviderLinks: Record<string, string> = {
  wise: "https://wise.com/send",
  remitly: "https://remitly.com",
  worldremit: "https://worldremit.com/en",
  sendwave: "https://sendwave.com",
  "western-union": "https://westernunion.com/us/en/send-money",
  moneygram: "https://moneygram.com/mgo/us/en/send",
  pangea: "https://pangeamoneytransfer.com",
  "chipper-cash": "https://chippercash.com",
  lemfi: "https://lemfi.com/send-money",
  "grey-finance": "https://grey.co",
  afriex: "https://afriex.co",
  "flutterwave-send": "https://send.flutterwave.com",
  nala: "https://nala.com",
  "taptap-send": "https://taptapsend.com",
  paysend: "https://paysend.com"
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
      return `https://remitly.com?sourceAmount=${amount}&sourceCurrency=${currency}&destinationCurrency=${recipientCurrency}`;
    case "worldremit":
      return `https://worldremit.com/en/send-money?amount=${amount}&currency=${currency}&destinationCurrency=${recipientCurrency}`;
    case "sendwave":
      return `https://sendwave.com?amount=${amount}&currency=${currency}`;
    case "moneygram":
      return `https://moneygram.com/mgo/us/en/send?amount=${amount}&currency=${currency}`;
    case "western-union":
      return `https://westernunion.com/us/en/send-money?amount=${amount}&currency=${currency}&destinationCurrency=${recipientCurrency}`;
    default:
      return remittanceProviderLinks[slug] ?? "https://www.saverateafrica.com/providers";
  }
}

export function getProviderAffiliateLink(
  slug: string,
  params: ProviderTrackingParams = {}
) {
  const {
    amount,
    currency,
    recipientCurrency,
    ...trackingParams
  } = params;
  const baseUrl = buildProviderBaseUrl(slug, {
    amount,
    currency,
    recipientCurrency
  });

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
