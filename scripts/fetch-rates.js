const { CORRIDORS, providers } = require("./providers");

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WISE_API_TOKEN = process.env.WISE_API_TOKEN;
const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

const APIFY_ACTOR_URL = "https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items";

const apifyPageFunction = String.raw`async function pageFunction(context) {
  const { provider, source, target } = context.request.userData;
  const bodyText = document.body?.innerText || "";
  const scriptText = Array.from(document.scripts || [])
    .map((script) => script.textContent || "")
    .join(" ");
  const text = (bodyText + " " + scriptText)
    .replace(/\\u0026/g, "&")
    .replace(/\\u003d/g, "=")
    .replace(/\s+/g, " ");

  function parseAmount(value) {
    if (!value) return null;
    const amount = Number(String(value).replace(/[^0-9.]/g, ""));
    return Number.isFinite(amount) ? amount : null;
  }

  function addRateCandidate(candidates, value, weight, reason) {
    if (value && value >= 100 && value <= 5000) {
      candidates.push({ value, weight, reason });
    }
  }

  function findRate() {
    const candidates = [];
    const directPatterns = [
      new RegExp("1\\s*" + source + "\\s*(?:=|is|equals|gets|to)?\\s*(?:NGN|\u20a6)?\\s*([0-9][0-9,]*(?:[.][0-9]+)?)", "gi"),
      new RegExp("(?:NGN|\u20a6)\\s*([0-9][0-9,]*(?:[.][0-9]+)?)\\s*(?:=|for|per)\\s*1\\s*" + source, "gi"),
      new RegExp("(?:rate|exchangeRate|exchange_rate|fxRate|fx_rate)[^0-9]{0,40}([0-9][0-9,]*(?:[.][0-9]+)?)", "gi")
    ];

    for (const pattern of directPatterns) {
      for (const match of text.matchAll(pattern)) {
        addRateCandidate(candidates, parseAmount(match[1]), 4, "direct-pattern");
      }
    }

    const snippets = text.match(/.{0,180}(NGN|\u20a6|naira|nigeria).{0,180}/gi) || [];

    for (const snippet of snippets) {
      if (!/(rate|exchange|recipient|receive|gets|send|transfer|ngn|naira|\u20a6)/i.test(snippet)) continue;

      const numbers = snippet.match(/(?:\u20a6|\bNGN\b)?\s*[0-9][0-9,]*(?:\.[0-9]+)?/gi) || [];
      for (const numberText of numbers) {
        const value = parseAmount(numberText);
        addRateCandidate(candidates, value, snippet.includes(source) ? 3 : 1, "ngn-snippet");
      }
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.weight - a.weight || b.value - a.value);
    return candidates[0];
  }

  function findFee() {
    const sourceSymbols = {
      USD: "$",
      GBP: "GBP",
      CAD: "C$"
    };
    const symbol = sourceSymbols[source] || source;
    const snippets = text.match(/.{0,100}(fee|fees|charge|cost).{0,100}/gi) || [];

    for (const snippet of snippets) {
      const hasSourceCurrency = snippet.includes(source) || snippet.includes(symbol);
      if (!hasSourceCurrency) continue;

      const numbers = snippet.match(/[0-9][0-9,]*(?:\.[0-9]+)?/g) || [];
      for (const numberText of numbers) {
        const value = parseAmount(numberText);
        if (value !== null && value >= 0 && value <= 100) {
          return value;
        }
      }
    }

    return 0;
  }

  const rateCandidate = findRate();

  return {
    provider,
    send_currency: source,
    receive_currency: target,
    tested_url: context.request.url,
    rate: rateCandidate?.value ?? null,
    rate_reason: rateCandidate?.reason ?? null,
    fee: findFee()
  };
}`;

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Add ${name} to this repository's GitHub Actions secrets.`);
  }
}

function toSupabaseRow(row) {
  const rate = Number(row.rate);
  const fee = Number(row.fee ?? 0);

  if (!Number.isFinite(rate)) {
    return null;
  }

  return {
    send_currency: row.send_currency,
    receive_currency: row.receive_currency,
    provider: row.provider,
    rate,
    fee: Number.isFinite(fee) ? fee : 0,
    updated_at: new Date().toISOString()
  };
}

function dedupeRows(rows) {
  const rowsByKey = new Map();

  for (const row of rows.map(toSupabaseRow).filter(Boolean)) {
    const key = `${row.provider}-${row.send_currency}-${row.receive_currency}`;
    const current = rowsByKey.get(key);
    if (!current || row.rate > current.rate) {
      rowsByKey.set(key, row);
    }
  }

  return Array.from(rowsByKey.values());
}

function providerStartUrls(provider) {
  return provider.supportedCorridors.flatMap((corridor) => {
    const urls = Array.from(new Set(provider.startUrls(corridor)));

    return urls.map((url, index) => ({
      url,
      uniqueKey: `${provider.name}-${corridor.sendCurrency}-${corridor.receiveCurrency}-${index}`,
      userData: {
        provider: provider.name,
        source: corridor.sendCurrency,
        target: corridor.receiveCurrency
      }
    }));
  });
}

async function fetchWiseRate(corridor) {
  const url = new URL("https://api.wise.com/v1/rates");
  url.searchParams.set("source", corridor.sendCurrency);
  url.searchParams.set("target", corridor.receiveCurrency);

  console.log(`[Wise] Fetching ${corridor.sendCurrency}-${corridor.receiveCurrency} from ${url}`);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${WISE_API_TOKEN}`
    }
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Wise rate fetch failed for ${corridor.sendCurrency}/${corridor.receiveCurrency}: ${response.status} ${responseText}`);
  }

  const payload = JSON.parse(responseText);
  const rateObject = Array.isArray(payload) ? payload[0] : payload;
  const rate = Number(rateObject?.rate);

  if (!Number.isFinite(rate)) {
    throw new Error(`Wise returned an invalid rate for ${corridor.sendCurrency}/${corridor.receiveCurrency}.`);
  }

  console.log(`[Wise] Found ${corridor.sendCurrency}-${corridor.receiveCurrency}: rate=${rate} fee=0`);

  return toSupabaseRow({
    send_currency: corridor.sendCurrency,
    receive_currency: corridor.receiveCurrency,
    provider: "Wise",
    rate,
    fee: 0
  });
}

async function fetchWiseRows() {
  const results = [];

  for (const corridor of CORRIDORS) {
    try {
      const row = await fetchWiseRate(corridor);
      if (row) results.push(row);
    } catch (error) {
      console.error(`[Wise] Failed ${corridor.sendCurrency}-${corridor.receiveCurrency}:`, error);
    }
  }

  return results;
}

async function fetchProviderRows(provider) {
  const startUrls = providerStartUrls(provider);

  console.log(`[Apify] Scraping ${provider.name}`);
  console.log(`[Apify] ${provider.name} globs: ${provider.globs.join(", ")}`);
  for (const item of startUrls) {
    const { source, target } = item.userData;
    console.log(`[Apify] ${provider.name} testing ${source}-${target}: ${item.url}`);
  }

  const input = {
    startUrls,
    maxRequestsPerCrawl: startUrls.length,
    maxConcurrency: 6,
    injectJQuery: false,
    pageFunction: apifyPageFunction,
    proxyConfiguration: {
      useApifyProxy: true
    }
  };

  const url = new URL(APIFY_ACTOR_URL);
  url.searchParams.set("token", APIFY_API_TOKEN);
  url.searchParams.set("clean", "true");
  url.searchParams.set("timeout", "180");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Apify run failed for ${provider.name}: ${response.status} ${responseText}`);
  }

  const items = JSON.parse(responseText);

  for (const item of items) {
    const found = Number.isFinite(Number(item.rate));
    console.log(
      `[Apify] ${provider.name} result ${item.send_currency}-${item.receive_currency} ${found ? `rate=${item.rate} fee=${item.fee ?? 0}` : "no rate"} url=${item.tested_url}`
    );
  }

  const rows = dedupeRows(items);
  console.log(`[Apify] ${provider.name} rates found: ${rows.length}/${provider.supportedCorridors.length}`);

  return rows;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = [];
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function fetchApifyRows() {
  const providerResults = await mapWithConcurrency(providers, 3, async (provider) => {
    try {
      return await fetchProviderRows(provider);
    } catch (error) {
      console.error(`[Apify] ${provider.name} failed:`, error);
      return [];
    }
  });

  return providerResults.flat();
}

async function upsertRows(rows) {
  const cleanRows = dedupeRows(rows);

  if (cleanRows.length === 0) {
    throw new Error("No exchange rate rows were collected.");
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/exchange_rates?on_conflict=provider, send_currency,recieve_currency`);
  url.searchParams.set("on_conflict", "provider,send_currency,receive_currency");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(cleanRows)
  });
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Supabase upsert failed: ${response.status} ${responseText}`);
  }

  console.log(`[Supabase] Rows saved: ${cleanRows.length}`);
  console.table(cleanRows);
}

async function main() {
  requireEnv("SUPABASE_URL", SUPABASE_URL);
  requireEnv("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY);
  requireEnv("WISE_API_TOKEN", WISE_API_TOKEN);
  requireEnv("APIFY_API_TOKEN", APIFY_API_TOKEN);

  const wiseRows = await fetchWiseRows();
  const apifyRows = await fetchApifyRows();
  const rows = dedupeRows([...wiseRows, ...apifyRows]);

  console.log(`[Rates] Total deduplicated rows ready to save: ${rows.length}`);
  await upsertRows(rows);
}

main().catch((error) => {
  console.error("[Rates] Sync failed:", error);
  process.exit(1);
});
