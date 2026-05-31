import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone


NALA_RATES_URL = "https://partners-api.prod.nala-api.com/v1/fx/rates"
WISE_RATES_URL = "https://api.wise.com/v1/rates"
PESAPEER_RATES_URL = "https://backend-api.prod.pesapeer.com/v2/public/currency-pairs"
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
WISE_API_TOKEN = os.environ.get("WISE_API_TOKEN", "")
MAX_REASONABLE_NGN_RATE = 3000
BROWSER_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

CORRIDORS = [
    {"send_currency": "USD", "receive_currency": "NGN"},
    {"send_currency": "GBP", "receive_currency": "NGN"},
    {"send_currency": "CAD", "receive_currency": "NGN"},
]
SUPPORTED_SEND_CURRENCIES = {corridor["send_currency"] for corridor in CORRIDORS}

PAYSEND_REQUESTS = [
    {
        "send_currency": "USD",
        "url": "https://paysend.com/api/calculator?lang=en&country=US&operation=send&amount=500.00&sourceCountry=us&targetCountry=ng&sourceCurrency=usd&targetCurrency=ngn",
    },
    {
        "send_currency": "GBP",
        "url": "https://paysend.com/api/calculator?lang=en&country=US&operation=send&amount=500.00&sourceCountry=uk&targetCountry=ng&sourceCurrency=gbp&targetCurrency=ngn",
    },
    {
        "send_currency": "CAD",
        "url": "https://paysend.com/api/calculator?lang=en&country=US&operation=send&amount=500&sourceCountry=ca&targetCountry=ng&sourceCurrency=cad&targetCurrency=ngn",
    },
]

FLUTTERWAVE_REQUESTS = [
    {
        "send_currency": "GBP",
        "url": "https://sendgateway.myflutterwave.com/api/v1/config/calculatepaymentdetails?Amount=500&FromCurrency=GBP&ToCurrency=NGN&FromCountry=GB&ToCountry=NG&IsBalanceCharge=true&Party=Sender",
    },
    {
        "send_currency": "USD",
        "url": "https://sendgateway.myflutterwave.com/api/v1/config/calculatepaymentdetails?Amount=500&FromCurrency=USD&ToCurrency=NGN&FromCountry=US&ToCountry=NG&IsBalanceCharge=true&Party=Sender",
    },
]

REMITLY_REQUESTS = [
    {
        "send_currency": "USD",
        "url": "https://api.remitly.io/v3/calculator/estimate?conduit=USA%3AUSD-NGA%3ANGN&anchor=SEND&amount=500&purpose=OTHER&customer_segment=RETURNING&promoCode=&strict_promo=true",
    },
    {
        "send_currency": "GBP",
        "url": "https://api.remitly.io/v3/calculator/estimate?conduit=GBR%3AGBP-NGA%3ANGN&anchor=SEND&amount=1&purpose=OTHER&customer_segment=RETURNING&promoCode=&strict_promo=true",
    },
    {
        "send_currency": "CAD",
        "url": "https://api.remitly.io/v3/calculator/estimate?conduit=CAN%3ACAD-NGA%3ANGN&anchor=SEND&amount=500&purpose=OTHER&customer_segment=RETURNING&promoCode=&strict_promo=true",
    },
]

SENDWAVE_REQUESTS = [
    {
        "send_currency": "USD",
        "url": "https://app.sendwave.com/v2/pricing-public?amountType=SEND&receiveCurrency=NGN&amount=0&sendCurrency=USD&sendCountryIso2=us&receiveCountryIso2=ng",
    },
    {
        "send_currency": "GBP",
        "url": "https://app.sendwave.com/v2/pricing-public?amountType=SEND&receiveCurrency=NGN&amount=200&sendCurrency=GBP&sendCountryIso2=gb&receiveCountryIso2=ng",
    },
    {
        "send_currency": "CAD",
        "url": "https://app.sendwave.com/v2/pricing-public?amountType=SEND&receiveCurrency=NGN&amount=200&sendCurrency=CAD&sendCountryIso2=ca&receiveCountryIso2=ng",
    },
]

def require_env(name, value):
    if not value:
        raise RuntimeError(f"Add {name} to this repository's GitHub Actions secrets.")


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def browser_headers(referer, extra_headers=None):
    headers = {
        "User-Agent": BROWSER_USER_AGENT,
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": referer,
    }
    if extra_headers:
        headers.update(extra_headers)

    return headers


def to_supabase_row(row):
    try:
        rate = float(row["rate"])
    except (KeyError, TypeError, ValueError):
        return None

    fee = row.get("fee")
    if fee is not None:
        try:
            fee = round(float(fee), 2)
        except (TypeError, ValueError):
            fee = None

    clean_row = {
        "provider": row["provider"],
        "send_currency": row["send_currency"],
        "receive_currency": row["receive_currency"],
        "rate": round(rate, 2),
        "fee": fee,
        "updated_at": row["updated_at"],
        "is_automated": True,
    }

    return clean_row


def to_rate_history_row(row):
    try:
        rate = float(row["rate"])
    except (KeyError, TypeError, ValueError):
        return None

    fee = row.get("fee")
    if fee is not None:
        try:
            fee = round(float(fee), 2)
        except (TypeError, ValueError):
            fee = None

    return {
        "provider": row["provider"],
        "send_currency": row["send_currency"],
        "receive_currency": row["receive_currency"],
        "rate": round(rate, 2),
        "fee": fee,
        "timestamp": datetime.utcnow().isoformat(),
    }


def has_required_rate_fields(row):
    required_fields = (
        row.get("provider"),
        row.get("send_currency"),
        row.get("receive_currency"),
        row.get("rate"),
        row.get("updated_at"),
    )

    return all(value is not None and value != "" for value in required_fields)


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
        headers=browser_headers("https://www.nala.com/"),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    rates = payload if isinstance(payload, list) else payload.get("data", [])
    rows = []

    for rate in rates:
        if rate.get("destination_currency") != "NGN":
            continue
        if rate.get("source_currency") not in SUPPORTED_SEND_CURRENCIES:
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

    return [row for row in rows if has_required_rate_fields(row)]


def fetch_wise_exchange_rate(corridor):
    query = urllib.parse.urlencode(
        {
            "source": corridor["send_currency"],
            "target": corridor["receive_currency"],
        }
    )
    request = urllib.request.Request(
        f"{WISE_RATES_URL}?{query}",
        headers=browser_headers(
            "https://wise.com/",
            {
                "Authorization": f"Bearer {WISE_API_TOKEN}",
            },
        ),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    rate_object = payload[0] if isinstance(payload, list) else payload

    return {
        "provider": "Wise",
        "send_currency": corridor["send_currency"],
        "receive_currency": corridor["receive_currency"],
        "rate": rate_object.get("rate"),
        "updated_at": utc_now(),
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

    return [row for row in rows if has_required_rate_fields(row)]


def fetch_pesapeer_exchange_rates():
    request = urllib.request.Request(
        PESAPEER_RATES_URL,
        headers=browser_headers("https://www.pesapeer.com/"),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    pairs = payload if isinstance(payload, list) else payload.get("data", [])
    rows = []

    for pair in pairs:
        if pair.get("to_currency_code") != "NGN":
            continue
        if pair.get("from_currency_code") not in SUPPORTED_SEND_CURRENCIES:
            continue
        if pair.get("status") != "ACTIVE":
            continue
        if pair.get("rate_type") != "SELL":
            continue

        rows.append(
            {
                "provider": "Pesa",
                "send_currency": pair.get("from_currency_code"),
                "receive_currency": "NGN",
                "rate": pair.get("pesapeer_rate"),
                "updated_at": utc_now(),
            }
        )

    return [row for row in rows if has_required_rate_fields(row)]


def fetch_paysend_exchange_rate(request_config):
    request = urllib.request.Request(
        request_config["url"],
        headers=browser_headers("https://paysend.com/"),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    calculator = payload.get("calculator") if isinstance(payload, dict) else None
    transaction = (
        calculator.get("transaction") if isinstance(calculator, dict) else None
    )
    if not isinstance(transaction, dict):
        return None

    return {
        "provider": "Paysend",
        "send_currency": request_config["send_currency"],
        "receive_currency": "NGN",
        "rate": transaction.get("conversionRate"),
        "fee": transaction.get("commissionAmount"),
        "fee_currency": transaction.get("commissionCurrency"),
        "updated_at": utc_now(),
    }


def fetch_paysend_exchange_rates():
    rows = []

    for request_config in PAYSEND_REQUESTS:
        try:
            row = fetch_paysend_exchange_rate(request_config)
            if row:
                rows.append(row)
        except Exception as error:
            print(f"[Paysend] Failed {request_config['send_currency']}-NGN: {error}")

    return [row for row in rows if has_required_rate_fields(row)]


def fetch_flutterwave_exchange_rate(request_config):
    request = urllib.request.Request(
        request_config["url"],
        headers=browser_headers("https://send.flutterwave.com/"),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        return None

    return {
        "provider": "Flutterwave",
        "send_currency": request_config["send_currency"],
        "receive_currency": "NGN",
        "rate": data.get("rate"),
        "fee": data.get("fee"),
        "fee_currency": request_config["send_currency"],
        "updated_at": utc_now(),
    }


def fetch_flutterwave_exchange_rates():
    rows = []

    for request_config in FLUTTERWAVE_REQUESTS:
        try:
            row = fetch_flutterwave_exchange_rate(request_config)
            if row:
                rows.append(row)
        except Exception as error:
            print(
                f"[Flutterwave] Failed {request_config['send_currency']}-NGN: {error}"
            )

    return [row for row in rows if has_required_rate_fields(row)]


def fetch_remitly_exchange_rate(request_config):
    request = urllib.request.Request(
        request_config["url"],
        headers=browser_headers("https://www.remitly.com/"),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    estimate = payload.get("estimate") if isinstance(payload, dict) else None
    if not isinstance(estimate, dict):
        return None

    exchange_rate = estimate.get("exchange_rate") or {}
    fee = estimate.get("fee") or {}

    return {
        "provider": "Remitly",
        "send_currency": request_config["send_currency"],
        "receive_currency": "NGN",
        "rate": exchange_rate.get("base_rate")
        or exchange_rate.get("promotional_exchange_rate"),
        "fee": fee.get("total_fee_amount"),
        "fee_currency": request_config["send_currency"],
        "updated_at": utc_now(),
    }


def fetch_remitly_exchange_rates():
    rows = []

    for request_config in REMITLY_REQUESTS:
        try:
            if rows:
                time.sleep(2)
            row = fetch_remitly_exchange_rate(request_config)
            if row:
                rows.append(row)
        except Exception as error:
            print(f"[Remitly] Failed {request_config['send_currency']}-NGN: {error}")

    return [row for row in rows if has_required_rate_fields(row)]


def fetch_sendwave_exchange_rate(request_config):
    request = urllib.request.Request(
        request_config["url"],
        headers=browser_headers("https://www.sendwave.com/"),
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))

    return {
        "provider": "Sendwave",
        "send_currency": request_config["send_currency"],
        "receive_currency": "NGN",
        "rate": payload.get("effectiveExchangeRate")
        or payload.get("baseExchangeRate"),
        "fee": payload.get("effectiveFeeAmount") or payload.get("baseFeeAmount"),
        "fee_currency": request_config["send_currency"],
        "updated_at": utc_now(),
    }


def fetch_sendwave_exchange_rates():
    rows = []

    for request_config in SENDWAVE_REQUESTS:
        try:
            row = fetch_sendwave_exchange_rate(request_config)
            if row:
                rows.append(row)
        except Exception as error:
            print(f"[Sendwave] Failed {request_config['send_currency']}-NGN: {error}")

    return [row for row in rows if has_required_rate_fields(row)]


def delete_exchange_rates(filters):
    query = urllib.parse.urlencode(filters)
    request = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/exchange_rates?{query}",
        method="DELETE",
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Prefer": "return=representation",
        },
    )

    with urllib.request.urlopen(request, timeout=30) as response:
        response_text = response.read().decode("utf-8")
        return json.loads(response_text) if response_text else []


def cleanup_exchange_rates():
    deleted_rows = []
    cleanup_filters = [
        {"send_currency": "eq.EUR"},
        {"rate": f"gt.{MAX_REASONABLE_NGN_RATE}"},
    ]

    for filters in cleanup_filters:
        deleted_rows.extend(delete_exchange_rates(filters))

    return deleted_rows


def collect_provider_rows(label, fetcher):
    try:
        return fetcher()
    except Exception as error:
        print(f"[{label}] Failed provider sync: {error}")
        return []


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

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        response_body = error.read().decode("utf-8", errors="replace")
        print(f"[Supabase] Upsert failed: HTTP {error.code}")
        print(f"[Supabase] Error body: {response_body}")
        raise


def insert_rate_history(rows):
    history_rows = []

    for row in rows:
        history_row = to_rate_history_row(row)
        if history_row:
            history_rows.append(history_row)

    if not history_rows:
        print("[Rate history] No rows to insert.")
        return []

    request = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/rate_history",
        data=json.dumps(history_rows).encode("utf-8"),
        method="POST",
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            response_text = response.read().decode("utf-8")
            return json.loads(response_text) if response_text else []
    except urllib.error.HTTPError as error:
        response_body = error.read().decode("utf-8", errors="replace")
        print(f"[Rate history] Insert failed: HTTP {error.code}")
        print(f"[Rate history] Error body: {response_body}")
        raise


def main():
    require_env("NEXT_PUBLIC_SUPABASE_URL", SUPABASE_URL)
    require_env("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY)
    require_env("WISE_API_TOKEN", WISE_API_TOKEN)

    deleted_rows = cleanup_exchange_rates()
    if deleted_rows:
        print(f"[Rates] Removed stale or unsupported rows: {len(deleted_rows)}")

    rows = (
        collect_provider_rows("Nala", fetch_nala_exchange_rates)
        + collect_provider_rows("Wise", fetch_wise_exchange_rates)
        + collect_provider_rows("PesaPeer", fetch_pesapeer_exchange_rates)
        + collect_provider_rows("Paysend", fetch_paysend_exchange_rates)
        + collect_provider_rows("Flutterwave", fetch_flutterwave_exchange_rates)
        + collect_provider_rows("Remitly", fetch_remitly_exchange_rates)
        + collect_provider_rows("Sendwave", fetch_sendwave_exchange_rates)
    )

    saved_rows = upsert_exchange_rates(rows)
    print(f"[Rates] Rows saved: {len(saved_rows)}")

    history_rows = insert_rate_history(saved_rows)
    print(f"[Rate history] Rows inserted: {len(history_rows)}")


if __name__ == "__main__":
    main()
