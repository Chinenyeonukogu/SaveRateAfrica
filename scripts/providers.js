const CORRIDORS = [
  { sendCurrency: "USD", receiveCurrency: "NGN" },
  { sendCurrency: "GBP", receiveCurrency: "NGN" },
  { sendCurrency: "CAD", receiveCurrency: "NGN" }
];

function localeForCurrency(currency) {
  if (currency === "GBP") return "gb";
  if (currency === "CAD") return "ca";
  return "us";
}

function worldRemitLocaleForCurrency(currency) {
  if (currency === "GBP") return "en-gb";
  if (currency === "CAD") return "en-ca";
  return "en-us";
}

const providers = [
  {
    name: "LemFi",
    supportedCorridors: CORRIDORS,
    startUrls: () => [
      "https://www.lemfi.com",
      "https://www.lemfi.com/international-money-transfer",
      "https://www.lemfi.com/send-money-to-nigeria"
    ],
    globs: ["https://www.lemfi.com/**"]
  },
  {
    name: "TapTap Send",
    supportedCorridors: CORRIDORS,
    startUrls: () => [
      "https://www.taptapsend.com",
      "https://www.taptapsend.com/send-money-to-nigeria"
    ],
    globs: ["https://www.taptapsend.com/**"]
  },
  {
    name: "Remitly",
    supportedCorridors: CORRIDORS,
    startUrls: ({ sendCurrency }) => {
      const locale = localeForCurrency(sendCurrency);
      return [
        `https://www.remitly.com/${locale}/en/nigeria`,
        "https://www.remitly.com/us/en/nigeria",
        "https://www.remitly.com/gb/en/nigeria",
        "https://www.remitly.com/ca/en/nigeria"
      ];
    },
    globs: ["https://www.remitly.com/**/nigeria**"]
  },
  {
    name: "WorldRemit",
    supportedCorridors: CORRIDORS,
    startUrls: ({ sendCurrency }) => [
      `https://www.worldremit.com/${worldRemitLocaleForCurrency(sendCurrency)}/nigeria`,
      "https://www.worldremit.com/en/nigeria"
    ],
    globs: ["https://www.worldremit.com/**/nigeria**"]
  },
  {
    name: "Western Union",
    supportedCorridors: CORRIDORS,
    startUrls: ({ sendCurrency }) => {
      const locale = localeForCurrency(sendCurrency);
      return [
        `https://www.westernunion.com/${locale}/en/web/send-money/start?ReceiveCountry=NG&ISOCurrency=NGN&SendAmount=100`,
        `https://www.westernunion.com/${locale}/en/send-money-to-nigeria.html`
      ];
    },
    globs: ["https://www.westernunion.com/**/send-money**", "https://www.westernunion.com/**/nigeria**"]
  },
  {
    name: "MoneyGram",
    supportedCorridors: CORRIDORS,
    startUrls: ({ sendCurrency }) => {
      const locale = localeForCurrency(sendCurrency);
      return [
        `https://www.moneygram.com/mgo/${locale}/en/send/how-to-send-money-to-nigeria`,
        `https://www.moneygram.com/mgo/${locale}/en/`
      ];
    },
    globs: ["https://www.moneygram.com/**/nigeria**", "https://www.moneygram.com/mgo/**"]
  },
  {
    name: "Paysend",
    supportedCorridors: CORRIDORS,
    startUrls: ({ sendCurrency }) => [
      `https://paysend.com/en-${localeForCurrency(sendCurrency)}/send-money/to-nigeria`,
      "https://paysend.com/send-money/to-nigeria"
    ],
    globs: ["https://paysend.com/**/send-money/to-nigeria**"]
  },
  {
    name: "Flutterwave Send",
    supportedCorridors: CORRIDORS,
    startUrls: () => ["https://flutterwave.com/send", "https://send.flutterwave.com"],
    globs: ["https://flutterwave.com/**", "https://send.flutterwave.com/**"]
  },
  {
    name: "Afriex",
    supportedCorridors: CORRIDORS,
    startUrls: () => ["https://www.afriex.co", "https://www.afriex.co/send-money-to-nigeria"],
    globs: ["https://www.afriex.co/**"]
  },
  {
    name: "Chipper Cash",
    supportedCorridors: CORRIDORS,
    startUrls: () => ["https://www.chippercash.com", "https://www.chippercash.com/remittances"],
    globs: ["https://www.chippercash.com/**"]
  },
  {
    name: "Nala",
    supportedCorridors: CORRIDORS,
    startUrls: () => ["https://www.nala.money", "https://www.nala.money/send-money-to-nigeria"],
    globs: ["https://www.nala.money/**"]
  },
  {
    name: "Sendwave",
    supportedCorridors: CORRIDORS,
    startUrls: () => ["https://www.sendwave.com", "https://www.sendwave.com/send-money-to-nigeria"],
    globs: ["https://www.sendwave.com/**"]
  }
];

module.exports = {
  CORRIDORS,
  providers
};
