from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.repositories.url_repo import URLRepository
from app.repositories.analytics_repo import AnalyticsRepository
from app.schemas.dashboard import DashboardStats, DashboardResponse
from app.schemas.url import URLResponse
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.core.config import settings

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _url_to_response(url, base_url: str) -> URLResponse:
    """Convert ORM URL to URLResponse without mutating the ORM object."""
    base = base_url.rstrip("/")
    effective_code = url.effective_code
    return URLResponse(
        id=url.id,
        user_id=url.user_id,
        original_url=url.original_url,
        short_code=url.short_code,
        custom_alias=url.custom_alias,
        short_url=f"{base}/r/{effective_code}",
        description=url.description,
        category=url.category,
        tags=url.tags or [],
        has_password=bool(url.password_hash),
        click_count=url.click_count,
        expires_at=url.expires_at,
        is_active=url.is_active,
        is_favorite=url.is_favorite,
        is_expired=url.is_expired,
        qr_code_url=f"{base}/urls/{url.id}/qr",
        created_at=url.created_at,
        updated_at=url.updated_at,
    )


@router.get("", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the full dashboard data for the current user."""
    base_url = settings.BASE_URL.rstrip("/")
    url_repo = URLRepository(db)
    analytics_repo = AnalyticsRepository(db)

    user_stats = url_repo.get_user_stats(current_user.id)
    today_clicks = analytics_repo.count_today(current_user.id)
    week_clicks = analytics_repo.count_period(current_user.id, 7)
    month_clicks = analytics_repo.count_period(current_user.id, 30)

    # Recent URLs (last 5), properly serialized
    raw_items, _ = url_repo.get_by_user(current_user.id, skip=0, limit=5)
    recent_urls = [_url_to_response(u, base_url) for u in raw_items]

    # Most popular URL
    popular_items, _ = url_repo.get_by_user(
        current_user.id, skip=0, limit=1, sort_by="click_count", sort_dir="desc"
    )
    most_popular = _url_to_response(popular_items[0], base_url) if popular_items else None

    # Average daily clicks over last 7 days
    daily = analytics_repo.daily_clicks(current_user.id, 7)
    avg_daily = sum(d["clicks"] for d in daily) / max(len(daily), 1)

    stats = DashboardStats(
        total_urls=user_stats["total_urls"],
        total_clicks=user_stats["total_clicks"],
        active_links=user_stats["active_links"],
        expired_links=user_stats["expired_links"],
        qr_codes_generated=user_stats["qr_codes_generated"],
        avg_daily_clicks=round(avg_daily, 2),
        today_clicks=today_clicks,
        this_week_clicks=week_clicks,
        this_month_clicks=month_clicks,
        favorite_urls=user_stats["favorite_urls"],
    )

    return DashboardResponse(
        stats=stats,
        recent_urls=recent_urls,
        most_popular=most_popular,
        recent_activity=[],
    )
