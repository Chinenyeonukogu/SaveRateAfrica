const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WISE_API_TOKEN = process.env.WISE_API_TOKEN;

const CORRIDORS = [
  { sendCurrency: "USD", receiveCurrency: "NGN" },
  { sendCurrency: "GBP", receiveCurrency: "NGN" },
  { sendCurrency: "CAD", receiveCurrency: "NGN" }
];

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

async function upsertRows(rows) {
  const cleanRows = dedupeRows(rows);

  if (cleanRows.length === 0) {
    throw new Error("No exchange rate rows were collected.");
  }

  const url = new URL(`${SUPABASE_URL}/rest/v1/exchange_rates`);
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

  const rows = await fetchWiseRows();

  console.log(`[Rates] Total Wise rows ready to save: ${rows.length}`);
  await upsertRows(rows);
}

main().catch((error) => {
  console.error("[Rates] Sync failed:", error);
  process.exit(1);
});
