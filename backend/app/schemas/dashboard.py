from pydantic import BaseModel
from typing import List, Optional
from app.schemas.url import URLResponse


class DashboardStats(BaseModel):
    total_urls: int
    total_clicks: int
    active_links: int
    expired_links: int
    qr_codes_generated: int
    avg_daily_clicks: float
    today_clicks: int
    this_week_clicks: int
    this_month_clicks: int
    favorite_urls: int


class RecentActivity(BaseModel):
    url_id: str
    short_url: str
    original_url: str
    clicks_today: int
    clicked_at: Optional[str] = None


class DashboardResponse(BaseModel):
    stats: DashboardStats
    recent_urls: List[URLResponse]
    most_popular: Optional[URLResponse] = None
    recent_activity: List[RecentActivity]


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    disabled_users: int
    total_urls: int
    today_urls: int
    total_clicks: int
    admin_count: int


class AdminUserItem(BaseModel):
    id: str
    username: str
    email: str
    role: str
    is_active: bool
    url_count: int
    total_clicks: int
    created_at: str

    model_config = {"from_attributes": True}


class AdminDashboardResponse(BaseModel):
    stats: AdminStats
    top_users: List[AdminUserItem]
    recent_urls: List[URLResponse]
