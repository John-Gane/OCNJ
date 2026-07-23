#!/usr/bin/env python3
"""Weekly monitor for OCNJ business links and official directory changes.

The monitor intentionally flags questionable results for human review. It never
removes a business automatically.
"""

from __future__ import annotations

import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REPORTS = ROOT / "reports"

BUSINESSES_FILE = DATA / "businesses.json"
SOURCES_FILE = DATA / "discovery-sources.json"
DISCOVERED_FILE = DATA / "discovered-listings.json"
STATUS_FILE = DATA / "business-status.json"
LATEST_REPORT = REPORTS / "business-monitor-latest.md"
ALERT_REPORT = REPORTS / "business-monitor-alert.md"

USER_AGENT = (
    "OCNJ-ETH-Business-Monitor/2.0 "
    "(weekly public-page review; independent private guide)"
)
REQUEST_TIMEOUT = 15
MAX_WORKERS = 6

CLOSED_PHRASES = (
    "permanently closed",
    "has permanently closed",
    "has closed its doors",
    "no longer in business",
    "ceased operations",
    "closed permanently",
)


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, value) -> None:
    path.write_text(
        json.dumps(value, indent=2, sort_keys=False) + "\n",
        encoding="utf-8",
    )


def get_page(url: str, timeout: int = REQUEST_TIMEOUT) -> requests.Response:
    return requests.get(
        url,
        timeout=timeout,
        allow_redirects=True,
        headers={"User-Agent": USER_AGENT},
    )


def compact_text(html: str) -> tuple[str, str]:
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.get_text(" ", strip=True) if soup.title else ""
    for element in soup(["script", "style", "noscript", "svg"]):
        element.decompose()
    text = " ".join(soup.get_text(" ", strip=True).split())
    return title, text


def check_business(business: dict) -> dict:
    result = {
        "id": business["id"],
        "name": business["name"],
        "url": business["url"],
        "final_url": business["url"],
        "http_status": None,
        "status": "review",
        "reason": "",
        "page_title": "",
    }

    try:
        response = get_page(business["url"])
        result["http_status"] = response.status_code
        result["final_url"] = response.url

        if response.status_code >= 400:
            result["status"] = "unreachable"
            result["reason"] = f"HTTP {response.status_code}"
            return result

        title, text = compact_text(response.text)
        result["page_title"] = title
        lower_text = text.lower()
        closure_scope = f"{title} {text[:3000]}".lower()

        matched_closed = [
            phrase for phrase in CLOSED_PHRASES if phrase in closure_scope
        ]
        if matched_closed:
            result["status"] = "review"
            result["reason"] = f"Closure language detected: {matched_closed[0]}"
            return result

        expected = business.get("expected_keywords", [])
        if expected and not any(
            keyword.lower() in lower_text for keyword in expected
        ):
            result["status"] = "review"
            result["reason"] = "Expected business name/content was not found"
            return result

        if len(text) < 120:
            result["status"] = "review"
            result["reason"] = "Page content was unusually short"
            return result

        result["status"] = "healthy"
        result["reason"] = "Page reachable and expected content found"
        return result

    except requests.RequestException as exc:
        result["status"] = "unreachable"
        result["reason"] = f"{exc.__class__.__name__}: {exc}"
        return result


def scrape_source_links(source: dict) -> set[str]:
    response = get_page(source["url"])
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    pattern = source.get("link_pattern", "")
    source_host = urlparse(source["url"]).netloc
    links: set[str] = set()

    for anchor in soup.find_all("a", href=True):
        absolute = urljoin(source["url"], anchor["href"])
        parsed = urlparse(absolute)

        if parsed.netloc != source_host:
            continue
        if pattern and pattern not in parsed.path:
            continue

        clean = parsed._replace(query="", fragment="").geturl().rstrip("/") + "/"
        links.add(clean)

    return links


def write_reports(
    status_payload: dict,
    new_links: list[str],
    source_errors: list[str],
) -> bool:
    REPORTS.mkdir(parents=True, exist_ok=True)
    summary = status_payload["summary"]
    alerts = [
        item
        for item in status_payload["businesses"]
        if item["status"] != "healthy"
    ]

    lines = [
        "# OCNJ Business Monitor",
        "",
        f"Last automated check: **{status_payload['checked_at']}**",
        "",
        "## Summary",
        "",
        f"- Tracked businesses/destinations: **{summary['total']}**",
        f"- Healthy: **{summary['healthy']}**",
        f"- Needs review: **{summary['review']}**",
        f"- Unreachable: **{summary['unreachable']}**",
        f"- New official-directory links detected: **{len(new_links)}**",
        "",
    ]

    if alerts:
        lines.extend(["## Listings needing review", ""])
        for item in alerts:
            lines.append(
                f"- **{item['name']}** — {item['status']}: "
                f"{item['reason']} ({item['url']})"
            )
        lines.append("")

    if new_links:
        lines.extend(
            [
                "## Possible new or changed official listings",
                "",
                "These links appeared on monitored official Ocean City directory "
                "pages after the prior baseline. Review them before adding anything "
                "to the site.",
                "",
            ]
        )
        lines.extend(f"- {link}" for link in new_links)
        lines.append("")

    if source_errors:
        lines.extend(["## Directory sources that could not be checked", ""])
        lines.extend(f"- {error}" for error in source_errors)
        lines.append("")

    lines.extend(
        [
            "## Important limitation",
            "",
            "This private automation checks public website availability, expected "
            "wording, clear permanent-closure language and changes in selected "
            "official directory links. It cannot prove that a business is open, "
            "discover every new business, or distinguish every temporary website "
            "problem from a closure. It never removes a listing automatically. A "
            "human should review every alert.",
            "",
        ]
    )

    report = "\n".join(lines)
    LATEST_REPORT.write_text(report, encoding="utf-8")

    has_alerts = bool(alerts or new_links or source_errors)
    if has_alerts:
        ALERT_REPORT.write_text(report, encoding="utf-8")
    elif ALERT_REPORT.exists():
        ALERT_REPORT.unlink()

    return has_alerts


def main() -> int:
    businesses = load_json(BUSINESSES_FILE)
    sources = load_json(SOURCES_FILE)
    prior_discovery = load_json(DISCOVERED_FILE)
    checked_at = datetime.now(timezone.utc).isoformat(timespec="seconds")

    results_by_id: dict[str, dict] = {}
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(check_business, business): business["id"]
            for business in businesses
        }
        for future in as_completed(futures):
            business_id = futures[future]
            try:
                results_by_id[business_id] = future.result()
            except Exception as exc:  # defensive isolation of one worker
                business = next(item for item in businesses if item["id"] == business_id)
                results_by_id[business_id] = {
                    "id": business_id,
                    "name": business["name"],
                    "url": business["url"],
                    "final_url": business["url"],
                    "http_status": None,
                    "status": "unreachable",
                    "reason": f"Unexpected monitor error: {exc}",
                    "page_title": "",
                }

    results = [results_by_id[business["id"]] for business in businesses]
    summary = {
        "total": len(results),
        "healthy": sum(item["status"] == "healthy" for item in results),
        "review": sum(item["status"] == "review" for item in results),
        "unreachable": sum(item["status"] == "unreachable" for item in results),
    }

    status_payload = {
        "checked_at": checked_at,
        "summary": summary,
        "businesses": results,
    }
    save_json(STATUS_FILE, status_payload)

    current_links: set[str] = set()
    source_errors: list[str] = []
    with ThreadPoolExecutor(max_workers=min(MAX_WORKERS, len(sources) or 1)) as executor:
        source_futures = {
            executor.submit(scrape_source_links, source): source for source in sources
        }
        for future in as_completed(source_futures):
            source = source_futures[future]
            try:
                current_links.update(future.result())
            except requests.RequestException as exc:
                source_errors.append(f"{source['name']}: {exc}")
            except Exception as exc:
                source_errors.append(f"{source['name']}: unexpected error: {exc}")

    prior_links = set(prior_discovery.get("links", []))
    initialized = bool(prior_discovery.get("initialized"))
    new_links = sorted(current_links - prior_links) if initialized else []

    # Do not erase a valid prior baseline merely because every source timed out.
    links_to_save = sorted(current_links) if current_links else sorted(prior_links)
    save_json(
        DISCOVERED_FILE,
        {
            "initialized": bool(initialized or current_links),
            "checked_at": checked_at,
            "links": links_to_save,
        },
    )

    has_alerts = write_reports(status_payload, new_links, source_errors)
    print(
        json.dumps(
            {
                "checked_at": checked_at,
                "has_alerts": has_alerts,
                "summary": summary,
                "new_links": len(new_links),
                "source_errors": len(source_errors),
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
