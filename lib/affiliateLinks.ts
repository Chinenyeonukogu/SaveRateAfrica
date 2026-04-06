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
  params: TrackingParams = {}
) {
  return withTracking(
    remittanceProviderLinks[slug] ?? "https://www.saverateafrica.com/providers",
    params,
    "remittance-comparison"
  );
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
