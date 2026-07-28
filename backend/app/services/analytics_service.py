from sqlalchemy.orm import Session
from fastapi import Request
from app.repositories.analytics_repo import AnalyticsRepository
from app.repositories.url_repo import URLRepository
from app.utils.ip_parser import get_client_ip, parse_user_agent, get_language
from app.models.url import URL
from app.models.user import User
from typing import Optional
import httpx


async def get_country_from_ip(ip: str) -> tuple[str, str]:
    """Lookup country and city from IP using ip-api.com (free, no key needed)."""
    if ip in ("127.0.0.1", "::1", "unknown", "testclient"):
        return "Local", "Local"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(f"http://ip-api.com/json/{ip}?fields=country,city,status")
            if resp.status_code == 200:
                data = resp.json()
                if data.get("status") == "success":
                    return data.get("country", "Unknown"), data.get("city", "Unknown")
    except Exception:
        pass
    return "Unknown", "Unknown"


class AnalyticsService:
    def __init__(self, db: Session):
        self.analytics_repo = AnalyticsRepository(db)
        self.url_repo = URLRepository(db)

    async def record_click(self, url: URL, request: Request, user: Optional[User] = None) -> None:
        """Record one analytics event after a successful redirect."""
        ip = get_client_ip(request)
        ua_string = request.headers.get("User-Agent", "")
        ua_info = parse_user_agent(ua_string)
        language = get_language(request)
        referrer = request.headers.get("Referer") or request.headers.get("Referrer")
        country, city = await get_country_from_ip(ip)

        self.analytics_repo.create(
            url_id=url.id,
            user_id=user.id if user else url.user_id,
            ip_address=ip,
            country=country,
            city=city,
            browser=ua_info["browser"],
            device=ua_info["device"],
            operating_system=ua_info["os"],
            language=language,
            referrer=referrer,
        )
        # Increment URL click counter
        self.url_repo.increment_click(url)

    def get_user_analytics(self, user_id: str) -> dict:
        repo = self.analytics_repo
        return {
            "total_clicks": repo.count_by_user(user_id),
            "today_clicks": repo.count_today(user_id),
            "yesterday_clicks": repo.count_period(user_id, 1),
            "this_week_clicks": repo.count_period(user_id, 7),
            "this_month_clicks": repo.count_period(user_id, 30),
            "daily_clicks": repo.daily_clicks(user_id, 30),
            "monthly_clicks": repo.monthly_clicks(user_id, 12),
            "browser_distribution": repo.distribution(user_id, "browser"),
            "device_distribution": repo.distribution(user_id, "device"),
            "os_distribution": repo.distribution(user_id, "operating_system"),
            "top_countries": repo.distribution(user_id, "country"),
            "top_referrers": repo.distribution(user_id, "referrer"),
        }

    def get_url_analytics(self, url_id: str, user_id: str) -> dict:
        url = self.url_repo.get_by_id(url_id)
        if not url or url.user_id != user_id:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="URL not found")

        repo = self.analytics_repo
        records = repo.get_by_url(url_id, limit=200)
        return {
            "url_id": url_id,
            "summary": {
                "total_clicks": len(records),
                "today_clicks": sum(
                    1 for r in records
                    if r.clicked_at.date() == __import__("datetime").date.today()
                ),
                "yesterday_clicks": 0,
                "this_week_clicks": 0,
                "this_month_clicks": 0,
                "daily_clicks": [],
                "monthly_clicks": [],
                "browser_distribution": [],
                "device_distribution": [],
                "os_distribution": [],
                "top_countries": [],
                "top_referrers": [],
            },
            "records": records,
        }
