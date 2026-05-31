type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      eventParams: GtagEventParams
    ) => void;
  }
}

function getCurrentPageUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href;
}

function trackEvent(eventName: string, eventParams: GtagEventParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, eventParams);
}

export function buildNigeriaCorridor(origin: string) {
  return `${origin}-Nigeria`;
}

export function trackProviderClick({
  affiliateLink,
  corridor,
  providerName
}: {
  affiliateLink: string;
  corridor: string;
  providerName: string;
}) {
  trackEvent("provider_click", {
    provider_name: providerName,
    corridor,
    page_url: getCurrentPageUrl(),
    affiliate_link: affiliateLink
  });
}

export function trackCreditCardClick({
  affiliateLink,
  cardCategory,
  cardName
}: {
  affiliateLink: string;
  cardCategory: string;
  cardName: string;
}) {
  trackEvent("credit_card_click", {
    card_name: cardName,
    card_category: cardCategory,
    page_url: getCurrentPageUrl(),
    affiliate_link: affiliateLink
  });
}

export {};
