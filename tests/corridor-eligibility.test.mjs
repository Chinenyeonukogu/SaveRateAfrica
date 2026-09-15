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
