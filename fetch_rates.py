import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timezone


NALA_RATES_URL = "https://partners-api.prod.nala-api.com/v1/fx/rates"
WISE_RATES_URL = "https://api.wise.com/v1/rates"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
WISE_API_TOKEN = os.environ.get("WISE_API_TOKEN", "")

CORRIDORS = [
    {"send_currency": "USD", "receive_currency": "NGN"},
    {"send_currency": "GBP", "receive_currency": "NGN"},
    {"send_currency": "CAD", "receive_currency": "NGN"},
]


def require_env(name, value):
    if not value:
        raise RuntimeError(f"Add {name} to this repository's GitHub Actions secrets.")


def to_supabase_row(row):
    try:
        rate = float(row["rate"])
    except (KeyError, TypeError, ValueError):
        return None

    return {
        "provider": row["provider"],
        "send_currency": row["send_currency"],
        "receive_currency": row["receive_currency"],
        "rate": rate,
        "updated_at": row["updated_at"],
    }


def dedupe_rows(rows):
    rows_by_key = {}

    for row in rows:
        clean_row = to_supabase_row(row)
        if not clean_row:
            continue

        key = (
            clean_row["provider"],
            clean_row["send_currency"],
            clean_row["receive_currency"],
        )
        current = rows_by_key.get(key)
        if not current or clean_row["rate"] > current["rate"]:
            rows_by_key[key] = clean_row

    return list(rows_by_key.values())


def fetch_nala_exchange_rates():
    request = urllib.request.Request(
        NALA_RATES_URL,
        headers={"Accept": "application/json"},
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    rates = payload if isinstance(payload, list) else payload.get("data", [])
    rows = []

    for rate in rates:
        if rate.get("destination_currency") != "NGN":
            continue

        rows.append(
            {
                "provider": rate.get("provider_name"),
                "send_currency": rate.get("source_currency"),
                "receive_currency": rate.get("destination_currency"),
                "rate": rate.get("rate"),
                "updated_at": rate.get("created_at"),
            }
        )

    return [row for row in rows if all(row.values())]


def fetch_wise_exchange_rate(corridor):
    query = urllib.parse.urlencode(
        {
            "source": corridor["send_currency"],
            "target": corridor["receive_currency"],
        }
    )
    request = urllib.request.Request(
        f"{WISE_RATES_URL}?{query}",
        headers={
            "Accept": "application/json",
            "Authorization": f"Bearer {WISE_API_TOKEN}",
        },
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    rate_object = payload[0] if isinstance(payload, list) else payload

    return {
        "provider": "Wise",
        "send_currency": corridor["send_currency"],
        "receive_currency": corridor["receive_currency"],
        "rate": rate_object.get("rate"),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }


def fetch_wise_exchange_rates():
    rows = []

    for corridor in CORRIDORS:
        try:
            row = fetch_wise_exchange_rate(corridor)
            if row:
                rows.append(row)
        except Exception as error:
            print(
                "[Wise] Failed "
                f"{corridor['send_currency']}-{corridor['receive_currency']}: {error}"
            )

    return [row for row in rows if all(row.values())]


def upsert_exchange_rates(rows):
    clean_rows = dedupe_rows(rows)

    if not clean_rows:
        raise RuntimeError("No exchange rate rows were collected.")

    query = urllib.parse.urlencode(
        {"on_conflict": "provider,send_currency,receive_currency"}
    )
    request = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/exchange_rates?{query}",
        data=json.dumps(clean_rows).encode("utf-8"),
        method="POST",
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=representation",
        },
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def main():
    require_env("SUPABASE_URL", SUPABASE_URL)
    require_env("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY)
    require_env("WISE_API_TOKEN", WISE_API_TOKEN)

    rows = fetch_nala_exchange_rates() + fetch_wise_exchange_rates()
    saved_rows = upsert_exchange_rates(rows)
    print(f"[Rates] Rows saved: {len(saved_rows)}")


if __name__ == "__main__":
    main()
