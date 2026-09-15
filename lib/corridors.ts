import rawCorridorConfig from "@/lib/corridor-config.json";

/** Shared configuration wrapper for browser, server, and rate scraper. */
export const NIGERIA_DESTINATION = "NGN" as const;

export type OriginCountryCode =
  | "USA"
  | "UK"
  | "Canada"
  | "UAE"
  | "Eurozone"
  | "Switzerland";
export type OriginCurrency = "USD" | "GBP" | "CAD" | "AED" | "EUR" | "CHF";
export type NigeriaCorridor = `${OriginCountryCode}-${typeof NIGERIA_DESTINATION}`;

export type ProviderCatalogName =
  | "Wise"
  | "Remitly"
  | "WorldRemit"
  | "Sendwave"
  | "PayAngel"
  | "MoneyGram"
  | "Western Union"
  | "ACE Money Transfer"
  | "Pesa"
  | "LemFi"
  | "Afriex"
  | "Flutterwave Send"
  | "Nala"
  | "TapTap Send"
  | "Paysend"
  | "Revolut";

export interface OriginCountry {
  code: OriginCountryCode;
  label: string;
  displayLabel: string;
  currency: OriginCurrency;
  region: string;
  dialCode?: string;
  flagEmoji: string;
  flagSrc?: string;
  active: boolean;
}

export interface NigeriaCorridorConfig {
  origin: OriginCountryCode;
  destination: typeof NIGERIA_DESTINATION;
  eligibleProviders: readonly ProviderCatalogName[];
  /** Providers with a real, enabled scraper integration for this corridor. */
  scrapeProviders: readonly ProviderCatalogName[];
}

export const providerCatalogNames = rawCorridorConfig.providerCatalog as readonly ProviderCatalogName[];
export const originCountries = rawCorridorConfig.origins as readonly OriginCountry[];
export const nigeriaCorridors = rawCorridorConfig.corridors as readonly NigeriaCorridorConfig[];

const providerNameAliases: Readonly<Record<string, ProviderCatalogName>> = {
  flutterwave: "Flutterwave Send",
  "flutterwave send": "Flutterwave Send",
  nala: "Nala"
};

function normalizeProviderName(providerName: string) {
  return providerName.trim().replace(/\s+/g, " ").toLowerCase();
}

export function getNigeriaCorridor(origin: OriginCountryCode): NigeriaCorridor {
  return `${origin}-${NIGERIA_DESTINATION}`;
}

export function getOriginCountry(value: string): OriginCountry | undefined {
  return originCountries.find((country) => country.code === value);
}

export function isOriginCountry(value: string): value is OriginCountryCode {
  return getOriginCountry(value) !== undefined;
}

export function toProviderCatalogName(providerName: string): ProviderCatalogName | undefined {
  const normalized = normalizeProviderName(providerName);
  const alias = providerNameAliases[normalized];

  return alias ?? providerCatalogNames.find(
    (catalogName) => normalizeProviderName(catalogName) === normalized
  );
}

export function getNigeriaCorridorConfig(origin: OriginCountryCode) {
  return nigeriaCorridors.find((corridor) => corridor.origin === origin);
}

/**
 * Fail closed: the provider must be known and explicitly allowed for this
 * exact origin + Nigeria destination pair. Currency alone is never sufficient.
 */
export function isProviderEligibleForNigeriaCorridor(
  origin: OriginCountryCode,
  providerName: string
) {
  const provider = toProviderCatalogName(providerName);
  const corridor = getNigeriaCorridorConfig(origin);

  return Boolean(provider && corridor?.eligibleProviders.includes(provider));
}

/** True only when an allowlisted provider has a real scraper for this pair. */
export function isProviderScrapeEnabledForNigeriaCorridor(
  origin: OriginCountryCode,
  providerName: string
) {
  const provider = toProviderCatalogName(providerName);
  const corridor = getNigeriaCorridorConfig(origin);

  return Boolean(provider && corridor?.scrapeProviders.includes(provider));
}
