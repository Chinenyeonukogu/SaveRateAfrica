import assert from "node:assert/strict";
import test from "node:test";
import config from "../lib/corridor-config.json" with { type: "json" };

function providersThatMayRender(origin, rateRows) {
  const corridor = config.corridors.find(
    (entry) => entry.origin === origin && entry.destination === "NGN"
  );
  const sourceCurrency = config.origins.find((entry) => entry.code === origin)?.currency;

  return rateRows.filter(
    (row) =>
      row.send_currency === sourceCurrency &&
      row.receive_currency === "NGN" &&
      corridor.eligibleProviders.includes(row.provider) &&
      corridor.scrapeProviders.includes(row.provider)
  );
}

test("UAE → NGN never renders Flutterwave Send, Nala, or PayAngel", () => {
  const rows = [
    { provider: "Flutterwave Send", send_currency: "AED", receive_currency: "NGN" },
    { provider: "Nala", send_currency: "AED", receive_currency: "NGN" },
    { provider: "PayAngel", send_currency: "AED", receive_currency: "NGN" },
    { provider: "Wise", send_currency: "AED", receive_currency: "NGN" },
    // Rows from another corridor must not leak into UAE either.
    { provider: "Flutterwave Send", send_currency: "GBP", receive_currency: "NGN" }
  ];

  const renderedProviders = providersThatMayRender("UAE", rows).map((row) => row.provider);

  assert.deepEqual(renderedProviders, ["Wise"]);
  assert.equal(renderedProviders.includes("Flutterwave Send"), false);
  assert.equal(renderedProviders.includes("Nala"), false);
  assert.equal(renderedProviders.includes("PayAngel"), false);
});

test("Switzerland to NGN is active and only renders its scrape allowlist", () => {
  const switzerland = config.origins.find((entry) => entry.code === "Switzerland");
  assert.equal(switzerland?.active, true);

  const rows = [
    { provider: "Wise", send_currency: "CHF", receive_currency: "NGN" },
    { provider: "Paysend", send_currency: "CHF", receive_currency: "NGN" },
    { provider: "MoneyGram", send_currency: "CHF", receive_currency: "NGN" },
    { provider: "Wise", send_currency: "GBP", receive_currency: "NGN" }
  ];

  assert.deepEqual(
    providersThatMayRender("Switzerland", rows).map((row) => row.provider),
    ["Wise", "Paysend"]
  );
});

test("new recipient corridors fail closed by origin, destination, and provider", () => {
  const rows = [
    { provider: "Wise", send_currency: "USD", receive_currency: "GHS" },
    { provider: "PayAngel", send_currency: "USD", receive_currency: "GHS" },
    { provider: "Wise", send_currency: "USD", receive_currency: "XOF" },
    { provider: "Remitly", send_currency: "USD", receive_currency: "XOF" }
  ];

  assert.deepEqual(
    providersThatMayRender("USA", rows).map((row) => row.provider),
    []
  );
  const ghana = config.corridors.find((entry) => entry.origin === "USA" && entry.destination === "GHS");
  const senegal = config.corridors.find((entry) => entry.origin === "USA" && entry.destination === "XOF");
  assert.deepEqual(ghana.scrapeProviders, ["Wise", "Remitly"]);
  assert.deepEqual(senegal.scrapeProviders, ["Remitly"]);
});
