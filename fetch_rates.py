import json
import os
import urllib.parse
import urllib.request


NALA_RATES_URL = "https://partners-api.prod.nala-api.com/v1/fx/rates"
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")


def require_env(name, value):
    if not value:
        raise RuntimeError(f"Add {name} to this repository's GitHub Actions secrets.")


def fetch_nala_exchange_rates():
    request = urllib.request.Request(
        NALA_RATES_URL,
        headers={"Accept": "application/json"},
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    rates = payload if isinstance(payload, list) else payload.get("rates", [])
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


def upsert_exchange_rates(rows):
    if not rows:
        raise RuntimeError("No Nala NGN exchange rate rows were collected.")

    query = urllib.parse.urlencode(
        {"on_conflict": "provider,send_currency,receive_currency"}
    )
    request = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/exchange_rates?{query}",
        data=json.dumps(rows).encode("utf-8"),
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

    rows = fetch_nala_exchange_rates()
    saved_rows = upsert_exchange_rates(rows)
    print(f"[Nala] Rows saved: {len(saved_rows)}")


if __name__ == "__main__":
    main()
